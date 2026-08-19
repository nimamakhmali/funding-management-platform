import React from "react";
import { CheckIcon } from "./Icons";

interface VerifiedBadgeProps {
  text?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  text = "تایید شده",
}) => {
  return (
    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
      <CheckIcon />
      {text}
    </span>
  );
};
