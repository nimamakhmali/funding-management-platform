"""
Django ORM Models برای Domain کاربران
"""
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

from shared.exceptions import InvalidOTP, OTPMaxAttemptsExceeded


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "ادمین"
    INVESTOR = "INVESTOR", "سرمایه‌گذار"
    ENTREPRENEUR = "ENTREPRENEUR", "کارآفرین"
    PROJECT_OWNER = "PROJECT_OWNER", "صاحب طرح"  # legacy


class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, username: str, password: str = None, **extra):
        if not email:
            raise ValueError("ایمیل الزامی است.")
        if not username:
            raise ValueError("نام کاربری الزامی است.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, username: str, password: str = None, **extra):
        extra.setdefault("role", UserRole.ADMIN)
        extra.setdefault("is_active", True)
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, username, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True, db_index=True)
    email = models.EmailField(unique=True, db_index=True)
    phone_number = models.CharField(
        max_length=20, unique=True, null=True, blank=True,
        validators=[RegexValidator(
            regex=r"^(\+98|0)?9\d{9}$",
            message="شماره موبایل معتبر نیست."
        )],
        db_index=True,
    )
    national_code = models.CharField(
        max_length=10, unique=True, null=True, blank=True,
        validators=[RegexValidator(
            regex=r"^\d{10}$",
            message="کد ملی باید ۱۰ رقم باشد."
        )],
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

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["username"]),
            models.Index(fields=["role"]),
        ]

    def __str__(self):
        return f"{self.username} ({self.email})"

    @property
    def is_admin(self) -> bool:
        return self.is_staff or self.role == UserRole.ADMIN

    @property
    def is_entrepreneur(self) -> bool:
        return self.role in {UserRole.ENTREPRENEUR, UserRole.PROJECT_OWNER}


class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    company_name = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    avatar_url = models.URLField(max_length=500, null=True, blank=True)
    bank_account_number = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"

    def __str__(self):
        return f"Profile({self.user.username})"


class OTPPurpose(models.TextChoices):
    LOGIN = "LOGIN", "ورود"
    VERIFY_PHONE = "VERIFY_PHONE", "تأیید موبایل"
    RESET_PASSWORD = "RESET_PASSWORD", "بازیابی رمز عبور"


class OTPCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otp_codes")
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=24, choices=OTPPurpose.choices)
    is_used = models.BooleanField(default=False)
    attempt_count = models.PositiveSmallIntegerField(default=0)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    MAX_ATTEMPTS = 3

    class Meta:
        db_table = "otp_codes"
        indexes = [
            models.Index(fields=["user", "purpose", "is_used"]),
            models.Index(fields=["expires_at"]),
        ]

    def __str__(self):
        return f"OTP({self.user.email}, {self.purpose})"

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
