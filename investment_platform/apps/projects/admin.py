from django.contrib import admin
from apps.projects.infrastructure.models import Document, Project, ProjectStatusHistory


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "status", "required_budget", "raised_amount", "created_at")
    list_filter = ("status", "category", "created_at")
    search_fields = ("title", "owner__username", "owner__email")
    readonly_fields = ("created_at", "updated_at", "funding_percentage", "is_funding_complete")
    autocomplete_fields = ("owner",)


@admin.register(ProjectStatusHistory)
class ProjectStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ("project", "from_status", "to_status", "changed_by", "created_at")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("project", "changed_by")


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "uploader", "file_type", "created_at")
    search_fields = ("title", "project__title")
    autocomplete_fields = ("project", "uploader")
    readonly_fields = ("created_at",)
