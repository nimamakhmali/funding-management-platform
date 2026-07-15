"""
Serializer های تیکت
"""
from rest_framework import serializers

from apps.support.infrastructure.models import Ticket, TicketMessage, TicketPriority
from apps.users.presentation.serializers import UserMinimalSerializer


class TicketMessageSerializer(serializers.ModelSerializer):
    sender = UserMinimalSerializer(read_only=True)

    class Meta:
        model = TicketMessage
        fields = ["id", "sender", "message", "attachment_url", "created_at"]
        read_only_fields = fields


class TicketSerializer(serializers.ModelSerializer):
    user = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id", "user", "subject", "priority",
            "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "status", "created_at", "updated_at"]


class TicketDetailSerializer(TicketSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)

    class Meta(TicketSerializer.Meta):
        fields = TicketSerializer.Meta.fields + ["messages"]


class TicketCreateSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    priority = serializers.ChoiceField(
        choices=TicketPriority.choices,
        default=TicketPriority.MEDIUM,
    )
    message = serializers.CharField(min_length=10)


class TicketReplySerializer(serializers.Serializer):
    message = serializers.CharField(min_length=1)
    attachment_url = serializers.URLField(required=False, allow_blank=True)