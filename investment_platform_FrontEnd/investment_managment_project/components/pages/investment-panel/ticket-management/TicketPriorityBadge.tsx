import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { TicketPriority } from "@/lib/types/investment-panel/ticket-management/Ticket";
import { cn } from "@/lib/utils";

const priorityConfig: Record<
  TicketPriority,
  { label: string; className: string; icon: typeof ArrowUp }
> = {
  high: {
    label: "بالا",
    className: "text-red-500 bg-red-50",
    icon: ArrowUp,
  },
  medium: {
    label: "متوسط",
    className: "text-amber-600 bg-amber-50",
    icon: Minus,
  },
  low: {
    label: "پایین",
    className: "text-blue-500 bg-blue-50",
    icon: ArrowDown,
  },
};

export default function TicketPriorityBadge({
  priority,
}: {
  priority: TicketPriority;
}) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded w-fit",
        config.className,
      )}
    >
      <Icon size={16} />
      {config.label}
    </div>
  );
}
