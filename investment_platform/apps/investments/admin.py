from django.contrib import admin
from .infrastructure.models import Investment, PaymentGatewayConfig, PaymentTransaction, Transaction, Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "blocked_amount", "available_balance", "version", "updated_at")
    autocomplete_fields = ("user",)
    search_fields = ("user__username", "user__email")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ("investor", "project", "amount", "status", "invest_date")
    list_filter = ("status",)
    autocomplete_fields = ("investor", "project")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "amount", "is_successful", "reference_id", "created_at")
    list_filter = ("type", "is_successful")
    autocomplete_fields = ("user", "investment")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "investment")


@admin.register(PaymentGatewayConfig)
class PaymentGatewayConfigAdmin(admin.ModelAdmin):
    list_display = ("gateway_type", "is_active", "is_sandbox", "updated_at")


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "gateway", "amount", "status", "ref_id", "created_at")
    list_filter = ("gateway", "status")
    autocomplete_fields = ("user",)