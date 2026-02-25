"""
Investment Management System (Crowdfunding Platform) - ORM Models
Canonical implementation.

Note:
- This file must contain ONLY ONE implementation per entity name (User, Project, ...).
- Alternative/experimental approaches should live in separate apps/modules, not here.
"""

import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.utils import timezone


# ============================================================================
# ENUMS & CHOICES
# ============================================================================


class UserRole(models.TextChoices):
    """
    User roles (schema values + one legacy value for compatibility).

    Schema: ADMIN, INVESTOR, ENTREPRENEUR
    Legacy: PROJECT_OWNER (kept because some codebases used it historically)
    """

    ADMIN = "ADMIN", "ادمین"
    INVESTOR = "INVESTOR", "سرمایه‌گذار"
    ENTREPRENEUR = "ENTREPRENEUR", "کارآفرین"

    # legacy
    PROJECT_OWNER = "PROJECT_OWNER", "صاحب طرح"


class ProjectStatus(models.TextChoices):
    """
    Project statuses (schema values + extended lifecycle values).
    """

    # schema
    PENDING_REVIEW = "PENDING_REVIEW", "در انتظار بررسی"
    APPROVED = "APPROVED", "تایید شده"
    REJECTED = "REJECTED", "رد شده"
    FUNDING_COMPLETED = "FUNDING_COMPLETED", "تامین مالی تکمیل شد"
    ARCHIVED = "ARCHIVED", "آرشیو شده"

    # extended (optional)
    DRAFT = "DRAFT", "پیش‌نویس"
    VETTING = "VETTING", "در حال بررسی"
    FUNDING = "FUNDING", "در حال جذب سرمایه"
    ACTIVE = "ACTIVE", "فعال/در حال اجرا"
    COMPLETED = "COMPLETED", "تکمیل شده"
    CANCELED = "CANCELED", "لغو شده"


class InvestmentStatus(models.TextChoices):
    """
    Investment statuses (schema values + legacy values).
    """

    # schema
    PENDING_PAYMENT = "PENDING_PAYMENT", "در انتظار پرداخت"
    SUCCESSFUL = "SUCCESSFUL", "موفق"
    FAILED = "FAILED", "ناموفق"
    REFUNDED = "REFUNDED", "مرجوع شده"

    # legacy
    PENDING = "PENDING", "در انتظار پرداخت"
    SUCCESS = "SUCCESS", "موفق"


class TransactionType(models.TextChoices):
    """
    Transaction types (schema values + optional/legacy values).
    """

    # schema
    DEPOSIT = "DEPOSIT", "واریز به کیف پول"
    WITHDRAWAL = "WITHDRAWAL", "برداشت از کیف پول"
    INVESTMENT_COMMITMENT = "INVESTMENT_COMMITMENT", "تعهد سرمایه‌گذاری"

    # optional/extended
    PROFIT = "PROFIT", "واریز سود"
    REFUND = "REFUND", "بازگشت وجه"

    # legacy
    WITHDRAW = "WITHDRAW", "برداشت از کیف پول"
    INVEST = "INVEST", "سرمایه‌گذاری"


class TicketPriority(models.TextChoices):
    LOW = "LOW", "کم"
    MEDIUM = "MEDIUM", "متوسط"
    HIGH = "HIGH", "زیاد"


class TicketStatus(models.TextChoices):
    # schema
    OPEN = "OPEN", "باز"
    IN_PROGRESS = "IN_PROGRESS", "در حال پیگیری"
    CLOSED = "CLOSED", "بسته شده"

    # extended
    USER_REPLIED = "USER_REPLIED", "پاسخ کاربر"
    ADMIN_REPLIED = "ADMIN_REPLIED", "پاسخ ادمین"


# ---- Extra enums you added (kept, but defined only once) --------------------


class ProfitPeriodStatus(models.TextChoices):
    CALCULATING = "CALCULATING", "در حال محاسبه"
    APPROVED = "APPROVED", "تایید شده"
    DISTRIBUTED = "DISTRIBUTED", "توزیع شده"


class DocumentType(models.TextChoices):
    WHITE_PAPER = "WHITE_PAPER", "وایت‌پیپر"
    FINANCIAL_REPORT = "FINANCIAL_REPORT", "گزارش مالی"
    LEGAL = "LEGAL", "حقوقی"


class TransactionStatus(models.TextChoices):
    PENDING = "PENDING", "در انتظار"
    SUCCESS = "SUCCESS", "موفق"
    FAILED = "FAILED", "ناموفق"


class PayoutItemStatus(models.TextChoices):
    PENDING = "PENDING", "در انتظار"
    PAID_TO_WALLET = "PAID_TO_WALLET", "واریز به کیف پول"
    SETTLED_SIAM = "SETTLED_SIAM", "تسویه سیام"


class AuditAction(models.TextChoices):
    LOGIN = "LOGIN", "ورود"
    INVEST = "INVEST", "سرمایه‌گذاری"
    WITHDRAW = "WITHDRAW", "برداشت"


class UserProfileType(models.TextChoices):
    REAL = "REAL", "حقیقی"
    LEGAL = "LEGAL", "حقوقی"


# ============================================================================
# USER MANAGER
# ============================================================================


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not username:
            raise ValueError("The Username field must be set")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("role", UserRole.ADMIN)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("role") != UserRole.ADMIN:
            raise ValueError("Superuser must have ADMIN role")

        return self.create_user(username, email, password, **extra_fields)


# ============================================================================
# MODELS (CANONICAL)
# ============================================================================


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for authentication (canonical).

    Login field: email
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True, db_index=True)
    email = models.EmailField(unique=True, db_index=True)

    phone_number = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        validators=[
            RegexValidator(
                regex=r"^\+?1?\d{9,15}$",
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
            )
        ],
    )

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.INVESTOR,
        db_index=True,
    )

    national_code = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True,
        validators=[
            RegexValidator(regex=r"^\d{10}$", message="National code must be exactly 10 digits.")
        ],
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

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
            models.Index(fields=["national_code"]),
        ]

    def __str__(self):
        return f"{self.username} ({self.email})"


class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile", db_index=True)

    company_name = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    avatar_url = models.URLField(max_length=500, null=True, blank=True)
    bank_account_number = models.CharField(max_length=50, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"

    def __str__(self):
        return f"Profile of {self.user.username}"


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_projects",
        limit_choices_to=models.Q(role__in=[UserRole.ENTREPRENEUR, UserRole.PROJECT_OWNER]),
        db_index=True,
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, db_index=True)

    required_budget = models.DecimalField(
        max_digits=15, decimal_places=2, validators=[MinValueValidator(0)]
    )
    raised_amount = models.DecimalField(
        max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)]
    )
    min_investment_amount = models.DecimalField(
        max_digits=15, decimal_places=2, validators=[MinValueValidator(0)]
    )

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=ProjectStatus.choices,
        default=ProjectStatus.PENDING_REVIEW,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        indexes = [
            models.Index(fields=["owner"]),
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["start_date", "end_date"]),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(end_date__gt=models.F("start_date")), name="project_end_after_start"),
            models.CheckConstraint(
                check=models.Q(raised_amount__lte=models.F("required_budget")),
                name="raised_not_exceed_required",
            ),
        ]

    def __str__(self):
        return f"{self.title} by {self.owner.username}"

    @property
    def funding_percentage(self):
        if self.required_budget and self.required_budget > 0:
            return (self.raised_amount / self.required_budget) * 100
        return 0

    @property
    def is_funding_complete(self):
        return self.raised_amount >= self.required_budget


class Investment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="investments",
        limit_choices_to={"role": UserRole.INVESTOR},
        db_index=True,
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="investments", db_index=True)

    amount = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(0)])
    invest_date = models.DateTimeField(default=timezone.now, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=InvestmentStatus.choices,
        default=InvestmentStatus.PENDING_PAYMENT,
        db_index=True,
    )
    contract_file_url = models.URLField(max_length=500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "investments"
        indexes = [
            models.Index(fields=["investor"]),
            models.Index(fields=["project"]),
            models.Index(fields=["status"]),
            models.Index(fields=["invest_date"]),
            models.Index(fields=["investor", "project"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["investor", "project"],
                name="unique_investor_project",
                condition=models.Q(status__in=[InvestmentStatus.PENDING_PAYMENT, InvestmentStatus.SUCCESSFUL]),
            )
        ]

    def __str__(self):
        return f"{self.investor.username} invested {self.amount} in {self.project.title}"


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions", db_index=True)

    # Positive for deposit, negative for withdrawal/invest
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    type = models.CharField(max_length=30, choices=TransactionType.choices, db_index=True)
    reference_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    is_successful = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "transactions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["type"]),
            models.Index(fields=["is_successful"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["reference_id"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self):
        status = "✓" if self.is_successful else "✗"
        return f"{status} {self.type} - {self.amount} by {self.user.username}"


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents", db_index=True)

    # Set null for logs/attachments (keep doc even if uploader removed)
    uploader = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="uploaded_documents",
        null=True,
        blank=True,
        db_index=True,
    )

    file_path = models.CharField(max_length=500)
    file_type = models.CharField(max_length=100)
    title = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "documents"
        indexes = [
            models.Index(fields=["project"]),
            models.Index(fields=["uploader"]),
        ]

    def __str__(self):
        return f"{self.title} - {self.project.title}"


class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets", db_index=True)

    subject = models.CharField(max_length=255)
    priority = models.CharField(
        max_length=10, choices=TicketPriority.choices, default=TicketPriority.MEDIUM, db_index=True
    )
    status = models.CharField(
        max_length=15, choices=TicketStatus.choices, default=TicketStatus.OPEN, db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tickets"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return f"Ticket #{self.id} - {self.subject} ({self.status})"


# ============================================================================
# Wallet & Profit Distribution (Admin-manageable)
# ============================================================================


class Wallet(models.Model):
    """
    Simple wallet ledger snapshot.
    Admin can adjust balances; application services should normally update this atomically.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet", db_index=True)

    balance = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    blocked_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    version = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "wallets"
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["updated_at"]),
        ]

    def __str__(self):
        return f"Wallet({self.user_id})"

    @property
    def available_balance(self):
        return self.balance - self.blocked_amount


class ProfitPeriod(models.Model):
    """
    Profit distribution period for a project (e.g., Q1 1404).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="profit_periods", db_index=True)

    title = models.CharField(max_length=255)
    calculation_date = models.DateTimeField()
    total_profit_amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(
        max_length=16,
        choices=ProfitPeriodStatus.choices,
        default=ProfitPeriodStatus.CALCULATING,
        db_index=True,
    )
    distributed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "profit_periods"
        indexes = [
            models.Index(fields=["project"]),
            models.Index(fields=["status"]),
            models.Index(fields=["calculation_date"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class PayoutItem(models.Model):
    """
    Profit payout item per user (usually linked to an investment).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    period = models.ForeignKey(ProfitPeriod, on_delete=models.CASCADE, related_name="payout_items", db_index=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="payout_items", db_index=True)

    investment = models.ForeignKey(
        Investment,
        on_delete=models.PROTECT,
        related_name="payout_items",
        null=True,
        blank=True,
        db_index=True,
    )
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.PROTECT,
        related_name="payout_items",
        null=True,
        blank=True,
        db_index=True,
    )

    amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(
        max_length=24,
        choices=PayoutItemStatus.choices,
        default=PayoutItemStatus.PENDING,
        db_index=True,
    )

    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "payout_items"
        indexes = [
            models.Index(fields=["period"]),
            models.Index(fields=["user"]),
            models.Index(fields=["investment"]),
            models.Index(fields=["transaction"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"PayoutItem({self.period_id}, {self.user_id}, {self.amount})"


