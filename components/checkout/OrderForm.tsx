"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

const PRODUCT_PRICE = 299;

interface OrderItem {
  size: "S" | "M" | "L" | "XL";
  quantity: number;
}

interface OrderFormProps {
  onSubmit: (items: OrderItem[]) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("S");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([{ size: selectedSize, quantity }]);
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
            <div className="flex justify-between border-t border-primary pt-2">
              <span className="font-semibold">סה&quot;כ:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(calculateSubtotal())}
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
