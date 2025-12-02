/**
 * Resend Email Client Wrapper
 *
 * Official Resend API Documentation:
 * https://resend.com/docs
 */

import { Resend } from "resend";

// ============================================================================
// TYPES
// ============================================================================

export interface EmailConfig {
  from: string; // "YL Sport <noreply@yl-sport.co.il>"
  replyTo?: string;
}

export interface OrderConfirmationEmailData {
  to: string;
  orderNumber: string;
  customerName: string;
  items: {
    productName: string;
    size: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  }[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingMethod: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  trackingNumber?: string;
}

export interface OrderStatusUpdateEmailData {
  to: string;
  orderNumber: string;
  customerName: string;
  newStatus: string;
  trackingNumber?: string;
}

export interface AdminOrderNotificationEmailData {
  to: string; // Admin email
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
}

// ============================================================================
// RESEND CLIENT
// ============================================================================

let resendInstance: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Missing RESEND_API_KEY environment variable. Please set it in .env.local"
      );
    }

    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
}

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

/**
 * Get email configuration at runtime (not module load time)
 * This ensures environment variables are read correctly in serverless environments
 */
function getEmailConfig(): EmailConfig {
  return {
    from: process.env.RESEND_FROM_EMAIL || "YL Sport <noreply@yl-sport.co.il>",
    replyTo: process.env.RESEND_REPLY_TO_EMAIL,
  };
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = getResendClient();

    // Import email template dynamically
    const { OrderConfirmationEmail } = await import("@/emails/order-confirmation");

    const config = getEmailConfig();
    console.log("Email config - from:", config.from);
    console.log("Email config - replyTo:", config.replyTo);

    // Only include reply_to if it's a valid non-empty string
    const emailPayload: Parameters<typeof resend.emails.send>[0] = {
      from: config.from,
      to: data.to,
      subject: `אישור הזמנה ${data.orderNumber} - YL Sport`,
      react: OrderConfirmationEmail(data),
    };

    // Add reply_to only if valid
    if (config.replyTo && config.replyTo.trim() && config.replyTo.includes('@')) {
      emailPayload.reply_to = config.replyTo.trim();
    }

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      console.error("Resend error:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send order status update email to customer
 */
export async function sendOrderStatusUpdateEmail(
  data: OrderStatusUpdateEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = getResendClient();

    // Import email template dynamically
    const { OrderStatusUpdateEmail } = await import("@/emails/order-status-update");

    const config = getEmailConfig();
    console.log("Sending status update email to:", data.to);
    console.log("Status update data:", JSON.stringify(data));

    // Build email payload
    const emailPayload: Parameters<typeof resend.emails.send>[0] = {
      from: config.from,
      to: data.to,
      subject: `עדכון סטטוס הזמנה ${data.orderNumber} - YL Sport`,
      react: OrderStatusUpdateEmail(data),
    };

    // Add reply_to only if valid
    if (config.replyTo && config.replyTo.trim() && config.replyTo.includes('@')) {
      emailPayload.reply_to = config.replyTo.trim();
    }

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      console.error("Resend error:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending order status update email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send new order notification to admin
 */
export async function sendAdminOrderNotificationEmail(
  data: AdminOrderNotificationEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = getResendClient();

    // Import email template dynamically
    const { AdminOrderNotificationEmail } = await import("@/emails/admin-order-notification");

    const config = getEmailConfig();

    // Build email payload
    const emailPayload: Parameters<typeof resend.emails.send>[0] = {
      from: config.from,
      to: data.to,
      subject: `הזמנה חדשה ${data.orderNumber} - YL Sport Admin`,
      react: AdminOrderNotificationEmail(data),
    };

    // Add reply_to only if valid
    if (config.replyTo && config.replyTo.trim() && config.replyTo.includes('@')) {
      emailPayload.reply_to = config.replyTo.trim();
    }

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      console.error("Resend error:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending admin order notification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send newsletter confirmation email
 */
export async function sendNewsletterConfirmationEmail(
  email: string,
  name?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = getResendClient();

    // Import email template dynamically
    const { NewsletterConfirmationEmail } = await import("@/emails/newsletter-confirmation");

    const config = getEmailConfig();

    // Build email payload
    const emailPayload: Parameters<typeof resend.emails.send>[0] = {
      from: config.from,
      to: email,
      subject: "הצטרפת לניוזלטר של YL Sport!",
      react: NewsletterConfirmationEmail({ email, name }),
    };

    // Add reply_to only if valid
    if (config.replyTo && config.replyTo.trim() && config.replyTo.includes('@')) {
      emailPayload.reply_to = config.replyTo.trim();
    }

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      console.error("Resend error:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending newsletter confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validate email address format
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email address (trim, lowercase)
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ============================================================================
// EMAIL BATCH SENDING (for newsletter)
// ============================================================================

/**
 * Send bulk emails to newsletter subscribers
 * Note: Resend has rate limits - batch and delay as needed
 */
export async function sendBulkNewsletterEmails(
  subscribers: { email: string; name?: string }[],
  subject: string,
  htmlContent: string
): Promise<{
  success: boolean;
  sent: number;
  failed: number;
  errors: string[];
}> {
  const resend = getResendClient();
  const results = {
    success: true,
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Process in batches of 100 (Resend rate limit consideration)
  const batchSize = 100;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    for (const subscriber of batch) {
      try {
        const config = getEmailConfig();

        // Build email payload
        const emailPayload: Parameters<typeof resend.emails.send>[0] = {
          from: config.from,
          to: subscriber.email,
          subject,
          html: htmlContent,
        };

        // Add reply_to only if valid
        if (config.replyTo && config.replyTo.trim() && config.replyTo.includes('@')) {
          emailPayload.reply_to = config.replyTo.trim();
        }

        await resend.emails.send(emailPayload);

        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to send to ${subscriber.email}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    // Delay between batches to respect rate limits (adjust as needed)
    if (i + batchSize < subscribers.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (results.failed > 0) {
    results.success = false;
  }

  return results;
}
