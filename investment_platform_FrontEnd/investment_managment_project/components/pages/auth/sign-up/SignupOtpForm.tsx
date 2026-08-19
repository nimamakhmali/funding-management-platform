"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { OtpFormValues } from "@/lib/types/auth.types";
import { useVerifyOtp } from "@/lib/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/lib/store/auth.store";

type SignupOtpFormProps = {
  mobile: string;
  onBack: () => void;
};

export default function SignupOtpForm({ mobile, onBack }: SignupOtpFormProps) {
  const router = useRouter();
  const { phoneNumber } = useAuthStore();
  const verifyOtpMutation = useVerifyOtp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OtpFormValues) => {
    const phone = phoneNumber || mobile;

    await verifyOtpMutation.mutateAsync({
      phone_number: phone,
      code: data.otp,
      purpose: "VERIFY_PHONE",
    });

    router.push("/complete-user-information");
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">تایید کد یکبار مصرف</h1>
        <p className="text-sm text-text-muted">
          کد تایید به شماره {mobile} ارسال شد
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "کد تایید الزامی است",
            minLength: { value: 6, message: "کد باید ۶ رقم باشد" },
          }}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
            >
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

        {errors.otp && (
          <p className="text-center text-xs text-red-500">
            {errors.otp.message}
          </p>
        )}

        <button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="h-12 w-full rounded-lg bg-primary font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {verifyOtpMutation.isPending ? "در حال تایید..." : "تایید و ادامه"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 text-sm text-text-muted"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
      </form>
    </>
  );
}