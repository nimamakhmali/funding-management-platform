import {
  ShieldCheck,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react";

export default function PlatformIllustration() {
  return (
    <div className="relative flex items-center justify-center">

      <div className="absolute h-96 w-96 rounded-full bg-primary/30 blur-xl " />

      <div className=" transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl relative z-10 flex h-70 w-70 items-center justify-center rounded-full bg-primary-400 from-primary to-primary-dark shadow-2xl">

        <BarChart3 className="h-24 w-24 text-white" />

      </div>
      <div className="absolute top-0 right-0 rounded-2xl border border-border bg-white p-4 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-3 ">

          <div className="rounded-xl bg-green-100 p-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>

          <div>
            <p className="text-xs text-text-muted">
              سوددهی
            </p>

            <h4 className="font-bold">
              پایش هوشمند
            </h4>
          </div>

        </div>
      </div>

      <div className="absolute left-0 top-1/3 rounded-2xl border border-border bg-white p-4 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-text-muted">
              امنیت
            </p>

            <h4 className="font-bold">
              چند لایه
            </h4>
          </div>

        </div>
      </div>

      <div className="absolute top-60 right-0 rounded-2xl border border-border bg-white p-4 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-amber-100 p-2">
            <FileText className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <p className="text-xs text-text-muted">
              شفافیت
            </p>

            <h4 className="font-bold">
              گزارش لحظه‌ای
            </h4>
          </div>

        </div>
      </div>

    </div>
  );
}