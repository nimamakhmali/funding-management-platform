"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  name: string;
  inputStyle?: string;
}

export default function FormInputContext({
  label,
  labelClassName,
  name,
  inputStyle,
  ...props
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name];

  const errorMessage =
    typeof fieldError?.message === "string"
      ? fieldError.message
      : undefined;

  const errorTypes =
    fieldError && "types" in fieldError
      ? (fieldError.types as Record<string, string> | undefined)
      : undefined;

  const hasError = !!fieldError;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "text-sm font-medium text-gray-600",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        {...register(name)}
        {...props}
        className={cn(
          "w-full rounded-xl border-2 border-border px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring focus:ring-primary",
          hasError &&
          "border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500",
          inputStyle
        )}
      />

      {hasError && (
        <div className="mt-1 flex flex-col gap-1">
          {errorTypes ? (
            Object.values(errorTypes).map((message, index) => (
              <span
                key={index}
                className="text-[11px] font-medium text-red-500"
              >
                {message}
              </span>
            ))
          ) : (
            <span className="text-[11px] font-medium text-red-500">
              {errorMessage}
            </span>
          )}
        </div>
      )}
    </div>
  );
}