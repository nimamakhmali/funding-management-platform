import { homeStats } from "@/lib/constants/home-stats.data";

export default function StatsSection() {
  return (
    <section className="py-20 bg-primary-50">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

          {homeStats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="p-6 text-center">

                <div className="flex items-center justify-center gap-2 mb-3">
                  <Icon className="w-6 h-6 text-primary" />

                  <h3 className="text-2xl font-black text-gray-700">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-text-muted">
                  {item.label}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}