"use client"; 
import { useForm, SubmitHandler } from "react-hook-form"; 
import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";
import ProjectSearchField from "./AdminProjectSearchField";
import ProjectStatusSelect from "./AdminProjectStatusSelect";
import ProjectOwnerSelect from "./AdminProjectOwnerSelect";
import ProjectRegisterDateField from "./AdminProjectRegisterDateField"; 
import FilterActions from "./AdminProjectFilterButtons"; 
import { useWatch } from "react-hook-form";
import { useEffect } from "react"; 





type Props = {
  onFilterChange: (values: AdminProjectManagementFilterForm) => void;
};

export default function AdminProjectManagementFilter({
  onFilterChange,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<AdminProjectManagementFilterForm>({
    defaultValues: {
      search: "",
      status: "all",
      owner: "all",
      registerDate: "",
    },
  });

  const values = useWatch({
    control,
  });

  useEffect(() => {
    onFilterChange({
      search: values?.search ?? "",
      status: values?.status ?? "all",
      owner: values?.owner ?? "all",
      registerDate: values?.registerDate ?? "",
    });
  }, [values, onFilterChange]);

  const onSubmit: SubmitHandler<AdminProjectManagementFilterForm> = (
    data,
  ) => {
    console.log(data);
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
            reset({
              search: "",
              status: "all",
              owner: "all",
              registerDate: "",
            })
          }
        />
      </form>
    </section>
  );
}