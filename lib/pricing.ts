// ============================================================================
// SERVER-SIDE PRICING ENGINE
// ============================================================================
//
// Single source of truth for every price field written to the DB and sent to
// the payment gateway. The order API (`app/api/orders/route.ts`) MUST pass the
// validated client input through `computeOrderPricing` and persist the result.
// Client-supplied prices are NEVER trusted (Iron Law #4 — BOLA).
//
// The client is allowed to send only: item sizes + quantities, shipping method,
// and an optional discount code. All monetary fields are derived here.

import { PRODUCT_PRICE, PRODUCT_NAME } from "./constants";
import {
  calculateShippingCost,
  calculateDiscountAmount,
  calculateOrderTotal,
} from "./utils";

/** Discount definition used for server-side price computation. */
export interface DiscountForPricing {
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
}

/** Item as the client is allowed to send — sizes and quantities only. */
export interface PricingItemInput {
  productSize: string;
  quantity: number;
}

/** Item with server-computed prices, ready to persist. */
export interface PricedItem {
  productName: string;
  productSize: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface PricingInput {
  items: PricingItemInput[];
  shippingMethod: "STANDARD_DELIVERY" | "SELF_PICKUP";
  discountCode?: DiscountForPricing | null;
}

export interface PricingResult {
  items: PricedItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
}

/**
 * Compute the full price breakdown for an order from trusted inputs only.
 *
 * Pure function — same inputs always yield the same outputs. No DB or network
 * access. The caller is responsible for validating the discount code exists,
 * is active, and is within its validity window before passing it here.
 */
export function computeOrderPricing(input: PricingInput): PricingResult {
  const items: PricedItem[] = input.items.map((i) => ({
    productName: PRODUCT_NAME,
    productSize: i.productSize,
    quantity: i.quantity,
    pricePerUnit: PRODUCT_PRICE,
    totalPrice: PRODUCT_PRICE * i.quantity,
  }));

  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const shippingCost = calculateShippingCost(input.shippingMethod);
  const discountAmount = input.discountCode
    ? calculateDiscountAmount(subtotal, input.discountCode.type, input.discountCode.value)
    : 0;
  const total = calculateOrderTotal(subtotal, shippingCost, discountAmount);

  return { items, subtotal, shippingCost, discountAmount, total };
}
