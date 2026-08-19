"use client";

import { Control } from "react-hook-form";

import { Search } from "lucide-react";

import { FormInputField } from "@/components/ui/FormInputField";

import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

type Props = {
  control: Control<AdminProjectManagementFilterForm>;
};

export default function ProjectSearchField({
  control,
}: Props) {
  return (
    <div className="relative">
      <Search className="absolute right-3 w-6 h-6 top-8 text-gray-400" />

      <FormInputField
        control={control}
        name="search"
        label="جستجوی پروژه"
        placeholder="نام یا شناسه..."
        className="pr-10"
      />
    </div>
  );
}