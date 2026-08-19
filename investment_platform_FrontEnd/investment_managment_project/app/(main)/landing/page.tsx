import AboutPlatformSection from "@/components/pages/main/home/about-platform/AboutPlatformSection"
import FeaturedProjects from "@/components/pages/main/home/featured-projects/FeaturedProjects"
import Hero from "@/components/pages/main/home/hero/Hero"
import InvestmentStepsSection from "@/components/pages/main/home/InvestmentSteps/InvestmentStepsSection"
import PlatformStatsSection from "@/components/pages/main/home/PlatformStats/PlatformStatsSection"
import StatsSection from "@/components/pages/main/home/StatsSection"

export default function Page() {

return <div className="p-4">


<Hero />
<StatsSection />
<FeaturedProjects />
<AboutPlatformSection />
<PlatformStatsSection />
<InvestmentStepsSection />
</div> }
