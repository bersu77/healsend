# Next Developer Handoff

Snapshot date: `2026-03-29`

This document is the fastest way for the next developer to understand the current state of the HealSend replacement app.

## What This Project Is

This repo is a Next.js app that is replacing a WordPress + WooCommerce HealSend site, while also taking over:

- public marketing pages
- product/category/catalog routing
- funnel/onboarding flows
- checkout and post-purchase flows
- patient account/dashboard surfaces
- admin dashboard
- MDI-backed medical workflow surfaces
- affiliate attribution and conversion tracking

The preview environment currently used for active testing is:

- `https://healsend.barikhan.studio`

## Start Here

Read these files before making assumptions:

1. [docs/README.md](../README.md)
2. [docs/architecture/system-overview.md](../architecture/system-overview.md)
3. [docs/architecture/domain-flows.md](../architecture/domain-flows.md)
4. [docs/operations/deployment-and-verification.md](../operations/deployment-and-verification.md)
5. [docs/operations/open-issues-and-next-steps.md](../operations/open-issues-and-next-steps.md)

Then inspect these code files:

- [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx)
- [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- [src/components/marketing/product-page.jsx](../../src/components/marketing/product-page.jsx)
- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/lib/stripe-payment-workflow.js](../../src/lib/stripe-payment-workflow.js)
- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)
- [src/app/consultation/[orderId]/page.jsx](../../src/app/consultation/[orderId]/page.jsx)
- [src/app/dashboard/onboarding/page.jsx](../../src/app/dashboard/onboarding/page.jsx)
- [src/app/dashboard/homepage/page.jsx](../../src/app/dashboard/homepage/page.jsx)
- [src/lib/affiliate-tracking.js](../../src/lib/affiliate-tracking.js)

## Current High-Level State

## What is working well

- public marketing/catalog shell is largely in place
- most WordPress URL parity work is done
- dynamic marketing/product/category/article routing is live
- patient-facing checkout works again on preview
- funnel checkout mode is now a real enforced system
- the legacy `Tell us about your health` intake step is now stripped from funnel templates at runtime and admin template reads
- Stripe embedded card checkout works in both funnel pricing modes
- MDI patient-facing intake launch works on preview
- patient dashboard now surfaces MDI questionnaire/intake status better
- affiliate tracking now spans source -> funnel -> checkout -> payment -> patient journey
- preview deploy flow is stable and repeatable
- homepage hero and split-feature content can now be edited from the dashboard in a structured way
- funnel auth is now native inside the `ACCOUNT_CREATE` step, with login/signup modes instead of a late redirect-only handoff

## What is still sensitive

- MDI is repo-strong but still staging/provider-sensitive
- Klarna still depends on Stripe account activation/readiness in the target account
- some legacy/test/seed data can confuse patient surfaces if not filtered carefully
- marketing data loading is centralized but dense; careless changes in [marketing-data.js](../../src/lib/marketing-data.js) can affect many routes
- preview deployment must preserve `deploy/.env.preview` on the VPS

## Functional Notes That Matter

### Auth

- public auth is now a shared homepage offcanvas drawer, not a standalone page experience
- `/login` and `/signup` still exist, but they server-redirect into `/?auth=login` and `/?auth=signup`
- protected routes should keep using [src/lib/auth-routing.js](../../src/lib/auth-routing.js) so redirects stay consistent
- Google and Apple sign-in are surfaced from the same drawer when the environment enables them
- funnel auth is separate from the public drawer now: the onboarding `ACCOUNT_CREATE` step renders native `Log in` and `Create account` modes in-step
- if checkout/submission detects missing auth, the funnel now jumps back to that native account step instead of routing the user away from the funnel

Main files:

- [src/lib/auth-routing.js](../../src/lib/auth-routing.js)
- [src/components/auth/AuthPageShell.jsx](../../src/components/auth/AuthPageShell.jsx)
- [src/components/auth/LoginPageClient.jsx](../../src/components/auth/LoginPageClient.jsx)
- [src/components/auth/SignupPageClient.jsx](../../src/components/auth/SignupPageClient.jsx)
- [src/app/login/page.jsx](../../src/app/login/page.jsx)
- [src/app/signup/page.jsx](../../src/app/signup/page.jsx)

### Payments and funnel checkout mode

- checkout pricing mode is centralized in [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)
- the two supported modes are:
  - `UPFRONT_ZERO`
  - `ALL_AT_ONCE`
- current enforced behavior:
  - `UPFRONT_ZERO`
    - `Due today = $0`
    - embedded cards use `capture_method: "manual"`
    - Klarna / Afterpay are blocked
  - `ALL_AT_ONCE`
    - `Due today = full total`
    - embedded cards use `capture_method: "automatic"`
    - Klarna / Afterpay hosted sessions are allowed
- card/link and BNPL are intentionally different flows now
- order/submission metadata persists the chosen checkout pricing mode
- the funnel shell header is now full-width with `Back` on the left, centered logo, and a `Next` control on the right only when revisiting already-completed steps

Main files:

- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)
- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/api/onboarding-submissions/route.js](../../src/app/api/onboarding-submissions/route.js)

### BNPL reality

- Afterpay/Clearpay is on the real hosted-session path
- Klarna is also on the real hosted-session path
- Klarna is currently guarded server-side so inactive Stripe accounts fail in-app instead of sending users to a dead hosted page
- do not assume Klarna failure is always a code bug; Stripe account readiness and buyer/session eligibility matter here

Main files:

- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)

### MDI

- MDI is not just "open a consultation iframe"
- the real state model is now:
  - patient linkage
  - order linkage
  - case snapshot
  - consultation URL/status
  - webhook-driven lifecycle projection
- MDI still asks its own questionnaire, even after our funnel
- that is expected; our funnel is not the same as MDI's medical/compliance intake
- the dashboard/account supports the "resume questionnaire / continue portal" style UX more explicitly
- the continuation shell is now the local consultation route, which embeds the provider portal in an iframe

Main files:

- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/create-consultation/route.js](../../src/app/api/create-consultation/route.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/api/mdi/partner-auth/complete/route.js](../../src/app/api/mdi/partner-auth/complete/route.js)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)
- [src/app/consultation/[orderId]/page.jsx](../../src/app/consultation/[orderId]/page.jsx)

### Marketing/product routing

- the public route layer is centralized through [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx)
- product/category/custom page resolution is mostly driven by [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- the homepage now supports structured DB-backed content overrides via `MarketingPage.slug = "home"`
- aliases and canonical product paths are handled in:
  - [src/lib/marketing-pages.js](../../src/lib/marketing-pages.js)
  - [src/lib/product-routing.js](../../src/lib/product-routing.js)
- native synthetic product content and imported WordPress-backed content both funnel through the same loader

Main files:

- [src/app/page.jsx](../../src/app/page.jsx)
- [src/components/marketing/home-page.jsx](../../src/components/marketing/home-page.jsx)
- [src/app/api/marketing-pages/home/route.js](../../src/app/api/marketing-pages/home/route.js)
- [src/app/dashboard/homepage/page.jsx](../../src/app/dashboard/homepage/page.jsx)

### Affiliate marketing

- this is no longer just a placeholder dashboard page
- tracking currently includes:
  - page views
  - affiliate source/touch/session cookies
  - funnel step views/completions
  - payment milestones
  - patient journey milestones
  - attributed orders, revenue, consultation readiness, subscription activation
- the admin page is meant to help answer:
  - where users came from
  - where they dropped
  - whether they reached checkout
  - whether they paid
  - whether they became MDI-ready / activated

Main files:

- [src/lib/affiliate-tracking.js](../../src/lib/affiliate-tracking.js)
- [src/lib/affiliate-tracking-client.js](../../src/lib/affiliate-tracking-client.js)
- [src/lib/NavigationTracker.jsx](../../src/lib/NavigationTracker.jsx)
- [src/app/api/affiliate/track/route.js](../../src/app/api/affiliate/track/route.js)
- [src/app/dashboard/affiliate-marketing/page.jsx](../../src/app/dashboard/affiliate-marketing/page.jsx)

### Funnel admin UI

- `/dashboard/funnels` is the public admin route, but it exports the same implementation as `/dashboard/onboarding`
- the checkout-mode dropdown exists in:
  - list view
  - create flow
  - edit flow
- saving state/spinners were added so mode changes are visible and locked while updating
- checkout-mode changes are now enforced by the real checkout APIs, not just stored as decorative styling

Main files:

- [src/app/dashboard/funnels/page.jsx](../../src/app/dashboard/funnels/page.jsx)
- [src/app/dashboard/onboarding/page.jsx](../../src/app/dashboard/onboarding/page.jsx)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)

## Recent Important Functional Fixes

- restored the missing PT-141 combo product page at `/pt-141-surge-2-in-1`
- old slug `/pt-141-oxytocin-nasal-sprays` now redirects into the restored canonical page
- affiliate source-performance summary now includes funnel completions, checkout starts, captured revenue, consultation readiness, and subscription activation
- patient account UI filters internal/test artifacts more aggressively
- guest users can now go through funnels without losing progress when they are forced to log in near checkout
- auth now routes through a shared homepage drawer instead of a separate page experience
- patient portal continuation now uses the local consultation iframe shell
- funnel checkout pricing mode is enforced end-to-end

## Test Credentials

These come from the dev seed scripts.

### Admin

- email: `admin@healsend.com`
- password: `Admin123!`

### Demo customer

- email: `demo@healsend.com`
- password: `Demo123!`

Important note:

- preview data is not always a clean dev seed snapshot
- do not assume preview equals local bootstrap exactly
- if account/order state looks strange, check whether the record is old seed data, payload-verifier data, or live preview test data

## Data Model Notes

Important Prisma models:

- `User`
- `Order`
- `Subscription`
- `OnboardingTemplate`
- `OnboardingSubmission`
- `Product`
- `MarketingPage`
- `MdiWebhookEvent`
- `MdiCaseSnapshot`
- `StripeWebhookEvent`
- `AffiliateSession`
- `AffiliateEvent`

See:

- [prisma/schema.prisma](../../prisma/schema.prisma)

## Safe Working Rules For The Next Dev

- do not casually rewrite [src/lib/marketing-data.js](../../src/lib/marketing-data.js); it is a central routing/content adapter
- do not assume a slug is dead just because one route 404s; check alias maps and custom/native fallbacks first
- do not treat MDI questionnaire duplication as a pure bug; some of it is expected provider intake behavior
- do not assume non-card payment methods can use the delayed-capture card pattern
- keep patient-facing UI free of internal ids like `mdi-payload-*`, `DEV-*`, seeded test case ids, or raw webhook wording
- preserve `deploy/.env.preview` on the server during preview deploys
- if Klarna fails, check Stripe account readiness before rewriting the hosted-flow code

## If You Are An AI Assistant Picking This Up

Use this order:

1. read [docs/handoff/2026-03-29-next-developer-handoff.md](./2026-03-29-next-developer-handoff.md)
2. read [docs/architecture/system-overview.md](../architecture/system-overview.md)
3. read [docs/architecture/domain-flows.md](../architecture/domain-flows.md)
4. read [docs/operations/open-issues-and-next-steps.md](../operations/open-issues-and-next-steps.md)
5. only then inspect the relevant code files

When changing things:

- prefer narrow fixes over broad rewrites
- verify route resolution before changing marketing slugs
- verify patient/account surfaces with seeded/demo users
- verify both the preview route and the canonical route when fixing aliases
- for checkout changes, verify both funnel pricing modes before declaring the flow fixed

## One-Line Summary

This app is already a strong functional replacement for most of the WordPress public/commercial surface, but it is still an integration-heavy system where MDI/provider behavior, Stripe hosted-payment readiness, and patient-safe wording need careful handling.
