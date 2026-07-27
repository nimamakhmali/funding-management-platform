from rest_framework import serializers
from apps.notifications.infrastructure.models import AuditLog, Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "type", "is_read", "created_at", "read_at"]
        read_only_fields = fields


class AuditLogSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source="actor.username", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = ["id", "actor", "actor_username", "action", "entity", "entity_id",
                  "description", "metadata", "ip_address", "created_at"]
        read_only_fields = fields