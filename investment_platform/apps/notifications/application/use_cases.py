"""
Use Cases اعلان‌ها و لاگ ممیزی
"""
from apps.notifications.infrastructure.models import AuditLog, Notification, NotificationType


class CreateNotificationUseCase:
    def execute(
        self, *, user, title: str, message: str,
        notif_type: str = NotificationType.INFO,
    ) -> Notification:
        return Notification.objects.create(
            user=user, title=title, message=message, type=notif_type,
        )


class CreateAuditLogUseCase:
    def execute(
        self, *, actor=None, action: str, entity: str,
        entity_id: str = "", description: str = "", metadata: dict | None = None,
    ) -> AuditLog:
        return AuditLog.objects.create(
            actor=actor,
            action=action,
            entity=entity,
            entity_id=entity_id or "",
            description=description,
            metadata=metadata or {},
        )
