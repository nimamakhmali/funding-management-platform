"use client";

import { useState } from "react";
import AuthCard from "@/components/pages/auth/login/AuthCard";
import ForgotPasswordForm from "@/components/pages/auth/forgot-password/ForgotPasswordForm";
import ForgotPasswordOtpForm from "@/components/pages/auth/forgot-password/ForgotPasswordOtpForm";
import ResetPasswordForm from "@/components/pages/auth/forgot-password/ResetPasswordForm";
import { useAuthStore } from "@/lib/store/auth.store";
import { useVerifyResetOtp } from "@/lib/hooks/auth/useAuthMutations";
import { toast } from "sonner";

type Step = "phone" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("phone");
  const [mobile, setMobile] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");

  const { phoneNumber } = useAuthStore();
  const verifyResetOtpMutation = useVerifyResetOtp();

  const handleOtpSent = (phone: string) => {
    setMobile(phone);
    setStep("otp");
  };

  // OTP را verify می‌کنیم قبل از رفتن به مرحله reset
  const handleOtpConfirm = async (otp: string) => {
    const phone = phoneNumber || mobile;

    try {
      await verifyResetOtpMutation.mutateAsync({
        phone_number: phone,
        code: otp,
      });
      // اگر verify موفق بود OTP را ذخیره کرده به مرحله بعد می‌رویم
      setVerifiedOtp(otp);
      setStep("reset");
    } catch {
      // خطا در useVerifyResetOtp.onError نمایش داده می‌شود
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-light p-4">
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-blue-500/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-[480px]">
        <AuthCard>
          {step === "phone" && (
            <ForgotPasswordForm onSendOtp={handleOtpSent} />
          )}

          {step === "otp" && (
            <ForgotPasswordOtpForm
              mobile={mobile}
              onBack={() => setStep("phone")}
              onConfirm={handleOtpConfirm}
              isLoading={verifyResetOtpMutation.isPending}
            />
          )}

          {step === "reset" && (
            <ResetPasswordForm otp={verifiedOtp} />
          )}
        </AuthCard>
      </div>
    </main>
  );
}