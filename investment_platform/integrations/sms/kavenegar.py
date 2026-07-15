"""
Kavenegar SMS Provider
"""
import json
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings
from django.core.exceptions import ValidationError

from .base import BaseSMSClient


class KavenegarClient(BaseSMSClient):
    def send_otp(self, *, phone_number: str, code: str) -> dict:
        api_key = settings.SMS_KAVENEGAR_API_KEY
        template = settings.SMS_KAVENEGAR_TEMPLATE

        if not api_key or not template:
            raise ValidationError("تنظیمات Kavenegar ناقص است.")

        url = (
            f"https://api.kavenegar.com/v1/{api_key}/verify/lookup.json?"
            + urllib.parse.urlencode({
                "receptor": phone_number,
                "token": code,
                "template": template,
            })
        )
        req = urllib.request.Request(url=url, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8") or "{}")
        except Exception as exc:
            raise ValidationError(f"خطا در ارسال SMS از Kavenegar: {exc}") from exc

        ret_status = (data.get("return") or {}).get("status")
        if ret_status not in {200, "200"}:
            raise ValidationError(f"Kavenegar درخواست را رد کرد: {data}")

        return {"status": "sent", "provider": "kavenegar"}
