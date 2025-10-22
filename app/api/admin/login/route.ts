/**
 * POST /api/admin/login
 *
 * Admin login endpoint
 * - Verify username + password
 * - Create session cookie
 * - Return success/error
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "שם משתמש וסיסמה הם שדות חובה" },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "שם משתמש או סיסמה שגויים" },
        { status: 401 }
      );
    }

    // Create session
    const session = await createAdminSession(username);

    return NextResponse.json({
      success: true,
      session: {
        username: session.username,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "שגיאה בהתחברות למערכת" },
      { status: 500 }
    );
  }
}
