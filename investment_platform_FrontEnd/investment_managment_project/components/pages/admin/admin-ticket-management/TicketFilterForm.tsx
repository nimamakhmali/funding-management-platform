"use client";
import { useForm } from "react-hook-form";
import { Filter } from "lucide-react";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { TicketFilterFormValues } from "@/lib/types/admin/admin-ticket-management/AdminTicketFilterOption";
import { TICKET_FILTERS } from "@/lib/constants/admin/admin-ticket-management/TicketFilterFormValues ";

interface Props {
  onFilter: (values: TicketFilterFormValues) => void;
}

export default function TicketFilterForm({ onFilter }: Props) {
  const form = useForm<TicketFilterFormValues>({
    defaultValues: {
      status: "all",
      priority: "all",
      category: "technical",
    },
  });

  const onSubmit = (values: TicketFilterFormValues) => {
    onFilter(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <FormScrollableSelectField
        control={form.control}
        name="status"
        label="وضعیت تیکت"
        options={TICKET_FILTERS.status}
        placeholder="انتخاب وضعیت"
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        className="flex-1"
      />

      <FormScrollableSelectField
        control={form.control}
        name="priority"
        label="اولویت"
        options={TICKET_FILTERS.priority}
        placeholder="انتخاب اولویت"
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        className=" flex-1"
      />

      <FormScrollableSelectField
        control={form.control}
        name="category"
        label="دسته‌بندی"
        options={TICKET_FILTERS.category}
        placeholder="انتخاب دسته‌بندی"
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        className=" flex-1"
      />

      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition"
      >
        <Filter size={18} />
        اعمال فیلتر
      </button>
    </form>
  );
}
