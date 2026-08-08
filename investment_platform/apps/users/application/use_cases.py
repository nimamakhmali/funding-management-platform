from __future__ import annotations
import random
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.notifications.application.use_cases import log_action
from apps.users.domain.exceptions import OTPAttemptsExceeded, OTPCooldownActive, OTPInvalidOrExpired, UserAlreadyExists, UserNotFound, ProfileAlreadyCompleted
from apps.users.infrastructure.models import OTPPurpose, User, UserProfile
from apps.users.infrastructure.repositories import OTPRepository, UserRepository
from integrations.sms import SMSProviderError, get_sms_provider

from .dtos import RegisterUserDTO, ResetPasswordDTO, UpdateProfileDTO, CompleteIndividualProfileDTO, CompleteLegalEntityProfileDTO

_user_repo = UserRepository()
_otp_repo = OTPRepository()


class RegisterUserUseCase:
    def execute(self, dto: RegisterUserDTO) -> User:
        if _user_repo.exists_by_phone(dto.phone_number):
            raise UserAlreadyExists()
        with transaction.atomic():
            username = f"user_{dto.phone_number.replace('+', '')}"
            temp_password = User.objects.make_random_password()
            user = _user_repo.create_user(
                username=username, phone_number=dto.phone_number, password=temp_password,
                role=dto.role,
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


class ResetPasswordUseCase:
    def execute(self, dto: ResetPasswordDTO) -> User:
        user = _user_repo.get_by_phone(dto.phone_number)
        if not user:
            raise UserNotFound()

        is_valid = verify_otp.execute(user=user, code=dto.code, purpose=OTPPurpose.RESET_PASSWORD)
        if not is_valid:
            raise OTPInvalidOrExpired()

        user.set_password(dto.new_password)
        user.save(update_fields=["password"])
        return user


class CompleteIndividualProfileUseCase:
    def execute(self, dto: CompleteIndividualProfileDTO) -> UserProfile:
        user = _user_repo.get_by_phone(dto.phone_number)
        if not user:
            raise UserNotFound()

        profile = _user_repo.get_or_create_profile(user)
        if profile.profile_type:
            raise ProfileAlreadyCompleted()

        if dto.password != dto.password_confirm:
            raise WeakPassword()

        with transaction.atomic():
            user.set_password(dto.password)
            user.email = dto.email
            user.national_code = dto.national_id
            user.save(update_fields=["password", "email", "national_code"])

            profile.profile_type = UserProfile.ProfileType.INDIVIDUAL
            profile.first_name = dto.first_name
            profile.last_name = dto.last_name
            profile.date_of_birth = dto.date_of_birth
            profile.contact_number = dto.contact_number
            profile.save()

        return profile


class CompleteLegalEntityProfileUseCase:
    def execute(self, dto: CompleteLegalEntityProfileDTO) -> UserProfile:
        user = _user_repo.get_by_phone(dto.phone_number)
        if not user:
            raise UserNotFound()

        profile = _user_repo.get_or_create_profile(user)
        if profile.profile_type:
            raise ProfileAlreadyCompleted()

        if dto.password != dto.password_confirm:
            raise WeakPassword()

        with transaction.atomic():
            user.set_password(dto.password)
            user.email = dto.email
            user.save(update_fields=["password", "email"])

            profile.profile_type = UserProfile.ProfileType.LEGAL_ENTITY
            profile.entity_type = dto.entity_type
            profile.company_name_persian = dto.company_name_persian
            profile.company_name_latin = dto.company_name_latin
            profile.ceo_name = dto.ceo_name
            profile.surname = dto.surname
            profile.country = dto.country
            profile.province = dto.province
            profile.postal_code = dto.postal_code
            profile.contact_number = dto.contact_number
            profile.save()

        return profile


register_user = RegisterUserUseCase()
update_profile = UpdateProfileUseCase()
create_otp = CreateOTPUseCase()
verify_otp = VerifyOTPUseCase()
reset_password = ResetPasswordUseCase()
complete_individual_profile = CompleteIndividualProfileUseCase()
complete_legal_entity_profile = CompleteLegalEntityProfileUseCase()