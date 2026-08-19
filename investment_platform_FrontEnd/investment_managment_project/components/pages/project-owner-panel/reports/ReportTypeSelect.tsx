"use client";

import { Control } from "react-hook-form";

import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { ReportFilterFormValues } from "@/lib/types/project-owner-panel/reports/ReportFilterFormValues";
import { reportTypes } from "@/lib/constants/project-owner-panel/reports/ReportFilterFormValues";

type Props = {
  control: Control<ReportFilterFormValues>;
};

export default function ReportTypeSelect({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
      control={control}
      name="reportType"
      label="نوع گزارش"
      options={reportTypes}
      getOptionLabel={(item) => item.title}
      getOptionValue={(item) => item.id}
    />
  );
}