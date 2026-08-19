import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

import { authService } from "@/lib/api/services/auth.service";
import { useAuthStore } from "@/lib/store/auth.store";
import { normalizePhoneNumber, getRoleDashboardPath, extractErrorMessage } from "@/lib/utils/auth.utils";

// ─── Register ────────────────────────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof authService.register>[0]) => {
      try {
        await authService.register(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          return; // کاربر قبلاً ثبت‌نام کرده - ادامه بده
        }
        throw error;
      }
    },
    onError: () => {
      toast.error("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
    },
  });
}

// ─── OTP Request ─────────────────────────────────────────────────────────────

export function useRequestOtp() {
  return useMutation({
    mutationFn: authService.requestOtp,
    onError: () => {
      toast.error("ارسال کد تایید با مشکل مواجه شد.");
    },
  });
}

// ─── OTP Verify ──────────────────────────────────────────────────────────────

export function useVerifyOtp() {
  return useMutation({
    mutationFn: authService.verifyOtp,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error("تعداد تلاش‌های مجاز تجاوز کرد. لطفاً کمی صبر کنید.");
      } else {
        toast.error("کد وارد شده اشتباه است یا منقضی شده.");
      }
    },
  });
}

// ─── Login ───────────────────────────────────────────────────────────────────

export function useLogin() {
  const router = useRouter();
  const { setTokens, setPhoneNumber } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // ۱. ذخیره توکن‌ها (role از JWT decode می‌شود)
      setTokens(data.access, data.refresh);

      toast.success("ورود موفق");

      // ۲. دریافت پروفایل برای تعیین نقش دقیق و redirect صحیح
      try {
        const profile = await authService.getProfile();
        const userRole = profile.user
          ? (await getUserRole(data.access))
          : "INVESTOR";
        router.push(getRoleDashboardPath(userRole));
      } catch {
        // اگر پروفایل دریافت نشد از role موجود در store استفاده کن
        const role = useAuthStore.getState().role ?? "INVESTOR";
        router.push(getRoleDashboardPath(role));
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("شماره موبایل یا رمز عبور اشتباه است.");
      } else {
        toast.error("خطا در ورود. لطفاً دوباره تلاش کنید.");
      }
    },
  });
}

// helper: role را از JWT یا API می‌گیریم
async function getUserRole(accessToken: string): Promise<string> {
  try {
    const base64 = accessToken.split(".")[1];
    const payload = JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
    return payload.role ?? "INVESTOR";
  } catch {
    return "INVESTOR";
  }
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error("لطفاً چند دقیقه صبر کنید.");
      } else {
        toast.error("خطا در ارسال کد بازیابی.");
      }
    },
  });
}

// ─── Verify OTP for Reset Password ───────────────────────────────────────────

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: (data: { phone_number: string; code: string }) =>
      authService.verifyOtp({
        phone_number: data.phone_number,
        code: data.code,
        purpose: "RESET_PASSWORD",
      }),
    onError: () => {
      toast.error("کد وارد شده اشتباه است یا منقضی شده.");
    },
  });
}

// ─── Reset Password ──────────────────────────────────────────────────────────

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت تغییر کرد.");
      router.push("/login");
    },
    onError: (error) => {
     if (axios.isAxiosError(error) && error.response?.status === 400) {
          const detail =
            extractErrorMessage(error.response.data) || "خطا در تغییر رمز عبور.";
          toast.error(detail);
        } else {
        toast.error("خطا در تغییر رمز عبور.");
      }
    },
  });
}

// ─── Complete Individual Profile ─────────────────────────────────────────────

export function useCompleteIndividualProfile() {
  const router = useRouter();
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.completeIndividualProfile,
    onSuccess: async (_, variables) => {
      toast.success("اطلاعات با موفقیت ثبت شد.");

      // بعد از تکمیل پروفایل، لاگین خودکار با شماره و رمز وارد‌شده
      try {
        const loginData = await authService.login({
          phone_number: variables.phone_number,
          password: variables.password,
        });
        setTokens(loginData.access, loginData.refresh);

        // role از توکن خوانده می‌شود — سرمایه‌گذار به داشبورد خودش
        const role = useAuthStore.getState().role ?? "INVESTOR";
        router.push(getRoleDashboardPath(role));
      } catch {
        // اگر auto-login نشد، به login هدایت کن
        toast.error("لطفاً با رمز عبور جدید وارد شوید.");
        router.push("/login");
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = extractErrorMessage(error.response?.data);
        if (msg) {
          toast.error(msg);
        } else {
          toast.error("خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.");
        }
      } else {
        toast.error("خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.");
      }
    },
  });
}

// ─── Complete Legal Entity Profile ───────────────────────────────────────────

export function useCompleteLegalEntityProfile() {
  const router = useRouter();
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.completeLegalEntityProfile,
    onSuccess: async (_, variables) => {
      toast.success("اطلاعات شرکت با موفقیت ثبت شد.");

      try {
        const loginData = await authService.login({
          phone_number: variables.phone_number,
          password: variables.password,
        });
        setTokens(loginData.access, loginData.refresh);

        const role = useAuthStore.getState().role ?? "PROJECT_OWNER";
        router.push(getRoleDashboardPath(role));
      } catch {
        toast.error("لطفاً با رمز عبور جدید وارد شوید.");
        router.push("/login");
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = extractErrorMessage(error.response?.data);
        if (msg) {
          toast.error(msg);
        } else {
          toast.error("خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.");
        }
      } else {
        toast.error("خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.");
      }
    },
  });
}

// ─── Get Profile (Query) ──────────────────────────────────────────────────────

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
  });
}