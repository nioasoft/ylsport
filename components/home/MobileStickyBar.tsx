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
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] px-4 pt-3 pb-6">
        <Link href="/checkout">
          <Button
            size="lg"
            className="w-full text-lg py-6 font-bold shadow-lg bg-primary hover:bg-primary/90"
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
