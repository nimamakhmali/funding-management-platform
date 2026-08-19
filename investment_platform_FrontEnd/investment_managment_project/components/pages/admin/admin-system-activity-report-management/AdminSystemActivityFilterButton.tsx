"use client";

import { RotateCcw } from "lucide-react";
type Props = {
  onReset: () => void;
};

export default function AdminSystemActivityFilterButton({
  onReset,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        className="h-11 flex-1  rounded-xl bg-primary text-white font-bold transition hover:opacity-90"
      >
        اعمال فیلتر
      </button>

      <button
        type="button"
        onClick={onReset}
        className="h-11 w-11 rounded-xl border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}