import { FounderStory } from "@/components/home/FounderStory";
import { TechnologySection } from "@/components/home/TechnologySection";
import { ProductBenefits } from "@/components/home/ProductBenefits";
import { Hero } from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { SizeGuide } from "@/components/home/SizeGuide";
import { Testimonials } from "@/components/home/Testimonials";
import { MobileStickyBar } from "@/components/home/MobileStickyBar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Content-First Approach: Story → Education → Product */}
      <FounderStory />
      <TechnologySection />
      <ProductBenefits />

      {/* Product & Purchase */}
      <Hero />
      <ProductShowcase />
      <SizeGuide />

      {/* Social Proof */}
      <Testimonials />

      {/* Mobile Sticky CTA */}
      <MobileStickyBar />
    </div>
  );
}
