import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTranzilaSDK } from "@/lib/tranzila";
import { createOrderSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

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

    // Create Tranzila payment
    const tranzila = getTranzilaSDK();

    const paymentResponse = await tranzila.createPayment({
      amount: order.total.toNumber(),
      currency_code: "ILS", // Or "NIS" depending on API requirement
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/confirmation?orderNumber=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_cancelled`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/tranzila-callback`,
      transaction_id: order.orderNumber, // Use our order number as reference
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      product_name: "YL Sport Tights",
    });

    if (!paymentResponse.success || !paymentResponse.payment_url) {
      throw new Error(paymentResponse.error || "Failed to generate payment link");
    }

    // Return payment URL to client
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      paymentUrl: paymentResponse.payment_url,
      transactionId: paymentResponse.transaction_id,
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

    // Customer lookup - get single order by orderNumber
    if (orderNumber) {
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

      // Return order details (excluding sensitive info for customer)
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
    }

    // Admin list view - requires authentication
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get filter parameters
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build where clause
    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    // Get orders with pagination
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        discountCode: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Return admin view with full details
    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingPostalCode: order.shippingPostalCode,
        shippingMethod: order.shippingMethod,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        subtotal: order.subtotal.toNumber(),
        shippingCost: order.shippingCost.toNumber(),
        discountAmount: order.discountAmount.toNumber(),
        total: order.total.toNumber(),
        items: order.items.map((item) => ({
          productName: item.productName,
          productSize: item.productSize,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit.toNumber(),
          totalPrice: item.totalPrice.toNumber(),
        })),
        discountCode: order.discountCode?.code,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
