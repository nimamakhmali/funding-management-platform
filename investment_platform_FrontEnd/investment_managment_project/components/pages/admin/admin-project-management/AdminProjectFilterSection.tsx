// components/pages/admin/admin-project-management/AdminProjectFilterSection.tsx
"use client";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";
import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";
import ProjectSearchField from "./AdminProjectSearchField";
import ProjectStatusSelect from "./AdminProjectStatusSelect";
import ProjectOwnerSelect from "./AdminProjectOwnerSelect";
import ProjectRegisterDateField from "./AdminProjectRegisterDateField";
import FilterActions from "./AdminProjectFilterButtons";

type Props = {
  onFilterChange: (values: AdminProjectManagementFilterForm) => void;
};

export default function AdminProjectManagementFilter({ onFilterChange }: Props) {
  const { control, handleSubmit, reset } = useForm<AdminProjectManagementFilterForm>({
    defaultValues: {
      search: "",
      status: "all",
      owner: "all",
      registerDate: "",
    },
  });

  const values = useWatch({ control });

  // از useRef برای جلوگیری از infinite loop استفاده می‌کنیم
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  });

  // فقط با debounce برای search، بقیه با submit
  const searchValue = values?.search ?? "";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchValue !== undefined) {
        onFilterChangeRef.current({
          search: searchValue,
          status: values?.status ?? "all",
          owner: values?.owner ?? "all",
          registerDate: values?.registerDate ?? "",
        });
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const onSubmit: SubmitHandler<AdminProjectManagementFilterForm> = (data) => {
    onFilterChangeRef.current(data);
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        <ProjectSearchField control={control} />
        <ProjectStatusSelect control={control} />
        <ProjectOwnerSelect control={control} />
        <ProjectRegisterDateField control={control} />
        <FilterActions
          onReset={() =>
            reset({ search: "", status: "all", owner: "all", registerDate: "" })
          }
        />
      </form>
    </section>
  );
}