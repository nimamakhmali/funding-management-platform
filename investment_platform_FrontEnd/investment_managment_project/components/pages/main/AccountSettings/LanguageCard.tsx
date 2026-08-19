import { cn } from "@/lib/utils";

interface LanguageCardProps {
  title: string;
  code: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function LanguageCard({
  title,
  code,
  selected,
  disabled = false,
  onSelect,
}: LanguageCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border p-4 transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-xs font-bold uppercase">
          {code}
        </div>

        <span className="font-medium text-gray-800">
          {title}
        </span>
      </div>

      <div
        className={cn(
          "h-4 w-4 rounded-full border-2",
          selected
            ? "border-primary bg-primary"
            : "border-gray-300"
        )}
      />
    </button>
  );
}