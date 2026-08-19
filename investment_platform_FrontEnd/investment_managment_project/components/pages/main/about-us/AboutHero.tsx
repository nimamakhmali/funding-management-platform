import {
  aboutHeroData,
  aboutStats,
} from "@/lib/constants/about-us/about.data";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-32">

      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] background-size: 16px 16px " />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">

        <h1 className="mb-6 text-4xl font-black leading-tight text-text-main md:text-5xl lg:text-6xl">

          {aboutHeroData.title}

          <span className="mt-2 block text-primary">
            {aboutHeroData.highlightedTitle}
          </span>

        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-muted lg:text-xl">
          {aboutHeroData.description}
        </p>

        <div className="flex justify-center gap-12 border-t border-dashed border-gray-200 pt-8">

          {aboutStats.map((item) => (
            <div key={item.id} className="text-center">

              <div className="mb-1 text-3xl font-black text-primary">
                {item.value}
              </div>

              <div className="text-sm text-text-muted">
                {item.label}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}