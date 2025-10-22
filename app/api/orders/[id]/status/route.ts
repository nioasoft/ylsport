/**
 * PATCH /api/orders/[id]/status
 *
 * Update order status (admin only)
 * - Validates status transitions
 * - Auto-triggers shipping notification if status = SHIPPED and tracking exists
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { sendShippingNotification } from "@/services/notification.service";

// Valid order status values
const VALID_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    await requireAdminAuth();

    const body = await request.json();
    const { status } = body;

    // Validate status value
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "סטטוס לא תקין" },
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

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: status as OrderStatus,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Auto-send shipping notification if status is SHIPPED and tracking exists
    if (status === "SHIPPED" && updatedOrder.trackingNumber) {
      try {
        await sendShippingNotification(updatedOrder);
      } catch (notificationError) {
        console.error("Failed to send shipping notification:", notificationError);
        // Don't fail the status update if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        updatedAt: updatedOrder.updatedAt,
      },
    });
  } catch (error) {
    console.error("Status update error:", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "שגיאה בעדכון סטטוס ההזמנה" },
      { status: 500 }
    );
  }
}
