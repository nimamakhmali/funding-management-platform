from __future__ import annotations

from decimal import Decimal
from typing import Iterable

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum

from .models import (
    Investment,
    InvestmentStatus,
    PayoutItem,
    PayoutItemStatus,
    ProfitPeriod,
    ProfitPeriodStatus,
    Project,
    Transaction,
    TransactionType,
    User,
    Wallet,
)


def process_investment(user: User, project: Project, amount: Decimal) -> Investment:
    """
    اتمیک: ثبت سرمایه‌گذاری، قفل کردن رکوردها، به‌روز کردن کیف پول و پروژه.

    - فقط روی پروژه‌های APPROVED اجازه سرمایه‌گذاری می‌دهد.
    - از available_balance استفاده می‌کند (balance - blocked_amount).
    - مبلغ را در blocked_amount قفل می‌کند و raised_amount پروژه را افزایش می‌دهد.
    """
    if amount is None or amount <= 0:
        raise ValidationError("مبلغ سرمایه‌گذاری نامعتبر است.")

    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(user=user)
        project_locked = Project.objects.select_for_update().get(pk=project.pk)

        if project_locked.status != project_locked._meta.model.ProjectStatus.APPROVED:
            # Fallback در صورت دسترسی از enums ماژول
            from .models import ProjectStatus as PS

            if project_locked.status != PS.APPROVED:
                raise ValidationError("سرمایه‌گذاری فقط روی پروژه‌های تایید شده امکان‌پذیر است.")

        if wallet.available_balance < amount:
            raise ValidationError("موجودی کیف پول برای این سرمایه‌گذاری کافی نیست.")

        remaining = project_locked.required_budget - project_locked.raised_amount
        if amount > remaining:
            raise ValidationError("مبلغ سرمایه‌گذاری از باقیمانده بودجه طرح بیشتر است.")

        # قفل کردن مبلغ در کیف پول (balance ثابت می‌ماند، blocked_amount بالا می‌رود)
        wallet.blocked_amount += amount
        wallet.save(update_fields=["blocked_amount"])

        # ثبت تراکنش تعهد سرمایه‌گذاری
        Transaction.objects.create(
            user=user,
            amount=-amount,  # مبلغ منفی یعنی خروج از موجودی آزاد
            type=TransactionType.INVESTMENT_COMMITMENT,
            is_successful=True,
        )

        # ایجاد رکورد Investment
        investment = Investment.objects.create(
            investor=user,
            project=project_locked,
            amount=amount,
            status=InvestmentStatus.PENDING_PAYMENT,
        )

        # به‌روزرسانی پروژه
        project_locked.raised_amount += amount
        if project_locked.raised_amount >= project_locked.required_budget:
            project_locked.status = project_locked._meta.model.ProjectStatus.FUNDING_COMPLETED
        project_locked.save(update_fields=["raised_amount", "status"])

        return investment


def calculate_profit_distribution(profit_period_id) -> ProfitPeriod:
    """
    برای یک ProfitPeriod مشخص، بر اساس سرمایه‌گذاری‌های موفق، PayoutItem می‌سازد.

    فرمول: سهم کاربر = (amount_i / Σ amount) * total_profit_amount
    """
    with transaction.atomic():
        period = ProfitPeriod.objects.select_for_update().select_related("project").get(
            pk=profit_period_id
        )

        if period.status != ProfitPeriodStatus.CALCULATING:
            raise ValidationError("این دوره در وضعیت محاسبه نیست.")

        if period.total_profit_amount <= 0:
            raise ValidationError("مبلغ سود این دوره باید بزرگ‌تر از صفر باشد.")

        # اگر قبلاً آیتمی ثبت شده، اجازه دوباره‌سازی نمی‌دهیم
        if period.payout_items.exists():
            raise ValidationError("برای این دوره قبلاً سود توزیع شده است.")

        investments = Investment.objects.filter(
            project=period.project,
            status=InvestmentStatus.SUCCESSFUL,
        )

        agg = investments.aggregate(total=Sum("amount"))["total"] or Decimal("0")
        if agg <= 0:
            raise ValidationError("هیچ سرمایه‌گذاری موفقی برای این پروژه ثبت نشده است.")

        total_profit = period.total_profit_amount

        created_items: list[PayoutItem] = []
        for inv in investments:
            ratio = inv.amount / agg
            payout_amount = (ratio * total_profit).quantize(Decimal("0.01"))
            if payout_amount <= 0:
                continue

            item = PayoutItem.objects.create(
                period=period,
                user=inv.investor,
                investment=inv,
                amount=payout_amount,
                status=PayoutItemStatus.PENDING,
            )
            created_items.append(item)

        # اگر هیچ آیتمی ایجاد نشد، خطا
        if not created_items:
            raise ValidationError("نتیجه‌ای برای توزیع سود به‌دست نیامد.")

        period.status = ProfitPeriodStatus.APPROVED
        period.save(update_fields=["status"])

        return period


def approve_payout(payout_item_id) -> PayoutItem:
    """
    واریز نهایی سود به کیف پول کاربر برای یک PayoutItem مشخص.

    - مبلغ به balance کیف پول اضافه می‌شود.
    - تراکنش PROFIT ثبت می‌شود.
    - وضعیت PayoutItem به PAID_TO_WALLET تغییر می‌کند.
    """
    with transaction.atomic():
        item = (
            PayoutItem.objects.select_for_update()
            .select_related("user")
            .get(pk=payout_item_id)
        )

        if item.status != PayoutItemStatus.PENDING:
            raise ValidationError("این آیتم سود در وضعیت قابل پرداخت نیست.")

        wallet = Wallet.objects.select_for_update().get(user=item.user)

        wallet.balance += item.amount
        wallet.save(update_fields=["balance"])

        tx = Transaction.objects.create(
            user=item.user,
            amount=item.amount,
            type=TransactionType.PROFIT,
            is_successful=True,
        )

        item.transaction = tx
        item.status = PayoutItemStatus.PAID_TO_WALLET
        item.save(update_fields=["transaction", "status"])

        return item

