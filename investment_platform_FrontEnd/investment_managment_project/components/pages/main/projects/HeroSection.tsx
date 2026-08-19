import { Download, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="border-b border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Monitor className="h-5 w-5" />
              <span>فرصت‌های سرمایه‌گذاری</span>
            </div>

            <h1 className="text-3xl font-extrabold text-text-main md:text-4xl">
              لیست پروژه‌های فعال
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
              دسترسی مستقیم به فرصت‌های سرمایه‌گذاری تأیید شده در صنایع زیرساختی و دانش‌بنیان.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}