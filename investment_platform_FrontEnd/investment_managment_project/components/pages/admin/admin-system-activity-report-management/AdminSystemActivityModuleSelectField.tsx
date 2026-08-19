"use client";

import { Control } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { AdminSystemActivityManagement } from "@/lib/types/admin/admin-system-activity-report-management/AdminSystemActivityManagement";
import { adminSystemActivityModule } from "@/lib/constants/admin/admin-system-activity-report-management/AdminSystemActivityManagement";
type Props = {
  control: Control<AdminSystemActivityManagement>;
};

export default function AdminSystemActivityModuleSelectField({
  control,
}: Props) {
  return (
<FormScrollableSelectField
  control={control}
  name="adminSystemActivityModule"
  label="ماژول ها"
  options={adminSystemActivityModule }
  getOptionLabel={(item) => item.title}
  getOptionValue={(item) => item.id}
/>
  );
}