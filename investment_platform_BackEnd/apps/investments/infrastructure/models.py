import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from shared.fields import EncryptedCharField


class InvestmentStatus(models.TextChoices):
    PENDING_PAYMENT = "PENDING_PAYMENT", "در انتظار پرداخت"
    SUCCESSFUL = "SUCCESSFUL", "موفق"
    FAILED = "FAILED", "ناموفق"
    REFUNDED = "REFUNDED", "مرجوع شده"


class Investment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                  related_name="investments", db_index=True)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE,
                                 related_name="investments", db_index=True)
    amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    invest_date = models.DateTimeField(auto_now_add=True, db_index=True)
    status = models.CharField(max_length=20, choices=InvestmentStatus.choices,
                               default=InvestmentStatus.PENDING_PAYMENT, db_index=True)
    contract_file_url = models.URLField(max_length=500, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "investments"
        indexes = [
            models.Index(fields=["investor"]), models.Index(fields=["project"]),
            models.Index(fields=["status"]), models.Index(fields=["investor", "project"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["investor", "project"], name="unique_active_investor_project",
                condition=models.Q(status__in=[InvestmentStatus.PENDING_PAYMENT, InvestmentStatus.SUCCESSFUL]),
            )
        ]

    def __str__(self):
        return f"{self.investor.username} -> {self.project.title}: {self.amount}"


class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    blocked_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    version = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "wallets"

    def __str__(self):
        return f"Wallet({self.user_id})"

    @property
    def available_balance(self):
        return self.balance - self.blocked_amount


class TransactionType(models.TextChoices):
    DEPOSIT = "DEPOSIT", "واریز به کیف پول"
    WITHDRAWAL = "WITHDRAWAL", "برداشت از کیف پول"
    INVESTMENT_COMMITMENT = "INVESTMENT_COMMITMENT", "تعهد سرمایه‌گذاری"
    PROFIT = "PROFIT", "واریز سود"
    REFUND = "REFUND", "بازگشت وجه"


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions", db_index=True)
    # رفع باگ حیاتی نسخه قبل: لینک مستقیم به سرمایه‌گذاری (نه lookup بر اساس amount)
    investment = models.ForeignKey(Investment, on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name="ledger_transactions", db_index=True)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    type = models.CharField(max_length=30, choices=TransactionType.choices, db_index=True)
    reference_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    is_successful = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "transactions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "created_at"]), models.Index(fields=["type"]),
            models.Index(fields=["is_successful"]), models.Index(fields=["investment"]),
        ]

    def __str__(self):
        return f"{'✓' if self.is_successful else '✗'} {self.type} {self.amount}"


# --- درگاه پرداخت واقعی (طبق RFP: اتصال به حداقل یک درگاه معتبر داخلی) ---


class PaymentGatewayType(models.TextChoices):
    ZARINPAL = "ZARINPAL", "زرین‌پال"


class PaymentStatus(models.TextChoices):
    PENDING = "PENDING", "در انتظار"
    SUCCESS = "SUCCESS", "موفق"
    FAILED = "FAILED", "ناموفق"
    CANCELED = "CANCELED", "لغو شده"


class PaymentGatewayConfig(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gateway_type = models.CharField(max_length=20, choices=PaymentGatewayType.choices, unique=True)
    merchant_id = EncryptedCharField(max_length=500)
    is_active = models.BooleanField(default=False, db_index=True)
    is_sandbox = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment_gateway_configs"

    def __str__(self):
        return f"{self.gateway_type} ({'فعال' if self.is_active else 'غیرفعال'})"


class PaymentTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payment_transactions")
    gateway = models.CharField(max_length=20, choices=PaymentGatewayType.choices)
    amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(1000)])
    authority = models.CharField(max_length=255, null=True, blank=True, unique=True, db_index=True)
    ref_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    status = models.CharField(max_length=12, choices=PaymentStatus.choices, default=PaymentStatus.PENDING, db_index=True)
    wallet_transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment_transactions"
        indexes = [models.Index(fields=["user"]), models.Index(fields=["status"]), models.Index(fields=["authority"])]