import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTranzilaSDK } from "@/lib/tranzila";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, returnItem, requestedItem, note, returnReason } = body;

    // 1. Find the request
    const exchangeRequest = await prisma.exchangeRequest.findUnique({
      where: { token },
      include: { order: true },
    });

    if (!exchangeRequest) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    if (exchangeRequest.status === "PAID" || exchangeRequest.status === "PROCESSED") {
      return NextResponse.json({ error: "Request already processed" }, { status: 400 });
    }

    // 2. Update the request details
    const customerNoteCombined = `סיבה: ${returnReason}\nהערות: ${note || ""}`;
    
    await prisma.exchangeRequest.update({
      where: { id: exchangeRequest.id },
      data: {
        returnItem,
        requestedItem,
        customerNote: customerNoteCombined,
      },
    });

    // 3. Create Payment Link (Tranzila)
    const tranzila = getTranzilaSDK();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const paymentResponse = await tranzila.createPayment({
      amount: 29.00,
      currency_code: "ILS",
      transaction_id: exchangeRequest.id, // We use the ExchangeRequest ID as the transaction ID
      product_name: "משלוח החלפה",
      customer_name: exchangeRequest.order.customerName,
      customer_email: exchangeRequest.order.customerEmail,
      customer_phone: exchangeRequest.order.customerPhone,
      success_url: `${baseUrl}/exchanges/${token}?payment=success`,
      cancel_url: `${baseUrl}/exchanges/${token}?payment=failed`,
      // notify_url is handled internally by Tranzila SDK based on env vars
    });

    if (!paymentResponse.success || !paymentResponse.payment_url) {
       throw new Error(paymentResponse.error || "Failed to generate payment link");
    }

    // 4. Update request with payment attempt info (if transaction_id returned immediately)
    if (paymentResponse.transaction_id) {
        await prisma.exchangeRequest.update({
        where: { id: exchangeRequest.id },
        data: {
            paymentId: paymentResponse.transaction_id,
        },
        });
    }

    return NextResponse.json({ url: paymentResponse.payment_url });

  } catch (error) {
    console.error("Exchange payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
