import { Hourglass, TriangleAlert } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  status: "failed" | "success" | "pending";
};

export default function AuthenticationStatusSwitch({ status }: Props) {
  let statusComponent: ReactNode | null = null;

  switch (status) {
    case "failed":
      statusComponent = (
        <section
          className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
          aria-labelledby="failed-heading"
          role="region"
        >
          <div className="flex items-center gap-4">
            <figure
              className="size-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <TriangleAlert className="size-6" />
            </figure>
            <header>
              <h2 id="failed-heading" className="font-bold text-text-main mb-1">
                تکمیل نشده
              </h2>
              <p className="text-sm text-text-secondary">
                برای دسترسی به امکانات سرمایه‌گذاری، پروفایل شما باید تأیید شود.
              </p>
            </header>
          </div>
          <output
            className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 whitespace-nowrap mt-2 md:mt-0"
            aria-label="نیاز به اقدام"
            role="status"
          >
            <span
              className="size-2 rounded-full bg-red-500 animate-pulse"
              aria-hidden="true"
            />
            نیاز به اقدام
          </output>
        </section>
      );
      break;
    case "pending":
      statusComponent = (
        <section
          className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 flex items-center gap-4"
          aria-labelledby="pending-heading"
          role="region"
        >
          <figure
            className="size-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-xl">
              <Hourglass />
            </span>
          </figure>
          <header>
            <h2
              id="pending-heading"
              className="font-bold text-amber-800 mb-1 text-sm"
            >
              در انتظار بررسی
            </h2>
            <p className="text-xs text-amber-700">
              اطلاعات شما ثبت شده و در صف بررسی توسط کارشناسان قرار دارد.
            </p>
          </header>
        </section>
      );
      break;
    default:
      throw new Error("some thing went wrong");
  }

  return statusComponent;
}
