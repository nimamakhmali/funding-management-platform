"use client";

import { User, Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInputField } from "@/components/ui/FormInputField";
import { AccountSettingsSection } from "./AccountSettingsSection";
import { SettingsFormValues } from "@/lib/validation/AccountSeetings.validation";

export function AccountInformation() {
  const { control } = useFormContext<SettingsFormValues>();

  return (
    <AccountSettingsSection
      title="اطلاعات حساب کاربری"
      icon={<User className="size-5 text-primary" />}
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Pencil className="size-4" />
          ویرایش اطلاعات
        </Button>
      }
      contentClassName="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <FormInputField<SettingsFormValues>
        control={control}
        name="firstName"
        label="نام"
        placeholder="نام"
      />

      <FormInputField<SettingsFormValues>
        control={control}
        name="lastName"
        label="نام خانوادگی"
        placeholder="نام خانوادگی"
      />

      <div className="md:col-span-2">
        <FormInputField<SettingsFormValues>
          control={control}
          name="company"
          label="نام شرکت / سازمان"
          placeholder="نام شرکت"
        />
      </div>

      <FormInputField<SettingsFormValues>
        control={control}
        name="email"
        label="ایمیل"
        placeholder="example@email.com"
      />

      {/* شماره موبایل فقط نمایشی است و قابل ویرایش نیست */}
      <FormInputField<SettingsFormValues>
        control={control}
        name="mobile"
        label="شماره موبایل"
        placeholder="شماره موبایل"
        disabled
      />
    </AccountSettingsSection>
  );
}