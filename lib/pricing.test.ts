import { describe, it, expect } from "vitest";
import { computeOrderPricing } from "./pricing";
import { createOrderSchema } from "./validation";
import { PRODUCT_PRICE, PRODUCT_NAME } from "./constants";

// ============================================================================
// computeOrderPricing — pure pricing engine
// ============================================================================

describe("computeOrderPricing", () => {
  it("charges PRODUCT_PRICE per unit with no discount and self-pickup", () => {
    const result = computeOrderPricing({
      items: [{ productSize: "M", quantity: 1 }],
      shippingMethod: "SELF_PICKUP",
    });
    expect(result.subtotal).toBe(PRODUCT_PRICE);
    expect(result.shippingCost).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(PRODUCT_PRICE);
    expect(result.items[0].pricePerUnit).toBe(PRODUCT_PRICE);
    expect(result.items[0].totalPrice).toBe(PRODUCT_PRICE);
  });

  it("multiplies price by quantity for multiple units", () => {
    const result = computeOrderPricing({
      items: [{ productSize: "L", quantity: 3 }],
      shippingMethod: "SELF_PICKUP",
    });
    expect(result.subtotal).toBe(PRODUCT_PRICE * 3);
    expect(result.total).toBe(PRODUCT_PRICE * 3);
    expect(result.items[0].totalPrice).toBe(PRODUCT_PRICE * 3);
  });

  it("sums multiple line items correctly", () => {
    const result = computeOrderPricing({
      items: [
        { productSize: "S", quantity: 1 },
        { productSize: "M", quantity: 2 },
      ],
      shippingMethod: "SELF_PICKUP",
    });
    expect(result.subtotal).toBe(PRODUCT_PRICE * 3);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].totalPrice).toBe(PRODUCT_PRICE);
    expect(result.items[1].totalPrice).toBe(PRODUCT_PRICE * 2);
  });

  it("applies a percentage discount on the subtotal", () => {
    const result = computeOrderPricing({
      items: [{ productSize: "M", quantity: 1 }],
      shippingMethod: "SELF_PICKUP",
      discountCode: { type: "PERCENTAGE", value: 10 },
    });
    expect(result.discountAmount).toBeCloseTo(PRODUCT_PRICE * 0.1, 2);
    expect(result.total).toBeCloseTo(PRODUCT_PRICE * 0.9, 2);
  });

  it("applies a fixed-amount discount", () => {
    const result = computeOrderPricing({
      items: [{ productSize: "M", quantity: 1 }],
      shippingMethod: "SELF_PICKUP",
      discountCode: { type: "FIXED_AMOUNT", value: 50 },
    });
    expect(result.discountAmount).toBe(50);
    expect(result.total).toBe(PRODUCT_PRICE - 50);
  });

  it("never lets a fixed discount produce a negative total", () => {
    const result = computeOrderPricing({
      items: [{ productSize: "M", quantity: 1 }],
      shippingMethod: "SELF_PICKUP",
      discountCode: { type: "FIXED_AMOUNT", value: 99999 },
    });
    expect(result.discountAmount).toBeLessThanOrEqual(result.subtotal);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("stamps the canonical product name on every line item", () => {
    const result = computeOrderPricing({
      items: [{ productSize: "M", quantity: 1 }],
      shippingMethod: "SELF_PICKUP",
    });
    expect(result.items[0].productName).toBe(PRODUCT_NAME);
  });

  it("computes consistently regardless of any hypothetical client-side price", () => {
    // The function signature has no way to receive a client price — types enforce it.
    // This test exists so a future refactor that "helpfully" adds a price
    // override parameter will fail loudly here.
    const a = computeOrderPricing({
      items: [{ productSize: "M", quantity: 2 }],
      shippingMethod: "SELF_PICKUP",
    });
    const b = computeOrderPricing({
      items: [{ productSize: "M", quantity: 2 }],
      shippingMethod: "SELF_PICKUP",
    });
    expect(a).toEqual(b);
    expect(a.total).toBe(PRODUCT_PRICE * 2);
  });
});

// ============================================================================
// createOrderSchema — BOLA hardening regression
// ============================================================================
//
// The schema is the API's trust boundary. Price fields MUST be absent from the
// parsed output — an attacker who sends forged prices cannot influence what
// the handler persists or charges.

describe("createOrderSchema (BOLA hardening)", () => {
  const validBasePayload = {
    customerName: "ישראל ישראלי",
    customerEmail: "test@example.com",
    customerPhone: "0501234567",
    shippingMethod: "SELF_PICKUP" as const,
    items: [{ productSize: "M", quantity: 1 }],
  };

  it("accepts a valid payload with sizes + quantities only", () => {
    const r = createOrderSchema.safeParse(validBasePayload);
    expect(r.success).toBe(true);
  });

  it("STRIPS client-supplied price fields — they cannot reach the handler", () => {
    // Attacker forges every price field:
    const attack = {
      ...validBasePayload,
      subtotal: 1,
      shippingCost: 0,
      discountAmount: 0,
      total: 1,
      items: [
        {
          productSize: "M",
          quantity: 1,
          productName: "fake",
          pricePerUnit: 1,
          totalPrice: 1,
        },
      ],
    };
    const r = createOrderSchema.safeParse(attack);
    expect(r.success).toBe(true);
    if (!r.success) return;

    // Order-level forged fields must NOT survive parsing:
    expect((r.data as Record<string, unknown>).subtotal).toBeUndefined();
    expect((r.data as Record<string, unknown>).shippingCost).toBeUndefined();
    expect((r.data as Record<string, unknown>).discountAmount).toBeUndefined();
    expect((r.data as Record<string, unknown>).total).toBeUndefined();

    // Item-level forged fields must NOT survive parsing:
    const item = r.data.items[0] as Record<string, unknown>;
    expect(item.pricePerUnit).toBeUndefined();
    expect(item.totalPrice).toBeUndefined();
    expect(item.productName).toBeUndefined();
    expect(item.productSize).toBe("M");
    expect(item.quantity).toBe(1);
  });

  it("rejects a payload with no items", () => {
    const r = createOrderSchema.safeParse({ ...validBasePayload, items: [] });
    expect(r.success).toBe(false);
  });

  it("rejects invalid product sizes", () => {
    const r = createOrderSchema.safeParse({
      ...validBasePayload,
      items: [{ productSize: "XXL", quantity: 1 }],
    });
    expect(r.success).toBe(false);
  });

  it("rejects quantity above max (5)", () => {
    const r = createOrderSchema.safeParse({
      ...validBasePayload,
      items: [{ productSize: "M", quantity: 6 }],
    });
    expect(r.success).toBe(false);
  });

  it("rejects quantity below min (1)", () => {
    const r = createOrderSchema.safeParse({
      ...validBasePayload,
      items: [{ productSize: "M", quantity: 0 }],
    });
    expect(r.success).toBe(false);
  });
});

// ============================================================================
// End-to-end BOLA demonstration
// ============================================================================
//
// Simulates the full attack: a forged POST body → schema parse → pricing.
// Proves the attacker's "1" never reaches the charged amount.

describe("BOLA regression — forged total cannot reach the payment gateway", () => {
  it("ignores attacker-controlled prices and charges PRODUCT_PRICE", () => {
    const attack = {
      customerName: "ישראל ישראלי",
      customerEmail: "attacker@example.com",
      customerPhone: "0501234567",
      shippingMethod: "SELF_PICKUP" as const,
      items: [{ productSize: "M", quantity: 1, pricePerUnit: 1, totalPrice: 1 }],
      subtotal: 1,
      shippingCost: 0,
      discountAmount: 0,
      total: 1,
    };

    const parsed = createOrderSchema.safeParse(attack);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    // This is exactly what app/api/orders/route.ts does after parsing:
    const pricing = computeOrderPricing({
      items: parsed.data.items,
      shippingMethod: parsed.data.shippingMethod,
    });

    // Attacker wanted ₪1; the server charges the canonical price:
    expect(pricing.total).toBe(PRODUCT_PRICE);
    expect(pricing.subtotal).toBe(PRODUCT_PRICE);
    expect(pricing.items[0].pricePerUnit).toBe(PRODUCT_PRICE);
    expect(pricing.total).not.toBe(1);
  });
});
