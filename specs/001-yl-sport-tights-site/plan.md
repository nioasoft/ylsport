# Implementation Plan: YL Sport Tights E-Commerce Website

**Branch**: `001-yl-sport-tights-site` | **Date**: 2025-10-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/asafbenatia/Projects/YL-SPORT/specs/001-yl-sport-tights-site/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command.

## Summary

Build a focused, high-converting single-product e-commerce website for selling YL Sport Tights - premium neoprene women's sport tights designed by personal trainer Yifat Levi. The site targets Hebrew-speaking customers in Israel with a mobile-first approach, emphasizing trust-building through founder story, scientific product explanation, and customer testimonials. Complete purchase flow with Cardcom payment integration, admin dashboard for order management, discount code system, and automated email/SMS notifications.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode enabled, Node.js 18+ LTS
**Primary Dependencies**: Next.js 14 (App Router), React 18, Prisma 5.x, shadcn/ui components, TailwindCSS 3.x
**Storage**: Neon PostgreSQL (serverless)
**Testing**: Playwright (E2E critical paths), Vitest (unit tests for business logic)
**Target Platform**: Vercel (serverless deployment), Web browsers (mobile-first: Chrome, Safari, Firefox)
**Project Type**: Web application (Next.js full-stack)
**Performance Goals**: First Contentful Paint < 2s, Lighthouse score > 90 on all metrics, Core Web Vitals "Good"
**Constraints**: RTL Hebrew support, Israeli market (ILS currency, Hebrew locale), PCI compliance via Cardcom
**Scale/Scope**: Single product, <1000 concurrent users initially, 6 user stories (3 P1, 2 P2, 1 P3)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This section verifies compliance with the YL Sport Tights Constitution (.specify/memory/constitution.md v2.0.0).

**עקרון 1: פשטות ומיקוד (Simplicity & Focus)**
- [x] פיצ'ר תומך במוצר יחיד (לא מוסיף מוצרים נוספים)? **YES** - Entire site focuses on single product: YL Sport Tights
- [x] UI נשאר נקי ומינימליסטי (אין דיסטרקציות)? **YES** - Clean product-focused design, no catalog navigation
- [x] תהליך רכישה נשאר אינטואיטיבי (zero configuration)? **YES** - Simple flow: select size → checkout → payment
- [x] אין over-engineering (רק מה שצריך עכשיו)? **YES** - No inventory management, no user accounts, simple admin auth
- [x] כל אלמנט חדש מוצדק בצורך אמיתי? **YES** - All features map to explicit user stories in spec

**עקרון 2: ביצועים ונגישות (Performance & Accessibility)**
- [x] זמן טעינה יישאר מתחת ל-2 שניות? **YES** - FCP < 2s explicitly required (FR-068)
- [x] SEO לא נפגע (structured data, meta tags עודכנו)? **YES** - User Story 5 dedicated to SEO, Schema.org Product markup
- [x] נגישות WCAG 2.1 AA נשמרת? **YES** - SC-018 requires WCAG 2.1 AA compliance
- [x] מובייל-first approach מיושם? **YES** - FR-054 requires mobile-first design, 320px-2560px support
- [x] ציון Lighthouse צפוי להישאר > 90? **YES** - FR-067 requires Lighthouse 90+ on all metrics
- [x] תאימות דפדפנים נשמרת (95%)? **YES** - Spec assumes 60%+ mobile traffic, standard browser support

**עקרון 3: אמינות ומקצועיות (Trust & Professionalism)**
- [x] שקיפות מלאה (מחירים, משלוח, החזרות)? **YES** - FR-011 clear pricing, FR-014 shipping options, FR-058 return policy
- [x] אבטחת מידע לא נפגעה (HTTPS, encryption)? **YES** - FR-061 HTTPS enforced, FR-064 bcrypt passwords, FR-016a payment verification
- [x] פרטי תשלום לא נאגרים (Cardcom only)? **YES** - FR-065 explicitly prohibits local card storage
- [x] תמונות ותוכן נשארים אותנטיים? **YES** - FR-006 requires authentic testimonials, FR-005 Yifat's real story
- [x] ייצוג המאמנת (יפעת לוי) ברור? **YES** - FR-005 founder story with credentials, User Story 2 dedicated to trust
- [x] מידע קשר נגיש? **YES** - FR-060 requires footer with email, phone, address, social media

**עקרון 4: חוויית משתמש מעולה (Excellent UX)**
- [x] הסיפור של המוצר נשמר (בעיה → פיתרון → המלצות)? **YES** - User Story 2 covers benefits, science, testimonials
- [x] תמונות איכותיות (6 מינימום)? **YES** - FR-002 requires 6 high-quality images with zoom
- [x] CTA בולט וזמין (sticky "הוסף לעגלה")? **YES** - FR-052 requires sticky add-to-cart button
- [x] משוב מיידי לכל פעולה (<100ms)? **YES** - FR-053 requires visual feedback < 100ms
- [x] טפסים פשוטים (מינימום שדות, validation בזמן אמת)? **YES** - FR-013 real-time validation, FR-012 minimal required fields
- [x] תהליך רכישה < 3 דקות? **YES** - SC-002 requires < 2 minutes mobile checkout
- [x] אישורים נשלחים תוך דקה? **YES** - FR-019 email within 1 minute, FR-038/039 SMS notifications

**סטנדרטים טכניים**
- [x] קוד נקי (שמות ברורים, פונקציות קצרות, linting)? **YES** - TypeScript strict mode, ESLint/Prettier configured
- [x] ארכיטקטורה פשוטה (Next.js conventions, הפרדת concerns)? **YES** - App Router structure: app/, components/, lib/, services/
- [x] בדיקות קריטיות מתוכננות (checkout flow, forms, Cardcom)? **YES** - Playwright E2E for checkout, contract tests for APIs
- [x] תלויות מינימליות (shadcn/ui מועדף)? **YES** - shadcn/ui copy-paste components, minimal external deps

**חוקי עיצוב**
- [x] צבעים עומדים בפלטה (#F7D2D9 וגווניו)? **YES** - FR-051 specifies #F7D2D9 primary brand color
- [x] פונט עברי ברור (Assistant/Rubik)? **YES** - Spec mentions Assistant or Rubik for Hebrew
- [x] RTL מלא? **YES** - FR-050 requires full RTL throughout site
- [x] אלמנטים נגישים (contrast ratio, sizes)? **YES** - FR-048 ARIA labels, alt tags, semantic HTML

**אבטחה ופרטיות**
- [x] אחסון מינימלי של נתונים? **YES** - FR-060a stores only necessary newsletter emails
- [x] הצפנה לנתונים רגישים? **YES** - FR-064 bcrypt for passwords, FR-065a Cardcom IP whitelist
- [x] GDPR compliance אם נדרש? **YES** - FR-056 privacy policy mentions GDPR compliance
- [x] Cardcom בלבד לתשלומים? **YES** - FR-015/065 Cardcom payment gateway only

**תיעוד**
- [x] README מעודכן? **YES** - Plan includes documentation requirements
- [x] API endpoints מתועדים? **YES** - contracts/ directory with OpenAPI specs
- [x] changelog מעודכן? **YES** - Standard Git workflow with version tracking

**GATE DECISION**: ✅ **PASS** - Full compliance with constitution, no violations requiring justification

## Project Structure

### Documentation (this feature)

```
specs/001-yl-sport-tights-site/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (generated below)
├── data-model.md        # Phase 1 output (generated below)
├── quickstart.md        # Phase 1 output (generated below)
├── contracts/           # Phase 1 output (API contracts)
│   ├── orders-api.yaml
│   ├── discounts-api.yaml
│   ├── payment-api.yaml
│   └── admin-api.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - already generated)
```

### Source Code (repository root)

```
# Next.js 14 App Router structure (Web application)

app/
├── (customer)/                 # Customer-facing routes (no auth)
│   ├── layout.tsx             # RTL layout with Hebrew support
│   ├── page.tsx               # Homepage (product display)
│   ├── checkout/
│   │   └── page.tsx           # Checkout flow
│   ├── order-confirmation/
│   │   └── page.tsx           # Order confirmation
│   ├── privacy-policy/
│   │   └── page.tsx           # Privacy policy
│   ├── terms-of-service/
│   │   └── page.tsx           # Terms of service
│   ├── shipping-returns/
│   │   └── page.tsx           # Shipping & returns
│   ├── faq/
│   │   └── page.tsx           # FAQ
│   └── contact/
│       └── page.tsx           # Contact page
├── admin/                     # Admin dashboard (requires auth)
│   ├── layout.tsx             # Admin layout with auth middleware
│   ├── login/
│   │   └── page.tsx           # Admin login
│   ├── page.tsx               # Orders list (main dashboard)
│   ├── orders/
│   │   └── [id]/
│   │       └── page.tsx       # Order detail
│   ├── discounts/
│   │   └── page.tsx           # Discount management
│   └── analytics/
│       └── page.tsx           # Sales analytics (optional)
├── api/                       # API routes
│   ├── orders/
│   │   ├── route.ts           # POST create order, GET list orders (admin)
│   │   ├── [orderNumber]/
│   │   │   └── route.ts       # GET order details
│   │   └── [id]/
│   │       ├── status/
│   │       │   └── route.ts   # PATCH update status
│   │       └── tracking/
│   │           └── route.ts   # PATCH update tracking
│   ├── discounts/
│   │   ├── validate/
│   │   │   └── route.ts       # POST validate discount code
│   │   ├── route.ts           # GET list, POST create
│   │   └── [id]/
│   │       └── route.ts       # GET, PATCH, DELETE discount
│   ├── payment/
│   │   ├── cardcom-redirect/
│   │   │   └── route.ts       # GET redirect to Cardcom
│   │   ├── cardcom-callback/
│   │   │   └── route.ts       # POST Cardcom webhook
│   │   └── status/
│   │       └── [orderId]/
│   │           └── route.ts   # GET payment status
│   └── admin/
│       ├── login/
│       │   └── route.ts       # POST admin login
│       ├── logout/
│       │   └── route.ts       # POST admin logout
│       ├── session/
│       │   └── route.ts       # GET verify session
│       └── analytics/
│           └── route.ts       # GET sales analytics
├── layout.tsx                 # Root layout (global providers)
├── globals.css                # Global styles with TailwindCSS + RTL
├── sitemap.ts                 # Sitemap generation
├── robots.ts                  # Robots.txt generation
└── error.tsx                  # Global error boundary

components/
├── ui/                        # shadcn/ui components (copy-paste)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── textarea.tsx
│   └── toast.tsx
├── shared/                    # Shared layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LoadingSpinner.tsx
├── product/                   # Product display components
│   ├── ProductHero.tsx
│   ├── ProductGallery.tsx
│   ├── ProductBenefits.tsx
│   ├── NeopreneFabricStory.tsx
│   ├── ProductSpecifications.tsx
│   ├── SizeGuide.tsx
│   ├── SizeSelector.tsx
│   ├── AddToCartButton.tsx
│   ├── FounderStory.tsx
│   └── Testimonials.tsx
├── checkout/                  # Checkout flow components
│   ├── CartSummary.tsx
│   ├── ShippingForm.tsx
│   ├── DiscountCodeInput.tsx
│   └── PaymentButton.tsx
└── admin/                     # Admin dashboard components
    ├── OrdersTable.tsx
    ├── OrderDetailCard.tsx
    ├── SalesAnalytics.tsx
    ├── DiscountCodeForm.tsx
    └── DiscountCodesTable.tsx

lib/
├── prisma.ts                  # Prisma client singleton
├── cardcom.ts                 # Cardcom SDK wrapper
├── resend.ts                  # Resend email client
├── shlach-meser.ts            # "שלח מסר" SMS client
├── validation.ts              # Zod schemas for forms/API
├── utils.ts                   # Utility functions (cn, formatters)
├── cart.ts                    # Client-side cart state management
├── auth.ts                    # Admin auth middleware
└── seo.ts                     # SEO metadata generator

services/
├── order.service.ts           # Order creation, validation, status updates
├── discount.service.ts        # Discount validation, usage tracking
├── payment.service.ts         # Cardcom integration, token generation
├── notification.service.ts    # Email/SMS sending (Resend + שלח מסר)
└── analytics.service.ts       # Sales analytics calculations

types/
├── order.ts                   # Order-related TypeScript types
├── discount.ts                # Discount-related types
└── payment.ts                 # Payment-related types

emails/                        # React Email templates
├── order-confirmation.tsx     # Order confirmation email
└── shipping-notification.tsx  # Shipping notification email

prisma/
├── schema.prisma              # Database schema
├── migrations/                # Database migrations
└── seed.ts                    # Database seed script

tests/
├── e2e/                       # Playwright E2E tests
│   ├── checkout-flow.spec.ts  # Full purchase journey
│   └── admin-flow.spec.ts     # Admin order management
├── unit/                      # Vitest unit tests
│   ├── discount.test.ts       # Discount validation logic
│   └── order.test.ts          # Order calculations
└── fixtures/                  # Test fixtures and utilities

public/
├── images/                    # Product images, placeholders
│   ├── product/               # 6 product images
│   ├── founder/               # Yifat's photo
│   └── testimonials/          # Testimonial photos
└── favicon.ico

.env.example                   # Environment variables template
.env.local                     # Local environment (gitignored)
next.config.js                 # Next.js configuration
tailwind.config.ts             # TailwindCSS + RTL configuration
tsconfig.json                  # TypeScript configuration
package.json                   # Dependencies
```

**Structure Decision**: Selected **Next.js 14 App Router** full-stack web application structure. This provides server-side rendering for SEO, API routes for backend logic, and excellent performance with automatic code splitting. The App Router's route groups `(customer)` and `admin` provide clean separation between public and authenticated areas.

## Complexity Tracking

*No violations - Constitution Check passed fully*

This section is empty because all constitution checks passed without requiring justification. The project maintains simplicity principles:
- Single product focus (no multi-product complexity)
- Simple session-based admin auth (no OAuth2 over-engineering)
- No inventory management (product always available)
- Minimal dependencies (shadcn/ui copy-paste approach)
- Focused testing (critical paths only, not 100% coverage)
