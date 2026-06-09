import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_ORIGINAL_PRICE, PRODUCT_PRICE } from "@/lib/constants";

/**
 * Mobile Sticky CTA Bar
 *
 * Shows a sticky bottom bar on mobile devices with the price + a "Buy Now" button
 * - Always visible on mobile (so the price is surfaced immediately)
 * - Hidden on desktop (lg:hidden)
 */
export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none lg:hidden">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-2xl px-4 pt-3 pb-4 w-full max-w-md pointer-events-auto mb-2">
        {/* Price */}
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(PRODUCT_PRICE)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(PRODUCT_ORIGINAL_PRICE)}
          </span>
        </div>
        <Link href="/checkout">
          <Button
            size="lg"
            className="w-full text-lg py-6 font-bold shadow-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            אני רוצה את הטייץ שלי ✨
          </Button>
        </Link>
        <div className="flex justify-between items-center mt-3 px-1">
          <p className="text-[10px] text-gray-500">
            ✓ משלוח מהיר | ✓ החלפה בקלות
          </p>
          <p className="text-[10px] font-bold text-red-500 animate-pulse">
            נשארו יחידות אחרונות במלאי!
          </p>
        </div>
      </div>
    </div>
  );
}
