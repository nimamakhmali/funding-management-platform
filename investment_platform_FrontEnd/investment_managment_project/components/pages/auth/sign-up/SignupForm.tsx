"use client";

import Link from "next/link";
import { Smartphone, TrendingUp, Briefcase } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { SignupFormValues } from "@/lib/types/auth.types";
import { signupSchema } from "@/lib/validation/auth.validation";
import { authService } from "@/lib/api/services/auth.service";
import { useAuthStore } from "@/lib/store/auth.store";
import { normalizePhoneNumber, mapRoleToApi } from "@/lib/utils/auth.utils";

type Props = {
  onSendOtp: (mobile: string) => void;
};

export default function SignupForm({ onSendOtp }: Props) {
  const { setPhoneNumber, setRole } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: { role: "investor", terms: false, mobile: "" },
  });

  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    const normalizedPhone = normalizePhoneNumber(data.mobile);
    const apiRole = mapRoleToApi(data.role);

    // ۱. ثبت‌نام (409 = قبلاً وجود دارد - ادامه بده)
    try {
      await authService.register({ phone_number: normalizedPhone, role: apiRole });
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 409) {
        toast.error("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
        return;
      }
    }

    // ۲. ذخیره در store
    setPhoneNumber(normalizedPhone);
    setRole(apiRole);

    // ۳. ارسال OTP
    try {
      await authService.requestOtp({
        phone_number: normalizedPhone,
        purpose: "VERIFY_PHONE",
      });
    } catch (error) {
      toast.error("ارسال کد تایید با مشکل مواجه شد.");
      return;
    }

    // ۴. رفتن به مرحله OTP
    onSendOtp(data.mobile);
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-text-main">
          ایجاد حساب کاربری
        </h1>
        <p className="text-sm text-text-muted">
          ثبت‌نام سریع و امن در سامانه سرمایه‌گذاری
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-main">
            <Smartphone className="h-4 w-4" />
            شماره موبایل
          </label>
          <Input
            dir="ltr"
            placeholder="09123456789"
            className="h-12 bg-gray-50 border border-border px-4"
            {...register("mobile")}
          />
          {errors.mobile && (
            <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-text-main">
            انتخاب نقش کاربری
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input type="radio" value="investor" className="hidden" {...register("role")} />
              <div className={`rounded-xl border p-4 text-center transition ${
                selectedRole === "investor"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary"
              }`}>
                <TrendingUp className="mx-auto mb-2 h-6 w-6 text-primary" />
                <span className="text-sm font-bold">سرمایه‌گذار</span>
              </div>
            </label>

            <label className="cursor-pointer">
              <input type="radio" value="executor" className="hidden" {...register("role")} />
              <div className={`rounded-xl border p-4 text-center transition ${
                selectedRole === "executor"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary"
              }`}>
                <Briefcase className="mx-auto mb-2 h-6 w-6 text-primary" />
                <span className="text-sm font-bold">مجری پروژه</span>
              </div>
            </label>
          </div>
          {errors.role && (
            <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-text-main">
            <input type="checkbox" className="mt-1 accent-primary" {...register("terms")} />
            قوانین و مقررات را می‌پذیرم
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {isSubmitting ? "در حال ارسال..." : "ارسال کد تایید"}
        </button>
      </form>

      <div className="text-center text-sm mt-6">
        <span className="text-text-muted">حساب کاربری دارید؟</span>
        <Link href="/login" className="mr-2 font-bold text-primary">
          ورود به سامانه
        </Link>
      </div>
    </>
  );
}