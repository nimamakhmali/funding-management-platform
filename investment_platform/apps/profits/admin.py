from django.contrib import admin
from apps.profits.infrastructure.models import PayoutItem, ProfitPeriod


@admin.register(ProfitPeriod)
class ProfitPeriodAdmin(admin.ModelAdmin):
    list_display = ("project", "title", "total_profit_amount", "status", "calculation_date")
    list_filter = ("status",)
    search_fields = ("project__title", "title")
    autocomplete_fields = ("project",)
    readonly_fields = ("created_at",)


@admin.register(PayoutItem)
class PayoutItemAdmin(admin.ModelAdmin):
    list_display = ("period", "investor", "amount", "status", "paid_at")
    list_filter = ("status",)
    search_fields = ("investor__username", "period__title")
    autocomplete_fields = ("period", "investor", "investment", "transaction")
    readonly_fields = ("created_at",)
