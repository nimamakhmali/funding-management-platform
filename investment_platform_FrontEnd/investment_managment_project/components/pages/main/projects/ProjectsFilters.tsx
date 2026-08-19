"use client";

import { Search, Building2, BarChart3, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import FinancialFiltersSheet from "./FinancialFiltersSheet.tsx";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

export default function ProjectsFilters() {
  const { setParams } = useQueryParams();

  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4 lg:col-span-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase text-text-muted">
            جستجو در نمادها
          </label>

          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

            <Input
              onChange={(e) =>
                setParams({
                  search: e.target.value,
                })
              }
              placeholder="نام پروژه، صنعت یا نماد..."
              className="pr-10 bg-primary-50 rounded-xl border-2 border-border"
            />
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-3">
          <label className="mb-1.5 block text-xs فرمان-semibold uppercase text-text-muted">
            صنعت
          </label>

          <div className="relative">
            <Building2 className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted" />

            <select
              onChange={(e) =>
                setParams({
                  industry: e.target.value,
                })
              }
              className="h-11 w-full rounded-xl border-2 border-border bg-primary-50 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">همه صنایع</option>
              <option value="فناوری">فناوری</option>
              <option value="صنعتی">صنعتی</option>
              <option value="انرژی">انرژی</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase text-text-muted">
            وضعیت نماد
          </label>

          <div className="relative">
            <BarChart3 className="absolute right-3 top-1/2 z-10 h-4 وw-4 -translate-y-1/2 text-text-muted" />

            <select
              onChange={(e) =>
                setParams({
                  status: e.target.value,
                })
              }
              className="h-11 w-full rounded-xl border-2 border-border bg-primary-50 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="active">پذیره‌نویسی فعال</option>
              <option value="funded">تکمیل شده</option>
              <option value="closed">بسته شده</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <FinancialFiltersSheet>
            <button
              type="button"
              className="
                flex h-11 w-full items-center justify-center gap-2
                rounded-xl bg-primary text-sm font-bold text-white
                shadow-sm transition-all
                hover:bg-primary-dark
              "
            >
              <SlidersHorizontal className="h-4 w-4" />
              فیلترهای مالی
            </button>
          </FinancialFiltersSheet>
        </div>
      </div>
    </section>
  );
}
