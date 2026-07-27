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