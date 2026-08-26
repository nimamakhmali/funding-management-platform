// components/pages/admin/admin-user-management/AdminUserManagementToolbar.tsx
"use client";

import { Plus, Search } from "lucide-react";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";

type FilterForm = {
  search: string;
  role: string;
  status: string;
};

const roleOptions = [
  { label: "همه نقش‌ها", value: "" },
  { label: "INVESTOR", value: "INVESTOR" },
  { label: "ENTREPRENEUR", value: "ENTREPRENEUR" },
  { label: "ADMIN", value: "ADMIN" },
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

export default function AdminUserManagementToolbar({ onSearch, onRoleFilter }: Props) {
  const methods = useForm<FilterForm>({
    defaultValues: { search: "", role: "", status: "" },
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    methods.setValue("search", val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(val);
    }, 400);
  };

  const handleRoleChange = (value: string) => {
    methods.setValue("role", value);
    onRoleFilter(value);
  };

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
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="w-52">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            نقش کاربری
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm focus:border-primary focus:outline-none"
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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