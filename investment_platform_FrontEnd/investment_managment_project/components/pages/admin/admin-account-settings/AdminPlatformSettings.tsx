"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInputField } from "@/components/ui/FormInputField";
import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";
import { ADMIN_PLATFORM_FIELDS } from "@/lib/constants/admin/admin-account-settings/AdminPlatformFields";

type AdminPlatformSettingsProps = {
  form: UseFormReturn<AdminSettingsFormValues>;
};

export default function AdminPlatformSettings({
  form,
}: AdminPlatformSettingsProps) {
  return (
    <section className="mb-10">
      <div className="mb-4 px-2">
        <h2 className="text-xl font-bold text-text-main">
          مقادیر پیکربندی
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {ADMIN_PLATFORM_FIELDS.map((field) => (
            <FormInputField<AdminSettingsFormValues>
              key={field.name}
              control={form.control}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
              type={field.type}
              dir={field.dir}
              nuSeparator={field.nuSeparator}
            />
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
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}