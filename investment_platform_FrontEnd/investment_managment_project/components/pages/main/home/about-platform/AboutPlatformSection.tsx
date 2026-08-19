import Image from "next/image";
import { ShieldCheck, Eye } from "lucide-react";
import PlatformIllustration from "./PlatformIllustration";

export default function AboutPlatformSection() {
  return (
    <section className="py-24 bg-primary-50 ">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div>
            <PlatformIllustration />
          </div>

          <div>
            <span className="text-sm font-bold text-primary">
              درباره پلتفرم
            </span>

            <h2 className="mt-4 text-4xl font-black text-text-main ">
              مدیریت هوشمند سرمایه
            </h2>

            <p className="mt-6 leading-8 text-text-muted">
              ما محیطی را فراهم کرده‌ایم که در آن سرمایه‌گذاران
              و پروژه‌های نوآورانه در یک بستر امن و شفاف
              به یکدیگر متصل می‌شوند.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 ">

              <div className="rounded-2xl border border-border p-6 bg-surface transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <ShieldCheck className="mb-4 h-8 w-8 text-primary" />

                <h3 className="font-bold">
                  امنیت نهادینه
                </h3>

                <p className="mt-2 text-sm text-text-muted">
                  حفاظت چندلایه از اطلاعات و دارایی کاربران
                </p>
              </div>

              <div className="rounded-2xl border border-border p-6 bg-surface transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <Eye className="mb-4 h-8 w-8 text-primary" />

                <h3 className="font-bold">
                  شفافیت لحظه‌ای
                </h3>

                <p className="mt-2 text-sm text-text-muted">
                  گزارش‌دهی دقیق و آنلاین از وضعیت سرمایه‌گذاری
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}