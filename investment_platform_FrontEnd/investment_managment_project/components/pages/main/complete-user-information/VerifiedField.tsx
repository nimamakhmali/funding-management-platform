import React from "react";
import { LockIcon } from "./Icons";
import { VerifiedBadge } from "./VerifiedBadge";

type InputType = "text" | "email" | "tel" | "number";

interface VerifiedFieldProps {
  label: string;
  value: string;
  type?: InputType;
  badgeText?: string;
}

export const VerifiedField: React.FC<VerifiedFieldProps> = ({
  label,
  value,
  type = "text",
  badgeText,
}) => {
  const inputMode = type === "tel" ? "numeric" : undefined;

  return (
    <label className="flex flex-col gap-2 opacity-80">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-text-main">{label}</span>
        <VerifiedBadge text={badgeText} />
      </div>
      <div className="relative">
        <input
          className="w-full rounded-lg border-transparent bg-white px-4 py-3 text-sm text-right text-gray-500 font-mono cursor-not-allowed shadow-sm"
          dir="ltr"
          disabled
          type={type}
          value={value}
          readOnly
          inputMode={inputMode}
          aria-label={`${label} تایید شده`}
        />
        <LockIcon />
      </div>
    </label>
  );
};
