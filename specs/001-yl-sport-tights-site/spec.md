# Feature Specification: YL Sport Tights E-Commerce Website

**Feature Branch**: `001-yl-sport-tights-site`
**Created**: 2025-10-21
**Status**: Draft
**Input**: User description: "Build YL Sport Tights - a focused, high-converting single-product e-commerce website for selling women's sport tights"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Purchase Journey (Priority: P1)

A potential customer discovers YL Sport Tights, understands the product benefits, selects her size, and completes a purchase with payment and shipping details.

**Why this priority**: This is the core revenue-generating flow. Without this, the business cannot function. It encompasses the entire conversion funnel from landing to payment confirmation.

**Independent Test**: Can be fully tested by visiting the homepage, viewing product information, selecting a size, proceeding through checkout with test payment credentials (Cardcom sandbox), and receiving an order confirmation email. Delivers complete value as a functional e-commerce transaction.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they view the hero section, **Then** they see a main product image, compelling headline about neoprene shaping benefits, price (299 ILS), and prominent "קני עכשיו" (Buy Now) button
2. **Given** a visitor scrolls down the homepage, **When** they read product information, **Then** they see product benefits with icons, scientific explanation of neoprene fabric, 6-image gallery with zoom, and size selection with size guide
3. **Given** a visitor selects size M and clicks "הוסף לעגלה" (Add to Cart), **When** they proceed to checkout, **Then** they see cart summary showing product (299 ILS), shipping options (30 ILS delivery or free Beer Sheva pickup), and total
4. **Given** a visitor is at checkout, **When** they fill shipping form (name, phone, email, address, city, postal code) and select shipping method, **Then** form validates inputs in real-time with clear Hebrew error messages
5. **Given** a visitor completes the shipping form, **When** they proceed to payment, **Then** they are redirected to Cardcom payment gateway (sandbox mode) with correct order amount
6. **Given** a visitor completes payment successfully, **When** payment is confirmed, **Then** they see order confirmation page with order number and receive confirmation email within 1 minute
7. **Given** a visitor applies discount code "LAUNCH50" at checkout, **When** code is valid, **Then** discount is applied to subtotal and new total is displayed clearly

---

### User Story 2 - Product Discovery & Trust Building (Priority: P1)

A visitor learns about the product's unique value proposition, Yifat's founder story, and customer testimonials to build trust before making a purchase decision.

**Why this priority**: Trust and product understanding are critical for conversion in single-product e-commerce. Without this, visitors won't convert to customers. This story is independently valuable as it can reduce bounce rate and increase time-on-site even if purchase isn't completed.

**Independent Test**: Can be tested by navigating through homepage sections (product benefits, neoprene explanation, founder story, testimonials) and verifying all content displays correctly in Hebrew RTL layout with proper formatting and imagery.

**Acceptance Scenarios**:

1. **Given** a visitor wants to understand the product benefits, **When** they view the benefits section, **Then** they see 4 clear benefit cards with icons: thermogenic effect, immediate body-shaping, maximum comfort, calorie burning boost
2. **Given** a visitor wants scientific explanation, **When** they read the neoprene fabric story, **Then** they see simple, accessible Hebrew text explaining how fabric keeps body heat, promotes sweating, increases metabolism, and provides natural shaping
3. **Given** a visitor wants to know about the founder, **When** they scroll to "אודות יפעת" (About Yifat) section, **Then** they see professional photo, credentials (10+ years personal trainer & Pilates instructor), and compelling personal story about creating YL
4. **Given** a visitor seeks social proof, **When** they view testimonials section, **Then** they see 4-6 customer testimonials with first name + last initial, city, specific problem solved, emotional transformation, and 4-5 star ratings
5. **Given** a visitor wants product specifications, **When** they view specs section, **Then** they see fabric composition (premium neoprene blend), care instructions (machine wash cold, hang dry), and features list (high waist, sweat-wicking, body-shaping, thermogenic, seamless)
6. **Given** a visitor is unsure about sizing, **When** they click size guide, **Then** they see size chart with measurements (bust, waist, hips) for S/M/L/XL and recommendation "true to size, order up if between sizes"

---

### User Story 3 - Admin Order Management (Priority: P1)

Store admin logs into dashboard, views orders, updates order status, adds tracking numbers, and triggers automated customer notifications.

**Why this priority**: Essential for business operations. Without this, the business cannot fulfill orders or communicate with customers about shipping. This is independently testable and valuable for post-purchase customer service.

**Independent Test**: Can be tested by logging into `/admin` with credentials, viewing orders list, opening an order detail, changing status to "Shipped", adding tracking number, and verifying that email/SMS notifications are triggered.

**Acceptance Scenarios**:

1. **Given** admin visits `/admin`, **When** they enter correct username/password, **Then** they are authenticated and see admin dashboard
2. **Given** admin is logged in, **When** they view orders list, **Then** they see all orders with order number, date, customer name, status, and total amount
3. **Given** admin clicks on an order, **When** order detail opens, **Then** they see complete customer info, product details (size, quantity), shipping address, and payment status
4. **Given** admin wants to update order, **When** they change status from "Paid" to "Processing", **Then** status updates immediately in database
5. **Given** admin marks order as "Shipped" and adds tracking number, **When** they save changes, **Then** system automatically sends email + SMS to customer with tracking number and "order shipped" message
6. **Given** admin adds tracking number to existing shipped order, **When** they save, **Then** system sends email + SMS notification with tracking link
7. **Given** admin wants to view sales data, **When** they open analytics section, **Then** they see total orders, total revenue, and breakdown by product size (S/M/L/XL)

---

### User Story 4 - Discount Code Management (Priority: P2)

Admin creates, edits, and manages discount codes that customers can apply at checkout to receive price reductions.

**Why this priority**: Important for marketing campaigns and promotions, but not critical for initial launch. The site can function without discounts. This is independently valuable for running promotions.

**Independent Test**: Can be tested by admin creating discount code "SUMMER20" (20% off), activating it, then customer applying code at checkout and seeing 20% discount applied to order total.

**Acceptance Scenarios**:

1. **Given** admin is in dashboard, **When** they navigate to "ניהול קופונים" (Manage Coupons), **Then** they see list of existing discount codes with name, type, value, dates, and active/inactive status
2. **Given** admin wants to create new discount, **When** they click "צור קופון חדש" (Create New Coupon), **Then** they see form with fields: code name, discount type (percentage/fixed amount), discount value, valid from/until dates, usage limit, minimum order value, active toggle
3. **Given** admin creates code "LAUNCH50" with 50 ILS fixed discount, valid for 30 days, unlimited usage, **When** they save, **Then** code is created and appears in coupons list as active
4. **Given** customer enters discount code at checkout, **When** code is valid and order meets requirements, **Then** discount is applied to subtotal and total is recalculated and displayed
5. **Given** customer enters invalid or expired code, **When** they try to apply it, **Then** they see clear error message in Hebrew explaining why code is invalid
6. **Given** admin wants to deactivate promotion, **When** they toggle code status to inactive, **Then** customers can no longer use that code (get "invalid code" error)

---

### User Story 5 - SEO & Discoverability (Priority: P2)

The website is discoverable through search engines when potential customers search for relevant Hebrew keywords related to sport tights, neoprene activewear, and women's workout clothing.

**Why this priority**: Critical for organic traffic growth but not needed for initial launch with direct traffic. Can be tested independently through SEO tools and search console.

**Independent Test**: Can be tested by using Google Search Console, Lighthouse SEO audit, and structured data testing tools to verify proper meta tags, schema markup, sitemap, and search appearance for target keywords.

**Acceptance Scenarios**:

1. **Given** homepage is loaded, **When** search engine crawler accesses the page, **Then** it finds proper Hebrew meta title, meta description, Open Graph tags, and canonical URL
2. **Given** product page is crawled, **When** search engine parses the page, **Then** it finds Schema.org Product structured data with name, price, availability, image, and description
3. **Given** site is indexed, **When** search engine requests sitemap, **Then** it receives valid sitemap.xml with all public pages
4. **Given** user searches "טייץ ספורט לנשים" on Google, **When** site is indexed, **Then** YL appears in search results with proper title and description
5. **Given** visitor shares product page on Facebook/WhatsApp, **When** link is previewed, **Then** proper Open Graph image, title, and description are displayed
6. **Given** site is audited for SEO, **When** Lighthouse runs, **Then** SEO score is 90+ with proper semantic HTML, heading hierarchy, and alt tags

---

### User Story 6 - Legal Compliance & Information Pages (Priority: P3)

Visitors can access clear information about privacy policy, terms of service, shipping details, return policy, and frequently asked questions.

**Why this priority**: Legally required and builds trust, but can be added shortly after launch. These pages are independently testable and don't affect core purchase flow.

**Independent Test**: Can be tested by navigating to each legal page from footer links and verifying all content is present in clear Hebrew with proper formatting and legal language.

**Acceptance Scenarios**:

1. **Given** visitor wants privacy information, **When** they click "מדיניות פרטיות" (Privacy Policy) in footer, **Then** they see page explaining what data is collected, how it's used, and GDPR compliance
2. **Given** visitor wants to understand terms, **When** they click "תנאי שימוש" (Terms of Service), **Then** they see page with purchase terms, return policy, and disclaimers in clear Hebrew
3. **Given** visitor has shipping questions, **When** they click "משלוחים והחזרות" (Shipping & Returns), **Then** they see detailed explanation of 14-day return policy, shipping costs, and Beer Sheva pickup option
4. **Given** visitor has general questions, **When** they open FAQ page, **Then** they see common questions about product, sizing, shipping, and returns with clear answers
5. **Given** visitor wants contact info, **When** they view footer, **Then** they see email, phone, Beer Sheva address, and social media links (Instagram, Facebook)
6. **Given** visitor wants updates, **When** they find newsletter signup in footer, **Then** they can enter email to subscribe (simple collection, no complex email marketing)

---

## Clarifications

### Session 2025-10-21

- Q: What is the admin session timeout policy? → A: 24-hour absolute expiration (session expires 24 hours after login, regardless of activity)
- Q: Which SMS provider should be integrated? → A: Israeli SMS provider "שלח מסר" (Shlach Meser) - documentation to be provided during implementation
- Q: How should the system verify Cardcom payment callbacks? → A: IP whitelist + amount verification (verify callback originates from Cardcom server IPs and amount matches order total)
- Q: What happens if admin forgets password? → A: Manual reset via environment variable (admin updates password hash directly in Vercel environment config)
- Q: Where should newsletter signup emails be stored? → A: Simple database table (email + timestamp in Postgres) for later export to email marketing service

---

### Edge Cases

- **What happens when payment fails at Cardcom?** User is returned to checkout with error message explaining payment failure, order is marked "Pending Payment", customer can retry payment
- **What happens when Cardcom callback fails verification (wrong IP or amount mismatch)?** Callback is rejected, suspicious activity logged with full request details, admin receives security alert notification, order status remains unchanged
- **What happens when customer enters invalid postal code format?** Form validation shows real-time error message in Hebrew explaining correct format before allowing submission
- **What happens when discount code reaches usage limit?** Code becomes automatically invalid, customers see "קוד זה הגיע למכסה" (code reached limit) error message
- **What happens when customer selects Beer Sheva pickup but provides full address?** Address is saved for customer record but shipping cost remains 0 ILS, admin sees "איסוף עצמי" (self-pickup) indicator on order
- **What happens when admin updates order to "Shipped" but forgets tracking number?** System allows status change but shows warning "מספר מעקב חסר" (missing tracking number), no automatic notification sent until tracking added
- **What happens when 6 product images fail to load?** Fallback placeholder images with brand color shown, alt text displayed for accessibility
- **What happens when customer abandons cart?** Cart data can be optionally stored in browser local storage for session continuity (not persisted to database for returning users since no login system)
- **What happens when Resend email service is down?** Order is saved successfully, payment processed, but admin receives notification to manually send confirmation email, system logs email failure for retry
- **What happens when "שלח מסר" SMS service fails?** Order is saved successfully, email sent normally, but SMS failure is logged and admin receives notification to follow up with customer via phone or email
- **What happens when mobile user zooms product image?** Image gallery supports pinch-to-zoom on mobile and click-to-zoom on desktop with smooth transitions and RTL gesture support
- **What happens when admin forgets password?** Admin accesses Vercel dashboard, navigates to environment variables, generates new bcrypt hash using online tool or CLI, updates ADMIN_PASSWORD_HASH variable, redeploys if needed, then logs in with new password
- **What happens when same email signs up for newsletter twice?** System checks for existing email in database, if found shows message "כתובת זו כבר רשומה לניוזלטר" (already subscribed), if new adds to database and shows success message

## Requirements *(mandatory)*

### Functional Requirements

**Product Display & Information**:
- **FR-001**: System MUST display single product "YL Sport Tights" with price 299 ILS clearly visible on homepage hero section
- **FR-002**: System MUST show 6 high-quality product images in gallery format with zoom capability on click/tap
- **FR-003**: System MUST present 4 product benefits with icons: thermogenic effect, immediate body-shaping, maximum comfort, calorie burning boost
- **FR-004**: System MUST display scientific explanation of neoprene fabric benefits in simple Hebrew language accessible to non-technical audience
- **FR-005**: System MUST show Yifat Levi's founder story with photo (placeholder initially), credentials, and personal narrative about creating the product
- **FR-006**: System MUST display 4-6 customer testimonials with format: first name + last initial, city, problem/solution/transformation, 4-5 star rating
- **FR-007**: System MUST provide product specifications: fabric composition, care instructions, features list, size chart (S/M/L/XL with bust/waist/hips measurements)
- **FR-008**: System MUST show size guide with fitting recommendations and "true to size, order up if between sizes" guidance

**Purchase Flow**:
- **FR-009**: System MUST allow size selection (S, M, L, XL) as required field before adding to cart
- **FR-010**: System MUST allow quantity selection with default value 1 and maximum 5 per order
- **FR-011**: System MUST display cart summary showing: product price (299 ILS), selected size, quantity, shipping cost (30 ILS or 0 if pickup), subtotal, applied discount if any, final total
- **FR-012**: System MUST collect shipping information: full name (required), phone number (required), email (required), street address (required), city (required), postal code (required)
- **FR-013**: System MUST validate all form fields in real-time with clear Hebrew error messages appearing immediately below relevant field
- **FR-014**: System MUST offer two shipping methods: "משלוח רגיל - 30 ₪" (Standard Delivery - 30 ILS) and "איסוף עצמי באר שבע - חינם" (Self-Pickup Beer Sheva - Free)
- **FR-015**: System MUST integrate with Cardcom payment gateway for secure payment processing, initially in sandbox mode
- **FR-016**: System MUST redirect user to Cardcom with correct order amount and return to order confirmation page upon successful payment
- **FR-016a**: System MUST verify Cardcom payment callbacks by checking originating IP against Cardcom server whitelist AND validating callback amount matches order total in database before updating order status
- **FR-017**: System MUST generate unique order number upon successful payment completion
- **FR-018**: System MUST display order confirmation page immediately after payment with order number and estimated delivery timeframe
- **FR-019**: System MUST send order confirmation email to customer within 1 minute of successful payment using Resend API

**Discount System**:
- **FR-020**: System MUST allow admin to create discount codes with fields: code name, type (percentage or fixed amount), value, valid from/until dates, usage limit (unlimited or specific number), minimum order value (optional), active/inactive status
- **FR-021**: System MUST allow customers to enter discount code at checkout in optional field
- **FR-022**: System MUST validate discount code in real-time checking: code exists, is active, within valid date range, hasn't reached usage limit, order meets minimum value
- **FR-023**: System MUST apply valid discount to cart subtotal and recalculate total, displaying original price, discount amount, and new total clearly
- **FR-024**: System MUST show clear Hebrew error message if discount code is invalid, expired, or reached usage limit

**Admin Dashboard**:
- **FR-025**: System MUST provide admin login page at `/admin` with username/password authentication (simple session-based with 24-hour absolute expiration, no complex user management)
- **FR-025a**: System MUST support admin password recovery via manual environment variable update (admin updates ADMIN_PASSWORD_HASH in Vercel environment config, no automated reset flow)
- **FR-026**: System MUST display orders list view showing: order number, date, customer name, status, total amount in sortable/filterable table
- **FR-027**: System MUST support order statuses: Pending Payment, Paid, Processing, Shipped, Delivered, Cancelled
- **FR-028**: System MUST provide order detail view showing: customer full info, product details (size, quantity, price), shipping address, shipping method, payment status, tracking number field
- **FR-029**: System MUST allow admin to update order status via dropdown selection with immediate save
- **FR-030**: System MUST allow admin to add/edit tracking number in text field for any order
- **FR-031**: System MUST automatically trigger email + SMS to customer when order status changed to "Shipped" and tracking number exists, using predefined Hebrew templates
- **FR-032**: System MUST automatically trigger email + SMS notification when tracking number is added to already-shipped order
- **FR-033**: System MUST provide discount codes management page showing: all codes with name, type, value, dates, usage count, active status
- **FR-034**: System MUST allow admin to create, edit, activate/deactivate discount codes through admin interface
- **FR-035**: System MUST display sales analytics showing: total orders count, total revenue sum, order count breakdown by size (S/M/L/XL)

**Communications**:
- **FR-036**: System MUST send professional HTML email for order confirmation including: order number, product details, size, quantity, total paid, shipping address, shipping method, estimated delivery
- **FR-037**: System MUST send email for shipping notification including: order number, tracking number, tracking link, estimated delivery date
- **FR-038**: System MUST send SMS for order confirmation with format: "הזמנה #[NUM] אושרה. סכום: [AMOUNT] ₪. תודה שרכשת ב-YL!" (max 160 chars)
- **FR-039**: System MUST send SMS for shipping notification with format: "הזמנה #[NUM] נשלחה! מעקב: [LINK]. משלוח צפוי ב-[DATE]" (max 160 chars)
- **FR-040**: System MUST use Resend API for all email sending with proper error handling and retry logic for failures
- **FR-041**: System MUST integrate with "שלח מסר" (Shlach Meser) Israeli SMS provider for sending order confirmation and shipping notifications

**SEO & Analytics**:
- **FR-042**: System MUST include proper meta tags on every page: title (Hebrew), description (Hebrew), canonical URL, viewport settings for mobile
- **FR-043**: System MUST implement Open Graph tags for social sharing: og:title, og:description, og:image, og:url, og:type
- **FR-044**: System MUST include Schema.org Product structured data markup on homepage with: name, image, price, priceCurrency (ILS), availability, description
- **FR-045**: System MUST generate sitemap.xml including all public pages (homepage, legal pages)
- **FR-046**: System MUST provide robots.txt file allowing all crawlers except admin area
- **FR-047**: System MUST integrate Google Analytics tracking on all pages with proper page view events and custom checkout funnel events
- **FR-048**: System MUST support semantic HTML structure with proper heading hierarchy (H1, H2, H3), alt tags on images, ARIA labels for accessibility
- **FR-049**: System MUST optimize images: WebP format with fallback, lazy loading for below-fold images, responsive sizes for different viewports

**Design & UX**:
- **FR-050**: System MUST implement RTL (right-to-left) layout throughout entire site for Hebrew language support
- **FR-051**: System MUST use brand color palette: Primary #00BFA6 (Teal), Accent #FF6B6B (Coral), Secondary #E0F7F4 (Teal Light) for CTAs, accents, and visual elements
- **FR-052**: System MUST display prominent sticky "הוסף לעגלה" (Add to Cart) button visible at all times during scrolling
- **FR-053**: System MUST provide immediate visual feedback (<100ms) for all user interactions: button clicks, form submissions, status changes
- **FR-054**: System MUST be fully responsive with mobile-first design supporting viewport widths from 320px to 2560px
- **FR-055**: System MUST maintain visual consistency with modern, clean aesthetic inspired by premium sportswear brands (Gymshark, Lululemon, Nike)

**Legal & Information**:
- **FR-056**: System MUST provide privacy policy page in Hebrew explaining: data collected, usage, storage duration (7 years for financial data), GDPR compliance
- **FR-057**: System MUST provide terms of service page in Hebrew with: purchase terms, return policy (14 days), disclaimers, warranty information
- **FR-058**: System MUST provide shipping & returns page explaining: 30 ILS shipping cost, free Beer Sheva pickup, 14-day return window, return process
- **FR-059**: System MUST provide FAQ page answering common questions about: product benefits, sizing, washing, shipping time, returns, payments
- **FR-060**: System MUST display footer on all pages with: contact info (email, phone, address), social links (Instagram, Facebook), quick links to legal pages, newsletter signup field, copyright notice
- **FR-060a**: System MUST store newsletter signup emails in database table with email address (unique), signup timestamp, and optional consent flag for future email marketing export

**Performance & Security**:
- **FR-061**: System MUST enforce HTTPS on all pages with automatic redirect from HTTP
- **FR-062**: System MUST validate and sanitize all user inputs to prevent injection attacks (XSS, SQL injection)
- **FR-063**: System MUST implement rate limiting on API endpoints to prevent abuse (max 100 requests per minute per IP)
- **FR-064**: System MUST store sensitive data (admin passwords) using secure hashing (bcrypt with salt)
- **FR-065**: System MUST never store credit card details locally (all payment processing through Cardcom PCI-compliant gateway)
- **FR-065a**: System MUST store Cardcom server IP whitelist in environment variables and reject callbacks from non-whitelisted IPs
- **FR-066**: System MUST use environment variables for all sensitive configuration (API keys, database credentials, admin passwords, Cardcom IP whitelist)
- **FR-067**: System MUST achieve Lighthouse performance score 90+ on mobile and desktop
- **FR-068**: System MUST load homepage First Contentful Paint in under 2 seconds on 4G mobile connection
- **FR-069**: System MUST achieve Core Web Vitals "Good" ratings: LCP <2.5s, FID <100ms, CLS <0.1

### Key Entities

- **Product**: Represents YL Sport Tights with attributes: name, description, price (299 ILS), available sizes (S/M/L/XL), images (6 URLs), fabric details, care instructions, features list
- **Order**: Represents customer purchase with attributes: order number (unique), date/time created, customer info (name, phone, email, address), shipping method (delivery/pickup), payment status, order status, total amount, discount applied, tracking number
- **Customer**: Represents person placing order with attributes: full name, phone number, email address, shipping address (street, city, postal code), no account/login required
- **Discount Code**: Represents promotional coupon with attributes: code name (unique), type (percentage/fixed), value (number), valid from date, valid until date, usage limit (number or unlimited), minimum order value, active status (boolean), usage count
- **Cart**: Represents temporary shopping selection with attributes: product (YL tights), selected size, quantity (1-5), shipping method choice, applied discount code, stored in browser session/local storage
- **Email Template**: Represents notification format with attributes: template type (order confirmation/shipping notification), subject line, HTML body with placeholder tokens, plain text version
- **SMS Template**: Represents SMS notification format with attributes: template type (order confirmation/shipping notification), message body with tokens (max 160 chars Hebrew)
- **Newsletter Subscriber**: Represents newsletter signup with attributes: email address (unique), signup timestamp, consent flag (boolean), IP address (optional for GDPR compliance)

### Assumptions

**Technology Decisions** (implementation details, not part of spec but documenting assumptions):
- Database will use serverless Postgres (Neon or Supabase) for scalability with single-product site
- Email service will use Resend API for reliable delivery and professional templates
- SMS service will use "שלח מסר" (Shlach Meser) Israeli provider for Hebrew SMS delivery
- Hosting on Vercel for automatic deployments and edge network performance
- Admin authentication uses simple session-based approach with 24-hour expiration (no OAuth2 needed for single admin)
- Admin password recovery handled via manual environment variable update (no automated reset flow)

**Business Logic Assumptions**:
- Order numbers generated sequentially starting from 001
- Shipping to Beer Sheva means 0 ILS cost (free self-pickup)
- All other locations in Israel charged 30 ILS shipping
- Return window calculated from delivery date, not order date
- Tracking numbers provided by shipping carrier, not generated internally
- Email/SMS sent immediately upon status change (no delayed batch processing)
- Discount codes case-insensitive when customers enter them
- Multiple discount codes cannot be combined on single order
- Admin can manually mark orders as any status for edge case handling
- Customer data retained for 7 years to comply with tax regulations
- Product always in stock (no inventory management for single handmade/small-batch product)

**Content Assumptions**:
- Yifat's photo will be provided later (placeholder used initially)
- 6 product images professionally shot and provided in high resolution
- Customer testimonials created initially as example content, replaced with real testimonials after launch
- Hebrew translations professionally reviewed for accuracy and natural language
- Legal pages (privacy, terms) reviewed by legal counsel before launch

**Performance & Infrastructure Assumptions**:
- Target audience primarily in Israel (Hebrew-speaking, ILS currency)
- 60%+ traffic expected from mobile devices based on e-commerce industry averages
- Concurrent user load estimated at <1000 users initially (single product, small business)
- CDN (via Vercel) handles static asset delivery for global speed
- Database queries optimized for common operations (order list, order detail)
- Image optimization automated via build process (WebP conversion, responsive sizes)

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Conversion & User Experience**:
- **SC-001**: Visitor can understand core product value proposition within 5 seconds of landing on homepage (measured via 5-second usability tests)
- **SC-002**: Customer can complete entire purchase flow from homepage to order confirmation in under 2 minutes on mobile device (measured via checkout funnel analytics)
- **SC-003**: Checkout cart abandonment rate remains below 70% (industry average 70%, success = at or below average)
- **SC-004**: 90% of purchase attempts result in successful order creation (payment completion, not cart abandonment)

**Performance & Technical**:
- **SC-005**: All pages load with First Contentful Paint under 3 seconds on 4G mobile connection (measured via Lighthouse, WebPageTest)
- **SC-006**: Lighthouse scores achieve 90+ on all metrics: Performance, Accessibility, Best Practices, SEO (measured on mobile and desktop)
- **SC-007**: Site maintains 99.9% uptime over 30-day period (measured via Vercel analytics or UptimeRobot)
- **SC-008**: Payment processing completes successfully 99% of attempts (excluding customer payment failures like insufficient funds)

**Operational Efficiency**:
- **SC-009**: Admin can process order (view details, update status, add tracking) in under 1 minute per order (measured via time tracking during admin user testing)
- **SC-010**: Order confirmation emails and SMS delivered within 1 minute of payment completion 95% of the time (measured via Resend delivery logs and SMS service logs)
- **SC-011**: Shipping notification emails/SMS with tracking number sent automatically when status updated, requiring zero manual admin action (measured by 100% automation rate)
- **SC-012**: Admin dashboard displays accurate sales analytics (total orders, revenue, size breakdown) updated in real-time without delays (verified through manual reconciliation tests)

**SEO & Discoverability**:
- **SC-013**: Site appears in Google search results for target keywords "טייץ ספורט לנשים" within 30 days of launch (measured via Google Search Console)
- **SC-014**: Organic search traffic drives at least 20% of total site visits within 90 days (measured via Google Analytics traffic sources)
- **SC-015**: Product page properly displays structured data (price, availability, ratings) in Google search preview (verified via Rich Results Test tool)

**Customer Satisfaction**:
- **SC-016**: Zero security incidents involving customer payment data or personal information (measured via security audit and incident logs)
- **SC-017**: Mobile user experience rated 4+ stars out of 5 by test users for ease of navigation and purchase completion (measured via user testing sessions with 10+ test users)
- **SC-018**: Site accessibility meets WCAG 2.1 AA standards for RTL Hebrew content (verified via automated accessibility audits and manual screen reader testing)

**Business Impact**:
- **SC-019**: Average order value equals or exceeds 299 ILS (base product price, with potential increases from multi-quantity orders)
- **SC-020**: Conversion rate (visitors to completed purchases) reaches minimum 2% within 60 days (e-commerce industry average 2-3%)
- **SC-021**: Email open rate for order confirmations exceeds 80% (measured via Resend email analytics)
- **SC-022**: Customer support inquiries about order status reduced by 50% due to automated email/SMS notifications (measured by comparing inquiry volume before and after automation)
