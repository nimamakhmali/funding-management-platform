"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInputField } from "@/components/ui/FormInputField";
import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";
import { ADMIN_FINANCE_FIELDS } from "@/lib/constants/admin/admin-account-settings/AdminFinanceFields";

type AdminFinanceSettingsProps = {
  form: UseFormReturn<AdminSettingsFormValues>;
};

export default function AdminFinanceSettings({
  form,
}: AdminFinanceSettingsProps) {
  return (
    <section className="mb-10">
      <div className="mb-4 px-2">
        <h2 className="text-xl font-bold text-text-main">
          محدودیت‌های مالی
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {ADMIN_FINANCE_FIELDS.map((field) => (
            <div key={field.name} className="space-y-2">
              <div className="relative">
                <FormInputField<AdminSettingsFormValues>
                  control={form.control}
                  name={field.name}
                  label={field.label}
                  type="number"
                  nuSeparator
                  placeholder={field.placeholder}
                  className="pl-12"
                />

                <span className="absolute left-3 top-[42px] -translate-y-1/2 text-xs text-text-muted">
                  {field.suffix}
                </span>
              </div>

              <p className="text-[10px] text-text-muted">
                {field.description}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex justify-end">
            <Button
            className="text-white"
              type="submit"
              size={"lg"}
              disabled={form.formState.isSubmitting}
            >
              بروزرسانی محدودیت‌ها
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}