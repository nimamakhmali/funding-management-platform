// components/pages/investment-panel/invest-wallet/Request-management.tsx
"use client";

import { useState } from "react";
import { Mail, Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import { useWithdrawal, useWallet } from "@/lib/hooks/useInvestorDashboard";

export default function RequestManagement() {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const { data: wallet } = useWallet();
  const withdrawMutation = useWithdrawal();

  const handleWithdraw = () => {
    const num = parseFloat(amount.replace(/,/g, ""));
    const available = parseFloat(wallet?.available_balance ?? "0");

    if (!num || num <= 0) {
      setError("مبلغ را وارد کنید");
      return;
    }
    if (num > available) {
      setError("مبلغ از موجودی قابل استفاده بیشتر است");
      return;
    }

    setError("");
    withdrawMutation.mutate(num, {
      onSuccess: () => {
        setShowForm(false);
        setAmount("");
      },
      onError: () => {
        setError("خطا در ثبت درخواست برداشت");
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-1 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 relative z-10">
        <div className="flex items-start gap-5">
          <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-200 text-primary">
            <Mail />
          </div>

          <div className="flex flex-col gap-1 text-gray-900">
            <h3 className="text-lg font-bold">مدیریت برداشت</h3>
            <p className="text-sm leading-relaxed">
              موجودی قابل برداشت:{" "}
              <span className="font-bold text-primary">
                {parseFloat(
                  wallet?.available_balance ?? "0"
                ).toLocaleString("fa-IR")}{" "}
                تومان
              </span>
            </p>
          </div>
        </div>

        <Button
          className="flex items-center gap-2 sm:w-auto text-gray-50"
          size="lg"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4" />
          درخواست برداشت وجه
        </Button>
      </div>

      {/* فرم برداشت */}
      {showForm && (
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="مبلغ برداشت (تومان)"
            className="flex-1 h-11 rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-primary"
          />
          <Button
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="h-11 px-6"
          >
            {withdrawMutation.isPending ? "در حال ثبت..." : "تأیید برداشت"}
          </Button>
        </div>
      )}

      {error && (
        <p className="px-6 pb-4 text-sm text-red-500">{error}</p>
      )}

      {withdrawMutation.isSuccess && (
        <p className="px-6 pb-4 text-sm text-green-600">
          درخواست برداشت با موفقیت ثبت شد.
        </p>
      )}
    </div>
  );
}