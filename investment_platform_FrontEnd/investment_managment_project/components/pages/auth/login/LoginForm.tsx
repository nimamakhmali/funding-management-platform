"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInputField } from "@/components/ui/FormInputField";
import { LoginFormValues } from "@/lib/types/auth.types";
import { loginSchema } from "@/lib/validation/auth.validation";
import { useLogin } from "@/lib/hooks/auth/useAuthMutations";
import { normalizePhoneNumber } from "@/lib/utils/auth.utils";

export default function LoginForm() {
  const loginMutation = useLogin();

  const { handleSubmit, control, register } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      phone_number: normalizePhoneNumber(data.username),
      password: data.password,
    });
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <LogIn className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">ورود به حساب کاربری</h1>
        <p className="text-sm text-text-muted">
          دسترسی امن به سامانه مدیریت سرمایه‌گذاری
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInputField
          control={control}
          name="username"
          label="شماره موبایل"
          placeholder="09123456789"
          className="mt-2"
        />

        <FormInputField
          control={control}
          name="password"
          label="رمز عبور"
          type="password"
          placeholder="رمز عبور"
          className="mt-2"
        />

        <div className="mt-4 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-text-muted">
            <input
              type="checkbox"
              className="accent-primary"
              {...register("rememberMe")}
            />
            مرا به خاطر بسپار
          </label>
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            فراموشی رمز عبور؟
          </Link>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
        >
          {loginMutation.isPending ? "در حال ورود..." : "ورود به سامانه"}
        </button>
      </form>

      <div className="mt-8 border-t pt-6 text-center text-sm">
        <span className="text-text-muted">حساب کاربری ندارید؟</span>
        <Link href="/sign-up" className="mr-2 font-bold text-primary hover:underline">
          ثبت نام
        </Link>
      </div>
    </>
  );
}