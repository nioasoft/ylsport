/**
 * Notification Service
 *
 * Centralized service for sending shipping notifications via email and SMS
 */

import { sendOrderStatusUpdateEmail } from "@/lib/resend";
import { sendShippingSMS } from "@/lib/sms-templates";
import type { Order, OrderItem } from "@prisma/client";

/**
 * Send shipping notification to customer
 * - Sends email with tracking number and shipping details
 * - Sends SMS with tracking number (DEMO mode until API received)
 */
export async function sendShippingNotification(
  order: Order & { items: OrderItem[] }
): Promise<{
  success: boolean;
  emailSent: boolean;
  smsSent: boolean;
  errors: string[];
}> {
  const results = {
    success: false,
    emailSent: false,
    smsSent: false,
    errors: [] as string[],
  };

  // Validate order has required fields
  if (!order.trackingNumber) {
    results.errors.push("Order missing tracking number");
    return results;
  }

  // Send email notification
  try {
    const emailResult = await sendOrderStatusUpdateEmail({
      to: order.customerEmail,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      newStatus: "SHIPPED",
      trackingNumber: order.trackingNumber,
    });

    if (emailResult.success) {
      results.emailSent = true;
      console.log(
        `✅ Shipping email sent to ${order.customerEmail} for order ${order.orderNumber}`
      );
    } else {
      results.errors.push(`Email failed: ${emailResult.error}`);
      console.error(
        `❌ Failed to send shipping email for order ${order.orderNumber}:`,
        emailResult.error
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown email error";
    results.errors.push(`Email error: ${errorMessage}`);
    console.error(
      `❌ Email error for order ${order.orderNumber}:`,
      errorMessage
    );
  }

  // Send SMS notification
  try {
    const smsResult = await sendShippingSMS({
      phone: order.customerPhone,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      customerName: order.customerName,
    });

    if (smsResult.success) {
      results.smsSent = true;
      console.log(
        `✅ Shipping SMS sent to ${order.customerPhone} for order ${order.orderNumber}`
      );
    } else {
      results.errors.push(`SMS failed: ${smsResult.error}`);
      console.error(
        `❌ Failed to send shipping SMS for order ${order.orderNumber}:`,
        smsResult.error
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown SMS error";
    results.errors.push(`SMS error: ${errorMessage}`);
    console.error(`❌ SMS error for order ${order.orderNumber}:`, errorMessage);
  }

  // Consider success if at least one notification was sent
  results.success = results.emailSent || results.smsSent;

  return results;
}

/**
 * Format status for display in Hebrew
 */
export function formatOrderStatusHebrew(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING_PAYMENT: "ממתין לתשלום",
    PAID: "שולם",
    PROCESSING: "בטיפול",
    SHIPPED: "נשלח",
    DELIVERED: "נמסר",
    CANCELLED: "בוטל",
  };

  return statusMap[status] || status;
}
