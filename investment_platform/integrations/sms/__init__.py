"""Factory انتخاب پروایدر پیامکی بر اساس settings.SMS_PROVIDER."""
from django.conf import settings

from .base import BaseSMSProvider, SMSProviderError, SMSSendResult
from .farazsms import FarazSMSProvider
from .kavenegar import KavenegarSMSProvider

__all__ = ["get_sms_provider", "BaseSMSProvider", "SMSProviderError", "SMSSendResult"]

_PROVIDERS = {"kavenegar": KavenegarSMSProvider, "farazsms": FarazSMSProvider}


def get_sms_provider() -> BaseSMSProvider:
    name = (getattr(settings, "SMS_PROVIDER", "") or "").lower()
    provider_cls = _PROVIDERS.get(name)
    if not provider_cls:
        raise SMSProviderError(f"پروایدر پیامکی '{name}' پشتیبانی نمی‌شود یا تنظیم نشده.")
    return provider_cls()