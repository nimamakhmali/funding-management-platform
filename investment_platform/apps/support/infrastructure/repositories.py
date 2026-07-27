from .models import Ticket


class TicketRepository:
    def visible_to(self, user):
        qs = Ticket.objects.select_related("user").prefetch_related("messages__sender")
        return qs.all() if user.is_staff else qs.filter(user=user)