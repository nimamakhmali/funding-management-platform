"use client";

import { Filter } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import ProjectSelect from "./ProjectSelectField";
import ReportDateRange from "./ReportDateRange";
import ReportTypeSelect from "./ReportTypeSelect";
import ReportFilterButtons from "./ReportFilterButtons";
import { ReportFilterFormValues } from "@/lib/types/project-owner-panel/reports/ReportFilterFormValues";
import type { OwnerReportParams } from "@/lib/api/services/owner-dashboard.service";

interface Props {
  onFilter: (params: OwnerReportParams) => void;
  onReset: () => void;
}

export default function ReportFilterSection({ onFilter, onReset }: Props) {
  const { control, handleSubmit, reset } =
    useForm<ReportFilterFormValues>({
      defaultValues: {
        project: "all",
        fromDate: "",
        toDate: "",
        reportType: "financial",
      },
    });

  const onSubmit: SubmitHandler<ReportFilterFormValues> = (data) => {
    const params: OwnerReportParams = {};
    if (data.project && data.project !== "all") {
      params.project_id = data.project;
    }
    if (data.fromDate) params.date_from = data.fromDate;
    if (data.toDate) params.date_to = data.toDate;
    if (data.reportType) params.report_type = data.reportType;
    onFilter(params);
  };

  function handleReset() {
    reset();
    onReset();
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-text-main">فیلتر گزارش‌ها</h3>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        <ProjectSelect control={control} />
        <ReportDateRange control={control} />
        <ReportTypeSelect control={control} />
        <ReportFilterButtons onReset={handleReset} />
      </form>
    </section>
  );
}

