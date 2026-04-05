# HealSend Custom Site Replacement Progress

This document tracks the status of replacing the live WordPress HealSend site with this custom Next.js app.

It is intended to answer three questions at any time:

1. What has already been replaced successfully?
2. What is intentionally deferred?
3. What still blocks a true 100% cutover?

## Current Status

- Overall replacement status: `live in production`
- Marketing and catalog replacement status: `live`
- Medical/patient workflow replacement status: `live but still operationally sensitive`
- MDI work is live but still tracked as an integration-risk area in [docs/mdi-audit.md](./mdi-audit.md)
- the concrete implementation path for deferred MDI work is documented in [docs/mdi-solution-plan.md](./mdi-solution-plan.md)
- WordPress-origin content inventory and template mapping now live in [docs/wordpress-content-map.md](./wordpress-content-map.md)

The replacement should now be treated as post-launch rather than pre-cutover.

## Latest Audit Snapshot

Latest public sitemap audit: [docs/audits/wordpress-parity-latest.md](./audits/wordpress-parity-latest.md)
Latest public catalog audit: [docs/audits/public-catalog-latest.md](./audits/public-catalog-latest.md)
Latest public catalog runtime verification: [docs/audits/public-catalog-runtime-latest.md](./audits/public-catalog-runtime-latest.md)
Latest public SEO audit: [docs/audits/public-seo-latest.md](./audits/public-seo-latest.md)
Latest public media audit: [docs/audits/public-media-latest.md](./audits/public-media-latest.md)
Latest deployment environment audit: [docs/audits/deployment-env-latest.md](./audits/deployment-env-latest.md)
Latest upload runtime verification: [docs/audits/upload-runtime-latest.md](./audits/upload-runtime-latest.md)
Latest shortcode audit: [docs/audits/shortcode-pages-latest.md](./audits/shortcode-pages-latest.md)
Latest shortcode runtime verification: [docs/audits/shortcode-runtime-latest.md](./audits/shortcode-runtime-latest.md)
Latest non-MDI runtime verification: [docs/audits/non-mdi-runtime-latest.md](./audits/non-mdi-runtime-latest.md)
Latest commerce runtime verification: [docs/audits/commerce-runtime-latest.md](./audits/commerce-runtime-latest.md)
Latest non-MDI cutover verification: [docs/audits/non-mdi-cutover-latest.md](./audits/non-mdi-cutover-latest.md)
Latest MDI runtime verification: [docs/audits/mdi-runtime-latest.md](./audits/mdi-runtime-latest.md)
Latest MDI payload-variant verification: [docs/audits/mdi-payload-runtime-latest.md](./audits/mdi-payload-runtime-latest.md)
Latest MDI deployment environment audit: [docs/audits/mdi-deployment-env-latest.md](./audits/mdi-deployment-env-latest.md)

As of `2026-03-25`, the current custom app resolves all `693 / 693` URLs from the live HealSend WordPress sitemap set when tested locally against the production build:

- `638` direct responses
- `55` redirected responses
- `0` missing responses
- `0` server errors

This is a major parity milestone, but it does not by itself mean the replacement is complete. Some URLs still rely on redirects, and some pages still render imported WordPress HTML rather than fully native custom implementations.

As of the latest shortcode audit on `2026-03-25`:

- `79` imported custom pages still contain raw WordPress shortcode markup in their imported source
- all `79` of those shortcode-backed pages are now resolved by the custom app at runtime
- the production-build runtime verification now shows `79 / 79` shortcode-backed routes passing with `0` raw shortcode leaks in rendered HTML
- `31` of those pages are empty after shortcode stripping, but they now resolve through canonical dynamic routes, explicit redirects, or native fallback flows instead of rendering dead WordPress shells
- shortcode-only treatment aliases now redirect more precisely to canonical product or category pages such as `/nad`, `/enclomiphene`, `/pt-141-nasal-spray`, `/oxytocin-nasal-spray`, and `/strength-recovery`
- imported custom-page rendering now strips duplicate hero images, Trustindex shortcode leakage, old builder accordion attributes, and decorative WordPress SVG cruft while styling FAQ `<details>` blocks more natively
- public SEO output now has DB-backed sitemap generation, `robots.txt`, canonical metadata for public routes, and noindex protection for internal app surfaces such as login, account, cart, consultation, dashboard, and onboarding routes
- sitemap generation now excludes obvious imported system/test slugs like `404-error`, `payment-complete`, `test-*`, and `*-test`
- public metadata now uses route-aware WordPress-origin fallback social images instead of generic logo-only Open Graph/Twitter images when a page does not have its own strong hero asset
- the remaining work is no longer “find unresolved shortcode pages”; it is “replace imported WordPress-heavy HTML with more native custom UI over time”
- the public catalog now has a shared readiness gate, so incomplete published SKUs without usable pricing are hidden from `/shop`, `/shop/[slug]`, the marketing layer, and the public products API instead of leaking into runtime
- public catalog payloads now sanitize suspicious placeholder/test image URLs before they reach the public shop and product-detail surfaces
- the repeatable catalog QA loop now includes both `npm run audit:catalog` and `npm run verify:catalog`

As of the latest catalog audit and runtime verification on `2026-03-25`:

- `32` published products exist in the database
- `31` are public product candidates after excluding test/staging slugs
- `27` are currently runtime-ready for the public catalog
- `4` incomplete products are intentionally hidden from runtime because they still lack usable pricing
- config-backed native category experiences now exist for `sleep`, `glutathione-ldn`, and `strength-recovery`, and the latest catalog audit now shows `0` runtime-ready categories without a dedicated/fallback marketing treatment
- public runtime verification passed with `0` failures for hidden-product leakage and suspicious-image leakage
- the runtime-ready catalog no longer has generic-category leakage, suspicious placeholder/test images, missing images, or thin-copy products in the latest audit
- imported WordPress internal links inside custom-page HTML now normalize to canonical custom-app routes instead of leaking raw legacy URLs like `/glp-1-form/`, `/product-category/...`, `/weight-loss/...`, or `/blog/...`
- shared legal/support links in onboarding, signup, account, and footer surfaces now point to real custom routes or support email actions instead of placeholder `#` or legacy `/Quiz` targets
- imported treatment/article pages with repeated heading structure now render through a more native sectioned layout with an “On this page” rail instead of one giant raw HTML block, and the old tab/button scaffolding no longer leaks into runtime HTML
- the public auth, account, consultation, and catalog surfaces now share the same marketing shell as the homepage, so routes like `/account`, `/consultation/[orderId]`, `/shop`, and `/shop/[slug]` no longer look like a different app
- the app now uses a single shared auth drawer on the homepage; `/login` and `/signup` redirect into that drawer, legacy `/admin-login` traffic still resolves into the same auth flow, and post-login routing sends admins to `/dashboard` and customers back into the appropriate authenticated flow
- `psychiatry` is now a dedicated native landing page built from the custom app shell and curated treatment cards, instead of rendering through the generic imported-page template
- the first high-value medication cluster now has dedicated native treatment pages instead of the generic imported-page template: `adderall`, `vyvanse-lisdexamfetamine`, `lexapro`, `wellbutrin-bupropion`, `propranolol`, `xanax-alprazolam`, `paxil-paroxetine`, `prozac`, `klonopin-clonazepam`, `lorazepam-ativan`, and `ambien-zolpidem`
- a second high-value treatment cluster now uses the same native landing template for weight-loss, longevity, and sexual-health landers such as `tirzepatide-sublingual`, `oral-tirzepatide`, `tirzepatide-b12`, `semaglutide-b12`, `tirzepatide-injection`, `lipotropic`, `l-cartinine-injection`, `mic-injection`, `sermorelin-injection-2`, `cjc-1295-ipamorelin`, and `viagra-sildenafil`
- duplicate WordPress-era medication promo slugs such as `buy-adderall-online`, `buy-wellbutrin-online-bupropion`, `buy-xanax-online-alprazolam`, `buy-clonazepam-online-klonopin`, `buy-ativan-online-lorazepam`, `buy-lexapro-escitalopram-online`, and `inderal-buy-propranolol` now redirect to their canonical native treatment pages
- duplicate WordPress-era GLP-1 promo slugs like `glp1-weight-loss-injections-landing-page-ts` and `glp-1-weight-loss-2` now redirect to `/weight-loss`
- remaining imported custom pages are now classified into dedicated native shells too: legal/compliance pages render through a legal-document template, and long-form imported posts/pages render through an editorial article template instead of the generic catch-all renderer
- the last obvious public-shell leftovers are now cleaned up too: legacy `SiteHeader` / `SiteFooter` wrappers now point at the live marketing shell, `/home` now resolves to `/`, `/Quiz` and `/quiz` resolve to the canonical onboarding flow, and the local consultation fallback now uses the same public shell instead of an inline-styled one-off screen
- imported page titles now normalize away sluggy WordPress names for metadata and page headings, so legal/editorial routes do not leak `privacy-policy-3`-style titles
- the public strength-and-recovery entrypoint is now consistent across the homepage, navbar, and native treatment pages: the shared public route is `/strength-recovery`, while treatment CTAs can still continue into onboarding from there
- legacy sildenafil aliases such as `/sildefanil`, `/sildenafil`, and `/generic-viagra` now collapse into the canonical native treatment page at `/viagra-sildenafil`

As of the latest public media audit on `2026-03-26`:

- the public sitemap sweep checked `714` custom-app routes
- `0` routes leaked tracked placeholder/test/Photoroom-style asset URLs at runtime
- `0` public routes were missing `og:image`
- the old WordPress-era `Photoroom` / `wmremove` image leakage is now being normalized centrally through the shared marketing-image and imported-HTML cleanup layers instead of being chased route by route

As of the latest public SEO audit on `2026-03-26`:

- the public sitemap sweep checked `714` custom-app routes
- `0` public routes had blocking SEO issues for missing title, description, or canonical output in the local production-build audit
- `0` public routes had weak descriptions in the latest local production-build audit
- local audit output still reflects the local `NEXT_PUBLIC_APP_URL` host, so production canonical-host validation remains a staging responsibility

As of the latest commerce runtime verification on `2026-03-26`:

- the seeded authenticated commerce sweep passed `8 / 8` checks
- login, account, orders, payment methods, subscriptions, address, cart, and order-confirmation all resolved cleanly
- the customer account surface now uses real subscription, address, and payment-method data instead of fake/hardcoded billing blocks
- the Stripe checkout webhook now syncs local subscription rows from completed checkout-backed orders so non-MDI subscription state is no longer seed-only
- the repo-controlled non-MDI cutover sweep now has a single local command, `npm run verify:cutover:non-mdi`, which runs lint, build, catalog, shortcode, SEO, media, public runtime, and commerce runtime checks against a production-style local app instance
- upload handling now has its own runtime verifier, and the combined non-MDI cutover sweep includes that upload check alongside the other production-style local validations

As of the latest combined non-MDI cutover verification on `2026-03-26`:

- the combined local cutover sweep passed `11 / 11` steps
- lint, build, catalog, shortcode, SEO, media, upload runtime, public runtime, and commerce runtime checks are green together in one production-style local run
- the shared auth entrypoint is now the homepage auth drawer, with `/login` and `/signup` acting as redirect shims into it and dashboard access verified through that shared flow
- the remaining non-MDI work is no longer app-side parity work; it is target-environment validation for Stripe, GHL, uploads, webhooks, rollout, and rollback

As of the latest deployment environment audit on `2026-03-26`:

- the current local `.env` is intentionally not production-cutover ready, and the audit now catches that explicitly
- optional Google OAuth, Apple OAuth, GHL sync, and GHL OAuth can now be disabled cleanly per environment, so the deployment audit treats disabled optional integrations as warnings instead of hard failures
- current hard blocker list in the local env audit is now narrowed to: localhost `NEXT_PUBLIC_APP_URL`, test Stripe secret/publishable keys, and placeholder Stripe webhook secret
- optional integration status in the local env audit currently shows warnings for disabled Google OAuth, Apple OAuth, GHL sync/API, and GHL OAuth

As of the current MDI foundation pass on `2026-03-26`:

- Prisma now stores durable MDI linkage/state on `User` and `Order` instead of only `consultationId` / `consultationUrl` / `consultationStatus`
- raw inbound MDI deliveries now persist in `MdiWebhookEvent`
- paid Stripe checkout now attempts outbound order sync to MDI through the shared server-side MDI client
- the MDI webhook now resolves broader identifiers such as `mdiOrderId`, `mdiCaseId`, and `mdiPatientId`
- dedicated MDI machine routes now exist for customer linkage and order/tag updates under `/api/mdi/*`
- MDI is no longer “not started”, but it is still not cutover-ready because fuller patient portal parity and staging verification against the real provider contract are still outstanding

As of the current MDI projection pass on `2026-03-26`:

- normalized case projection now persists in `MdiCaseSnapshot`
- per-user message-sync state now persists in `MdiPatientMessageSync`
- webhook processing now upserts case snapshots and creates patient-facing care-team messages for key MDI lifecycle events
- the account surface now consumes normalized MDI case state in action items, order detail cards, message history fallback, and care history
- the consultation route now shows patient-link, case-status, and provider-assignment state instead of only a consultation URL/status pair
- partner-auth completion now has a dedicated route at `/api/mdi/partner-auth/complete`
- normalized visit history now has a user route at `/api/user/visits`
- local runtime verification now passes `13 / 13` checks through `npm run verify:mdi`, covering partner-auth completion, webhook projection, case snapshots, patient message sync, visits, and patient-facing messages
- local payload-variant verification now passes `13 / 13` checks through `npm run verify:mdi:payloads`, covering machine-route customer linkage, nested order payloads, voucher/tag updates, GET partner-auth completion, and voucher-based webhook resolution
- MDI-specific target-environment readiness now has a dedicated audit through `npm run audit:mdi:env`
- the current local MDI env audit isolates the remaining staging blockers to: localhost app URL, missing explicit `MD_API_BASE_URL`, root-only `MD_WEBHOOK_URL`, missing `MD_WEBHOOK_SECRET`, and `MD_LOCAL_DEV_FALLBACK=true`
- remaining MDI work is now primarily staging/provider-contract validation, not missing repo-side route or schema coverage

## Current Stack

- Framework: Next.js `16.2.1`
- React: `19.2.0`
- Route layer: `src/app`
- Database: Prisma + PostgreSQL
- Local DB runtime: Docker Compose
- Content/data sources currently in use:
  - Prisma database
  - imported WooCommerce product data
  - imported WordPress page/post content

## Done

### Platform and structure

- Upgraded the app to Next.js `16`
- Consolidated the active route layer under `src/app`
- Removed stale Vite/Base44 leftovers from the active app path
- Standard local development flow is documented and working with Docker + Prisma

### Local environment and data

- Docker-based local PostgreSQL setup is in place
- Prisma schema, generate, push, and seed scripts are in place
- Development seed data includes demo users, catalog data, onboarding templates, orders, messages, and related entities
- One-command local bootstrap exists via `npm run db:bootstrap:dev`

### Marketing and catalog replacement

- The imported marketing pages now live inside the main Next app instead of a nested subproject
- The canonical home page is active at `/`, with `/home` kept as a legacy redirect
- The old product marketing page was moved into the main app and aligned to canonical slugs
- Dynamic marketing slug handling exists through `src/app/[slug]/page.jsx`
- Category pages, product pages, and imported custom pages are resolved from shared loaders instead of one-off static files
- Legacy WordPress-style URLs have redirect coverage for key public treatment routes
- A repeatable WordPress parity audit exists via `npm run audit:wordpress:parity`
- The current sitemap audit resolves all live sitemap URLs without 404s

### Content and product data

- Product/catalog content is database-backed instead of file-only
- Public catalog gating now hides incomplete published products that are not yet sellable, instead of exposing broken product pages or zero-price commerce states
- The `/shop` listing route now loads its initial categories and product grid directly from Prisma during server render
- The `/shop/[slug]` product detail route now loads product data directly from Prisma during server render instead of waiting for a client-side API fetch
- The `/shop/[slug]` route now points its canonical metadata at the public top-level marketing product slug instead of advertising duplicate commerce URLs
- Shared pricing logic now understands WooCommerce-imported subscription tier JSON, so public pricing, cart totals, and checkout line items stay correct even when a product has no flat `regularPrice`
- The `/onboarding/[slug]` route now loads its template and initial auth state on the server before handing off to the interactive client flow
- The `/account` route now loads the authenticated user's orders, messages, payment methods, and address on the server before handing off to the interactive client tabs
- The `/account` route now also loads real subscription data on the server, and the account UI now supports subscription-management toggles plus saved-address updates instead of dead placeholder controls
- The `/cart` route now loads the current cart on the server before handing off quantity/remove actions to the client
- The `/order-confirmation` route now loads accessible order details on the server instead of depending on a client-side order fetch
- The Stripe webhook now creates and maintains local subscription records for checkout-backed orders, so the non-MDI customer account surface reflects completed purchases more honestly
- The app now emits a DB-backed public sitemap at `/sitemap.xml` plus `robots.txt`, and internal app routes are marked noindex so they do not compete with public marketing pages
- WordPress content import scripts exist for pages and posts
- Imported long-tail content can render through the custom Next shell
- Imported custom pages now share a cleanup layer that removes duplicate hero images, strips builder-specific HTML cruft, and gives imported FAQ/details sections a more native presentation
- Shared marketing components exist for home, category, product, and custom content rendering
- Shared marketing-shell components now cover the public auth, account, and consultation routes too, so the customer-facing experience is no longer split between two header/footer systems

### Current pages and app surface

- Marketing pages
- Shop and product detail routes
- Onboarding routes
- Cart and checkout-related routes
- Account area
- Admin/dashboard routes
- API routes for catalog, onboarding, checkout, payments, uploads, and webhooks

## Partially Done

### WordPress parity

- Many public pages are now reachable through the custom app
- Imported content renders, but not every page has been re-authored as native custom UI
- Some long-tail pages are still essentially imported WordPress HTML inside the new shell
- Legacy shortcode-backed pages no longer have unresolved runtime gaps
- Imported custom pages now have a stronger shared cleanup layer, but many still need true native section-by-section replacements
- Imported custom-page bodies now rewrite legacy internal WordPress links to canonical custom-site routes, many heading-heavy treatment/article pages now render in native sectioned shells, the `psychiatry` umbrella page has a dedicated native implementation, two high-value treatment clusters now live on native landing templates, and the remaining legal/article content now routes through dedicated legal/editorial templates. The remaining long-tail WordPress-origin pages now also render through structured native section layouts even when the source body lacks clean heading structure, so the app no longer depends on a raw imported-body fallback for those public pages. What remains there is polish and curation, not route/template coverage.

### Redirects and slug coverage

- Major public slugs are covered
- The live sitemap parity crawl is complete, but manual review of redirected and highest-value routes is still needed before declaring cutover readiness

### Account and patient portal UX

- The account area exists and is functional as an app surface
- The current implementation is not yet a feature-complete replacement for the live patient portal behavior
- Some current tabs are still generic/local implementations rather than production-parity medical workflow implementations
- The account and consultation routes now visually match the public marketing shell, non-MDI subscription/address/payment surfaces are no longer hardcoded, and the consultation route now embeds the provider portal in a local iframe shell, but the underlying medical workflow parity still depends on the deferred MDI work

### Funnel pricing mode and hosted payments

- Funnel templates now support an enforced checkout pricing mode, not just static pricing text.
- `$0 upfront` funnels now behave differently from `All at once` funnels in both UI and Stripe behavior.
- Hosted BNPL flows now exist as real Klarna / Afterpay paths instead of fake rows, but Klarna still depends on Stripe account readiness and staging validation.

### Checkout and operational parity

- Core commerce routes exist
- Shop browsing, product detail, and onboarding routes now have DB-backed initial renders
- The account route now has a DB-backed initial render plus real subscription/address/payment-method actions, but deeper production checkout/subscription behavior still needs staging validation
- Cart quantity updates, cart ownership, checkout cart resolution, order confirmation rendering, and local subscription syncing now use one consistent server-side commerce path
- Full production parity for Stripe checkout, post-purchase actions, subscriptions, and edge cases still needs staging QA

## Explicitly Deferred

### MDI / MD Integrations

MDI is intentionally deferred for now.

The current Next app has partial consultation wiring, but it is not yet a true replacement for the live WordPress MDI flow. The audit and migration notes are documented in [docs/mdi-audit.md](./mdi-audit.md).

Do not treat the current custom app as a full medical workflow replacement until the MDI work is completed.

## Remaining Work For 100% Replacement

### 1. Replace remaining imported WordPress-heavy pages more natively

- The shortcode routing/runtime gap is closed, but some pages still rely on imported WordPress HTML inside the custom shell
- Rebuild and polish the remaining specific imported landing pages over time, beyond the psychiatry, medication, treatment, legal, and editorial templates that are already native
- Confirm forms, CTA paths, and assets behave correctly after each native replacement

### 2. Complete product and category QA

- Verify every product slug, pricing display, images, descriptions, and CTA destination
- Verify category pages map cleanly to the correct products and onboarding flows
- Confirm no product still depends on temporary or placeholder data
- Keep the import/source data clean so runtime-ready products stay out of generic buckets and do not regress to suspicious placeholder assets

### 3. Complete account/checkout parity

- Repo-side account, auth, and checkout work is now locally verified through the combined non-MDI cutover sweep
- Remaining work here is target-environment validation: real Stripe checkout, webhook delivery, post-purchase behavior, and external integrations in staging/production
- Keep refining any remaining generic/local account messaging that should become product-specific over time

### 4. Complete MDI migration

- Port the real WordPress MDI contract into Next
- Expand database models for patient/case/order lifecycle state
- Rebuild inbound and outbound MDI flows
- Rebuild messages/visits parity where required

This is deferred for now but still required for true 100% replacement.

### 5. SEO and content QA

- Sitemap, robots, canonical metadata, and social metadata are now in place for the main public routes
- The public SEO audit now exists and the latest run shows `0` blocking issues and `0` weak-description candidates across the current public sitemap
- Remaining SEO work is now QA-focused: confirm production host/env behavior for canonical URLs, keep duplicate aliases from creeping back in, and continue route-by-route editorial polish where desired
- Validate that old WordPress SEO-critical routes are either preserved or intentionally redirected
- Keep the route-level social image fallbacks intentional and continue replacing generic fallback images with page-specific assets where the imported content has better media available

### 6. Smoke and regression coverage

- Keep the combined `npm run verify:cutover:non-mdi` sweep green across the canonical public routes, legacy alias redirects, catalog checks, shortcode coverage, SEO/media output, and authenticated commerce path
- Extend route-level runtime verification whenever a new public template or alias is added

### 7. Media and asset audit

- Verify imported images, logos, and treatment assets match the live site
- Confirm no WordPress-hosted assets are missing or hotlinked incorrectly
- Move any still-missing media into the app's owned asset pipeline
- The biggest placeholder-image, suspicious WordPress-image, and generic social-image gaps are now closed, so the remaining work here is route-by-route curation and asset ownership planning, not emergency fallback cleanup

### 8. Staging and cutover readiness

- Run a staging pass against production-like env vars and services
- Use `npm run audit:deployment:env` to catch localhost, placeholder, test-key, and misconfigured OAuth/CRM env issues before cutover
- Confirm runtime behavior for Docker, DB, Stripe, GHL, uploads, and webhooks
- Use [docs/non-mdi-cutover-checklist.md](./non-mdi-cutover-checklist.md) as the baseline runbook
- Prepare rollback, monitoring, and deployment steps before public cutover

### 9. Regression and smoke testing

- Re-run the combined local cutover sweep after each major parity milestone
- Keep a lightweight manual parity checklist for target-environment validation where local automation cannot verify external service behavior

## Suggested Milestone Order

1. Rebuild the highest-value imported WordPress pages more natively
2. Tighten product/category/account/checkout parity
3. Finish MDI migration
4. Run staging QA and cutover prep

This order keeps us from polishing deployment before the product and patient workflows are actually equivalent.

## Definition of Done For 100% Replacement

We should only call the custom site a true replacement when all of the following are true:

- All important public WordPress URLs are either natively served or intentionally redirected
- All important products, categories, blog pages, and landing pages are present and correct
- Checkout, onboarding, account, subscriptions, and post-purchase flows behave correctly
- MDI parity is complete
- SEO metadata and redirects are validated
- Staging QA passes with production-like configuration
- A rollback plan exists for cutover

Until then, this project should be treated as a near-complete custom rebuild, not yet a guaranteed drop-in replacement.
