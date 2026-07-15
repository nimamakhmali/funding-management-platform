from django.contrib import admin
from apps.notifications.infrastructure.models import AuditLog, Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "type", "is_read", "created_at")
    list_filter = ("type", "is_read")
    search_fields = ("user__username", "title")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "read_at")

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("actor", "action", "entity", "entity_id", "created_at")
    list_filter = ("action", "entity")
    search_fields = ("actor__username", "action", "entity_id", "description")
    autocomplete_fields = ("actor",)
    readonly_fields = ("created_at",)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False
