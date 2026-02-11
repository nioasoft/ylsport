"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const PRODUCT_PRICE = 199;

interface OrderItem {
  size: "S" | "M" | "L" | "XL";
  quantity: number;
}

interface OrderFormProps {
  onSubmit: (items: OrderItem[], discountCode?: string, discountAmount?: number) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("S");

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    newTotal: number;
  } | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    // Validate quantity (1-10)
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (size: "S" | "M" | "L" | "XL") => {
    setSelectedSize(size);
  };

  const calculateSubtotal = () => {
    return quantity * PRODUCT_PRICE;
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountMessage({ type: "error", text: "נא להזין קוד הנחה" });
      return;
    }

    setValidatingDiscount(true);
    setDiscountMessage(null);

    try {
      const response = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountCode,
          orderSubtotal: calculateSubtotal(),
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedDiscount({
          code: data.discount.code,
          amount: data.discount.discountAmount,
          newTotal: data.discount.newTotal,
        });
        setDiscountMessage({ type: "success", text: "קוד הנחה הוחל בהצלחה!" });
      } else {
        setAppliedDiscount(null);
        setDiscountMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Discount validation error:", error);
      setDiscountMessage({ type: "error", text: "שגיאה באימות קוד ההנחה" });
    } finally {
      setValidatingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setAppliedDiscount(null);
    setDiscountMessage(null);
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    return appliedDiscount ? appliedDiscount.newTotal : subtotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([{ size: selectedSize, quantity }], appliedDiscount?.code, appliedDiscount?.amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>בחרי כמות ומידה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Info */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold">YL Sport Tights</Label>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-primary">{formatPrice(PRODUCT_PRICE)}</p>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <Label className="mb-3 block text-lg font-semibold">בחרי מידה</Label>
              <div className="mb-3 flex justify-center gap-4">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size as "S" | "M" | "L" | "XL")}
                    className={`
                      flex h-14 w-14 items-center justify-center rounded-full border-2 
                      text-xl font-bold transition-all
                      ${
                        selectedSize === size
                          ? "scale-110 border-primary bg-primary-light text-primary"
                          : "border-gray-300 bg-white hover:border-primary"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-600">
                <span className="w-14 text-center">Small</span>
                <span className="w-14 text-center">Medium</span>
                <span className="w-14 text-center">Large</span>
                <span className="w-14 text-center">Extra Large</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <Label className="mb-2 block text-sm">כמות</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold transition-all hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  −
                </button>
                <div className="flex h-12 w-20 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-semibold">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold transition-all hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-600">מקסימום 10 יחידות להזמנה</p>
            </div>
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <Label htmlFor="discountCode" className="text-sm font-semibold">
              קוד קופון
            </Label>
            <div className="flex gap-2">
              <Input
                id="discountCode"
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                disabled={!!appliedDiscount}
                placeholder="הזיני קוד הנחה"
                className="flex-1"
              />
              {appliedDiscount ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveDiscount}
                  className="px-4 text-sm"
                >
                  הסר
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={validatingDiscount}
                  className="px-4 text-sm"
                >
                  {validatingDiscount ? "בודק..." : "החל"}
                </Button>
              )}
            </div>
            {discountMessage && (
              <p
                className={`text-xs ${
                  discountMessage.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {discountMessage.text}
              </p>
            )}
            {appliedDiscount && (
              <p className="text-xs font-medium text-green-600">
                הנחה של ₪{appliedDiscount.amount.toFixed(0)} הוחלה!
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-2 rounded-lg bg-primary-light p-4">
            <div className="flex justify-between text-sm">
              <span>סה&quot;כ פריטים:</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>מידה:</span>
              <span className="font-semibold">{selectedSize}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>מחיר לפני הנחה:</span>
              <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>הנחה ({appliedDiscount.code}):</span>
                <span className="font-semibold">-{formatPrice(appliedDiscount.amount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-primary pt-2">
              <span className="font-semibold">סה&quot;כ:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(calculateFinalTotal())}
              </span>
            </div>
            <p className="text-xs text-gray-600">* עלות משלוח תחושב בשלב הבא</p>
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full text-lg">
            המשך לפרטי משלוח
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
