/**
 * Debug script for Tranzila payment
 * Run with: npx tsx scripts/test-payment-debug.ts
 */

import { config } from "dotenv";
import path from "path";

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

async function testPayment() {
  console.log("=".repeat(60));
  console.log("Debug Tranzila Payment API");
  console.log("=".repeat(60));

  const apiHost = process.env.TRANZILA_API_HOST || 'https://api.tranzila.com';
  const terminalName = process.env.TRANZILA_TERMINAL_NAME || '';
  const publicKey = process.env.TRANZILA_PUBLIC_KEY || '';
  const privateKey = process.env.TRANZILA_PRIVATE_KEY || '';

  console.log("\nConfiguration:");
  console.log(`API Host: ${apiHost}`);
  console.log(`Terminal: ${terminalName}`);
  console.log(`Public Key: ${publicKey.substring(0, 20)}...`);
  console.log(`Private Key: ${privateKey}`);

  const endpoint = `${apiHost}/v1/pr/create`;
  console.log(`\nEndpoint: ${endpoint}`);

  const payload = {
    terminal_name: terminalName,
    amount: 1,
    currency: "ILS",
    success_url: "http://localhost:3000/order/confirmation",
    fail_url: "http://localhost:3000/checkout",
    notify_url: "http://localhost:3000/api/payment/tranzila-callback",
    customer_name: "Test Customer",
    email: "test@test.com",
    phone: "0501234567",
    order_id: `TEST-${Date.now()}`,
    product_description: "Test Payment",
  };

  // Try different authentication methods
  const authMethods = [
    {
      name: "Bearer Token",
      headers: {
        'Content-Type': 'application/json',
        'X-tranzila-api-app-key': publicKey,
        'Authorization': `Bearer ${privateKey}`,
      }
    },
    {
      name: "Basic Auth (base64)",
      headers: {
        'Content-Type': 'application/json',
        'X-tranzila-api-app-key': publicKey,
        'Authorization': `Basic ${Buffer.from(`${terminalName}:${privateKey}`).toString('base64')}`,
      }
    },
    {
      name: "Private Key as API Key",
      headers: {
        'Content-Type': 'application/json',
        'X-tranzila-api-app-key': privateKey,
      }
    },
    {
      name: "Both keys in headers",
      headers: {
        'Content-Type': 'application/json',
        'X-tranzila-api-app-key': publicKey,
        'X-tranzila-api-secret-key': privateKey,
      }
    },
  ];

  for (const method of authMethods) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Testing: ${method.name}`);
    console.log("=".repeat(60));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: method.headers,
        body: JSON.stringify(payload),
      });

      console.log(`Response Status: ${response.status} ${response.statusText}`);

      const responseText = await response.text();
      console.log("Response:", responseText.substring(0, 500));

      if (response.status === 200) {
        try {
          const json = JSON.parse(responseText);
          if (json.payment_url || json.url) {
            console.log("\n✅ SUCCESS! Payment URL found!");
            console.log("URL:", json.payment_url || json.url);
            return;
          }
        } catch {}
      }

    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  console.log("\n❌ No authentication method worked. Check your Tranzila credentials.");
}

testPayment().catch(console.error);
