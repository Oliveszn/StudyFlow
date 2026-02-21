import ContentWrapper from "@/components/common/ContentWrapper";
import CareerSection from "@/components/home/CareerSection";
import CategorySection from "@/components/home/CategorySection";
import ExperienceSection from "@/components/home/ExperienceSection";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";

export default function Home() {
  return (
    <main className="flex flex-col space-y-12">
      <ContentWrapper>
        <HeroSection />
        <CategorySection />
        <TrendingSection />
        <ExperienceSection />
        <CareerSection />
      </ContentWrapper>
    </main>
  );
}
