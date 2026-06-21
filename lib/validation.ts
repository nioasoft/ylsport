import { z } from "zod";

// ============================================================================
// CUSTOMER & SHIPPING VALIDATION
// ============================================================================

const hebrewNameRegex = /^[\u0590-\u05FF\s'-]+$/;
const phoneRegex = /^0(5[0-9]|[2-4]|[8-9])[0-9]{7}$/; // Israeli phone format

export const shippingFormSchema = z
  .object({
    customerName: z
      .string()
      .min(2, "שם חייב להכיל לפחות 2 תווים")
      .max(100, "שם ארוך מדי")
      .regex(hebrewNameRegex, "השם חייב להיות בעברית בלבד"),

    customerEmail: z.string().email("כתובת אימייל לא תקינה").max(255, "כתובת אימייל ארוכה מדי"),

    customerPhone: z.string().regex(phoneRegex, "מספר טלפון לא תקין (נדרש פורמט ישראלי)"),

    // Address fields - optional for self-pickup, required for delivery
    shippingAddress: z.string().max(200, "כתובת ארוכה מדי").optional().or(z.literal("")),

    shippingCity: z.string().max(100, "שם עיר ארוך מדי").optional().or(z.literal("")),

    shippingPostalCode: z.string().optional().or(z.literal("")),

    shippingMethod: z.enum(["STANDARD_DELIVERY", "SELF_PICKUP"], {
      message: "אנא בחר שיטת משלוח תקינה",
    }),
  })
  .superRefine((data, ctx) => {
    // If delivery method selected, address fields are required
    if (data.shippingMethod === "STANDARD_DELIVERY") {
      if (!data.shippingAddress || data.shippingAddress.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "כתובת חייבת להכיל לפחות 5 תווים",
          path: ["shippingAddress"],
        });
      }

      if (!data.shippingCity || data.shippingCity.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "שם עיר חייב להכיל לפחות 2 תווים",
          path: ["shippingCity"],
        });
      } else if (!hebrewNameRegex.test(data.shippingCity)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "שם העיר חייב להיות בעברית בלבד",
          path: ["shippingCity"],
        });
      }

      if (!data.shippingPostalCode || !/^\d{7}$/.test(data.shippingPostalCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "מיקוד חייב להכיל 7 ספרות",
          path: ["shippingPostalCode"],
        });
      }
    }
  });

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

// ============================================================================
// PRODUCT SELECTION VALIDATION
// ============================================================================

export const productSizeSchema = z.enum(["S", "M", "L", "XL"], {
  message: "אנא בחרי מידה תקינה",
});

export const productQuantitySchema = z
  .number()
  .int("כמות חייבת להיות מספר שלם")
  .min(1, "כמות מינימלית היא 1")
  .max(5, "כמות מקסימלית היא 5");

export const orderItemSchema = z.object({
  productSize: productSizeSchema,
  quantity: productQuantitySchema,
});

export type OrderItemData = z.infer<typeof orderItemSchema>;

// ============================================================================
// DISCOUNT CODE VALIDATION
// ============================================================================

export const discountCodeSchema = z.object({
  code: z
    .string()
    .min(3, "קוד הנחה חייב להכיל לפחות 3 תווים")
    .max(50, "קוד הנחה ארוך מדי")
    .regex(/^[A-Z0-9]+$/, "קוד הנחה חייב להכיל אותיות אנגליות גדולות ומספרים בלבד")
    .transform((val) => val.toUpperCase()), // Normalize to uppercase
});

export type DiscountCodeData = z.infer<typeof discountCodeSchema>;

// ============================================================================
// ORDER CREATION VALIDATION
// ============================================================================
//
// SECURITY: Price fields (subtotal, shippingCost, discountAmount, total,
// pricePerUnit, totalPrice) are intentionally ABSENT from the client payload.
// The server derives them via `computeOrderPricing` in `lib/pricing.ts`. Any
// price sent by the client is silently ignored. See Iron Law #4 (BOLA).

export const createOrderSchema = z.object({
  // Customer & Shipping Info
  ...shippingFormSchema.shape,

  // Order Items — sizes and quantities only, no prices
  items: z
    .array(orderItemSchema)
    .min(1, "חייבת להיות לפחות פריט אחד בהזמנה")
    .max(10, "מקסימום 10 פריטים בהזמנה"),

  // Optional Discount Code (server looks it up and validates it)
  discountCode: z.string().optional(),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;

// ============================================================================
// EXCHANGE PAYMENT VALIDATION
// ============================================================================
//
// SECURITY: The exchange fee amount (₪29) is NOT part of this schema. It is
// hardcoded server-side in `app/api/exchanges/pay/route.ts` and verified in
// the callback. The client cannot influence the amount charged.

export const exchangePaySchema = z.object({
  token: z
    .string()
    .min(1, "טוקן חסר")
    .max(255, "טוקן ארוך מדי"),
  returnItem: z.string().max(50, "פריט החזרה ארוך מדי").optional(),
  requestedItem: z.string().max(50, "פריט מבוקש ארוך מדי").optional(),
  note: z.string().max(1000, "הערה ארוכה מדי").optional(),
  returnReason: z.string().max(500, "סיבת החזרה ארוכה מדי").optional(),
});

export type ExchangePayData = z.infer<typeof exchangePaySchema>;

// ============================================================================
// ADMIN AUTHENTICATION VALIDATION
// ============================================================================

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(3, "שם משתמש חייב להכיל לפחות 3 תווים")
    .max(50, "שם משתמש ארוך מדי")
    .regex(/^[a-zA-Z0-9_]+$/, "שם משתמש יכול להכיל רק אותיות אנגליות, מספרים וקו תחתון"),

  password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים").max(100, "סיסמה ארוכה מדי"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// ============================================================================
// ADMIN DISCOUNT CODE MANAGEMENT
// ============================================================================

export const createDiscountCodeSchema = z
  .object({
    code: z
      .string()
      .min(3, "קוד הנחה חייב להכיל לפחות 3 תווים")
      .max(50, "קוד הנחה ארוך מדי")
      .regex(/^[A-Z0-9]+$/, "קוד הנחה חייב להכיל אותיות אנגליות גדולות ומספרים בלבד")
      .transform((val) => val.toUpperCase()),

    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
      message: "סוג הנחה לא תקין",
    }),

    value: z
      .number()
      .positive("ערך הנחה חייב להיות חיובי")
      .refine((val) => val <= 100, "אחוז הנחה לא יכול לעבור 100%"),

    validFrom: z.coerce.date().default(() => new Date()),

    validUntil: z.coerce.date(),

    usageLimit: z
      .number()
      .int("מגבלת שימוש חייבת להיות מספר שלם")
      .positive("מגבלת שימוש חייבת להיות חיובית")
      .nullable()
      .optional(),

    minimumOrderValue: z
      .number()
      .nonnegative("ערך הזמנה מינימלי לא יכול להיות שלילי")
      .nullable()
      .optional(),

    isActive: z.boolean().default(true),
  })
  .refine((data) => data.validUntil > data.validFrom, {
    message: "תאריך סיום חייב להיות אחרי תאריך התחלה",
    path: ["validUntil"],
  });

export type CreateDiscountCodeData = z.infer<typeof createDiscountCodeSchema>;

// ============================================================================
// ADMIN ORDER MANAGEMENT
// ============================================================================

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], {
    message: "סטטוס הזמנה לא תקין",
  }),

  trackingNumber: z
    .string()
    .min(5, "מספר מעקב חייב להכיל לפחות 5 תווים")
    .max(100, "מספר מעקב ארוך מדי")
    .optional(),
});

export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;

// ============================================================================
// NEWSLETTER SUBSCRIPTION
// ============================================================================

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה").max(255, "כתובת אימייל ארוכה מדי"),

  consent: z.boolean().refine((val) => val === true, {
    message: "חייב לאשר קבלת ניוזלטר",
  }),
});

export type NewsletterSubscriptionData = z.infer<typeof newsletterSubscriptionSchema>;

// ============================================================================
// CARDCOM PAYMENT VALIDATION
// ============================================================================

export const cardcomCallbackSchema = z.object({
  // Cardcom callback parameters
  Order: z.string(), // Our order number
  Amount: z.string(), // Payment amount
  Currency: z.string().default("ILS"),
  ConfirmationCode: z.string(), // Cardcom transaction ID
  ResponseCode: z.string(), // "0" = success
  Description: z.string().optional(),
  InternalDealNumber: z.string().optional(),
});

export type CardcomCallbackData = z.infer<typeof cardcomCallbackSchema>;

// ============================================================================
// TRANZILA PAYMENT VALIDATION
// ============================================================================

export const tranzilaCallbackSchema = z
  .object({
    // Tranzila callback parameters
    Response: z.string(), // "000" = success, other codes = failure
    ConfirmationCode: z.string().optional(), // Transaction confirmation code
    pr_id: z.string(), // Payment request ID from Tranzila
    sum: z.coerce.number(), // Payment amount
    currency: z.string().optional().default("1"), // Currency code (1 = ILS)
    index: z.string().optional(), // Tranzila transaction index
    // Additional fields that may be returned
    ccno: z.string().optional(), // Last 4 digits of card
    expmonth: z.string().optional(),
    expyear: z.string().optional(),
    cardtype: z.string().optional(),
    cardissuer: z.string().optional(),
    cardaquirer: z.string().optional(),
    contact: z.string().optional(), // Customer name
    email: z.string().optional(), // Customer email
    phone: z.string().optional(), // Customer phone
    // Allow additional unknown fields
  })
  .passthrough();

export type TranzilaCallbackData = z.infer<typeof tranzilaCallbackSchema>;
