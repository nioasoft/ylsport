import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exchanges = await prisma.exchangeRequest.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerPhone: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, exchanges });
  } catch (error) {
    console.error("Fetch exchanges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchanges" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    const updated = await prisma.exchangeRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, exchange: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
