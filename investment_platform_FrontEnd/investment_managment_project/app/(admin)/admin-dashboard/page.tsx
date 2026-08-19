"use client"
import AdminDashboardChart from "@/components/pages/admin/admin-dashboard/AdminDashboardChart";
import DashboardCard from "@/components/pages/admin/admin-dashboard/DashboardCard";
import Container from "@/components/ui/Container";
import { DASHBOARD_CARDS } from "@/lib/constants/admin/admin-dashboard/AdminDashboardCard";
import AdminDashboardAlerts from "@/components/pages/admin/admin-dashboard/AdminDashboardAlerts";
import AdminDashboardTransactionTable from "@/components/pages/admin/admin-dashboard/AdminRecentTransactionTable";
import AdminDashboardHeader from "@/components/pages/admin/admin-dashboard/AdminDashboardHeader";
export default function Page(){
    return(
        <Container>
            <AdminDashboardHeader />
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {DASHBOARD_CARDS.map((card) => (
      <DashboardCard
        key={card.title}
        {...card}
      />
    ))}
  </div>

  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <AdminDashboardChart />
    </div>

    <div className="lg:col-span-1">
      <AdminDashboardAlerts />
    </div>
  </div>
  <AdminDashboardTransactionTable />
</Container>

    )

}