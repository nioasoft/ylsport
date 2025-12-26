import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderSubtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          valid: false,
          error: "קוד הנחה חסר",
          code: "MISSING_CODE",
        },
        { status: 400 }
      );
    }

    if (orderSubtotal === undefined || typeof orderSubtotal !== "number") {
      return NextResponse.json(
        {
          valid: false,
          error: "סכום הזמנה חסר",
          code: "MISSING_SUBTOTAL",
        },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();

    const discount = await prisma.discountCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!discount) {
      return NextResponse.json({
        valid: false,
        error: "קוד הנחה לא קיים",
        code: "NOT_FOUND",
      });
    }

    if (!discount.isActive) {
      return NextResponse.json({
        valid: false,
        error: "קוד הנחה זה אינו פעיל",
        code: "INACTIVE",
      });
    }

    const now = new Date();

    if (discount.validFrom > now) {
      return NextResponse.json({
        valid: false,
        error: "קוד הנחה זה טרם התחיל לפעול",
        code: "NOT_YET_VALID",
      });
    }

    if (discount.validUntil && discount.validUntil < now) {
      return NextResponse.json({
        valid: false,
        error: "קוד הנחה זה פג תוקף",
        code: "EXPIRED",
      });
    }

    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      return NextResponse.json({
        valid: false,
        error: "הגעת למכסת השימוש בקוד זה",
        code: "USAGE_LIMIT_REACHED",
      });
    }

    if (discount.minimumOrderValue && orderSubtotal < discount.minimumOrderValue.toNumber()) {
      return NextResponse.json({
        valid: false,
        error: `סכום הזמנה מינימלי לקוד זה הוא ₪${discount.minimumOrderValue}`,
        code: "MINIMUM_NOT_MET",
        minimumRequired: discount.minimumOrderValue.toNumber(),
      });
    }

    let discountAmount = 0;

    if (discount.type === DiscountType.PERCENTAGE) {
      discountAmount = (orderSubtotal * discount.value.toNumber()) / 100;
    } else if (discount.type === DiscountType.FIXED_AMOUNT) {
      discountAmount = Math.min(discount.value.toNumber(), orderSubtotal);
    }

    const newTotal = orderSubtotal - discountAmount;

    return NextResponse.json({
      valid: true,
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value.toNumber(),
        discountAmount: Math.round(discountAmount * 100) / 100,
        newTotal: Math.round(newTotal * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Discount validation error:", error);

    return NextResponse.json(
      {
        valid: false,
        error: "שגיאה באימות קוד ההנחה",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
