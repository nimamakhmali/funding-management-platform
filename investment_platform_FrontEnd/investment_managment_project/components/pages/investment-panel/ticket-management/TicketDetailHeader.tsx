// components/pages/investment-panel/ticket-management/TicketDetailHeader.tsx
import { ArrowRight, Ban, CalendarDays, RefreshCw } from "lucide-react";
import Link from "next/link";
import { TicketDetail } from "@/lib/types/investment-panel/ticket-management/TicketDetail";

interface Props {
  ticket: TicketDetail;
  onClose?: () => void;
  isClosing?: boolean;
}

export default function TicketDetailHeader({ ticket, onClose, isClosing }: Props) {
  return (
    <header className="mb-6 flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            {ticket.subject}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <span className="size-1.5 rounded-full bg-blue-600" />
            {ticket.statusLabel}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <span className="font-medium">شناسه:</span>
            {ticket.id}
          </span>
          <span className="hidden h-3 w-px bg-gray-300 sm:inline-block" />
          <span className="flex items-center gap-1">
            <CalendarDays size={16} />
            <time dateTime={ticket.createdDateTime}>{ticket.createdAt}</time>
          </span>
          <span className="hidden h-3 w-px bg-gray-300 sm:inline-block" />
          <span className="hidden items-center gap-1 sm:flex">
            <RefreshCw size={16} />
            آخرین بروزرسانی: {ticket.updatedAt}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/invest-support"
          className="flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-main shadow-sm transition-colors hover:bg-gray-50"
        >
          <ArrowRight size={20} />
          <span>بازگشت به تیکت‌ها</span>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isClosing}
            className="flex items-center justify-center gap-2 rounded-md border border-red-200 bg-surface px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Ban size={20} />
            <span className="hidden sm:inline">
              {isClosing ? "در حال بستن..." : "بستن تیکت"}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}