# Technology Research & Decisions

**Feature**: YL Sport Tights E-Commerce Website
**Branch**: 001-yl-sport-tights-site
**Date**: 2025-10-21

## Executive Summary

This document captures the technology selection rationale for the YL Sport Tights single-product e-commerce website. All decisions prioritize simplicity, performance, and rapid time-to-market while maintaining production-grade quality and security standards.

**Key Decisions**:
- **Framework**: Next.js 14 App Router (React 18)
- **Language**: TypeScript 5.x (strict mode)
- **Database**: Neon Serverless PostgreSQL + Prisma ORM
- **Payment**: Cardcom Payment Gateway (Israeli market)
- **Email**: Resend API
- **SMS**: Architecture prepared, provider TBD
- **Hosting**: Vercel (recommended)
- **UI Components**: shadcn/ui + TailwindCSS

---

## Frontend Framework: Next.js 14 App Router

### Decision
Use **Next.js 14 with App Router** for the frontend and API layer.

### Rationale

**Performance Benefits**:
- **Server Components by default**: Reduces JavaScript bundle size by ~40% compared to client-only React
- **Automatic code splitting**: Each route loads only necessary code
- **Image optimization**: Built-in `next/image` component with automatic WebP conversion, lazy loading, and responsive sizing
- **Static generation + ISR**: Product page can be statically generated and revalidated, achieving sub-second load times
- **Edge runtime support**: API routes can run on Vercel Edge for global low-latency responses

**Developer Experience**:
- **File-based routing**: Intuitive structure matching mental model (`app/checkout/page.tsx` → `/checkout`)
- **TypeScript-first**: Excellent type inference for params, searchParams, and metadata
- **Built-in API routes**: No separate backend needed for simple operations
- **Server Actions**: Form handling without explicit API routes reduces boilerplate

**SEO & Accessibility**:
- **Server-side rendering**: Initial HTML contains full content for crawlers
- **Metadata API**: Structured way to define meta tags, Open Graph, and Schema.org data
- **Streaming SSR**: Progressive rendering improves perceived performance

**RTL Support**:
- Next.js works seamlessly with `dir="rtl"` in root layout
- TailwindCSS RTL plugin integrates cleanly
- No framework-level conflicts with right-to-left layouts

### Alternatives Considered

**Option: Remix**
- **Pros**: Excellent form handling, progressive enhancement, nested routing
- **Cons**: Smaller ecosystem than Next.js, fewer hosting options, less mature image optimization
- **Rejected**: Next.js has better Vercel integration, more production-proven for e-commerce

**Option: Astro**
- **Pros**: Multi-framework support, excellent performance for content-heavy sites
- **Cons**: Less suitable for interactive checkout flows, smaller component ecosystem
- **Rejected**: Next.js better for dynamic e-commerce features (cart, checkout, admin)

**Option: Create React App + Express**
- **Pros**: Full control over architecture
- **Cons**: Manual SSR setup, no automatic optimizations, more DevOps overhead
- **Rejected**: Too much infrastructure work for a single-product site

---

## Language: TypeScript

### Decision
Use **TypeScript 5.x with strict mode enabled**.

### Rationale

**Type Safety**:
- Catches errors at compile time (e.g., incorrect order status transitions, missing required fields)
- Excellent autocomplete and refactoring support in VS Code
- Prisma generates TypeScript types from database schema automatically

**Maintainability**:
- Self-documenting code (function signatures show expected inputs/outputs)
- Easier for new developers to understand codebase
- Reduces runtime errors in production

**Ecosystem Compatibility**:
- Next.js, Prisma, shadcn/ui all have first-class TypeScript support
- Type definitions available for all major libraries (React, TailwindCSS, etc.)

### Alternatives Considered

**Option: JavaScript with JSDoc**
- **Pros**: No compilation step, simpler for beginners
- **Cons**: Weaker type checking, more verbose JSDoc syntax
- **Rejected**: TypeScript strict mode catches more bugs and has better tooling

---

## Database: Neon Serverless PostgreSQL

### Decision
Use **Neon** for serverless PostgreSQL hosting.

### Rationale

**Serverless Benefits**:
- **Auto-scaling**: Handles traffic spikes without manual intervention
- **Pay-per-use**: Cost-effective for initial low-traffic phase (estimated < $10/month at launch)
- **No cold starts**: Unlike Lambda + RDS, Neon maintains connection pooling
- **Automatic backups**: Built-in point-in-time recovery

**Developer Experience**:
- **Instant provisioning**: Database ready in seconds (vs. hours for traditional RDS)
- **Branching**: Create database branches for testing migrations (like Git for databases)
- **Connection pooling**: Built-in, no need for external tools like PgBouncer

**Performance**:
- **Low latency**: Edge-optimized connections via Neon's proxy
- **Sufficient for scale**: Can handle 1000s of concurrent users (far beyond initial requirements)

**PostgreSQL Choice**:
- **ACID compliance**: Critical for order processing (no lost payments)
- **Rich data types**: JSON fields for flexible data (e.g., order metadata)
- **Full-text search**: Future capability for product descriptions (if catalog expands)
- **Mature ecosystem**: Well-tested ORM support (Prisma), migration tools

### Alternatives Considered

**Option: Supabase**
- **Pros**: PostgreSQL + built-in auth, realtime subscriptions, file storage
- **Cons**: More features than needed (over-engineering), slightly higher cost
- **Rejected**: Neon is simpler and more focused on database-only use case

**Option: PlanetScale (MySQL)**
- **Pros**: Excellent branching workflow, generous free tier
- **Cons**: MySQL limitations (no foreign key constraints with Prisma, weaker JSON support)
- **Rejected**: PostgreSQL is more feature-rich for future needs

**Option: MongoDB Atlas**
- **Pros**: Flexible schema, good for rapid prototyping
- **Cons**: Lack of ACID transactions (risky for payments), weaker TypeScript support
- **Rejected**: PostgreSQL better for financial data integrity

---

## ORM: Prisma

### Decision
Use **Prisma 5.x** for database access and migrations.

### Rationale

**Type Safety**:
- **Generated TypeScript types**: `@prisma/client` generates types from `schema.prisma` automatically
- **Type-safe queries**: Autocomplete for model fields, relationships, and filters
- **Compile-time checks**: Invalid queries fail at build time, not runtime

**Developer Experience**:
- **Schema-first**: Single source of truth in `schema.prisma` file
- **Visual database browser**: Prisma Studio provides GUI for data inspection
- **Migration system**: `prisma migrate` generates SQL migrations from schema changes
- **Seeding**: Built-in `seed.ts` for initializing admin user and test data

**Performance**:
- **Efficient queries**: Prisma generates optimized SQL (select only needed fields, automatic JOINs)
- **Connection pooling**: Built-in connection management
- **Query caching**: Prisma caches metadata to reduce round trips

**Ecosystem**:
- **Next.js integration**: Official Next.js examples with Prisma
- **Neon compatibility**: First-class support for Neon's connection string format

### Alternatives Considered

**Option: Drizzle ORM**
- **Pros**: Lighter weight, SQL-like syntax, excellent TypeScript support
- **Cons**: Smaller ecosystem, less mature migration tooling
- **Rejected**: Prisma has better Next.js integration and more production-proven

**Option: TypeORM**
- **Pros**: Mature, supports multiple databases
- **Cons**: Heavier, decorator-based syntax (less idiomatic TypeScript), slower development
- **Rejected**: Prisma is more modern and has better DX

**Option: Kysely**
- **Pros**: Excellent TypeScript inference, lightweight
- **Cons**: Manual migration management, no schema-first approach
- **Rejected**: Prisma's schema-first approach better for rapid development

---

## Payment Gateway: Cardcom

### Decision
Use **Cardcom** for payment processing.

### Rationale

**Israeli Market Requirements**:
- **Local payment methods**: Supports Israeli credit cards, currency conversion to ILS
- **Hebrew support**: Admin dashboard and documentation in Hebrew
- **Local compliance**: Meets Israeli banking regulations and PCI-DSS standards

**Security**:
- **PCI-compliant**: Cardcom handles all card data (we never see/store card numbers)
- **Tokenization**: Returns payment tokens, not raw card data
- **Fraud prevention**: Built-in fraud detection and 3D Secure support

**Integration**:
- **Redirect flow**: Simple integration (redirect to Cardcom → callback to our site)
- **Sandbox mode**: Test environment for development
- **Webhook support**: Async notifications for payment status changes

**Business Compatibility**:
- **Low fees**: ~2.5% per transaction (competitive for Israeli market)
- **Fast payouts**: Funds deposited to business account within 2-3 days
- **Multi-currency**: Supports ILS primarily, with option for USD/EUR if expanding internationally

### Alternatives Considered

**Option: Stripe**
- **Pros**: Best-in-class developer experience, excellent documentation, global reach
- **Cons**: Less common in Israel, higher fees for ILS transactions, requires international business entity
- **Rejected**: Cardcom is more appropriate for Israeli-focused business

**Option: PayPal**
- **Pros**: Widely recognized brand, easy checkout
- **Cons**: High fees (~3.5%), poor seller protection, customer friction (requires PayPal account)
- **Rejected**: Higher cost and worse UX than Cardcom

**Option: Tranzila**
- **Pros**: Another Israeli payment processor, similar to Cardcom
- **Cons**: Less modern API, weaker documentation
- **Rejected**: Cardcom has better developer experience

---

## Email Service: Resend

### Decision
Use **Resend** for transactional emails.

### Rationale

**Developer Experience**:
- **React Email integration**: Write email templates as React components (type-safe, reusable)
- **Modern API**: RESTful API with excellent TypeScript SDK
- **Simple setup**: API key authentication, no complex SMTP configuration

**Deliverability**:
- **High inbox rate**: Built on AWS SES with optimized sending infrastructure
- **SPF/DKIM/DMARC**: Automatic email authentication setup
- **Domain reputation**: Dedicated IP not needed for low-volume sending (<10k emails/month)

**Features**:
- **HTML + Plain text**: Automatically generates plain text version from HTML
- **Email validation**: Checks email address format before sending
- **Webhooks**: Real-time notifications for opens, clicks, bounces (analytics)
- **Batch sending**: Can send to multiple recipients efficiently

**Cost**:
- **Generous free tier**: 100 emails/day free (3000/month)
- **Predictable pricing**: $20/month for up to 50k emails (far beyond initial needs)

### Alternatives Considered

**Option: SendGrid**
- **Pros**: Mature platform, high deliverability, generous free tier (100 emails/day)
- **Cons**: Complex API, poor developer experience, frequent account suspensions for new users
- **Rejected**: Resend has better DX and modern React Email templates

**Option: AWS SES**
- **Pros**: Very cheap ($0.10 per 1000 emails), reliable infrastructure
- **Cons**: Complex setup (IAM, SMTP credentials, domain verification), no built-in templates
- **Rejected**: Too much configuration overhead for a small project

**Option: Mailgun**
- **Pros**: Reliable, good API
- **Cons**: Expensive (no free tier), less modern developer experience than Resend
- **Rejected**: Resend is more cost-effective and has better DX

---

## SMS Service: "שלח מסר" (Shlach Meser)

### Decision
Use **"שלח מסר" (Shlach Meser)** Israeli SMS provider for order and shipping notifications.

### Rationale

**Israeli Market Optimization**:
- **Local provider**: Optimized for Israeli mobile networks (Partner, Cellcom, Pelephone)
- **Hebrew support**: Native Hebrew SMS encoding (UTF-16) with proper character handling
- **Deliverability**: High delivery rates to Israeli mobile numbers due to direct carrier relationships
- **Compliance**: Meets Israeli telecommunications regulations

**Integration Approach**:
- **Service abstraction**: `lib/shlach-meser.ts` will wrap SMS provider API
- **Error handling**: SMS failures won't block order processing (email serves as fallback)
- **Documentation pending**: API documentation to be provided by vendor during implementation
- **Test mode**: Sandbox environment for development testing

**Cost Structure**:
- **Per-message pricing**: Typical Israeli SMS rates (~₪0.20-0.30 per message)
- **Volume discounts**: Available for high-volume senders
- **No monthly fees**: Pay-as-you-go model suitable for variable order volume

### SMS Message Templates

**Order Confirmation** (max 160 characters):
```
הזמנה #[NUM] אושרה. סכום: [AMOUNT] ₪. תודה שרכשת ב-YL!
```

**Shipping Notification** (max 160 characters):
```
הזמנה #[NUM] נשלחה! מעקב: [LINK]. משלוח צפוי ב-[DATE]
```

### Implementation Notes

**API Wrapper Structure**:
```typescript
// lib/shlach-meser.ts
export async function sendSMS(params: {
  phoneNumber: string; // Israeli format: 05XXXXXXXX
  message: string;      // Max 160 chars (Hebrew UTF-16)
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Implementation using שלח מסר API
  // Documentation to be provided by vendor
}
```

**Error Handling Strategy**:
- Log SMS failures to database for admin review
- Don't block order completion if SMS fails (email still sent)
- Retry logic for temporary network failures
- Admin notification for persistent SMS service issues

**Character Count Considerations**:
- Hebrew uses UTF-16 encoding (2 bytes per character)
- 160-character limit for single SMS
- Longer messages split into multiple parts (additional cost)
- Keep messages concise to avoid multi-part SMS

### Alternatives Considered

**Option: Twilio** (International)
- **Pros**: Excellent API, global reach, comprehensive documentation
- **Cons**: Higher cost (~$0.08 per SMS to Israel), less optimized for Israeli carriers
- **Rejected**: "שלח מסר" chosen for better local market fit and deliverability

**Option: Israeli Alternatives** (ActiveTrail, Inforu, iSMS)
- **Pros**: Similar Israeli market optimization
- **Cons**: User specified "שלח מסר" as preferred provider
- **Rejected**: Specific vendor preference provided during clarification phase

---

## Hosting: Vercel (Recommended)

### Decision
Use **Vercel** for hosting (recommended but not enforced).

### Rationale

**Next.js Integration**:
- **Zero-config deployment**: `git push` → automatic deployment
- **Preview deployments**: Every pull request gets a unique URL for testing
- **Edge network**: 40+ global locations for low-latency static asset delivery
- **Automatic HTTPS**: SSL certificates provisioned and renewed automatically

**Performance**:
- **Edge Functions**: API routes run on Cloudflare Workers for <50ms response times globally
- **ISR support**: Incremental Static Regeneration for product pages (fast loads + fresh data)
- **Image optimization**: Automatic WebP conversion and responsive sizing

**Developer Experience**:
- **Environment variables**: Managed via dashboard, separate for production/preview/development
- **Real-time logs**: Streaming logs for debugging production issues
- **Analytics**: Built-in Web Vitals tracking, no 3rd-party scripts needed

**Cost**:
- **Free tier**: Generous limits (100GB bandwidth, 100 serverless function invocations per day)
- **Pro tier ($20/month)**: Sufficient for 100TB bandwidth (far beyond initial needs)

### Alternatives Considered

**Option: Netlify**
- **Pros**: Similar DX to Vercel, good free tier
- **Cons**: Weaker Next.js support (some features like ISR not fully supported)
- **Rejected**: Vercel is built by Next.js creators, best integration

**Option: AWS Amplify**
- **Pros**: Deep AWS integration, scalable
- **Cons**: More complex setup, slower deployments, weaker Next.js optimizations
- **Rejected**: Vercel is simpler and faster for Next.js

**Option: Self-hosted (VPS or Docker)**
- **Pros**: Full control, potentially lower cost at high scale
- **Cons**: Manual DevOps work (CI/CD, SSL, scaling, monitoring)
- **Rejected**: Too much operational overhead for a small business

---

## UI Components: shadcn/ui + TailwindCSS

### Decision
Use **shadcn/ui** components with **TailwindCSS** for styling.

### Rationale

**shadcn/ui Philosophy**:
- **Copy-paste, not dependency**: Components are copied into your codebase, not installed as npm package
- **Full ownership**: Can customize components freely without fighting library abstractions
- **Type-safe**: All components written in TypeScript with proper prop types
- **Accessible by default**: Built on Radix UI primitives (WCAG 2.1 AA compliant)

**TailwindCSS Benefits**:
- **Utility-first**: No need to invent class names or manage separate CSS files
- **RTL support**: `tailwindcss-rtl` plugin handles directional styles automatically
- **Performance**: PurgeCSS removes unused styles, resulting in tiny CSS bundles (<10KB)
- **Responsive design**: Built-in breakpoints (`sm:`, `md:`, `lg:`) for mobile-first development
- **Brand colors**: Easy to define custom palette (Primary: `#00BFA6` Teal, Accent: `#FF6B6B` Coral) in `tailwind.config.ts`

**Component Quality**:
- **Consistent design**: All components follow same design system (spacing, typography, colors)
- **Dark mode ready**: Built-in support (not needed now but future-proof)
- **Form components**: Input, Select, Textarea have built-in validation states

### Alternatives Considered

**Option: Material-UI (MUI)**
- **Pros**: Mature library, comprehensive component set, accessible
- **Cons**: Heavy bundle size (~300KB), opinionated design (hard to customize), not RTL-friendly
- **Rejected**: Too heavy for a simple single-product site

**Option: Chakra UI**
- **Pros**: Accessible, good TypeScript support, RTL-friendly
- **Cons**: Runtime styles (slower than TailwindCSS), larger bundle size
- **Rejected**: TailwindCSS + shadcn/ui is lighter and faster

**Option: Headless UI (by Tailwind)**
- **Pros**: Unstyled primitives, full control over design
- **Cons**: More work to style from scratch
- **Rejected**: shadcn/ui provides styled components while maintaining customizability

---

## Testing Strategy

### Decision
**Playwright** for E2E critical paths, **Vitest** for unit tests, **manual testing** for responsive design.

### Rationale

**Critical Path Focus**:
- **E2E tests** cover revenue-critical flows: checkout, payment, order creation
- **Unit tests** cover business logic: discount validation, order status transitions
- **Manual testing** for visual regression (responsive design, RTL layout)

**Playwright for E2E**:
- **Cross-browser**: Tests run on Chrome, Firefox, Safari (ensures 95% compatibility)
- **Real browser**: More realistic than Jest + jsdom (actual DOM, network requests)
- **Debugging**: Built-in inspector, screenshots, video recordings of failures

**Vitest for Unit Tests**:
- **Fast**: 10x faster than Jest (Vite-powered)
- **ESM-native**: Works seamlessly with modern TypeScript + ES modules
- **API compatibility**: Drop-in replacement for Jest (same `describe`, `expect`, `it` syntax)

**Manual Testing**:
- **Responsive design**: Visual inspection on real devices (iPhone, Android, desktop)
- **RTL layout**: Hebrew text rendering varies across browsers (needs human verification)
- **Accessibility**: Screen reader testing (VoiceOver on iOS, TalkBack on Android)

### Alternatives Considered

**Option: Jest for all tests**
- **Pros**: Most popular, huge ecosystem
- **Cons**: Slower than Vitest, requires more configuration for ESM
- **Rejected**: Vitest is faster and works better with modern TypeScript

**Option: Cypress for E2E**
- **Pros**: Excellent developer experience, time-travel debugging
- **Cons**: Slower than Playwright, doesn't support Safari, heavier resource usage
- **Rejected**: Playwright supports more browsers and is faster

**Option: 100% test coverage (TDD)**
- **Pros**: Catches all bugs, encourages modular code
- **Cons**: Slows down development, diminishing returns for simple UI components
- **Rejected**: Constitution prioritizes critical-path testing over comprehensive coverage

---

## RTL (Right-to-Left) Layout Approach

### Decision
Use **TailwindCSS RTL plugin** + **Next.js `dir="rtl"`** for full Hebrew RTL support.

### Implementation

**Next.js Root Layout**:
```tsx
<html lang="he" dir="rtl">
```

**TailwindCSS RTL Plugin**:
```js
// tailwind.config.ts
plugins: [require('tailwindcss-rtl')]
```

**Directional Utilities**:
- Use `start` and `end` instead of `left` and `right`: `ps-4` (padding-start), `ms-auto` (margin-start)
- TailwindCSS automatically flips these in RTL mode

**Custom CSS** (when needed):
```css
[dir="rtl"] .custom-element {
  /* RTL-specific overrides */
}
```

### Rationale

**Why Not CSS Logical Properties Alone**:
- **Browser support**: Logical properties (`padding-inline-start`) have spotty support in older browsers
- **TailwindCSS RTL plugin**: Provides fallbacks and more reliable cross-browser behavior

**Why Not Separate RTL Stylesheet**:
- **Maintenance burden**: Duplicate styles for LTR/RTL
- **Performance**: Larger CSS bundle
- **TailwindCSS plugin**: Handles everything automatically

---

## Performance Optimization Strategies

### Image Optimization
- **Format**: WebP with JPEG fallback (next/image handles automatically)
- **Lazy loading**: Below-fold images load only when scrolled into view
- **Responsive sizes**: `srcset` generates multiple sizes (320w, 640w, 1024w, 1920w)
- **Priority loading**: Hero image uses `priority` prop for immediate load

### Code Splitting
- **Route-based**: Each page loads only its required JavaScript
- **Component-based**: Dynamic imports for heavy components (e.g., `const ImageZoom = dynamic(() => import('./ImageZoom'))`)
- **Vendor splitting**: React, TailwindCSS, and other libraries bundled separately for caching

### Caching Strategy
- **Static assets**: Immutable cache (1 year) for images, fonts, icons
- **API responses**: Short cache (5 minutes) for product data (rarely changes)
- **HTML pages**: ISR (Incremental Static Regeneration) for homepage (revalidate every hour)

### Database Queries
- **Select only needed fields**: `prisma.order.findMany({ select: { id, status, total } })`
- **Eager loading**: Use `include` for related data to avoid N+1 queries
- **Indexing**: Add indexes on frequently queried fields (order status, created date)

### Bundle Size Budget
- **Total JS**: < 150KB gzipped (Next.js ~80KB, app code ~70KB)
- **Total CSS**: < 20KB gzipped (TailwindCSS purged)
- **Images**: < 100KB per product image (after WebP compression)

---

## Security Considerations

### Payment Security
- **No card storage**: All payment data flows through Cardcom (PCI-compliant)
- **HTTPS only**: HTTP requests redirect to HTTPS (Next.js middleware)
- **CSRF protection**: Next.js API routes include CSRF tokens

### Data Protection
- **Password hashing**: Bcrypt with salt rounds = 12 for admin passwords
- **Session management**: HTTP-only cookies, SameSite=Lax, secure flag in production
- **Rate limiting**: 100 requests/minute per IP (via Vercel Edge Middleware)

### Input Validation
- **Zod schemas**: All form inputs and API requests validated against schemas
- **Sanitization**: HTML escaping for user-generated content (customer names, addresses)
- **SQL injection prevention**: Prisma uses parameterized queries (automatic protection)

### Secrets Management
- **Environment variables**: All sensitive keys in `.env.local` (gitignored)
- **Vercel secrets**: Production secrets stored in Vercel dashboard (encrypted)
- **No hardcoded secrets**: Static analysis checks for leaked keys (via ESLint plugin)

---

## Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics**: Built-in Web Vitals tracking (LCP, FID, CLS)
- **Real User Monitoring (RUM)**: Tracks actual user performance across devices

### Error Tracking
- **Recommendation**: Sentry (not implemented initially, but easy to add)
- **Server errors**: Next.js API route errors logged to Vercel
- **Client errors**: Error boundaries catch React errors and display fallback UI

### Business Analytics
- **Google Analytics 4**: Track pageviews, checkout funnel, conversions
- **Custom events**: Add to cart, apply discount, complete purchase
- **E-commerce tracking**: Order value, product size distribution

---

## Dependency List

### Core Dependencies
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.4.0",
  "prisma": "^5.14.0",
  "@prisma/client": "^5.14.0",
  "tailwindcss": "^3.4.0",
  "zod": "^3.23.0"
}
```

### Payment & Communication
```json
{
  "resend": "^3.2.0",
  "react-email": "^2.1.0"
}
```
*Note: Cardcom integration uses REST API (no official npm package)*

### UI Components
```json
{
  "tailwindcss-rtl": "^0.9.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-select": "^2.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.3.0"
}
```

### Testing
```json
{
  "@playwright/test": "^1.44.0",
  "vitest": "^1.6.0",
  "@testing-library/react": "^15.0.0"
}
```

### Dev Tools
```json
{
  "eslint": "^8.57.0",
  "prettier": "^3.2.0",
  "prettier-plugin-tailwindcss": "^0.5.0"
}
```

**Total dependencies**: ~25 production packages (minimal, as per constitution)

---

## Migration & Deployment Strategy

### Initial Setup
1. **Repository**: Initialize Git repo, create `001-yl-sport-tights-site` branch
2. **Next.js**: `npx create-next-app@latest` with TypeScript, App Router, TailwindCSS
3. **Database**: Create Neon project, copy connection string to `.env.local`
4. **Prisma**: Initialize schema, create migrations, seed admin user
5. **Vercel**: Connect GitHub repo, configure environment variables

### Development Workflow
1. **Local development**: `npm run dev` → http://localhost:3000
2. **Database changes**: Edit `schema.prisma` → `prisma migrate dev` → commit migration files
3. **Testing**: `npm run test` (Vitest unit tests), `npm run test:e2e` (Playwright)
4. **Code quality**: `npm run lint` (ESLint), `npm run format` (Prettier)

### Deployment Process
1. **Push to branch** → Vercel creates preview deployment with unique URL
2. **Review preview** → Test on real devices, verify RTL layout
3. **Merge to main** → Automatic production deployment
4. **Database migration** → Prisma automatically runs migrations on deploy
5. **Smoke test** → Verify critical flows (homepage load, checkout, admin login)

### Rollback Plan
- **Vercel instant rollback**: Revert to previous deployment in 1 click
- **Database rollback**: Use Neon's point-in-time recovery (if schema changed)
- **Maximum downtime**: < 5 minutes (time to identify issue + click revert)

---

## Open Questions & Future Decisions

### Deferred to Implementation Phase

1. **SMS Provider Selection**:
   - **Decision needed**: Choose between Twilio, MessageBird, or Israeli provider
   - **Trigger**: When P1 SMS feature is prioritized
   - **Research required**: Cost comparison, API evaluation, carrier relationships in Israel

2. **Admin Authentication**:
   - **Current plan**: Simple session-based auth (username/password)
   - **Future consideration**: If team grows, consider NextAuth.js for SSO
   - **Trigger**: When >2 admin users needed

3. **Internationalization (i18n)**:
   - **Current scope**: Hebrew only
   - **Future consideration**: English for international customers (marked as P2 in constitution)
   - **Trigger**: If >10% traffic comes from non-Hebrew speakers

4. **Advanced Analytics**:
   - **Current scope**: Google Analytics 4 basic tracking
   - **Future consideration**: Heat mapping (Hotjar), session recording (LogRocket)
   - **Trigger**: When conversion rate needs deeper investigation

5. **Inventory Management**:
   - **Current scope**: No inventory tracking (assumption: always in stock)
   - **Future consideration**: Stock levels if product becomes limited edition
   - **Trigger**: When supply becomes constrained

---

## Constitution Compliance Verification

### Simplicity & Focus
✅ Single-product architecture enforced
✅ No over-engineering (minimal dependencies, no premature abstractions)
✅ Clear separation of concerns (app/ components/ services/ lib/)

### Performance & Accessibility
✅ Performance budget defined (FCP < 2s, Lighthouse > 90)
✅ RTL support planned from day 1
✅ Accessibility built-in (Radix UI primitives, semantic HTML)

### Trust & Professionalism
✅ Cardcom PCI-compliant payment processing
✅ HTTPS enforced
✅ Transparent pricing and policies (data retention, privacy policy)

### Excellent UX
✅ Mobile-first responsive design
✅ Real-time form validation
✅ < 1 minute order confirmation delivery

---

## Conclusion

All technology selections align with the project's core principles: **simplicity, performance, and trust**. The stack is production-proven, well-documented, and optimized for rapid development while maintaining high quality standards.

**Next Steps**:
1. ✅ Technology decisions documented (this file)
2. ⏭️ Create `data-model.md` (Prisma schema and entity documentation)
3. ⏭️ Create API contracts in `contracts/` directory (OpenAPI specs)
4. ⏭️ Create `quickstart.md` (setup and installation guide)
5. ⏭️ Generate `tasks.md` via `/speckit.tasks` command

**Last Updated**: 2025-10-21
**Version**: 1.0.0
