from rest_framework import serializers
from apps.notifications.infrastructure.models import AuditLog, Notification
from apps.users.presentation.serializers import UserMinimalSerializer


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "type", "is_read", "created_at", "read_at"]
        read_only_fields = fields


class AuditLogSerializer(serializers.ModelSerializer):
    actor = UserMinimalSerializer(read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "id", "actor", "action", "entity",
            "entity_id", "description", "metadata", "created_at",
        ]
        read_only_fields = fields