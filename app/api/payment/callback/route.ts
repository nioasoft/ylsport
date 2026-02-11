import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCardcomSDK } from "@/lib/cardcom";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/resend";
import { cardcomCallbackSchema } from "@/lib/validation";
import { getClientIp } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate Cardcom callback data
    const validationResult = cardcomCallbackSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Invalid Cardcom callback:", validationResult.error);
      return NextResponse.json(
        { success: false, message: "Invalid callback data" },
        { status: 400 }
      );
    }

    const callbackData = validationResult.data;

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { orderNumber: callbackData.Order },
      include: {
        items: true,
        discountCode: true,
      },
    });

    if (!order) {
      console.error("Order not found:", callbackData.Order);
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Verify payment with Cardcom SDK (IP whitelist + amount verification)
    const cardcom = getCardcomSDK();
    const clientIp = getClientIp(request.headers);

    const verification = cardcom.verifyCallback(
      {
        Order: callbackData.Order,
        Amount: callbackData.Amount,
        Currency: callbackData.Currency,
        ConfirmationCode: callbackData.ConfirmationCode,
        ResponseCode: callbackData.ResponseCode,
        Description: callbackData.Description,
        InternalDealNumber: callbackData.InternalDealNumber,
      },
      order.total.toNumber(),
      clientIp
    );

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

    // Send order confirmation email to customer
    try {
      await sendOrderConfirmationEmail({
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
        shippingAddress: updatedOrder.shippingAddress,
        shippingCity: updatedOrder.shippingCity,
        shippingPostalCode: updatedOrder.shippingPostalCode,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the whole request if email fails
    }

    // Send admin notification
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "";
      if (adminEmail) {
        await sendAdminOrderNotificationEmail({
          to: adminEmail,
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          customerEmail: updatedOrder.customerEmail,
          customerPhone: updatedOrder.customerPhone,
          total: updatedOrder.total.toNumber(),
        });
      }
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't fail the whole request if email fails
    }

    // TODO: Send SMS notification via שלח מסר

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      orderNumber: updatedOrder.orderNumber,
    });
  } catch (error) {
    console.error("Payment callback error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Payment processing failed",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (Cardcom sometimes sends GET callbacks)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract callback parameters from query string
    const callbackData = {
      Order: searchParams.get("Order") || "",
      Amount: searchParams.get("Amount") || "",
      Currency: searchParams.get("Currency") || "ILS",
      ConfirmationCode: searchParams.get("ConfirmationCode") || "",
      ResponseCode: searchParams.get("ResponseCode") || "",
      Description: searchParams.get("Description"),
      InternalDealNumber: searchParams.get("InternalDealNumber"),
    };

    // Process the same way as POST
    // (Re-use the same logic by creating a new Request with POST method)
    const postRequest = new NextRequest(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(callbackData),
    });

    return await POST(postRequest);
  } catch (error) {
    console.error("Payment callback (GET) error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment processing failed",
      },
      { status: 500 }
    );
  }
}
