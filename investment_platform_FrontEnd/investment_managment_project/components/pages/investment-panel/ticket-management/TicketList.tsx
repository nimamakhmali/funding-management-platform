"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Link from "next/link";

import { FormInputField } from "@/components/ui/FormInputField";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import {
  ticketFilterSchema,
  type TicketFilterValues,
} from "@/lib/validation/investment-panel/ticket-management/ticketFilterSchema";
import { useTickets } from "@/lib/hooks/useTickets";
import { mapTicket } from "@/lib/utils/ticket.utils";
import TicketTable from "./TicketTable";

type FilterOption = { value: string; label: string };

const statusOptions: FilterOption[] = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "open", label: "باز" },
  { value: "in_progress", label: "در حال انجام" },
  { value: "closed", label: "بسته شده" },
];

const timeRangeOptions: FilterOption[] = [
  { value: "all", label: "همه زمان‌ها" },
  { value: "today", label: "امروز" },
  { value: "last_week", label: "هفته گذشته" },
  { value: "last_month", label: "ماه گذشته" },
];

export default function TicketList() {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── داده واقعی از API ─────────────────────────────────────────────────────
  const { data, isLoading } = useTickets({
    page: currentPage,
    page_size: PAGE_SIZE,
  });

  const methods = useForm<TicketFilterValues>({
    resolver: zodResolver(ticketFilterSchema),
    defaultValues: { search: "", status: "all", timeRange: "all" },
  });

  const { reset } = methods;
  const search = useWatch({ control: methods.control, name: "search" });
  const status = useWatch({ control: methods.control, name: "status" });

  // ── mapping و فیلتر ───────────────────────────────────────────────────────
  const tickets = useMemo(() => {
    const raw = (data?.results ?? []).map(mapTicket);

    return raw.filter((ticket) => {
      const matchesSearch =
        !search ||
        ticket.title.includes(search) ||
        ticket.id.includes(search) ||
        ticket.displayId.includes(search.toUpperCase()); // ← جستجو با کد کوتاه هم کار کند
      const matchesStatus =
        status === "all" || ticket.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-[#131118] tracking-tight">
            لیست تیکت‌ها
          </h1>
          <p className="text-gray-500 text-sm font-normal">
            مدیریت تیکت‌های پشتیبانی و پیگیری سابقه درخواست‌ها
          </p>
        </div>
        <Link
          href="/invest-support/create"
          className="bg-primary hover:bg-primary-dark text-white h-10 px-6 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-95 shrink-0"
        >
          <Plus size={20} />
          ایجاد تیکت جدید
        </Link>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white p-4 rounded-xl border border-[#dedbe6] shadow-sm flex flex-wrap items-end gap-4"
        >
          <div className="relative flex-1 min-w-[240px]">
            <FormInputField<TicketFilterValues>
              name="search"
              control={methods.control}
              placeholder="عنوان تیکت یا شناسه پیگیری..."
              className="pr-10"
            />
          </div>

          <div className="w-48">
            <FormScrollableSelectField<TicketFilterValues, FilterOption>
              name="status"
              control={methods.control}
              options={statusOptions}
              getOptionLabel={(o) => o.label}
              getOptionValue={(o) => o.value}
              placeholder="همه وضعیت‌ها"
            />
          </div>

          <div className="w-48">
            <FormScrollableSelectField<TicketFilterValues, FilterOption>
              name="timeRange"
              control={methods.control}
              options={timeRangeOptions}
              getOptionLabel={(o) => o.label}
              getOptionValue={(o) => o.value}
              placeholder="همه زمان‌ها"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              reset({ search: "", status: "all", timeRange: "all" })
            }
            className="text-sm font-bold text-gray-500 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1"
          >
            <RotateCcw size={18} />
            بازنشانی
          </button>
        </form>
      </FormProvider>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          تیکتی یافت نشد
        </div>
      ) : (
        <TicketTable data={tickets} />
      )}
    </div>
  );
}