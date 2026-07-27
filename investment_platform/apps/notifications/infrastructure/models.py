import uuid
from django.conf import settings
from django.db import models


class NotificationType(models.TextChoices):
    INFO = "INFO", "اطلاع‌رسانی"
    WARNING = "WARNING", "هشدار"
    SUCCESS = "SUCCESS", "موفق"
    ERROR = "ERROR", "خطا"


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                              related_name="notifications", db_index=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=12, choices=NotificationType.choices, default=NotificationType.INFO)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "is_read"]), models.Index(fields=["created_at"])]

    def __str__(self):
        return f"Notification({self.user_id}, {self.title})"


class AuditLog(models.Model):
    """
    لاگ ممیزی Append-Only طبق OWASP ASVS L2 (قابل حسابرسی، غیرقابل حذف/ویرایش).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="audit_logs", db_index=True,
    )
    action = models.CharField(max_length=64, db_index=True)
    entity = models.CharField(max_length=64, db_index=True)
    entity_id = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    description = models.TextField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["actor"]),
            models.Index(fields=["action"]),
            models.Index(fields=["entity", "entity_id"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"AuditLog({self.action}, {self.entity}, {self.entity_id})"

    def save(self, *args, **kwargs):
        if self.pk and AuditLog.objects.filter(pk=self.pk).exists():
            raise ValueError("رکوردهای AuditLog غیرقابل ویرایش هستند (Append-Only).")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("رکوردهای AuditLog غیرقابل حذف هستند (Append-Only).")