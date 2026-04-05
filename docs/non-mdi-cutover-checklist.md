# Non-MDI Cutover Checklist

This checklist is for the public-site and commerce cutover work that does **not** depend on MDI.

Use it before any production switch where the custom Next.js app is meant to replace the current WordPress front end for marketing, catalog, onboarding, account, cart, and checkout surfaces.

For the repo-controlled local verification sweep, start with:

```bash
npm run verify:cutover:non-mdi
```

That combined command runs the local lint/build pass plus the catalog, shortcode, SEO, media, non-MDI runtime, and commerce runtime checks against a production-style app instance.

## 1. Environment Readiness

Confirm these values are set correctly for the target environment:

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- any optional integration flags you intend to enable, such as `GOOGLE_OAUTH_ENABLED`, `APPLE_OAUTH_ENABLED`, `GHL_SYNC_ENABLED`, and `GHL_OAUTH_ENABLED`
- the matching OAuth/CRM credentials for any optional integration you leave enabled
- upload/storage env vars if the deployment depends on them

Do not cut over with localhost canonicals or mixed staging/production origins.

Run:

```bash
npm run audit:deployment:env
```

If you want live outbound API validation for Stripe/GHL from the target environment too, run:

```bash
CUTOVER_ENV_CHECK_EXTERNAL=true npm run audit:deployment:env
```

## 2. Infrastructure Readiness

Confirm:

- the app build succeeds with `npm run build`
- the target database is reachable
- Prisma client generation is current
- Docker, DB, and application runtime match the intended environment
- Stripe webhook delivery can reach the deployed app
- uploads and public assets resolve correctly

## 3. Route And SEO Verification

Run:

```bash
npm run audit:wordpress:parity
npm run audit:seo
npm run audit:media
npm run verify:uploads
npm run verify:non-mdi
```

Confirm:

- sitemap routes resolve cleanly
- canonical metadata uses the real production host
- public pages emit titles and descriptions
- no placeholder/test media leaks back into runtime
- upload handling works in the deployed app
- legacy aliases redirect where expected

## 4. Commerce Verification

Run:

```bash
npm run verify:commerce
```

Confirm the seeded customer path still works for:

- login
- account shell
- orders API
- payment methods API
- subscriptions API
- address API
- cart API
- order confirmation route

## 5. Manual User-Journey QA

Check these manually in the target environment:

- homepage and top-level category pages
- primary product pages and `/shop`
- onboarding start and checkout handoff
- account tabs and subscription management
- cart updates and checkout redirect
- order confirmation
- consultation route accessibility
- dashboard access through the shared auth drawer flow (`/?auth=login`, with `/login` redirecting there)

## 6. External-Service Validation

Before cutover, confirm:

- Stripe checkout can create a session
- Stripe webhook events reach `/api/webhooks/stripe`
- GHL/webhook endpoints still behave correctly if GHL is enabled in the target environment
- email/support links point to real destinations

## 7. Rollback Preparation

Before switching public traffic, have all of these ready:

- the previous WordPress/Nginx routing state
- exact DNS or reverse-proxy rollback steps
- a known-good previous deploy reference
- monitoring for 5xx spikes, checkout failures, and webhook failures
- a short communication plan in case rollback is needed

## 8. Cutover Rule

Do not call the non-MDI cutover ready unless:

- the automated audits are green
- the commerce verification is green
- manual public-route QA is complete
- Stripe/webhook behavior is confirmed in the target environment
- optional integrations are either validated with real credentials or intentionally disabled in the target environment
- rollback steps are written down and testable

MDI is intentionally out of scope for this checklist and remains tracked separately in [docs/mdi-audit.md](./mdi-audit.md) and [docs/mdi-solution-plan.md](./mdi-solution-plan.md).
