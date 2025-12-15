import ContentWrapper from "@/components/common/ContentWrapper";
import CategorySection from "@/components/home/CategorySection";
import HeroSection from "@/components/home/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col space-y-12">
      <ContentWrapper>
        <HeroSection />
        <CategorySection />
      </ContentWrapper>
    </main>
  );
}
