from django.contrib import admin
from .infrastructure.models import AuditLog, Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "type", "is_read", "created_at")
    list_filter = ("type", "is_read")
    search_fields = ("user__username", "title")
    autocomplete_fields = ("user",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("actor", "action", "entity", "entity_id", "created_at")
    list_filter = ("action", "entity")
    search_fields = ("actor__username", "action", "entity_id")
    autocomplete_fields = ("actor",)
    readonly_fields = [f.name for f in AuditLog._meta.fields]

    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False
    def has_delete_permission(self, request, obj=None): return False

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("actor")