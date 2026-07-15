"""
FarazSMS Provider
"""
import json
import urllib.request

from django.conf import settings
from django.core.exceptions import ValidationError

from .base import BaseSMSClient


class FarazSMSClient(BaseSMSClient):
    def send_otp(self, *, phone_number: str, code: str) -> dict:
        base_url = settings.SMS_FARAZSMS_BASE_URL
        api_key = settings.SMS_FARAZSMS_API_KEY
        sender = settings.SMS_FARAZSMS_SENDER

        if not all([base_url, api_key, sender]):
            raise ValidationError("تنظیمات FarazSMS ناقص است.")

        payload = json.dumps({
            "to": [phone_number],
            "from": sender,
            "text": f"کد تأیید شما: {code}",
        }).encode("utf-8")

        req = urllib.request.Request(
            url=f"{base_url.rstrip('/')}/messages/send",
            data=payload,
            method="POST",
            headers={"Content-Type": "application/json", "x-api-key": api_key},
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8") or "{}")
        except Exception as exc:
            raise ValidationError(f"خطا در ارسال SMS از FarazSMS: {exc}") from exc

        return {"status": "sent", "provider": "farazsms", "response": data}
