"use client";

import { Control } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { AdminSystemActivityManagement } from "@/lib/types/admin/admin-system-activity-report-management/AdminSystemActivityManagement";
import { adminSystemActivityType } from "@/lib/constants/admin/admin-system-activity-report-management/AdminSystemActivityManagement";
type Props = {
  control: Control<AdminSystemActivityManagement>;
};

export default function AdminSystemActivityTypeSelect({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
      control={control}
      name="adminSystemActivityType"
      label="نوع فعالیت"
      options={adminSystemActivityType }
      getOptionLabel={(item) => item.title}
      getOptionValue={(item) => item.id}
    />
  );
}