import { Edit } from "lucide-react";
import FinancialReportButton from "./FinancialReportButton";

export default function ProjectDetailsHeader() {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          جزئیات پروژه
        </h1>
        <p className="text-text-sub text-sm">
          مدیریت اطلاعات، مستندات و تحلیل عملکرد پروژه
        </p>
      </div>

      <div className="flex items-center gap-3">
        <FinancialReportButton />
        <button className="flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <Edit />
          <span>ویرایش اطلاعات پروژه</span>
        </button>
      </div>
    </div>
  );
}