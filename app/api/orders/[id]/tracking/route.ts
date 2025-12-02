/**
 * PATCH /api/orders/[id]/tracking
 *
 * Update order tracking number (admin only)
 * - Auto-triggers shipping notification (email + SMS) when tracking is added
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { sendShippingNotification } from "@/services/notification.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    await requireAdminAuth();

    const body = await request.json();
    const { trackingNumber } = body;

    // Validate tracking number
    if (!trackingNumber || typeof trackingNumber !== "string") {
      return NextResponse.json(
        { error: "מספר מעקב לא תקין" },
        { status: 400 }
      );
    }

    const trimmedTrackingNumber = trackingNumber.trim();

    // Check for duplicate tracking number (except for current order)
    const existingOrderWithTracking = await prisma.order.findFirst({
      where: {
        trackingNumber: trimmedTrackingNumber,
        id: { not: params.id },
      },
    });

    if (existingOrderWithTracking) {
      return NextResponse.json(
        { error: `מספר מעקב זה כבר קיים בהזמנה ${existingOrderWithTracking.orderNumber}` },
        { status: 400 }
      );
    }

    // Get current order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "הזמנה לא נמצאה" },
        { status: 404 }
      );
    }

    // Update order with tracking number AND set status to SHIPPED
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        trackingNumber: trimmedTrackingNumber,
        status: "SHIPPED",
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Send notifications in the background (fire-and-forget for faster response)
    sendShippingNotification(updatedOrder)
      .then((result) => {
        if (result.success) {
          console.log(`✅ Notifications sent for order ${updatedOrder.orderNumber}`);
        } else {
          console.error(`⚠️ Notification issues for order ${updatedOrder.orderNumber}:`, result.errors);
        }
      })
      .catch((error) => {
        console.error("Failed to send shipping notification:", error);
      });

    // Return immediately without waiting for notifications
    return NextResponse.json({
      success: true,
      message: "מספר המעקב נשמר והתראות נשלחות ללקוח",
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        trackingNumber: updatedOrder.trackingNumber,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      },
    });
  } catch (error) {
    console.error("Tracking update error:", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "שגיאה בעדכון מספר המעקב" },
      { status: 500 }
    );
  }
}
