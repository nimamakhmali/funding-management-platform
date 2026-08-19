"use client"
import { Suspense } from "react";
import ProfitReportFilter from "@/components/pages/investment-panel/profit-report/ProfitReportFilter";
import ProfitReportHeader from "@/components/pages/investment-panel/profit-report/ProfitReportHeader";
import ProfitReportInformation from "@/components/pages/investment-panel/profit-report/ProfitReportInformation";
import ProfitReportTable from "@/components/pages/investment-panel/profit-report/ProfitReportTable";
import Container from "@/components/ui/Container";

export default function ProfitReport() {
  return (
    <Container>
      <ProfitReportHeader />
      <ProfitReportInformation />
      <ProfitReportFilter />
       <Suspense fallback={<div>Loading...</div>}>
        <ProfitReportTable />
      </Suspense>
     
    </Container>
  );
}
