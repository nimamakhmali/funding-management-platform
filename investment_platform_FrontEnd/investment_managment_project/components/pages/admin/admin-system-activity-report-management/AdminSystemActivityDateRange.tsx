"use client";

import { Control } from "react-hook-form";
import FormDatePickerField from "@/components/ui/FormDatePickerField";
import { AdminSystemActivityManagement } from "@/lib/types/admin/admin-system-activity-report-management/AdminSystemActivityManagement";


type Props = {
  control: Control< AdminSystemActivityManagement>;
};

export default function AdminSystemActivityDateRange({
  control,
}: Props) {
  return (
    <>
      <FormDatePickerField
        control={control}
        name="dateRange"
        label="از تاریخ"
      />

      <FormDatePickerField
        control={control}
        name="fromDateRange"
        label="تا تاریخ"
      />
    </>
  );
}