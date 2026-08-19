import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PiggyBank } from "lucide-react";

export default function InvestmentCard() {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        bg-primary
        p-8
        text-white
        shadow-lg
      "
    >
      <div className="flex flex-col items-center text-center">

        <div
          className="
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-white/20
          "
        >
          <PiggyBank className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-extrabold">
          سرمایه‌گذاری در این پروژه
        </h2>

        <p className="mt-3 leading-8 text-white/90">
          فرصت را از دست ندهید.
          با حداقل سرمایه در این پروژه مشارکت کنید.
        </p>

        <Link
          href="/login"
          className="
    mt-8
    flex
    w-full
    items-center
    justify-center
    rounded-xl
    bg-white
    px-4
    py-2
    text-primary
    hover:bg-gray-100
  "
        >
          ورود به حساب کاربری
        </Link>
        <Link
          href="/sign-up"
          className="
    mt-3
    flex
    w-full
    items-center
    justify-center
    rounded-xl
    border
    border-white
    bg-transparent
    px-4
    py-2
    text-white
    hover:bg-white/10
  "
        >
          ثبت‌نام رایگان
        </Link>

      </div>
    </section>
  );
}