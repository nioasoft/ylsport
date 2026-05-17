/**
 * Client-side pixel helpers — Meta (Facebook) + TikTok.
 *
 * The base loaders and PageView fire in `app/layout.tsx`. These wrappers fire
 * e-commerce funnel events from client components. All calls are no-ops during
 * SSR / before the pixel globals are on the page.
 *
 * Currency is fixed to ILS — single-market store.
 */

const CURRENCY = "ILS";
const DEFAULT_CONTENT_ID = "YL-Sport-Tights";
const DEFAULT_CONTENT_NAME = "YL Sport Tights";

interface MetaPixelWindow {
  fbq?: (...args: unknown[]) => void;
}

interface TikTokPixelWindow {
  ttq?: { track?: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void };
}

function fbq(): MetaPixelWindow["fbq"] | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as MetaPixelWindow).fbq;
}

function ttq(): TikTokPixelWindow["ttq"] | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as TikTokPixelWindow).ttq;
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
  const metaTrack = fbq();
  if (metaTrack) {
    metaTrack("track", "AddToCart", {
      value,
      currency: CURRENCY,
      content_name: contentName,
      content_ids: contentIds,
      content_type: "product",
    });
  }

  const tiktokTrack = ttq()?.track;
  if (tiktokTrack) {
    tiktokTrack("AddToCart", {
      value,
      currency: CURRENCY,
      content_id: contentIds[0],
      content_name: contentName,
      content_type: "product",
      quantity: 1,
    });
  }
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
  const metaTrack = fbq();
  if (metaTrack) {
    metaTrack("track", "InitiateCheckout", {
      value,
      currency: CURRENCY,
      num_items: numItems,
      content_ids: contentIds,
      content_type: "product",
    });
  }

  const tiktokTrack = ttq()?.track;
  if (tiktokTrack) {
    tiktokTrack("InitiateCheckout", {
      value,
      currency: CURRENCY,
      content_id: contentIds[0],
      content_type: "product",
      quantity: numItems,
    });
  }
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
 * The sessionStorage guard prevents inflated counts if the user refreshes
 * the confirmation page. `eventID` / `event_id` is sent to both pixels so the
 * matching server-side Conversions API event (fired from the Tranzila webhook)
 * can dedup against this client event — Meta and TikTok both expect the same
 * value on both ends to match a pair.
 */
export function trackPurchase({
  value,
  orderNumber,
  numItems,
  contentIds = [DEFAULT_CONTENT_ID],
}: PurchaseParams): void {
  const storageKey = `purchase_fired_${orderNumber}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // sessionStorage can throw in private browsing / disabled storage —
    // fall through and still fire. Worst case: duplicate event on refresh.
  }

  const metaTrack = fbq();
  if (metaTrack) {
    metaTrack(
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

  const tiktokTrack = ttq()?.track;
  if (tiktokTrack) {
    // TikTok renamed Purchase from "CompletePayment" → "Purchase" in the new
    // Events Manager taxonomy, but legacy CompletePayment is still accepted.
    // Fire both so the event shows up under whichever label the advertiser's
    // Events Manager UI is on. Both share the same event_id, so TikTok dedups
    // them against each other and against the server-side CAPI event.
    const tiktokParams = {
      value,
      currency: CURRENCY,
      contents: [
        {
          content_id: contentIds[0],
          content_name: DEFAULT_CONTENT_NAME,
          content_type: "product",
          quantity: numItems,
          price: value / Math.max(numItems, 1),
        },
      ],
    };
    tiktokTrack("Purchase", tiktokParams, { event_id: orderNumber });
    tiktokTrack("CompletePayment", tiktokParams, { event_id: orderNumber });
  }
}
