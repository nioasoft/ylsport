"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shippingFormSchema, type ShippingFormData } from "@/lib/validation";
import { formatPrice, getShippingMethodLabel } from "@/lib/utils";

interface ShippingFormProps {
  subtotal: number;
  discountCode?: string;
  discountAmount?: number;
  onSubmit: (data: ShippingFormData) => void;
  onBack: () => void;
}

const SHIPPING_METHODS = [
  {
    value: "STANDARD_DELIVERY" as const,
    label: "משלוח רגיל",
    cost: 20,
    description: "משלוח עד הבית תוך 3-5 ימי עסקים",
  },
  {
    value: "SELF_PICKUP" as const,
    label: "איסוף עצמי",
    cost: 0,
    description: "איסוף מבאר שבע (ללא עלות)",
  },
];

export function ShippingForm({
  subtotal,
  discountCode,
  discountAmount,
  onSubmit,
  onBack,
}: ShippingFormProps) {
  const [shippingMethod, setShippingMethod] = useState<"STANDARD_DELIVERY" | "SELF_PICKUP">(
    "STANDARD_DELIVERY"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      shippingMethod: "STANDARD_DELIVERY",
    },
  });

  const handleShippingMethodChange = (value: string) => {
    const method = value as "STANDARD_DELIVERY" | "SELF_PICKUP";
    setShippingMethod(method);
    setValue("shippingMethod", method);
  };

  const getShippingCost = () => {
    return shippingMethod === "STANDARD_DELIVERY" ? 20 : 0;
  };

  const getTotal = () => {
    return subtotal + getShippingCost() - (discountAmount || 0);
  };

  const onFormSubmit = (data: ShippingFormData) => {
    // For self-pickup, set default address values
    if (data.shippingMethod === "SELF_PICKUP") {
      data.shippingAddress = "איסוף עצמי";
      data.shippingCity = "באר שבע";
      data.shippingPostalCode = "0000000";
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle>פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="customerName">
              שם מלא <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerName"
              {...register("customerName")}
              placeholder="שם פרטי ומשפחה"
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-500">{errors.customerName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="customerEmail">
              אימייל <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerEmail"
              type="email"
              {...register("customerEmail")}
              placeholder="example@email.com"
              className={errors.customerEmail ? "border-red-500" : ""}
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.customerEmail.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-600">נשלח אישור הזמנה למייל זה</p>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="customerPhone">
              טלפון נייד <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              {...register("customerPhone")}
              placeholder="050-1234567"
              className={errors.customerPhone ? "border-red-500" : ""}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-500">{errors.customerPhone.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-600">לעדכוני SMS על סטטוס ההזמנה</p>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Method */}
      <Card>
        <CardHeader>
          <CardTitle>שיטת משלוח</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {SHIPPING_METHODS.map((method) => (
              <label
                key={method.value}
                className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                  shippingMethod === method.value
                    ? "border-primary bg-primary-light"
                    : "border-gray-200 hover:border-primary"
                }`}
              >
                <input
                  type="radio"
                  value={method.value}
                  checked={shippingMethod === method.value}
                  onChange={(e) => handleShippingMethodChange(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{method.label}</span>
                    <span className="font-bold text-primary">
                      {method.cost === 0 ? "חינם" : formatPrice(method.cost)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address (only for delivery) */}
      {shippingMethod === "STANDARD_DELIVERY" && (
        <Card>
          <CardHeader>
            <CardTitle>כתובת למשלוח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address */}
            <div>
              <Label htmlFor="shippingAddress">
                רחוב ומספר בית <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingAddress"
                {...register("shippingAddress")}
                placeholder="רחוב הרצל 12"
                className={errors.shippingAddress ? "border-red-500" : ""}
              />
              {errors.shippingAddress && (
                <p className="mt-1 text-sm text-red-500">{errors.shippingAddress.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <Label htmlFor="shippingCity">
                עיר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingCity"
                {...register("shippingCity")}
                placeholder="תל אביב"
                className={errors.shippingCity ? "border-red-500" : ""}
              />
              {errors.shippingCity && (
                <p className="mt-1 text-sm text-red-500">{errors.shippingCity.message}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <Label htmlFor="shippingPostalCode">
                מיקוד <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingPostalCode"
                {...register("shippingPostalCode")}
                placeholder="1234567"
                maxLength={7}
                className={errors.shippingPostalCode ? "border-red-500" : ""}
              />
              {errors.shippingPostalCode && (
                <p className="mt-1 text-sm text-red-500">{errors.shippingPostalCode.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">
                7 ספרות (ניתן לחפש{" "}
                <a
                  href="https://mypost.israelpost.co.il/umbraco/Surface/PostalCodeAPI/GetAddress"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  כאן
                </a>
                )
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>סיכום הזמנה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>סכום ביניים:</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>משלוח:</span>
            <span className="font-semibold">
              {getShippingCost() === 0 ? "חינם" : formatPrice(getShippingCost())}
            </span>
          </div>
          {discountAmount && discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>הנחה ({discountCode}):</span>
              <span className="font-semibold">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-3 text-lg">
            <span className="font-bold">סה&quot;כ לתשלום:</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(getTotal())}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          חזור
        </Button>
        <Button type="submit" size="lg" className="flex-1 text-lg" disabled={isSubmitting}>
          {isSubmitting ? "מעבד..." : "המשך לתשלום"}
        </Button>
      </div>
    </form>
  );
}
