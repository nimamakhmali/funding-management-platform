"use client";

import { Control } from "react-hook-form";

import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { projectOwners } from "@/lib/constants/admin/admin-project-management/filterOptions";

import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

type Props = {
  control: Control<AdminProjectManagementFilterForm>;
};

export default function ProjectOwnerSelect({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
      control={control}
      name="owner"
      label="مالک پروژه"
      options={projectOwners}
      getOptionLabel={(item) => item.title}
      getOptionValue={(item) => item.id}
    />
  );
}