
"use client";

import { Mail } from "lucide-react";

export function MessageEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-surface">
      <Mail
        size={48}
        className="text-primary"
      />

      <h3 className="mt-4 text-lg font-bold">
        پیامی انتخاب نشده
      </h3>

      <p className="mt-2 text-sm text-text-muted">
        از لیست سمت راست یک پیام را انتخاب کنید
      </p>
    </div>
  );
}