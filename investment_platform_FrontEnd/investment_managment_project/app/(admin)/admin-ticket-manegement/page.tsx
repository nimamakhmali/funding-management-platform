"use client";
import Container from "@/components/ui/Container";
import TicketFilterForm from "@/components/pages/admin/admin-ticket-management/TicketFilterForm";

import AdminTicketTableSection from "@/components/pages/admin/admin-ticket-management/AdminTicketTableSection";


import TicketConversation from "@/components/pages/admin/admin-ticket-management/TicketConversation";
import TicketSidebar from "@/components/pages/admin/admin-ticket-management/AdminTicketUseInfo";

import { ticketConversationMock } from "@/lib/constants/admin/admin-ticket-management/ticket.conversation.data";
import { ticketSidebarMock } from "@/lib/constants/admin/admin-ticket-management/ticket.userInfo";

export default function TicketFilterSection() {
  return (
    <Container>
      <TicketFilterForm />
      <AdminTicketTableSection />
      <div className="grid grid-cols-1 gap-6 pb-12 xl:grid-cols-12">
  <div className="xl:col-span-8">
    <TicketConversation data={ticketConversationMock} />
  </div>

  <div className="xl:col-span-4">
    <TicketSidebar data={ticketSidebarMock} />
  </div>
</div>
    </Container>
    
  );
}