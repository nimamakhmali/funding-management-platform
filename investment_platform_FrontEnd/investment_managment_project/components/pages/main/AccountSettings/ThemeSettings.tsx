"use client";

import { Palette } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Moon, Sun } from "lucide-react";

import { AccountSettingsSection } from "./AccountSettingsSection";

import { SettingsFormValues } from "@/lib/validation/AccountSeetings.validation";
import { ThemeCard } from "./ThemeCard";

const themeOptions = [
  {
    label: "لایت مود",
    value: "light",
    icon: <Sun className="size-8" />,
  },
  {
    label: "دارک مود",
    value: "dark",
    icon: <Moon className="size-8" />,
  },
] as const;

export function ThemeSettings() {
  const { control } = useFormContext<SettingsFormValues>();

  return (
    <AccountSettingsSection 
      title="حالت نمایش"
      icon={<Palette className="size-5 text-primary" />}
    >
      <Controller
        name="theme"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-4">
            {themeOptions.map((theme) => (
              <ThemeCard
                key={theme.value}
                title={theme.label}
                icon={theme.icon}
                selected={field.value === theme.value}
                onSelect={() => field.onChange(theme.value)}
              />
            ))}
          </div>
        )}
      />
    </AccountSettingsSection>
  );
}