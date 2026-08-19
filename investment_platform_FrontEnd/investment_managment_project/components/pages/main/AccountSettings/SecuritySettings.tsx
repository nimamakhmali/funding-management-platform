"use client";

import { Lock, Shield } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SettingsFormValues } from "@/lib/validation/AccountSeetings.validation";
import { Switch } from "@/components/ui/switch";

import { AccountSettingsSection } from "./AccountSettingsSection";
import { SecurityItem } from "./SecurityItem";

export function SecuritySettings() {
  const { control } = useFormContext<SettingsFormValues>();

  return (
    <AccountSettingsSection 
      title="امنیت حساب"
      icon={<Shield className="size-5 text-primary" />}
    >
      <div className="space-y-4">
        <SecurityItem
          title="تغییر رمز عبور"
          description="مدیریت دسترسی به حساب"
          action={
            <Button
              type="button"
              variant="outline"
              className="gap-2"
            >
              <Lock className="size-4" />
              تغییر رمز
            </Button>
          }
        />

        <Controller
          name="twoFactor"
          control={control}
          render={({ field }) => (
            <SecurityItem
              title="فعال‌سازی ورود دو مرحله‌ای"
              description="تأیید هویت از طریق پیامک"
              action={
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              }
            />
          )}
        />
      </div>
    </AccountSettingsSection>
  );
}