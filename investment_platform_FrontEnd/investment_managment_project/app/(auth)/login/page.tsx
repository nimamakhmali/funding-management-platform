"use client";

import AuthCard from "@/components/pages/auth/login/AuthCard";
import LoginForm from "@/components/pages/auth/login/LoginForm";

export default function AuthPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-light p-4">

      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-blue-500/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-[480px]">
        <AuthCard>
          <LoginForm />
        </AuthCard>

        <div className="mt-8 text-center">
          <p className="text-xs text-text-muted">
            © 2024 پلتفرم سرمایه‌گذاری.
            تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </main>
  );
}