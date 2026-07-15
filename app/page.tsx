import { FounderStory } from "@/components/home/FounderStory";
import { SizeGuide } from "@/components/home/SizeGuide";
import { TechnologySection } from "@/components/home/TechnologySection";
import { ProductBenefits } from "@/components/home/ProductBenefits";
import { Hero } from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { MobileStickyBar } from "@/components/home/MobileStickyBar";
import { TopPriceBar } from "@/components/home/TopPriceBar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Desktop sticky price bar — reveals on scroll */}
      <TopPriceBar />

      {/* Content-First Approach: Story → Education → Product */}
      <FounderStory />

      {/* Size guide — surfaced early, right after the video/story section */}
      <SizeGuide />

      <TechnologySection />
      <ProductBenefits />

      {/* Product & Purchase */}
      <Hero />
      <ProductShowcase />

      {/* Social Proof */}
      <Testimonials />

      {/* Mobile Sticky CTA */}
      <MobileStickyBar />
    </div>
  );
}
