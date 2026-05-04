import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllStock } from "@/lib/inventory";
import { ProductSize } from "@prisma/client";
import { z } from "zod";

/**
 * GET /api/admin/inventory
 * Admin endpoint - returns full inventory details.
 */
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stock = await getAllStock();

    const inventory = Object.entries(stock).map(([size, data]) => ({
      size,
      ...data,
    }));

    return NextResponse.json({ success: true, inventory });
  } catch (error) {
    console.error("Admin inventory fetch error:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה בטעינת מלאי" },
      { status: 500 }
    );
  }
}

const updateInventorySchema = z.object({
  size: z.enum(["S", "M", "L", "XL"]),
  totalStock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

/**
 * PUT /api/admin/inventory
 * Admin endpoint - update inventory for a size.
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateInventorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "נתונים לא תקינים", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { size, totalStock, isActive } = validation.data;

    const updateData: Record<string, unknown> = {};
    if (totalStock !== undefined) updateData.totalStock = totalStock;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.sizeInventory.update({
      where: { size: size as ProductSize },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      inventory: {
        size: updated.size,
        totalStock: updated.totalStock,
        reservedStock: updated.reservedStock,
        soldStock: updated.soldStock,
        available: updated.totalStock - updated.reservedStock - updated.soldStock,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error("Admin inventory update error:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה בעדכון מלאי" },
      { status: 500 }
    );
  }
}
