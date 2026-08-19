import AdminExitButton from "./AdminExitButton";
import AdminNewReportButton from "./AdminNewReportButton";
export default function AdminDashboardHeader() {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          داشبورد مدیریت
        </h1>
        <p className="text-text-sub text-sm">
          نمای کلی عملکرد سیستم و عملیات
        </p>
      </div>
       <div className="flex gap-2">
              <AdminExitButton />
              <AdminNewReportButton />
        </div>
      </div>
  )
}