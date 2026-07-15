"""
Views تیکت پشتیبانی
"""
from __future__ import annotations

from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.support.application.use_cases import (
    CloseTicketUseCase,
    CreateTicketUseCase,
    ReplyTicketUseCase,
)
from apps.support.infrastructure.models import Ticket
from shared.permissions import IsOwnerOrAdmin

from .serializers import (
    TicketCreateSerializer,
    TicketDetailSerializer,
    TicketReplySerializer,
    TicketSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Tickets"], summary="لیست تیکت‌ها"),
    retrieve=extend_schema(tags=["Tickets"], summary="جزئیات تیکت با پیام‌ها"),
    create=extend_schema(tags=["Tickets"], summary="ایجاد تیکت"),
    destroy=extend_schema(tags=["Tickets"], summary="حذف تیکت"),
)
class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        qs = Ticket.objects.select_related("user").prefetch_related(
            "messages__sender"
        )
        if self.request.user.is_admin:
            return qs.all().order_by("-created_at")
        return qs.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_class(self):
        if self.action == "create":
            return TicketCreateSerializer
        if self.action == "retrieve":
            return TicketDetailSerializer
        return TicketSerializer

    def get_permissions(self):
        if self.action in {"retrieve", "destroy", "reply", "close"}:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = TicketCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = CreateTicketUseCase().execute(
            user=request.user,
            **serializer.validated_data,
        )
        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_201_CREATED,
        )

    def destroy(self, request, *args, **kwargs):
        ticket = self.get_object()
        CloseTicketUseCase().execute(ticket=ticket, actor=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        tags=["Tickets"],
        summary="پاسخ به تیکت",
        request=TicketReplySerializer,
        responses={
            201: {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "created_at": {"type": "string"},
                },
            }
        },
    )
    @action(detail=True, methods=["post"])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        msg = ReplyTicketUseCase().execute(
            ticket=ticket,
            sender=request.user,
            message=serializer.validated_data["message"],
            attachment_url=serializer.validated_data.get("attachment_url", ""),
        )
        return Response(
            {"id": str(msg.id), "created_at": msg.created_at},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        tags=["Tickets"],
        summary="بستن تیکت",
        responses={200: {"type": "object", "properties": {"status": {"type": "string"}}}},
    )
    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        ticket = self.get_object()
        CloseTicketUseCase().execute(ticket=ticket, actor=request.user)
        return Response({"status": "closed"})