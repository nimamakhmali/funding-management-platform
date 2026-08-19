import { investmentSteps } from "@/lib/constants/investment-steps.data";
import StepCard from "./StepCard";

export default function InvestmentStepsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">

        <h2 className="mb-14 text-3xl font-black text-text-main">
          مسیر ساده سرمایه‌گذاری
        </h2>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="absolute top-10 left-0 hidden md:block w-full h-[2px] bg-gray-200 z-0" />

          {investmentSteps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 transition-transform duration-300 hover:-translate-y-2"
            >
              <StepCard {...step} index={step.id} />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}