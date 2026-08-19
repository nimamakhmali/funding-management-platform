"use client";

import { useMemo } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface Props<T extends FieldValues = FieldValues, TOption = unknown> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  options: TOption[];
  placeholder?: string;
  getOptionLabel: (option: TOption) => string;
  getOptionValue: (option: TOption) => string | boolean | number;
  className?: string;
  labelStyle?: string;
  selectStyle?: string;
  optionStyle?: string;
}

export function FormScrollableSelectField<
  T extends FieldValues = FieldValues,
  TOption = unknown,
>({
  name,
  control,
  options,
  placeholder,
  getOptionLabel,
  getOptionValue,
  label,
  className,
  labelStyle,
  selectStyle,
  optionStyle,
}: Props<T, TOption>) {
  const mappedOptions = useMemo(() => {
    return options.map((option) => {
      const value = getOptionValue(option);
      const stringValue = String(value);
      const labelText = getOptionLabel(option);
      return { key: stringValue, stringValue, rawValue: value, labelText };
    });
  }, [options, getOptionLabel, getOptionValue]);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "text-xs font-bold text-text-sub mr-1 text-[#6d608a]",
            labelStyle,
          )}
        >
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const currentValue = String(field.value ?? "");
          const selectedOption = mappedOptions.find(
            (o) => o.stringValue === currentValue,
          );
          const selectedLabel = selectedOption ? selectedOption.labelText : "";

          return (
            <>
              <div className="relative w-full">
                <Select
                  value={currentValue}
                  onValueChange={(val: string) => {
                    const matched = mappedOptions.find(
                      (opt) => opt.stringValue === val,
                    );
                    if (matched) {
                      field.onChange(matched.rawValue);
                    } else {
                      field.onChange(val);
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full py-5 rounded-md border-2 border-gray-50 bg-gray-50",
                      "text-sm font-medium text-text-main",
                      "focus:bg-white outline-none",
                      "appearance-none cursor-pointer transition-all",
                      "hover:border-gray-200",
                      "flex items-center justify-between flex-row-reverse",
                      fieldState.error?.message && "border-destructive",
                      selectStyle,
                    )}
                    id={String(name)}
                  >
                    <SelectValue
                      placeholder={
                        field.value ? undefined : placeholder || "انتخاب کنید"
                      }
                    >
                      {selectedLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[var(--radix-select-trigger-width)] min-w-full"
                    sideOffset={4}
                  >
                    <SelectGroup>
                      {mappedOptions.map((opt) => (
                        <SelectItem
                          className={cn(
                            "w-full cursor-pointer bg-white flex flex-row-reverse items-center justify-between",
                            optionStyle,
                          )}
                          key={opt.key}
                          value={opt.stringValue}
                        >
                          {opt.labelText}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {fieldState?.error && (
                <p className="text-destructive text-[0.625rem] font-medium mt-0.5">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
