from __future__ import annotations

from decimal import Decimal

from django.db import transaction
from django.db.models import Sum

from django.utils import timezone


from apps.investments.infrastructure.models import Investment, InvestmentStatus, Transaction as WalletTransaction, TransactionType, Wallet
from apps.notifications.application.use_cases import create_notification, log_action
from apps.notifications.infrastructure.models import NotificationType
from apps.profits.infrastructure.models import PayoutItem, PayoutItemStatus, ProfitPeriod, ProfitPeriodStatus
from integrations.payment.sejam import SejamSettlementClient
from integrations.payment.base import PaymentGatewayError
from shared.exceptions import BusinessRuleViolation, ValidationException




class CalculateProfitDistributionUseCase:
    """فرمول: سهم کاربر = (amount_i / Σamount) * total_profit_amount — طبق سند نیاز، غیرقابل دستکاری دستی."""

    def execute(self, *, profit_period_id) -> ProfitPeriod:
        with transaction.atomic():
            period = ProfitPeriod.objects.select_for_update().select_related("project").get(pk=profit_period_id)

            if period.status != ProfitPeriodStatus.CALCULATING:
                raise BusinessRuleViolation("این دوره در وضعیت محاسبه نیست.")
            if period.total_profit_amount <= 0:
                raise ValidationException("مبلغ سود این دوره باید بزرگ‌تر از صفر باشد.")
            if period.payout_items.exists():
                raise BusinessRuleViolation("برای این دوره قبلاً سود توزیع شده است.")

            investments = Investment.objects.filter(project=period.project, status=InvestmentStatus.SUCCESSFUL)
            total_invested = investments.aggregate(total=Sum("amount"))["total"] or Decimal("0")
            if total_invested <= 0:
                raise BusinessRuleViolation("هیچ سرمایه‌گذاری موفقی برای این پروژه ثبت نشده است.")

            created = []
            for inv in investments:
                ratio = inv.amount / total_invested
                payout_amount = (ratio * period.total_profit_amount).quantize(Decimal("0.01"))
                if payout_amount <= 0:
                    continue
                created.append(PayoutItem.objects.create(
                    period=period, user=inv.investor, investment=inv, amount=payout_amount,
                    status=PayoutItemStatus.PENDING,
                ))

            if not created:
                raise BusinessRuleViolation("نتیجه‌ای برای توزیع سود به‌دست نیامد.")

            period.status = ProfitPeriodStatus.APPROVED
            period.save(update_fields=["status"])
            log_action.execute(actor=None, action="PROFIT_DISTRIBUTION_CALCULATED", entity="ProfitPeriod",
                                entity_id=str(period.id), metadata={"items_count": len(created)})
            return period


class ApprovePayoutUseCase:
    """پرداخت سود به کیف پول داخلی (نمایشی) — تسویه نهایی واقعی صرفاً از طریق سجام (نگاه کنید به SettlePayoutWithSejamUseCase)."""

    def execute(self, *, payout_item_id) -> PayoutItem:
        with transaction.atomic():
            item = PayoutItem.objects.select_for_update().select_related("user").get(pk=payout_item_id)
            if item.status != PayoutItemStatus.PENDING:
                raise BusinessRuleViolation("این آیتم سود در وضعیت قابل پرداخت نیست.")

            wallet = Wallet.objects.select_for_update().get(user=item.user)
            wallet.balance += item.amount
            wallet.version += 1
            wallet.save(update_fields=["balance", "version", "updated_at"])

            tx = WalletTransaction.objects.create(user=item.user, amount=item.amount, type=TransactionType.PROFIT, is_successful=True)
            item.transaction = tx
            item.status = PayoutItemStatus.PAID_TO_WALLET
            item.paid_at = timezone.now()  # ← اضافه شد
            item.save(update_fields=["transaction", "status", "paid_at"])  # ← paid_at اضافه شد
            item.save(update_fields=["transaction", "status"])

            create_notification.execute(user=item.user, title="واریز سود",
                                         message=f"مبلغ {item.amount} تومان سود به کیف پول شما واریز شد.",
                                         notif_type=NotificationType.SUCCESS)
            return item


class SettlePayoutWithSejamUseCase:
    """تسویه قانونی نهایی سود از طریق سجام (طبق پروپوزال: مسیر قانونی پرداخت اصل/سود)."""

    def execute(self, *, payout_item_id, actor=None) -> PayoutItem:
        with transaction.atomic():
            item = PayoutItem.objects.select_for_update().select_related("user", "period", "transaction").get(pk=payout_item_id)
            if item.status == PayoutItemStatus.SETTLED_SEJAM:
                raise BusinessRuleViolation("این آیتم قبلاً از طریق سجام تسویه شده است.")

            client = SejamSettlementClient()
            try:
                result = client.settle_profit(
                    national_code=item.user.national_code or "", amount=str(item.amount),
                    payout_item_id=str(item.id), period_title=item.period.title,
                )
            except PaymentGatewayError as exc:
                raise BusinessRuleViolation(f"ارتباط با سجام ناموفق بود: {exc}")

            tx = item.transaction
            if tx is None:
                tx = WalletTransaction.objects.create(user=item.user, amount=item.amount, type=TransactionType.PROFIT,
                                                       is_successful=True, reference_id=result.settlement_reference)
            else:
                tx.reference_id = result.settlement_reference
                tx.is_successful = True
                tx.save(update_fields=["reference_id", "is_successful"])

            item.transaction = tx
            item.settlement_reference = result.settlement_reference
            item.status = PayoutItemStatus.SETTLED_SEJAM
            item.save(update_fields=["transaction", "settlement_reference", "status"])

            log_action.execute(actor=actor, action="SEJAM_SETTLEMENT", entity="PayoutItem",
                                entity_id=str(item.id), metadata={"reference_id": result.settlement_reference})
            create_notification.execute(user=item.user, title="تسویه سود انجام شد",
                                         message=f"سود دوره «{item.period.title}» از مسیر قانونی سجام تسویه شد.",
                                         notif_type=NotificationType.SUCCESS)
            return item


class HandleSejamCallbackUseCase:
    """پردازش Webhook ناهمزمان سجام برای مواردی که تسویه بلافاصله نهایی نمی‌شود."""

    def execute(self, *, payout_item_id, settlement_status: str, settlement_reference: str) -> PayoutItem:
        with transaction.atomic():
            item = PayoutItem.objects.select_for_update().select_related("user", "period").get(pk=payout_item_id)

            if settlement_status not in {"SUCCESS", "success", "OK"}:
                log_action.execute(actor=None, action="SEJAM_CALLBACK_FAILED", entity="PayoutItem",
                                    entity_id=str(item.id), description=str(settlement_status))
                return item

            if item.status != PayoutItemStatus.SETTLED_SEJAM:
                tx = item.transaction or WalletTransaction.objects.create(
                    user=item.user, amount=item.amount, type=TransactionType.PROFIT,
                    is_successful=True, reference_id=settlement_reference,
                )
                item.transaction = tx
                item.settlement_reference = settlement_reference
                item.status = PayoutItemStatus.SETTLED_SEJAM
                item.save(update_fields=["transaction", "settlement_reference", "status"])
                log_action.execute(actor=None, action="SEJAM_CALLBACK_CONFIRMED", entity="PayoutItem", entity_id=str(item.id))
            return item


calculate_profit_distribution = CalculateProfitDistributionUseCase()
approve_payout = ApprovePayoutUseCase()
settle_payout_with_sejam = SettlePayoutWithSejamUseCase()
handle_sejam_callback = HandleSejamCallbackUseCase()