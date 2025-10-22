/**
 * Admin Authentication Utilities
 *
 * Simple session-based authentication for single admin user
 * - Username/password from environment variables
 * - 24-hour absolute session expiration
 * - bcrypt for password hashing
 */

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// ============================================================================
// TYPES
// ============================================================================

export interface AdminSession {
  username: string;
  loginTime: number;
  expiresAt: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Verify admin credentials against environment variables
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!envUsername || !envPasswordHash) {
    console.error("Missing ADMIN_USERNAME or ADMIN_PASSWORD_HASH in environment variables");
    return false;
  }

  // Check username
  if (username !== envUsername) {
    return false;
  }

  // Verify password against hash
  try {
    const isValid = await bcrypt.compare(password, envPasswordHash);
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Create admin session
 */
export async function createAdminSession(username: string): Promise<AdminSession> {
  const now = Date.now();
  const session: AdminSession = {
    username,
    loginTime: now,
    expiresAt: now + SESSION_MAX_AGE,
  };

  // Set secure HTTP-only cookie
  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE / 1000, // in seconds
    path: "/",
  });

  return session;
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session: AdminSession = JSON.parse(sessionCookie.value);

    // Check if session expired
    if (Date.now() > session.expiresAt) {
      await clearAdminSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error parsing session cookie:", error);
    await clearAdminSession();
    return null;
  }
}

/**
 * Clear admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
  cookies().delete(SESSION_COOKIE_NAME);
}

/**
 * Check if admin is authenticated
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

/**
 * Require admin authentication - throw error if not authenticated
 * Use in API routes
 */
export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized - Admin authentication required");
  }

  return session;
}

// ============================================================================
// PASSWORD UTILITIES
// ============================================================================

/**
 * Generate password hash for environment variable
 * Usage: node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Validate password strength
 */
export function isPasswordStrong(password: string): boolean {
  // Minimum 8 characters, at least one letter and one number
  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return minLength && hasLetter && hasNumber;
}
