import { Download } from "lucide-react";
import UpdateButton from "../../investment-panel/profit-report/UpdateButton";

export default function ProfitHeader() {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          گزارش ها
        </h1>
        <p className="text-text-sub text-sm">
          تحلیل عملکرد مالی و وضعیت پروژه ها
        </p>
      </div>
       <div className="flex gap-3">
              <UpdateButton />
              <button className="flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                <Download />
                <span>دانلود گزارش</span>
              </button>
        </div>
    </div>
  );
}