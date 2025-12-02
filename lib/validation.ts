import { z } from "zod";

// ============================================================================
// CUSTOMER & SHIPPING VALIDATION
// ============================================================================

const hebrewNameRegex = /^[\u0590-\u05FF\s'-]+$/;
const phoneRegex = /^0(5[0-9]|[2-4]|[8-9])[0-9]{7}$/; // Israeli phone format

export const shippingFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "שם חייב להכיל לפחות 2 תווים")
    .max(100, "שם ארוך מדי")
    .regex(hebrewNameRegex, "השם חייב להיות בעברית בלבד"),

  customerEmail: z
    .string()
    .email("כתובת אימייל לא תקינה")
    .max(255, "כתובת אימייל ארוכה מדי"),

  customerPhone: z
    .string()
    .regex(phoneRegex, "מספר טלפון לא תקין (נדרש פורמט ישראלי)"),

  shippingAddress: z
    .string()
    .min(5, "כתובת חייבת להכיל לפחות 5 תווים")
    .max(200, "כתובת ארוכה מדי"),

  shippingCity: z
    .string()
    .min(2, "שם עיר חייב להכיל לפחות 2 תווים")
    .max(100, "שם עיר ארוך מדי")
    .regex(hebrewNameRegex, "שם העיר חייב להיות בעברית בלבד"),

  shippingPostalCode: z
    .string()
    .regex(/^\d{7}$/, "מיקוד חייב להכיל 7 ספרות"),

  shippingMethod: z.enum(["STANDARD_DELIVERY", "SELF_PICKUP"], {
    message: "אנא בחר שיטת משלוח תקינה",
  }),
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

// ============================================================================
// PRODUCT SELECTION VALIDATION
// ============================================================================

export const productSizeSchema = z.enum(["S", "M", "L", "XL"], {
  message: "אנא בחר מידה תקינה",
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

// Full order item schema for API (includes all fields)
export const fullOrderItemSchema = z.object({
  productName: z.string(),
  productSize: productSizeSchema,
  quantity: productQuantitySchema,
  pricePerUnit: z.number().positive("מחיר ליחידה חייב להיות חיובי"),
  totalPrice: z.number().positive("מחיר כולל חייב להיות חיובי"),
});

export const createOrderSchema = z.object({
  // Customer & Shipping Info
  ...shippingFormSchema.shape,

  // Order Items (with all details)
  items: z
    .array(fullOrderItemSchema)
    .min(1, "חייבת להיות לפחות פריט אחד בהזמנה")
    .max(10, "מקסימום 10 פריטים בהזמנה"),

  // Optional Discount Code
  discountCode: z.string().optional(),

  // Pricing (will be calculated server-side but validated)
  subtotal: z.number().positive("סכום ביניים חייב להיות חיובי"),
  shippingCost: z.number().nonnegative("עלות משלוח לא יכולה להיות שלילית"),
  discountAmount: z.number().nonnegative("סכום הנחה לא יכול להיות שלילי").default(0),
  total: z.number().positive("סכום כולל חייב להיות חיובי"),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;

// ============================================================================
// ADMIN AUTHENTICATION VALIDATION
// ============================================================================

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(3, "שם משתמש חייב להכיל לפחות 3 תווים")
    .max(50, "שם משתמש ארוך מדי")
    .regex(/^[a-zA-Z0-9_]+$/, "שם משתמש יכול להכיל רק אותיות אנגליות, מספרים וקו תחתון"),

  password: z
    .string()
    .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
    .max(100, "סיסמה ארוכה מדי"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// ============================================================================
// ADMIN DISCOUNT CODE MANAGEMENT
// ============================================================================

export const createDiscountCodeSchema = z.object({
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

  validFrom: z.date().default(() => new Date()),

  validUntil: z.date(),

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
}).refine(
  (data) => data.validUntil > data.validFrom,
  {
    message: "תאריך סיום חייב להיות אחרי תאריך התחלה",
    path: ["validUntil"],
  }
);

export type CreateDiscountCodeData = z.infer<typeof createDiscountCodeSchema>;

// ============================================================================
// ADMIN ORDER MANAGEMENT
// ============================================================================

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ], {
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
  email: z
    .string()
    .email("כתובת אימייל לא תקינה")
    .max(255, "כתובת אימייל ארוכה מדי"),

  consent: z
    .boolean()
    .refine((val) => val === true, {
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

export const tranzilaCallbackSchema = z.object({
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
}).passthrough();

export type TranzilaCallbackData = z.infer<typeof tranzilaCallbackSchema>;
