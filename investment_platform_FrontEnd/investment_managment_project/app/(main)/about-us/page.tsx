import AboutApproachSection from "@/components/pages/main/about-us/AboutApproachSection";
import AboutChallengesSection from "@/components/pages/main/about-us/AboutChallengesSection";
import AboutHero from "@/components/pages/main/about-us/AboutHero";
import AboutMissionSection from "@/components/pages/main/about-us/AboutMissionSection";
import AboutSecuritySection from "@/components/pages/main/about-us/AboutSecuritySection";

export default function Page() {
  return <div>
    <AboutHero />
    <AboutMissionSection />
    <AboutChallengesSection />
    <AboutApproachSection />
    <AboutSecuritySection />

  </div>
}