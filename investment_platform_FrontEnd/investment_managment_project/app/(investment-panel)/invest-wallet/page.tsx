import { Suspense } from "react";
import PanelContentHeader from "@/components/ui/PanelContentHeader";
import InvestWalletCards from "@/components/pages/investment-panel/invest-wallet/investWalletCard";
import RequestManagement from "@/components/pages/investment-panel/invest-wallet/Request-management";
import WalletTransactionTable from "@/components/pages/investment-panel/invest-wallet/walletTransactionTable";

export default function InvestWalletPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8 sm:p-6 sm:space-y-10 lg:p-8 lg:space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 lg:mb-8 space-y-4 sm:space-y-0">
        <PanelContentHeader
          title="داشبورد کیف پول"
          description="نمای کلی مالی و مدیریت موجودی حساب شما"
        />
      </div>

      <InvestWalletCards />
      <RequestManagement />

      <Suspense>
        <WalletTransactionTable />
      </Suspense>
    </div>
  );
}
