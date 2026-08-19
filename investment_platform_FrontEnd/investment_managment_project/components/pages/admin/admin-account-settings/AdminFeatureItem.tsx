"use client";

import { Control, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";

type AdminFeatureItemProps = {
  control: Control<AdminSettingsFormValues>;

  name:
    | "instantDeposit"
    | "createProject"
    | "sms2FA"
    | "liveSupport";

  title: string;

  description: string;

  icon: React.ElementType;
};

export default function AdminFeatureItem({
  control,
  name,
  title,
  description,
  icon: Icon,
}: AdminFeatureItemProps) {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={20} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-main">
            {title}
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            {description}
          </p>
        </div>
      </div>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            className="bg-primary"
          />
        )}
      />
    </div>
  );
}