/**
 * Meta (Facebook) Pixel helpers.
 *
 * The base pixel loader and PageView fire in `app/layout.tsx`. These helpers
 * fire e-commerce funnel events from client components. All calls are no-ops
 * during SSR / before `fbq` is on the page.
 *
 * Currency is fixed to ILS — single-market store.
 */

const CURRENCY = "ILS";
const DEFAULT_CONTENT_ID = "YL-Sport-Tights";
const DEFAULT_CONTENT_NAME = "YL Sport Tights";

interface MetaPixelWindow {
  fbq?: (...args: unknown[]) => void;
}

function fbq(): MetaPixelWindow["fbq"] | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as MetaPixelWindow).fbq;
}

export interface AddToCartParams {
  value: number;
  contentName?: string;
  contentIds?: string[];
}

export function trackAddToCart({
  value,
  contentName = DEFAULT_CONTENT_NAME,
  contentIds = [DEFAULT_CONTENT_ID],
}: AddToCartParams): void {
  const track = fbq();
  if (!track) return;

  track("track", "AddToCart", {
    value,
    currency: CURRENCY,
    content_name: contentName,
    content_ids: contentIds,
    content_type: "product",
  });
}

export interface InitiateCheckoutParams {
  value: number;
  numItems: number;
  contentIds?: string[];
}

export function trackInitiateCheckout({
  value,
  numItems,
  contentIds = [DEFAULT_CONTENT_ID],
}: InitiateCheckoutParams): void {
  const track = fbq();
  if (!track) return;

  track("track", "InitiateCheckout", {
    value,
    currency: CURRENCY,
    num_items: numItems,
    content_ids: contentIds,
    content_type: "product",
  });
}

export interface PurchaseParams {
  value: number;
  orderNumber: string;
  numItems: number;
  contentIds?: string[];
}

/**
 * Fires Purchase exactly once per orderNumber per browser session.
 *
 * Why: the confirmation page can be refreshed or revisited; without a guard,
 * one real order would inflate Purchase counts and corrupt ad attribution.
 * `eventID` is sent so a future Conversions API integration can dedup against
 * this client-side event.
 */
export function trackPurchase({
  value,
  orderNumber,
  numItems,
  contentIds = [DEFAULT_CONTENT_ID],
}: PurchaseParams): void {
  const track = fbq();
  if (!track) return;

  const storageKey = `meta_purchase_fired_${orderNumber}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // sessionStorage can throw in private browsing / disabled storage —
    // fall through and still fire. Worst case: duplicate event on refresh.
  }

  track(
    "track",
    "Purchase",
    {
      value,
      currency: CURRENCY,
      num_items: numItems,
      content_ids: contentIds,
      content_type: "product",
    },
    { eventID: orderNumber },
  );
}
