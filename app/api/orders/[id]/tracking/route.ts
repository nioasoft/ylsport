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

    // Update order with tracking number
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        trackingNumber: trackingNumber.trim(),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Auto-send shipping notification (email + SMS)
    try {
      await sendShippingNotification(updatedOrder);
    } catch (notificationError) {
      console.error("Failed to send shipping notification:", notificationError);
      // Don't fail the tracking update if notification fails
      // Return success but with warning
      return NextResponse.json({
        success: true,
        warning: "מספר המעקב נשמר אך שליחת ההתראות נכשלה",
        order: {
          id: updatedOrder.id,
          orderNumber: updatedOrder.orderNumber,
          trackingNumber: updatedOrder.trackingNumber,
          updatedAt: updatedOrder.updatedAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "מספר המעקב נשמר והתראות נשלחו ללקוח",
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
