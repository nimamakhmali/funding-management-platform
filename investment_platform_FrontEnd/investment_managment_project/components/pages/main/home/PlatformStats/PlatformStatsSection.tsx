import { platformStats } from "@/lib/constants/platform-stats.data";
import StatCard from "./StatCard";

export default function PlatformStatsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {platformStats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
            />
          ))}

        </div>

      </div>
    </section>
  );
}