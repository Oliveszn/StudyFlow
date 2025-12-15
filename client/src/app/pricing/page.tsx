import ContentWrapper from "@/components/common/ContentWrapper";
import PlanCompare from "@/components/pricing/PlanCompare";
import PricingHero from "@/components/pricing/PricingHero";

export default function Pricing() {
  return (
    <main className="">
      <ContentWrapper>
        <PricingHero />
        <div className="hidden md:block">
          <PlanCompare />
        </div>
      </ContentWrapper>
    </main>
  );
}
