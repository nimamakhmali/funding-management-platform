import { Check } from "lucide-react";

export function PaymentResultSection() {
  return (
    <header className="flex flex-col items-center px-6 pt-6 pb-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <Check size={30} className="text-primary" />
      </div>
      <h2 className="text-xl font-bold text-text-main">
        پرداخت با موفقیت انجام شد
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-gray-500">
        تراکنش شما ثبت و مبلغ مورد نظر به کیف پول سرمایه‌گذاری شما افزوده شد.
      </p>
    </header>
  );
}