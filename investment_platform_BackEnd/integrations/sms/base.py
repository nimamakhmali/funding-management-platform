"""
Base SMS Client و Factory
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from django.conf import settings
from shared.exceptions import ExternalServiceError


class SMSProviderError(ExternalServiceError):
    default_message = "ارسال پیامک با خطا مواجه شد."


class SMSSendResult:
    def __init__(self, *, provider: str, status: str, raw: dict | None = None):
        self.provider = provider
        self.status = status
        self.raw = raw or {}

    def as_dict(self) -> dict:
        return {"provider": self.provider, "status": self.status, "raw": self.raw}


class BaseSMSProvider(ABC):
    provider_name: str = "base"

    @abstractmethod
    def send_otp(self, *, phone_number: str, code: str) -> SMSSendResult:
        ...


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
