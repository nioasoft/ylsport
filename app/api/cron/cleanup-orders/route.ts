import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron Job: Mark Abandoned Orders
 *
 * Runs every hour and marks orders as ABANDONED when they:
 * - Have status PENDING_PAYMENT
 * - Were created more than 2 hours ago
 *
 * These are checkout attempts where the customer never completed payment and
 * Tranzila never sent a successful callback. We KEEP them (status ABANDONED)
 * instead of deleting, so the admin dashboard retains a record of every
 * abandoned checkout for visibility and Tranzila reconciliation.
 */

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("Unauthorized cron request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // Mark stale unpaid orders as ABANDONED (keep the record instead of deleting).
    // Only PENDING_PAYMENT orders are affected; OrderItems are preserved for the audit trail.
    const staleOrders = await prisma.order.findMany({
      where: {
        status: "PENDING_PAYMENT",
        createdAt: {
          lt: twoHoursAgo,
        },
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    if (staleOrders.length === 0) {
      console.log("No unpaid orders to mark as abandoned");
      return NextResponse.json({
        success: true,
        message: "No orders to mark as abandoned",
        abandoned: 0,
      });
    }

    const result = await prisma.order.updateMany({
      where: {
        id: {
          in: staleOrders.map((o) => o.id),
        },
      },
      data: {
        status: "ABANDONED",
      },
    });

    console.log(
      `Marked ${result.count} unpaid orders as ABANDONED:`,
      staleOrders.map((o) => o.orderNumber).join(", ")
    );

    return NextResponse.json({
      success: true,
      message: `Marked ${result.count} unpaid orders as abandoned`,
      abandoned: result.count,
      orders: staleOrders.map((o) => o.orderNumber),
    });
  } catch (error) {
    console.error("Abandon-orders cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to mark abandoned orders",
      },
      { status: 500 }
    );
  }
}
