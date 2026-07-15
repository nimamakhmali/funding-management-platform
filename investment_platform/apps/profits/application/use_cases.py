"""
Use Cases توزیع سود
"""
from __future__ import annotations

from decimal import Decimal, ROUND_DOWN

from django.db import transaction as db_transaction
from django.utils import timezone

from apps.investments.infrastructure.models import (
    Investment,
    InvestmentStatus,
    Transaction,
    TransactionType,
    Wallet,
)
from apps.notifications.application.use_cases import (
    CreateAuditLogUseCase,
    CreateNotificationUseCase,
)
from apps.notifications.infrastructure.models import NotificationType
from apps.profits.infrastructure.models import (
    PayoutItem,
    PayoutItemStatus,
    ProfitPeriod,
    ProfitPeriodStatus,
)
from integrations.payment.sejam import SejamClient
from shared.exceptions import BusinessRuleViolation, PermissionDenied, ResourceNotFound


# apps/profits/application/use_cases.py
# فقط این بخش را جایگزین کنید:

class CalculateProfitDistributionUseCase:
    def execute(self, *, profit_period_id, actor) -> ProfitPeriod:
        if not actor.is_admin:
            raise PermissionDenied()

        with db_transaction.atomic():
            try:
                period = (
                    ProfitPeriod.objects
                    .select_for_update()
                    .select_related("project")
                    .get(pk=profit_period_id)
                )
            except ProfitPeriod.DoesNotExist:
                raise ResourceNotFound("دوره سود")

            if period.status != ProfitPeriodStatus.CALCULATING:
                raise BusinessRuleViolation(
                    "فقط دوره‌های در وضعیت «در حال محاسبه» قابل پردازش‌اند."
                )

            if period.payout_items.exists():
                raise BusinessRuleViolation("این دوره قبلاً محاسبه شده است.")

            investments = list(
                Investment.objects.filter(
                    project=period.project,
                    status=InvestmentStatus.CONFIRMED,
                ).select_related("investor")
            )

            if not investments:
                raise BusinessRuleViolation(
                    "هیچ سرمایه‌گذاری تأیید‌شده‌ای برای این پروژه وجود ندارد."
                )

            total_invested = sum(inv.amount for inv in investments)
            if total_invested <= 0:
                raise BusinessRuleViolation("مجموع سرمایه‌گذاری‌ها صفر است.")

            items = self._build_payout_items(
                investments=investments,
                total_invested=total_invested,
                total_profit=period.total_profit_amount,
                period=period,
            )

            if not items:
                raise BusinessRuleViolation("هیچ آیتم سودی ایجاد نشد.")

            PayoutItem.objects.bulk_create(items)

            period.status = ProfitPeriodStatus.APPROVED
            period.save(update_fields=["status"])

            CreateAuditLogUseCase().execute(
                actor=actor,
                action="PROFIT_CALCULATED",
                entity="ProfitPeriod",
                entity_id=str(period.id),
                description=f"سود دوره «{period.title}» محاسبه شد.",
                metadata={
                    "total_profit": str(period.total_profit_amount),
                    "items_count": len(items),
                },
            )

        return period

    def _build_payout_items(
        self,
        *,
        investments: list,
        total_invested: Decimal,
        total_profit: Decimal,
        period: ProfitPeriod,
    ) -> list[PayoutItem]:
        items = []
        distributed = Decimal("0")
        precision = Decimal("0.01")

        for i, inv in enumerate(investments):
            is_last = (i == len(investments) - 1)

            if is_last:
                # جلوگیری از خطای گرد کردن
                amount = (total_profit - distributed).quantize(precision)
            else:
                ratio = inv.amount / total_invested
                amount = (ratio * total_profit).quantize(
                    precision, rounding=ROUND_DOWN
                )

            if amount <= 0:
                continue

            distributed += amount
            items.append(
                PayoutItem(
                    period=period,
                    investor=inv.investor,
                    investment=inv,
                    amount=amount,
                    status=PayoutItemStatus.PENDING,
                )
            )

        return items

class ApprovePayoutUseCase:
    """UC: واریز سود به کیف پول سرمایه‌گذار"""

    def execute(self, *, payout_item_id, actor) -> PayoutItem:
        if not actor.is_admin:
            raise PermissionDenied()

        with db_transaction.atomic():
            try:
                item = (
                    PayoutItem.objects
                    .select_for_update()
                    .select_related("investor", "period")
                    .get(pk=payout_item_id)
                )
            except PayoutItem.DoesNotExist:
                raise ResourceNotFound("آیتم سود")

            if item.status != PayoutItemStatus.PENDING:
                raise BusinessRuleViolation("این آیتم قبلاً پردازش شده است.")

            wallet = Wallet.objects.select_for_update().get(user=item.investor)
            wallet.balance += item.amount
            wallet.updated_at = timezone.now()
            wallet.save(update_fields=["balance", "updated_at"])

            tx = Transaction(
                user=item.investor,
                amount=item.amount,
                type=TransactionType.PROFIT,
                description=f"سود دوره «{item.period.title}»",
                is_successful=True,
            )
            tx.save()

            item.transaction = tx
            item.status = PayoutItemStatus.PAID_TO_WALLET
            item.paid_at = timezone.now()
            item.save(update_fields=["transaction", "status", "paid_at"])

            CreateNotificationUseCase().execute(
                user=item.investor,
                title="سود دوره واریز شد 💰",
                message=(
                    f"مبلغ {item.amount:,} تومان بابت سود دوره "
                    f"«{item.period.title}» به کیف پول شما واریز شد."
                ),
                notif_type=NotificationType.SUCCESS,
            )

            CreateAuditLogUseCase().execute(
                actor=actor,
                action="PAYOUT_APPROVED",
                entity="PayoutItem",
                entity_id=str(item.id),
                description=f"سود {item.amount} به کیف پول واریز شد.",
            )

        return item


class SettlePayoutWithSejamUseCase:
    """UC: تسویه سود از مسیر قانونی سجام"""

    def execute(self, *, payout_item_id, actor) -> PayoutItem:
        if not actor.is_admin:
            raise PermissionDenied()

        with db_transaction.atomic():
            try:
                item = (
                    PayoutItem.objects
                    .select_for_update()
                    .select_related("investor", "period")
                    .get(pk=payout_item_id)
                )
            except PayoutItem.DoesNotExist:
                raise ResourceNotFound("آیتم سود")

            if item.status == PayoutItemStatus.SETTLED_SEJAM:
                raise BusinessRuleViolation("این آیتم قبلاً از طریق سجام تسویه شده است.")

            if not item.investor.national_code:
                raise BusinessRuleViolation(
                    "کد ملی سرمایه‌گذار برای تسویه از مسیر سجام الزامی است."
                )

            # فراخوانی سرویس سجام
            result = SejamClient().settle_profit(
                national_code=item.investor.national_code,
                amount=str(item.amount),
                payout_item_id=str(item.id),
                description=f"سود دوره «{item.period.title}»",
            )

            # ثبت تراکنش اگر موجود نبود
            if not item.transaction:
                tx = Transaction(
                    user=item.investor,
                    amount=item.amount,
                    type=TransactionType.PROFIT,
                    reference_id=result["settlement_reference"],
                    description=f"تسویه سجام — {item.period.title}",
                    is_successful=True,
                )
                tx.save()
                item.transaction = tx
            else:
                item.transaction.reference_id = result["settlement_reference"]
                item.transaction.save(update_fields=["reference_id"])

            item.status = PayoutItemStatus.SETTLED_SEJAM
            item.paid_at = timezone.now()
            item.save(update_fields=["transaction", "status", "paid_at"])

            CreateNotificationUseCase().execute(
                user=item.investor,
                title="تسویه سجام انجام شد ✅",
                message=(
                    f"سود دوره «{item.period.title}» از مسیر قانونی تسویه شد. "
                    f"کد پیگیری: {result['settlement_reference']}"
                ),
                notif_type=NotificationType.SUCCESS,
            )

            CreateAuditLogUseCase().execute(
                actor=actor,
                action="SEJAM_SETTLEMENT",
                entity="PayoutItem",
                entity_id=str(item.id),
                description="تسویه سجام انجام شد.",
                metadata={"reference": result["settlement_reference"]},
            )

        return item