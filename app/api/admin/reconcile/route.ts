import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getTranzilaSDK } from "@/lib/tranzila";
import { reconcile, ReconcileOrder } from "@/lib/reconcile";

/**
 * GET /api/admin/reconcile?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
 *
 * Admin-triggered, READ-ONLY reconciliation between Tranzila's transaction
 * report and our orders. Does not modify any data — it only surfaces:
 *  - matched:             approved charge ↔ paid order (healthy)
 *  - paymentFoundNotPaid: approved charge ↔ unpaid order (missed callback, recoverable)
 *  - unmatchedCharges:    approved charge with no order (manual / FORCE charge)
 *
 * Defaults to the last 7 days when no range is provided.
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Resolve range: default last 7 days. Format YYYY-MM-DD for Tranzila.
    const end = dateTo ? new Date(`${dateTo}T23:59:59`) : new Date();
    const start = dateFrom
      ? new Date(`${dateFrom}T00:00:00`)
      : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, error: "טווח תאריכים לא תקין" },
        { status: 400 }
      );
    }

    const toDateStr = (d: Date) => d.toISOString().slice(0, 10);

    // Pull Tranzila transactions for the range.
    const tranzila = getTranzilaSDK();
    const txnResult = await tranzila.getTransactions(toDateStr(start), toDateStr(end));

    if (!txnResult.success) {
      return NextResponse.json(
        { success: false, error: "שליפת הנתונים מ-Tranzila נכשלה, נסה שוב" },
        { status: 502 }
      );
    }

    // Pull DB orders for the same range (widen by 1 day on each side to catch edge matches).
    const orderRangeStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    const orderRangeEnd = new Date(end.getTime() + 24 * 60 * 60 * 1000);

    const dbOrders = await prisma.order.findMany({
      where: { createdAt: { gte: orderRangeStart, lte: orderRangeEnd } },
      select: {
        orderNumber: true,
        status: true,
        paymentStatus: true,
        customerEmail: true,
        customerPhone: true,
        total: true,
        createdAt: true,
      },
    });

    const orders: ReconcileOrder[] = dbOrders.map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      paymentStatus: o.paymentStatus,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      total: o.total.toNumber(),
      createdAt: o.createdAt,
    }));

    const result = reconcile(txnResult.transactions, orders);

    return NextResponse.json({
      success: true,
      range: { from: toDateStr(start), to: toDateStr(end) },
      counts: {
        transactions: txnResult.transactions.length,
        matched: result.matched.length,
        paymentFoundNotPaid: result.paymentFoundNotPaid.length,
        unmatchedCharges: result.unmatchedCharges.length,
      },
      result,
    });
  } catch (error) {
    console.error("Reconcile API error:", error);
    return NextResponse.json(
      { success: false, error: "אירעה שגיאה בהצלבה מול Tranzila" },
      { status: 500 }
    );
  }
}
