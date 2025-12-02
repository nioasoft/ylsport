/**
 * Test script for SMS and Email notifications
 * Run with: npx tsx scripts/test-notifications.ts
 */

import { config } from "dotenv";
import path from "path";

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

async function testSMS() {
  console.log("=".repeat(60));
  console.log("Testing SMS via SendMsg API");
  console.log("=".repeat(60));

  const { sendSMS } = await import("../lib/sendmsg");

  const result = await sendSMS({
    to: "0507778080",
    message: `שלום! זוהי הודעת בדיקה מ-YL Sport.
מספר הזמנה: TEST-001
תודה! YL Sport`,
  });

  console.log("\nSMS Result:", JSON.stringify(result, null, 2));
  return result;
}

async function testEmail() {
  console.log("\n" + "=".repeat(60));
  console.log("Testing Email via Resend API");
  console.log("=".repeat(60));

  const { sendOrderConfirmationEmail } = await import("../lib/resend");

  // Data matching the OrderConfirmationEmailData interface
  const emailData = {
    to: "benatia.asaf@gmail.com",
    orderNumber: "TEST-001",
    customerName: "אסף בן עטיה",
    items: [
      {
        productName: "טייץ ספורט YL",
        size: "M",
        quantity: 1,
        pricePerUnit: 149,
        totalPrice: 149,
      },
      {
        productName: "טייץ ספורט YL",
        size: "L",
        quantity: 2,
        pricePerUnit: 149,
        totalPrice: 298,
      },
    ],
    subtotal: 447,
    shippingCost: 0,
    discountAmount: 0,
    total: 447,
    shippingMethod: "DELIVERY",
    shippingAddress: "רחוב הבדיקה 123",
    shippingCity: "תל אביב",
    shippingPostalCode: "6100000",
  };

  const result = await sendOrderConfirmationEmail(emailData);

  console.log("\nEmail Result:", JSON.stringify(result, null, 2));
  return result;
}

async function main() {
  console.log("\n🚀 Starting notification tests...\n");

  // Test SMS
  const smsResult = await testSMS();

  // Test Email
  const emailResult = await testEmail();

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`SMS: ${smsResult.success ? "✅ SUCCESS" : "❌ FAILED"}`);
  console.log(`Email: ${emailResult.success ? "✅ SUCCESS" : "❌ FAILED"}`);

  if (!smsResult.success) {
    console.log(`SMS Error: ${smsResult.error}`);
  }
  if (!emailResult.success) {
    console.log(`Email Error: ${emailResult.error}`);
  }
}

main().catch(console.error);
