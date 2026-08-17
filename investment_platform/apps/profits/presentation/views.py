from django.conf import settings
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView

from apps.profits.application.use_cases import (
    approve_payout, calculate_profit_distribution, handle_sejam_callback, settle_payout_with_sejam,
)
from apps.profits.infrastructure.models import ProfitPeriod
from shared.permissions import IsAdminRoleOnly, IsObserverOrAbove, IsOperatorOrAdmin
from shared.responses import error_response, success_response

from .serializers import PayoutItemSerializer, ProfitPeriodSerializer


@extend_schema_view(
    list=extend_schema(tags=["Profit"], summary="لیست دوره‌های سود"),
    retrieve=extend_schema(tags=["Profit"], summary="جزئیات دوره سود"),
    create=extend_schema(tags=["Profit"], summary="ایجاد دوره سود (اپراتور/ادمین)"),
    update=extend_schema(tags=["Profit"], summary="ویرایش دوره سود"),
    partial_update=extend_schema(tags=["Profit"], summary="ویرایش جزئی دوره سود"),
    destroy=extend_schema(tags=["Profit"], summary="حذف دوره سود"),
)
class ProfitPeriodViewSet(viewsets.ModelViewSet):
    queryset = ProfitPeriod.objects.select_related("project").order_by("-calculation_date")
    serializer_class = ProfitPeriodSerializer

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy", "calculate"}:
            return [permissions.IsAuthenticated(), IsOperatorOrAdmin()]
        return [permissions.IsAuthenticated(), IsObserverOrAbove()]

    @extend_schema(tags=["Profit"], summary="محاسبه توزیع سود دوره (اپراتور/ادمین)")
    @action(detail=True, methods=["post"])
    def calculate(self, request, pk=None):
        period = calculate_profit_distribution.execute(profit_period_id=pk)
        return success_response({"status": period.status, "items_count": period.payout_items.count()})

    @extend_schema(tags=["Profit"], summary="لیست آیتم‌های پرداخت سود دوره")
    @action(detail=True, methods=["get"])
    def payouts(self, request, pk=None):
        period = self.get_object()
        return success_response(PayoutItemSerializer(period.payout_items.all(), many=True).data)


@extend_schema(tags=["Profit"], summary="تأیید و پرداخت سود به کیف پول (اپراتور/ادمین)")
class PayoutApproveView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOperatorOrAdmin]

    def post(self, request, pk):
        item = approve_payout.execute(payout_item_id=pk)
        return success_response({"status": "paid", "transaction_id": str(item.transaction.id)})


@extend_schema(tags=["Profit"], summary="تسویه سود از طریق سجام (فقط ادمین — عملیات مالی نهایی)")
class PayoutSejamSettleView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRoleOnly]

    def post(self, request, pk):
        item = settle_payout_with_sejam.execute(payout_item_id=pk, actor=request.user)
        return success_response({
            "status": "settled_sejam", "payout_item_id": str(item.id),
            "transaction_id": str(item.transaction.id) if item.transaction else None,
        })


@extend_schema(tags=["Profit"], summary="Webhook تأیید نهایی از سامانه سجام")
class SejamCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        secret = request.headers.get("X-Sejam-Secret", "")
        if not settings.SEJAM_CALLBACK_SECRET or secret != settings.SEJAM_CALLBACK_SECRET:
            return error_response("امضای درخواست نامعتبر است.", status_code=401)

        payout_id = request.data.get("payout_id")
        if not payout_id:
            return error_response("payout_id الزامی است.")

        item = handle_sejam_callback.execute(
            payout_item_id=payout_id, settlement_status=request.data.get("status"),
            settlement_reference=request.data.get("settlement_reference"),
        )
        return success_response({"payout_item_id": str(item.id)})
    
    
@extend_schema(
    tags=["Profit"],
    summary="سودهای دریافتی سرمایه‌گذار (پنل سرمایه‌گذار)",
)
class InvestorPayoutsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        لیست سودهای دریافتی کاربر جاری.
        فیلترها: period (monthly/quarterly/yearly), project_id
        """
        from apps.profits.infrastructure.models import PayoutItem

        qs = (
            PayoutItem.objects
            .filter(user=request.user)
            .select_related("period__project", "transaction")
            .order_by("-created_at")
        )

        

        # فیلتر پروژه
        project_id = request.query_params.get("project_id")
        if project_id:
            qs = qs.filter(period__project_id=project_id)

        # فیلتر وضعیت
        status_filter = request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        # پاگینیشن دستی
        from shared.pagination import StandardPagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)

        results = []
        for item in (page if page is not None else qs):
            results.append({
                "id": str(item.id),
                "period_title": item.period.title,
                "project_id": str(item.period.project_id),
                "project_name": item.period.project.title,
                "amount": str(item.amount),
                "status": item.status,
                "paid_at": item.paid_at.isoformat() if item.paid_at else None,
                "created_at": item.created_at.isoformat(),
            })

        if page is not None:
            return paginator.get_paginated_response(results)

        return success_response(results)    
    
    
class InvestorProfitSummaryView(APIView):
    """آمار خلاصه سود سرمایه‌گذار برای ProfitReportInformation"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.profits.infrastructure.models import PayoutItem, PayoutItemStatus
        from django.db.models import Sum, Count

        # سود کل دریافتی
        paid = (
            PayoutItem.objects
            .filter(user=request.user, status=PayoutItemStatus.PAID_TO_WALLET)
            .aggregate(total=Sum("amount"), count=Count("id"))
        )

        # در انتظار پرداخت
        pending = (
            PayoutItem.objects
            .filter(user=request.user, status=PayoutItemStatus.PENDING)
            .aggregate(total=Sum("amount"), count=Count("id"))
        )

        # میانگین ROI از سرمایه‌گذاری‌های موفق
        from apps.investments.infrastructure.models import Investment, InvestmentStatus
        investments = Investment.objects.filter(
            investor=request.user,
            status=InvestmentStatus.SUCCESSFUL,
        ).select_related("project")

        roi = 0.0
        if investments.exists():
            rates = [
                float(inv.project.profit_rate_percentage or 0)
                for inv in investments
                if inv.project.profit_rate_percentage
            ]
            roi = sum(rates) / len(rates) if rates else 0.0

        data = {
            "total_received": str(paid["total"] or 0),
            "total_received_count": paid["count"] or 0,
            "pending_amount": str(pending["total"] or 0),
            "pending_count": pending["count"] or 0,
            "avg_roi_percentage": round(roi, 1),
        }

        return success_response(data)    