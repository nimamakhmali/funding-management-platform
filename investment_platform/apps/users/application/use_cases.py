from __future__ import annotations
import random
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.notifications.application.use_cases import log_action
from apps.users.domain.exceptions import OTPAttemptsExceeded, OTPCooldownActive, OTPInvalidOrExpired, UserAlreadyExists
from apps.users.infrastructure.models import OTPPurpose, User, UserProfile
from apps.users.infrastructure.repositories import OTPRepository, UserRepository
from integrations.sms import SMSProviderError, get_sms_provider

from .dtos import RegisterUserDTO, UpdateProfileDTO

_user_repo = UserRepository()
_otp_repo = OTPRepository()


class RegisterUserUseCase:
    def execute(self, dto: RegisterUserDTO) -> User:
        if _user_repo.exists_email_or_phone(dto.email, dto.phone_number):
            raise UserAlreadyExists()
        with transaction.atomic():
            user = _user_repo.create_user(
                username=dto.username, email=dto.email, password=dto.password,
                phone_number=dto.phone_number, role=dto.role,
            )
            _user_repo.get_or_create_profile(user)
            log_action.execute(actor=user, action="USER_REGISTERED", entity="User", entity_id=str(user.id))
        return user


class UpdateProfileUseCase:
    def execute(self, *, user: User, dto: UpdateProfileDTO) -> UserProfile:
        profile = _user_repo.get_or_create_profile(user)
        for field in ("company_name", "address", "bio", "avatar_url", "bank_account_sheba"):
            value = getattr(dto, field)
            if value is not None:
                setattr(profile, field, value)
        profile.save()
        return profile


class CreateOTPUseCase:
    """ارسال OTP واقعی از طریق سرویس پیامکی ایرانی، با Cooldown ضد اسپم/هزینه اضافه."""

    def execute(self, *, user: User, purpose: str = OTPPurpose.LOGIN):
        ttl = getattr(settings, "OTP_TTL_MINUTES", 2)
        cooldown = getattr(settings, "OTP_RESEND_COOLDOWN_SECONDS", 60)

        recent = _otp_repo.get_latest_any(user, purpose)
        if recent and (timezone.now() - recent.created_at).total_seconds() < cooldown:
            raise OTPCooldownActive(f"لطفاً {cooldown} ثانیه صبر کنید و دوباره تلاش کنید.")

        code = f"{random.randint(0, 999999):06d}"
        otp = _otp_repo.create(user=user, purpose=purpose, code=code,
                                expires_at=timezone.now() + timedelta(minutes=ttl))

        if user.phone_number and getattr(settings, "SMS_ENABLED", False):
            try:
                result = get_sms_provider().send_otp(phone_number=user.phone_number, code=code)
                log_action.execute(actor=user, action="OTP_SENT", entity="OTPCode",
                                    entity_id=str(otp.id), metadata=result.as_dict())
            except SMSProviderError as exc:
                log_action.execute(actor=user, action="OTP_SEND_FAILED", entity="OTPCode",
                                    entity_id=str(otp.id), description=str(exc))
        return otp


class VerifyOTPUseCase:
    """تأیید OTP با محدودیت تعداد تلاش (Brute-force protection) طبق ASVS L2."""

    def execute(self, *, user: User, code: str, purpose: str = OTPPurpose.LOGIN) -> bool:
        otp = _otp_repo.get_latest_active(user, purpose)
        if not otp:
            raise OTPInvalidOrExpired()

        max_attempts = getattr(settings, "OTP_MAX_ATTEMPTS", 5)
        if otp.attempts >= max_attempts:
            otp.is_used = True
            otp.save(update_fields=["is_used"])
            raise OTPAttemptsExceeded()

        if otp.code != code:
            otp.attempts += 1
            otp.save(update_fields=["attempts"])
            return False

        otp.is_used = True
        otp.save(update_fields=["is_used"])
        if purpose == OTPPurpose.VERIFY_PHONE:
            user.phone_verified = True
            user.save(update_fields=["phone_verified"])
        return True


register_user = RegisterUserUseCase()
update_profile = UpdateProfileUseCase()
create_otp = CreateOTPUseCase()
verify_otp = VerifyOTPUseCase()