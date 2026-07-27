"""
درگاه پرداخت زرین‌پال (API v4) — رایج‌ترین درگاه پرداخت ایرانی.
مستندات: https://docs.zarinpal.com/paymentGateway/
"""
import json
import urllib.error
import urllib.request

from .base import BasePaymentGateway, PaymentGatewayError, PaymentRequestResult, PaymentVerifyResult


class ZarinpalGateway(BasePaymentGateway):
    gateway_name = "ZARINPAL"
    SANDBOX_BASE = "https://sandbox.zarinpal.com/pg/v4/payment"
    PROD_BASE = "https://payment.zarinpal.com/pg/v4/payment"
    STARTPAY_SANDBOX = "https://sandbox.zarinpal.com/pg/StartPay/"
    STARTPAY_PROD = "https://payment.zarinpal.com/pg/StartPay/"

    def __init__(self, merchant_id: str, sandbox: bool = True):
        if not merchant_id:
            raise PaymentGatewayError("Merchant ID زرین‌پال تنظیم نشده است.")
        self.merchant_id = merchant_id
        self.base = self.SANDBOX_BASE if sandbox else self.PROD_BASE
        self.startpay = self.STARTPAY_SANDBOX if sandbox else self.STARTPAY_PROD

    def _post(self, path: str, payload: dict) -> dict:
        req = urllib.request.Request(
            url=f"{self.base}/{path}",
            data=json.dumps(payload).encode("utf-8"),
            method="POST",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode("utf-8") or "{}")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8") if exc.fp else str(exc)
            raise PaymentGatewayError(f"زرین‌پال خطا داد ({exc.code}): {detail}") from exc
        except urllib.error.URLError as exc:
            raise PaymentGatewayError(f"ارتباط با زرین‌پال برقرار نشد: {exc}") from exc

    def request_payment(self, *, amount, description, callback_url, mobile=""):
        payload = {"merchant_id": self.merchant_id, "amount": amount, "description": description, "callback_url": callback_url}
        if mobile:
            payload["metadata"] = {"mobile": mobile}
        response = self._post("request.json", payload)
        data = response.get("data") or {}
        if data.get("code") != 100:
            raise PaymentGatewayError(f"درخواست پرداخت ناموفق: {response.get('errors') or data}")
        return PaymentRequestResult(authority=data["authority"], payment_url=f"{self.startpay}{data['authority']}")

    def verify_payment(self, *, amount, authority):
        response = self._post("verify.json", {"merchant_id": self.merchant_id, "amount": amount, "authority": authority})
        data = response.get("data") or {}
        if data.get("code") not in (100, 101):
            raise PaymentGatewayError(f"تایید پرداخت ناموفق: {response.get('errors') or data}")
        return PaymentVerifyResult(ref_id=str(data.get("ref_id")), card_pan=data.get("card_pan"), already_verified=(data.get("code") == 101))