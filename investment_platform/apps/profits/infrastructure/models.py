"""
Django ORM Models برای توزیع سود
"""
import uuid
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class ProfitPeriodStatus(models.TextChoices):
    CALCULATING = "CALCULATING", "در حال محاسبه"
    APPROVED = "APPROVED", "تأیید شده"
    DISTRIBUTED = "DISTRIBUTED", "توزیع شده"


class PayoutItemStatus(models.TextChoices):
    PENDING = "PENDING", "در انتظار"
    PAID_TO_WALLET = "PAID_TO_WALLET", "واریز به کیف پول"
    SETTLED_SEJAM = "SETTLED_SEJAM", "تسویه سجام"


class ProfitPeriod(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="profit_periods"
    )
    title = models.CharField(max_length=255)
    calculation_date = models.DateTimeField()
    total_profit_amount = models.DecimalField(
        max_digits=18, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))]
    )
    status = models.CharField(
        max_length=16, choices=ProfitPeriodStatus.choices,
        default=ProfitPeriodStatus.CALCULATING, db_index=True,
    )
    distributed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "profit_periods"
        ordering = ["-calculation_date"]
        indexes = [
            models.Index(fields=["project", "status"]),
        ]

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class PayoutItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    period = models.ForeignKey(ProfitPeriod, on_delete=models.CASCADE, related_name="payout_items")
    investor = models.ForeignKey(
        "users.User", on_delete=models.PROTECT, related_name="payout_items"
    )
    investment = models.ForeignKey(
        "investments.Investment", on_delete=models.PROTECT,
        related_name="payout_items", null=True, blank=True,
    )
    transaction = models.ForeignKey(
        "investments.Transaction", on_delete=models.PROTECT,
        related_name="payout_items", null=True, blank=True,
    )
    amount = models.DecimalField(
        max_digits=18, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))]
    )
    status = models.CharField(
        max_length=24, choices=PayoutItemStatus.choices,
        default=PayoutItemStatus.PENDING, db_index=True,
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "payout_items"
        indexes = [
            models.Index(fields=["period", "status"]),
            models.Index(fields=["investor"]),
        ]

    def __str__(self):
        return f"Payout({self.investor_id}, {self.amount})"
