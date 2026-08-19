"use client";

import { use } from "react";
import { useMyInvestmentByProject } from "@/lib/hooks/useInvestorDashboard";
import { useWallet } from "@/lib/hooks/useInvestorDashboard";
import InvestmentProjectHeader from "@/components/pages/investment-panel/investment-projects/InvestmentProjectHeader";
import InvestmentProjectCardConnected from "@/components/pages/investment-panel/investment-projects/InvestmentProjectCard";
import { InvestmentProjectAmountConnected } from "@/components/pages/investment-panel/investment-projects/InvestmentProjectAmount";
import { ProfitCalculationCardConnected } from "@/components/pages/investment-panel/investment-projects/ProfitCalculation";

type Props = { params: Promise<{ id: string }> };

export default function Page({ params }: Props) {
  const { id } = use(params);
  const { data, isLoading } = useMyInvestmentByProject(id);
  const { data: wallet } = useWallet();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-64 bg-gray-100 rounded-2xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const balance = parseFloat(wallet?.available_balance ?? "0");

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <InvestmentProjectHeader />
      <InvestmentProjectCardConnected project={data.project} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2">
          <InvestmentProjectAmountConnected
            projectId={id}
            minAmount={parseFloat(data.project.min_investment_amount)}
            maxAmount={parseFloat(data.project.max_investment_amount)}
            balance={balance}
          />
        </div>
        <div className="lg:col-span-1">
          <ProfitCalculationCardConnected
            profitRate={parseFloat(data.project.profit_rate_percentage)}
            minAmount={parseFloat(data.project.min_investment_amount)}
            existingInvestment={
              data.my_investment
                ? parseFloat(data.my_investment.amount)
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}