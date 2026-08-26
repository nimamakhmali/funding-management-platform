"use client";

import { Plus, Search } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { useEffect } from "react";

type FilterForm = {
  search: string;
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

interface Props {
  onSearch: (q: string) => void;
  onRoleFilter: (role: string) => void;
}

export default function AdminUserManagementToolbar({
  onSearch,
  onRoleFilter,
}: Props) {
  const methods = useForm<FilterForm>({
    defaultValues: {
      search: "",
      role: "",
      status: "",
    },
  });

  const searchValue = useWatch({ control: methods.control, name: "search" });
  const roleValue = useWatch({ control: methods.control, name: "role" });

  useEffect(() => {
    onSearch(searchValue ?? "");
  }, [searchValue, onSearch]);

  useEffect(() => {
    onRoleFilter(roleValue ?? "");
  }, [roleValue, onRoleFilter]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-wrap items-end gap-6 p-6 border-gray-100">
        <div className="w-52">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            جستجو
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی کاربر..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...methods.register("search")}
            />
          </div>
        </div>

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
