"use client";

import { Control } from "react-hook-form";
import FormDatePickerField from "@/components/ui/FormDatePickerField";
import { ReportFilterFormValues } from "@/lib/types/project-owner-panel/reports/ReportFilterFormValues";

type Props = {
  control: Control<ReportFilterFormValues>;
};

export default function ReportDateRange({
  control,
}: Props) {
  return (
    <>
      <FormDatePickerField
        control={control}
        name="fromDate"
        label="از تاریخ"
      />

      <FormDatePickerField
        control={control}
        name="toDate"
        label="تا تاریخ"
      />
    </>
  );
}