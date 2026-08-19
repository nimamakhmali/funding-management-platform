import ProjectOwnerChart from "./ProjectOwnerChart";
import ProjectOwnerChartHeader from "./ProjectOwnerChartHeader";

export default function ProjectOwnerChartCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
      <ProjectOwnerChartHeader
        title="عملکرد مالی طرح‌ها"
      />

      <ProjectOwnerChart />
    </div>
  );
}