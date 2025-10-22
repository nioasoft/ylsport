/**
 * GET /api/admin/session
 *
 * Check if admin is authenticated
 * - Return session info if logged in
 * - Return 401 if not authenticated
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      session: {
        username: session.username,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "שגיאה בבדיקת הפעלה" },
      { status: 500 }
    );
  }
}
