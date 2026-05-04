import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================================
// TAILWIND CLASS MERGING
// ============================================================================

/**
 * Merge Tailwind CSS classes with proper precedence handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format price in ILS (Israeli Shekel) with proper RTL support
 * @param amount - Amount in ILS (e.g., 299)
 * @returns Formatted string (e.g., "₪299" or "₪299.00")
 */
export function formatPrice(amount: number | string, includeDecimals = false): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "₪0";
  }

  const formatted = includeDecimals
    ? numAmount.toFixed(2)
    : Math.round(numAmount).toString();

  return `₪${formatted}`;
}

/**
 * Format discount value based on type
 * @param type - "PERCENTAGE" or "FIXED_AMOUNT"
 * @param value - Discount value
 * @returns Formatted string (e.g., "20%" or "₪50")
 */
export function formatDiscount(type: "PERCENTAGE" | "FIXED_AMOUNT", value: number): string {
  if (type === "PERCENTAGE") {
    return `${value}%`;
  }
  return formatPrice(value);
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date to Hebrew locale
 * @param date - Date to format
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, includeTime = false): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return new Intl.DateTimeFormat("he-IL", options).format(dateObj);
}

/**
 * Format date to short format (DD/MM/YYYY)
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj > new Date();
}

// ============================================================================
// ORDER NUMBER GENERATION
// ============================================================================

/**
 * Generate next order number based on current count
 * @param currentCount - Current order count
 * @returns Formatted order number (e.g., "001", "042", "999")
 */
export function generateOrderNumber(currentCount: number): string {
  const nextNumber = currentCount + 1;
  return nextNumber.toString().padStart(3, "0");
}

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

/**
 * Format Israeli phone number for display
 * @param phone - Phone number (e.g., "0501234567")
 * @returns Formatted phone (e.g., "050-123-4567")
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return phone;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

/**
 * Normalize phone number to storage format (remove dashes/spaces)
 * @param phone - Phone number with formatting
 * @returns Cleaned phone number (e.g., "0501234567")
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if email is valid format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if Israeli phone number is valid
 */
export function isValidIsraeliPhone(phone: string): boolean {
  const phoneRegex = /^0(5[0-9]|[2-4]|[8-9])[0-9]{7}$/;
  return phoneRegex.test(normalizePhoneNumber(phone));
}

/**
 * Check if postal code is valid (7 digits)
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{7}$/.test(postalCode);
}

// ============================================================================
// PRICE CALCULATION UTILITIES
// ============================================================================

/**
 * Calculate shipping cost based on method
 * @param method - "STANDARD_DELIVERY" or "SELF_PICKUP"
 * @returns Shipping cost in ILS
 */
export function calculateShippingCost(method: "STANDARD_DELIVERY" | "SELF_PICKUP"): number {
  return 0;
}

/**
 * Calculate discount amount based on type and value
 * @param subtotal - Order subtotal
 * @param type - "PERCENTAGE" or "FIXED_AMOUNT"
 * @param value - Discount value
 * @returns Discount amount in ILS
 */
export function calculateDiscountAmount(
  subtotal: number,
  type: "PERCENTAGE" | "FIXED_AMOUNT",
  value: number
): number {
  if (type === "PERCENTAGE") {
    return Math.round((subtotal * value) / 100 * 100) / 100; // Round to 2 decimals
  }
  return Math.min(value, subtotal); // Fixed amount, but not more than subtotal
}

/**
 * Calculate order total
 * @param subtotal - Product total
 * @param shippingCost - Shipping cost
 * @param discountAmount - Discount amount
 * @returns Total amount in ILS
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingCost: number,
  discountAmount: number
): number {
  const total = subtotal + shippingCost - discountAmount;
  return Math.max(0, Math.round(total * 100) / 100); // Ensure non-negative, round to 2 decimals
}

// ============================================================================
// ORDER STATUS UTILITIES
// ============================================================================

/**
 * Get Hebrew label for order status
 */
export function getOrderStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "ממתין לתשלום",
    PAID: "שולם",
    PROCESSING: "בטיפול",
    SHIPPED: "נשלח",
    DELIVERED: "נמסר",
    CANCELLED: "בוטל",
  };
  return statusLabels[status] || status;
}

/**
 * Get Hebrew label for payment status
 */
export function getPaymentStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    PENDING: "ממתין",
    COMPLETED: "הושלם",
    FAILED: "נכשל",
    REFUNDED: "הוחזר",
  };
  return statusLabels[status] || status;
}

/**
 * Get Hebrew label for shipping method
 */
export function getShippingMethodLabel(method: string): string {
  const methodLabels: Record<string, string> = {
    STANDARD_DELIVERY: "משלוח רגיל (חינם)",
    SELF_PICKUP: "איסוף עצמי (חינם)",
  };
  return methodLabels[method] || method;
}

/**
 * Get Hebrew label for product size
 */
export function getProductSizeLabel(size: string): string {
  const sizeLabels: Record<string, string> = {
    S: "S-36",
    M: "M-38",
    L: "L-40",
    XL: "XL-42",
  };
  return sizeLabels[size] || size;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "אירעה שגיאה לא צפויה";
}

/**
 * Check if error is a Zod validation error
 */
export function isZodError(error: unknown): boolean {
  return error instanceof Error && error.name === "ZodError";
}

// ============================================================================
// IP ADDRESS UTILITIES
// ============================================================================

/**
 * Check if IP is in whitelist (comma-separated list)
 * @param ip - IP address to check
 * @param whitelist - Comma-separated IP addresses
 * @returns true if IP is whitelisted
 */
export function isIpWhitelisted(ip: string, whitelist: string): boolean {
  const allowedIps = whitelist.split(",").map((item) => item.trim());
  return allowedIps.includes(ip);
}

/**
 * Extract client IP from request headers (Next.js)
 */
export function getClientIp(headers: Headers): string | null {
  // Check common headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback headers
  return headers.get("cf-connecting-ip") || headers.get("x-client-ip") || null;
}

// ============================================================================
// SESSION UTILITIES
// ============================================================================

/**
 * Check if session has expired
 * @param expiresAt - Expiration timestamp
 * @returns true if expired
 */
export function isSessionExpired(expiresAt: Date | string): boolean {
  const expirationDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expirationDate < new Date();
}

/**
 * Calculate session expiration (24 hours from now)
 */
export function getSessionExpiration(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// ============================================================================
// SLEEP UTILITY (for testing/demos)
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
