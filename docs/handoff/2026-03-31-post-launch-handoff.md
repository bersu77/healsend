# Post-Launch Handoff

Snapshot date: `2026-03-31`

This is the current post-launch handoff for the HealSend Next.js platform after production cutover.

## Current State

- `https://healsend.com` is now served by the Next.js app
- preview remains available at `https://healsend.barikhan.studio`
- WordPress is no longer the live frontend
- legacy WordPress uploads were copied into the app container and still resolve through the same `/wp-content/uploads/...` URLs
- WordPress remains on the server only as rollback/reference infrastructure, not as the active public site

## What Is Live

- public homepage and marketing routes
- top-level slug routing for products, categories, articles, legal pages, and imported/custom pages
- product detail pages
- native funnels and onboarding flows
- embedded card checkout and hosted BNPL flow support
- customer account area
- consultation/MDI surfaces
- admin dashboard
- WordPress-origin content and account migration

## Production Data State

The app now has the WordPress migration data needed for live use:

- `534` users
- `32` products
- `7` categories
- `559` media assets
- `17` marketing pages
- `232` orders
- `273` subscriptions
- `287` saved payment methods
- `11` onboarding templates

Order-linking note:

- `227 / 230` imported order items are linked to products
- `215 / 230` are linked to variants
- the small remainder references old Woo IDs that do not exist in the imported catalog

## Critical Functional Notes

### Auth

- homepage auth is still the main public auth entry
- legacy provider callback compatibility now includes WordPress-style `wp-login.php?loginSocial=...` routes so provider-console changes were not required for launch
- imported WordPress users can log in with their old password hashes; successful login upgrades them into the app-native password format

Main files:

- [src/lib/auth.js](../../src/lib/auth.js)
- [src/app/api/auth/login/route.js](../../src/app/api/auth/login/route.js)
- [src/app/wp-login.php/route.js](../../src/app/wp-login.php/route.js)

### Payments And Funnels

- funnel checkout mode is enforced end to end
- `$0 upfront` and `All at once` are real business modes, not just dashboard labels
- the dashboard now also stores a future-charge delay value for `$0 upfront` funnels, defaulting to `20` days
- duplicate purchase blocking is in place for both funnels and normal catalog checkout

Main files:

- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)
- [src/app/dashboard/onboarding/page.jsx](../../src/app/dashboard/onboarding/page.jsx)
- [src/app/api/onboarding-checkout/route.js](../../src/app/api/onboarding-checkout/route.js)
- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/api/onboarding-submissions/route.js](../../src/app/api/onboarding-submissions/route.js)
- [src/lib/purchase-guards.js](../../src/lib/purchase-guards.js)

Important nuance:

- the delay-day value is now configured and stored consistently
- exact automated day-based future capture still needs scheduler/worker logic if the business wants strict capture timing beyond current approval-driven handling

### Product Dashboard

- product save now manages Stripe sync automatically
- admins no longer need to create Stripe products manually or paste raw Stripe IDs
- existing products on preview were backfilled into Stripe during launch preparation

Main files:

- [src/lib/stripe-product-sync.js](../../src/lib/stripe-product-sync.js)
- [src/app/api/products/route.js](../../src/app/api/products/route.js)
- [src/app/api/products/[id]/route.js](../../src/app/api/products/[id]/route.js)
- [src/app/dashboard/products/[id]/page.jsx](../../src/app/dashboard/products/[id]/page.jsx)

### MDI

- production MDI credentials are wired
- partner auth/token checks succeeded
- consultation launch routes are live
- patient-facing consultation wording was cleaned so raw provider/debug language is not shown publicly

Main files:

- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)
- [src/app/api/create-consultation/route.js](../../src/app/api/create-consultation/route.js)
- [src/app/api/webhooks/mdi/route.js](../../src/app/api/webhooks/mdi/route.js)
- [src/app/consultation/[orderId]/page.jsx](../../src/app/consultation/[orderId]/page.jsx)
- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)

## Dashboard Notes

The dashboard was not originally authored by the current implementation pass, so a lot of recent hardening work focused on aligning dashboard behavior with the actual live data model.

Recent fixes that matter:

- funnel editor `500` / infinite loader fixed
- medication-select edit state fixed so saved medications appear checked again
- forms dashboard aligned to the real DB model
- categories, brands, payments, and forms APIs now enforce admin protection more consistently
- dashboard revenue card now reflects real total revenue instead of a misleading partial subset

## Biggest Post-Launch Watch Items

These are the remaining areas to watch closely after launch:

1. MDI full real-world round-trip confidence
2. live Klarna / Afterpay account- and buyer-eligibility behavior
3. social OAuth provider-console stability on the live domain
4. dashboard QA on less-used admin surfaces
5. long-tail marketing visual consistency

## Recommended First Files For Any New Developer

1. [docs/README.md](../README.md)
2. [docs/architecture/system-overview.md](../architecture/system-overview.md)
3. [docs/architecture/domain-flows.md](../architecture/domain-flows.md)
4. [docs/operations/deployment-and-verification.md](../operations/deployment-and-verification.md)
5. [docs/operations/open-issues-and-next-steps.md](../operations/open-issues-and-next-steps.md)

Then inspect:

- [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- [src/components/marketing/home-page.jsx](../../src/components/marketing/home-page.jsx)
- [src/components/marketing/product-page.jsx](../../src/components/marketing/product-page.jsx)
- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)
- [src/app/dashboard/onboarding/page.jsx](../../src/app/dashboard/onboarding/page.jsx)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)
- [src/lib/stripe-product-sync.js](../../src/lib/stripe-product-sync.js)
- [src/lib/mdi-client.js](../../src/lib/mdi-client.js)

## Bottom Line

This project is no longer in “site replacement under development” mode.

It is now:

- live in production
- data-migrated to a usable state
- operationally viable
- best treated as a post-launch platform entering monitoring, support, and iterative improvement
