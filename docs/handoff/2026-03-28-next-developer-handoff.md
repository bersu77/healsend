# Next Developer Handoff

Superseded by [2026-03-29-next-developer-handoff.md](./2026-03-29-next-developer-handoff.md). This file is kept as history, but the newer handoff reflects the current auth drawer, iframe patient portal, funnel checkout-mode enforcement, and hosted BNPL behavior.

Snapshot date: `2026-03-28`

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
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/lib/stripe-payment-workflow.js](../../src/lib/stripe-payment-workflow.js)
- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)
- [src/lib/affiliate-tracking.js](../../src/lib/affiliate-tracking.js)

## Current High-Level State

## What is working well

- public marketing/catalog shell is largely in place
- most WordPress URL parity work is done
- dynamic marketing/product/category/article routing is live
- patient-facing checkout works again on preview
- Stripe payment architecture is now delayed-capture for cards
- MDI patient-facing intake launch works on preview
- patient dashboard now surfaces MDI questionnaire/intake status better
- affiliate tracking now spans source -> funnel -> checkout -> payment -> patient journey
- preview deploy flow is stable and repeatable

## What is still sensitive

- MDI is repo-strong but still staging/provider-sensitive
- some legacy/test/seed data can confuse patient surfaces if not filtered carefully
- marketing data loading is centralized but dense; careless changes in [marketing-data.js](../../src/lib/marketing-data.js) can affect many routes
- preview deployment must preserve `deploy/.env.preview` on the VPS

## Functional Notes That Matter

### Payments

- the current payment model is authorize first, capture later
- checkout creates Stripe PaymentIntents with:
  - `capture_method: "manual"`
  - `setup_future_usage: "off_session"`
  - `payment_method_types: ["card"]`
- this is designed for cards
- do not assume Klarna or BNPL methods behave the same way
- MDI/provider approval is what should trigger capture
- rejection/cancellation should release the authorization hold instead

Main files:

- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/checkout/route.js](../../src/app/api/checkout/route.js)
- [src/lib/stripe-payment-workflow.js](../../src/lib/stripe-payment-workflow.js)
- [src/app/api/webhooks/stripe/route.js](../../src/app/api/webhooks/stripe/route.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)

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
- the dashboard now supports the "resume questionnaire / continue portal" style UX more explicitly

Main files:

- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/create-consultation/route.js](../../src/app/api/create-consultation/route.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/api/mdi/partner-auth/complete/route.js](../../src/app/api/mdi/partner-auth/complete/route.js)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)

### Marketing/product routing

- the public route layer is centralized through [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx)
- product/category/custom page resolution is mostly driven by [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- aliases and canonical product paths are handled in:
  - [src/lib/marketing-pages.js](../../src/lib/marketing-pages.js)
  - [src/lib/product-routing.js](../../src/lib/product-routing.js)
- native synthetic product content and imported WordPress-backed content both funnel through the same loader

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

## Recent Important Functional Fixes

- restored the missing PT-141 combo product page at `/pt-141-surge-2-in-1`
- old slug `/pt-141-oxytocin-nasal-sprays` now redirects into the restored canonical page
- affiliate source-performance summary now includes funnel completions, checkout starts, captured revenue, consultation readiness, and subscription activation
- patient account UI filters internal/test artifacts more aggressively
- MDI patient portal links now open in a new tab
- guest users can now go through funnels without losing progress when they are forced to log in near checkout

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

## If You Are An AI Assistant Picking This Up

Use this order:

1. read [docs/handoff/2026-03-28-next-developer-handoff.md](./2026-03-28-next-developer-handoff.md)
2. read [docs/architecture/system-overview.md](../architecture/system-overview.md)
3. read [docs/architecture/domain-flows.md](../architecture/domain-flows.md)
4. read [docs/operations/open-issues-and-next-steps.md](../operations/open-issues-and-next-steps.md)
5. only then inspect the relevant code files

When changing things:

- prefer narrow fixes over broad rewrites
- verify route resolution before changing marketing slugs
- verify patient/account surfaces with seeded/demo users
- verify both the preview route and the canonical route when fixing aliases

## One-Line Summary

This app is already a strong functional replacement for most of the WordPress public/commercial surface, but MDI/provider validation and a handful of operational polish items still make it a careful, integration-heavy codebase rather than a "just redesign the UI" project.
