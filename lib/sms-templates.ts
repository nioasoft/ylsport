/**
 * SMS Templates
 *
 * DEMO MODE: Currently logs SMS to console
 * Replace with actual SMS provider (e.g., Twilio, Vonage) when API is received
 */

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
// SMS SENDING (DEMO MODE)
// ============================================================================

/**
 * Send shipping notification SMS
 * DEMO MODE: Logs to console, returns mock success
 */
export function sendShippingSMS(data: ShippingSMSData): SMSResult {
  try {
    // Validate phone number
    if (!data.phone || !isValidPhoneNumber(data.phone)) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    // Generate SMS message in Hebrew
    const message = generateShippingSMSMessage(data);

    // DEMO MODE: Log to console instead of sending
    console.log("\n" + "=".repeat(60));
    console.log("📱 SMS DEMO MODE - Shipping Notification");
    console.log("=".repeat(60));
    console.log(`To: ${data.phone}`);
    console.log(`Order: ${data.orderNumber}`);
    console.log(`Tracking: ${data.trackingNumber}`);
    console.log("-".repeat(60));
    console.log(`Message:\n${message}`);
    console.log("=".repeat(60) + "\n");

    // Return mock success
    return {
      success: true,
      messageId: `demo-${Date.now()}`,
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
 * Send order confirmation SMS
 * DEMO MODE: Logs to console, returns mock success
 */
export function sendOrderConfirmationSMS(
  data: OrderConfirmationSMSData
): SMSResult {
  try {
    // Validate phone number
    if (!data.phone || !isValidPhoneNumber(data.phone)) {
      return {
        success: false,
        error: "Invalid phone number",
      };
    }

    // Generate SMS message in Hebrew
    const message = generateOrderConfirmationSMSMessage(data);

    // DEMO MODE: Log to console instead of sending
    console.log("\n" + "=".repeat(60));
    console.log("📱 SMS DEMO MODE - Order Confirmation");
    console.log("=".repeat(60));
    console.log(`To: ${data.phone}`);
    console.log(`Order: ${data.orderNumber}`);
    console.log("-".repeat(60));
    console.log(`Message:\n${message}`);
    console.log("=".repeat(60) + "\n");

    // Return mock success
    return {
      success: true,
      messageId: `demo-${Date.now()}`,
    };
  } catch (error) {
    console.error("SMS DEMO error:", error);
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
 */
function generateShippingSMSMessage(data: ShippingSMSData): string {
  return `היי ${data.customerName},

ההזמנה שלך יצאה למשלוח! 🎉

הזמנה: ${data.orderNumber}
מספר מעקב: ${data.trackingNumber}

תוכל/י לעקוב אחר המשלוח בקישור שנשלח למייל.

YL Sport
www.yl-sport.co.il`;
}

/**
 * Generate order confirmation SMS message in Hebrew
 */
function generateOrderConfirmationSMSMessage(
  data: OrderConfirmationSMSData
): string {
  return `היי ${data.customerName},

ההזמנה שלך התקבלה בהצלחה! ✅

הזמנה: ${data.orderNumber}
סכום: ₪${data.total.toFixed(2)}

פרטי ההזמנה נשלחו למייל שלך.

YL Sport
www.yl-sport.co.il`;
}

// ============================================================================
// PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Validate Israeli phone number format
 * Accepts: 05X-XXXXXXX, 05XXXXXXXXX, +972-5X-XXXXXXX
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Israeli mobile: 10 digits starting with 05
  // Or international: 12 digits starting with 9725
  const israeliMobileRegex = /^05\d{8}$/;
  const internationalRegex = /^9725\d{8}$/;

  return (
    israeliMobileRegex.test(digitsOnly) || internationalRegex.test(digitsOnly)
  );
}

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

// ============================================================================
// FUTURE: REAL SMS PROVIDER INTEGRATION
// ============================================================================

/**
 * TODO: Replace DEMO functions with actual SMS provider when API is received
 *
 * Example providers:
 * - Twilio: https://www.twilio.com/docs/sms
 * - Vonage (Nexmo): https://developer.vonage.com/messaging/sms/overview
 * - AWS SNS: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
 *
 * Implementation steps:
 * 1. Install provider SDK: npm install twilio (or other provider)
 * 2. Add API credentials to .env.local
 * 3. Create SMS client instance
 * 4. Replace console.log with actual API calls
 * 5. Handle rate limiting and errors
 * 6. Add delivery status tracking
 */
