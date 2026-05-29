import { describe, it, expect } from "vitest";
import { reconcile, normalizePhone, ReconcileOrder } from "./reconcile";
import type { TranzilaTransaction } from "./tranzila";

function txn(p: Partial<TranzilaTransaction> = {}): TranzilaTransaction {
  return {
    index: "1",
    date: "2026-05-29",
    time: "12:00:00",
    amount: 229,
    responseCode: "000",
    approved: true,
    txnType: "debit",
    cardDescription: "Visa",
    customerName: "Test",
    customerEmail: "a@b.com",
    customerPhone: "972501234567",
    ...p,
  };
}

function ord(p: Partial<ReconcileOrder> = {}): ReconcileOrder {
  return {
    orderNumber: "001",
    status: "PAID",
    paymentStatus: "COMPLETED",
    customerEmail: "a@b.com",
    customerPhone: "0501234567",
    total: 229,
    createdAt: new Date("2026-05-29T10:00:00Z"),
    ...p,
  };
}

describe("normalizePhone", () => {
  it("converts 972 prefix to a comparable last-9-digit form", () => {
    expect(normalizePhone("972501234567")).toBe("501234567");
  });

  it("normalizes both Israeli formats to the same value", () => {
    expect(normalizePhone("972501234567")).toBe(normalizePhone("0501234567"));
  });
});

describe("reconcile", () => {
  it("matches an approved charge to a paid order", () => {
    const r = reconcile([txn()], [ord()]);
    expect(r.matched).toHaveLength(1);
    expect(r.paymentFoundNotPaid).toHaveLength(0);
    expect(r.unmatchedCharges).toHaveLength(0);
  });

  it("flags an approved charge against an unpaid order as recoverable", () => {
    const r = reconcile([txn()], [ord({ status: "PENDING_PAYMENT", paymentStatus: "PENDING" })]);
    expect(r.paymentFoundNotPaid).toHaveLength(1);
    expect(r.matched).toHaveLength(0);
  });

  it("treats an approved charge with no matching order as an unmatched (manual) charge", () => {
    const r = reconcile(
      [txn({ customerEmail: "nobody@x.com", customerPhone: "972500000000" })],
      [ord()]
    );
    expect(r.unmatchedCharges).toHaveLength(1);
  });

  it("does not match a returning customer's older order with the same amount", () => {
    const r = reconcile([txn({ date: "2026-05-29" })], [ord({ createdAt: new Date("2026-05-01T10:00:00Z") })]);
    expect(r.unmatchedCharges).toHaveLength(1);
    expect(r.matched).toHaveLength(0);
  });

  it("does not match when amounts differ", () => {
    const r = reconcile([txn({ amount: 199 })], [ord({ total: 229 })]);
    expect(r.unmatchedCharges).toHaveLength(1);
  });

  it("ignores declined transactions entirely", () => {
    const r = reconcile([txn({ approved: false, responseCode: "012" })], [ord()]);
    expect(r.matched).toHaveLength(0);
    expect(r.unmatchedCharges).toHaveLength(0);
  });

  it("matches on phone when the email differs", () => {
    const r = reconcile([txn({ customerEmail: "other@x.com" })], [ord({ customerEmail: "mine@x.com" })]);
    expect(r.matched).toHaveLength(1);
  });
});
