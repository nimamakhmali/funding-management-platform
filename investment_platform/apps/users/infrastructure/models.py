"""
Django ORM Models برای Domain کاربران
"""
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

from shared.exceptions import InvalidOTP, OTPMaxAttemptsExceeded
from shared.fields import EncryptedCharField
from shared.validators import validate_iranian_national_code


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "ادمین"
    INVESTOR = "INVESTOR", "سرمایه‌گذار"
    ENTREPRENEUR = "ENTREPRENEUR", "کارآفرین"
    PROJECT_OWNER = "PROJECT_OWNER", "صاحب طرح"  # legacy


class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("شماره موبایل الزامی است.")
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault("role", UserRole.ADMIN)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("role") != UserRole.ADMIN:
            raise ValueError("Superuser باید نقش ADMIN داشته باشد.")
        return self.create_user(phone_number, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True, db_index=True)
    email = models.EmailField(max_length=254, null=True, blank=True, db_index=True)
    phone_number = models.CharField(
        max_length=20, unique=True, db_index=True,
        validators=[RegexValidator(regex=r"^\+98\d{10}$", message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد.")],
    )
    
    national_code = models.CharField(
        max_length=10, unique=True, null=True, blank=True,
        validators=[validate_iranian_national_code],  # چک‌سام واقعی، نه فقط تعداد رقم
    )
    role = models.CharField(
        max_length=20, choices=UserRole.choices,
        default=UserRole.INVESTOR, db_index=True,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    phone_verified = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["phone_number"]),
            models.Index(fields=["username"]),
            models.Index(fields=["role"]),
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        return f"{self.username} ({self.phone_number})"

    @property
    def is_admin(self) -> bool:
        return self.is_staff or self.role == UserRole.ADMIN

    @property
    def is_entrepreneur(self) -> bool:
        return self.role in {UserRole.ENTREPRENEUR, UserRole.PROJECT_OWNER}


class UserProfile(models.Model):
    class ProfileType(models.TextChoices):
        INDIVIDUAL = "INDIVIDUAL", "حقیقی"
        LEGAL_ENTITY = "LEGAL_ENTITY", "حقوقی"

    class EntityType(models.TextChoices):
        COMPANY = "COMPANY", "شرکت"
        ORGANIZATION = "ORGANIZATION", "سازمان"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_type = models.CharField(max_length=20, choices=ProfileType.choices, db_index=True, null=True, blank=True)

    first_name = models.CharField(max_length=150, null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    contact_number = models.CharField(max_length=20, null=True, blank=True)

    entity_type = models.CharField(max_length=20, choices=EntityType.choices, null=True, blank=True)
    company_name_persian = models.CharField(max_length=255, null=True, blank=True)
    company_name_latin = models.CharField(max_length=255, null=True, blank=True)
    ceo_name = models.CharField(max_length=150, null=True, blank=True)
    surname = models.CharField(max_length=150, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    province = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)

    company_name = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    avatar_url = models.URLField(max_length=500, null=True, blank=True)
    bank_account_number = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"
        indexes = [
            models.Index(fields=["profile_type"]),
        ]

    def __str__(self):
        return f"Profile({self.user.username})"


class OTPPurpose(models.TextChoices):
    LOGIN = "LOGIN", "ورود"
    VERIFY_PHONE = "VERIFY_PHONE", "تایید موبایل"
    RESET_PASSWORD = "RESET_PASSWORD", "بازیابی رمز عبور"
    WITHDRAWAL = "WITHDRAWAL", "تایید برداشت وجه"


class OTPCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otp_codes", db_index=True)
    purpose = models.CharField(max_length=24, choices=OTPPurpose.choices, default=OTPPurpose.LOGIN, db_index=True)
    code = models.CharField(max_length=6)
    attempts = models.PositiveSmallIntegerField(default=0)
    is_used = models.BooleanField(default=False, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    MAX_ATTEMPTS = 3

    class Meta:
        db_table = "otp_codes"
        indexes = [
            models.Index(fields=["user", "purpose", "is_used"]),
            models.Index(fields=["expires_at"]),
        ]

    def __str__(self):
        return f"OTP({self.user.phone_number}, {self.purpose})"

    @property
    def is_valid(self) -> bool:
        return not self.is_used and timezone.now() <= self.expires_at

    def check_code(self, code: str) -> bool:
        if self.attempt_count >= self.MAX_ATTEMPTS:
            self.is_used = True
            self.save(update_fields=["is_used"])
            raise OTPMaxAttemptsExceeded()

        if not self.is_valid:
            raise InvalidOTP()

        if self.code != code:
            self.attempt_count += 1
            self.save(update_fields=["attempt_count"])
            return False

        self.is_used = True
        self.save(update_fields=["is_used"])
        return True

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at