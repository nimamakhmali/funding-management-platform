"use client";

import { separateThousands } from "@/lib/utils/separateThousands";
import { ChartSpline, Hourglass, Scale, TrendingUp } from "lucide-react";
import { ProfitReportCard } from "./ProfitReportCard";
import { useInvestorProfitSummary } from "@/lib/hooks/useInvestorDashboard";
import { toPersianNumber } from "@/lib/utils/Numberformat";


export default function ProfitReportInformation() {
  const { data, isLoading } = useInvestorProfitSummary();

  const totalReceived = data?.total_received ?? "0";
  const pendingAmount = data?.pending_amount ?? "0";
  const pendingCount = data?.pending_count ?? 0;
  const avgRoi = data?.avg_roi_percentage ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProfitReportCard
        title="سود کل دریافتی"
        value={isLoading ? "..." : separateThousands(totalReceived)}
        unit="تومان"
        icon={<Scale />}
        iconClassName="p-3 rounded-xl bg-primary/10 text-primary"
        badge={{
          text: isLoading ? "..." : `${toPersianNumber(avgRoi)}٪`,
          icon: <TrendingUp />,
          className:
            "flex items-center text-primary text-xs font-black bg-primary/10 px-3 py-1.5 rounded-full tabular-nums",
        }}
        bottomBarClassName="bg-primary/20"
      />

      <ProfitReportCard
        title="در انتظار پرداخت"
        value={isLoading ? "..." : separateThousands(pendingAmount)}
        unit="تومان"
        icon={<Hourglass />}
        iconClassName="p-3 rounded-xl bg-amber-50 text-amber-600"
        badge={{
          text: `${toPersianNumber(pendingCount)} فاکتور`,
          className:
            "text-text-sub text-xs font-bold tabular-nums bg-gray-100 px-3 py-1 rounded-full",
        }}
      />

      <ProfitReportCard
        title="میانگین بازدهی (ROI)"
        value={isLoading ? "..." : `${toPersianNumber(avgRoi)}٪`}
        unit="سالانه"
        icon={<ChartSpline />}
        iconClassName="p-3 rounded-xl bg-purple-50 text-purple-600"
        badge={{
          text: "ANNUALIZED",
          className:
            "text-purple-600 text-[10px] font-black uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full",
        }}
      />
    </div>
  );
}