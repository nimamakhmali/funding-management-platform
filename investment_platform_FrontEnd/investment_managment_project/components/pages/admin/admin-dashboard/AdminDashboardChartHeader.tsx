
import { Button } from "@/components/ui/button";

export default function AdminDashboardChartHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-text-main">
          عملکرد سرمایه‌گذاری
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          نمودار رشد سرمایه در ۶ ماه گذشته
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
        >
          هفتگی
        </Button>

        <Button
          size="sm"
          className="text-white"
        >
          ماهانه
        </Button>
      </div>
    </div>
  );
}