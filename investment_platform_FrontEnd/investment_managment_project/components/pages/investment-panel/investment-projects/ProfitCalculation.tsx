"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { toPersianNumber } from "@/lib/utils/Numberformat";

interface Props {
  profitRate: number;       // درصد سود سالانه
  minAmount: number;        // حداقل سرمایه‌گذاری
  existingInvestment: number | null;  // سرمایه‌گذاری موجود
}

export function ProfitCalculationCardConnected({
  profitRate,
  minAmount,
  existingInvestment,
}: Props) {
  const [capital, setCapital] = useState(existingInvestment ?? minAmount);

  useEffect(() => {
    if (existingInvestment) setCapital(existingInvestment);
  }, [existingInvestment]);

  const estimatedProfit = capital * profitRate / 100;
  const total = capital + estimatedProfit;

  const detailItems = [
    {
      label: "مبلغ اصل سرمایه",
      value: toPersianNumber(capital),
      isProfit: false,
    },
    {
      label: "نرخ سود سالانه",
      value: `${toPersianNumber(profitRate)}%`,
      isProfit: false,
    },
    {
      label: "سود تخمینی (۱۲ ماه)",
      value: `+ ${toPersianNumber(Math.round(estimatedProfit))}`,
      isProfit: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-50 shadow-md p-6 sticky">
      <Card
        data={{ title: "محاسبه سود", value: total }}
        mapping={{ title: "title", value: "value" }}
        className="border-none shadow-none p-0"
        renderTitle={(title) => (
          <h3 className="text-lg font-bold text-text-main">{title}</h3>
        )}
        renderValue={() => (
          <>
            <div className="flex flex-col gap-4">
              {detailItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-dashed border-gray-200"
                >
                  <span className="text-text-secondary text-xs">
                    {item.label}
                  </span>
                  <span
                    className={`font-bold text-sm ${
                      item.isProfit ? "text-primary" : "text-text-main"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-primary-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-1 items-center justify-center text-center">
              <span className="text-text-main text-[10px] font-bold uppercase tracking-wide">
                مجموع دریافتی تخمینی
              </span>
              <span className="text-2xl font-black text-text-main mt-1">
                {toPersianNumber(Math.round(total))}
              </span>
              <span className="text-primary text-xs mt-1">تومان</span>
            </div>
          </>
        )}
      />

      <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-text-secondary">
        <span>محاسبه تخمینی بر اساس نرخ سود اعلام‌شده</span>
      </div>
    </div>
  );
}