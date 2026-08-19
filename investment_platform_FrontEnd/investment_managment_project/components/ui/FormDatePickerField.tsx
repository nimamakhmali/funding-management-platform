"use client";

import { Calendar } from "lucide-react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { cn } from "../../lib/utils";
import { Input } from "./input";

type CustomDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  placeholder?: string;
};

function isObjectWithToDate(v: unknown): v is { toDate: () => Date } {
  return (
    typeof v === "object" &&
    v !== null &&
    "toDate" in (v as Record<string, unknown>) &&
    typeof (v as { toDate?: unknown }).toDate === "function"
  );
}

function isDateLike(v: unknown): v is Date {
  return v instanceof Date;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function toDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  if (isDateLike(value)) return value;
  if (isObjectWithToDate(value)) return value.toDate();
  if (Array.isArray(value)) return toDate(value[0]);
  if (isString(value)) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value as unknown as string);
  return isNaN(d.getTime()) ? null : d;
}

function toISOStringWithoutTimeZone(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  ).toISOString();
}

function FormDatePickerField<T extends FieldValues>({
  control,
  name,
  rules,
  placeholder,
  label,
}: CustomDatePickerProps<T>) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-600">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          const pickerValue = toDate(field.value) || null;

          return (
            <>
              <DatePicker
                value={pickerValue}
                onChange={(val: unknown) => {
                  const d = toDate(val);
                  if (!d) return field.onChange(null);
                  field.onChange(toISOStringWithoutTimeZone(d));
                }}
                calendar={persian}
                locale={persian_fa}
                range={false}
                render={(val: string, openCalendar: () => void) => (
                  <label
                    htmlFor={name}
                    className={cn(
                      "flex items-center rounded-2xl border-2 bg-gray-50 transition-all overflow-hidden",
                      hasError
                        ? "border-red-500 bg-red-50"
                        : "border-gray-100 focus-within:border-primary hover:border-gray-200",
                    )}
                  >
                    <Input
                      value={val}
                      onFocus={openCalendar}
                      readOnly
                      id={name}
                      placeholder={placeholder}
                      className={cn(
                     "border-none bg-transparent focus-visible:ring-0",
                      hasError && "text-red-900 placeholder:text-red-300",
                    )}
                    />
                    <div
                      className={cn(
                        "px-3 text-gray-500",
                        hasError && "text-red-500",
                      )}
                    >
                      <Calendar size={18} />
                    </div>
                  </label>
                )}
              />

              {hasError && (
                <p className="text-red-500 text-[11px] font-medium mt-1">
                  {fieldState.error?.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export default FormDatePickerField;
