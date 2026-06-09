"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  PRODUCT_IMAGE,
  PRODUCT_NAME,
  PRODUCT_ORIGINAL_PRICE,
  PRODUCT_PRICE,
} from "@/lib/constants";

/** Scroll distance (px) after which the bar slides in — roughly one viewport. */
const REVEAL_THRESHOLD = 500;

/**
 * Desktop sticky price bar.
 *
 * Sits pinned directly below the sticky Header (h-16 / z-50) and slides in once
 * the user scrolls past the first viewport, then stays visible. Surfaces the
 * price + "buy now" CTA early without reordering the content-first homepage.
 *
 * Desktop only (`hidden lg:flex`) — on mobile the price lives in MobileStickyBar.
 */
export function TopPriceBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setIsVisible(window.scrollY > REVEAL_THRESHOLD);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    // Sync on mount in case the page loads already scrolled (e.g. anchor link).
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 top-16 z-40 hidden border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out lg:block ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-[120%] opacity-0"
      }`}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Product (right in RTL) */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-primary-light">
            <Image
              src={PRODUCT_IMAGE}
              alt={PRODUCT_NAME}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">{PRODUCT_NAME}</p>
            <p className="text-xs font-bold text-accent">מבצע מוגבל!</p>
          </div>
        </div>

        {/* Price + CTA (left in RTL) */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(PRODUCT_PRICE)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(PRODUCT_ORIGINAL_PRICE)}
            </span>
          </div>
          <Link href="/checkout" tabIndex={isVisible ? undefined : -1}>
            <Button
              size="sm"
              className="font-bold shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              קנה עכשיו
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
