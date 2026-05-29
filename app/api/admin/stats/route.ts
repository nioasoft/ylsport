import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats
 * Returns dashboard statistics: total orders, monthly orders, revenue, action items
 */
export async function GET() {
  try {
    // Get start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 10 days ago for stale shipped orders
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Run all queries in parallel for performance
    const [
      totalOrders,
      monthlyOrders,
      totalRevenueResult,
      monthlyRevenueResult,
      pendingProcessing,
      staleShipped,
      abandonedCount,
      failedCount,
    ] = await Promise.all([
      // Total orders count (all active orders)
      prisma.order.count({
        where: {
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
        },
      }),

      // Monthly orders count
      prisma.order.count({
        where: {
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      // Total revenue (sum of all active orders)
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
        },
      }),

      // Monthly revenue
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      // Orders pending processing (PAID status - waiting to be shipped)
      prisma.order.count({
        where: {
          status: {
            in: ["PAID", "PROCESSING"],
          },
        },
      }),

      // Stale shipped orders (SHIPPED for more than 10 days)
      prisma.order.count({
        where: {
          status: "SHIPPED",
          updatedAt: {
            lt: tenDaysAgo,
          },
        },
      }),

      // Abandoned orders (created, never paid, expired by cron)
      prisma.order.count({
        where: {
          status: "ABANDONED",
        },
      }),

      // Failed/cancelled payments (declined at Tranzila or otherwise cancelled)
      prisma.order.count({
        where: {
          OR: [{ status: "CANCELLED" }, { paymentStatus: "FAILED" }],
        },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.total?.toNumber() || 0;
    const monthlyRevenue = monthlyRevenueResult._sum.total?.toNumber() || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        monthlyOrders,
        totalRevenue,
        monthlyRevenue,
        pendingProcessing,
        staleShipped,
        abandonedCount,
        failedCount,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
