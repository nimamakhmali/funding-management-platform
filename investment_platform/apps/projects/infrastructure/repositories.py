from .models import Project


class ProjectRepository:
    def get_by_id(self, project_id) -> Project | None:
        return Project.objects.select_related("owner").filter(pk=project_id).first()

    def for_update(self, project_id) -> Project:
        return Project.objects.select_for_update().get(pk=project_id)

    def list_public(self, *, status_in=None, category=None, q=None, min_profit_rate=None):
        qs = Project.objects.select_related("owner").all()
        if status_in:
            qs = qs.filter(status__in=status_in)
        if category:
            qs = qs.filter(category=category)
        if q:
            from django.db.models import Q
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        if min_profit_rate:
            qs = qs.filter(profit_rate_percentage__gte=min_profit_rate)
        return qs.order_by("-created_at")