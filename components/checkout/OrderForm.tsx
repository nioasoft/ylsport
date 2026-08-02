"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

const PRODUCT_PRICE = 99;

type Size = "S" | "M" | "L" | "XL";

interface OrderItem {
  size: Size;
  quantity: number;
}

interface SizeStock {
  available: number;
  isActive: boolean;
}

interface OrderFormProps {
  onSubmit: (items: OrderItem[]) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size>("S");

  const [stockData, setStockData] = useState<Record<Size, SizeStock>>({
    S: { available: 0, isActive: true },
    M: { available: 0, isActive: true },
    L: { available: 0, isActive: true },
    XL: { available: 0, isActive: true },
  });
  const [stockLoaded, setStockLoaded] = useState(false);

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) {
        setStockData(data.inventory);
        setStockLoaded(true);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setStockLoaded(true); // still allow ordering, server will validate
    }
  }

  const maxAllowed = stockLoaded
    ? Math.min(10, stockData[selectedSize]?.available || 0)
    : 10;

  const isSizeAvailable = (size: Size) => {
    if (!stockLoaded) return true; // assume available until loaded
    const stock = stockData[size];
    return stock.isActive && stock.available > 0;
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxAllowed) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (size: Size) => {
    if (!isSizeAvailable(size)) return;
    setSelectedSize(size);
    // Reset quantity if it exceeds new size's stock
    const newMax = Math.min(10, stockData[size]?.available || 10);
    if (quantity > newMax) {
      setQuantity(Math.max(1, newMax));
    }
  };

  const calculateSubtotal = () => {
    return quantity * PRODUCT_PRICE;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([{ size: selectedSize, quantity }]);
  };

  const sizeLabels: Record<Size, string> = { S: "S (36)", M: "M (38)", L: "L (40)", XL: "XL (42)" };

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
              <div className="flex justify-center gap-4">
                {(["S", "M", "L", "XL"] as Size[]).map((size) => {
                  const available = isSizeAvailable(size);

                  return (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        disabled={!available}
                        className={`
                          relative flex h-14 w-14 items-center justify-center rounded-full border-2 
                          text-xl font-bold transition-all
                          ${
                            !available
                              ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-300"
                              : selectedSize === size
                                ? "scale-110 border-primary bg-primary-light text-primary shadow-md"
                                : "border-gray-300 bg-white hover:border-primary hover:shadow-sm"
                          }
                        `}
                      >
                        <span className={!available ? "line-through decoration-2" : ""}>
                          {size}
                        </span>
                      </button>
                      <span className="w-14 text-center text-sm text-gray-600">{size === "S" ? "36" : size === "M" ? "38" : size === "L" ? "40" : "42"}</span>
                      {!available && stockLoaded ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold leading-none text-red-700 ring-1 ring-red-200">
                          Sold Out
                        </span>
                      ) : (
                        <span className="h-[18px]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stock indicator */}
              {stockLoaded && isSizeAvailable(selectedSize) && stockData[selectedSize].available <= 10 && (
                <p className="mt-2 text-center text-sm font-medium text-orange-600">
                  🔥 נותרו רק {stockData[selectedSize].available} יחידות במידה {selectedSize}!
                </p>
              )}
              {stockLoaded && !isSizeAvailable(selectedSize) && (
                <p className="mt-2 text-center text-sm font-medium text-red-600">
                  המלאי למידה {selectedSize} אזל
                </p>
              )}
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
                  disabled={quantity >= maxAllowed}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold transition-all hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                מקסימום {maxAllowed} יחידות להזמנה
                {stockLoaded && stockData[selectedSize]?.available < 10 && stockData[selectedSize]?.available > 0 && (
                  <span className="text-orange-600"> (מוגבל לפי המלאי הזמין)</span>
                )}
              </p>
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
              <span className="font-semibold">{sizeLabels[selectedSize]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>סה"כ:</span>
              <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between border-t border-primary pt-2">
              <span className="font-semibold">סה"כ לתשלום:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(calculateSubtotal())}
              </span>
            </div>
            <p className="text-xs text-gray-600">* עלות משלוח תחושב בשלב הבא</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full text-lg"
            disabled={stockLoaded && !isSizeAvailable(selectedSize)}
          >
            {stockLoaded && !isSizeAvailable(selectedSize) ? "המלאי אזל" : "המשך לפרטי משלוח"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
