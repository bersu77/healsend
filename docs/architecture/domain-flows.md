# Domain Flows

This document explains the key functional flows.

## 1. Public Marketing To Product

Flow:

1. user lands on a top-level marketing slug
2. [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx) resolves category/product/custom content
3. [src/lib/marketing-data.js](../../src/lib/marketing-data.js) loads DB-backed or synthetic product/category/article data
4. product/category pages render through shared marketing components
5. CTA sends the user into funnel/onboarding or opens the shared homepage auth drawer

Important note:

- many "product pages" are synthetic/native fallbacks, not just raw product DB rows
- `/login` and `/signup` still exist, but they redirect into `/?auth=login` and `/?auth=signup`

## 2. Funnel To Checkout

Flow:

1. user enters a funnel at `/funnels/[slug]` or `/onboarding/[slug]`
2. template and steps are loaded from `OnboardingTemplate`
3. legacy `Tell us about your health` steps are stripped at template-read time
4. answers are kept client-side during flow
5. the native account step now offers both `Log in` and `Create account` inside the funnel
6. users can move back or forward through already-completed steps from the full-width funnel header
7. checkout pricing mode is derived from `template.styling.checkoutPricingMode`
8. embedded card/link checkout initializes through `/api/onboarding-checkout`
9. hosted Klarna / Afterpay checkout initializes through `/api/onboarding-checkout/session`

Main code:

- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)
- [src/components/onboarding/OnboardingFlow.jsx](../../src/components/onboarding/OnboardingFlow.jsx)
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)

## 3. Stripe Payment Lifecycle

Current architecture:

- `UPFRONT_ZERO` funnels create card PaymentIntents with `manual` capture
- `ALL_AT_ONCE` funnels create card PaymentIntents with `automatic` capture
- hosted Klarna / Afterpay sessions are only allowed for `ALL_AT_ONCE`
- cards save for later reuse where applicable
- MDI/provider status still drives later fulfillment decisions
- rejection/cancellation should release card holds when a hold was used

Flow:

1. dashboard funnel config stores `checkoutPricingMode`
2. [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js) derives total, due today, monthly display, capture method, and BNPL availability
3. embedded card checkout creates a PaymentIntent through `/api/onboarding-checkout`
4. hosted BNPL checkout creates a Stripe Checkout Session through `/api/onboarding-checkout/session`
5. order/submission records persist the same pricing mode metadata
6. Stripe webhook updates order payment status
7. MDI/provider lifecycle later signals medically ready or rejected
8. app captures or cancels authorized card payments using [stripe-payment-workflow.js](../../src/lib/stripe-payment-workflow.js)

Important constraints:

- the delayed-capture pattern is intended for cards, not BNPL
- hosted BNPL methods are a separate path, not a styled alias of the card form
- Klarna still depends on Stripe account readiness and buyer/session eligibility

Main code:

- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/api/checkout/route.js](../../src/app/api/checkout/route.js)
- [src/app/api/webhooks/stripe/route.js](../../src/app/api/webhooks/stripe/route.js)
- [src/lib/stripe-payment-workflow.js](../../src/lib/stripe-payment-workflow.js)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)

## 4. MDI Lifecycle

Current shape:

- create consultation / patient-portal launch path
- persist patient/order/case linkage
- process webhook-driven lifecycle changes
- expose patient-facing questionnaire/portal continuation

Flow:

1. order is submitted into MDI flow
2. MDI state is normalized locally
3. patient reaches MDI questionnaire/portal
4. MDI webhooks update order/user/case projection
5. patient account uses normalized state for action items, messages, and visits
6. medically ready events can trigger Stripe capture

Important reality:

- MDI still asks its own questionnaire
- this is expected and not the same as our funnel
- the right UX move is to resume/surface that questionnaire in the account, not pretend it does not exist
- patient continuation now goes through the local consultation shell at `/consultation/[orderId]`, which embeds the provider portal in an iframe

Main code:

- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/create-consultation/route.js](../../src/app/api/create-consultation/route.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)
- [src/app/consultation/[orderId]/page.jsx](../../src/app/consultation/[orderId]/page.jsx)

## 5. Patient Account Flow

What the account surface is trying to do:

- show action items that matter now
- show orders/subscriptions/messages/visits
- show MDI portal/questionnaire continuation when needed
- hide internal seeded/test/provider-debug wording from real patient UI

Important behavior:

- account UI now filters internal/test artifacts more aggressively
- raw ids like `mdi-payload-*` and `DEV-*` should not be exposed to patients
- account action items should route users into the local consultation shell instead of dumping them onto raw provider pages

Main code:

- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)
- [src/app/account/page.jsx](../../src/app/account/page.jsx)

## 6. Affiliate Tracking Flow

Flow:

1. client captures first touch and session cookies
2. page views are tracked by [NavigationTracker.jsx](../../src/lib/NavigationTracker.jsx)
3. funnel/payment/patient events are also recorded from server routes and webhooks
4. data lands in `AffiliateSession` and `AffiliateEvent`
5. admin dashboard aggregates session/source/funnel/payment/patient progression

Current summary capabilities:

- sessions
- unique visitors
- affiliate sessions
- attributed orders
- captured revenue
- consultations ready
- subscriptions activated
- source performance table
- funnel step breakdown
- payment and patient milestone counters

Main code:

- [src/lib/affiliate-tracking.js](../../src/lib/affiliate-tracking.js)
- [src/lib/affiliate-tracking-client.js](../../src/lib/affiliate-tracking-client.js)
- [src/app/dashboard/affiliate-marketing/page.jsx](../../src/app/dashboard/affiliate-marketing/page.jsx)

## 7. Admin Role Flow

Flow:

1. admin logs in through the shared auth drawer, or via `/login` redirecting into that drawer
2. role guard pushes non-admin users away from dashboard routes
3. dashboard layout fetches `/api/auth/me`
4. dashboard routes expose products, categories, funnels, orders, payments, users, subscriptions, and affiliate marketing
5. the funnel management screen at `/dashboard/funnels` is backed by `/dashboard/onboarding`
6. funnel checkout pricing mode can be changed in list, create, and edit flows and is enforced by checkout APIs

Main code:

- [src/components/dashboard/DashboardLayout.jsx](../../src/components/dashboard/DashboardLayout.jsx)
- [src/app/dashboard/layout.jsx](../../src/app/dashboard/layout.jsx)
- [src/app/dashboard/onboarding/page.jsx](../../src/app/dashboard/onboarding/page.jsx)
- [src/lib/auth.js](../../src/lib/auth.js)
- [src/lib/auth-routing.js](../../src/lib/auth-routing.js)
