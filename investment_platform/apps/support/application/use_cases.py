"""
Use Cases تیکت پشتیبانی
"""
from __future__ import annotations

from django.db import transaction as db_transaction

from apps.notifications.application.use_cases import (
    CreateAuditLogUseCase,
    CreateNotificationUseCase,
)
from apps.notifications.infrastructure.models import NotificationType
from apps.support.infrastructure.models import (
    Ticket,
    TicketMessage,
    TicketStatus,
)
from apps.users.infrastructure.models import User
from shared.exceptions import BusinessRuleViolation, PermissionDenied, ResourceNotFound


class CreateTicketUseCase:
    def execute(self, *, user: User, subject: str, priority: str, message: str) -> Ticket:
        with db_transaction.atomic():
            ticket = Ticket.objects.create(
                user=user,
                subject=subject,
                priority=priority,
                status=TicketStatus.OPEN,
            )
            TicketMessage.objects.create(
                ticket=ticket,
                sender=user,
                message=message,
            )
            CreateAuditLogUseCase().execute(
                actor=user,
                action="TICKET_CREATED",
                entity="Ticket",
                entity_id=str(ticket.id),
                description=f"تیکت «{subject}» ایجاد شد.",
            )
        return ticket


class ReplyTicketUseCase:
    def execute(
        self,
        *,
        ticket: Ticket,
        sender: User,
        message: str,
        attachment_url: str = "",
    ) -> TicketMessage:
        if not message.strip():
            raise BusinessRuleViolation("متن پیام نمی‌تواند خالی باشد.")

        # بررسی دسترسی
        if not sender.is_admin and ticket.user_id != sender.id:
            raise PermissionDenied("فقط صاحب تیکت یا ادمین می‌تواند پاسخ دهد.")

        if ticket.status == TicketStatus.CLOSED:
            raise BusinessRuleViolation("تیکت بسته‌شده قابل پاسخ نیست.")

        with db_transaction.atomic():
            msg = TicketMessage.objects.create(
                ticket=ticket,
                sender=sender,
                message=message.strip(),
                attachment_url=attachment_url or None,
            )

            # تغییر وضعیت بر اساس فرستنده
            if sender.is_admin:
                ticket.status = TicketStatus.ADMIN_REPLIED
                # نوتیف به کاربر
                CreateNotificationUseCase().execute(
                    user=ticket.user,
                    title="پاسخ جدید به تیکت شما 📩",
                    message=f"ادمین به تیکت «{ticket.subject}» پاسخ داد.",
                    notif_type=NotificationType.INFO,
                )
            else:
                ticket.status = TicketStatus.USER_REPLIED

            ticket.save(update_fields=["status", "updated_at"])

        return msg


class CloseTicketUseCase:
    def execute(self, *, ticket: Ticket, actor: User) -> Ticket:
        if not actor.is_admin and ticket.user_id != actor.id:
            raise PermissionDenied()

        if ticket.status == TicketStatus.CLOSED:
            raise BusinessRuleViolation("تیکت قبلاً بسته شده است.")

        ticket.status = TicketStatus.CLOSED
        ticket.save(update_fields=["status", "updated_at"])

        CreateAuditLogUseCase().execute(
            actor=actor,
            action="TICKET_CLOSED",
            entity="Ticket",
            entity_id=str(ticket.id),
            description=f"تیکت «{ticket.subject}» بسته شد.",
        )
        return ticket