/**
 * SMS Templates and Sending Functions
 *
 * Uses SendMsg API for sending SMS messages to Israeli mobile numbers
 * Templates are in Hebrew for YL Sport customers
 */

import { sendSMS, isValidPhoneForSMS, getSMSErrorMessage } from "./sendmsg";

// ============================================================================
// TYPES
// ============================================================================

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ShippingSMSData {
  phone: string;
  orderNumber: string;
  trackingNumber: string;
  customerName: string;
}

export interface OrderConfirmationSMSData {
  phone: string;
  orderNumber: string;
  customerName: string;
  total: number;
}

// ============================================================================
// SMS SENDING FUNCTIONS
// ============================================================================

/**
 * Send shipping notification SMS
 */
export async function sendShippingSMS(data: ShippingSMSData): Promise<SMSResult> {
  try {
    // Validate phone number
    if (!data.phone || !isValidPhoneForSMS(data.phone)) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    // Generate SMS message in Hebrew
    const message = generateShippingSMSMessage(data);

    // Send via SendMsg API
    const result = await sendSMS({
      to: data.phone,
      message,
    });

    if (result.success) {
      console.log(`Shipping SMS sent to ${data.phone} for order ${data.orderNumber}`);
      return {
        success: true,
        messageId: result.messageId,
      };
    }

    console.error(`Failed to send shipping SMS: ${result.error}`);
    return {
      success: false,
      error: result.error ? getSMSErrorMessage(result.errorCode || "API_ERROR") : "Failed to send SMS",
    };
  } catch (error) {
    console.error("SMS sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMS error",
    };
  }
}

/**
 * Send order confirmation SMS
 */
export function sendOrderConfirmationSMS(data: OrderConfirmationSMSData): SMSResult {
  try {
    // Validate phone number
    if (!data.phone || !isValidPhoneForSMS(data.phone)) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    // Generate SMS message in Hebrew
    const message = generateOrderConfirmationSMSMessage(data);

    // Send via SendMsg API (async, but we return immediately for non-blocking)
    sendSMS({
      to: data.phone,
      message,
    })
      .then((result) => {
        if (result.success) {
          console.log(`Order confirmation SMS sent to ${data.phone} for order ${data.orderNumber}`);
        } else {
          console.error(`Failed to send order confirmation SMS: ${result.error}`);
        }
      })
      .catch((error) => {
        console.error("SMS sending error:", error);
      });

    // Return optimistic success (SMS sending is fire-and-forget)
    return {
      success: true,
      messageId: `pending-${Date.now()}`,
    };
  } catch (error) {
    console.error("SMS DEMO error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMS error",
    };
  }
}

/**
 * Send order confirmation SMS (async version)
 */
export async function sendOrderConfirmationSMSAsync(
  data: OrderConfirmationSMSData
): Promise<SMSResult> {
  try {
    // Validate phone number
    if (!data.phone || !isValidPhoneForSMS(data.phone)) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    // Generate SMS message in Hebrew
    const message = generateOrderConfirmationSMSMessage(data);

    // Send via SendMsg API
    const result = await sendSMS({
      to: data.phone,
      message,
    });

    if (result.success) {
      console.log(`Order confirmation SMS sent to ${data.phone} for order ${data.orderNumber}`);
      return {
        success: true,
        messageId: result.messageId,
      };
    }

    console.error(`Failed to send order confirmation SMS: ${result.error}`);
    return {
      success: false,
      error: result.error ? getSMSErrorMessage(result.errorCode || "API_ERROR") : "Failed to send SMS",
    };
  } catch (error) {
    console.error("SMS sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMS error",
    };
  }
}

// ============================================================================
// SMS MESSAGE TEMPLATES
// ============================================================================

/**
 * Generate shipping notification SMS message in Hebrew
 * Keep message short (160 chars for standard SMS)
 */
function generateShippingSMSMessage(data: ShippingSMSData): string {
  // Short version to fit in 1 SMS (160 chars in Hebrew is ~70 chars due to encoding)
  return `${data.customerName} שלום,
הזמנה ${data.orderNumber} נשלחה!
מעקב: ${data.trackingNumber}
YL Sport`;
}

/**
 * Generate order confirmation SMS message in Hebrew
 * Keep message short (160 chars for standard SMS)
 */
function generateOrderConfirmationSMSMessage(
  data: OrderConfirmationSMSData
): string {
  // Keep message very short - Hebrew SMS is limited to ~70 chars
  // Use only first name if available
  const firstName = data.customerName.split(" ")[0];
  return `${firstName}, הזמנה ${data.orderNumber} התקבלה! סה"כ ${data.total.toFixed(0)}₪ YL Sport`;
}

// ============================================================================
// PHONE NUMBER VALIDATION (re-exported from sendmsg)
// ============================================================================

export { isValidPhoneForSMS as isValidPhoneNumber } from "./sendmsg";

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  // Israeli mobile: 05X-XXXXXXX
  if (digitsOnly.length === 10 && digitsOnly.startsWith("05")) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  }

  // International: +972-5X-XXXXXXX
  if (digitsOnly.length === 12 && digitsOnly.startsWith("9725")) {
    return `+972-${digitsOnly.slice(3, 5)}-${digitsOnly.slice(5)}`;
  }

  return phone;
}
