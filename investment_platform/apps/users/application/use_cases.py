"""
Use Cases کاربران
"""
from __future__ import annotations
import random
from datetime import timedelta

from django.conf import settings
from django.db import transaction as db_transaction
from django.utils import timezone

from shared.exceptions import InvalidOTP, OTPMaxAttemptsExceeded, ResourceNotFound
from apps.users.infrastructure.models import OTPCode, OTPPurpose, User
from integrations.sms.base import get_sms_client


class CreateOTPUseCase:
    """UC: ایجاد و ارسال کد OTP"""

    def execute(self, *, user: User, purpose: str = OTPPurpose.LOGIN) -> OTPCode:
        # غیرفعال کردن کدهای قبلی
        OTPCode.objects.filter(
            user=user, purpose=purpose, is_used=False
        ).update(is_used=True)

        code = f"{random.SystemRandom().randint(0, 999_999):06d}"
        ttl = getattr(settings, "OTP_TTL_MINUTES", 5)

        otp = OTPCode.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=ttl),
        )

        # ارسال SMS
        if user.phone_number and getattr(settings, "SMS_ENABLED", False):
            try:
                get_sms_client().send_otp(phone_number=user.phone_number, code=code)
            except Exception:
                pass  # لاگ شود ولی OTP ایجاد بماند

        return otp


class VerifyOTPUseCase:
    """UC: اعتبارسنجی کد OTP"""

    def execute(self, *, user: User, code: str, purpose: str = OTPPurpose.LOGIN) -> bool:
        now = timezone.now()
        otp = (
            OTPCode.objects
            .filter(user=user, purpose=purpose, is_used=False, expires_at__gte=now)
            .order_by("-created_at")
            .first()
        )

        if not otp:
            raise InvalidOTP()

        return otp.check_code(code)
