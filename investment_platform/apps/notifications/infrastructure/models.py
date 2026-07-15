"""
Django ORM Models برای اعلان‌ها و لاگ ممیزی
"""
import uuid
from django.db import models


class NotificationType(models.TextChoices):
    INFO = "INFO", "اطلاع‌رسانی"
    WARNING = "WARNING", "هشدار"
    SUCCESS = "SUCCESS", "موفق"
    ERROR = "ERROR", "خطا"


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(
        max_length=12, choices=NotificationType.choices,
        default=NotificationType.INFO, db_index=True,
    )
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "is_read"])]

    def __str__(self):
        return f"Notification({self.user_id}, {self.title})"


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=64, db_index=True)
    entity = models.CharField(max_length=64, db_index=True)
    entity_id = models.CharField(max_length=64, blank=True, db_index=True)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["actor"]),
            models.Index(fields=["action", "entity"]),
        ]

    def delete(self, *args, **kwargs):
        raise PermissionError("حذف لاگ ممیزی مجاز نیست.")

    def __str__(self):
        return f"AuditLog({self.action}, {self.entity})"
