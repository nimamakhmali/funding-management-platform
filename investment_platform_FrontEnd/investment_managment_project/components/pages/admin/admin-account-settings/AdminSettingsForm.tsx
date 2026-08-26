// components/pages/admin/admin-account-settings/AdminSettingsForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";
import AdminPlatformSettings from "./AdminPlatformSettings";
import AdminFinanceSettings from "./AdminFinanceSettings";
import AdminFeaturesSettings from "./AdminFeaturesSettings";
import { CheckCircle, Loader2 } from "lucide-react";

export default function AdminSettingsForm() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<AdminSettingsFormValues>({
    mode: "onChange",
  });

  const onSubmit = async (values: AdminSettingsFormValues) => {
    setSaving(true);
    try {
      // TODO: وقتی API تنظیمات آماده شد اینجا call می‌شود
      // await adminService.saveSettings(values);
      console.log("Settings saved:", values);
      await new Promise((r) => setTimeout(r, 500)); // simulate
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <AdminPlatformSettings form={form} />
      <AdminFinanceSettings form={form} />
      <AdminFeaturesSettings form={form} />

      <div className="flex items-center justify-end gap-4 pt-4">
        {saved && (
          <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <CheckCircle size={16} />
            تنظیمات با موفقیت ذخیره شد
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : null}
          ذخیره تنظیمات
        </button>
      </div>
    </form>
  );
}