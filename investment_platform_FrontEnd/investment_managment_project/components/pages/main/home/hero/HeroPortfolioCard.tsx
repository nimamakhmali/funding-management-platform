import { heroStats } from "@/lib/constants/hero.data";

export default function HeroPortfolioCard() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="mb-6 text-right">
        <p className="text-sm text-text-muted">
          بازدهی کل پورتفو
        </p>

        <div className="mt-2 flex items-end justify-between">

          <div className="text-2xl font-black">
            {heroStats.portfolioValue.toLocaleString("fa-IR")} تومان
          </div>

          <div className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
            +{heroStats.growth}%
          </div>

        </div>
      </div>

      <div className="mt-6 flex h-40 items-end gap-2">
        <div className="h-[40%] w-full bg-primary/20 rounded" />
        <div className="h-[60%] w-full bg-primary/30 rounded" />
        <div className="h-[30%] w-full bg-primary/20 rounded" />
        <div className="h-[80%] w-full bg-primary/40 rounded" />
        <div className="h-[50%] w-full bg-primary/30 rounded" />
        <div className="h-[90%] w-full bg-primary rounded" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-4 text-right">

        <div className="flex justify-between">

          <div>
            <p className="text-sm font-bold">
              پروژه برج آفتاب
            </p>
            <p className="text-xs text-text-muted">
              تامین مالی موفق
            </p>
          </div>

          <span className="text-sm font-bold text-primary">
            تکمیل شد
          </span>

        </div>

      </div>

    </div>
  );
}