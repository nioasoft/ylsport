import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTranzilaSDK } from "@/lib/tranzila";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/resend";
import { sendOrderConfirmationSMSAsync } from "@/lib/sms-templates";
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
    // Check content type - Tranzila sends form data (QSTR format), not JSON
    const contentType = request.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);

    let callbackData: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse form data (QSTR format)
      const formData = await request.formData();
      formData.forEach((value, key) => {
        callbackData[key] = value.toString();
      });
    } else if (contentType.includes("application/json")) {
      // Parse JSON
      callbackData = await request.json();
    } else {
      // Try to parse as text and convert from query string format
      const text = await request.text();
      console.log("Raw body:", text);

      // Parse query string format: key1=value1&key2=value2
      const params = new URLSearchParams(text);
      params.forEach((value, key) => {
        callbackData[key] = value;
      });
    }

    console.log("Tranzila callback data:", JSON.stringify(callbackData, null, 2));

    return await processCallback(callbackData);
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

  // Get order from database using tranzilaPaymentId (pr_id from Tranzila)
  const order = await prisma.order.findUnique({
    where: { tranzilaPaymentId: callbackData.pr_id },
    include: {
      items: true,
      discountCode: true,
    },
  });

  if (!order) {
    console.error("Order not found for pr_id:", callbackData.pr_id);
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }

  console.log("Found order:", order.orderNumber, "for pr_id:", callbackData.pr_id);

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
        cancellationReason: verification.message,
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

  // Send notifications and create invoice in parallel (don't fail if any fail)
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

    // Send SMS confirmation to customer (using async version that waits for result)
    (async () => {
      console.log("Attempting to send SMS to:", updatedOrder.customerPhone);
      console.log("SMS env check - SITE_ID exists:", !!process.env.SENDMSG_SITE_ID);
      console.log("SMS env check - API_PASSWORD exists:", !!process.env.SENDMSG_API_PASSWORD);

      const smsResult = await sendOrderConfirmationSMSAsync({
        phone: updatedOrder.customerPhone,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        total: updatedOrder.total.toNumber(),
      });

      if (smsResult.success) {
        console.log("Order confirmation SMS sent successfully to:", updatedOrder.customerPhone);
      } else {
        console.error("Failed to send order confirmation SMS:", smsResult.error);
      }
    })(),

    // Create tax invoice/receipt (חשבונית מס קבלה) via Tranzila Invoices API
    (async () => {
      console.log("Creating invoice for order:", updatedOrder.orderNumber);

      // Build items for invoice - include products and shipping if applicable
      const invoiceItems: { name: string; code: string; unitPrice: number; quantity: number }[] = [];

      // Add product items
      for (const item of updatedOrder.items) {
        invoiceItems.push({
          name: item.productName,
          code: `${updatedOrder.orderNumber}-${item.productSize}`,
          unitPrice: item.pricePerUnit.toNumber(),
          quantity: item.quantity,
        });
      }

      // Add shipping as separate line item if applicable
      const shippingCost = updatedOrder.shippingCost.toNumber();
      if (shippingCost > 0) {
        invoiceItems.push({
          name: 'משלוח',
          code: 'SHIPPING',
          unitPrice: shippingCost,
          quantity: 1,
        });
      }

      const invoiceResult = await tranzila.createInvoice({
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        customerPhone: updatedOrder.customerPhone,
        customerAddress: updatedOrder.shippingAddress || undefined,
        customerCity: updatedOrder.shippingCity || undefined,
        items: invoiceItems,
        paymentMethod: 'credit_card',
        amount: updatedOrder.total.toNumber(),
        ccLastDigits: callbackData.ccno || undefined,
        transactionIndex: callbackData.index ? parseInt(callbackData.index) : undefined,
      });

      if (invoiceResult.success) {
        console.log("Invoice created successfully:", invoiceResult.documentNumber);

        // Save invoice ID to order
        await prisma.order.update({
          where: { id: updatedOrder.id },
          data: {
            invoiceNumber: invoiceResult.documentNumber,
          },
        });
      } else {
        console.error("Failed to create invoice:", invoiceResult.error);
      }
    })(),
  ]);

  return NextResponse.json({
    success: true,
    message: "Payment processed successfully",
    orderNumber: updatedOrder.orderNumber,
  });
}
