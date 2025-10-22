/**
 * POST /api/admin/logout
 *
 * Admin logout endpoint
 * - Clear session cookie
 */

import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "שגיאה ביציאה מהמערכת" },
      { status: 500 }
    );
  }
}
