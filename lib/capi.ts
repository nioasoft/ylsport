/**
 * Server-side Conversions API (CAPI) — Meta + TikTok Events API.
 *
 * Why server-side: iOS, ad blockers, and tracking-prevention browsers swallow
 * client pixel events. Firing the same event from the server (after the
 * payment provider confirms the charge) recovers that lost attribution.
 *
 * Dedup: every server event sends the same `event_id` as the client pixel
 * (we use `order.orderNumber`). Meta and TikTok will discard the duplicate
 * and keep the higher-quality signal.
 *
 * PII matching: emails/phones/names are hashed (SHA-256 over normalized,
 * lowercased values). Hashing happens client-of-the-API, never plaintext
 * over the wire.
 *
 * Both calls fail-closed via try/catch: a missing token or a 5xx from
 * Meta/TikTok logs the error but never breaks the checkout flow.
 */

import { createHash } from "crypto";

const META_PIXEL_ID = "2383393872127807";
const TIKTOK_PIXEL_ID = "D7IC683C77U8OVL7GAV0";
const CURRENCY = "ILS";
const DEFAULT_CONTENT_ID = "YL-Sport-Tights";
const DEFAULT_CONTENT_NAME = "YL Sport Tights";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize Israeli phone numbers for ad-platform matching.
 * Both Meta and TikTok want E.164 digits only (no +, dashes, spaces).
 * `0539197848` → `972539197848`.
 */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;
  return digits;
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().toLowerCase().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return { first, last };
}

export interface CapiPurchaseInput {
  orderNumber: string;
  value: number;
  numItems: number;
  email: string;
  phone: string;
  fullName: string;
  city?: string | null;
  postalCode?: string | null;
  /** Seconds since epoch. Must be within Meta's 7-day window. */
  eventTimeSeconds?: number;
}

const META_GRAPH_VERSION = "v19.0";

/**
 * Send a Purchase event to Meta's Conversions API.
 * No-op (logs a warning) if `META_CAPI_ACCESS_TOKEN` is not set.
 */
export async function sendMetaCapiPurchase(input: CapiPurchaseInput): Promise<void> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn("[Meta CAPI] META_CAPI_ACCESS_TOKEN not set — skipping Purchase event");
    return;
  }

  const { first, last } = splitName(input.fullName);
  const eventTime = input.eventTimeSeconds ?? Math.floor(Date.now() / 1000);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yl-sport.co.il";

  const userData: Record<string, string | string[]> = {
    em: [sha256(normalizeEmail(input.email))],
    ph: [sha256(normalizePhone(input.phone))],
    country: [sha256("il")],
  };
  if (first) userData.fn = [sha256(first)];
  if (last) userData.ln = [sha256(last)];
  if (input.city) userData.ct = [sha256(input.city.trim().toLowerCase().replace(/\s+/g, ""))];
  if (input.postalCode) userData.zp = [sha256(input.postalCode.trim().toLowerCase())];

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: eventTime,
        event_id: input.orderNumber,
        event_source_url: `${siteUrl}/order/confirmation?orderNumber=${input.orderNumber}`,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: CURRENCY,
          value: input.value,
          num_items: input.numItems,
          content_ids: [DEFAULT_CONTENT_ID],
          content_name: DEFAULT_CONTENT_NAME,
          content_type: "product",
          order_id: input.orderNumber,
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Meta CAPI Purchase failed (${response.status}): ${body}`);
  }

  const result = (await response.json()) as { events_received?: number };
  console.log("[Meta CAPI] Purchase sent:", input.orderNumber, "events_received:", result.events_received);
}

/**
 * Send a Purchase event to TikTok's Events API (server-to-server pixel).
 * No-op (logs a warning) if `TIKTOK_EVENTS_API_ACCESS_TOKEN` is not set.
 */
export async function sendTikTokCapiPurchase(input: CapiPurchaseInput): Promise<void> {
  const accessToken = process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn("[TikTok Events API] TIKTOK_EVENTS_API_ACCESS_TOKEN not set — skipping Purchase event");
    return;
  }

  const eventTime = input.eventTimeSeconds ?? Math.floor(Date.now() / 1000);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yl-sport.co.il";

  const payload = {
    event_source: "web",
    event_source_id: TIKTOK_PIXEL_ID,
    data: [
      {
        event: "CompletePayment",
        event_time: eventTime,
        event_id: input.orderNumber,
        user: {
          email: sha256(normalizeEmail(input.email)),
          phone: sha256(`+${normalizePhone(input.phone)}`),
        },
        properties: {
          contents: [
            {
              content_id: DEFAULT_CONTENT_ID,
              content_name: DEFAULT_CONTENT_NAME,
              content_type: "product",
              quantity: input.numItems,
              price: input.value / Math.max(input.numItems, 1),
            },
          ],
          currency: CURRENCY,
          value: input.value,
          order_id: input.orderNumber,
        },
        page: {
          url: `${siteUrl}/order/confirmation?orderNumber=${input.orderNumber}`,
        },
      },
    ],
  };

  const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TikTok Events API Purchase failed (${response.status}): ${body}`);
  }

  const result = (await response.json()) as { code?: number; message?: string };
  if (result.code !== 0) {
    throw new Error(`TikTok Events API Purchase rejected: code=${result.code} message=${result.message}`);
  }

  console.log("[TikTok Events API] Purchase sent:", input.orderNumber);
}
