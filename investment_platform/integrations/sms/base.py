"""
Base SMS Client و Factory
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from django.conf import settings


class BaseSMSClient(ABC):
    @abstractmethod
    def send_otp(self, *, phone_number: str, code: str) -> dict:
        raise NotImplementedError


class NoOpSMSClient(BaseSMSClient):
    """پیاده‌سازی بدون عملیات - برای محیط توسعه"""
    def send_otp(self, *, phone_number: str, code: str) -> dict:
        return {"status": "skipped", "reason": "sms_disabled"}


def get_sms_client() -> BaseSMSClient:
    """Factory برای انتخاب SMS provider"""
    if not getattr(settings, "SMS_ENABLED", False):
        return NoOpSMSClient()

    provider = getattr(settings, "SMS_PROVIDER", "none").lower()

    if provider == "kavenegar":
        from .kavenegar import KavenegarClient
        return KavenegarClient()
    elif provider == "farazsms":
        from .farazsms import FarazSMSClient
        return FarazSMSClient()

    return NoOpSMSClient()
