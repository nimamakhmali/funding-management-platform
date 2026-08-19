"use client";

import { Control } from "react-hook-form";

import FormDatePickerField from "@/components/ui/FormDatePickerField";

import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

type Props = {
  control: Control<AdminProjectManagementFilterForm>;
};

export default function ProjectRegisterDateField({
  control,
}: Props) {
  return (
    <FormDatePickerField
      control={control}
      name="registerDate"
      label="تاریخ ثبت"
      placeholder="انتخاب تاریخ"
    />
  );
}