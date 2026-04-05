# Open Issues And Next Steps

This is the practical post-launch backlog for the next developer.

## 1. MDI Provider-Contract Validation Is Still The Biggest Functional Risk

Status: open
Priority: highest

Repo-side MDI coverage is much stronger now, but the remaining risk is external/provider behavior, not just local code.

What still needs confidence:

- real provider webhook behavior in staging
- machine-route contract validation
- full case/patient/status reconciliation against the provider
- confidence that preview/live patient wording always maps cleanly from provider states

Docs:

- [docs/mdi-audit.md](../mdi-audit.md)
- [docs/mdi-solution-plan.md](../mdi-solution-plan.md)
- [docs/mdi-staging-validation.md](../mdi-staging-validation.md)

## 2. Klarna / BNPL Activation Still Needs Real Stripe Validation

Status: open
Priority: high

What is done:

- hosted BNPL checkout is now a separate real path, not fake UI
- funnel checkout mode now enforces whether BNPL is allowed
- Afterpay/Clearpay hosted-session handoff is working in preview
- Klarna now fails fast in-app when the Stripe account is not ready, instead of sending users to a dead hosted page

What still needs confidence:

- activate the Stripe account features Klarna depends on
- confirm live/test Klarna eligibility in the target account and region
- run a full hosted Klarna payment from fresh funnel state after account activation
- verify success/cancel return handling under the real hosted flow

Main files:

- [src/app/api/onboarding-checkout/session/route.js](../../src/app/api/onboarding-checkout/session/route.js)
- [src/app/onboarding/[slug]/onboarding-client.jsx](../../src/app/onboarding/[slug]/onboarding-client.jsx)
- [src/lib/onboarding-pricing.js](../../src/lib/onboarding-pricing.js)

## 3. Keep Patient UI Free Of Internal/Test Artifacts

Status: partially addressed
Priority: high

This has improved a lot, but it is still an area to watch any time new account/order/MDI features are added.

Symptoms to avoid:

- raw internal ids
- `mdi-payload-*`
- `DEV-*`
- seeded/test order references
- raw provider/debug wording exposed to patients

Main file to watch:

- [src/app/account/account-client.jsx](../../src/app/account/account-client.jsx)

## 4. Catalog/Slug Edge Cases Still Need Ongoing QA

Status: open
Priority: medium-high

The system now covers a large slug surface, but changes in:

- alias maps
- synthetic fallbacks
- imported marketing pages
- hidden/public product gating

can break a route family in subtle ways.

Recent example:

- `/pt-141-oxytocin-nasal-sprays` needed both alias redirect handling and restoration of the canonical synthetic product page

Main files:

- [src/app/[slug]/page.jsx](../../src/app/[slug]/page.jsx)
- [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- [src/lib/marketing-pages.js](../../src/lib/marketing-pages.js)
- [src/lib/product-routing.js](../../src/lib/product-routing.js)

## 5. Affiliate Tracking Is Functionally Better, But Not Finished As An Analytics Product

Status: in progress
Priority: medium

What is done:

- sessions
- source attribution
- funnel tracking
- checkout/payment events
- patient milestones
- revenue and capture-rate rollups

What could come next:

- explicit affiliate partner entities
- commission logic
- payout tracking
- campaign drill-down views
- per-user attribution timelines in admin

Main files:

- [src/lib/affiliate-tracking.js](../../src/lib/affiliate-tracking.js)
- [src/app/dashboard/affiliate-marketing/page.jsx](../../src/app/dashboard/affiliate-marketing/page.jsx)

## 6. Preview Data Hygiene Still Matters

Status: ongoing
Priority: medium

Preview is useful, but it can accumulate:

- old seeded dev records
- payload-verifier records
- stale subscriptions/orders
- MDI test remnants

That means:

- not every weird account screen is a UI bug
- sometimes the data itself is dirty

When diagnosing:

- check whether the record is seeded/test/internal before changing UI logic
- prefer filtering and sanitization over exposing internals to users

## 7. Marketing Parity Is Functionally Strong, But Still Easy To Destabilize

Status: ongoing
Priority: medium

The main risk is not missing routes anymore. The risk is accidental regression in shared loaders and template assumptions.

Be careful when changing:

- [src/lib/marketing-data.js](../../src/lib/marketing-data.js)
- [src/components/marketing/product-page.jsx](../../src/components/marketing/product-page.jsx)
- [src/components/marketing/shared.jsx](../../src/components/marketing/shared.jsx)

## 8. Auth Drawer And Redirect Behavior Need To Stay Consistent

Status: ongoing
Priority: medium

What is done:

- `/login` and `/signup` now redirect into the shared homepage auth drawer
- patient/account/dashboard redirects use the same auth-routing helpers
- Google and Apple sign-in can be surfaced from the same drawer when configured

What still needs care:

- do not accidentally reintroduce a standalone auth page experience
- keep protected-route redirects pointing through [src/lib/auth-routing.js](../../src/lib/auth-routing.js)
- verify auth entry still feels immediate after navbar or account CTA changes

## 9. Preview Social OAuth Provider Config Is Still Incomplete

Status: open
Priority: medium-high

What is happening:

- preview app routes build the correct callback URLs from `NEXT_PUBLIC_APP_URL`
- Google can still fail with `redirect_uri_mismatch`
- Apple can still fail with `Invalid web redirect url`

What needs to be configured outside the repo:

- Google OAuth client:
  - authorized origin: `https://healsend.barikhan.studio`
  - redirect URI: `https://healsend.barikhan.studio/api/auth/google/callback`
- Apple Service ID:
  - domain: `healsend.barikhan.studio`
  - return URL: `https://healsend.barikhan.studio/api/auth/apple/callback`

Main files:

- [src/app/api/auth/google/route.js](../../src/app/api/auth/google/route.js)
- [src/app/api/auth/apple/route.js](../../src/app/api/auth/apple/route.js)

## 10. Dashboard QA Still Deserves Suspicion

Status: open
Priority: medium-high

The dashboard was not built in one coherent pass, and several production-facing fixes were found late by auditing real behavior.

That means:

- assume lower-traffic admin screens may still hide logic mismatches
- prefer verifying create, edit, save, reload, and delete behavior against the real DB shape
- be especially careful with forms, funnels, payments, products, and anything that looks older than the recent hardening work

## Recommended Next Work Order

1. continue MDI staging/provider validation
2. finish real Klarna account activation and hosted-flow validation
3. run dashboard QA on less-used admin surfaces
4. fix Google and Apple provider-console callback configuration for preview
5. run another full verification sweep after any integration change
6. keep patient-facing dashboard/account wording clean
7. only after that, do more marketing/template refactors

## Good First Checks Before Any New Change

```bash
npm run lint
npm run build
```

Then the relevant verifier:

- catalog work -> `npm run verify:catalog`
- public routing/content work -> `npm run verify:non-mdi`
- checkout/payment work -> `npm run verify:commerce`
- MDI work -> `npm run verify:mdi && npm run verify:mdi:payloads`

## Summary

The app is now live and past the "basic site replacement" stage. The remaining work is mostly:

- integration confidence
- data hygiene
- hosted payment-method readiness
- patient-safe wording
- operational hardening
