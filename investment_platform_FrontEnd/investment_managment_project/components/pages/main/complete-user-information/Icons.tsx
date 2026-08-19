import { Check, Lock } from "lucide-react";
import React from "react";

interface IconProps {
  className?: string;
}

export const LockIcon: React.FC<IconProps> = ({
  className = "text-gray-400 text-[18px]",
}) => {
  return (
    <span
      className={`material-symbols-outlined absolute left-3 top-3 ${className}`}
      aria-hidden="true"
    >
      <Lock size={14} />
    </span>
  );
};

export const CheckIcon: React.FC<IconProps> = ({
  className = "text-[12px]",
}) => {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
    >
      <Check size={14} />
    </span>
  );
};
