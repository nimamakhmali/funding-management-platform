import type { Metadata } from "next";

import CreateTicketForm from "@/components/pages/investment-panel/ticket-management/CreateTicketForm";
import PanelContentHeader from "@/components/ui/PanelContentHeader";
import Link from "next/link";
export const metadata: Metadata = {
  title: "ایجاد تیکت جدید | پنل سرمایه‌گذاری",
  description:
    "فرم ایجاد تیکت پشتیبانی در پلتفرم مدیریت سرمایه. درخواست‌ها و مشکلات خود را به صورت امن برای کارشناسان ارسال کنید.",
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <nav
        aria-label="مسیر راهنما"
        className="mb-6 flex items-center gap-2 text-sm"
      >
        <Link
          href="#"
          className="text-text-light hover:text-text-main transition-colors"
        >
          خانه
        </Link>
        <span aria-hidden="true" className="text-text-light">
          /
        </span>
        <Link
          href="#"
          className="text-text-light hover:text-text-main transition-colors"
        >
          پشتیبانی
        </Link>
        <span aria-hidden="true" className="text-text-light">
          /
        </span>
        <Link href="/create"
         className="text-text-main font-bold">ایجاد تیکت جدید</Link>
      </nav>

      <PanelContentHeader
        title="ایجاد تیکت جدید"
        description="لطفاً جزئیات درخواست خود را در فرم زیر وارد کنید. تیکت شما در اسرع وقت توسط کارشناسان بررسی خواهد شد."
      />

      <div className="mt-8">
        <CreateTicketForm />
      </div>
    </div>
  );
}
