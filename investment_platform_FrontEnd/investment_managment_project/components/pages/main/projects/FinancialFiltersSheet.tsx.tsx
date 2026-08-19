"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

type Props = {
  children?: React.ReactNode;
};

type FinancialFilters = {
  minCapital: string;
  maxCapital: string;
  profitPercent: string;
};

export default function FinancialFiltersSheet({ children }: Props) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<FinancialFilters>({
    defaultValues: {
      minCapital: "",
      maxCapital: "",
      profitPercent: "",
    },
  });

  const values = watch();

  const { setParams, clear } = useQueryParams();

  const onSubmit = (data: FinancialFilters) => {
    setParams(data);
    setOpen(false);
  };

  const handleReset = () => {
    reset();
    clear();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children ?? (
          <Button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark">
            <SlidersHorizontal className="h-4 w-4" />
            فیلترهای مالی
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[380px] sm:w-[450px] bg-white flex border border-gray-100 flex-col"
      >
        <SheetHeader className="border-b border-gray-100 pb-4 mb-5">
          <SheetTitle className="flex items-center gap-2 text-lg font-extrabold text-text-main">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            فیلترهای سرمایه‌گذاری
          </SheetTitle>

          <p className="mt-1 text-xs text-text-muted">
            محدوده مورد نظر خود را برای نمایش پروژه‌ها انتخاب کنید
          </p>
        </SheetHeader>

        <form className="flex-1 space-y-6 overflow-y-auto pb-24">
          <div className="rounded-xl border border-border bg-gray-50 p-4 space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase">
              محدوده سرمایه
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                {...register("minCapital")}
                placeholder="حداقل"
                className="h-11 rounded-xl border border-border bg-white px-3 text-sm focus:border-primary focus:outline-none"
              />

              <input
                {...register("maxCapital")}
                placeholder="حداکثر"
                className="h-11 rounded-xl border border-border bg-white px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-gray-50 p-4 space-y-2">
            <h3 className="text-xs font-bold text-text-muted uppercase">
              بازدهی مورد انتظار
            </h3>

            <input
              {...register("profitPercent")}
              placeholder="درصد سود (مثلاً 20)"
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-border p-3 text-xs bg-white">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-text-muted">پیش‌نمایش فیلتر</span>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <RotateCcw className="h-3 w-3" />
                پاک کردن فیلترها
              </button>
            </div>

            <div className="space-y-1 text-[11px] text-gray-600">
              <p>
                حداقل سرمایه:{" "}
                {values.minCapital
                  ? Number(values.minCapital).toLocaleString("fa-IR")
                  : "—"}
              </p>

              <p>
                حداکثر سرمایه:{" "}
                {values.maxCapital
                  ? Number(values.maxCapital).toLocaleString("fa-IR")
                  : "—"}
              </p>

              <p>سود: {values.profitPercent || "—"}</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-1/3 rounded-xl"
              >
                پاک کردن فیلتر ها
              </Button>

              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w/2/3 rounded-xl bg-primary font-bold text-white hover:bg-primary-dark"
              >
                اعمال فیلتر
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
