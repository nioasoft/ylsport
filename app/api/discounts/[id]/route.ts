import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const discountCode = await prisma.discountCode.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!discountCode) {
      return NextResponse.json(
        {
          success: false,
          message: "קוד הנחה לא נמצא",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      discountCode: {
        ...discountCode,
        ordersCount: discountCode._count.orders,
      },
    });
  } catch (error) {
    console.error("Discount code retrieval error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "שגיאה בטעינת קוד ההנחה",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const discountCode = await prisma.discountCode.update({
      where: { id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.value !== undefined && { value: body.value }),
        ...(body.validFrom !== undefined && { validFrom: new Date(body.validFrom) }),
        ...(body.validUntil !== undefined && { validUntil: new Date(body.validUntil) }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit }),
        ...(body.minimumOrderValue !== undefined && {
          minimumOrderValue: body.minimumOrderValue,
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      discountCode,
    });
  } catch (error) {
    console.error("Discount code update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "שגיאה בעדכון קוד ההנחה",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const discountWithOrders = await prisma.discountCode.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!discountWithOrders) {
      return NextResponse.json(
        {
          success: false,
          message: "קוד הנחה לא נמצא",
        },
        { status: 404 }
      );
    }

    if (discountWithOrders._count.orders > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "לא ניתן למחוק קוד הנחה המקושר להזמנות קיימות",
          code: "REFERENCED_BY_ORDERS",
        },
        { status: 400 }
      );
    }

    await prisma.discountCode.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "קוד ההנחה נמחק בהצלחה",
    });
  } catch (error) {
    console.error("Discount code deletion error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "שגיאה במחיקת קוד ההנחה",
      },
      { status: 500 }
    );
  }
}
