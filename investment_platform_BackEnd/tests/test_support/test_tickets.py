"""
تست‌های تیکت پشتیبانی
"""
import pytest
from rest_framework import status

from apps.support.infrastructure.models import Ticket, TicketStatus


@pytest.mark.django_db
class TestTickets:
    def test_create_ticket(self, authenticated_client):
        payload = {
            "subject": "مشکل در پرداخت",
            "priority": "MEDIUM",
            "message": "سلام، پرداختم انجام نشد.",
        }
        response = authenticated_client.post("/api/v1/tickets/", payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert Ticket.objects.filter(subject="مشکل در پرداخت").exists()

    def test_reply_to_ticket_by_owner(self, authenticated_client, investor_user):
        ticket = Ticket.objects.create(
            user=investor_user, subject="Test", priority="LOW", status=TicketStatus.OPEN
        )
        payload = {"message": "این یک پاسخ تستی است"}
        response = authenticated_client.post(
            f"/api/v1/tickets/{ticket.id}/reply/", payload
        )
        assert response.status_code == status.HTTP_201_CREATED

        ticket.refresh_from_db()
        assert ticket.status == TicketStatus.USER_REPLIED

    def test_close_ticket(self, authenticated_client, investor_user):
        ticket = Ticket.objects.create(
            user=investor_user, subject="Test", priority="LOW"
        )
        response = authenticated_client.post(f"/api/v1/tickets/{ticket.id}/close/")
        assert response.status_code == status.HTTP_200_OK

        ticket.refresh_from_db()
        assert ticket.status == TicketStatus.CLOSED