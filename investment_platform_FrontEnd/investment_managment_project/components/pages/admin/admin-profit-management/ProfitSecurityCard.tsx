import { Shield } from "lucide-react";

import { AdminProfitSupervisor } from "@/lib/types/admin/admin-profit-management/AdminProfitHistory";

interface Props {
  supervisors: AdminProfitSupervisor[];
}

export default function ProfitSecurityCard({
  supervisors,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="absolute" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary px-3 py-1 text-[10px] font-bold">
            <Shield size={14} />
            امنیت پرداخت
          </div>

          <h4 className="mb-3 text-lg font-bold">
            پروتکل توزیع سود
          </h4>

          <p className="mb-6 text-xs leading-relaxed text-text-main">
            تمامی فرآیندهای محاسباتی و توزیع سود بر اساس استاندارد مالی
            ISO-20022 و پس از تایید دو مرحله‌ای انجام می‌پذیرد.
          </p>
        </div>

        <div className="flex items-center gap-4 text-gray-100">
          <div className="flex -space-x-2 ">
            {supervisors.map((supervisor) => (
              <div
                key={supervisor.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-50 bg-primary text-[9px] font-bold"
              >
                {supervisor.name}
              </div>
            ))}
          </div>

          <span className="text-[10px] font-medium text-gray-500">
            {supervisors.length} ناظر فعال در شبکه
          </span>
        </div>
      </div>
    </div>
  );
}