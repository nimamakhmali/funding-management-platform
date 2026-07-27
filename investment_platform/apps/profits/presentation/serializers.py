"""
Serializer های توزیع سود
"""
from decimal import Decimal

from rest_framework import serializers

from apps.profits.infrastructure.models import (
    PayoutItem,
    ProfitPeriod,
    ProfitPeriodStatus,
)
from apps.users.presentation.serializers import UserMinimalSerializer


class ProfitPeriodSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    payout_items_count = serializers.SerializerMethodField()

    class Meta:
        model = ProfitPeriod
        fields = [
            "id",
            "project",
            "project_title",
            "title",
            "calculation_date",
            "total_profit_amount",
            "status",
            "distributed_at",
            "payout_items_count",
            "created_at",
        ]
        read_only_fields = ["id", "status", "distributed_at", "created_at"]

    def get_payout_items_count(self, obj) -> int:
        return obj.payout_items.count()


class ProfitPeriodCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfitPeriod
        fields = [
            "project",
            "title",
            "calculation_date",
            "total_profit_amount",
        ]

    def validate_total_profit_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("مبلغ سود باید بزرگ‌تر از صفر باشد.")
        return value


class PayoutItemSerializer(serializers.ModelSerializer):
    investor = UserMinimalSerializer(read_only=True)
    period_title = serializers.CharField(source="period.title", read_only=True)

    class Meta:
        model = PayoutItem
        fields = [
            "id",
            "period",
            "period_title",
            "investor",
            "investment",
            "transaction",
            "amount",
            "status",
            "paid_at",
            "created_at",
        ]
        read_only_fields = fields
        
        
        