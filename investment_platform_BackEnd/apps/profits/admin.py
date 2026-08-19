from django.contrib import admin
from .infrastructure.models import PayoutItem, ProfitPeriod


class PayoutItemInline(admin.TabularInline):
    model = PayoutItem
    extra = 0
    readonly_fields = ("created_at",)


@admin.register(ProfitPeriod)
class ProfitPeriodAdmin(admin.ModelAdmin):
    list_display = ("project", "title", "total_profit_amount", "status", "calculation_date")
    list_filter = ("status",)
    autocomplete_fields = ("project",)
    # ⬇️ اضافه کنید
    search_fields = ("project__title", "title", "period_id")
    inlines = (PayoutItemInline,)


@admin.register(PayoutItem)
class PayoutItemAdmin(admin.ModelAdmin):
    list_display = ("period", "user", "amount", "status", "settlement_reference", "created_at")
    list_filter = ("status",)
    autocomplete_fields = ("period", "user", "investment", "transaction")
    # ⬇️ اضافه کنید
    search_fields = (
        "period__title",
        "period__project__title",
        "user__username",
        "user__email",
        "investment__investment_id",
        "settlement_reference"
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("period", "user", "investment", "transaction")