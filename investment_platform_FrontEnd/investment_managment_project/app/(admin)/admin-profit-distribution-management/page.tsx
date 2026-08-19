import AdminProfitTable from "@/components/pages/admin/admin-profit-management/AdminProfitTable"
import AdminProfitSummaryCards from "@/components/pages/admin/admin-profit-management/ProfitSummaryCard"
import Container from "@/components/ui/Container"
import { profitSummaryCards } from "@/lib/constants/admin/admin-profit-management/profitSummaryCards"
import { profitHistory, profitSupervisors } from "@/lib/constants/admin/admin-profit-management/ProfitHistory";
import ProfitHistoryTimeline from "@/components/pages/admin/admin-profit-management/ProfitHistoryTimeline";
import ProfitSecurityCard from "@/components/pages/admin/admin-profit-management/ProfitSecurityCard";
import AdminProfitManagementHeader from "@/components/pages/admin/admin-profit-management/AdminProfitManagementHeader";
export default function Page() {
  return (
    <Container>
      <AdminProfitManagementHeader />
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {profitSummaryCards.map((card) => (
          <AdminProfitSummaryCards
            key={card.title}
            card={card}
          />
        ))}
      </div>
      <AdminProfitTable />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProfitHistoryTimeline
          items={profitHistory}
        />
        <ProfitSecurityCard
          supervisors={profitSupervisors}
        />
      </div>
    </Container>
  )
}