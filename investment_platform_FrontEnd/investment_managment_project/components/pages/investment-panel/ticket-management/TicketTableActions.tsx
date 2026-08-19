// components/pages/investment-panel/ticket-management/TicketTableActions.tsx
"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

interface Props {
  ticketId: string;  // ← باید id واقعی پاس داده شود
}

export default function TicketTableActions({ ticketId }: Props) {
  return (
    <Link
      href={`/invest-support/${ticketId}`}
      className="text-primary hover:text-primary-dark hover:bg-primary/5 p-2 rounded-lg transition-colors inline-flex"
      title="مشاهده جزئیات"
    >
      <Eye size={20} />
    </Link>
  );
}