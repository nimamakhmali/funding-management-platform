import HeroContent from "./HeroContent";
import HeroPortfolioCard from "./HeroPortfolioCard";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20">

      <div className="absolute top-0 right-0   height: 600px width: 600px rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto max-width: 1280px px-6">

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

          <HeroContent />

          <HeroPortfolioCard />

        </div>

      </div>

    </section>
  );
}