# Tasks: YL Sport Tights E-Commerce Website

**Feature Branch**: `001-yl-sport-tights-site`
**Input**: Design documents from `/Users/asafbenatia/Projects/YL-SPORT/specs/001-yl-sport-tights-site/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are OPTIONAL and not included in this task list (critical-path testing over comprehensive coverage per constitution)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js 14 project with TypeScript, App Router, and TailwindCSS at repository root
- [ ] T002 [P] Configure ESLint and Prettier with TypeScript strict mode in tsconfig.json
- [ ] T003 [P] Install core dependencies: next@14.2.0, react@18.3.0, prisma@5.14.0, tailwindcss@3.4.0, zod@3.23.0
- [ ] T004 [P] Install shadcn/ui dependencies: @radix-ui/react-*, tailwind-merge, class-variance-authority
- [ ] T005 [P] Install Resend SDK (resend@3.2.0) and react-email@2.1.0 for email templates
- [ ] T006 [P] Configure TailwindCSS with RTL plugin (tailwindcss-rtl@0.9.0) in tailwind.config.ts
- [ ] T007 [P] Set up Next.js configuration with RTL support and image optimization in next.config.js
- [ ] T008 Create project structure: app/, components/, lib/, services/, types/, prisma/, tests/, public/
- [ ] T009 [P] Create .env.example with all required environment variables (DATABASE_URL, CARDCOM_*, RESEND_*, ADMIN_*)
- [ ] T010 [P] Initialize git repository and create .gitignore (exclude .env.local, node_modules, .next)
- [ ] T011 [P] Create root layout with Hebrew RTL support in app/layout.tsx
- [ ] T012 [P] Configure global styles with TailwindCSS and RTL overrides in app/globals.css
- [ ] T013 [P] Add brand colors (Primary: #00BFA6 Teal, Accent: #FF6B6B Coral, Secondary: #E0F7F4) to TailwindCSS config

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & ORM Setup

- [ ] T014 Create Prisma schema with AdminUser, Order, OrderItem, DiscountCode models in prisma/schema.prisma
- [ ] T015 Define enums: OrderStatus, PaymentStatus, ShippingMethod, ProductSize, DiscountType in Prisma schema
- [ ] T016 Add indexes for performance: orderNumber, customerEmail, status, createdAt on Order model
- [ ] T017 Create initial Prisma migration with `npx prisma migrate dev --name init`
- [ ] T018 Create Prisma client singleton in lib/prisma.ts with connection pooling
- [ ] T019 Create database seed script in prisma/seed.ts with admin user and sample discount codes

### Core Services & Utilities

- [ ] T020 [P] Create Zod validation schemas for forms and API in lib/validation.ts
- [ ] T021 [P] Create utility functions (cn, formatters) in lib/utils.ts
- [ ] T022 [P] Create Cardcom payment gateway SDK wrapper in lib/cardcom.ts
- [ ] T023 [P] Create Resend email client configuration in lib/resend.ts
- [ ] T024 [P] Create TypeScript type definitions in types/order.ts, types/discount.ts, types/payment.ts

### Base Components (shadcn/ui)

- [ ] T025 [P] Copy shadcn/ui Button component to components/ui/button.tsx
- [ ] T026 [P] Copy shadcn/ui Card component to components/ui/card.tsx
- [ ] T027 [P] Copy shadcn/ui Input component to components/ui/input.tsx
- [ ] T028 [P] Copy shadcn/ui Select component to components/ui/select.tsx
- [ ] T029 [P] Copy shadcn/ui Textarea component to components/ui/textarea.tsx
- [ ] T030 [P] Copy shadcn/ui Toast component to components/ui/toast.tsx

### Shared Components

- [ ] T031 [P] Create Header component with logo and navigation in components/shared/Header.tsx
- [ ] T032 [P] Create Footer component with contact info, legal links, social media in components/shared/Footer.tsx
- [ ] T033 [P] Create LoadingSpinner component in components/shared/LoadingSpinner.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Purchase Journey (Priority: P1) 🎯 MVP

**Goal**: Enable customers to discover product, select size, complete checkout with payment, and receive order confirmation

**Independent Test**: Visit homepage → view product → select size → checkout with test payment → receive confirmation email

### Implementation for User Story 1

#### Homepage & Product Display

- [ ] T034 [P] [US1] Create ProductHero component with main image, headline, price, CTA in components/product/ProductHero.tsx
- [ ] T035 [P] [US1] Create ProductGallery component with 6 images and zoom in components/product/ProductGallery.tsx
- [ ] T036 [P] [US1] Create SizeSelector component with S/M/L/XL and size guide in components/product/SizeSelector.tsx
- [ ] T037 [P] [US1] Create AddToCartButton component with sticky behavior in components/product/AddToCartButton.tsx
- [ ] T038 [US1] Create homepage route in app/(customer)/page.tsx integrating all product components

#### Checkout Flow

- [ ] T039 [P] [US1] Create CartSummary component showing product, size, price, shipping in components/checkout/CartSummary.tsx
- [ ] T040 [P] [US1] Create ShippingForm component with validation (name, phone, email, address, city, postal code) in components/checkout/ShippingForm.tsx
- [ ] T041 [P] [US1] Create DiscountCodeInput component with real-time validation in components/checkout/DiscountCodeInput.tsx
- [ ] T042 [P] [US1] Create PaymentButton component for Cardcom redirect in components/checkout/PaymentButton.tsx
- [ ] T043 [US1] Create checkout route in app/(customer)/checkout/page.tsx integrating checkout components
- [ ] T044 [US1] Implement client-side cart state management with localStorage in lib/cart.ts

#### Order API

- [ ] T045 [US1] Implement POST /api/orders endpoint for order creation in app/api/orders/route.ts
- [ ] T046 [US1] Implement GET /api/orders/[orderNumber] endpoint for order details in app/api/orders/[orderNumber]/route.ts
- [ ] T047 [US1] Create order service with order creation, validation, discount application in services/order.service.ts

#### Discount Validation API

- [ ] T048 [US1] Implement POST /api/discounts/validate endpoint for real-time discount validation in app/api/discounts/validate/route.ts
- [ ] T049 [US1] Create discount service with validation logic, usage tracking in services/discount.service.ts

#### Payment Integration

- [ ] T050 [US1] Implement GET /api/payment/cardcom-redirect endpoint for Cardcom redirect in app/api/payment/cardcom-redirect/route.ts
- [ ] T051 [US1] Implement POST /api/payment/cardcom-callback endpoint for payment callback in app/api/payment/cardcom-callback/route.ts
- [ ] T052 [US1] Implement GET /api/payment/status/[orderId] endpoint for payment status polling in app/api/payment/status/[orderId]/route.ts
- [ ] T053 [US1] Create payment service with Cardcom integration, token generation, callback handling in services/payment.service.ts

#### Order Confirmation

- [ ] T054 [US1] Create order confirmation page in app/(customer)/order-confirmation/page.tsx
- [ ] T055 [US1] Create email confirmation template with React Email in emails/order-confirmation.tsx
- [ ] T056 [US1] Create notification service with email sending (Resend), SMS stub in services/notification.service.ts
- [ ] T057 [US1] Integrate email/SMS notifications on successful payment in payment callback handler

#### Customer Layout & Styling

- [ ] T058 [US1] Create customer layout with RTL support in app/(customer)/layout.tsx
- [ ] T059 [US1] Add responsive design breakpoints and mobile-first styles for all customer components
- [ ] T060 [US1] Test Hebrew font rendering (Assistant or Rubik) across all customer pages

**Checkpoint**: User Story 1 complete - full purchase flow functional and testable independently

---

## Phase 4: User Story 2 - Product Discovery & Trust Building (Priority: P1)

**Goal**: Build trust through product benefits, founder story, testimonials, and scientific explanations

**Independent Test**: Navigate homepage sections → verify all content displays in Hebrew RTL with proper formatting

### Implementation for User Story 2

#### Product Information Components

- [ ] T061 [P] [US2] Create ProductBenefits component with 4 benefit cards and icons in components/product/ProductBenefits.tsx
- [ ] T062 [P] [US2] Create NeopreneFabricStory component with scientific explanation in components/product/NeopreneFabricStory.tsx
- [ ] T063 [P] [US2] Create ProductSpecifications component with fabric composition, care instructions in components/product/ProductSpecifications.tsx
- [ ] T064 [P] [US2] Create SizeGuide component with measurements table and recommendations in components/product/SizeGuide.tsx

#### Founder Story & Social Proof

- [ ] T065 [P] [US2] Create FounderStory component with Yifat's photo, credentials, narrative in components/product/FounderStory.tsx
- [ ] T066 [P] [US2] Create Testimonials component with 4-6 customer testimonials and ratings in components/product/Testimonials.tsx

#### Homepage Integration

- [ ] T067 [US2] Integrate ProductBenefits, NeopreneFabricStory, FounderStory, Testimonials into homepage (app/(customer)/page.tsx)
- [ ] T068 [US2] Add placeholder images for product, testimonials, founder to public/images/
- [ ] T069 [US2] Optimize all images: WebP format, lazy loading, responsive sizes using next/image

**Checkpoint**: User Story 2 complete - trust-building content fully functional independently

---

## Phase 5: User Story 3 - Admin Order Management (Priority: P1)

**Goal**: Enable admin to view orders, update status, add tracking numbers, and trigger notifications

**Independent Test**: Login to /admin → view orders list → open order detail → change status to "Shipped" with tracking → verify email/SMS sent

### Implementation for User Story 3

#### Admin Authentication

- [ ] T070 [US3] Create admin login page in app/admin/login/page.tsx
- [ ] T071 [US3] Implement POST /api/admin/login endpoint with bcrypt password verification in app/api/admin/login/route.ts
- [ ] T072 [US3] Implement POST /api/admin/logout endpoint in app/api/admin/logout/route.ts
- [ ] T073 [US3] Implement GET /api/admin/session endpoint for session verification in app/api/admin/session/route.ts
- [ ] T074 [US3] Create admin authentication middleware for protected routes in lib/auth.ts
- [ ] T075 [US3] Create admin layout with auth protection in app/admin/layout.tsx

#### Admin Dashboard Components

- [ ] T076 [P] [US3] Create OrdersTable component with filtering, sorting, pagination in components/admin/OrdersTable.tsx
- [ ] T077 [P] [US3] Create OrderDetailCard component with full customer/product info in components/admin/OrderDetailCard.tsx
- [ ] T078 [P] [US3] Create SalesAnalytics component with total orders, revenue, size breakdown in components/admin/SalesAnalytics.tsx

#### Admin Order Management API

- [ ] T079 [US3] Implement GET /api/orders endpoint with filtering, pagination for admin in app/api/orders/route.ts
- [ ] T080 [US3] Implement PATCH /api/orders/[id]/status endpoint for status updates in app/api/orders/[id]/status/route.ts
- [ ] T081 [US3] Implement PATCH /api/orders/[id]/tracking endpoint for tracking number updates in app/api/orders/[id]/tracking/route.ts
- [ ] T082 [US3] Add order status transition validation to order service in services/order.service.ts
- [ ] T083 [US3] Add automatic email/SMS trigger on status change to "Shipped" in notification service

#### Admin Analytics API

- [ ] T084 [US3] Implement GET /api/admin/analytics endpoint with aggregated sales data in app/api/admin/analytics/route.ts
- [ ] T085 [US3] Create analytics service with calculations (total orders, revenue, size breakdown) in services/analytics.service.ts

#### Admin Dashboard Pages

- [ ] T086 [US3] Create admin orders list page in app/admin/page.tsx
- [ ] T087 [US3] Create admin order detail page in app/admin/orders/[id]/page.tsx
- [ ] T088 [US3] Create admin analytics page in app/admin/analytics/page.tsx (optional, can embed in main page)

#### Email & SMS Templates

- [ ] T089 [P] [US3] Create shipping notification email template with React Email in emails/shipping-notification.tsx
- [ ] T090 [P] [US3] Create SMS message templates for order confirmation and shipping in lib/sms-templates.ts

**Checkpoint**: User Story 3 complete - full admin order management functional independently

---

## Phase 6: User Story 4 - Discount Code Management (Priority: P2)

**Goal**: Enable admin to create, edit, and manage discount codes

**Independent Test**: Admin creates discount code "SUMMER20" (20% off) → activates it → customer applies at checkout → 20% discount applied

### Implementation for User Story 4

#### Admin Discount Management Components

- [ ] T091 [P] [US4] Create DiscountCodeForm component for create/edit in components/admin/DiscountCodeForm.tsx
- [ ] T092 [P] [US4] Create DiscountCodesTable component with list view in components/admin/DiscountCodesTable.tsx

#### Discount Management API

- [ ] T093 [US4] Implement GET /api/discounts endpoint for listing discount codes in app/api/discounts/route.ts
- [ ] T094 [US4] Implement POST /api/discounts endpoint for creating discount codes in app/api/discounts/route.ts
- [ ] T095 [US4] Implement GET /api/discounts/[id] endpoint for discount code details in app/api/discounts/[id]/route.ts
- [ ] T096 [US4] Implement PATCH /api/discounts/[id] endpoint for updating discount codes in app/api/discounts/[id]/route.ts
- [ ] T097 [US4] Implement DELETE /api/discounts/[id] endpoint (soft delete, set isActive=false) in app/api/discounts/[id]/route.ts

#### Admin Discount Pages

- [ ] T098 [US4] Create admin discount codes page in app/admin/discounts/page.tsx
- [ ] T099 [US4] Add discount code creation/edit form to discounts page

**Checkpoint**: User Story 4 complete - full discount management functional independently

---

## Phase 7: User Story 5 - SEO & Discoverability (Priority: P2)

**Goal**: Ensure website is discoverable through search engines for relevant Hebrew keywords

**Independent Test**: Use Lighthouse SEO audit, Google Search Console, structured data testing tools → verify 90+ SEO score

### Implementation for User Story 5

#### SEO Metadata & Tags

- [ ] T100 [P] [US5] Add meta tags (title, description, Open Graph, canonical) to homepage in app/(customer)/page.tsx
- [ ] T101 [P] [US5] Add Schema.org Product structured data to homepage with JSON-LD in app/(customer)/page.tsx
- [ ] T102 [P] [US5] Create sitemap.xml generator in app/sitemap.ts
- [ ] T103 [P] [US5] Create robots.txt file in app/robots.ts

#### SEO Utilities

- [ ] T104 [US5] Create SEO metadata generator utility in lib/seo.ts
- [ ] T105 [US5] Add proper heading hierarchy (H1, H2, H3) to all pages
- [ ] T106 [US5] Add alt tags to all images with descriptive Hebrew text
- [ ] T107 [US5] Add ARIA labels for accessibility to all interactive components

#### Performance Optimization

- [ ] T108 [P] [US5] Optimize images: WebP format with fallback, lazy loading, responsive sizes
- [ ] T109 [P] [US5] Implement code splitting with dynamic imports for heavy components
- [ ] T110 [US5] Configure Next.js Image component with proper domains and sizes in next.config.js

**Checkpoint**: User Story 5 complete - SEO optimization functional and testable independently

---

## Phase 8: User Story 6 - Legal Compliance & Information Pages (Priority: P3)

**Goal**: Provide legal information pages (privacy policy, terms of service, shipping/returns, FAQ)

**Independent Test**: Navigate to each legal page from footer → verify content is present in Hebrew with proper formatting

### Implementation for User Story 6

#### Legal Pages

- [ ] T111 [P] [US6] Create privacy policy page in app/(customer)/privacy-policy/page.tsx
- [ ] T112 [P] [US6] Create terms of service page in app/(customer)/terms-of-service/page.tsx
- [ ] T113 [P] [US6] Create shipping and returns page in app/(customer)/shipping-returns/page.tsx
- [ ] T114 [P] [US6] Create FAQ page in app/(customer)/faq/page.tsx
- [ ] T115 [P] [US6] Create contact page in app/(customer)/contact/page.tsx

#### Footer Integration

- [ ] T116 [US6] Add links to legal pages in Footer component (components/shared/Footer.tsx)
- [ ] T117 [US6] Add contact information (email, phone, address) to Footer
- [ ] T118 [US6] Add social media links (Instagram, Facebook) to Footer
- [ ] T119 [US6] Add newsletter signup field to Footer (simple email collection)

**Checkpoint**: User Story 6 complete - all legal pages functional independently

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

#### Error Handling & Logging

- [ ] T120 [P] Create global error boundary in app/error.tsx
- [ ] T121 [P] Add error logging to all API routes with structured format
- [ ] T122 [P] Create user-friendly error messages in Hebrew for all error states

#### Security & Performance

- [ ] T123 [P] Implement rate limiting on API endpoints (100 req/min per IP) using Vercel Edge Middleware
- [ ] T124 [P] Add CSRF protection to state-changing API routes
- [ ] T125 [P] Validate and sanitize all user inputs with Zod schemas
- [ ] T126 [P] Configure HTTPS redirect and security headers in next.config.js

#### Testing & Quality

- [ ] T127 [P] Set up Playwright for E2E critical path tests (checkout flow) in tests/e2e/
- [ ] T128 [P] Set up Vitest for unit tests (discount validation, order calculations) in tests/unit/
- [ ] T129 [P] Create test fixtures and utilities in tests/fixtures/
- [ ] T130 Run Lighthouse audit → ensure 90+ scores on all metrics (Performance, Accessibility, Best Practices, SEO)

#### Documentation & Deployment

- [ ] T131 [P] Validate quickstart.md instructions by following setup steps
- [ ] T132 [P] Create README.md with project overview, setup instructions, tech stack
- [ ] T133 [P] Configure Vercel deployment with environment variables
- [ ] T134 [P] Set up Google Analytics 4 tracking with pageviews and custom events

#### Code Quality

- [ ] T135 [P] Run ESLint and fix all errors/warnings
- [ ] T136 [P] Run Prettier and format all code
- [ ] T137 [P] Run TypeScript type-check and fix all type errors
- [ ] T138 Review code for unused imports, console.logs, and dead code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ MVP
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1 homepage but independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Uses US1 order data but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 checkout but independently testable
- **User Story 5 (P2)**: Can start after US1/US2 complete - Requires pages to exist for SEO optimization
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Models/types before services
- Services before API endpoints
- API endpoints before UI components
- Components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

#### Phase 1 (Setup)
All tasks marked [P] can run in parallel: T002, T003, T004, T005, T006, T007, T010, T011, T012, T013

#### Phase 2 (Foundational)
All base components can run in parallel: T025-T030
All shared components can run in parallel: T031-T033
Core services can run in parallel: T020-T024

#### Within User Story 1
- Homepage components in parallel: T034-T037
- Checkout components in parallel: T039-T042

#### Within User Story 2
- All product information components in parallel: T061-T064
- Founder story and testimonials in parallel: T065-T066

#### Within User Story 3
- Admin components in parallel: T076-T078
- Email/SMS templates in parallel: T089-T090

#### Within User Story 4
- Admin discount components in parallel: T091-T092

#### Within User Story 5
- All SEO metadata tasks in parallel: T100-T103
- Performance optimization tasks in parallel: T108-T109

#### Within User Story 6
- All legal pages in parallel: T111-T115

#### Phase 9 (Polish)
- Error handling tasks in parallel: T120-T122
- Security tasks in parallel: T123-T126
- Testing setup in parallel: T127-T129
- Documentation tasks in parallel: T131-T134
- Code quality tasks in parallel: T135-T138

---

## Implementation Strategy

### MVP First (User Story 1 Only) 🎯

1. Complete Phase 1: Setup (T001-T013)
2. Complete Phase 2: Foundational (T014-T033) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T034-T060)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Place test order with Cardcom sandbox
   - Verify email confirmation received
   - Verify order appears in database
5. Deploy/demo if ready

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Setup + Foundational complete
2. **MVP** (Phase 3) → User Story 1 complete → Test independently → Deploy/Demo ✅
3. **Trust Building** (Phase 4) → User Story 2 complete → Test independently → Deploy/Demo
4. **Admin Dashboard** (Phase 5) → User Story 3 complete → Test independently → Deploy/Demo
5. **Discounts** (Phase 6) → User Story 4 complete → Test independently → Deploy/Demo
6. **SEO** (Phase 7) → User Story 5 complete → Test independently → Deploy/Demo
7. **Legal Pages** (Phase 8) → User Story 6 complete → Test independently → Deploy/Demo
8. **Polish** (Phase 9) → Cross-cutting improvements → Final deployment

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - Developer A: User Story 1 (Phase 3)
   - Developer B: User Story 2 (Phase 4)
   - Developer C: User Story 3 (Phase 5)
3. Stories complete and integrate independently
4. Team continues with User Stories 4-6 in priority order
5. Team completes Polish phase together

---

## Summary Statistics

**Total Tasks**: 138

**Task Count by Phase**:
- Phase 1 (Setup): 13 tasks
- Phase 2 (Foundational): 20 tasks
- Phase 3 (User Story 1 - Purchase Journey): 27 tasks
- Phase 4 (User Story 2 - Trust Building): 9 tasks
- Phase 5 (User Story 3 - Admin Management): 21 tasks
- Phase 6 (User Story 4 - Discount Management): 9 tasks
- Phase 7 (User Story 5 - SEO): 11 tasks
- Phase 8 (User Story 6 - Legal Pages): 9 tasks
- Phase 9 (Polish): 19 tasks

**Parallel Opportunities**: 70 tasks marked [P] (50.7% of total)

**MVP Scope** (Phases 1-3): 60 tasks
**Full Feature Scope** (Phases 1-9): 138 tasks

**Independent Test Criteria**:
- User Story 1: Complete purchase flow from homepage to confirmation email
- User Story 2: All trust-building content displays correctly in Hebrew RTL
- User Story 3: Admin can manage orders and trigger notifications
- User Story 4: Admin can create and manage discount codes
- User Story 5: Lighthouse SEO score 90+, structured data validates
- User Story 6: All legal pages accessible and properly formatted

**Format Validation**: ✅ All 138 tasks follow required checklist format:
- Checkbox: `- [ ]`
- Task ID: T001-T138 (sequential)
- [P] marker: Present on 70 parallelizable tasks
- [Story] label: Present on all user story tasks (US1-US6)
- Description: Clear action with file path

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group of related tasks
- Tests are OPTIONAL per constitution (critical-path testing focus)
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

**Last Updated**: 2025-10-21
**Version**: 1.0.0
