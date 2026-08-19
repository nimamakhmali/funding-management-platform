from django.urls import path
from .views import AuditLogListView, NotificationListView, NotificationReadView

app_name = "notifications"

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("notifications/<uuid:pk>/read/", NotificationReadView.as_view(), name="notification-read"),
    path("admin/audit-logs/", AuditLogListView.as_view(), name="audit-log-list"),
]