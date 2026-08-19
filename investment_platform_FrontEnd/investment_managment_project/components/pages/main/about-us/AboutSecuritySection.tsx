import { securityItems } from "@/lib/constants/about-us/security.data";
import SecurityCard from "./SecurityCard";

export default function AboutSecuritySection() {
  return (
    <section className="bg-surface py-20">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="mb-12 text-2xl font-bold text-text-main">
          امنیت و انطباق؛ اولویت تزلزل‌ناپذیر ما
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">

          {securityItems.map((item) => (
            <SecurityCard
              key={item.id}
              item={item}
            />
          ))}

        </div>

      </div>

    </section>
  );
}