from django.contrib import admin
from django.db.models import Count

from .infrastructure.models import Document, Project, ProjectStatusHistory


class DocumentInline(admin.TabularInline):
    model = Document
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "category", "status", "required_budget", "raised_amount",
                     "funding_percentage", "investments_count", "created_at")
    list_filter = ("status", "category")
    search_fields = ("title", "owner__username")
    autocomplete_fields = ("owner",)
    inlines = (DocumentInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner").annotate(_inv=Count("investments"))

    @admin.display(description="سرمایه‌گذاری‌ها")
    def investments_count(self, obj):
        return obj._inv


@admin.register(ProjectStatusHistory)
class ProjectStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ("project", "from_status", "to_status", "changed_by", "created_at")
    autocomplete_fields = ("project", "changed_by")


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "doc_type", "uploader", "created_at")
    autocomplete_fields = ("project", "uploader")