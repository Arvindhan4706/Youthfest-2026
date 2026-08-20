# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**Yuvenza '26 / Youthfest 2026** — the public site, registration/payment portal, attendance scanner, and admin console for Chennai Institute of Technology's youth club festival. Next.js 16 (App Router) + React 19 + Tailwind v4 + Supabase (Postgres) + Razorpay.

## Commands

```bash
npm run dev            # next dev
npm run build          # next build
npm run lint           # eslint (flat config, no args)
npm run seed           # node seed-events.js — upserts STATIC_EVENTS into the Supabase `events` table

npx ts-node verify_pending.ts    # root-level .ts maintenance scripts
node scripts/syncPayments.js     # scripts/*.js maintenance scripts
```

There is no test framework. `scripts/testDb.js` and `scripts/testRzp.js` are connectivity smoke scripts, not a suite.

Root-level `check*.ts`, `report.ts`, `normalize_events.ts`, `update_count.ts`, `send_od.ts`, and `scripts/*.js` are untracked one-off DB/Razorpay reconciliation tools. They each load `.env.local` with dotenv by hand and connect with `SUPABASE_SERVICE_ROLE_KEY` — they bypass RLS and write to production data.

## Environment

All secrets live in `.env.local` (gitignored). Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_PASSKEY`, `ADMIN_EMAILS`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. Optional: `UPSTASH_REDIS_REST_URL`/`_TOKEN` (rate limiting silently disables without them), `NEXT_PUBLIC_APP_URL` (webhooks fall back to `http://localhost:3000` when unset, which breaks receipt emails in production). `RESEND_API_KEY` is present but Resend is not used anywhere.

## Architecture

### `src/proxy.ts` — not `middleware.ts`

Next 16 renamed the middleware convention to `proxy`; its runtime is nodejs-only. It applies Upstash rate limiting (5 req/10s on `/api/*`) and security headers **including a hand-maintained CSP**. Adding any external script, font, image host, or API endpoint requires updating that CSP string or the browser will block it. It deliberately does **not** guard `/admin` — see admin auth below.

### Data access

`src/lib/database.ts` exports one `db` object; every table read/write in app code goes through it, using the anon-key client from `src/lib/supabase.ts`. Server routes that must bypass RLS build an ad-hoc service-role client inline (`require('@supabase/supabase-js')` + `SUPABASE_SERVICE_ROLE_KEY`) rather than importing a shared helper — this pattern repeats in `payment/verify`, `payment/verify-link`, `payment/webhook`, and `webhooks/razorpay`.

Tables: `visitors`, `payments`, `events`, `attendance`, `team_members`, `site_settings` (single row, id `'stats'`), `notifications`, `admin_users`, `admin_logs`.

`db.getSiteSettings`, `getAllEvents`, `getAllVisitors`, and `getAttendanceCount` swallow errors and return hardcoded fallbacks, so a broken Supabase connection surfaces as stale or empty UI rather than an exception.

### Event registrations are keyed by event **title**, not id

`visitors.registered_events` is a `string[]` of event *titles*; `payments.event_id` also holds the title. The QR payload is `email|eventTitle` and `getTicketId()` (`src/lib/utils.ts`) hashes email+title. Consequences:

- Renaming an event title orphans every existing registration, ticket, and QR code for it.
- `payment/webhook` carries hardcoded title normalization (`'INKSPIRE'` → `'Inkspire'`, `Pazhagikalam*` → `'Pazhagikalam'`) to repair titles typed manually into Razorpay.
- The scanner splits the QR payload on the *first* `|` only, so a title containing `|` would break check-in.

### Payment flow — four entry points that must stay in sync

Every path performs the same three writes: set `visitors.payment_status = 'paid'`, append the title to `registered_events`, and flip the `payments` row to `successful`. Changing that logic in one place and not the others causes silent divergence.

1. **Checkout** — `PaymentModal` → `POST /api/payment/create-order` (inserts a `pending` payments row, stashes `email`/`eventTitle` in the Razorpay order `notes`) → Razorpay Checkout JS → `POST /api/payment/verify` (HMAC over `order_id|payment_id` with `RAZORPAY_KEY_SECRET`). This path also inserts `team_members`.
2. **`POST /api/payment/webhook`** — `payment.captured` / `payment.authorized`. Falls back to looking up the `payments` row by `order_id` when `notes` are absent, then fires `/api/send-receipt`.
3. **`POST /api/webhooks/razorpay`** — a *separate* handler for `payment_link.paid` / `order.paid` / `payment.captured`.
4. **`POST /api/payment/verify-link`** — Razorpay Payment Links, verified with `validatePaymentVerification` from the razorpay SDK.

Both webhooks read `await req.text()` before parsing — the HMAC is computed over the raw body, so never switch them to `req.json()`.

### Auth

**Visitors have no password or server session.** Identity is email + phone (`db.login`). Google sign-in uses `supabase.auth.signInWithOAuth` purely to resolve a verified email; `/api/auth/google-callback` then checks the `visitors` table and routes new users to `/auth/complete-profile` → `/api/auth/register`. Client state lives in the zustand store (`src/lib/useStore.ts`) persisted to `localStorage` under `yuvenza-storage`, with a 10-minute inactivity logout driven by `useAutoLogout` and the `y26_last_active` timestamp.

**Admin is passkey-based and enforced per-request, not by session.** `/admin` posts email + `ADMIN_PASSKEY` to `/api/auth/admin-secure`, which validates the passkey, looks the email up in `admin_users` for a role (`Super Admin | Editor | Scanner | Viewer`), and auto-seeds that table from `ADMIN_EMAILS` when it is empty. The passkey then stays in React state and is re-sent as `adminPasskey` in the body of every privileged call (`admin/broadcast`, `admin/refund`, `admin/notify`, `admin/razorpay-stats`), each of which re-checks it. Tab visibility by role is client-side only. `/api/settings/update` and `/api/seed-events` currently have no auth check at all.

### Email and PDFs

`src/lib/mailer.ts` returns a nodemailer transport over Gmail SMTP (port 465). PDFs are drawn server-side with `pdf-lib`: `/api/send-ticket` (ticket; embeds logos read from `public/` with `fs`) and `/api/send-od` (on-duty permission letter). QR codes are generated client-side with `qrcode` for display, while `/api/qr` proxies quickchart.io for embedding into PDFs and emails.

### Frontend composition

The homepage is a vertical stack of "scenes" (`src/components/scenes/`), each imported with `dynamic(..., { ssr: false })` and wrapped in `<LazyScene>`, which mounts on IntersectionObserver — a deliberate iOS memory measure, not incidental. Nearly every component is `'use client'`. `GlobalClientProviders` (mounted in `layout.tsx`) owns the Navbar, toasts, `AuthModal`, `PaymentModal`, and Lenis smooth scroll, and hides the Navbar on `/profile`, `/admin`, and `/scanner`.

`src/app/admin/page.tsx` (~1300 lines) is the entire admin console: visitors, events CRUD, payments/refunds, admin users, logs, broadcasts, and settings as client-side tabs.

### The event catalog is duplicated in four places

The same event list exists in `seed-events.js`, `src/app/api/seed-events/route.ts`, a hardcoded fallback array inside `EventShowcaseScene.tsx`, and the live `events` table (edited via the admin console). The showcase merges DB rows *over* its fallback array. These lists have already drifted apart (differing titles, ids, and fees) — when changing the catalog, decide which is authoritative rather than assuming they match.

### Styling

Tailwind v4 with no `tailwind.config`. The theme is defined in `@theme inline` inside `src/app/globals.css`: `--neon-cyan/-magenta/-violet/-gold/-lime` tokens, glass surfaces, Inter + Space Grotesk via `next/font`, and a large set of custom device-width breakpoints (`320`–`4xl`). `components.json` targets shadcn but only a few hand-written primitives exist in `src/components/ui`.
