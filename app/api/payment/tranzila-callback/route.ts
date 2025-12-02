import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTranzilaSDK } from "@/lib/tranzila";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/resend";
import { sendOrderConfirmationSMS } from "@/lib/sms-templates";
import { tranzilaCallbackSchema } from "@/lib/validation";

/**
 * Tranzila Payment Callback Handler
 *
 * This endpoint receives callbacks from Tranzila after payment processing.
 * Flow:
 * 1. Validate callback data
 * 2. Find order in database
 * 3. Verify payment (response code, amount)
 * 4. Update order status
 * 5. Send notifications (email + SMS)
 * 6. Return success to Tranzila
 */

export async function POST(request: NextRequest) {
  console.log("Tranzila callback received (POST)");

  try {
    // Parse request body
    const body = await request.json();
    console.log("Tranzila callback data:", JSON.stringify(body, null, 2));

    return await processCallback(body);
  } catch (error) {
    console.error("Tranzila callback error (POST):", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Payment processing failed",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (Tranzila may send GET callbacks)
export async function GET(request: NextRequest) {
  console.log("Tranzila callback received (GET)");

  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract callback parameters from query string
    const callbackData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });

    console.log("Tranzila callback data (GET):", JSON.stringify(callbackData, null, 2));

    return await processCallback(callbackData);
  } catch (error) {
    console.error("Tranzila callback error (GET):", error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment processing failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Process callback data from Tranzila
 */
async function processCallback(data: Record<string, unknown>) {
  // Validate callback data
  const validationResult = tranzilaCallbackSchema.safeParse(data);

  if (!validationResult.success) {
    console.error("Invalid Tranzila callback data:", validationResult.error);
    return NextResponse.json(
      { success: false, message: "Invalid callback data" },
      { status: 400 }
    );
  }

  const callbackData = validationResult.data;

  // Get order from database using order_id (our order number)
  const order = await prisma.order.findUnique({
    where: { orderNumber: callbackData.order_id },
    include: {
      items: true,
      discountCode: true,
    },
  });

  if (!order) {
    console.error("Order not found:", callbackData.order_id);
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }

  // Check if order is already paid (prevent duplicate processing)
  if (order.paymentStatus === "COMPLETED") {
    console.log("Order already paid, skipping:", order.orderNumber);
    return NextResponse.json({
      success: true,
      message: "Order already processed",
      orderNumber: order.orderNumber,
    });
  }

  // Verify payment with Tranzila SDK
  const tranzila = getTranzilaSDK();
  const verification = tranzila.verifyCallback(callbackData, order.total.toNumber());

  if (!verification.success) {
    console.error("Payment verification failed:", verification.message);

    // Update order status to failed
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        paymentStatus: "FAILED",
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: verification.message,
      },
      { status: 400 }
    );
  }

  // Update order status to PAID
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paymentStatus: "COMPLETED",
    },
    include: {
      items: true,
    },
  });

  console.log("Order updated to PAID:", updatedOrder.orderNumber);

  // Update discount code usage count if applicable
  if (order.discountCodeId) {
    await prisma.discountCode.update({
      where: { id: order.discountCodeId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  // Send notifications in parallel (don't fail if notifications fail)
  await Promise.allSettled([
    // Send order confirmation email to customer
    sendOrderConfirmationEmail({
      to: updatedOrder.customerEmail,
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      items: updatedOrder.items.map((item) => ({
        productName: item.productName,
        size: item.productSize,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit.toNumber(),
        totalPrice: item.totalPrice.toNumber(),
      })),
      subtotal: updatedOrder.subtotal.toNumber(),
      shippingCost: updatedOrder.shippingCost.toNumber(),
      discountAmount: updatedOrder.discountAmount.toNumber(),
      total: updatedOrder.total.toNumber(),
      shippingMethod: updatedOrder.shippingMethod,
      shippingAddress: updatedOrder.shippingAddress || "",
      shippingCity: updatedOrder.shippingCity || "",
      shippingPostalCode: updatedOrder.shippingPostalCode || "",
    }).then(() => {
      console.log("Order confirmation email sent to:", updatedOrder.customerEmail);
    }).catch((err) => {
      console.error("Failed to send confirmation email:", err);
    }),

    // Send admin notification email
    (async () => {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendAdminOrderNotificationEmail({
          to: adminEmail,
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          customerEmail: updatedOrder.customerEmail,
          customerPhone: updatedOrder.customerPhone,
          total: updatedOrder.total.toNumber(),
        });
        console.log("Admin notification email sent to:", adminEmail);
      }
    })().catch((err) => {
      console.error("Failed to send admin notification:", err);
    }),

    // Send SMS confirmation to customer
    (async () => {
      const smsResult = sendOrderConfirmationSMS({
        phone: updatedOrder.customerPhone,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        total: updatedOrder.total.toNumber(),
      });

      if (smsResult.success) {
        console.log("Order confirmation SMS sent to:", updatedOrder.customerPhone);
      } else {
        console.error("Failed to send SMS:", smsResult.error);
      }
    })(),
  ]);

  return NextResponse.json({
    success: true,
    message: "Payment processed successfully",
    orderNumber: updatedOrder.orderNumber,
  });
}
