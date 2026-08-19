"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Card from "@/components/ui/Card";
import { toPersianNumber } from "@/lib/utils/Numberformat";
import { useInvest } from "@/lib/hooks/useInvestorDashboard";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
  minAmount: number;
  maxAmount: number;
  balance: number;
}

export function InvestmentProjectAmountConnected({
  projectId,
  minAmount,
  maxAmount,
  balance,
}: Props) {
  const [amount, setAmount] = useState(minAmount);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { mutate: invest, isPending } = useInvest();

  const quickButtons = [
    { label: `+ ${toPersianNumber(1_000_000)}`, amount: 1_000_000 },
    { label: `+ ${toPersianNumber(5_000_000)}`, amount: 5_000_000 },
    { label: `+ ${toPersianNumber(10_000_000)}`, amount: 10_000_000 },
  ];

  function handleAdd(val: number) {
    setAmount((prev) => Math.min(prev + val, maxAmount));
    setError(null);
  }

  function handleMax() {
    setAmount(Math.min(balance, maxAmount));
    setError(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value) || 0;
    setAmount(val);
    setError(null);
  }

  function handleSubmit() {
    if (!agreed) {
      setError("لطفاً شرایط و قوانین را بپذیرید.");
      return;
    }
    if (amount < minAmount) {
      setError(`حداقل مبلغ سرمایه‌گذاری ${toPersianNumber(minAmount)} تومان است.`);
      return;
    }
    if (amount > maxAmount) {
      setError(`حداکثر مبلغ سرمایه‌گذاری ${toPersianNumber(maxAmount)} تومان است.`);
      return;
    }
    if (amount > balance) {
      setError("موجودی کیف پول کافی نیست.");
      return;
    }

    invest(
      { project_id: projectId, amount },
      {
        onSuccess: () => {
          router.push("/payment-result?status=success");
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? "خطا در ثبت سرمایه‌گذاری";
          setError(msg);
        },
      }
    );
  }

  const investmentData = {
    title: "مبلغ سرمایه‌گذاری",
    value: amount,
    unit: "تومان",
    balance,
    minAmount,
    maxAmount,
  };

  return (
    <Card
      data={investmentData}
      mapping={{ title: "title", value: "value", unit: "unit" }}
      renderTitle={(title) => (
        <div className="flex justify-between items-center w-full flex-wrap gap-2">
          <h3 className="text-lg font-bold text-text-main">{title}</h3>
          <div className="flex items-center gap-1.5 text-primary text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <span>موجودی: </span>
            <span className="text-text-main font-bold">
              {toPersianNumber(balance)}
            </span>
            <span>تومان</span>
          </div>
        </div>
      )}
      renderValue={(value, unit) => (
        <div className="relative group mt-8">
          <Label className="absolute -top-3 right-4 bg-white px-2 text-xs font-medium text-primary -mt-2">
            مبلغ به تومان
          </Label>
          <div className="relative flex items-center">
            <Input
              className="block w-full rounded-xl py-2 pr-4 pl-16 text-right text-2xl font-bold shadow-sm border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="0"
              type="number"
              value={amount}
              onChange={handleChange}
              min={minAmount}
              max={maxAmount}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-gray-400 font-medium">{unit}</span>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-[11px] text-text-secondary">
            <span>Min: {toPersianNumber(minAmount)}</span>
            <span>Max: {toPersianNumber(maxAmount)}</span>
          </div>
        </div>
      )}
      renderFooter={() => (
        <div className="w-full mt-4 space-y-6">
          <div className="flex flex-wrap gap-2">
            {quickButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="outline"
                type="button"
                onClick={() => handleAdd(btn.amount)}
                className="px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-primary hover:border-primary hover:text-primary transition-all hover:bg-primary/5"
              >
                {btn.label}
              </Button>
            ))}
            <Button
              variant="outline"
              type="button"
              onClick={handleMax}
              className="px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-primary hover:border-primary hover:text-primary transition-all hover:bg-primary/5"
            >
              حداکثر
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="pt-6 border-t border-gray-200">
            <div className="flex gap-3 items-start p-4 rounded-xl">
              <div className="flex h-6 items-center">
                <Checkbox
                  id="terms"
                  className="border border-gray-300"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(!!v)}
                />
              </div>
              <div className="text-sm leading-6">
                <Label
                  htmlFor="terms"
                  className="font-bold text-text-main cursor-pointer"
                >
                  شرایط و قوانین را می‌پذیرم
                </Label>
                <p className="text-gray-800 mt-3 text-xs">
                  با پرداخت این مبلغ، شما قرارداد مشارکت در پروژه را امضا
                  می‌کنید.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !agreed}
            className="w-full bg-primary text-white font-bold text-base py-6 rounded-xl shadow-lg transition-all"
          >
            {isPending ? "در حال پردازش..." : "پرداخت و ثبت سرمایه‌گذاری"}
          </Button>
        </div>
      )}
    />
  );
}