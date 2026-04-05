# System Overview

This document explains how the app is put together today.

Status note:

- production is live on `https://healsend.com`
- preview remains available at `https://healsend.barikhan.studio`

## Stack

- Next.js app router
- React
- Prisma + PostgreSQL
- Stripe
- MDI / MD Integrations
- Tailwind + component-driven UI

## Main App Areas

### Public marketing and product layer

Main files:

- [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx)
- [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- [src/app/page.jsx](../../src/app/page.jsx)
- [src/lib/marketing-pages.js](../../src/lib/marketing-pages.js)
- [src/lib/product-routing.js](../../src/lib/product-routing.js)
- [src/components/marketing/home-page.jsx](../../src/components/marketing/home-page.jsx)
- [src/components/marketing/category-page.jsx](../../src/components/marketing/category-page.jsx)
- [src/components/marketing/product-page.jsx](../../src/components/marketing/product-page.jsx)
- [src/components/marketing/article-page.jsx](../../src/components/marketing/article-page.jsx)

Responsibilities:

- resolves top-level slugs into category/product/custom/article/legal pages
- normalizes WordPress-origin content into custom app routes
- hydrates the homepage from structured `MarketingPage` content when present
- handles canonical aliases and synthetic fallback pages
- keeps the marketing shell shared across public routes

### Funnel and onboarding layer

Main files:

- [src/app/funnels/[slug]/page.jsx](../../src/app/funnels/[slug]/page.jsx)
- [src/app/onboarding/[slug]/page.jsx](../../src/app/onboarding/[slug]/page.jsx)
- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)
- [src/components/onboarding/OnboardingFlow.jsx](../../src/components/onboarding/OnboardingFlow.jsx)
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/api/onboarding-submissions/route.js](../../src/app/api/onboarding-submissions/route.js)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)

Responsibilities:

- loads onboarding template data
- renders question/step-driven funnels
- strips the legacy `Tell us about your health` step from live template reads
- preserves guest progress across native in-funnel auth
- treats the existing `ACCOUNT_CREATE` step as a native login-or-signup step
- exposes completed-step back/forward navigation in the funnel shell
- derives shared checkout pricing state from template styling
- initializes embedded card checkout and hosted BNPL checkout
- persists onboarding submissions with mode-aware pricing metadata

### Commerce and payments

Main files:

- [src/app/api/checkout/route.js](../../src/app/api/checkout/route.js)
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/api/webhooks/stripe/route.js](../../src/app/api/webhooks/stripe/route.js)
- [src/lib/stripe.js](../../src/lib/stripe.js)
- [src/lib/stripe-payment-workflow.js](../../src/lib/stripe-payment-workflow.js)
- [src/lib/order-workflow.js](../../src/lib/order-workflow.js)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)

Responsibilities:

- create embedded card/link PaymentIntents
- create hosted Klarna / Afterpay Checkout Sessions
- hold/capture/cancel payments
- switch capture strategy based on funnel checkout pricing mode
- auto-sync products and prices to Stripe from the dashboard-managed catalog
- sync order and subscription state from Stripe webhooks
- project fulfillment-readiness onto orders

### MDI integration

Main files:

- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/create-consultation/route.js](../../src/app/api/create-consultation/route.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/api/mdi/customers/[id]/route.js](../../src/app/api/mdi/customers/[id]/route.js)
- [src/app/api/mdi/orders/[id]/route.js](../../src/app/api/mdi/orders/[id]/route.js)
- [src/app/api/mdi/orders/[id]/tags/route.js](../../src/app/api/mdi/orders/[id]/tags/route.js)
- [src/app/api/mdi/partner-auth/complete/route.js](../../src/app/api/mdi/partner-auth/complete/route.js)

Responsibilities:

- manage MDI token/auth/voucher/order/patient/case helpers
- store raw webhook deliveries
- resolve orders/users from MDI payloads
- project case and patient state into local DB
- support consultation/patient-portal launch flows

### Patient account layer

Main files:

- [src/app/account/page.jsx](../../src/app/account/page.jsx)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)
- [src/app/order-confirmation/page.jsx](../../src/app/order-confirmation/page.jsx)
- [src/app/consultation/[orderId]/page.jsx](../../src/app/consultation/[orderId]/page.jsx)
- [src/app/api/user/orders/route.js](../../src/app/api/user/orders/route.js)
- [src/app/api/user/subscriptions/route.js](../../src/app/api/user/subscriptions/route.js)
- [src/app/api/user/messages/route.js](../../src/app/api/user/messages/route.js)
- [src/app/api/user/visits/route.js](../../src/app/api/user/visits/route.js)

Responsibilities:

- render patient-facing orders, subscriptions, messages, visits, and action items
- surface MDI questionnaire/portal status
- embed the patient consultation portal in an iframe shell
- filter out internal/test seeded data from patient UI

### Admin dashboard

Main files:

- [src/components/dashboard/DashboardLayout.jsx](../../src/components/dashboard/DashboardLayout.jsx)
- [src/app/dashboard/page.jsx](../../src/app/dashboard/page.jsx)
- [src/app/dashboard/products/page.jsx](../../src/app/dashboard/products/page.jsx)
- [src/app/dashboard/funnels/page.jsx](../../src/app/dashboard/funnels/page.jsx)
- [src/app/dashboard/onboarding/page.jsx](../../src/app/dashboard/onboarding/page.jsx)
- [src/app/dashboard/orders/page.jsx](../../src/app/dashboard/orders/page.jsx)
- [src/app/dashboard/payments/page.jsx](../../src/app/dashboard/payments/page.jsx)
- [src/app/dashboard/affiliate-marketing/page.jsx](../../src/app/dashboard/affiliate-marketing/page.jsx)
- [src/app/dashboard/homepage/page.jsx](../../src/app/dashboard/homepage/page.jsx)

Responsibilities:

- operational/admin surfaces
- product/category/forms/funnel management surfaces
- enforce funnel checkout pricing mode from the dashboard
- manage future-charge delay settings for `$0 upfront` funnels
- edit the homepage through a structured CMS-style dashboard form
- order/payment/user views
- affiliate-tracking analytics

## Data Model

The app is centered on a few clusters:

### Identity and auth

- `User`
- `Session`
- `PaymentMethod`
- `Address`

Important auth implementation files:

- [src/lib/auth-routing.js](../../src/lib/auth-routing.js)
- [src/components/auth/AuthPageShell.jsx](../../src/components/auth/AuthPageShell.jsx)
- [src/components/auth/LoginPageClient.jsx](../../src/components/auth/LoginPageClient.jsx)
- [src/components/auth/SignupPageClient.jsx](../../src/components/auth/SignupPageClient.jsx)
- [src/app/login/page.jsx](../../src/app/login/page.jsx)
- [src/app/signup/page.jsx](../../src/app/signup/page.jsx)

### Catalog and content

- `Category`
- `Brand`
- `Product`
- `ProductVariant`
- `MarketingPage`
- `MediaAsset`

### Onboarding and conversion

- `Onboarding`
- `OnboardingTemplate`
- `OnboardingStep`
- `OnboardingSubmission`
- `Order`
- `OrderItem`
- `Subscription`

### Integrations and event logs

- `StripeWebhookEvent`
- `MdiWebhookEvent`
- `MdiCaseSnapshot`
- `MdiPatientMessageSync`
- `AffiliateSession`
- `AffiliateEvent`

Source of truth:

- [prisma/schema.prisma](../../prisma/schema.prisma)

## How Route Resolution Works

Top-level route resolution order in [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx):

1. try category page
2. try product page
3. try custom/native/synthetic page
4. otherwise `notFound()`

Important note:

- a slug may still be valid even if it is not a direct DB product slug
- aliases are resolved through:
  - [src/lib/marketing-pages.js](../../src/lib/marketing-pages.js)
  - [src/lib/product-routing.js](../../src/lib/product-routing.js)

## Current Architectural Truths

- [src/lib/marketing-data.js](../../src/lib/marketing-data.js) is the heaviest content/routing adapter in the app
- MDI and Stripe both project lifecycle state back into orders
- patient surfaces should read normalized order/case state, not raw provider payload wording
- affiliate tracking is partly client-driven and partly server-event-driven
- the public auth experience is a homepage-owned offcanvas drawer, and `/login` / `/signup` just redirect into `/?auth=...`
- funnel `checkoutPricingMode` is a real business rule now, not just dashboard decoration
- `UPFRONT_ZERO` and `ALL_AT_ONCE` intentionally produce different Stripe behavior
- embedded cards/link and hosted BNPL are now separate checkout paths
- the consultation route is the patient-facing shell for the embedded MDI portal
- preview deployment is Docker-based and separate from live WordPress
