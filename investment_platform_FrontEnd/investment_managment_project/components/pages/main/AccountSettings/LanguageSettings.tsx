"use client";

import { Languages } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { AccountSettingsSection } from "./AccountSettingsSection";
import { LANGUAGE_OPTIONS } from "@/lib/constants/AccountSettingsLanguage";
import { SettingsFormValues } from "@/lib/validation/AccountSeetings.validation";
import { LanguageCard } from "./LanguageCard";

export function LanguageSettings() {
  const { control } = useFormContext<SettingsFormValues>();

  return (
    <AccountSettingsSection
      title="تنظیمات زبان"
      icon={<Languages className="size-5 text-primary" />}
    >
      <Controller
        control={control}
        name="language"
        render={({ field }) => (
          <div className="space-y-3">
            {LANGUAGE_OPTIONS.map((language) => (
              <LanguageCard
                key={language.value}
                title={language.label}
                code={language.code}
                disabled={language.disabled}
                selected={field.value === language.value}
                onSelect={() => field.onChange(language.value)}
              />
            ))}
          </div>
        )}
      />
    </AccountSettingsSection>
  );
}