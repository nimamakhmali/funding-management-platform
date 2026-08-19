"""
کلاینت تسویه قانونی سود سازگار با سجام. پشتیبانی sync (پاسخ فوری) و async (Webhook).
"""
import json
import urllib.error
import urllib.request
from dataclasses import dataclass

from django.conf import settings

from .base import PaymentGatewayError


@dataclass
class SejamSettlementResult:
    settlement_reference: str
    raw_response: dict


class SejamSettlementClient:
    def __init__(self):
        self.enabled = bool(getattr(settings, "SEJAM_ENABLED", False))
        self.base_url = getattr(settings, "SEJAM_BASE_URL", "").rstrip("/")
        self.api_key = getattr(settings, "SEJAM_API_KEY", "")
        self.timeout = int(getattr(settings, "SEJAM_TIMEOUT_SECONDS", 20))

    def _post(self, path: str, payload: dict, headers: dict) -> dict:
        req = urllib.request.Request(
            url=f"{self.base_url}/{path}",
            data=json.dumps(payload).encode("utf-8"),
            method="POST",
            headers={"Content-Type": "application/json", **headers},
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read().decode("utf-8") or "{}")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8") if exc.fp else str(exc)
            raise PaymentGatewayError(f"سجام خطا داد ({exc.code}): {detail}") from exc
        except urllib.error.URLError as exc:
            raise PaymentGatewayError(f"ارتباط با سجام برقرار نشد: {exc}") from exc

    def settle_profit(self, *, national_code: str, amount: str, payout_item_id: str, period_title: str) -> SejamSettlementResult:
        if not self.enabled:
            raise PaymentGatewayError("اتصال به سجام غیرفعال است (SEJAM_ENABLED=False).")
        if not self.base_url or not self.api_key:
            raise PaymentGatewayError("تنظیمات سجام کامل نیست.")
        if not national_code:
            raise PaymentGatewayError("کد ملی کاربر برای تسویه قانونی الزامی است.")

        callback_url = f"{getattr(settings, 'BACKEND_PUBLIC_BASE_URL', '')}/api/v1/profits/payouts/sejam/callback/"
        payload = {
            "payout_id": payout_item_id, "national_code": national_code, "amount": amount,
            "description": f"Profit settlement - {period_title}", "callback_url": callback_url,
        }
        response = self._post("payouts/profit/settle", payload, headers={"Authorization": f"Bearer {self.api_key}"})
        ref = response.get("settlement_reference") or response.get("reference_id")
        if not ref:
            raise PaymentGatewayError(f"پاسخ سجام فاقد شماره پیگیری است: {response}")
        return SejamSettlementResult(settlement_reference=str(ref), raw_response=response)