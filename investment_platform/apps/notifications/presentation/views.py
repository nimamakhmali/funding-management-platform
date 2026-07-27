from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions
from rest_framework.views import APIView

from apps.notifications.infrastructure.models import AuditLog, Notification
from shared.permissions import IsObserverOrAbove
from shared.responses import success_response

from .serializers import AuditLogSerializer, NotificationSerializer


@extend_schema(tags=["Notifications"], summary="لیست اعلان‌های کاربر")
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


@extend_schema(tags=["Notifications"], summary="علامت‌گذاری اعلان به‌عنوان خوانده‌شده")
class NotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        notif = get_object_or_404(Notification, pk=pk, user=request.user)
        notif.is_read = True
        notif.read_at = notif.read_at or timezone.now()
        notif.save(update_fields=["is_read", "read_at"])
        return success_response({"id": str(notif.id), "is_read": True})


@extend_schema(tags=["Admin"], summary="لاگ ممیزی سیستم (ادمین/ناظر)")
class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsObserverOrAbove]

    def get_queryset(self):
        qs = AuditLog.objects.select_related("actor").order_by("-created_at")
        p = self.request.query_params
        if p.get("action"):
            qs = qs.filter(action=p["action"])
        if p.get("entity"):
            qs = qs.filter(entity=p["entity"])
        return qs