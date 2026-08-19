"use client";

import { Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";

type FilterForm = {
  role: string;
  status: string;
};

const roleOptions = [
  { label: "همه نقش‌ها", value: "" },
  { label: "مدیر سیستم", value: "مدیر سیستم" },
  { label: "سرمایه‌گذار", value: "سرمایه‌گذار" },
  { label: "کارشناس مالی", value: "کارشناس مالی" },
];

const statusOptions = [
  { label: "همه وضعیت‌ها", value: "" },
  { label: "فعال", value: "active" },
  { label: "غیرفعال", value: "inactive" },
];

export default function AdminUserManagementToolbar() {
  const methods = useForm<FilterForm>({
    defaultValues: {
      role: "",
      status: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-wrap items-end gap-6 p-6 border-gray-100">

        <div className="w-52">
          <FormScrollableSelectField
            control={methods.control}
            name="role"
            label="نقش کاربری"
            options={roleOptions}
            getOptionLabel={(item) => item.label}
            getOptionValue={(item) => item.value}
          />
        </div>

        <div className="w-52">
          <FormScrollableSelectField
            control={methods.control}
            name="status"
            label="وضعیت حساب"
            options={statusOptions}
            getOptionLabel={(item) => item.label}
            getOptionValue={(item) => item.value}
          />
        </div>

        <div className="mr-auto">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
          >
            <Plus size={18} />
            افزودن کاربر جدید
          </button>
        </div>

      </div>
    </FormProvider>
  );
}