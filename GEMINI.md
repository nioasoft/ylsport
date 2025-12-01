# YL-SPORT - Gemini Context

This file provides context and instructions for the Gemini AI agent working on the YL-SPORT project.

## Project Overview

**YL-SPORT** is a focused, single-product e-commerce website for selling high-quality women's sport tights. It is a full-stack Next.js application designed for the Israeli market (Hebrew, RTL).

### Key Technologies
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript (Strict mode)
*   **Styling:** Tailwind CSS (RTL support), Shadcn UI
*   **Database:** PostgreSQL (via Neon/Supabase), Prisma ORM
*   **State Management:** React Hook Form (Forms), Server Actions (Data mutations)
*   **Integrations:**
    *   **Payment:** Cardcom (Israeli gateway)
    *   **Email:** Resend
    *   **SMS:** Shlach Meser

## Directory Structure

*   `app/`: Next.js App Router pages and API routes.
    *   `api/`: Backend API routes (Admin, Orders, Payment callbacks).
    *   `admin/`: Admin dashboard routes.
    *   `checkout/`: Checkout flow.
*   `components/`: Reusable React components.
    *   `ui/`: Shadcn UI primitives.
    *   `home/`: Landing page sections (Hero, Benefits, etc.).
    *   `checkout/`: Order and shipping forms.
*   `lib/`: Utility functions, database clients, and shared logic.
    *   `prisma.ts`: Prisma client instance.
    *   `cardcom.ts`: Payment gateway integration.
*   `prisma/`: Database schema (`schema.prisma`) and seed scripts.
*   `public/`: Static assets (images, fonts).
*   `specs/`: Project specifications and feature requirements.
*   `types/`: TypeScript type definitions.

## Development Workflow

### Commands
*   **Start Development Server:** `npm run dev`
*   **Build for Production:** `npm run build`
*   **Linting:** `npm run lint`
*   **Formatting:** `npm run format`
*   **Unit Tests:** `npm test` (Vitest)
*   **E2E Tests:** `npm run test:e2e` (Playwright)
*   **Database Sync:** `npx prisma db push` (Sync schema with DB)
*   **Database Studio:** `npx prisma studio` (GUI for DB)

### Conventions & Standards

1.  **Strict TypeScript:** All code must be strongly typed. Avoid `any` where possible.
2.  **RTL Support:** Ensure all UI components support Right-to-Left text direction. Use logical properties (e.g., `ms-`, `me-`) in Tailwind where appropriate.
3.  **Server Actions:** Prefer Server Actions for data mutations (form submissions) over standard API routes where applicable.
4.  **Validation:** Use Zod schemas for all form validations (client-side via `react-hook-form` and server-side).
5.  **Environment Variables:** Access sensitive config via `process.env`. See `.env.example` for required keys.
6.  **Component Structure:** Group components by feature (e.g., `components/checkout`) unless generic (`components/ui`).

## Feature Specifics

*   **Payment Flow:** The checkout process redirects to an external Cardcom payment page. Validation relies on a secure server-to-server callback verified by IP whitelist and amount check.
*   **Admin Area:** Accessed via `/admin`. protected by simple session-based auth. Allows order management and discount code creation.
*   **Discounts:** Supported via the `DiscountCode` model. Applied at checkout.

## Future Context
When adding new features or modifying existing ones, always refer to `specs/` for business logic and `prisma/schema.prisma` for data modeling constraints.
