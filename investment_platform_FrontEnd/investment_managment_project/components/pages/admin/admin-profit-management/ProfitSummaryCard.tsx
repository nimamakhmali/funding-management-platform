import { TrendingUp } from "lucide-react";
import { ProfitSummaryCard } from "@/lib/types/admin/admin-profit-management/ProfitSummaryCard-types";

interface Props {
  card: ProfitSummaryCard;
}

export default function AdminProfitSummaryCards({ card }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          {card.title}
        </span>

        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {card.icon}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-black text-[#131118]">
          {card.value.toLocaleString("fa-IR")}

          <span className="mr-1 text-xs font-normal text-gray-400">
            {card.unit}
          </span>
        </p>

        <div
          className={`mt-2 flex items-center gap-1 text-[11px] font-medium ${
            card.highlighted
              ? "text-primary"
              : "text-gray-400"
          }`}
        >
          {card.highlighted && <TrendingUp size={14} />}

          {card.description}
        </div>
      </div>
    </div>
  );
}