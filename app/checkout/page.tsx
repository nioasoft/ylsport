"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderForm } from "@/components/checkout/OrderForm";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { LoadingOverlay } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import type { ShippingFormData } from "@/lib/validation";

interface OrderItem {
  size: string;
  quantity: number;
}

type CheckoutStep = "order" | "shipping" | "processing";

const PRODUCT_PRICE = 199;
const PRODUCT_NAME = "YL Sport Tights";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>("order");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [discountCode, setDiscountCode] = useState<string>();
  const [discountAmount, setDiscountAmount] = useState<number>();

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity * PRODUCT_PRICE, 0);
  };

  const handleOrderSubmit = (
    items: OrderItem[],
    discountCode?: string,
    discountAmount?: number
  ) => {
    setOrderItems(items);
    setDiscountCode(discountCode);
    setDiscountAmount(discountAmount);
    setStep("shipping");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShippingSubmit = async (shippingData: ShippingFormData) => {
    setIsProcessing(true);

    try {
      const orderData = {
        ...shippingData,

        items: orderItems.map((item) => ({
          productName: PRODUCT_NAME,
          productSize: item.size,
          quantity: item.quantity,
          pricePerUnit: PRODUCT_PRICE,
          totalPrice: item.quantity * PRODUCT_PRICE,
        })),

        subtotal: calculateSubtotal(),
        shippingCost: shippingData.shippingMethod === "STANDARD_DELIVERY" ? 30 : 0,
        discountCode,
        discountAmount: discountAmount || 0,
        total:
          calculateSubtotal() +
          (shippingData.shippingMethod === "STANDARD_DELIVERY" ? 30 : 0) -
          (discountAmount || 0),
      };

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "שגיאה ביצירת ההזמנה");
      }

      const result = await response.json();

      // Redirect to Cardcom payment
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error("לא התקבל קישור לתשלום");
      }
    } catch (error) {
      console.error("Order creation error:", error);

      toast({
        title: "שגיאה",
        description:
          error instanceof Error ? error.message : "אירעה שגיאה ביצירת ההזמנה. אנא נסה שוב.",
        variant: "destructive",
      });

      setIsProcessing(false);
    }
  };

  // Handle back to order form
  const handleBack = () => {
    setStep("order");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center justify-center gap-2">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  step === "order" ? "bg-primary text-white" : "bg-green-500 text-white"
                }`}
              >
                {step === "order" ? "1" : "✓"}
              </div>
              <span className="mr-2 text-sm font-medium">בחירת מוצר</span>
            </div>

            <div className="h-0.5 w-12 bg-gray-300" />

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  step === "shipping"
                    ? "bg-primary text-white"
                    : step === "order"
                      ? "bg-gray-300 text-gray-600"
                      : "bg-green-500 text-white"
                }`}
              >
                {step === "order" ? "2" : step === "shipping" ? "2" : "✓"}
              </div>
              <span className="mr-2 text-sm font-medium">פרטי משלוח</span>
            </div>

            <div className="h-0.5 w-12 bg-gray-300" />

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  step === "processing" ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="mr-2 text-sm font-medium">תשלום</span>
            </div>
          </div>
        </div>

        {/* Checkout Forms */}
        <div className="mx-auto max-w-2xl">
          {step === "order" && <OrderForm onSubmit={handleOrderSubmit} />}

          {step === "shipping" && (
            <ShippingForm
              subtotal={calculateSubtotal()}
              discountCode={discountCode}
              discountAmount={discountAmount}
              onSubmit={handleShippingSubmit}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isProcessing && <LoadingOverlay message="מעבד את ההזמנה..." />}
    </div>
  );
}
