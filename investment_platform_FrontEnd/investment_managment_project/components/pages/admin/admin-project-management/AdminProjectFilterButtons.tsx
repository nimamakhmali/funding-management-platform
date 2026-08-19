"use client";

import { Filter, RefreshCcw } from "lucide-react";

type Props = {
  onReset: () => void;
};

export default function FilterActions({
  onReset,
}: Props) {
  return (
    <div className="flex gap-3">
      <button
        type="submit"
        className="h-12 px-6 rounded-xl bg-primary text-white flex items-center gap-2 hover:opacity-90 transition"
      >
        <Filter  />
         فیلتر
      </button>
      
      <button
        type="button"
        onClick={onReset}
        className="h-12 px-5 rounded-xl border border-gray-200 flex items-center gap-2 hover:border-primary transition"
      >
        <RefreshCcw size={18} />
        
      </button>
    </div>
  );
}