// components/pages/investment-panel/invest-wallet/investWalletCard.tsx
"use client";

import Card from "@/components/ui/Card";
import { TrendingUp, Wallet } from "lucide-react";
import { useWallet, useTransactions } from "@/lib/hooks/useInvestorDashboard";

function fmt(val: string | number): string {
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return "۰";
  return n.toLocaleString("fa-IR");
}

export default function WalletCards() {
  const { data: wallet, isLoading } = useWallet();

  // سود در انتظار = تراکنش‌های PROFIT که هنوز به‌حساب نرسیده
  const { data: profitTx } = useTransactions({
    page: 1,
    page_size: 100,
    type: "PROFIT",
    success: false,
  });

  const pendingProfit =
    profitTx?.results?.reduce(
      (sum, tx) => sum + parseFloat(tx.amount),
      0
    ) ?? 0;

  const balance = fmt(wallet?.available_balance ?? "0");
  const pending = fmt(pendingProfit);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full z-10" />
        <Card
          data={{
            title: "موجودی قابل استفاده",
            value: isLoading ? "..." : balance,
            unit: "تومان",
            icon: Wallet,
          }}
          mapping={{
            title: "title",
            value: "value",
            unit: "unit",
            icon: "icon",
          }}
          iconPosition="header"
        />
      </div>

      <Card
        data={{
          title: "سود در انتظار",
          value: isLoading ? "..." : pending,
          unit: "تومان",
          icon: TrendingUp,
        }}
        mapping={{
          title: "title",
          value: "value",
          unit: "unit",
          icon: "icon",
        }}
        iconPosition="header"
        className="p-4"
      />
    </div>
  );
}