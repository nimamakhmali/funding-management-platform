"use client";

import { useState } from "react";

import AuthCard from "@/components/pages/auth/login/AuthCard";
import SignupForm from "@/components/pages/auth/sign-up/SignupForm";
import SignupOtpForm from "@/components/pages/auth/sign-up/SignupOtpForm";

export default function SignupPage() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [mobile, setMobile] = useState("");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-light p-4">

      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-blue-500/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-[480px]">

        <AuthCard>
          {step === "form" ? (
            <SignupForm
              onSendOtp={(mobile) => {
                setMobile(mobile);
                setStep("otp");
              }}
            />
          ) : (
            <SignupOtpForm
              mobile={mobile}
              onBack={() => setStep("form")}
            />
          )}
        </AuthCard>

      </div>
    </main>
  );
}