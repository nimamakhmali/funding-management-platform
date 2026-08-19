"use client";

import { UseFormReturn } from "react-hook-form";
import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";
import { ADMIN_FEATURE_FIELDS } from "@/lib/constants/admin/admin-account-settings/AdminFeatureFields";

import AdminFeatureItem from "./AdminFeatureItem";

type AdminFeaturesSettingsProps = {
  form: UseFormReturn<AdminSettingsFormValues>;
};

export default function AdminFeaturesSettings({
  form,
}: AdminFeaturesSettingsProps) {
  return (
    <section>
      <div className="mb-4 px-2">
        <h2 className="text-xl font-bold text-text-main">
          مدیریت قابلیت‌ها
        </h2>
      </div>

      <div className="divide-y divide-border rounded-xl border border-gray-100 bg-white shadow-sm">
        {ADMIN_FEATURE_FIELDS.map((feature) => (
          <AdminFeatureItem
            key={feature.name}
            control={form.control}
            name={feature.name}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
}