"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/shared/LoadingSpinner";
import {
  formatPrice,
  formatDate,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingMethodLabel,
  getProductSizeLabel,
} from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  productSize: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface Order {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setError("מספר הזמנה חסר");
      setLoading(false);
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderNumber=${orderNumber}`);

        if (!response.ok) {
          throw new Error("לא ניתן לטעון את פרטי ההזמנה");
        }

        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          throw new Error(data.message || "הזמנה לא נמצאה");
        }
      } catch (err) {
        console.error("Order fetch error:", err);
        setError(
          err instanceof Error ? err.message : "אירעה שגיאה בטעינת ההזמנה"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return <LoadingScreen message="טוען פרטי הזמנה..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-16 w-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="mb-4 text-2xl font-bold">שגיאה</h1>
                <p className="mb-6 text-gray-600">{error}</p>
                <Link href="/">
                  <Button>חזרה לדף הבית</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Success Message */}
          <Card className="mb-6 border-green-500 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-green-900">
                {isPaid ? "תודה על הרכישה!" : "ההזמנה נוצרה בהצלחה"}
              </h1>
              <p className="text-lg text-green-800">
                {isPaid
                  ? "ההזמנה שלך אושרה ותעובד בהקדם"
                  : "ממתינים לאישור תשלום"}
              </p>
              <div className="mt-6 rounded-lg bg-white p-4">
                <p className="text-sm text-gray-600">מספר הזמנה</p>
                <p className="text-2xl font-bold text-primary">
                  {order.orderNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>פרטי הזמנה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Status */}
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">סטטוס הזמנה:</span>
                <span className="font-semibold">
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">סטטוס תשלום:</span>
                <span className="font-semibold">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </span>
              </div>

              {/* Order Date */}
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">תאריך הזמנה:</span>
                <span className="font-semibold">
                  {formatDate(order.createdAt, true)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold">סה&quot;כ:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>פריטים בהזמנה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div>
                      <h4 className="font-semibold">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        {getProductSizeLabel(item.productSize)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">
                        {formatPrice(item.totalPrice)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatPrice(item.pricePerUnit)} ליחידה
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6 bg-primary-light">
            <CardHeader>
              <CardTitle>מה הלאה?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <h4 className="font-semibold">אישור במייל</h4>
                  <p className="text-sm text-gray-700">
                    שלחנו אישור הזמנה לכתובת המייל שלך
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-semibold">עדכוני SMS</h4>
                  <p className="text-sm text-gray-700">
                    נעדכן אותך בהודעת SMS על סטטוס ההזמנה
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="font-semibold">משלוח</h4>
                  <p className="text-sm text-gray-700">
                    ההזמנה תישלח תוך 3-5 ימי עסקים
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button size="lg" variant="outline">
                חזרה לדף הבית
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-center text-sm text-gray-600">
            שאלות? צור קשר ב-
            <a
              href="mailto:ylsport1@gmail.com"
              className="text-primary hover:underline"
            >
              ylsport1@gmail.com
            </a>{" "}
            או{" "}
            <a href="tel:0508897290" className="text-primary hover:underline">
              050-889-7290
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingScreen message="טוען פרטי הזמנה..." />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
