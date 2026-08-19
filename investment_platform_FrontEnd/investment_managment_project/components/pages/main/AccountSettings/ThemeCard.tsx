import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  title: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export function ThemeCard({
  title,
  icon,
  selected,
  onSelect,
}: ThemeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3 rounded-xl border-2 p-5 transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-slate-200 bg-gray-50 hover:bg-slate-100"
      )}
    >
      <div className="text-primary">
        {icon}
      </div>

      <span className="text-sm font-medium text-gray-900">
        {title}
      </span>
    </button>
  );
}