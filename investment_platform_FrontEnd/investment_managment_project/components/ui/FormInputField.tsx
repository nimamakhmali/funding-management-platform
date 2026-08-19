"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Input } from "./input";

const normalizeNumber = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => {
    const index = "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
    return String(index);
  });

const toPersianDigits = (value: string) =>
  value.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

interface Props<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  type?: HTMLInputElement["type"];
  nuSeparator?: boolean;
  textarea?: boolean;

}

function FormInputField<T extends FieldValues>({
  label,
  name,
  control,
  className,
  rules,
  type,
  nuSeparator = false,
  textarea = false,
  ...props
}: Props<T>) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-medium text-gray-600"
        >
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;

          const displayValue =
            field.value === undefined || field.value === null
              ? ""
              : type === "number" && nuSeparator
                ? toPersianDigits(
                  String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                )
                : String(field.value);

          return (
            <>
              {textarea ? (
                <textarea
                  id={name}
                  {...(props as any)}
                  value={displayValue}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={cn(
                    "w-full min-h-[120px] px-4 py-3 rounded-2xl border-2 border-border bg-gray-50 text-sm font-medium outline-none transition-all",
                    hasError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-100 focus:border-primary",
                    className,
                  )}
                />
              ) : (
                <Input
                  id={name}
                  {...props}
                  type={type}
                  inputMode={type === "number" ? "numeric" : undefined}
                  value={displayValue}
                  onChange={(e) => {
                    if (type !== "number" || !nuSeparator) {
                      field.onChange(e.target.value);
                      return;
                    }

                    const raw = normalizeNumber(e.target.value).replace(/,/g, "");
                    const num = Number(raw);
                    field.onChange(!isNaN(num) ? num : undefined);
                  }}
                  className={cn(
                    "w-full h-12 px-4 rounded-2xl border-2 bg-gray-50 text-sm font-medium outline-none transition-all",
                    hasError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-100 focus:border-primary",
                    className,
                  )}
                />
              )}

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

export { FormInputField };
