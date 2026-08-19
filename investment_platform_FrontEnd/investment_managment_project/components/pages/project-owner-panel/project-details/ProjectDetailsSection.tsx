// components/pages/project-owner-panel/project-details/ProjectDetailsSection.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ReusableTable } from "@/components/ui/ReusableTable";
import ProjectStatus from "@/components/ui/statusBadge";
import { NotificationsSection } from "./NotificationsSection";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import { ProjectProgressChart } from "./ProgressAnalysis";
import {
  chartConfig,
  periodOptions,
} from "@/lib/constants/project-owner-panel/project-details/progress-analysis";
import { useProjectDetail } from "@/lib/hooks/useOwnerDashboard";
import type { ProjectDocument } from "@/lib/api/services/projects.service";

// ── skeleton ──────────────────────────────────────────────────────────────────
function SectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="h-80 rounded-3xl bg-gray-100" />
        <div className="h-48 rounded-xl bg-gray-100" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="h-48 rounded-2xl bg-gray-100" />
        <div className="h-48 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

// ── تبدیل داده مستندات بک‌اند به فرمت جدول ───────────────────────────────────
function toTableRow(doc: ProjectDocument) {
  // تبدیل تاریخ میلادی به شمسی ساده
  const date = new Date(doc.created_at).toLocaleDateString("fa-IR");
  return {
    id: doc.id.slice(0, 8).toUpperCase(),
    name: doc.title,
    date,
    status: doc.doc_type_display ?? doc.doc_type,
  };
}

export default function ProjectDetailsSection() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const { data: project, isLoading } = useProjectDetail(projectId);

  if (isLoading) return <SectionSkeleton />;

  // مستندات واقعی از API یا آرایه خالی
  const documents = (project?.documents ?? []).map(toTableRow);

  // داده نمودار پیشرفت - بر اساس funding_percentage فعلی
  // (در نسخه بعدی می‌توان از تاریخچه واقعی استفاده کرد)
  const fundingPct = parseFloat(project?.funding_percentage ?? "0");
  const progressData = [
    { month: "شروع", progress: 0 },
    { month: "جاری", progress: fundingPct },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ستون اصلی */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <ProjectProgressChart
          title="تحلیل پیشرفت پروژه"
          description="روند تامین مالی"
          data={progressData}
        />

        <ReusableTable
          data={documents}
          columns={[
            {
              header: "شناسه",
              accessor: "id",
              cellClassName: "pt-4",
            },
            {
              header: "نام سند",
              accessor: "name",
            },
            {
              header: "تاریخ",
              accessor: "date",
            },
            {
              header: "وضعیت",
              accessor: (row) => <ProjectStatus status={row.status} />,
            },
          ]}
          title="مستندات پروژه"
        />
      </div>

      {/* ستون جانبی - نوتیفیکیشن و رویدادها */}
      <div className="flex flex-col gap-6">
        <NotificationsSection />
        <UpcomingEventsSection />
      </div>
    </div>
  );
}