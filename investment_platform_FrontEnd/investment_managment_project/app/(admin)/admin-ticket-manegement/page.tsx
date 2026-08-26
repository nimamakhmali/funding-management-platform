// app/(admin)/admin-ticket-manegement/page.tsx
"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import TicketFilterForm from "@/components/pages/admin/admin-ticket-management/TicketFilterForm";
import AdminTicketTableSection from "@/components/pages/admin/admin-ticket-management/AdminTicketTableSection";
import TicketConversation from "@/components/pages/admin/admin-ticket-management/TicketConversation";
import TicketSidebar from "@/components/pages/admin/admin-ticket-management/AdminTicketUseInfo";
import { useAdminTickets, useAdminTicketDetail, useAdminReplyTicket, useAdminCloseTicket } from "@/lib/hooks/useAdmin";
import { AdminTicketFilters } from "@/lib/api/services/admin.service";
import { TicketConversationData, TicketMessage } from "@/lib/types/admin/admin-ticket-management/ticket.conversation.types";
import { TicketData } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

// static data برای statuses و assignees (این‌ها از config می‌آیند نه API)
const TICKET_STATUSES = [
  { label: "در انتظار پاسخ", value: "OPEN" },
  { label: "در حال بررسی", value: "IN_PROGRESS" },
  { label: "بسته شده", value: "CLOSED" },
];

const TICKET_ASSIGNEES = [
  { id: 1, name: "پشتیبانی فنی", department: "بخش فنی" },
  { id: 2, name: "پشتیبانی مالی", department: "مدیر مالی" },
];

export default function TicketFilterSection() {
  const [filters, setFilters] = useState<AdminTicketFilters>({
    page: 1,
    page_size: 10,
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: ticketsData, isLoading } = useAdminTickets(filters);
  const { data: ticketDetail } = useAdminTicketDetail(selectedTicketId ?? "");
  const replyMutation = useAdminReplyTicket();
  const closeMutation = useAdminCloseTicket();

  // mapping بک‌اند → TicketConversationData
  const conversationData: TicketConversationData | null = ticketDetail
    ? {
        id: ticketDetail.id,
        title: ticketDetail.subject,
        category: ticketDetail.priority || "عمومی",
        createdAt: ticketDetail.created_at,
        messages: ticketDetail.messages.map(
          (m): TicketMessage => ({
            id: m.id,
            author: {
              name: m.sender.full_name || m.sender.phone_number,
              type: m.sender.is_admin ? "agent" : "customer",
            },
            message: m.message,
            createdAt: m.created_at,
          })
        ),
      }
    : null;

  // mapping بک‌اند → TicketData
  const sidebarData: TicketData | null = ticketDetail
    ? {
        user: {
          id: ticketDetail.user.id,
          name:
            ticketDetail.user.full_name ||
            ticketDetail.user.phone_number ||
            "کاربر",
          level: ticketDetail.user.role || "عادی",
          openTickets: 1,
          avatar: "",
        },
        statuses: TICKET_STATUSES,
        assignees: TICKET_ASSIGNEES,
      }
    : null;

  return (
    <Container>
      <TicketFilterForm
        onFilter={(f) =>
          setFilters((prev) => ({
            ...prev,
            status: f.status !== "all" ? f.status : undefined,
            priority: f.priority !== "all" ? f.priority : undefined,
            page: 1,
          }))
        }
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
            <TicketConversation data={conversationData} />
          </div>
          <div className="xl:col-span-4">
            <TicketSidebar data={sidebarData} />
          </div>
        </div>
      )}
    </Container>
  );
}