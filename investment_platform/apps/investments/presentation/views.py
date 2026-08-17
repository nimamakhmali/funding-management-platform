from django.conf import settings
from django.db import transaction as db_transaction
from django.shortcuts import redirect
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView

from apps.investments.application.dtos import ConfirmPaymentDTO, CreateInvestmentDTO
from apps.investments.application.use_cases import (
    confirm_investment_payment, initiate_wallet_deposit, process_investment,
    request_withdrawal, verify_wallet_deposit,
)
from apps.investments.infrastructure.models import (
    PaymentGatewayConfig, Transaction, TransactionType, Wallet,
)
from apps.notifications.application.use_cases import log_action
from integrations.payment import PaymentGatewayError, ZarinpalGateway
from shared.permissions import IsAdminRoleOnly, IsInvestor
from shared.responses import error_response, success_response

from .serializers import (
    InvestmentCreateSerializer, InvestmentPaymentConfirmSerializer, InvestmentSerializer,
    PaymentGatewayConfigSerializer, PaymentInitiateSerializer, TransactionSerializer,
    WalletSerializer, WalletWithdrawalSerializer,
)


@extend_schema(tags=["Wallet"], summary="مشاهده کیف پول")
class WalletView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        return success_response(WalletSerializer(wallet).data)


@extend_schema(tags=["Wallet"], summary="واریز تستی (فقط محیط توسعه)")
class MockDepositView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not settings.DEBUG:
            return error_response("واریز تستی در محیط عملیاتی غیرفعال است.", status_code=status.HTTP_403_FORBIDDEN)
        amount = request.data.get("amount")
        try:
            amount = float(amount)
            assert amount > 0
        except (TypeError, ValueError, AssertionError):
            return error_response("مبلغ نامعتبر است.")

        with db_transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(user=request.user)
            wallet.balance += amount
            wallet.version += 1
            wallet.save(update_fields=["balance", "version", "updated_at"])
            Transaction.objects.create(user=request.user, amount=amount, type=TransactionType.DEPOSIT,
                                        is_successful=True, reference_id=f"MOCK-{request.user.id}")
        return success_response({"new_balance": str(wallet.balance)})


@extend_schema(tags=["Wallet"], summary="شروع پرداخت واقعی (شارژ از درگاه بانکی)", request=PaymentInitiateSerializer)
class PaymentInitiateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment, url = initiate_wallet_deposit.execute(user=request.user, amount=serializer.validated_data["amount"])
        return success_response({"payment_id": str(payment.id), "payment_url": url}, status_code=201)


@extend_schema(
    tags=["Wallet"], summary="Callback بازگشت از درگاه پرداخت",
    parameters=[OpenApiParameter("payment_id", OpenApiTypes.UUID, OpenApiParameter.QUERY),
                OpenApiParameter("Authority", OpenApiTypes.STR, OpenApiParameter.QUERY),
                OpenApiParameter("Status", OpenApiTypes.STR, OpenApiParameter.QUERY)],
)
class PaymentCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        payment_id = request.query_params.get("payment_id")
        authority = request.query_params.get("Authority", "")
        gw_status = request.query_params.get("Status", "")
        if not payment_id or not authority:
            return error_response("پارامترهای بازگشتی درگاه ناقص است.")

        payment = verify_wallet_deposit.execute(payment_id=payment_id, gateway_status=gw_status, authority=authority)
        return redirect(f"{settings.FRONTEND_BASE_URL}/wallet/payment-result?status={payment.status}&payment_id={payment.id}")


@extend_schema(tags=["Wallet"], summary="درخواست برداشت از کیف پول", request=WalletWithdrawalSerializer)
class WithdrawalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = WalletWithdrawalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tx = request_withdrawal.execute(user=request.user, amount=serializer.validated_data["amount"])
        return success_response(TransactionSerializer(tx).data, status_code=201)


@extend_schema(tags=["Transactions"], summary="تاریخچه تراکنش‌های کاربر",
               parameters=[OpenApiParameter("type", OpenApiTypes.STR), OpenApiParameter("success", OpenApiTypes.BOOL)])
class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user).order_by("-created_at")
        p = self.request.query_params
        if p.get("type"):
            qs = qs.filter(type=p["type"])
        if p.get("success") in {"true", "false"}:
            qs = qs.filter(is_successful=(p["success"] == "true"))
        return qs


@extend_schema(tags=["Investments"], summary="ثبت سرمایه‌گذاری جدید", request=InvestmentCreateSerializer)
class InvestmentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInvestor]

    def post(self, request):
        serializer = InvestmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dto = CreateInvestmentDTO(**serializer.validated_data)
        investment = process_investment.execute(investor=request.user, dto=dto)
        return success_response(InvestmentSerializer(investment).data, status_code=201)


@extend_schema(tags=["Investments"], summary="تأیید/رد پرداخت سرمایه‌گذاری", request=InvestmentPaymentConfirmSerializer)
class InvestmentConfirmView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        serializer = InvestmentPaymentConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dto = ConfirmPaymentDTO(**serializer.validated_data)
        investment = confirm_investment_payment.execute(investment_id=pk, actor=request.user, dto=dto)
        return success_response(InvestmentSerializer(investment).data)


@extend_schema_view(
    list=extend_schema(tags=["Admin"], summary="لیست تنظیمات درگاه پرداخت"),
    create=extend_schema(tags=["Admin"], summary="افزودن تنظیمات درگاه"),
    update=extend_schema(tags=["Admin"], summary="ویرایش درگاه"),
    partial_update=extend_schema(tags=["Admin"], summary="ویرایش جزئی درگاه"),
    destroy=extend_schema(tags=["Admin"], summary="حذف درگاه"),
)
class PaymentGatewayConfigViewSet(viewsets.ModelViewSet):
    queryset = PaymentGatewayConfig.objects.all()
    serializer_class = PaymentGatewayConfigSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRoleOnly]

    @extend_schema(tags=["Admin"], summary="تست اتصال درگاه (بدون واریز واقعی)")
    @action(detail=True, methods=["post"])
    def test_connection(self, request, pk=None):
        config = self.get_object()
        try:
            gateway = ZarinpalGateway(merchant_id=config.merchant_id, sandbox=config.is_sandbox)
            result = gateway.request_payment(
                amount=10000, description="تست اتصال درگاه",
                callback_url=f"{settings.BACKEND_PUBLIC_BASE_URL}/api/v1/wallet/payment/callback/?payment_id=test",
            )
            return success_response({"status": "ok", "authority": result.authority})
        except PaymentGatewayError as exc:
            return error_response(str(exc))
        
        
        
# در انتهای فایل اضافه کن

from apps.investments.infrastructure.models import Investment, InvestmentStatus
from apps.profits.infrastructure.models import PayoutItem
from django.db.models import Sum

class MyInvestmentsView(APIView):
    """لیست سرمایه‌گذاری‌های کاربر جاری"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        investments = (
            Investment.objects
            .filter(investor=request.user)
            .select_related("project", "project__owner")
            .order_by("-invest_date")
        )

        # فیلتر وضعیت
        status_filter = request.query_params.get("status")
        if status_filter:
            investments = investments.filter(status=status_filter)

        from shared.pagination import StandardPagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(investments, request)

        results = []
        for inv in (page if page is not None else investments):
            results.append({
                "id": str(inv.id),
                "project_id": str(inv.project_id),
                "project_title": inv.project.title,
                "project_status": inv.project.status,
                "project_status_display": inv.project.get_status_display(),
                "project_cover_image": inv.project.cover_image_url,
                "project_profit_rate": str(inv.project.profit_rate_percentage or 0),
                "project_funding_percentage": str(inv.project.funding_percentage),
                "amount": str(inv.amount),
                "status": inv.status,
                "invest_date": inv.invest_date.isoformat(),
                "current_value": str(inv.amount),  # در فاز بعد با سود واقعی جایگزین می‌شود
            })

        if page is not None:
            return paginator.get_paginated_response(results)
        return success_response(results)


class MyInvestmentDetailView(APIView):
    """جزئیات یک سرمایه‌گذاری خاص (برای صفحه [id])"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        """
        با project_id می‌گیریم چون صفحه /invest-project/[id]
        بر اساس id پروژه کار می‌کند
        """
        try:
            from apps.projects.infrastructure.models import Project
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return error_response("پروژه یافت نشد.", status_code=404)

        # سرمایه‌گذاری موفق این کاربر در این پروژه
        investment = (
            Investment.objects
            .filter(
                investor=request.user,
                project=project,
                status=InvestmentStatus.SUCCESSFUL,
            )
            .first()
        )

        # سودهای دریافتی از این پروژه
        total_profit = (
            PayoutItem.objects
            .filter(
                user=request.user,
                period__project=project,
                status="PAID_TO_WALLET",
            )
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        data = {
            "project": {
                "id": str(project.id),
                "title": project.title,
                "description": project.description,
                "category_display": project.category_display,
                "cover_image_url": project.cover_image_url,
                "required_budget": str(project.required_budget),
                "raised_amount": str(project.raised_amount),
                "min_investment_amount": str(project.min_investment_amount),
                "max_investment_amount": str(project.max_investment_amount or project.required_budget),
                "profit_rate_percentage": str(project.profit_rate_percentage or 0),
                "remaining_days": project.remaining_days,
                "funding_percentage": str(project.funding_percentage),
                "investors_count": project.investors_count,
                "status": project.status,
                "status_display": project.get_status_display(),
                "start_date": project.start_date.isoformat() if project.start_date else None,
                "end_date": project.end_date.isoformat() if project.end_date else None,
            },
            "my_investment": {
                "id": str(investment.id) if investment else None,
                "amount": str(investment.amount) if investment else None,
                "invest_date": investment.invest_date.isoformat() if investment else None,
                "status": investment.status if investment else None,
            } if investment else None,
            "profit_summary": {
                "total_received": str(total_profit),
                "estimated_annual": str(
                    float(investment.amount if investment else 0) *
                    float(project.profit_rate_percentage or 0) / 100
                ),
            },
        }

        return success_response(data)        