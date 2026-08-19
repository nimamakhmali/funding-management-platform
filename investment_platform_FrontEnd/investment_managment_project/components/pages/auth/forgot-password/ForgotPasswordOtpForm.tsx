"use client";

import { useForm, Controller } from "react-hook-form";
import { ShieldCheck, ArrowRight } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Props = {
  mobile: string;
  onBack: () => void;
  onConfirm: (otp: string) => void;
  isLoading?: boolean;
};

export default function ForgotPasswordOtpForm({
  mobile,
  onBack,
  onConfirm,
  isLoading = false,
}: Props) {
  const { control, handleSubmit } = useForm({
    defaultValues: { otp: "" },
  });

  const onSubmit = (data: { otp: string }) => {
    onConfirm(data.otp);
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">تایید کد</h1>
        <p className="text-sm text-text-muted">کد ارسال شده به {mobile}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="otp"
          control={control}
          rules={{ required: true, minLength: 6 }}
          render={({ field }) => (
            <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-60"
        >
          {isLoading ? "در حال تایید..." : "تایید"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 text-sm text-text-muted"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
      </form>
    </>
  );
}