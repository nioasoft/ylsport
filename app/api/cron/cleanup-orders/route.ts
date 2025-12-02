import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron Job: Cleanup Unpaid Orders
 *
 * Runs every hour and deletes orders that:
 * - Have status PENDING_PAYMENT
 * - Were created more than 2 hours ago
 *
 * This cleans up abandoned checkout attempts.
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

    // Find orders to delete
    const ordersToDelete = await prisma.order.findMany({
      where: {
        status: "PENDING_PAYMENT",
        createdAt: {
          lt: twoHoursAgo,
        },
      },
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
      },
    });

    if (ordersToDelete.length === 0) {
      console.log("No unpaid orders to clean up");
      return NextResponse.json({
        success: true,
        message: "No orders to clean up",
        deleted: 0,
      });
    }

    // Delete order items first (cascade should handle this, but being explicit)
    await prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: ordersToDelete.map((o) => o.id),
        },
      },
    });

    // Delete the orders
    const result = await prisma.order.deleteMany({
      where: {
        id: {
          in: ordersToDelete.map((o) => o.id),
        },
      },
    });

    console.log(`Cleaned up ${result.count} unpaid orders:`,
      ordersToDelete.map((o) => o.orderNumber).join(", ")
    );

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} unpaid orders`,
      deleted: result.count,
      orders: ordersToDelete.map((o) => o.orderNumber),
    });
  } catch (error) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 }
    );
  }
}
