from __future__ import annotations

from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.investments.domain.exceptions import InvalidInvestmentState, ProjectNotInvestable
from apps.investments.infrastructure.models import (
    Investment, InvestmentStatus, PaymentGatewayConfig, PaymentGatewayType,
    PaymentStatus, PaymentTransaction, Transaction, TransactionType, Wallet,
)
from apps.investments.infrastructure.repositories import InvestmentRepository, WalletRepository
from apps.notifications.application.use_cases import create_notification, log_action
from apps.notifications.infrastructure.models import NotificationType
from apps.projects.application.use_cases import system_change_project_status
from apps.projects.domain.state_machine import ProjectStatus
from apps.projects.infrastructure.models import Project
from integrations.payment import PaymentGatewayError, get_payment_gateway
from shared.exceptions import (
    BusinessRuleViolation,
    InsufficientBalanceException,
    PermissionDeniedException,
    ValidationException,
)

_wallet_repo = WalletRepository()
_inv_repo = InvestmentRepository()


class ProcessInvestmentUseCase:
    def execute(self, *, investor, dto) -> Investment:
        if dto.amount is None or dto.amount <= 0:
            raise ValidationException("مبلغ سرمایه‌گذاری نامعتبر است.")

        with transaction.atomic():
            wallet = _wallet_repo.for_update(investor)
            project = Project.objects.select_for_update().get(pk=dto.project_id)

            if project.status != ProjectStatus.FUNDING and project.status != ProjectStatus.APPROVED:
                raise ProjectNotInvestable()
            if wallet.available_balance < dto.amount:
                raise InsufficientBalanceException("موجودی کیف پول برای این سرمایه‌گذاری کافی نیست.")
            if dto.amount < project.min_investment_amount:
                raise ValidationException("مبلغ کمتر از حداقل سرمایه‌گذاری پروژه است.")
            remaining = project.required_budget - project.raised_amount
            if dto.amount > remaining:
                raise ValidationException(f"مبلغ سرمایه‌گذاری از باقیمانده بودجه طرح ({remaining}) بیشتر است.")

            # اولین سرمایه‌گذاری، پروژه را از APPROVED به FUNDING منتقل می‌کند
            if project.status == ProjectStatus.APPROVED:
                system_change_project_status.execute(project=project, to_status=ProjectStatus.FUNDING,
                                                       reason="شروع اولین سرمایه‌گذاری")

            wallet.blocked_amount += dto.amount
            wallet.version += 1
            wallet.save(update_fields=["blocked_amount", "version", "updated_at"])

            investment = Investment.objects.create(
                investor=investor, project=project, amount=dto.amount, status=InvestmentStatus.PENDING_PAYMENT,
            )
            Transaction.objects.create(
                user=investor, investment=investment, amount=-dto.amount,
                type=TransactionType.INVESTMENT_COMMITMENT, is_successful=False,
            )
            log_action.execute(actor=investor, action="INVESTMENT_CREATED", entity="Investment",
                                entity_id=str(investment.id), metadata={"amount": str(dto.amount)})
            return investment


class ConfirmInvestmentPaymentUseCase:
    def execute(self, *, investment_id, actor, dto) -> Investment:
        with transaction.atomic():
            investment = _inv_repo.for_update(investment_id)

            is_owner = actor.id == investment.investor_id
            is_privileged = actor.is_staff or actor.role == "ADMIN"
            if not (is_owner or is_privileged):
                raise PermissionDeniedException("شما مجاز به تایید این سرمایه‌گذاری نیستید.")

            if investment.status != InvestmentStatus.PENDING_PAYMENT:
                raise InvalidInvestmentState("این سرمایه‌گذاری قبلاً نهایی شده است.")

            wallet = _wallet_repo.for_update(investment.investor)
            project = Project.objects.select_for_update().get(pk=investment.project_id)
            tx = _inv_repo.get_transaction_for_investment(investment, TransactionType.INVESTMENT_COMMITMENT)

            if wallet.blocked_amount < investment.amount:
                raise BusinessRuleViolation("موجودی بلوکه‌شده کیف پول با سرمایه‌گذاری همخوانی ندارد.")

            wallet.blocked_amount -= investment.amount
            wallet.version += 1

            if dto.is_successful:
                wallet.balance -= investment.amount
                wallet.save(update_fields=["balance", "blocked_amount", "version", "updated_at"])

                investment.status = InvestmentStatus.SUCCESSFUL
                investment.save(update_fields=["status", "updated_at"])

                project.raised_amount += investment.amount
                project.save(update_fields=["raised_amount", "updated_at"])

                if project.raised_amount >= project.required_budget and project.status == ProjectStatus.FUNDING:
                    system_change_project_status.execute(
                        project=project, to_status=ProjectStatus.FUNDING_COMPLETED, reason="تکمیل بودجه هدف"
                    )

                log_action.execute(actor=actor, action="INVESTMENT_PAYMENT_CONFIRMED", entity="Investment",
                                    entity_id=str(investment.id), metadata={"reference_id": dto.reference_id})
            else:
                wallet.save(update_fields=["blocked_amount", "version", "updated_at"])
                investment.status = InvestmentStatus.FAILED
                investment.save(update_fields=["status", "updated_at"])
                log_action.execute(actor=actor, action="INVESTMENT_PAYMENT_FAILED", entity="Investment",
                                    entity_id=str(investment.id))

            if tx is not None:
                tx.is_successful = bool(dto.is_successful)
                fields = ["is_successful"]
                if dto.reference_id:
                    tx.reference_id = dto.reference_id
                    fields.append("reference_id")
                tx.save(update_fields=fields)

            create_notification.execute(
                user=investment.investor, title="نتیجه سرمایه‌گذاری",
                message=(f"پرداخت سرمایه‌گذاری شما در «{project.title}» تایید شد."
                         if dto.is_successful else f"پرداخت سرمایه‌گذاری شما در «{project.title}» ناموفق بود."),
                notif_type=NotificationType.SUCCESS if dto.is_successful else NotificationType.WARNING,
            )
            return investment


class RequestWithdrawalUseCase:
    def execute(self, *, user, amount: Decimal) -> Transaction:
        if amount is None or amount <= 0:
            raise ValidationException("مبلغ برداشت نامعتبر است.")
        with transaction.atomic():
            wallet = _wallet_repo.for_update(user)
            if wallet.available_balance < amount:
                raise InsufficientBalanceException("موجودی قابل برداشت کافی نیست.")
            wallet.balance -= amount
            wallet.version += 1
            wallet.save(update_fields=["balance", "version", "updated_at"])
            tx = Transaction.objects.create(user=user, amount=-amount, type=TransactionType.WITHDRAWAL, is_successful=True)
            log_action.execute(actor=user, action="WITHDRAWAL", entity="Transaction", entity_id=str(tx.id),
                                metadata={"amount": str(amount)})
            return tx


class InitiateWalletDepositUseCase:
    """شروع شارژ کیف پول از طریق درگاه پرداخت واقعی (زرین‌پال)."""

    def execute(self, *, user, amount: Decimal):
        from django.conf import settings

        if amount is None or amount < Decimal("1000"):
            raise ValidationException("حداقل مبلغ شارژ کیف پول ۱۰۰۰ تومان است.")

        config = PaymentGatewayConfig.objects.filter(is_active=True).first()
        if not config:
            raise BusinessRuleViolation("هیچ درگاه پرداخت فعالی در سامانه تنظیم نشده است.")

        payment = PaymentTransaction.objects.create(user=user, gateway=config.gateway_type,
                                                     amount=amount, status=PaymentStatus.PENDING)
        callback_url = f"{settings.BACKEND_PUBLIC_BASE_URL}/api/v1/wallet/payment/callback/?payment_id={payment.id}"

        try:
            gateway = get_payment_gateway(config.gateway_type, config.merchant_id, config.is_sandbox)
            result = gateway.request_payment(amount=int(amount), description=f"شارژ کیف پول {user.username}",
                                              callback_url=callback_url, mobile=user.phone_number or "")
        except PaymentGatewayError as exc:
            payment.status = PaymentStatus.FAILED
            payment.save(update_fields=["status"])
            raise BusinessRuleViolation(f"اتصال به درگاه پرداخت ناموفق بود: {exc}")

        payment.authority = result.authority
        payment.save(update_fields=["authority"])
        log_action.execute(actor=user, action="PAYMENT_INITIATED", entity="PaymentTransaction",
                            entity_id=str(payment.id), metadata={"amount": str(amount)})
        return payment, result.payment_url


class VerifyWalletDepositUseCase:
    def execute(self, *, payment_id, gateway_status: str, authority: str) -> PaymentTransaction:
        with transaction.atomic():
            payment = PaymentTransaction.objects.select_for_update().select_related("user").get(pk=payment_id)

            if payment.status != PaymentStatus.PENDING:
                return payment  # Idempotent — از double-callback جلوگیری می‌کند

            if gateway_status != "OK":
                payment.status = PaymentStatus.CANCELED
                payment.save(update_fields=["status"])
                return payment

            config = PaymentGatewayConfig.objects.get(gateway_type=payment.gateway)
            try:
                gateway = get_payment_gateway(config.gateway_type, config.merchant_id, config.is_sandbox)
                result = gateway.verify_payment(amount=int(payment.amount), authority=authority)
            except PaymentGatewayError:
                payment.status = PaymentStatus.FAILED
                payment.save(update_fields=["status"])
                return payment

            wallet = _wallet_repo.for_update(payment.user)
            wallet.balance += payment.amount
            wallet.version += 1
            wallet.save(update_fields=["balance", "version", "updated_at"])

            tx = Transaction.objects.create(user=payment.user, amount=payment.amount, type=TransactionType.DEPOSIT,
                                             is_successful=True, reference_id=result.ref_id)
            payment.status = PaymentStatus.SUCCESS
            payment.ref_id = result.ref_id
            payment.wallet_transaction = tx
            payment.save(update_fields=["status", "ref_id", "wallet_transaction"])

            log_action.execute(actor=payment.user, action="WALLET_DEPOSIT_GATEWAY", entity="PaymentTransaction",
                                entity_id=str(payment.id), metadata={"ref_id": result.ref_id})
            create_notification.execute(user=payment.user, title="شارژ کیف پول",
                                         message=f"کیف پول شما به مبلغ {payment.amount} تومان شارژ شد.",
                                         notif_type=NotificationType.SUCCESS)
            return payment


process_investment = ProcessInvestmentUseCase()
confirm_investment_payment = ConfirmInvestmentPaymentUseCase()
request_withdrawal = RequestWithdrawalUseCase()
initiate_wallet_deposit = InitiateWalletDepositUseCase()
verify_wallet_deposit = VerifyWalletDepositUseCase()