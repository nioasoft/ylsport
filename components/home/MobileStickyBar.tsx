"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Mobile Sticky CTA Bar
 *
 * Shows a sticky bottom bar on mobile devices with a "Buy Now" button
 * - Appears only after scrolling past 50% of viewport height
 * - Hides when product section is visible on screen
 * - Mobile only (hidden on desktop)
 */
export function MobileStickyBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isProductVisible, setIsProductVisible] = useState(false);

  useEffect(() => {
    // Scroll detection - show after scrolling 20% of viewport
    const handleScroll = () => {
      const scrolledEnough = window.scrollY > window.innerHeight * 0.2;
      setIsVisible(scrolledEnough && !isProductVisible);
    };

    // Intersection Observer for #product section
    const productSection = document.getElementById("product");

    if (productSection) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsProductVisible(entry.isIntersecting);
          // Update visibility based on both scroll and product visibility
          if (entry.isIntersecting) {
            setIsVisible(false);
          } else {
            const scrolledEnough = window.scrollY > window.innerHeight * 0.2;
            setIsVisible(scrolledEnough);
          }
        },
        {
          threshold: 0.3, // Trigger when 30% of product section is visible
          rootMargin: "0px" // No extra margin
        }
      );

      observer.observe(productSection);

      // Cleanup
      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProductVisible]);

  // Smooth scroll to product section
  const scrollToProduct = () => {
    const productSection = document.getElementById("product");
    if (productSection) {
      productSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
        <Button
          size="lg"
          className="w-full text-lg py-6 font-bold shadow-lg"
          onClick={scrollToProduct}
        >
          קנה עכשיו
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          משלוח מהיר | החזרה חינם
        </p>
      </div>
    </div>
  );
}
