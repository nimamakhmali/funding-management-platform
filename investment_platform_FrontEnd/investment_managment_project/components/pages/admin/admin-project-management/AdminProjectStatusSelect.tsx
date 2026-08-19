"use client";

import { Control } from "react-hook-form";

import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";

import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

import { projectStatuses } from "@/lib/constants/admin/admin-project-management/filterOptions";

type Props = {
  control: Control<AdminProjectManagementFilterForm>;
};

export default function ProjectStatusSelect({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
      control={control}
      name="status"
      label="وضعیت"
      options={projectStatuses}
      getOptionLabel={(item) => item.title}
      getOptionValue={(item) => item.id}
    />
  );
}