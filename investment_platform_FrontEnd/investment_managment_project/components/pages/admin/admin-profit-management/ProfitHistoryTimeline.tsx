import { AdminProfitHistoryItem } from "@/lib/types/admin/admin-profit-management/AdminProfitHistory";

interface Props {
  items: AdminProfitHistoryItem[];
}

export default function ProfitHistoryTimeline({
  items,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h4 className="text-base font-bold text-text-main">
          تاریخچه تاییدها و لاگ سیستم
        </h4>

        <span className="text-[10px] font-medium text-gray-400">
          بروزرسانی: امروز ۱۰:۳۰
        </span>
      </div>

      <div className="relative space-y-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative pr-8"
          >
            <div
              className={`absolute right-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                item.active
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            />

            <p className="text-sm font-bold text-text-main">
              {item.title}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}