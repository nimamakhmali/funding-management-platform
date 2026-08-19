import { Plus } from "lucide-react";
import ExcelExitButton from "./ExcelExitButton";

export default function TransactionHistoryHeader() {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          تاریخچه تراکنش‌ها
        </h1>
        <p className="text-text-sub text-sm">
          مدیریت و مشاهده تمام تراکنش‌های مالی حساب کاربری شما
        </p>
      </div>
      <div className="flex gap-3">
        <ExcelExitButton />
        <button className="flex items-center gap-2 px-6 h-11 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <Plus />
          <span>تراکنش جدید</span>
        </button>
      </div>
    </div>
  );
}
