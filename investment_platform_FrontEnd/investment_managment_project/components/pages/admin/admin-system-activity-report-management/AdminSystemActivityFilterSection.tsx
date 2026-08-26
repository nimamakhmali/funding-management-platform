"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import AdminSystemActivitySelectField from "./AdminSystemActivitySelectField";
import AdminSystemActivityTypeSelect from "./AdminSystemActivityTypeSelect";
import AdminSystemActivityModuleSelectField from "./AdminSystemActivityModuleSelectField";
import AdminSystemActivityDateRange from "./AdminSystemActivityDateRange";
import AdminSystemActivityFilterButton from "./AdminSystemActivityFilterButton";
import { AdminSystemActivityManagement } from "@/lib/types/admin/admin-system-activity-report-management/AdminSystemActivityManagement";

interface Props {
  onFilter: (values: AdminSystemActivityManagement) => void;
}

export default function AdminSystemActivityFilterManagement({ onFilter }: Props) {
  const { control, handleSubmit, reset } =
    useForm<AdminSystemActivityManagement>({
      defaultValues: {
        adminSystemActivity: "all",
        adminSystemActivityType: " ",
        adminSystemActivityModule: " ",
        dateRange: " ",
        fromDateRange: " ",
      },
    });

  const onSubmit: SubmitHandler<AdminSystemActivityManagement> = (
    data,
  ) => {
    onFilter(data);
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        <AdminSystemActivitySelectField control={control} />
        <AdminSystemActivityTypeSelect control={control} />
        <AdminSystemActivityModuleSelectField control={control} />
        <AdminSystemActivityDateRange control={control} />
        <AdminSystemActivityFilterButton onReset={() => reset()} />
      </form>
    </section>
  );
}
