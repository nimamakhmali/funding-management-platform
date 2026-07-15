"""
Views توزیع سود
"""
from __future__ import annotations

from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.profits.application.use_cases import (
    ApprovePayoutUseCase,
    CalculateProfitDistributionUseCase,
    SettlePayoutWithSejamUseCase,
)
from apps.profits.infrastructure.models import PayoutItem, ProfitPeriod
from shared.permissions import IsAdmin

from .serializers import (
    PayoutItemSerializer,
    ProfitPeriodCreateSerializer,
    ProfitPeriodSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Profit"], summary="لیست دوره‌های سود (ادمین)"),
    retrieve=extend_schema(tags=["Profit"], summary="جزئیات دوره سود"),
    create=extend_schema(tags=["Profit"], summary="ایجاد دوره سود"),
    update=extend_schema(tags=["Profit"], summary="ویرایش دوره سود"),
    partial_update=extend_schema(tags=["Profit"], summary="ویرایش جزئی دوره سود"),
    destroy=extend_schema(tags=["Profit"], summary="حذف دوره سود"),
)
class ProfitPeriodViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = ProfitPeriod.objects.select_related("project").all().order_by("-calculation_date")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return ProfitPeriodCreateSerializer
        return ProfitPeriodSerializer

    @extend_schema(
        tags=["Profit"],
        summary="محاسبه توزیع سود دوره",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "period_status": {"type": "string"},
                    "items_count": {"type": "integer"},
                },
            }
        },
    )
    @action(detail=True, methods=["post"])
    def calculate(self, request, pk=None):
        period = CalculateProfitDistributionUseCase().execute(
            profit_period_id=pk,
            actor=request.user,
        )
        return Response({
            "status": "calculated",
            "period_status": period.status,
            "items_count": period.payout_items.count(),
        })

    @extend_schema(
        tags=["Profit"],
        summary="لیست آیتم‌های پرداخت سود دوره",
        responses={200: PayoutItemSerializer(many=True)},
    )
    @action(detail=True, methods=["get"])
    def payouts(self, request, pk=None):
        period = self.get_object()
        items = period.payout_items.select_related("investor", "transaction").all()
        return Response(PayoutItemSerializer(items, many=True).data)


@extend_schema(
    tags=["Profit"],
    summary="تأیید و واریز سود به کیف پول (ادمین)",
    responses={
        200: {
            "type": "object",
            "properties": {
                "status": {"type": "string"},
                "transaction_id": {"type": "string"},
            },
        }
    },
)
class PayoutApproveView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        item = ApprovePayoutUseCase().execute(
            payout_item_id=pk,
            actor=request.user,
        )
        return Response({
            "status": "paid",
            "transaction_id": str(item.transaction.id),
        })


@extend_schema(
    tags=["Profit"],
    summary="تسویه سود از طریق سجام (ادمین)",
    responses={
        200: {
            "type": "object",
            "properties": {
                "status": {"type": "string"},
                "payout_item_id": {"type": "string"},
                "transaction_id": {"type": "string", "nullable": True},
            },
        }
    },
)
class PayoutSejamView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        item = SettlePayoutWithSejamUseCase().execute(
            payout_item_id=pk,
            actor=request.user,
        )
        return Response({
            "status": "settled_sejam",
            "payout_item_id": str(item.id),
            "transaction_id": str(item.transaction.id) if item.transaction else None,
        })