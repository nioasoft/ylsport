import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_ORIGINAL_PRICE, PRODUCT_PRICE } from "@/lib/constants";

const DISCOUNT_PCT = Math.round(
  (1 - PRODUCT_PRICE / PRODUCT_ORIGINAL_PRICE) * 100
);
const SAVINGS = PRODUCT_ORIGINAL_PRICE - PRODUCT_PRICE;

interface PriceCalloutProps {
  className?: string;
}

/**
 * Static, inline price-offer box ("עכשיו במבצע ₪99 במקום ₪399").
 *
 * Unlike the floating TopPriceBar, this is permanent in-content text — meant to
 * surface the offer early within the page flow. Self-contained and reusable;
 * pulls the price from lib/constants.
 */
export function PriceCallout({ className = "" }: PriceCalloutProps) {
  return (
    <div
      className={`mx-auto w-full max-w-md rounded-2xl border-2 border-primary bg-gradient-to-br from-primary-light to-white p-6 text-center shadow-lg ${className}`}
    >
      {/* Label */}
      <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-sm font-bold text-white shadow-sm">
        🔥 עכשיו במבצע
      </div>

      {/* Price */}
      <div className="flex items-end justify-center gap-3">
        <span className="text-5xl font-extrabold leading-none text-primary">
          {formatPrice(PRODUCT_PRICE)}
        </span>
        <div className="pb-1 text-right leading-tight">
          <span className="block text-sm text-gray-500">במקום</span>
          <span className="block text-lg text-gray-500 line-through">
            {formatPrice(PRODUCT_ORIGINAL_PRICE)}
          </span>
        </div>
      </div>

      {/* Savings */}
      <p className="mt-2 text-sm font-semibold text-accent">
        חיסכון של {formatPrice(SAVINGS)} ({DISCOUNT_PCT}%)
      </p>

      {/* CTA */}
      <Link href="/checkout">
        <Button
          size="lg"
          className="mt-4 w-full text-lg font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          קנה עכשיו
        </Button>
      </Link>
    </div>
  );
}
