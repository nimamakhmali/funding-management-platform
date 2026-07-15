from django.contrib import admin
from apps.investments.infrastructure.models import Investment, Transaction, Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "blocked_amount", "updated_at")
    search_fields = ("user__username", "user__email")
    autocomplete_fields = ("user",)
    readonly_fields = ("updated_at",)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "amount", "is_successful", "reference_id", "created_at")
    list_filter = ("type", "is_successful")
    search_fields = ("user__username", "reference_id")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("user",)

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ("investor", "project", "amount", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("investor__username", "project__title")
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("investor", "project")
