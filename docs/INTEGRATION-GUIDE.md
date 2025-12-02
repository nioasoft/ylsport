# Israeli E-Commerce Integration Guide

A comprehensive technical guide for integrating Israeli payment gateways (Tranzila), SMS services (SendMsg/שלח מסר), and email notifications (Resend) in Next.js e-commerce projects.

**Last Updated:** December 2024
**Project Reference:** YL-Sport E-Commerce

---

## Table of Contents

1. [Environment Variables Overview](#environment-variables-overview)
2. [Tranzila Payment Gateway](#tranzila-payment-gateway)
3. [SendMsg SMS Service](#sendmsg-sms-service)
4. [Resend Email Service](#resend-email-service)
5. [Notification Service Architecture](#notification-service-architecture)
6. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
7. [Information to Request from Client](#information-to-request-from-client)

---

## Environment Variables Overview

```env
# =============================================================================
# TRANZILA PAYMENT GATEWAY
# =============================================================================
TRANZILA_API_HOST=https://api.tranzila.com
TRANZILA_TERMINAL_NAME=your_terminal_name     # From Tranzila dashboard
TRANZILA_PUBLIC_KEY=your_public_key           # App Key from Tranzila
TRANZILA_PRIVATE_KEY=your_private_key         # Secret Key from Tranzila

# =============================================================================
# SENDMSG SMS SERVICE (שלח מסר)
# =============================================================================
SENDMSG_SITE_ID=123456                        # Account ID (מספר חשבון)
SENDMSG_API_PASSWORD=your_api_password        # API password
SENDMSG_SENDER_NAME=YLSport                   # Max 11 chars, English only
SKIP_SMS_SEND=false                           # Set to 'true' to disable SMS in dev

# =============================================================================
# RESEND EMAIL SERVICE
# =============================================================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx            # API key from Resend dashboard
RESEND_FROM_EMAIL=YL Sport <noreply@yl-sport.co.il>  # Verified sender
RESEND_REPLY_TO_EMAIL=info@yl-sport.co.il     # Optional reply-to address

# =============================================================================
# GENERAL
# =============================================================================
NEXT_PUBLIC_SITE_URL=https://www.yl-sport.co.il
ADMIN_EMAIL=admin@example.com                 # For order notifications
```

---

## Tranzila Payment Gateway

### Overview

Tranzila is an Israeli payment gateway supporting credit card payments. We use their **Payment Request (PR)** API to create payment links that redirect customers to a secure Tranzila-hosted payment page.

### API Documentation

- Official Docs: https://docs.tranzila.com
- API Host: `https://api.tranzila.com`
- Main Endpoint: `POST /v1/pr/create` (Create Payment Request)

### Authentication

Tranzila uses HMAC-SHA256 authentication with 4 headers:

```typescript
private generateAuthHeaders(): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = randomBytes(40).toString('hex');

  // HMAC-SHA256(app_key, secret + timestamp + nonce)
  const accessKey = createHmac('sha256', this.secret + timestamp + nonce)
    .update(this.appKey)
    .digest('hex');

  return {
    'Content-Type': 'application/json',
    'X-tranzila-api-app-key': this.appKey,
    'X-tranzila-api-request-time': timestamp.toString(),
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': accessKey,
  };
}
```

### Creating a Payment Request

```typescript
const payload = {
  terminal_name: 'your_terminal',
  action_type: 2,                    // Payment request
  response_language: 'hebrew',
  request_currency: 'ILS',
  request_vat: 17,                   // Israeli VAT
  payments_number: 1,
  created_by_user: 'website',
  payment_plans: [1],                // Regular payment
  payment_methods: [1],              // Credit card

  // CRITICAL: IPN callback URL - Tranzila POSTs here after payment
  ipn_url: 'https://yoursite.com/api/payment/tranzila-callback',

  // Order identification - stored in database, used to find order in callback
  order_id: 'ORDER-12345',

  // Success/fail redirect URLs (where customer goes after payment)
  success_url: 'https://yoursite.com/order/confirmation',
  fail_url: 'https://yoursite.com/checkout?payment=failed',

  // Customer info
  client: {
    name: 'Customer Name',
    contact_person: 'Customer Name',
    email: 'customer@email.com',
    phone_country_code: '972',
    phone_area_code: '50',           // Without leading 0
    phone_number: '1234567',
    id: '000000000',                 // Israeli ID or placeholder
  },

  // Items
  items: [{
    id: 1,
    code: 'ITEM-001',
    name: 'Product Name',
    unit_price: 100.00,
    type: 'I',                       // I = Item
    units_number: 1,
    unit_type: 1,
    price_type: 'G',
    currency_code: 'ILS',
  }],

  // IMPORTANT: Merchant name shown on payment page
  payment_label: 'YL Sport',

  // Optional: Enable receipt generation
  create_document: true,
  document_type: 'receipt',
};
```

### Handling Payment Callback (IPN)

Tranzila sends a callback to your `ipn_url` after payment. It can be:
- **POST** with `application/x-www-form-urlencoded` body
- **POST** with `application/json` body
- **GET** with query parameters

**IMPORTANT:** Handle ALL formats:

```typescript
// app/api/payment/tranzila-callback/route.ts

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  let callbackData: Record<string, string> = {};

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    formData.forEach((value, key) => {
      callbackData[key] = value.toString();
    });
  } else if (contentType.includes("application/json")) {
    callbackData = await request.json();
  } else {
    // Query string format: key1=value1&key2=value2
    const text = await request.text();
    const params = new URLSearchParams(text);
    params.forEach((value, key) => {
      callbackData[key] = value;
    });
  }

  return processCallback(callbackData);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackData: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    callbackData[key] = value;
  });
  return processCallback(callbackData);
}
```

### Callback Data Validation (Zod Schema)

```typescript
export const tranzilaCallbackSchema = z.object({
  Response: z.string(),              // "000" = success
  ConfirmationCode: z.string().optional(),
  pr_id: z.string(),                 // Payment request ID (use to find order)
  sum: z.coerce.number(),            // Amount paid
  currency: z.string().optional().default("1"),
  index: z.string().optional(),      // Transaction index
  ccno: z.string().optional(),       // Last 4 digits of card
  // ... more optional fields
}).passthrough();
```

### Response Codes

```typescript
const TRANZILA_RESPONSE_CODES: Record<string, string> = {
  '000': 'תשלום אושר בהצלחה',      // SUCCESS
  '001': 'כרטיס חסום - יש להחרים',
  '004': 'סירוב',
  '006': 'CVV שגוי',
  '033': 'כרטיס לא בתוקף',
  '036': 'פג תוקף',
  // ... see full list in lib/tranzila.ts
};
```

### Payment Flow

```
1. Customer completes checkout form
2. Frontend calls POST /api/orders to create order (status: PENDING_PAYMENT)
3. Backend creates Tranzila payment request, saves pr_id to order
4. Backend returns payment_url to frontend
5. Frontend redirects customer to payment_url
6. Customer pays on Tranzila page
7. Tranzila calls ipn_url (your callback)
8. Your callback verifies payment (Response === '000')
9. Update order status to PAID, send notifications
10. Customer redirected to success_url
```

### Apple Pay Integration

Apple Pay is supported through Tranzila's payment page. No code changes required in your application - it works automatically on the Tranzila payment page.

#### Requirements

1. **Domain Verification File** - Apple requires a verification file on your domain
2. **Tranzila Approval** - Tranzila must approve your domain for Apple Pay

#### Setup Steps

1. **Download verification file:**
   ```bash
   curl -sL "https://api.tranzila.com/assets/apple_pay/merchant_authentication_file.zip" -o /tmp/apple_pay_file.zip
   unzip /tmp/apple_pay_file.zip -d public/.well-known/
   ```

2. **Deploy to make file accessible:**
   The file must be accessible at:
   ```
   https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association
   ```

3. **Verify file is accessible:**
   ```bash
   curl -sI "https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association"
   # Should return HTTP 200
   ```

4. **Contact Tranzila Support:**
   Email Tranzila to approve your domain for Apple Pay:
   - Subject: "הפעלת Apple Pay לדומיין [yourdomain.com]"
   - Include: Terminal name, domain, confirmation that verification file is deployed

#### How It Works

- Apple Pay button appears **automatically** on Tranzila payment page
- Only visible on supported devices (iPhone, iPad, Mac with Touch ID/Face ID)
- No additional integration code needed
- Payment flow remains the same

#### Key Files

- `public/.well-known/apple-developer-merchantid-domain-association` - Apple verification file

#### Troubleshooting

| Issue | Solution |
|-------|----------|
| Apple Pay button not showing | Only shows on supported Apple devices |
| 404 on verification file | Verify file exists in `public/.well-known/` and deployed |
| File accessible but Apple Pay not working | Contact Tranzila - they need to approve your domain |

#### Documentation

- Tranzila Apple Pay Guide: https://docs.tranzila.com/docs/payments-billing/795m2yi7q4nmq-iframe-integration
- Apple Pay on the Web: https://developer.apple.com/documentation/apple_pay_on_the_web

### Automatic Document Generation (Invoices/Receipts)

Tranzila can automatically generate documents (invoices, receipts) after successful payment.

#### Document Types

| Code | Type | Hebrew |
|------|------|--------|
| 1 | Receipt | קבלה |
| 2 | Tax Invoice | חשבונית מס |
| 3 | Tax Invoice Receipt | חשבונית מס קבלה |

#### Configuration

In the payment request payload:

```typescript
const payload = {
  // ... other fields ...

  // Enable automatic document generation
  create_document: true,
  document_type: 3,  // 3 = חשבונית מס קבלה (most common for e-commerce)

  // ... other fields ...
};
```

#### How It Works

1. Customer completes payment on Tranzila page
2. On successful payment (Response === '000'), Tranzila auto-generates the document
3. Document is available in Tranzila merchant dashboard
4. If `send_email` is configured, document link may be included in payment confirmation

#### Requirements

- **Business Registration** - Must have עוסק מורשה status for tax invoices
- **VAT Settings** - `request_vat: 17` (Israeli VAT 17%)
- **Client Details** - For proper invoicing, provide complete client info:
  ```typescript
  client: {
    name: 'Customer Name',
    id: '123456789',  // Israeli ID (ת.ז.)
    email: 'customer@email.com',
    // address fields if needed
  }
  ```

#### Viewing Documents

1. Log into Tranzila dashboard
2. Go to "מסמכים" or "תיעוד"
3. Find document by transaction ID or date

#### Notes

- Document generation is handled entirely by Tranzila - no additional code needed
- Documents are stored in Tranzila's system
- For accounting integration, export from Tranzila dashboard
- If document not generated, check Tranzila dashboard settings

---

## SendMsg SMS Service

### Overview

SendMsg (שלח מסר) is an Israeli SMS provider. Uses REST API with token-based authentication.

### API Documentation

- Docs: https://sendmsgapi.docs.apiary.io/
- Base URL: `https://gconvertrest.sendmsg.co.il/api/sendMsg`

### Authentication Flow

1. **Get Token** - POST `/token/`
2. Token valid for 12 hours
3. Use token in `Authorization` header for subsequent requests

```typescript
async function getToken(): Promise<string | null> {
  const response = await fetch(
    "https://gconvertrest.sendmsg.co.il/api/sendMsg/token/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        SiteID: parseInt(config.siteId),  // MUST be number, not string
        Password: config.apiPassword,
      }),
    }
  );

  const data = await response.json();

  // Success codes: 200 or 10000
  if (data.ResultCode === 200 || data.ResultCode === 10000) {
    return data.token || data.Token;
  }
  return null;
}
```

### Sending SMS

```typescript
async function sendSMS(to: string, message: string) {
  const token = await getToken();

  const response = await fetch(
    "https://gconvertrest.sendmsg.co.il/api/sendMsg/addUsersAndSendSms",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",  // UTF-8 for Hebrew!
        "Authorization": token,
      },
      body: JSON.stringify({
        users: [{ Cellphone: formatPhone(to) }],
        Message: {
          MessageContent: message,
          SenderPhone: "0559377896",    // Verified sender number
          MessageInnerName: `SMS_${Date.now()}`,
          MessageSubject: "",
          MessageType: 1,
          TypeSms: 1,                   // 1 = Short SMS (70 Hebrew chars)
        },
      }),
    }
  );

  const data = await response.json();
  return data.success === true || data.res === true;
}
```

### Phone Number Formatting

Israeli mobile numbers must be in local format (05XXXXXXXX):

```typescript
function formatPhoneForSMS(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  // International (9725...) → Local
  if (digitsOnly.startsWith("972") && digitsOnly.length === 12) {
    return "0" + digitsOnly.substring(3);
  }

  // Already local format
  if (digitsOnly.startsWith("05") && digitsOnly.length === 10) {
    return digitsOnly;
  }

  return digitsOnly;
}

function isValidPhoneForSMS(phone: string): boolean {
  const formatted = formatPhoneForSMS(phone);
  return /^05\d{8}$/.test(formatted);
}
```

### SMS Message Length

**CRITICAL:** Hebrew SMS has different character limits:

- **Short SMS (TypeSms: 1):** ~70 Hebrew characters
- **Long SMS (TypeSms: 2):** Requires separate credit package

Always keep messages short:

```typescript
// Good - fits in one SMS
const message = `${firstName}, הזמנה ${orderNumber} התקבלה! סה"כ ${total}₪ YL Sport`;

// Bad - too long, will fail or be truncated
const message = `שלום ${fullName}, תודה על הזמנתך באתר YL Sport! הזמנה מספר ${orderNumber} התקבלה בהצלחה. סכום הרכישה: ${total}₪. ניצור איתך קשר בקרוב.`;
```

### Development Mode

Skip SMS in development:

```typescript
if (process.env.SKIP_SMS_SEND === "true") {
  console.log("SMS SKIP MODE - Would send:", request);
  return { success: true, messageId: `skip-${Date.now()}` };
}
```

---

## Resend Email Service

### Overview

Resend is a modern email API. We use React Email for beautiful, maintainable templates.

### Setup

```bash
npm install resend @react-email/components
```

### Email Templates with React Email

Create templates in `emails/` directory:

```tsx
// emails/order-confirmation.tsx
import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Section, Text
} from "@react-email/components";

export function OrderConfirmationEmail(data: OrderData) {
  return (
    <Html dir="rtl" lang="he">        {/* RTL for Hebrew! */}
      <Head />
      <Preview>הזמנה {data.orderNumber} התקבלה</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>ההזמנה התקבלה!</Heading>
          <Text style={text}>שלום {data.customerName},</Text>
          {/* ... rest of template */}
        </Container>
      </Body>
    </Html>
  );
}

// CRITICAL: RTL styles for Hebrew
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '...',
  direction: "rtl" as const,       // RTL direction
};

const container = {
  margin: "0 auto",
  direction: "rtl" as const,
};

const text = {
  textAlign: "right" as const,     // Right-aligned text
};
```

### Sending Emails

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderConfirmationEmail(data: OrderData) {
  const { OrderConfirmationEmail } = await import("@/emails/order-confirmation");

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "YL Sport <noreply@yl-sport.co.il>",
    to: data.to,
    subject: `אישור הזמנה ${data.orderNumber} - YL Sport`,
    react: OrderConfirmationEmail(data),
    // Only include reply_to if valid
    ...(isValidEmail(config.replyTo) && { reply_to: config.replyTo }),
  });

  return result.error ? { success: false, error: result.error.message }
                      : { success: true, messageId: result.data?.id };
}
```

### Email Types for E-Commerce

1. **Order Confirmation** - Sent to customer after successful payment
2. **Shipping Notification** - Sent when tracking number is added
3. **Admin Notification** - Sent to admin for each new order
4. **Newsletter Confirmation** - Sent when user subscribes

---

## Notification Service Architecture

### Centralized Service Pattern

Create a single notification service that coordinates email + SMS:

```typescript
// services/notification.service.ts

export async function sendShippingNotification(
  order: Order & { items: OrderItem[] }
): Promise<NotificationResult> {
  const results = {
    success: false,
    emailSent: false,
    smsSent: false,
    errors: [] as string[],
  };

  // Validate required fields
  if (!order.trackingNumber) {
    results.errors.push("Order missing tracking number");
    return results;
  }

  // Send email
  try {
    const emailResult = await sendOrderStatusUpdateEmail({
      to: order.customerEmail,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      newStatus: "SHIPPED",
      trackingNumber: order.trackingNumber,
    });
    results.emailSent = emailResult.success;
    if (!emailResult.success) {
      results.errors.push(`Email failed: ${emailResult.error}`);
    }
  } catch (error) {
    results.errors.push(`Email error: ${error.message}`);
  }

  // Send SMS
  try {
    const smsResult = await sendShippingSMS({
      phone: order.customerPhone,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      customerName: order.customerName,
    });
    results.smsSent = smsResult.success;
    if (!smsResult.success) {
      results.errors.push(`SMS failed: ${smsResult.error}`);
    }
  } catch (error) {
    results.errors.push(`SMS error: ${error.message}`);
  }

  // Success if at least one notification sent
  results.success = results.emailSent || results.smsSent;
  return results;
}
```

### Fire-and-Forget Pattern

For faster API responses, send notifications in background:

```typescript
// In API route
const updatedOrder = await prisma.order.update({ ... });

// Fire-and-forget - don't await
sendShippingNotification(updatedOrder)
  .then((result) => {
    if (result.success) {
      console.log(`✅ Notifications sent for ${updatedOrder.orderNumber}`);
    } else {
      console.error(`⚠️ Notification issues:`, result.errors);
    }
  })
  .catch((error) => {
    console.error("Failed to send notification:", error);
  });

// Return immediately
return NextResponse.json({ success: true, message: "עודכן בהצלחה" });
```

---

## Common Pitfalls & Solutions

### 1. Tranzila IPN Not Received

**Problem:** Tranzila callback never reaches your server.

**Solutions:**
- IPN URL must be publicly accessible (not localhost)
- Use production URL even in staging:
  ```typescript
  const ipnUrl = siteUrl.includes('localhost')
    ? 'https://production.com/api/payment/callback'
    : `${siteUrl}/api/payment/callback`;
  ```
- Check Vercel logs for incoming requests
- Verify HTTPS is working

### 2. Duplicate Notifications

**Problem:** Customer receives multiple emails/SMS for same event.

**Solutions:**
- Check order status before processing callback:
  ```typescript
  if (order.paymentStatus === "COMPLETED") {
    return NextResponse.json({ success: true, message: "Already processed" });
  }
  ```
- For shipping: Only send notification when status actually changes:
  ```typescript
  if (status === "SHIPPED" && order.status !== "SHIPPED" && trackingNumber) {
    await sendShippingNotification(order);
  }
  ```

### 3. Hebrew SMS Truncated

**Problem:** SMS message cuts off or shows garbage characters.

**Solutions:**
- Keep messages under 70 characters for Hebrew
- Use `TypeSms: 1` (short SMS)
- Set `Content-Type: application/json; charset=utf-8`
- Use first name only, not full name

### 4. Email reply_to Validation Error

**Problem:** Resend rejects email with invalid reply_to.

**Solution:** Only include if valid:
```typescript
const emailPayload = {
  from: config.from,
  to: data.to,
  subject: subject,
  react: Template(data),
};

// Add reply_to only if valid
if (config.replyTo && config.replyTo.trim() && config.replyTo.includes('@')) {
  emailPayload.reply_to = config.replyTo.trim();
}

await resend.emails.send(emailPayload);
```

### 5. Tranzila Amount Mismatch

**Problem:** Payment verification fails due to amount difference.

**Solution:** Allow small tolerance for rounding:
```typescript
const paidAmount = callbackData.sum;
if (Math.abs(paidAmount - expectedAmount) > 0.01) {
  return { success: false, message: 'Amount mismatch' };
}
```

### 6. RTL Email Layout Broken

**Problem:** Hebrew email text appears left-aligned or reversed.

**Solution:** Add RTL to all container elements:
```tsx
<Html dir="rtl" lang="he">
<Body style={{ direction: "rtl" as const }}>
<Container style={{ direction: "rtl" as const }}>
<Text style={{ textAlign: "right" as const }}>
```

### 7. SendMsg Token Expired

**Problem:** SMS fails with authentication error mid-session.

**Solution:** Implement token caching with refresh:
```typescript
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken() {
  // Return cached if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Get new token
  const token = await fetchNewToken();
  cachedToken = token;
  tokenExpiry = Date.now() + 11 * 60 * 60 * 1000; // 11 hours
  return token;
}
```

### 8. Order Not Found in Callback

**Problem:** Tranzila callback can't find order.

**Solution:** Store `pr_id` (Tranzila's payment request ID) when creating payment:
```typescript
// When creating order
const order = await prisma.order.create({
  data: {
    ...orderData,
    tranzilaPaymentId: tranzilaResponse.transaction_id, // pr_id
  },
});

// In callback, find by pr_id
const order = await prisma.order.findUnique({
  where: { tranzilaPaymentId: callbackData.pr_id },
});
```

---

## Information to Request from Client

### Tranzila Setup

Ask the client to provide from their Tranzila dashboard:

1. **Terminal Name** (שם המסוף) - Usually their business name
2. **Public Key** (App Key) - For API authentication
3. **Private Key** (Secret Key) - For HMAC signature
4. **Verified Domain** - Must whitelist your callback URL

### SendMsg Setup

Ask the client to provide:

1. **Site ID** (מספר חשבון) - Numeric account ID
2. **API Password** - Different from login password
3. **Verified Sender Number** - A phone number verified in their account
4. **SMS Credits** - Ensure they have sufficient credits

### Resend Setup

You'll need to set up:

1. **Resend Account** - Sign up at resend.com
2. **Domain Verification** - Add DNS records for sender domain
3. **API Key** - Generate in Resend dashboard

### Domain/DNS Requirements

For emails to work properly:
- Add SPF record for Resend
- Add DKIM records for Resend
- Verify domain in Resend dashboard

---

## File Structure Reference

```
project/
├── lib/
│   ├── tranzila.ts           # Tranzila SDK class
│   ├── sendmsg.ts            # SendMsg API client
│   ├── sms-templates.ts      # SMS message templates
│   ├── resend.ts             # Email sending functions
│   └── validation.ts         # Zod schemas
├── services/
│   └── notification.service.ts  # Unified notification service
├── emails/
│   ├── order-confirmation.tsx   # React Email templates
│   ├── order-status-update.tsx
│   └── admin-order-notification.tsx
├── app/api/
│   ├── orders/
│   │   └── route.ts          # Create order
│   └── payment/
│       └── tranzila-callback/
│           └── route.ts      # Payment IPN handler
└── .env.local                # Environment variables
```

---

## Quick Start Checklist

- [ ] Get Tranzila credentials from client
- [ ] Get SendMsg credentials from client
- [ ] Set up Resend account and verify domain
- [ ] Add all environment variables
- [ ] Create payment callback route
- [ ] Create email templates (RTL!)
- [ ] Create SMS templates (short!)
- [ ] Implement notification service
- [ ] Test payment flow end-to-end
- [ ] Test SMS delivery
- [ ] Test email delivery (check spam)
- [ ] Verify production callback URL is reachable

---

## Testing Commands

```bash
# Test SMS (skip mode)
SKIP_SMS_SEND=true npm run dev

# Preview emails
npx react-email dev

# Check environment variables
node -e "console.log(!!process.env.TRANZILA_TERMINAL_NAME)"
```
