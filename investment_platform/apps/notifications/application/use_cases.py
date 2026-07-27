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


class LogActionUseCase:
    def execute(self, *, actor=None, action: str, entity: str, entity_id: str | None = None,
                description: str = "", metadata: dict | None = None, ip_address: str | None = None) -> AuditLog:
        return AuditLog.objects.create(
            actor=actor, action=action, entity=entity, entity_id=entity_id,
            description=description, metadata=metadata or {}, ip_address=ip_address,
        )
        

create_notification = CreateNotificationUseCase()
log_action = LogActionUseCase()
        

class CreateAuditLogUseCase:
    """
    ثبت لاگ ممیزی برای عملیات مهم سیستم
    """

    def execute(
        self,
        *,
        actor,
        action: str,
        entity: str,
        entity_id: str = None,
        description: str = "",
        metadata: dict = None,
        ip_address: str = None,
    ):
        from apps.notifications.infrastructure.models import AuditLog
        return AuditLog.objects.create(
            actor=actor,
            action=action,
            entity=entity,
            entity_id=entity_id,
            description=description,
            metadata=metadata or {},
            ip_address=ip_address or "",
        )
