"""
کاوه‌نگار — پرکاربردترین سرویس پیامکی ایران برای OTP (Lookup/Verify API).
مستندات: https://kavenegar.com/rest.html
"""
import json
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings

from .base import BaseSMSProvider, SMSProviderError, SMSSendResult


class KavenegarSMSProvider(BaseSMSProvider):
    provider_name = "kavenegar"

    def __init__(self):
        self.api_key = getattr(settings, "SMS_KAVENEGAR_API_KEY", "")
        self.template = getattr(settings, "SMS_KAVENEGAR_TEMPLATE", "verify")
        if not self.api_key or not self.template:
            raise SMSProviderError("تنظیمات کاوه‌نگار (API Key/Template) کامل نیست.")

    def send_otp(self, *, phone_number: str, code: str) -> SMSSendResult:
        base = f"https://api.kavenegar.com/v1/{self.api_key}/verify/lookup.json"
        query = urllib.parse.urlencode({"receptor": phone_number, "token": code, "template": self.template})
        try:
            with urllib.request.urlopen(urllib.request.Request(f"{base}?{query}"), timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8") or "{}")
        except urllib.error.URLError as exc:
            raise SMSProviderError(f"ارتباط با کاوه‌نگار برقرار نشد: {exc}") from exc

        if (((data or {}).get("return") or {}).get("status")) not in (200, "200"):
            raise SMSProviderError(f"کاوه‌نگار درخواست را رد کرد: {data}")
        return SMSSendResult(provider=self.provider_name, status="sent", raw=data)