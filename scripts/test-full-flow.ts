/**
 * Test Full Payment Flow
 *
 * This script:
 * 1. Creates a test order in the database
 * 2. Creates a Tranzila payment request for that order
 * 3. Returns the payment URL
 *
 * Run with: npx tsx scripts/test-full-flow.ts
 */

import { config } from "dotenv";
import path from "path";

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

async function createTestOrder() {
  console.log("=".repeat(60));
  console.log("Creating Test Order in Database");
  console.log("=".repeat(60));

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    // Generate unique order number
    const orderNumber = `TEST-${Date.now()}`;

    // Create test order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: "אסף בן עטיה",
        customerEmail: "benatia.asaf@gmail.com",
        customerPhone: "0507778080",
        shippingMethod: "STANDARD_DELIVERY",
        shippingAddress: "רחוב הבדיקה 123",
        shippingCity: "תל אביב",
        shippingPostalCode: "6100000",
        subtotal: 1,
        shippingCost: 0,
        discountAmount: 0,
        total: 1,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        items: {
          create: [
            {
              productName: "טייץ ספורט YL - בדיקה",
              productSize: "M",
              quantity: 1,
              pricePerUnit: 1,
              totalPrice: 1,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    console.log("\n✅ Order created:");
    console.log(`   Order Number: ${order.orderNumber}`);
    console.log(`   Customer: ${order.customerName}`);
    console.log(`   Email: ${order.customerEmail}`);
    console.log(`   Phone: ${order.customerPhone}`);
    console.log(`   Total: ${order.total} ש"ח`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Payment Status: ${order.paymentStatus}`);

    await prisma.$disconnect();
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    await prisma.$disconnect();
    throw error;
  }
}

async function createPaymentForOrder(orderId: string, orderNumber: string, total: number, customerName: string, customerEmail: string, customerPhone: string) {
  console.log("\n" + "=".repeat(60));
  console.log("Creating Tranzila Payment Request");
  console.log("=".repeat(60));

  const { getTranzilaSDK } = await import("../lib/tranzila");
  const tranzila = getTranzilaSDK();

  // Always use production URL for testing (IPN callback must be accessible)
  const siteUrl = "https://www.yl-sport.co.il";

  const result = await tranzila.createPayment({
    amount: total,
    currency_code: "ILS",
    transaction_id: orderNumber, // This is our order number - will come back in callback
    success_url: `${siteUrl}/order/confirmation?orderNumber=${orderNumber}`,
    cancel_url: `${siteUrl}/checkout?payment=failed&orderNumber=${orderNumber}`,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    product_name: "הזמנה מ-YL Sport",
  });

  if (result.success && result.transaction_id) {
    console.log("\n✅ Payment request created:");
    console.log(`   Tranzila PR ID: ${result.transaction_id}`);
    console.log(`   Payment URL: ${result.payment_url}`);

    // Update order with Tranzila pr_id
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.order.update({
      where: { id: orderId },
      data: { tranzilaPaymentId: result.transaction_id },
    });
    await prisma.$disconnect();
    console.log(`   ✅ Order updated with pr_id: ${result.transaction_id}`);
  } else {
    console.log("\n❌ Failed to create payment:");
    console.log(`   Error: ${result.error}`);
  }

  return result;
}

async function main() {
  console.log("\n🚀 Starting Full Payment Flow Test\n");

  // Step 1: Create order in database
  const order = await createTestOrder();

  // Step 2: Create payment request
  const payment = await createPaymentForOrder(
    order.id,
    order.orderNumber,
    Number(order.total),
    order.customerName,
    order.customerEmail,
    order.customerPhone
  );

  if (payment.success) {
    console.log("\n" + "=".repeat(60));
    console.log("📋 TEST INSTRUCTIONS");
    console.log("=".repeat(60));
    console.log(`
1. Open this payment URL in your browser:
   ${payment.payment_url}

2. Complete the payment (1 ש"ח)

3. After payment, Tranzila will:
   - Redirect you to: ${process.env.NEXT_PUBLIC_SITE_URL}/order/confirmation
   - Send webhook to: ${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/tranzila-callback

4. Check if you received:
   - SMS to 0507778080
   - Email to benatia.asaf@gmail.com
   - Admin email to ylsport1@gmail.com

5. Check order status in admin panel:
   ${process.env.NEXT_PUBLIC_SITE_URL}/admin

Order Number: ${order.orderNumber}
`);
  }
}

main().catch(console.error);
