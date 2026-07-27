import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class ProfitPeriodStatus(models.TextChoices):
    CALCULATING = "CALCULATING", "در حال محاسبه"
    APPROVED = "APPROVED", "تایید شده"
    DISTRIBUTED = "DISTRIBUTED", "توزیع شده"


class PayoutItemStatus(models.TextChoices):
    PENDING = "PENDING", "در انتظار"
    PAID_TO_WALLET = "PAID_TO_WALLET", "واریز به کیف پول"
    SETTLED_SEJAM = "SETTLED_SEJAM", "تسویه‌شده از طریق سجام"


class ProfitPeriod(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="profit_periods", db_index=True)
    title = models.CharField(max_length=255)
    calculation_date = models.DateTimeField()
    total_profit_amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=16, choices=ProfitPeriodStatus.choices, default=ProfitPeriodStatus.CALCULATING, db_index=True)
    distributed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "profit_periods"
        indexes = [models.Index(fields=["project"]), models.Index(fields=["status"])]

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class PayoutItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    period = models.ForeignKey(ProfitPeriod, on_delete=models.CASCADE, related_name="payout_items", db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="payout_items", db_index=True)
    investment = models.ForeignKey("investments.Investment", on_delete=models.PROTECT, null=True, blank=True, related_name="payout_items")
    transaction = models.ForeignKey("investments.Transaction", on_delete=models.PROTECT, null=True, blank=True, related_name="payout_items")
    amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=24, choices=PayoutItemStatus.choices, default=PayoutItemStatus.PENDING, db_index=True)
    settlement_reference = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payout_items"
        indexes = [models.Index(fields=["period"]), models.Index(fields=["user"]), models.Index(fields=["status"])]

    def __str__(self):
        return f"PayoutItem({self.period_id}, {self.user_id}, {self.amount})"