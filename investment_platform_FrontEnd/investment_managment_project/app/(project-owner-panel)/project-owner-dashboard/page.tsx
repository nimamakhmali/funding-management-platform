import Container from "@/components/ui/Container";

import ProjectOwnerDashboardCards from "@/components/pages/project-owner-panel/project-owner-dashboard/ProjectOwnerDashboardCardSection";
import ProjectOwnerChartCard from "@/components/pages/project-owner-panel/project-owner-dashboard/ProjectOwnerChartSection";
import ProjectOwnerActiveProject from "@/components/pages/project-owner-panel/project-owner-dashboard/ProjectOwnerActiveProject";
import ProjectOwnerStatsSection from "@/components/pages/project-owner-panel/project-owner-dashboard/ProjectOwnerStatsSection";
import ProjectOwnerMessagesSection from "@/components/pages/project-owner-panel/project-owner-dashboard/ProjectOwnerMessagesSection";
import ProjectOwnerTipsCard from "@/components/pages/project-owner-panel/project-owner-dashboard/ProjectOwnerTipsCard";

export default function Page() {
  return (
    <Container>
      <div className="space-y-8">
        <ProjectOwnerDashboardCards />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <ProjectOwnerChartCard />
            <ProjectOwnerActiveProject />
          </div>
          <div className="space-y-8">
            <ProjectOwnerStatsSection />
            <ProjectOwnerMessagesSection />
            <ProjectOwnerTipsCard />
          </div>
        </div>
      </div>
    </Container>
  );
}