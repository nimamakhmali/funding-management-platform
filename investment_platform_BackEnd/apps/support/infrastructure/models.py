import uuid
from django.conf import settings
from django.db import models


class TicketPriority(models.TextChoices):
    LOW = "LOW", "کم"
    MEDIUM = "MEDIUM", "متوسط"
    HIGH = "HIGH", "زیاد"


class TicketStatus(models.TextChoices):
    OPEN = "OPEN", "باز"
    USER_REPLIED = "USER_REPLIED", "پاسخ کاربر"
    ADMIN_REPLIED = "ADMIN_REPLIED", "پاسخ پشتیبان"
    CLOSED = "CLOSED", "بسته شده"


class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tickets", db_index=True)
    subject = models.CharField(max_length=255)
    priority = models.CharField(max_length=10, choices=TicketPriority.choices, default=TicketPriority.MEDIUM)
    status = models.CharField(max_length=15, choices=TicketStatus.choices, default=TicketStatus.OPEN, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tickets"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "status"])]


class TicketMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="messages", db_index=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ticket_messages")
    message = models.TextField()
    attachment_url = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "ticket_messages"
        ordering = ["created_at"]