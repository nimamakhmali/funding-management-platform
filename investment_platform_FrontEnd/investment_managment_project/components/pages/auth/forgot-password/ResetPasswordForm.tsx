"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/lib/validation/auth.validation";
import { useResetPassword } from "@/lib/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/lib/store/auth.store";

import type { z } from "zod";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type Props = {
  otp: string; // از page.tsx پاس داده می‌شود
};

export default function ResetPasswordForm({ otp }: Props) {
  const { phoneNumber } = useAuthStore();
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
    if (!phoneNumber) return;

    resetPasswordMutation.mutate({
      phone_number: phoneNumber,
      code: otp,
      new_password: data.password,
      new_password_confirm: data.confirmPassword,
    });
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">تنظیم رمز جدید</h1>
        <p className="text-sm text-text-muted">رمز عبور جدید خود را وارد کنید</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            type="password"
            placeholder="رمز جدید"
            {...register("password")}
            className="h-12 rounded-xl border-2 border-border bg-gray-50 px-4 text-sm focus:border-primary focus:ring-0"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="تکرار رمز جدید"
            {...register("confirmPassword")}
            className="h-12 rounded-xl border-2 border-border bg-gray-50 px-4 text-sm focus:border-primary focus:ring-0"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="h-12 w-full rounded-xl bg-primary font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {resetPasswordMutation.isPending ? "در حال ذخیره..." : "ذخیره رمز جدید"}
        </button>
      </form>
    </>
  );
}