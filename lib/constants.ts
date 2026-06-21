// ============================================================================
// PRODUCT CONSTANTS
// ============================================================================
//
// Single source of truth for the product price and metadata shown across the
// marketing surfaces (Hero, sticky price bars). Display components import from
// here so the price is defined once.
//
// NOTE: The checkout flow (`app/checkout/page.tsx`, `components/checkout/
// OrderForm.tsx`) currently keeps its own `PRODUCT_PRICE` constant. Those live
// on the payment path and are intentionally left untouched for now — they
// should be converged onto these constants in a future, separately-tested pass.

/** Current sale price in ILS. */
export const PRODUCT_PRICE = 199;

/** Original (pre-discount) price in ILS, shown struck-through. */
export const PRODUCT_ORIGINAL_PRICE = 399;

/** Product display name. */
export const PRODUCT_NAME = "טייץ ספורט איכותי";

/** Hero/thumbnail product image path. */
export const PRODUCT_IMAGE = "/images/product1.webp";

// ============================================================================
// SHIPPING & EXCHANGE FEES
// ============================================================================
//
// Server-controlled monetary constants. The client cannot influence these —
// they are used by `lib/pricing.ts` (shipping) and the exchange payment flow.
// Never sent FROM the client; only computed against server-side.

/**
 * Exchange handling fee in ILS. Charged when a customer requests a size
 * exchange. Hardcoded server-side; verified in the Tranzila callback.
 */
export const EXCHANGE_FEE = 29.0;
