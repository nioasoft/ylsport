"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

const PRODUCT_PRICE = 299;

interface OrderItem {
  size: string;
  quantity: number;
}

interface OrderFormProps {
  onSubmit: (items: OrderItem[]) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    // Validate quantity (1-10)
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return quantity * PRODUCT_PRICE;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit as single item with "One Size"
    onSubmit([{ size: "One Size", quantity }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>בחרי כמות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Info */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-lg font-semibold">YL Sport Tights</Label>
                <p className="text-sm text-gray-600 mt-1">מידה אחת - One Size</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-primary">{formatPrice(PRODUCT_PRICE)}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4">
              <Label className="mb-2 block text-sm">כמות</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold transition-all hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold transition-all hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                מקסימום 10 יחידות להזמנה
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-primary-light p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>סה&quot;כ פריטים:</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            <div className="flex justify-between border-t border-primary pt-2">
              <span className="font-semibold">סכום ביניים:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(calculateSubtotal())}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              * עלות משלוח תחושב בשלב הבא
            </p>
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
