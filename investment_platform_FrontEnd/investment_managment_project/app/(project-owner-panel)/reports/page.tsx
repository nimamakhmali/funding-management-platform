"use client";

import { useState, useCallback } from "react";
import ProfitHeader from "@/components/pages/project-owner-panel/reports/ReportHeader";
import ReportFilterSection from "@/components/pages/project-owner-panel/reports/ReportFilterSection";
import Container from "@/components/ui/Container";
import StatisticsCards from "@/components/pages/project-owner-panel/reports/StatisticCardSection";
import ProjectComparisonChart from "@/components/pages/investment-panel/profit-report/ProjectComparisonChart";
import ProjectStatusChart from "@/components/pages/project-owner-panel/reports/ProjectStatusChart";
import { ReusableTable } from "@/components/ui/ReusableTable";
import { reportColumns } from "@/components/pages/project-owner-panel/reports/ReportTable";
import { useOwnerReports } from "@/lib/hooks/useOwnerReports";
import type { OwnerReportParams } from "@/lib/api/services/owner-dashboard.service";
import type { Report } from "@/lib/types/project-owner-panel/reports/ReportTable";
import { toPersianNumber } from "@/lib/utils/Numberformat";

export default function Page() {
  const [filters, setFilters] = useState<OwnerReportParams>({});
  const { data, isLoading } = useOwnerReports(filters);

  const handleFilter = useCallback((params: OwnerReportParams) => {
    setFilters(params);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({});
  }, []);

  // تبدیل داده API به فرمت جدول
  const tableData: Report[] = (data?.table ?? []).map((row, index) => ({
    id: index + 1,
    projectName: row.project_name,
    startDate: row.start_date,
    targetAmount: `${toPersianNumber(
      Math.round(parseFloat(row.target_amount) / 1_000_000)
    )} م‌ت`,
    raisedAmount: `${toPersianNumber(
      Math.round(parseFloat(row.raised_amount) / 1_000_000)
    )} م‌ت`,
    progress: Math.round(row.progress),
    status: row.status,
  }));

  return (
    <div>
      <ProfitHeader />
      <ReportFilterSection
        onFilter={handleFilter}
        onReset={handleReset}
      />
      <StatisticsCards filters={filters} />
      <Container>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProjectComparisonChart filters={filters} />
          <ProjectStatusChart filters={filters} />
        </section>

        {isLoading ? (
          <div className="mt-6 space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <ReusableTable
            title="جزئیات گزارش"
            data={tableData}
            columns={reportColumns}
          />
        )}
      </Container>
    </div>
  );
}