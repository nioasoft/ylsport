import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Auth Check
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // 3. Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Create Exchange Request
    const token = randomUUID(); // Secure random token

    const exchangeRequest = await prisma.exchangeRequest.create({
      data: {
        token,
        orderId: order.id,
        status: "PENDING_PAYMENT",
      },
    });

    // 5. Return success
    return NextResponse.json({
      success: true,
      exchangeRequest,
      token,
    });

  } catch (error) {
    console.error("Create exchange error:", error);
    return NextResponse.json(
      { error: "Failed to create exchange request" },
      { status: 500 }
    );
  }
}
