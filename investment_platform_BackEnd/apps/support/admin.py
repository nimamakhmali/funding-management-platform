from django.contrib import admin
from apps.support.infrastructure.models import Ticket, TicketMessage


class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 0
    readonly_fields = ("created_at",)
    autocomplete_fields = ("sender",)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("subject", "user", "priority", "status", "created_at")
    list_filter = ("status", "priority")
    search_fields = ("subject", "user__username", "user__email")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [TicketMessageInline]


@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = ("ticket", "sender", "created_at")
    search_fields = ("ticket__subject", "sender__username")
    autocomplete_fields = ("ticket", "sender")
    readonly_fields = ("created_at",)
