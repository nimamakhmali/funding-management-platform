"""
Django ORM Models برای سرمایه‌گذاری و کیف پول
"""
import uuid
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class TransactionType(models.TextChoices):
    DEPOSIT = "DEPOSIT", "واریز"
    WITHDRAWAL = "WITHDRAWAL", "برداشت"
    INVESTMENT_BLOCK = "INVESTMENT_BLOCK", "بلاک سرمایه‌گذاری"
    INVESTMENT_CONFIRM = "INVESTMENT_CONFIRM", "تأیید سرمایه‌گذاری"
    INVESTMENT_REFUND = "INVESTMENT_REFUND", "بازگشت سرمایه"
    PROFIT = "PROFIT", "واریز سود"


class InvestmentStatus(models.TextChoices):
    PENDING = "PENDING", "در انتظار پرداخت"
    CONFIRMED = "CONFIRMED", "تأیید شده"
    FAILED = "FAILED", "ناموفق"
    REFUNDED = "REFUNDED", "بازگشت داده شده"


class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(
        max_digits=18, decimal_places=2, default=Decimal("0"),
        validators=[MinValueValidator(Decimal("0"))],
    )
    blocked_amount = models.DecimalField(
        max_digits=18, decimal_places=2, default=Decimal("0"),
        validators=[MinValueValidator(Decimal("0"))],
    )
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "wallets"

    def __str__(self):
        return f"Wallet({self.user_id})"

    @property
    def available_balance(self) -> Decimal:
        return self.balance - self.blocked_amount

    def can_withdraw(self, amount: Decimal) -> bool:
        return self.available_balance >= amount


class Transaction(models.Model):
    """Append-Only Ledger"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    type = models.CharField(max_length=30, choices=TransactionType.choices, db_index=True)
    reference_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    description = models.CharField(max_length=500, blank=True)
    is_successful = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "transactions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "type"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def delete(self, *args, **kwargs):
        raise PermissionError("حذف تراکنش مجاز نیست.")

    def __str__(self):
        return f"TX({self.type}, {self.amount})"


class Investment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investor = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="investments", db_index=True,
    )
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="investments", db_index=True,
    )
    amount = models.DecimalField(
        max_digits=15, decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    status = models.CharField(
        max_length=20, choices=InvestmentStatus.choices,
        default=InvestmentStatus.PENDING, db_index=True,
    )
    reference_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "investments"
        constraints = [
            models.UniqueConstraint(
                fields=["investor", "project"],
                condition=models.Q(status__in=["PENDING", "CONFIRMED"]),
                name="unique_active_investment_per_project",
            )
        ]
        indexes = [
            models.Index(fields=["investor", "project"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Investment({self.investor_id}, {self.project_id}, {self.amount})"
