# Data Model Specification

**Feature**: YL Sport Tights E-Commerce Website
**Branch**: 001-yl-sport-tights-site
**Date**: 2025-10-21
**Database**: PostgreSQL (Neon Serverless)
**ORM**: Prisma 5.x

## Overview

This document defines the complete database schema for the YL Sport Tights e-commerce application. The data model supports:
- Single product with size variants
- Guest checkout (no user accounts)
- Order management with status tracking
- Discount code system
- Admin authentication
- Automated email/SMS notifications

**Design Principles**:
- **Simplicity**: Minimal tables, no over-normalization
- **Data integrity**: Foreign keys, constraints, enums for valid states
- **Audit trail**: Timestamps on all entities
- **Type safety**: Prisma generates TypeScript types automatically

---

## Entity Relationship Diagram

```
┌─────────────────┐
│   AdminUser     │
│                 │
│ - id            │
│ - username      │
│ - passwordHash  │
│ - createdAt     │
│ - updatedAt     │
└─────────────────┘

┌─────────────────────────────────┐
│          Order                  │
│                                 │
│ - id                            │
│ - orderNumber                   │──┐
│ - customerName                  │  │
│ - customerEmail                 │  │
│ - customerPhone                 │  │
│ - shippingAddress               │  │
│ - shippingCity                  │  │
│ - shippingPostalCode            │  │
│ - shippingMethod                │  │
│ - subtotal                      │  │
│ - shippingCost                  │  │
│ - discountAmount                │  │
│ - total                         │  │
│ - status                        │  │
│ - paymentStatus                 │  │
│ - trackingNumber (nullable)     │  │
│ - discountCodeId (FK, nullable) │──┼──┐
│ - createdAt                     │  │  │
│ - updatedAt                     │  │  │
└─────────────────────────────────┘  │  │
                 │                    │  │
                 │ 1:N                │  │
                 ▼                    │  │
┌─────────────────────────────────┐  │  │
│        OrderItem                │  │  │
│                                 │  │  │
│ - id                            │  │  │
│ - orderId (FK)                  │──┘  │
│ - productName                   │     │
│ - productSize                   │     │
│ - quantity                      │     │
│ - pricePerUnit                  │     │
│ - totalPrice                    │     │
│ - createdAt                     │     │
└─────────────────────────────────┘     │
                                        │
                                        │ N:1
                                        ▼
┌─────────────────────────────────────┐
│         DiscountCode                │
│                                     │
│ - id                                │
│ - code (unique)                     │
│ - type (PERCENTAGE | FIXED_AMOUNT) │
│ - value                             │
│ - validFrom                         │
│ - validUntil                        │
│ - usageLimit (nullable)             │
│ - usageCount                        │
│ - minimumOrderValue (nullable)      │
│ - isActive                          │
│ - createdAt                         │
│ - updatedAt                         │
└─────────────────────────────────────┘
           │ 1:N
           ▼
    (Order.discountCodeId)
```

---

## Prisma Schema

### Complete Schema File

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ADMIN USER
// ============================================================================

model AdminUser {
  id           String   @id @default(cuid())
  username     String   @unique
  passwordHash String   // Bcrypt hash with salt rounds = 12
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("admin_users")
}

// ============================================================================
// ORDER
// ============================================================================

enum OrderStatus {
  PENDING_PAYMENT  // Order created, awaiting Cardcom payment confirmation
  PAID             // Payment confirmed, ready for processing
  PROCESSING       // Admin is preparing the order for shipment
  SHIPPED          // Order shipped, tracking number added
  DELIVERED        // Order delivered to customer
  CANCELLED        // Order cancelled (by customer or admin)

  @@map("order_status")
}

enum PaymentStatus {
  PENDING    // Waiting for payment
  COMPLETED  // Payment successful
  FAILED     // Payment failed at Cardcom
  REFUNDED   // Payment refunded

  @@map("payment_status")
}

enum ShippingMethod {
  STANDARD_DELIVERY  // 30 ILS, delivery to address
  SELF_PICKUP        // 0 ILS, pickup in Beer Sheva

  @@map("shipping_method")
}

model Order {
  id                 String         @id @default(cuid())
  orderNumber        String         @unique // Sequential: "001", "002", etc.

  // Customer Information (no user account, stored per order)
  customerName       String
  customerEmail      String
  customerPhone      String

  // Shipping Information
  shippingAddress    String
  shippingCity       String
  shippingPostalCode String
  shippingMethod     ShippingMethod

  // Pricing
  subtotal           Decimal        @db.Decimal(10, 2) // Product total before discount/shipping
  shippingCost       Decimal        @db.Decimal(10, 2) // 30 ILS or 0 ILS
  discountAmount     Decimal        @db.Decimal(10, 2) @default(0) // Amount deducted
  total              Decimal        @db.Decimal(10, 2) // Final amount paid

  // Order Status
  status             OrderStatus    @default(PENDING_PAYMENT)
  paymentStatus      PaymentStatus  @default(PENDING)
  trackingNumber     String?        // Nullable until shipped

  // Relationships
  items              OrderItem[]
  discountCode       DiscountCode?  @relation(fields: [discountCodeId], references: [id])
  discountCodeId     String?

  // Timestamps
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  @@index([orderNumber])
  @@index([customerEmail])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

// ============================================================================
// ORDER ITEM
// ============================================================================

enum ProductSize {
  S    // Small
  M    // Medium
  L    // Large
  XL   // Extra Large

  @@map("product_size")
}

model OrderItem {
  id           String      @id @default(cuid())

  // Relationship
  order        Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId      String

  // Product Information (denormalized for historical record)
  productName  String      // "YL Sport Tights"
  productSize  ProductSize
  quantity     Int         @default(1) // 1-5 per order
  pricePerUnit Decimal     @db.Decimal(10, 2) // 299 ILS at time of purchase
  totalPrice   Decimal     @db.Decimal(10, 2) // pricePerUnit * quantity

  // Timestamps
  createdAt    DateTime    @default(now())

  @@index([orderId])
  @@map("order_items")
}

// ============================================================================
// DISCOUNT CODE
// ============================================================================

enum DiscountType {
  PERCENTAGE    // e.g., 20% off
  FIXED_AMOUNT  // e.g., 50 ILS off

  @@map("discount_type")
}

model DiscountCode {
  id                String       @id @default(cuid())
  code              String       @unique // e.g., "LAUNCH50", case-insensitive in validation
  type              DiscountType
  value             Decimal      @db.Decimal(10, 2) // 20 (for 20%) or 50 (for 50 ILS)

  // Validity Period
  validFrom         DateTime     @default(now())
  validUntil        DateTime

  // Usage Limits
  usageLimit        Int?         // Nullable = unlimited usage
  usageCount        Int          @default(0) // Incremented on each order

  // Order Requirements
  minimumOrderValue Decimal?     @db.Decimal(10, 2) // Nullable = no minimum

  // Status
  isActive          Boolean      @default(true)

  // Relationships
  orders            Order[]

  // Timestamps
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  @@index([code])
  @@index([isActive])
  @@map("discount_codes")
}
```

---

## Entity Specifications

### AdminUser

**Purpose**: Stores admin credentials for dashboard access.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | Primary Key, CUID | Unique identifier |
| `username` | String | Unique, Not Null | Admin login username (e.g., "admin", "yifat") |
| `passwordHash` | String | Not Null | Bcrypt hash (salt rounds = 12) |
| `createdAt` | DateTime | Auto-generated | Account creation timestamp |
| `updatedAt` | DateTime | Auto-updated | Last password change timestamp |

**Validation Rules**:
- Username must be 3-50 characters, alphanumeric only
- Password must be hashed before storage (never store plaintext)
- Bcrypt salt rounds = 12 (secure but not too slow)

**Business Logic**:
- Only 1-2 admin users expected (Yifat + potential assistant)
- No role-based access control (all admins have full access)
- Password reset requires direct database access (manual process)

**Seed Data**:
```typescript
// prisma/seed.ts
await prisma.adminUser.create({
  data: {
    username: 'admin',
    passwordHash: await bcrypt.hash('CHANGE_ME_IN_PRODUCTION', 12)
  }
})
```

---

### Order

**Purpose**: Represents a customer purchase from product selection to delivery.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | Primary Key, CUID | Internal unique identifier |
| `orderNumber` | String | Unique, Not Null, Indexed | Customer-facing order number ("001", "002") |
| `customerName` | String | Not Null | Full name for shipping label |
| `customerEmail` | String | Not Null, Indexed | Email for order confirmation |
| `customerPhone` | String | Not Null | Phone for delivery contact / SMS |
| `shippingAddress` | String | Not Null | Street address |
| `shippingCity` | String | Not Null | City name |
| `shippingPostalCode` | String | Not Null | Postal code (Israeli format: 7 digits) |
| `shippingMethod` | ShippingMethod | Enum, Not Null | STANDARD_DELIVERY or SELF_PICKUP |
| `subtotal` | Decimal(10,2) | Not Null | Product total before discount/shipping |
| `shippingCost` | Decimal(10,2) | Not Null | 30.00 ILS or 0.00 ILS |
| `discountAmount` | Decimal(10,2) | Default 0 | Amount deducted by discount code |
| `total` | Decimal(10,2) | Not Null | Final amount: subtotal - discount + shipping |
| `status` | OrderStatus | Enum, Default PENDING_PAYMENT | Order fulfillment status |
| `paymentStatus` | PaymentStatus | Enum, Default PENDING | Payment processing status |
| `trackingNumber` | String? | Nullable | Shipping carrier tracking number |
| `discountCodeId` | String? | Foreign Key, Nullable | Reference to applied discount code |
| `createdAt` | DateTime | Auto-generated, Indexed | Order creation time |
| `updatedAt` | DateTime | Auto-updated | Last modification time |

**Validation Rules**:
- `customerEmail`: Valid email format (RFC 5322)
- `customerPhone`: Israeli phone format (10 digits: 05X-XXX-XXXX or 0X-XXX-XXXX)
- `shippingPostalCode`: 7 digits
- `subtotal`, `shippingCost`, `total`: Positive values only
- `orderNumber`: Sequential, auto-generated (use database sequence or app logic)

**Business Logic**:

**Order Number Generation**:
```typescript
// Generate next order number
const lastOrder = await prisma.order.findFirst({
  orderBy: { orderNumber: 'desc' }
})
const nextNumber = lastOrder
  ? String(parseInt(lastOrder.orderNumber) + 1).padStart(3, '0')
  : '001'
```

**Total Calculation**:
```typescript
total = subtotal - discountAmount + shippingCost

// Example: 299 - 50 + 30 = 279 ILS
```

**Shipping Cost Logic**:
```typescript
shippingCost = shippingMethod === 'SELF_PICKUP' ? 0 : 30
```

**State Transitions** (see diagram below):
```
PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED
                   ↓
                CANCELLED (any time before SHIPPED)
```

---

### OrderStatus Enum

**Valid States**:

| Status | Description | Triggers | Notifications |
|--------|-------------|----------|---------------|
| `PENDING_PAYMENT` | Order created, awaiting payment | Order submitted to Cardcom | None (internal state) |
| `PAID` | Payment confirmed by Cardcom | Cardcom callback with success | Email + SMS: Order confirmation |
| `PROCESSING` | Admin is preparing shipment | Admin updates status manually | None |
| `SHIPPED` | Package shipped with tracking | Admin adds tracking number + sets status | Email + SMS: Shipping notification |
| `DELIVERED` | Package delivered to customer | Admin marks as delivered (manual) | None (customer already received) |
| `CANCELLED` | Order cancelled | Admin cancels or payment fails | Email: Cancellation notice |

**State Transition Rules**:
```typescript
const allowedTransitions = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [], // Terminal state
  CANCELLED: []  // Terminal state
}
```

---

### PaymentStatus Enum

**Valid States**:

| Status | Description | Set By |
|--------|-------------|--------|
| `PENDING` | Waiting for Cardcom response | Initial order creation |
| `COMPLETED` | Payment successful | Cardcom callback (success) |
| `FAILED` | Payment declined or error | Cardcom callback (failure) |
| `REFUNDED` | Payment refunded to customer | Admin action (manual via Cardcom dashboard) |

**Relationship to OrderStatus**:
- `PaymentStatus.COMPLETED` → `OrderStatus.PAID`
- `PaymentStatus.FAILED` → `OrderStatus.CANCELLED`

---

### ShippingMethod Enum

**Valid Values**:

| Value | Cost | Description |
|-------|------|-------------|
| `STANDARD_DELIVERY` | 30 ILS | Delivery to customer address (3-5 business days) |
| `SELF_PICKUP` | 0 ILS | Pickup at Beer Sheva location (address provided separately) |

**Business Logic**:
- If `shippingMethod = SELF_PICKUP`, `shippingAddress` is still required (stored for customer records) but shipping cost = 0
- Admin dashboard shows "איסוף עצמי" indicator for pickup orders

---

### OrderItem

**Purpose**: Line items in an order (currently always 1 item = YL Sport Tights).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | Primary Key, CUID | Unique identifier |
| `orderId` | String | Foreign Key, Not Null, Indexed | Reference to parent order |
| `productName` | String | Not Null | "YL Sport Tights" (denormalized) |
| `productSize` | ProductSize | Enum, Not Null | S, M, L, or XL |
| `quantity` | Int | Default 1, Min 1, Max 5 | Number of units |
| `pricePerUnit` | Decimal(10,2) | Not Null | Price at purchase time (299 ILS) |
| `totalPrice` | Decimal(10,2) | Not Null | pricePerUnit × quantity |
| `createdAt` | DateTime | Auto-generated | Item creation time |

**Validation Rules**:
- `quantity`: 1 ≤ quantity ≤ 5
- `pricePerUnit`: Must be positive
- `totalPrice`: Must equal `pricePerUnit × quantity`

**Business Logic**:
- **Why denormalize `productName` and `pricePerUnit`?** Historical record. If product price changes in the future, old orders must show the price paid at the time.
- **Why no Product table?** Single product site. If expanding to multiple products, refactor to `Product` table and foreign key.

**Cascade Delete**:
- When `Order` is deleted, all associated `OrderItem` records are automatically deleted (`onDelete: Cascade`)

---

### ProductSize Enum

**Valid Values**:

| Size | Measurements (approx.) |
|------|------------------------|
| `S` | Bust: 84-88cm, Waist: 64-68cm, Hips: 90-94cm |
| `M` | Bust: 88-92cm, Waist: 68-72cm, Hips: 94-98cm |
| `L` | Bust: 92-96cm, Waist: 72-76cm, Hips: 98-102cm |
| `XL` | Bust: 96-100cm, Waist: 76-80cm, Hips: 102-106cm |

*Note: Measurements stored in frontend size guide component, not in database.*

---

### DiscountCode

**Purpose**: Promotional codes that reduce order total (percentage or fixed amount).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | Primary Key, CUID | Unique identifier |
| `code` | String | Unique, Not Null, Indexed | Coupon code (e.g., "LAUNCH50") |
| `type` | DiscountType | Enum, Not Null | PERCENTAGE or FIXED_AMOUNT |
| `value` | Decimal(10,2) | Not Null | 20 (for 20%) or 50 (for 50 ILS) |
| `validFrom` | DateTime | Default now() | Start of validity period |
| `validUntil` | DateTime | Not Null | End of validity period |
| `usageLimit` | Int? | Nullable | Max number of uses (null = unlimited) |
| `usageCount` | Int | Default 0 | Current number of uses |
| `minimumOrderValue` | Decimal(10,2)? | Nullable | Minimum subtotal required (null = no minimum) |
| `isActive` | Boolean | Default true, Indexed | Admin can deactivate code |
| `createdAt` | DateTime | Auto-generated | Code creation time |
| `updatedAt` | DateTime | Auto-updated | Last modification time |

**Validation Rules**:
- `code`: 3-20 characters, alphanumeric + hyphens/underscores, case-insensitive
- `value`: Positive number
  - If `type = PERCENTAGE`: 1 ≤ value ≤ 100
  - If `type = FIXED_AMOUNT`: value < typical order total (e.g., < 500 ILS)
- `validFrom` < `validUntil`
- `usageLimit`: If set, must be > 0
- `minimumOrderValue`: If set, must be > 0

**Business Logic**:

**Discount Validation** (when customer applies code):
```typescript
function validateDiscountCode(code: string, orderSubtotal: number): ValidationResult {
  const discount = await prisma.discountCode.findUnique({
    where: { code: code.toUpperCase() }
  })

  if (!discount) return { valid: false, error: "קוד לא קיים" }
  if (!discount.isActive) return { valid: false, error: "קוד לא פעיל" }

  const now = new Date()
  if (now < discount.validFrom) return { valid: false, error: "הקוד עדיין לא תקף" }
  if (now > discount.validUntil) return { valid: false, error: "הקוד פג תוקף" }

  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    return { valid: false, error: "הקוד הגיע למכסה" }
  }

  if (discount.minimumOrderValue && orderSubtotal < discount.minimumOrderValue) {
    return { valid: false, error: `סכום מינימלי: ${discount.minimumOrderValue} ₪` }
  }

  return { valid: true, discount }
}
```

**Discount Calculation**:
```typescript
function calculateDiscount(discount: DiscountCode, subtotal: number): number {
  if (discount.type === 'PERCENTAGE') {
    return Math.round((subtotal * discount.value / 100) * 100) / 100
  } else {
    return Math.min(discount.value, subtotal) // Can't discount more than subtotal
  }
}
```

**Usage Increment** (after successful order):
```typescript
await prisma.discountCode.update({
  where: { id: discountCodeId },
  data: { usageCount: { increment: 1 } }
})
```

---

### DiscountType Enum

**Valid Values**:

| Type | Example | Calculation |
|------|---------|-------------|
| `PERCENTAGE` | "20% off" → value = 20 | discount = subtotal × (value / 100) |
| `FIXED_AMOUNT` | "50 ILS off" → value = 50 | discount = value |

**Examples**:

| Code | Type | Value | Subtotal | Discount Amount |
|------|------|-------|----------|-----------------|
| LAUNCH50 | FIXED_AMOUNT | 50 | 299 ILS | 50 ILS → 249 ILS |
| SUMMER20 | PERCENTAGE | 20 | 299 ILS | 59.80 ILS → 239.20 ILS |
| VIP100 | FIXED_AMOUNT | 100 | 598 ILS (qty 2) | 100 ILS → 498 ILS |

---

## Database Indexes

**Indexes Defined**:

```prisma
// Order indexes (for performance)
@@index([orderNumber])     // Lookup by order number (customer search)
@@index([customerEmail])   // Lookup by email (customer support)
@@index([status])          // Filter orders by status (admin dashboard)
@@index([createdAt])       // Sort orders by date (admin dashboard)

// OrderItem indexes
@@index([orderId])         // Join to parent order (automatic FK index)

// DiscountCode indexes
@@index([code])            // Lookup by code (checkout validation)
@@index([isActive])        // Filter active codes (admin dashboard)
```

**Rationale**:
- `orderNumber`, `customerEmail`: Frequent lookups in customer support
- `status`: Admin dashboard filters (e.g., show only "PAID" orders)
- `createdAt`: Sorting orders by recency (default view: newest first)
- `code`, `isActive`: Discount validation and admin management

---

## Data Retention & Privacy

### Retention Policy

| Entity | Retention Period | Rationale |
|--------|------------------|-----------|
| Order, OrderItem | 7 years | Israeli tax law requires financial records retention |
| DiscountCode | Indefinite | Historical marketing data, safe to retain |
| AdminUser | Until account deleted | Active admin accounts |

### GDPR Compliance

**Right to Access**:
- Customers can request their order data via email
- Admin manually exports order data (no self-service portal)

**Right to Deletion**:
- After 7 years, orders can be anonymized (replace customer name/email/phone with "REDACTED")
- Keep order totals and product data for analytics

**Data Minimization**:
- No user accounts = no profile data collection
- Store only order-necessary information (name, email, phone, address)

### Security

**Sensitive Data**:
- `AdminUser.passwordHash`: Bcrypt with salt rounds = 12
- No credit card data stored (Cardcom handles all payment info)

**Access Control**:
- Database credentials in environment variables (never committed to Git)
- Neon connection string uses SSL (encrypted in transit)

---

## Migration Strategy

### Initial Schema Setup

```bash
# Initialize Prisma
npx prisma init

# Create initial migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed admin user
npx prisma db seed
```

### Schema Changes (Future)

**Example: Adding Product Catalog** (if expanding beyond single product):

```prisma
model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Decimal     @db.Decimal(10, 2)
  images      String[]
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  orderItems  OrderItem[]

  @@map("products")
}

// Update OrderItem
model OrderItem {
  // Add foreign key
  productId String?
  product   Product? @relation(fields: [productId], references: [id])

  // Keep denormalized fields for historical orders
  productName  String
  productSize  ProductSize
  // ...
}
```

**Migration Process**:
1. Add `Product` model and `productId` to `OrderItem` (nullable)
2. Run migration: `npx prisma migrate dev --name add-product-catalog`
3. Seed initial product (YL Sport Tights)
4. Update order creation logic to reference `Product.id`
5. Keep denormalized fields for backward compatibility

---

## Sample Data

### Seed Script

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await bcrypt.hash('ChangeMe123!', 12)
    }
  })
  console.log('✅ Admin user created:', admin.username)

  // Create sample discount codes
  const launch50 = await prisma.discountCode.upsert({
    where: { code: 'LAUNCH50' },
    update: {},
    create: {
      code: 'LAUNCH50',
      type: 'FIXED_AMOUNT',
      value: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: null, // Unlimited
      isActive: true
    }
  })
  console.log('✅ Discount code created:', launch50.code)

  const summer20 = await prisma.discountCode.upsert({
    where: { code: 'SUMMER20' },
    update: {},
    create: {
      code: 'SUMMER20',
      type: 'PERCENTAGE',
      value: 20,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      usageLimit: 100,
      minimumOrderValue: 200,
      isActive: true
    }
  })
  console.log('✅ Discount code created:', summer20.code)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

### Sample Order

```typescript
// Example order creation
const order = await prisma.order.create({
  data: {
    orderNumber: '001',
    customerName: 'שרה כהן',
    customerEmail: 'sarah@example.com',
    customerPhone: '050-123-4567',
    shippingAddress: 'רחוב הרצל 25',
    shippingCity: 'תל אביב',
    shippingPostalCode: '6522301',
    shippingMethod: 'STANDARD_DELIVERY',
    subtotal: 299,
    shippingCost: 30,
    discountAmount: 50,
    total: 279,
    status: 'PENDING_PAYMENT',
    paymentStatus: 'PENDING',
    items: {
      create: [
        {
          productName: 'YL Sport Tights',
          productSize: 'M',
          quantity: 1,
          pricePerUnit: 299,
          totalPrice: 299
        }
      ]
    },
    discountCode: {
      connect: { code: 'LAUNCH50' }
    }
  },
  include: {
    items: true,
    discountCode: true
  }
})
```

---

## TypeScript Type Generation

Prisma automatically generates TypeScript types:

```typescript
// Generated by Prisma Client
import { Order, OrderItem, DiscountCode, AdminUser } from '@prisma/client'

// Type for Order with relations
type OrderWithItems = Order & {
  items: OrderItem[]
  discountCode: DiscountCode | null
}

// Type for creating an order
import { Prisma } from '@prisma/client'
type OrderCreateInput = Prisma.OrderCreateInput
```

**Usage in Application**:

```typescript
// services/order.service.ts
import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function getOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      discountCode: true
    }
  })
  return order // Type: OrderWithItems | null
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status, updatedAt: new Date() }
  })
}
```

---

## Testing Considerations

### Unit Tests (Vitest)

Test business logic with mocked Prisma client:

```typescript
// services/discount.service.test.ts
import { describe, it, expect, vi } from 'vitest'
import { validateDiscountCode } from './discount.service'

describe('Discount Validation', () => {
  it('should reject expired discount code', async () => {
    // Mock Prisma query
    vi.mock('@prisma/client')

    const result = await validateDiscountCode('EXPIRED', 299)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('פג תוקף')
  })
})
```

### E2E Tests (Playwright)

Test with real database (test environment):

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test('customer can apply discount code', async ({ page }) => {
  await page.goto('/checkout')
  await page.fill('[name="discountCode"]', 'LAUNCH50')
  await page.click('button:has-text("החל")')

  await expect(page.locator('[data-testid="discount-applied"]'))
    .toHaveText('50 ₪ הנחה')
  await expect(page.locator('[data-testid="order-total"]'))
    .toHaveText('279 ₪')
})
```

---

## Performance Considerations

### Query Optimization

**N+1 Query Prevention**:
```typescript
// ❌ BAD: N+1 queries
const orders = await prisma.order.findMany()
for (const order of orders) {
  const items = await prisma.orderItem.findMany({
    where: { orderId: order.id }
  })
}

// ✅ GOOD: Single query with include
const orders = await prisma.order.findMany({
  include: { items: true }
})
```

**Pagination** (for admin dashboard):
```typescript
const pageSize = 20
const page = 1

const orders = await prisma.order.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
  include: { items: true }
})
```

### Connection Pooling

Neon handles connection pooling automatically, but configure Prisma for optimal performance:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Conclusion

This data model provides a **simple, scalable foundation** for the YL Sport Tights e-commerce site. Key strengths:

✅ **Type-safe**: Prisma generates TypeScript types, preventing runtime errors
✅ **Performant**: Indexes on frequently queried fields, efficient relationships
✅ **Auditable**: Timestamps on all entities, historical order data preserved
✅ **Compliant**: GDPR-ready, 7-year retention for tax law
✅ **Extensible**: Easy to add Product catalog or additional features in the future

**Next Steps**:
1. ✅ Data model defined (this document)
2. ⏭️ Create API contracts in `contracts/` directory
3. ⏭️ Create `quickstart.md` with database setup instructions
4. ⏭️ Implement Prisma schema and run initial migration

**Last Updated**: 2025-10-21
**Version**: 1.0.0
