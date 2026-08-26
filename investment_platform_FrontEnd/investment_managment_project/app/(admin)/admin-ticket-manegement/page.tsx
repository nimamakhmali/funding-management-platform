"use client";
import { useState } from "react";
import Container from "@/components/ui/Container";
import TicketFilterForm from "@/components/pages/admin/admin-ticket-management/TicketFilterForm";
import AdminTicketTableSection from "@/components/pages/admin/admin-ticket-management/AdminTicketTableSection";
import TicketConversation from "@/components/pages/admin/admin-ticket-management/TicketConversation";
import TicketSidebar from "@/components/pages/admin/admin-ticket-management/AdminTicketUseInfo";
import { useAdminTickets, useAdminTicketDetail } from "@/lib/hooks/useAdmin";
import { AdminTicketFilters } from "@/lib/api/services/admin.service";
import { MessageAuthorType, TicketConversationData } from "@/lib/types/admin/admin-ticket-management/ticket.conversation.types";
import { TicketData } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

export default function TicketFilterSection() {
  const [filters, setFilters] = useState<AdminTicketFilters>({ page: 1, page_size: 10 });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: ticketsData, isLoading } = useAdminTickets(filters);
  const { data: ticketDetail } = useAdminTicketDetail(selectedTicketId ?? "");

  const conversationData: TicketConversationData | null = ticketDetail
    ? {
        id: ticketDetail.id,
        title: ticketDetail.subject,
        category: "",
        createdAt: ticketDetail.created_at,
        messages: ticketDetail.messages.map((m) => ({
          id: m.id,
          author: {
            name: m.sender.full_name || m.sender.phone_number,
            type: (m.sender.is_admin ? "agent" : "customer") as MessageAuthorType,
          },
          message: m.message,
          createdAt: m.created_at,
        })),
      }
    : null;

  const sidebarData: TicketData | null = ticketDetail
    ? {
        user: {
          id: ticketDetail.user.id,
          name: ticketDetail.user.full_name || ticketDetail.user.phone_number,
          level: ticketDetail.user.role || "",
          openTickets: 0,
        },
        statuses: [],
        assignees: [],
      }
    : null;

  return (
    <Container>
      <TicketFilterForm
        onFilter={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
      />
      <AdminTicketTableSection
        data={ticketsData?.results ?? []}
        isLoading={isLoading}
        totalPages={ticketsData?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onSelectTicket={setSelectedTicketId}
        selectedTicketId={selectedTicketId}
      />
      {selectedTicketId && conversationData && sidebarData && (
        <div className="grid grid-cols-1 gap-6 pb-12 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <TicketConversation
              data={conversationData}
            />
          </div>
          <div className="xl:col-span-4">
            <TicketSidebar data={sidebarData} />
          </div>
        </div>
      )}
    </Container>
  );
}