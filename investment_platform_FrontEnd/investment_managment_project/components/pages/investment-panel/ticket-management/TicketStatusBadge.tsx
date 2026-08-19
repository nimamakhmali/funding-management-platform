import { CheckCircle2, CircleDot, Clock } from "lucide-react";

import { TicketStatus } from "@/lib/types/investment-panel/ticket-management/Ticket";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  TicketStatus,
  { label: string; className: string; icon: typeof CircleDot; pulse?: boolean }
> = {
  open: {
    label: "باز",
    className: "bg-blue-50 text-blue-600 border border-blue-100",
    icon: CircleDot,
    pulse: true,
  },
  in_progress: {
    label: "در حال انجام",
    className: "bg-amber-50 text-amber-600 border border-amber-100",
    icon: Clock,
  },
  closed: {
    label: "بسته شده",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    icon: CheckCircle2,
  },
};

export default function TicketStatusBadge({
  status,
}: {
  status: TicketStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold",
        config.className,
      )}
    >
      {config.pulse ? (
        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
      ) : (
        <Icon className="text-[14px]" size={14} />
      )}
      {config.label}
    </span>
  );
}
