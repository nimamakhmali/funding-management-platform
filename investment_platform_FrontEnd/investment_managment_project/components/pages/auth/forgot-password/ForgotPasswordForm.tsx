"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";

import { forgotPasswordSchema } from "@/lib/validation/auth.validation";
import { ForgotPasswordFormValues } from "@/lib/types/auth.types";
import { useForgotPassword } from "@/lib/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/lib/store/auth.store";
import { normalizePhoneNumber } from "@/lib/utils/auth.utils";

type Props = {
  onSendOtp: (mobile: string) => void;
};

export default function ForgotPasswordForm({ onSendOtp }: Props) {
  const { setPhoneNumber } = useAuthStore();
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const normalizedPhone = normalizePhoneNumber(data.mobile);
    setPhoneNumber(normalizedPhone);

    await forgotPasswordMutation.mutateAsync({
      phone_number: normalizedPhone,
    });

    onSendOtp(data.mobile);
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">بازیابی رمز عبور</h1>
        <p className="text-sm text-text-muted">شماره موبایل خود را وارد کنید</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">شماره موبایل</label>
          <Input
            dir="ltr"
            placeholder="09123456789"
            className="h-12 bg-gray-50 border-gray-200 px-4"
            {...register("mobile")}
          />
          {errors.mobile && (
            <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="h-12 w-full rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-60"
        >
          {forgotPasswordMutation.isPending ? "در حال ارسال..." : "ارسال کد تایید"}
        </button>
      </form>
    </>
  );
}