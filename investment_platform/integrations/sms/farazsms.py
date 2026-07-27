"""
فرازپیامک — REST API.
"""
import json
import urllib.error
import urllib.request

from django.conf import settings

from .base import BaseSMSProvider, SMSProviderError, SMSSendResult


class FarazSMSProvider(BaseSMSProvider):
    provider_name = "farazsms"

    def __init__(self):
        self.base_url = getattr(settings, "SMS_FARAZSMS_BASE_URL", "").rstrip("/")
        self.api_key = getattr(settings, "SMS_FARAZSMS_API_KEY", "")
        self.sender = getattr(settings, "SMS_FARAZSMS_SENDER", "")
        if not self.base_url or not self.api_key or not self.sender:
            raise SMSProviderError("تنظیمات فرازپیامک کامل نیست.")

    def send_otp(self, *, phone_number: str, code: str) -> SMSSendResult:
        payload = {"to": [phone_number], "from": self.sender, "text": f"کد تایید شما: {code}"}
        req = urllib.request.Request(
            url=f"{self.base_url}/messages/send",
            data=json.dumps(payload).encode("utf-8"),
            method="POST",
            headers={"Content-Type": "application/json", "x-api-key": self.api_key},
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                result = json.loads(resp.read().decode("utf-8") or "{}")
        except urllib.error.HTTPError as exc:
            raise SMSProviderError(f"فرازپیامک خطا داد: {exc}") from exc
        except urllib.error.URLError as exc:
            raise SMSProviderError(f"ارتباط با فرازپیامک برقرار نشد: {exc}") from exc
        return SMSSendResult(provider=self.provider_name, status="sent", raw=result)