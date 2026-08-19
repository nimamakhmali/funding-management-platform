"use client";

import { Plus } from "lucide-react";

export function NewMessageButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white"
    >
      <Plus size={18} />
      <span>
        پیام جدید
      </span>
    </button>
  );
}