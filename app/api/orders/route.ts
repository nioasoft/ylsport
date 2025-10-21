import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCardcomSDK, generatePaymentDescription } from "@/lib/cardcom";
import { createOrderSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = createOrderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "נתונים לא תקינים",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate order number (sequential)
    const orderCount = await prisma.order.count();
    const orderNumber = generateOrderNumber(orderCount);

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,

        // Customer Information
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,

        // Shipping Information
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingPostalCode: data.shippingPostalCode,
        shippingMethod: data.shippingMethod,

        // Pricing
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        discountAmount: data.discountAmount,
        total: data.total,

        // Status
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",

        // Order Items
        items: {
          create: data.items.map((item) => ({
            productName: item.productName,
            productSize: item.productSize,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create Cardcom payment
    const cardcom = getCardcomSDK();

    const paymentRequest = {
      terminalNumber: process.env.CARDCOM_TERMINAL_NUMBER || "",
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order/confirmation?orderNumber=${orderNumber}`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      sum: order.total.toNumber(),
      currency: "ILS",
      orderNumber: order.orderNumber,
      productName: "YL Sport Tights",
      quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      description: generatePaymentDescription(
        "YL Sport Tights",
        order.items.reduce((sum, item) => sum + item.quantity, 0),
        order.items.map((item) => item.productSize)
      ),
      email: order.customerEmail,
      language: "he",
    };

    const paymentResponse = await cardcom.createPayment(paymentRequest);

    // Return payment URL to client
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      paymentUrl: paymentResponse.url,
      transactionId: paymentResponse.lowProfileCode,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "אירעה שגיאה ביצירת ההזמנה",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "מספר הזמנה חסר",
        },
        { status: 400 }
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        discountCode: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "הזמנה לא נמצאה",
        },
        { status: 404 }
      );
    }

    // Return order details (excluding sensitive info)
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total.toNumber(),
        items: order.items,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Order retrieval error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "אירעה שגיאה בטעינת ההזמנה",
      },
      { status: 500 }
    );
  }
}
