import { TranzilaTransaction } from "./tranzila";

/**
 * Reconciliation matches successful Tranzila transactions against DB orders.
 *
 * The Reports API does not return our pr_id, so matching is heuristic:
 * customer (email OR phone) + equal amount + transaction date within ±1 day of
 * the order's creation date. The ±1 day window prevents matching a new charge
 * to a returning customer's older order with the same amount.
 */

/** Minimal order shape needed for reconciliation (decimals already converted to number). */
export interface ReconcileOrder {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  createdAt: Date;
}

export interface MatchedPair {
  transaction: TranzilaTransaction;
  orderNumber: string;
  orderStatus: string;
}

export interface ReconcileResult {
  /** Approved Tranzila charge linked to a paid DB order — all good. */
  matched: MatchedPair[];
  /** Approved Tranzila charge linked to an UNPAID DB order — callback was missed, order is recoverable. */
  paymentFoundNotPaid: MatchedPair[];
  /** Approved Tranzila charge with no matching DB order — manual/FORCE charge, money with no order record. */
  unmatchedCharges: TranzilaTransaction[];
}

/** Statuses that mean the order is considered paid. */
const PAID_STATUSES = new Set(["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "REFUNDED"]);

const DAY_MS = 24 * 60 * 60 * 1000;

/** Normalize an Israeli phone to a comparable form: digits only, 972 → leading 0, last 9 digits. */
export function normalizePhone(phone: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("972")) {
    digits = "0" + digits.slice(3);
  }
  return digits.slice(-9);
}

function emailKey(email: string): string {
  return (email || "").trim().toLowerCase();
}

function amountsEqual(a: number, b: number): boolean {
  return Math.round(a * 100) === Math.round(b * 100);
}

/** True when the transaction date is within ±1 day of the order creation date. */
function withinDateWindow(txnDate: string, orderCreatedAt: Date): boolean {
  const t = new Date(`${txnDate}T00:00:00Z`).getTime();
  if (Number.isNaN(t)) return false;
  const o = orderCreatedAt.getTime();
  return Math.abs(t - o) <= DAY_MS + DAY_MS; // ±1 calendar day, generous to absorb timezone offset
}

/**
 * Reconcile approved Tranzila transactions against DB orders.
 * Only approved (responseCode "000") transactions are considered — declines/abandonments
 * leave no Tranzila record and are handled via the ABANDONED order status instead.
 */
export function reconcile(
  transactions: TranzilaTransaction[],
  orders: ReconcileOrder[]
): ReconcileResult {
  const result: ReconcileResult = {
    matched: [],
    paymentFoundNotPaid: [],
    unmatchedCharges: [],
  };

  for (const txn of transactions) {
    if (!txn.approved) continue;

    const txnEmail = emailKey(txn.customerEmail);
    const txnPhone = normalizePhone(txn.customerPhone);

    const match = orders.find((order) => {
      const sameCustomer =
        (txnEmail && emailKey(order.customerEmail) === txnEmail) ||
        (txnPhone && normalizePhone(order.customerPhone) === txnPhone);
      if (!sameCustomer) return false;
      if (!amountsEqual(order.total, txn.amount)) return false;
      return withinDateWindow(txn.date, order.createdAt);
    });

    if (!match) {
      result.unmatchedCharges.push(txn);
      continue;
    }

    const pair: MatchedPair = {
      transaction: txn,
      orderNumber: match.orderNumber,
      orderStatus: match.status,
    };

    if (PAID_STATUSES.has(match.status) || match.paymentStatus === "COMPLETED") {
      result.matched.push(pair);
    } else {
      result.paymentFoundNotPaid.push(pair);
    }
  }

  return result;
}
