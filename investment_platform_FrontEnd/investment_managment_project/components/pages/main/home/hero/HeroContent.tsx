import Link from "next/link";
import { heroData, heroStats } from "@/lib/constants/hero.data";

export default function HeroContent() {
  return (
    <div className="text-right">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
        <div className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </div>
        {heroData.badge}
      </div>

      <h1 className="mb-4 text-4xl font-black lg:text-6xl">
        {heroData.title}
        <span className="block text-primary">
          {heroData.highlightedTitle}
        </span>
      </h1>

      <p className="max-w-lg text-text-muted">
        {heroData.description}
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="#featured-projects"
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-primary-dark"
        >
          مشاهده طرح‌ها
        </Link>

        <Link
          href="/projects"
          className="rounded-xl border border-border bg-surface px-6 py-3 font-bold text-text-main transition-all hover:border-primary hover:text-primary"
        >
          لیست پروژه‌ها
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center">
          <div className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-gray-300" />
          <div className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-gray-400" />
          <div className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-gray-500" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white">
            +2K
          </div>
        </div>

        <p className="text-sm text-text-muted">
          اعتماد بیش از {heroStats.investorsCount.toLocaleString("fa-IR")} سرمایه‌گذار
        </p>
      </div>
    </div>
  );
}