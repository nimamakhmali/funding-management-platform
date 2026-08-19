"use client";

import { RotateCcw } from "lucide-react";
type Props = {
  onReset: () => void;
};

export default function ReportFilterButtons({
  onReset,
}: Props) {
  return (
    <div className="flex gap-3">
      <button
        type="submit"
        className="flex-1 h-11 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition"
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