import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Mobile Sticky CTA Bar
 *
 * Shows a sticky bottom bar on mobile devices with a "Buy Now" button
 * - Always visible on mobile
 * - Hidden on desktop (lg:hidden)
 */
export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
        <Link href="/checkout">
          <Button
            size="lg"
            className="w-full text-lg py-6 font-bold shadow-lg"
          >
            קנה עכשיו
          </Button>
        </Link>
        <p className="text-xs text-center text-gray-500 mt-2">
          משלוח מהיר | החזרה חינם
        </p>
      </div>
    </div>
  );
}
