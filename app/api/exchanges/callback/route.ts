import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTranzilaSDK } from "@/lib/tranzila";

async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let payload: any = {};
    
    // 1. Collect data from query params (GET/POST)
    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    // 2. If POST, also collect from body
    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const body = await request.json();
        payload = { ...payload, ...body };
      } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        formData.forEach((value, key) => {
          if (typeof value === "string") payload[key] = value;
        });
      }
    }

    console.log("Tranzila Exchange Callback Payload:", payload);

    // 3. Extract key fields
    // Tranzila sends 'order_id' which we mapped to our exchangeRequestId in the createPayment call
    const exchangeRequestId = payload.order_id || payload.transaction_id; 
    
    // Map payload to TranzilaCallbackData structure expected by SDK
    // Note: Tranzila parameter names can vary slightly (e.g. 'Response' vs 'response')
    const callbackData = {
        Response: payload.Response || payload.response || "999",
        sum: parseFloat(payload.sum || payload.amount || "0"),
        ConfirmationCode: payload.ConfirmationCode || payload.confirmation_code || "",
        index: payload.index || payload.transaction_id || "",
        ...payload
    };

    const tranzila = getTranzilaSDK();
    
    // 4. Verify Payment
    const verification = tranzila.verifyCallback(callbackData, 29.00);

    if (!verification.success) {
      console.error("Exchange payment verification failed:", verification.message);
      return new NextResponse("Verification failed", { status: 400 });
    }

    if (!exchangeRequestId) {
      console.error("Missing exchange request ID (order_id) in callback");
      return new NextResponse("Missing ID", { status: 400 });
    }

    // 5. Update Database
    await prisma.exchangeRequest.update({
      where: { id: exchangeRequestId },
      data: {
        status: "PAID",
        paymentId: verification.transactionId,
        paymentDate: new Date(),
      },
    });

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Callback error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

export { handler as GET, handler as POST };