"""
SEJAM Settlement Client
"""
import json
import urllib.request

from django.conf import settings
from django.core.exceptions import ValidationError

from .base import BasePaymentClient


class SejamClient(BasePaymentClient):
    def __init__(self):
        self.enabled = getattr(settings, "SEJAM_ENABLED", False)
        self.base_url = getattr(settings, "SEJAM_BASE_URL", "")
        self.api_key = getattr(settings, "SEJAM_API_KEY", "")
        self.timeout = getattr(settings, "SEJAM_TIMEOUT_SECONDS", 20)

    def settle_profit(
        self, *, national_code: str, amount: str,
        payout_item_id: str, description: str,
    ) -> dict:
        if not self.enabled:
            raise ValidationError("سرویس سجام غیرفعال است.")
        if not self.base_url or not self.api_key:
            raise ValidationError("تنظیمات سجام ناقص است.")
        if not national_code:
            raise ValidationError("کد ملی برای تسویه از طریق سجام الزامی است.")

        payload = json.dumps({
            "payout_id": payout_item_id,
            "national_code": national_code,
            "amount": amount,
            "description": description,
        }).encode("utf-8")

        req = urllib.request.Request(
            url=f"{self.base_url.rstrip('/')}/payouts/profit/settle",
            data=payload,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8") or "{}")
        except Exception as exc:
            raise ValidationError(f"خطا در تسویه سجام: {exc}") from exc

        ref = data.get("settlement_reference") or data.get("reference_id")
        if not ref:
            raise ValidationError(f"پاسخ سجام شناسه تسویه ندارد: {data}")

        return {"status": "settled", "settlement_reference": str(ref), "raw": data}
