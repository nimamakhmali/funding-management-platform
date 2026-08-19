import clsx from "clsx";
import { RotateCcw } from "lucide-react";

export default function UpdateButton() {
  return (
    <button
      className={clsx(
        "update-button",
        "flex items-center gap-2 px-5 h-11 rounded-xl border border-gray-200 bg-white text-text-main text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer",
      )}
    >
      <RotateCcw />
      <span>بروزرسانی</span>
    </button>
  );
}
