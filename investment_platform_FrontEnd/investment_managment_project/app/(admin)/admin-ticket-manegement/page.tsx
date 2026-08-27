"use client";

import { useState, useCallback } from "react";
import Container from "@/components/ui/Container";
import TicketFilterForm from "@/components/pages/admin/admin-ticket-management/TicketFilterForm";
import AdminTicketTableSection from "@/components/pages/admin/admin-ticket-management/AdminTicketTableSection";
import TicketConversation from "@/components/pages/admin/admin-ticket-management/TicketConversation";
import TicketSidebar from "@/components/pages/admin/admin-ticket-management/AdminTicketUseInfo";
import { useAdminTickets, useAdminTicketDetail } from "@/lib/hooks/useAdmin";
import { AdminTicketFilters } from "@/lib/api/services/admin.service";
import {
  TicketConversationData,
  TicketMessage,
} from "@/lib/types/admin/admin-ticket-management/ticket.conversation.types";
import { TicketData } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

const TICKET_STATUSES = [
  { label: "باز", value: "OPEN" },
  { label: "در حال بررسی", value: "IN_PROGRESS" },
  { label: "بسته شده", value: "CLOSED" },
  { label: "پاسخ کاربر", value: "USER_REPLIED" },
  { label: "پاسخ ادمین", value: "ADMIN_REPLIED" },
];

const TICKET_ASSIGNEES = [
  { id: 1, name: "پشتیبانی فنی", department: "بخش فنی" },
  { id: 2, name: "پشتیبانی مالی", department: "مدیر مالی" },
];

// تشخیص admin بودن فرستنده پیام
function isAdminSender(sender: {
  is_admin?: boolean;
  role?: string;
  phone_number?: string;
}): boolean {
  if (sender.is_admin === true) return true;
  if (sender.role === "ADMIN" || sender.role === "admin") return true;
  return false;
}

export default function TicketFilterSection() {
  const [filters, setFilters] = useState<AdminTicketFilters>({
    page: 1,
    page_size: 10,
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: ticketsData, isLoading } = useAdminTickets(filters);
  const { data: ticketDetail } = useAdminTicketDetail(selectedTicketId ?? "");

  const handleFilter = useCallback(
    (f: { status: string; priority: string; category: string }) => {
      setFilters((prev) => ({
        ...prev,
        status: f.status !== "all" ? f.status : undefined,
        priority: f.priority !== "all" ? f.priority : undefined,
        page: 1,
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const conversationData: TicketConversationData | null = ticketDetail
    ? {
        id: ticketDetail.id,
        title: ticketDetail.subject,
        category: ticketDetail.priority || "عمومی",
        createdAt: ticketDetail.created_at
          ? new Date(ticketDetail.created_at).toLocaleDateString("fa-IR")
          : "—",
        messages: ticketDetail.messages.map(
          (m): TicketMessage => ({
            id: m.id,
            author: {
              // full_name اول، بعد phone_number
              name:
                m.sender.full_name ||
                m.sender.phone_number ||
                "کاربر",
              type: isAdminSender(m.sender) ? "agent" : "customer",
            },
            message: m.message,
            createdAt: m.created_at
              ? new Date(m.created_at).toLocaleDateString("fa-IR")
              : "—",
          })
        ),
      }
    : null;

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
      <TicketFilterForm onFilter={handleFilter} />

      <AdminTicketTableSection
        data={ticketsData?.results ?? []}
        isLoading={isLoading}
        totalPages={ticketsData?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={handlePageChange}
        onSelectTicket={setSelectedTicketId}
        selectedTicketId={selectedTicketId}
      />

      {selectedTicketId && conversationData && sidebarData && (
        <div className="grid grid-cols-1 gap-6 pb-12 xl:grid-cols-12 mt-6">
          <div className="xl:col-span-8">
            <TicketConversation
              data={conversationData}
              ticketId={selectedTicketId}
            />
          </div>
          <div className="xl:col-span-4">
            <TicketSidebar
              data={sidebarData}
              ticketId={selectedTicketId}
            />
          </div>
        </div>
      )}
    </Container>
  );
}