# Quickstart Guide: YL Sport Tights E-Commerce Website

**Feature**: YL Sport Tights E-Commerce Website
**Branch**: 001-yl-sport-tights-site
**Last Updated**: 2025-10-21

## Overview

This guide will help you set up the YL Sport Tights development environment from scratch. You'll be able to run the application locally, create orders, test the payment flow (sandbox mode), and access the admin dashboard.

**Estimated Setup Time**: 30-45 minutes

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Tool | Minimum Version | Download Link | Verification Command |
|------|-----------------|---------------|---------------------|
| **Node.js** | 18.x LTS or higher | [nodejs.org](https://nodejs.org/) | `node --version` |
| **npm** | 9.x or higher | Included with Node.js | `npm --version` |
| **Git** | 2.x or higher | [git-scm.com](https://git-scm.com/) | `git --version` |
| **VS Code** | Latest (recommended) | [code.visualstudio.com](https://code.visualstudio.com/) | - |

### Optional but Recommended

- **pnpm** (alternative to npm, faster): `npm install -g pnpm`
- **VS Code Extensions**:
  - Prisma (for schema.prisma syntax highlighting)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

---

## Account Setup

You'll need accounts for external services:

### 1. Neon (Database)

**Purpose**: Serverless PostgreSQL database hosting

**Steps**:
1. Visit [neon.tech](https://neon.tech/)
2. Sign up with GitHub account (recommended) or email
3. Create a new project:
   - Project name: `yl-sport-production` (or `yl-sport-dev` for development)
   - Region: Select closest to your target audience (e.g., AWS eu-central-1 for Israel/Europe)
   - PostgreSQL version: 15 (latest stable)
4. Copy the connection string from project dashboard:
   ```
   postgresql://username:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require
   ```
5. Save this for later (you'll add it to `.env.local`)

**Cost**: Free tier includes 3 GB storage, sufficient for initial launch

### 2. Resend (Email Service)

**Purpose**: Transactional email sending (order confirmations, shipping notifications)

**Steps**:
1. Visit [resend.com](https://resend.com/)
2. Sign up with GitHub account or email
3. Create API key:
   - Go to "API Keys" in dashboard
   - Click "Create API Key"
   - Name: `YL Sport Development`
   - Permissions: Full Access (for development)
   - Copy the key (starts with `re_...`)
4. Add sending domain (optional for development, required for production):
   - Go to "Domains"
   - Add your domain (e.g., `yl-sport.com`)
   - Follow DNS verification steps
   - For development, you can use Resend's test domain (`onboarding@resend.dev`)

**Cost**: Free tier includes 100 emails/day (3000/month), sufficient for development and early launch

### 3. Cardcom (Payment Gateway)

**Purpose**: Israeli payment processing

**Steps**:
1. **For Development (Sandbox)**:
   - Contact Cardcom sales: [cardcom.co.il](https://www.cardcom.co.il/contact/)
   - Request sandbox account for development
   - You'll receive:
     - Terminal number
     - API username
     - API password (or API key)
     - Sandbox URL: `https://secure.cardcom.solutions/Interface/LowProfile.aspx`

2. **For Production**:
   - Complete Cardcom merchant application
   - Provide business registration documents
   - Receive production credentials (same format as sandbox)

**Cost**: ~2.5% per transaction + monthly fee (varies by merchant agreement)

**Note**: For initial development, you can stub out Cardcom integration and implement later. See "Development Without Cardcom" section below.

### 4. Vercel (Hosting) - Optional for Local Development

**Purpose**: Deployment and hosting (only needed when deploying, not for local development)

**Steps**:
1. Visit [vercel.com](https://vercel.com/)
2. Sign up with GitHub account
3. Connect your GitHub repository (after code is pushed)
4. Configure environment variables in Vercel dashboard

**Cost**: Free tier includes unlimited projects, 100 GB bandwidth/month

---

## Installation

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/yl-sport.git
cd yl-sport

# Switch to feature branch
git checkout 001-yl-sport-tights-site
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm (faster)
pnpm install
```

**Expected Duration**: 2-3 minutes

### Step 3: Environment Variables Setup

Create `.env.local` file in the project root:

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require"

# Cardcom Payment Gateway (Sandbox)
CARDCOM_TERMINAL_NUMBER="your_terminal_number"
CARDCOM_API_USERNAME="your_api_username"
CARDCOM_API_PASSWORD="your_api_password"
CARDCOM_API_URL="https://secure.cardcom.solutions/Interface/LowProfile.aspx"
CARDCOM_MODE="sandbox" # Change to "production" when going live

# Resend Email Service
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="YL Sport <noreply@yl-sport.com>" # Or use "onboarding@resend.dev" for testing

# Admin Credentials (change these!)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ChangeMe123!" # Must be 8+ characters, strong password for production

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Change to production URL when deploying
NODE_ENV="development"

# Session Secret (generate a random string)
SESSION_SECRET="your_random_secret_here_min_32_characters"

# Optional: SMS Service (leave blank if not configured yet)
# SMS_PROVIDER="twilio" # or "messagebird", "inforu"
# SMS_API_KEY=""
# SMS_PHONE_NUMBER="" # Your sending phone number

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="" # Google Analytics 4 Measurement ID
```

**Generate SESSION_SECRET**:
```bash
# Generate random 32-character string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Database Setup

Initialize Prisma and create database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev --name init

# Seed initial data (admin user, sample discount codes)
npx prisma db seed
```

**Expected Output**:
```
✅ Admin user created: admin
✅ Discount code created: LAUNCH50
✅ Discount code created: SUMMER20
```

**Verify Database**:
```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

Visit `http://localhost:5555` to browse database tables.

### Step 5: Run Development Server

```bash
# Start Next.js development server
npm run dev

# OR with pnpm
pnpm dev
```

**Expected Output**:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

Visit [http://localhost:3000](http://localhost:3000) to see the homepage.

---

## Verify Setup

Follow these steps to ensure everything is working correctly:

### 1. Homepage Load

- Navigate to [http://localhost:3000](http://localhost:3000)
- **Expected**: Homepage loads with YL Sport Tights product information
- **Check**: No console errors in browser DevTools

### 2. Checkout Flow

1. Select product size (e.g., M)
2. Click "הוסף לעגלה" (Add to Cart)
3. Fill out checkout form:
   - Name: שרה כהן
   - Email: test@example.com
   - Phone: 0501234567
   - Address: רחוב הרצל 25
   - City: תל אביב
   - Postal Code: 6522301
   - Shipping method: Standard Delivery
4. Apply discount code: `LAUNCH50`
5. **Expected**: Discount applied, total updated (299 - 50 + 30 = 279 ILS)

### 3. Payment Flow (Sandbox Mode)

1. Click "Continue to Payment"
2. **Expected**: Redirected to Cardcom sandbox page
3. Enter test card (provided by Cardcom):
   - Card number: 4580000000000000 (or provided test card)
   - Expiry: 12/25
   - CVV: 123
4. Submit payment
5. **Expected**: Redirected to order confirmation page with order number

### 4. Email Notification (Development)

**Note**: In development, emails are logged to console instead of sent (unless Resend is configured)

- Check terminal/console for email preview:
  ```
  📧 Email sent to test@example.com
  Subject: אישור הזמנה #001
  Preview: http://localhost:3000/api/email-preview/...
  ```

### 5. Admin Dashboard

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with credentials from `.env.local`:
   - Username: `admin`
   - Password: `ChangeMe123!`
3. **Expected**: Redirected to admin dashboard
4. **Verify**:
   - Orders list shows your test order
   - Order detail page shows customer info, product details
   - Can update order status to "Processing" → "Shipped" (with tracking number)
   - Analytics page shows total orders and revenue

### 6. Discount Code Management

1. In admin dashboard, navigate to "ניהול קופונים" (Manage Coupons)
2. **Expected**: See `LAUNCH50` and `SUMMER20` codes
3. Try creating a new code:
   - Code: TEST10
   - Type: Percentage
   - Value: 10
   - Valid from: Today
   - Valid until: +30 days
   - Active: Yes
4. **Expected**: Code created successfully
5. Test code at checkout (repeat checkout flow with `TEST10`)

---

## Common Issues & Troubleshooting

### Issue: Database Connection Failed

**Error**: `PrismaClientInitializationError: Can't reach database server`

**Solutions**:
1. Verify `DATABASE_URL` in `.env.local` is correct
2. Check Neon project is active (not hibernated on free tier)
3. Ensure network allows outbound connections to Neon (check firewall)
4. Try regenerating connection string in Neon dashboard

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1"
```

### Issue: Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npx prisma generate
```

### Issue: Next.js Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
1. Kill process on port 3000:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
2. Or run on different port:
   ```bash
   npm run dev -- -p 3001
   ```

### Issue: Environment Variables Not Loaded

**Symptom**: Features not working despite correct `.env.local`

**Solutions**:
1. Restart development server (environment variables only load on startup)
2. Verify `.env.local` is in project root (same directory as `package.json`)
3. Check for typos in variable names (they're case-sensitive)

### Issue: Resend Emails Not Sending

**Error**: `403 Forbidden` from Resend API

**Solutions**:
1. Verify API key is correct and hasn't expired
2. Check sending email domain is verified in Resend dashboard
3. For development, use Resend's test domain:
   ```env
   RESEND_FROM_EMAIL="onboarding@resend.dev"
   ```

### Issue: Cardcom Redirect Not Working

**Error**: `400 Bad Request` when redirecting to Cardcom

**Solutions**:
1. Verify Cardcom credentials are correct (terminal number, username, password)
2. Check you're using sandbox URL in development:
   ```env
   CARDCOM_API_URL="https://secure.cardcom.solutions/Interface/LowProfile.aspx"
   CARDCOM_MODE="sandbox"
   ```
3. Ensure callback URL is accessible (use ngrok for local testing if Cardcom requires public URL)

### Issue: Styles Not Loading (Tailwind CSS)

**Symptom**: Page loads but has no styling

**Solutions**:
1. Ensure TailwindCSS is configured in `tailwind.config.ts`
2. Verify `globals.css` imports Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart development server

---

## Development Without External Services

You can develop without full external service setup:

### Cardcom (Payment) Stubbed

Comment out Cardcom integration and mock payment success:

```typescript
// lib/cardcom.ts
export async function redirectToCardcom(orderId: string) {
  // TODO: Replace with actual Cardcom integration
  console.log('⚠️ STUB: Cardcom redirect for order:', orderId)

  // Simulate successful payment after 2 seconds
  setTimeout(async () => {
    await fetch(`/api/payment/cardcom-callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        InternalDealNumber: orderId,
        OperationResponse: '0', // Success
        Amount: '279.00'
      })
    })
  }, 2000)

  return '/order-confirmation?orderNumber=001'
}
```

### Resend (Email) Stubbed

Log emails to console instead of sending:

```typescript
// lib/resend.ts
export async function sendEmail(to: string, subject: string, html: string) {
  console.log('📧 Email (not sent, development mode):')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Preview:', html.substring(0, 200) + '...')
  return { success: true }
}
```

### SMS Stubbed

SMS is already optional (mark as P1, not P0). Leave SMS variables blank in `.env.local`.

---

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/checkout.spec.ts
```

**Important**: E2E tests require development server to be running.

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e
```

---

## Code Quality Checks

Before committing code, run these checks:

### Linting (ESLint)

```bash
# Check for linting errors
npm run lint

# Auto-fix errors
npm run lint:fix
```

### Formatting (Prettier)

```bash
# Check formatting
npm run format:check

# Auto-format all files
npm run format
```

### Type Checking (TypeScript)

```bash
# Check types
npm run type-check
```

### All Checks at Once

```bash
# Run linting, formatting, type-checking, and tests
npm run validate
```

---

## Database Management

### View Database Schema

```bash
# Open Prisma Studio (GUI)
npx prisma studio
```

### Create New Migration

After changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name description_of_change
```

Example:
```bash
npx prisma migrate dev --name add_customer_notes_field
```

### Reset Database (Development Only)

**⚠️ WARNING: This deletes all data!**

```bash
npx prisma migrate reset
```

This will:
1. Drop all tables
2. Re-run all migrations
3. Run seed script

### Seed Database with Sample Data

```bash
npx prisma db seed
```

---

## Building for Production

### Local Production Build

Test production build locally:

```bash
# Create production build
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to test production build.

### Environment Variables for Production

Update `.env.local` (or Vercel environment variables):

```env
# Change these for production
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yl-sport.com"
CARDCOM_MODE="production"
CARDCOM_API_URL="https://secure.cardcom.solutions/Interface/LowProfile.aspx"

# Use production Cardcom credentials
CARDCOM_TERMINAL_NUMBER="your_production_terminal"
CARDCOM_API_USERNAME="your_production_username"
CARDCOM_API_PASSWORD="your_production_password"

# Use verified domain for emails
RESEND_FROM_EMAIL="YL Sport <noreply@yl-sport.com>"

# Strong admin password
ADMIN_PASSWORD="your_very_strong_password_here"

# Production database
DATABASE_URL="postgresql://..."

# Production session secret (different from development)
SESSION_SECRET="different_random_secret_for_production"
```

---

## Deployment to Vercel

### First-Time Deployment

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Initial YL Sport Tights implementation"
   git push origin 001-yl-sport-tights-site
   ```

2. Visit [vercel.com](https://vercel.com/), click "Import Project"

3. Select your GitHub repository

4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add environment variables in Vercel dashboard (same as `.env.local`, but production values)

6. Click "Deploy"

**Expected Duration**: 2-3 minutes

### Subsequent Deployments

Automatic deployment on every push to main branch:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel automatically builds and deploys.

---

## Next Steps

After setup is complete:

1. **Customize Content**:
   - Replace placeholder product images in `/public/images/product/`
   - Update founder photo (`/public/images/founder/yifat.jpg`)
   - Edit product description in homepage component
   - Update testimonials with real customer feedback

2. **Configure Brand Colors**:
   - Edit `tailwind.config.ts` to use exact brand colors
   - Update Teal (#00BFA6), Coral (#FF6B6B), and Secondary (#E0F7F4) shades if needed

3. **Test RTL Layout**:
   - Verify all components render correctly in Hebrew RTL
   - Test on mobile devices (iOS Safari, Chrome Android)

4. **Set Up Monitoring**:
   - Configure Google Analytics 4 (add `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
   - Optional: Set up Sentry for error tracking

5. **Legal Pages**:
   - Draft privacy policy (consult legal advisor)
   - Draft terms of service
   - Draft shipping & returns policy
   - Add FAQ content

6. **Production Checklist** (before going live):
   - [ ] Update environment variables to production values
   - [ ] Test Cardcom production payment flow
   - [ ] Verify Resend domain is verified
   - [ ] Change admin password to strong password
   - [ ] Add Google Analytics
   - [ ] Test on real mobile devices
   - [ ] Run Lighthouse audit (target 90+ scores)
   - [ ] Set up domain DNS records
   - [ ] SSL certificate active (Vercel handles automatically)
   - [ ] GDPR privacy policy published
   - [ ] Test order fulfillment workflow (admin → customer)

---

## Support & Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Cardcom API Documentation](https://developers.cardcom.co.il/)
- [Resend Documentation](https://resend.com/docs)

### Project Files

- **Spec**: `/specs/001-yl-sport-tights-site/spec.md`
- **Data Model**: `/specs/001-yl-sport-tights-site/data-model.md`
- **API Contracts**: `/specs/001-yl-sport-tights-site/contracts/`
- **Research**: `/specs/001-yl-sport-tights-site/research.md`

### Need Help?

- Check `README.md` in project root
- Review constitution: `.specify/memory/constitution.md`
- Check [GitHub Issues](https://github.com/your-username/yl-sport/issues)

---

## Summary

You should now have:

✅ Local development environment running
✅ Database connected and seeded
✅ Admin dashboard accessible
✅ Checkout flow functional (with sandbox payment)
✅ Email notifications configured
✅ Tests passing

**Ready to develop!** 🚀

**Last Updated**: 2025-10-21
**Version**: 1.0.0
