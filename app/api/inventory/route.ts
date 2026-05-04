import { NextResponse } from "next/server";
import { getAllStock } from "@/lib/inventory";
import { ProductSize } from "@prisma/client";

/**
 * GET /api/inventory
 * Public endpoint - returns available stock per size (for the checkout UI).
 */
export async function GET() {
  try {
    const stock = await getAllStock();

    // Only return what the client needs (available count + active status)
    const publicStock: Record<string, { available: number; isActive: boolean }> = {};
    for (const size of [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL]) {
      publicStock[size] = {
        available: stock[size].available,
        isActive: stock[size].isActive,
      };
    }

    return NextResponse.json({ success: true, inventory: publicStock });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה בטעינת מלאי" },
      { status: 500 }
    );
  }
}
