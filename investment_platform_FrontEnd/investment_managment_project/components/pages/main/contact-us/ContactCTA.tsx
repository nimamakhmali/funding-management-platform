import Link from "next/link";
export default function ContactCTA() {
  return (
    <div className="bg-primary text-white rounded-2xl p-6 space-y-3 shadow-lg">
      <h3 className="font-bold">کاربر سیستم هستید؟</h3>

      <p className="text-sm text-white/80">
        برای پیگیری سریع‌تر وارد پنل شوید
      </p>

      <Link
        href="/login"
        className="w-full flex items-center justify-center bg-white text-primary font-bold py-3 rounded-lg"
      >
        ورود به پنل
      </Link>
    </div>
  );
}