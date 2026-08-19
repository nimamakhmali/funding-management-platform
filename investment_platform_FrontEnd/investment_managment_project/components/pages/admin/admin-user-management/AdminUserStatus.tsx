"use client";

import { cn } from "@/lib/utils";

interface Props {
  active: boolean;
}

export default function AdminUserStatus({
  active,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border",
        active
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-700 border-red-200"
      )}
    >
      {active ? "فعال" : "غیرفعال"}
    </span>
  );
}