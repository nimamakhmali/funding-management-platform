"""
EncryptedCharField: رمزنگاری در سطح دیتابیس (at-rest) برای فیلدهای حساس غیر یکتا
مثل شماره شبا. طبق OWASP ASVS L2 - حفاظت از داده‌های حساس در حالت ذخیره.
"""
from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings
from django.db import models


def _get_fernet() -> Fernet:
    key = getattr(settings, "FIELD_ENCRYPTION_KEY", "")
    if not key:
        raise ValueError(
            "FIELD_ENCRYPTION_KEY تنظیم نشده است:\n"
            "python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
        )
    return Fernet(key.encode() if isinstance(key, str) else key)


class EncryptedCharField(models.CharField):
    def get_prep_value(self, value):
        if not value:
            return value
        return _get_fernet().encrypt(str(value).encode()).decode()

    def from_db_value(self, value, expression, connection):
        if not value:
            return value
        try:
            return _get_fernet().decrypt(value.encode()).decode()
        except InvalidToken:
            return value

    def to_python(self, value):
        return value