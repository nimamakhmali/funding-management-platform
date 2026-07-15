"""
Views اعلان‌ها و لاگ ممیزی
"""
from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.infrastructure.models import AuditLog, Notification
from shared.permissions import IsAdmin

from .serializers import AuditLogSerializer, NotificationSerializer


@extend_schema(tags=["Notifications"], summary="لیست اعلان‌های کاربر")
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user)
        is_read = self.request.query_params.get("is_read")
        if is_read in {"true", "false"}:
            qs = qs.filter(is_read=(is_read == "true"))
        return qs.order_by("-created_at")


@extend_schema(
    tags=["Notifications"],
    summary="علامت‌گذاری اعلان به‌عنوان خوانده‌شده",
    responses={
        200: {"type": "object", "properties": {"status": {"type": "string"}}}
    },
)
class NotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        notif = get_object_or_404(Notification, pk=pk, user=request.user)
        if not notif.is_read:
            notif.is_read = True
            notif.read_at = timezone.now()
            notif.save(update_fields=["is_read", "read_at"])
        return Response({"status": "read"})


@extend_schema(
    tags=["Admin"],
    summary="لاگ ممیزی سیستم (ادمین)",
    parameters=[
        OpenApiParameter("action", OpenApiTypes.STR, description="فیلتر نوع عملیات"),
        OpenApiParameter("entity", OpenApiTypes.STR, description="فیلتر نوع موجودیت"),
    ],
)
class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = AuditLog.objects.select_related("actor").all()
        action = self.request.query_params.get("action")
        entity = self.request.query_params.get("entity")
        if action:
            qs = qs.filter(action=action)
        if entity:
            qs = qs.filter(entity=entity)
        return qs.order_by("-created_at")