"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AccountInformation } from "@/components/pages/main/AccountSettings/AccountInformation";
import { LanguageSettings } from "@/components/pages/main/AccountSettings/LanguageSettings";
import { ThemeSettings } from "@/components/pages/main/AccountSettings/ThemeSettings";
import { SecuritySettings } from "@/components/pages/main/AccountSettings/SecuritySettings";
import { SaveButton } from "@/components/pages/main/AccountSettings/SaveButtopn";
import { settingsSchema, SettingsFormValues } from "@/lib/validation/AccountSeetings.validation";
import AccountSettingsHeader from "@/components/pages/main/AccountSettings/AccountSettingsHeader";
import Container from "@/components/ui/Container";
import { authService } from "@/lib/api/services/auth.service";
import axiosInstance from "@/lib/api/orval/axios-instance";

export default function AccountSettings() {
  const queryClient = useQueryClient();

  // ── دریافت پروفایل از بک‌اند ─────────────────────────────────────────────
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: authService.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      mobile: "",
      language: "fa",
      theme: "light",
      twoFactor: false,
    },
  });

  // ── پر کردن فرم با داده‌های پروفایل ─────────────────────────────────────
  useEffect(() => {
    if (!profileData) return;

    methods.reset({
      firstName: profileData.first_name ?? "",
      lastName: profileData.last_name ?? "",
      company: profileData.company_name_persian ?? profileData.company_name ?? "",
      email: profileData.user?.phone_number
        ? (profileData as any).email ?? ""
        : "",
      mobile: profileData.user?.phone_number ?? "",
      language: "fa",
      theme: "light",
      twoFactor: false,
    });
  }, [profileData, methods]);

  // ── ذخیره تغییرات ────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const payload: Record<string, string> = {};

      if (data.company) payload.company_name = data.company;

      // فقط فیلدهایی که بک‌اند /profile/me/ PUT قبول می‌کند
      const response = await axiosInstance.put("/api/v1/profile/me/", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("تنظیمات با موفقیت ذخیره شد.");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: () => {
      toast.error("خطا در ذخیره تنظیمات.");
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <AccountSettingsHeader />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <AccountInformation />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LanguageSettings />
            <ThemeSettings />
          </div>

          <SecuritySettings />

          <SaveButton
            isSubmitting={methods.formState.isSubmitting || updateMutation.isPending}
            onCancel={() => {
              if (profileData) {
                methods.reset({
                  firstName: profileData.first_name ?? "",
                  lastName: profileData.last_name ?? "",
                  company: profileData.company_name_persian ?? profileData.company_name ?? "",
                  email: (profileData as any).email ?? "",
                  mobile: profileData.user?.phone_number ?? "",
                  language: "fa",
                  theme: "light",
                  twoFactor: false,
                });
              }
            }}
          />
        </form>
      </FormProvider>
    </Container>
  );
}