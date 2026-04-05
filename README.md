# HealSend Local Setup

This repo runs the main HealSend Next.js app, including:

- the canonical marketing home page at `/`, with `/home` preserved as a legacy redirect
- the canonical NAD marketing page at `/nad`
- the catalog at `/shop`
- admin/dashboard routes
- Prisma/Postgres-backed APIs

`/product` still exists as a legacy redirect to `/nad`.

## Project Docs

- Project history from the initial two-page integration onward: [docs/project-history.md](./docs/project-history.md)
- Replacement tracker: [docs/replacement-progress.md](./docs/replacement-progress.md)
- Known issues and consistency gaps: [docs/known-issues.md](./docs/known-issues.md)
- WordPress content map: [docs/wordpress-content-map.md](./docs/wordpress-content-map.md)
- WordPress URL coverage explainer: [docs/wordpress-url-coverage-explained.md](./docs/wordpress-url-coverage-explained.md)
- Vendor env checklist: [docs/vendor-env-checklist.md](./docs/vendor-env-checklist.md)
- Non-MDI cutover checklist: [docs/non-mdi-cutover-checklist.md](./docs/non-mdi-cutover-checklist.md)
- Latest non-MDI cutover verification: [docs/audits/non-mdi-cutover-latest.md](./docs/audits/non-mdi-cutover-latest.md)
- Deferred MDI audit: [docs/mdi-audit.md](./docs/mdi-audit.md)
- MDI solution plan: [docs/mdi-solution-plan.md](./docs/mdi-solution-plan.md)
- MDI staging validation checklist: [docs/mdi-staging-validation.md](./docs/mdi-staging-validation.md)
- Latest MDI runtime verification: [docs/audits/mdi-runtime-latest.md](./docs/audits/mdi-runtime-latest.md)
- Latest MDI payload-variant verification: [docs/audits/mdi-payload-runtime-latest.md](./docs/audits/mdi-payload-runtime-latest.md)
- Latest MDI deployment environment audit: [docs/audits/mdi-deployment-env-latest.md](./docs/audits/mdi-deployment-env-latest.md)
- Latest WordPress parity audit: [docs/audits/wordpress-parity-latest.md](./docs/audits/wordpress-parity-latest.md)
- Latest public catalog audit: [docs/audits/public-catalog-latest.md](./docs/audits/public-catalog-latest.md)
- Latest public catalog runtime verification: [docs/audits/public-catalog-runtime-latest.md](./docs/audits/public-catalog-runtime-latest.md)
- Latest public SEO audit: [docs/audits/public-seo-latest.md](./docs/audits/public-seo-latest.md)
- Latest public media audit: [docs/audits/public-media-latest.md](./docs/audits/public-media-latest.md)
- Latest deployment environment audit: [docs/audits/deployment-env-latest.md](./docs/audits/deployment-env-latest.md)
- Latest upload runtime verification: [docs/audits/upload-runtime-latest.md](./docs/audits/upload-runtime-latest.md)
- Latest shortcode audit: [docs/audits/shortcode-pages-latest.md](./docs/audits/shortcode-pages-latest.md)
- Latest shortcode runtime verification: [docs/audits/shortcode-runtime-latest.md](./docs/audits/shortcode-runtime-latest.md)
- Latest non-MDI runtime verification: [docs/audits/non-mdi-runtime-latest.md](./docs/audits/non-mdi-runtime-latest.md)
- Latest commerce runtime verification: [docs/audits/commerce-runtime-latest.md](./docs/audits/commerce-runtime-latest.md)

Legacy shortcode-driven pages are now fully covered in the custom app through native rendering, widget stripping, canonical dynamic routes, or explicit redirects into the matching custom flow.
The app also now emits a DB-backed public sitemap at `/sitemap.xml` and `robots.txt`, with public canonicals separated from internal app flows.
The public catalog also has a shared readiness gate now, so incomplete products without usable pricing are hidden from runtime until their DB data is actually ready.
Imported WordPress custom pages now normalize their internal legacy links into the custom app's canonical routes, and the shared legal/support surfaces no longer rely on placeholder `#` or legacy `/Quiz` targets.
Many of the larger imported treatment/article pages now also render through a more native sectioned shell with an "On this page" rail, instead of dumping the entire imported body as one raw block.
The public auth, account, consultation, and catalog pages now use the same marketing shell as the homepage, and `psychiatry` now has a dedicated native landing page instead of the generic imported-page template.
The app now also uses one shared sign-in entrypoint at `/login`; legacy `/admin-login` requests redirect there, and admins are routed to `/dashboard` after authentication.
Optional Google/Apple sign-in is now feature-gated too, so those buttons only render when the provider is actually configured; otherwise the shared email/password flow remains the only public auth path.
The first high-value medication cluster is also native now, including `adderall`, `vyvanse-lisdexamfetamine`, `lexapro`, `wellbutrin-bupropion`, `propranolol`, `xanax-alprazolam`, `paxil-paroxetine`, `prozac`, `klonopin-clonazepam`, `lorazepam-ativan`, and `ambien-zolpidem`, with duplicate WordPress promo slugs redirected to those canonical pages.
A second high-value treatment cluster is native too, including `tirzepatide-sublingual`, `oral-tirzepatide`, `tirzepatide-b12`, `semaglutide-b12`, `tirzepatide-injection`, `lipotropic`, `l-cartinine-injection`, `mic-injection`, `sermorelin-injection-2`, `cjc-1295-ipamorelin`, and `viagra-sildenafil`, and the duplicate GLP-1 promo pages now redirect to `/weight-loss`.
The remaining imported content families are no longer all funneled through one generic shell either: legal/compliance pages now use a dedicated legal template, and long-form imported posts/pages now use a dedicated editorial article template.
The remaining legacy aliases are folded into canonical routes too: `/home` resolves to `/`, `/Quiz` and `/quiz` resolve to the canonical onboarding flow, and the local consultation fallback now uses the same shell as the rest of the public app instead of a one-off dev screen.
The strength-and-recovery public route is now normalized too, so the homepage, navbar, and native recovery pages all point at `/strength-recovery`, while legacy sildenafil aliases like `/sildefanil`, `/sildenafil`, and `/generic-viagra` now redirect to `/viagra-sildenafil`.
Public metadata now also falls back to route-aware WordPress-origin treatment imagery instead of generic logo-based social images on key public routes like `/`, `/shop`, `/nad`, and `/anti-aging`.
There is now a repeatable public-media audit too, so placeholder/test/Photoroom-style image leakage is tracked across the full public sitemap instead of only through spot checks.
The latest local production-style SEO and media sweeps now cover `714` public routes with `0` blocking SEO issues, `0` weak descriptions, `0` suspicious asset leaks, and `0` missing `og:image` values.

## Local Development

1. Install dependencies

```bash
npm install
```

2. Start Postgres with Docker

```bash
npm run db:up
```

3. Push the Prisma schema and seed local development data

```bash
npm run db:setup:dev
```

4. Start the app

```bash
npm run dev
```

If you want the full one-shot DB bootstrap, use:

```bash
npm run db:bootstrap:dev
```

## What The Dev Seed Creates

`npm run db:setup:dev` creates:

- demo catalog categories, brand, products, and product variants
- onboarding templates
- an admin account
- a demo customer account
- demo sessions
- demo onboarding/profile data
- a saved address and payment method
- a cart with seeded items
- a seeded order and order items
- messages, subscription data, form template/submission, and a dummy GHL contact

## Demo Credentials

- Admin: `admin@healsend.com` / `Admin123!`
- Customer: `demo@healsend.com` / `Demo123!`

## Environment Notes

- The default local database URL in `.env` points to `postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public`
- `docker-compose.yml` is already configured to match that connection string
- `NEXT_PUBLIC_APP_URL` controls canonical metadata, Open Graph URLs, `robots.txt`, and `sitemap.xml` host output. Set it to the real production origin before cutover.
- Google OAuth, Apple OAuth, GHL sync, and GHL OAuth can now be intentionally disabled per environment with `GOOGLE_OAUTH_ENABLED`, `APPLE_OAUTH_ENABLED`, `GHL_SYNC_ENABLED`, and `GHL_OAUTH_ENABLED`.
- `npm run audit:deployment:env` is meant for target-environment readiness, so it will intentionally fail on local/test envs that still use localhost URLs, test Stripe keys, or placeholder Stripe webhook config. Disabled optional integrations are reported as warnings instead of hard failures.
- If Docker is installed but not running, you may need to start the Docker service from a privileged shell before `npm run db:up` will work

## Useful Commands

```bash
npm run build
npm run db:generate
npm run db:down
npm run audit:wordpress:parity
npm run audit:catalog
npm run audit:seo
npm run audit:media
npm run audit:deployment:env
npm run verify:catalog
npm run audit:shortcodes
npm run verify:shortcodes
npm run verify:non-mdi
npm run verify:commerce
npm run verify:uploads
npm run verify:cutover:non-mdi
npm run verify:mdi
npm run verify:mdi:payloads
npm run audit:mdi:env
```
