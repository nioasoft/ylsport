/**
 * Test script for Tranzila payment
 * Run with: npx tsx scripts/test-payment.ts
 */

import { config } from "dotenv";
import path from "path";

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

async function testPayment() {
  console.log("=".repeat(60));
  console.log("Testing Tranzila Payment - 1 NIS");
  console.log("=".repeat(60));

  const { getTranzilaSDK } = await import("../lib/tranzila");

  const tranzila = getTranzilaSDK();

  // Create a test payment request
  const result = await tranzila.createPayment({
    amount: 1, // 1 NIS for testing
    currency_code: "ILS",
    transaction_id: `TEST-${Date.now()}`,
    success_url: "http://localhost:3000/order/confirmation?test=true",
    cancel_url: "http://localhost:3000/checkout?cancelled=true",
    notify_url: "http://localhost:3000/api/payment/tranzila-callback",
    customer_name: "בדיקה טסט",
    customer_email: "benatia.asaf@gmail.com",
    customer_phone: "0507778080",
    product_name: "תשלום בדיקה - YL Sport",
  });

  console.log("\nTranzila Result:", JSON.stringify(result, null, 2));

  if (result.success && result.payment_url) {
    console.log("\n" + "=".repeat(60));
    console.log("✅ Payment link created successfully!");
    console.log("=".repeat(60));
    console.log("\n🔗 Payment URL:");
    console.log(result.payment_url);
    console.log("\nOpen this URL in your browser to complete the test payment.");
  } else {
    console.log("\n❌ Failed to create payment link");
    console.log("Error:", result.error);
  }

  return result;
}

testPayment().catch(console.error);
