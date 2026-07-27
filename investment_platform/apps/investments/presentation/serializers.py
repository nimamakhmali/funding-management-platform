from decimal import Decimal

from rest_framework import serializers

from apps.investments.infrastructure.models import (
    Investment, PaymentGatewayConfig, PaymentTransaction, Transaction, Wallet,
)
from apps.users.presentation.serializers import UserMinimalSerializer


class InvestmentSerializer(serializers.ModelSerializer):
    investor = UserMinimalSerializer(read_only=True)
    project_title = serializers.CharField(source="project.title", read_only=True)

    class Meta:
        model = Investment
        fields = ["id", "investor", "project", "project_title", "amount", "invest_date",
                  "status", "contract_file_url"]
        read_only_fields = ["id", "investor", "project_title", "invest_date", "status"]


class InvestmentCreateSerializer(serializers.Serializer):
    project_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, min_value=Decimal("0.01"))


class InvestmentPaymentConfirmSerializer(serializers.Serializer):
    is_successful = serializers.BooleanField()
    reference_id = serializers.CharField(required=False, allow_blank=True, max_length=255)


class WalletSerializer(serializers.ModelSerializer):
    available_balance = serializers.ReadOnlyField()

    class Meta:
        model = Wallet
        fields = ["balance", "blocked_amount", "available_balance", "updated_at"]
        read_only_fields = fields


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "investment", "amount", "type", "reference_id", "is_successful", "created_at"]
        read_only_fields = fields


class WalletWithdrawalSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, min_value=Decimal("0.01"))


class PaymentInitiateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, min_value=Decimal("1000"))


class PaymentGatewayConfigSerializer(serializers.ModelSerializer):
    merchant_id = serializers.CharField(write_only=True, required=False, allow_blank=True)
    has_merchant_id = serializers.SerializerMethodField()

    class Meta:
        model = PaymentGatewayConfig
        fields = ["id", "gateway_type", "merchant_id", "has_merchant_id", "is_active", "is_sandbox", "updated_at"]
        read_only_fields = ["id", "has_merchant_id", "updated_at"]

    def get_has_merchant_id(self, obj):
        return bool(obj.merchant_id)


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = ["id", "gateway", "amount", "authority", "ref_id", "status", "created_at"]
        read_only_fields = fields