import { BellOff } from "lucide-react";

export default function EmptyState() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-200
        py-20
      "
    >
      <div
        className="
          flex
          size-16
          items-center
          justify-center
          rounded-full
          bg-slate-100
        "
      >
        <BellOff className="text-slate-400" />
      </div>

      <h3 className="mt-6 text-lg font-bold">
        اعلانی وجود ندارد
      </h3>

      <p className="mt-2 text-center text-sm text-slate-500">
        در حال حاضر موردی برای نمایش وجود ندارد.
      </p>
    </div>
  );
}