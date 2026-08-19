import AdminProfitGetExcelButton from "./AdminProfitGetExcelButton";
import AdminProfitDistributionButton from "./AdminProfitDistributionButton";

export default function AdminProfitManagementHeader() {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          مدیریت توزیع سود
        </h1>
        <p className="text-text-sub text-sm">
          مدیریت و تایید نهایی توزیع سود دوره ای سرمایه گذاران
        </p>
      </div>
       <div className="flex gap-2">
              <AdminProfitGetExcelButton />
              <AdminProfitDistributionButton />
            </div>
      </div>
  )
}