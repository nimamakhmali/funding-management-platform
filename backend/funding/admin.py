"""
Django Admin configuration for Investment Management System (Crowdfunding Platform)
Canonical admin module (single implementation).
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db.models import Count

from .models import (
    Document,
    Investment,
    PayoutItem,
    ProfitPeriod,
    Project,
    Ticket,
    Transaction,
    User,
    UserProfile,
    Wallet,
)


# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0


class ProjectDocumentInline(admin.TabularInline):
    model = Document
    extra = 0
    fields = ("title", "file_type", "uploader", "file_path", "created_at")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("uploader",)


class ProjectInvestmentInline(admin.TabularInline):
    model = Investment
    extra = 0
    fields = ("investor", "amount", "status", "invest_date", "created_at")
    readonly_fields = ("invest_date", "created_at")
    autocomplete_fields = ("investor",)

class PayoutItemInline(admin.TabularInline):
    model = PayoutItem
    extra = 0
    fields = ("user", "investment", "amount", "status", "transaction", "created_at")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("user", "investment", "transaction")


# ---------------------------------------------------------------------------
# User & Profile
# ---------------------------------------------------------------------------


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "is_active", "is_staff", "created_at")
    list_filter = ("role", "is_active", "is_staff", "created_at")
    search_fields = ("username", "email", "national_code", "phone_number")
    ordering = ("-created_at",)

    readonly_fields = ("created_at", "updated_at", "last_login")
    inlines = (UserProfileInline,)

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Personal Info", {"fields": ("phone_number", "national_code")}),
        (
            "Permissions",
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2", "role"),
            },
        ),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "company_name", "created_at")
    search_fields = ("user__username", "user__email", "company_name")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "blocked_amount", "available_balance", "version", "updated_at")
    search_fields = ("user__username", "user__email", "user__phone_number")
    autocomplete_fields = ("user",)
    readonly_fields = ()
    ordering = ("-updated_at",)

    @admin.display(description="Available")
    def available_balance(self, obj: Wallet):
        return obj.available_balance


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "owner",
        "category",
        "status",
        "required_budget",
        "raised_amount",
        "funding_percentage",
        "investments_count",
        "created_at",
    )
    list_filter = ("status", "category", "created_at")
    search_fields = ("title", "description", "owner__username", "owner__email")
    autocomplete_fields = ("owner",)
    date_hierarchy = "created_at"

    readonly_fields = ("created_at", "updated_at", "funding_percentage", "is_funding_complete")
    inlines = (ProjectDocumentInline, ProjectInvestmentInline)

    fieldsets = (
        ("Basic Information", {"fields": ("owner", "title", "description", "category")}),
        (
            "Funding Details",
            {
                "fields": (
                    "required_budget",
                    "raised_amount",
                    "min_investment_amount",
                    "funding_percentage",
                    "is_funding_complete",
                )
            },
        ),
        ("Timeline", {"fields": ("start_date", "end_date")}),
        ("Status", {"fields": ("status",)}),
        ("Metadata", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(_inv_count=Count("investments"))

    @admin.display(description="Investments")
    def investments_count(self, obj: Project):
        return getattr(obj, "_inv_count", obj.investments.count())

@admin.register(ProfitPeriod)
class ProfitPeriodAdmin(admin.ModelAdmin):
    list_display = ("project", "title", "calculation_date", "total_profit_amount", "status", "distributed_at", "payout_items_count")
    list_filter = ("status", "calculation_date")
    search_fields = ("project__title", "title")
    autocomplete_fields = ("project",)
    ordering = ("-calculation_date",)
    date_hierarchy = "calculation_date"
    inlines = (PayoutItemInline,)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(_pi_count=Count("payout_items"))

    @admin.display(description="Payout Items")
    def payout_items_count(self, obj: ProfitPeriod):
        return getattr(obj, "_pi_count", obj.payout_items.count())


@admin.register(PayoutItem)
class PayoutItemAdmin(admin.ModelAdmin):
    list_display = ("period", "user", "amount", "status", "investment", "transaction", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "user__email", "period__title", "period__project__title")
    autocomplete_fields = ("period", "user", "investment", "transaction")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"


# ---------------------------------------------------------------------------
# Investments
# ---------------------------------------------------------------------------


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ("investor", "project", "amount", "status", "invest_date", "created_at")
    list_filter = ("status", "invest_date", "created_at")
    search_fields = ("investor__username", "investor__email", "project__title")
    autocomplete_fields = ("investor", "project")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "invest_date"


# ---------------------------------------------------------------------------
# Transactions
# ---------------------------------------------------------------------------


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "amount", "is_successful", "reference_id", "created_at")
    list_filter = ("type", "is_successful", "created_at")
    search_fields = ("user__username", "user__email", "reference_id")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "uploader", "file_type", "created_at")
    list_filter = ("file_type", "created_at")
    search_fields = ("title", "project__title", "uploader__username", "uploader__email")
    autocomplete_fields = ("project", "uploader")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"


# ---------------------------------------------------------------------------
# Tickets
# ---------------------------------------------------------------------------


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("subject", "user", "priority", "status", "created_at", "updated_at")
    list_filter = ("status", "priority", "created_at")
    search_fields = ("subject", "user__username", "user__email")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"


