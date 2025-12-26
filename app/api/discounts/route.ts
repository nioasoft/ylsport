import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { createDiscountCodeSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    const where: any = {};

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.code = {
        contains: search.toUpperCase(),
        mode: "insensitive",
      };
    }

    const discountCodes = await prisma.discountCode.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const statistics = await prisma.discountCode.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        usageCount: true,
      },
      where,
    });

    return NextResponse.json({
      success: true,
      discountCodes,
      statistics: {
        totalCodes: statistics._count.id,
        totalUsage: statistics._sum.usageCount || 0,
      },
    });
  } catch (error) {
    console.error("Discount codes retrieval error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "שגיאה בטעינת קודי הנחה",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createDiscountCodeSchema.safeParse(body);

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

    const existingCode = await prisma.discountCode.findUnique({
      where: { code: data.code },
    });

    if (existingCode) {
      return NextResponse.json(
        {
          success: false,
          message: "קוד הנחה זה כבר קיים",
          field: "code",
          code: "DUPLICATE_CODE",
        },
        { status: 400 }
      );
    }

    const discountCode = await prisma.discountCode.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        usageLimit: data.usageLimit,
        minimumOrderValue: data.minimumOrderValue,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      discountCode,
    });
  } catch (error) {
    console.error("Discount code creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "שגיאה ביצירת קוד ההנחה",
      },
      { status: 500 }
    );
  }
}
