"use client";

import { useForm } from "react-hook-form";
import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";
import AdminPlatformSettings from "./AdminPlatformSettings";
import AdminFinanceSettings from "./AdminFinanceSettings";
import AdminFeaturesSettings from "./AdminFeaturesSettings";
export default function AdminSettingsForm() {
  const form = useForm<AdminSettingsFormValues>({
    mode: "onChange",
  });

  const onSubmit = (values: AdminSettingsFormValues) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <AdminPlatformSettings form={form} />
      <AdminFinanceSettings  form={form} />
      <AdminFeaturesSettings form={form} />
    </form> 
  );
}