"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice, getProductSizeLabel } from "@/lib/utils";

const PRODUCT_PRICE = 299;
const SIZES = ["S", "M", "L", "XL"] as const;

interface OrderItem {
  size: string;
  quantity: number;
}

interface OrderFormProps {
  onSubmit: (items: OrderItem[]) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { size: "M", quantity: 1 },
  ]);

  const handleSizeChange = (index: number, size: string) => {
    const updated = [...orderItems];
    updated[index].size = size;
    setOrderItems(updated);
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const updated = [...orderItems];
    const newQuantity = updated[index].quantity + delta;

    // Validate quantity (1-5 per item)
    if (newQuantity >= 1 && newQuantity <= 5) {
      updated[index].quantity = newQuantity;
      setOrderItems(updated);
    }
  };

  const handleAddItem = () => {
    // Maximum 10 items total per order
    if (orderItems.length < 10) {
      setOrderItems([...orderItems, { size: "M", quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length > 1) {
      const updated = orderItems.filter((_, i) => i !== index);
      setOrderItems(updated);
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.quantity * PRODUCT_PRICE,
      0
    );
  };

  const getTotalQuantity = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(orderItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>בחרי מידה וכמות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Items */}
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">
                  פריט {index + 1}
                </Label>
                {orderItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    הסר פריט
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Size Selector */}
                <div>
                  <Label className="mb-2 block text-sm">מידה</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(index, size)}
                        className={`rounded-lg border-2 py-3 text-center font-semibold transition-all ${
                          item.size === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 bg-white hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {getProductSizeLabel(item.size)}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <Label className="mb-2 block text-sm">כמות</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, -1)}
                      disabled={item.quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-white font-bold transition-all hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <div className="flex h-10 w-16 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-lg font-semibold">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, 1)}
                      disabled={item.quantity >= 5}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-white font-bold transition-all hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    מקסימום 5 יחידות למידה
                  </p>
                </div>
              </div>

              {/* Item Price */}
              <div className="mt-4 flex justify-between border-t pt-3">
                <span className="text-gray-600">מחיר פריט:</span>
                <span className="font-semibold">
                  {formatPrice(item.quantity * PRODUCT_PRICE)}
                </span>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          {orderItems.length < 10 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full"
            >
              + הוסף מידה נוספת
            </Button>
          )}

          {/* Order Summary */}
          <div className="rounded-lg bg-primary-light p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>סה&quot;כ פריטים:</span>
              <span className="font-semibold">{getTotalQuantity()}</span>
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

      {/* Size Guide Link */}
      <div className="text-center">
        <a
          href="#size-guide"
          className="text-sm text-primary hover:underline"
        >
          צפה במדריך מידות ←
        </a>
      </div>
    </form>
  );
}
