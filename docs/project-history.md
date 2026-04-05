# HealSend Custom Site Project History

This document is the human-readable project history for the custom HealSend site, starting from the point where the separate two-page subproject was first integrated into the main codebase.

It is meant to answer a simple question: what has already been done, in what order, and how did the project evolve from a separate extracted marketing build into the current custom Next.js replacement?

## Phase 1: Initial Extraction And Route Setup

- Audited the separate subproject and confirmed it was a standalone Vite app with two main pages: a home page and a product page.
- Added temporary routing there first so the extracted product page could be reached cleanly during the early integration pass.
- Preserved the intended two-page split instead of leaving everything in a single-page stack.

## Phase 2: Moving The Two Pages Into The Root Project

- Extracted the two pages from the subproject and moved them into the main Next.js app.
- Added real root-project routes for the extracted pages so they lived inside the actual app instead of in a sidecar project.
- Removed the nested subproject after extraction so there was one active app instead of two overlapping runtimes.
- Renamed the old `eden`-specific naming into more neutral `marketing` naming so the imported pages matched the actual project.

## Phase 3: Structural Cleanup

- Removed leftover Vite/Base44-era files, old entrypoints, and stale caches that were no longer part of the live app.
- Reorganized the active route layer into `src/app` so the project structure was clearer and more consistent with the rest of the codebase.
- Clarified the difference between the route layer and reusable supporting code:
  - `src/app` for routes, layouts, metadata, and API handlers
  - `src/components`, `src/lib`, and related folders for reusable code inside the same app
- Upgraded the project to Next.js `16`.

## Phase 4: Frontend Unification

- Rebuilt the extracted pages inside the main app instead of keeping them as a separate imported runtime.
- Added a shared marketing shell for public pages.
- Unified the look and feel across public and semi-public surfaces so `/`, `/login`, `/signup`, `/account`, `/shop`, and consultation/public routes stopped feeling like separate applications.
- Reworked multiple homepage and presentation issues, including:
  - full-width banner behavior
  - hero/title animation
  - navbar structure and dropdown behavior
  - duplicate logo/icon cleanup
- Fixed dashboard layout issues such as sidebar behavior.
- Replaced the dashboard’s brittle font-based icon approach with a local SVG icon system so dashboard icons no longer depend on a third-party font loading correctly.

## Phase 5: Local Backend, Docker, Prisma, And Seeds

- Wired local Docker + Postgres + Prisma for development.
- Added a local bootstrap flow so the app can be brought up with a reproducible database setup.
- Added development seed data covering:
  - products
  - categories
  - onboarding templates
  - demo users
  - cart/order data
  - messages
  - supporting demo records
- Documented the local setup and seeded credentials.

## Phase 6: Making The App DB-Backed Instead Of Static

- Connected the homepage and marketing pages to DB-backed loaders.
- Connected product detail pages to DB-backed loaders.
- Connected onboarding, account, cart, and order-confirmation flows to DB-backed loaders.
- Fixed cart, checkout, and order APIs so the commerce path no longer relied on fragile placeholder behavior.
- Shifted important public and user-facing routes toward server-rendered Prisma-backed first render instead of client-only bootstrapping.

## Phase 7: Dynamic Route Replacement

- Moved away from the one-off static `/product` mindset and made the marketing side slug-driven.
- Added dynamic `/{slug}` handling for:
  - marketing pages
  - category pages
  - product-style public pages
  - imported custom pages
- Added canonical legacy redirects so older URLs resolve into the correct custom-app routes instead of breaking.
- Turned the public-facing replacement into a real route system rather than a small set of hardcoded pages.

## Phase 8: WordPress Import And Parity Work

- Imported WordPress pages, posts, and product-related content into the database.
- Built parity tooling to compare the live WordPress sitemap against the custom site.
- Reached full sitemap route coverage for the parity crawl: `693/693` URLs resolving in the custom app with no missing pages and no server errors in the audited set.
- Added handling for WordPress-era legacy slugs and nested path patterns so they redirect or resolve correctly in the custom site.

## Phase 9: Shortcode And Imported-HTML Cleanup

- Closed the shortcode runtime gap so shortcode-driven legacy pages are covered by:
  - native rendering
  - widget stripping
  - canonical dynamic routes
  - or explicit redirects into the matching custom flow
- Reached `79/79` shortcode-backed routes resolved cleanly in runtime verification.
- Cleaned imported WordPress HTML so it no longer leaks:
  - duplicate hero images
  - shortcode junk
  - builder scaffolding
  - broken placeholder links
  - stale legacy internal paths
- Added repeatable shortcode and runtime audits so this stays measurable instead of depending on spot checks.

## Phase 10: Native Page Templates Replacing Generic Imported Rendering

- Added native public templates for major page families instead of forcing everything through one generic imported-page shell.
- Built native treatment and medication landing templates for the highest-value public landers.
- Added a dedicated psychiatry landing approach rather than relying on generic imported content rendering.
- Added dedicated legal/compliance page treatment.
- Added a dedicated editorial/article treatment for long-form imported post content.
- Improved imported long-form pages with more native sectioning, cleaner layout behavior, and better internal navigation.

## Phase 11: Catalog Hardening, SEO, And Media Cleanup

- Added a public catalog readiness gate so incomplete products without usable pricing do not leak into runtime.
- Added public SEO infrastructure, including:
  - `sitemap.xml`
  - `robots.txt`
  - canonical metadata
  - noindex rules for internal routes
  - better route-aware Open Graph/social image handling
- Replaced placeholder or suspicious imagery with better WordPress-origin assets where appropriate.
- Added shared image normalization so bad placeholder asset names do not resurface from stored data.
- Added repeatable audits for:
  - WordPress parity
  - public catalog readiness
  - shortcode coverage
  - non-MDI runtime verification
  - public media quality

## Phase 12: Public Shell And Route Consistency

- Unified public shells so the homepage and public/auth/account/catalog surfaces feel like one coherent app.
- Normalized route naming and canonical destinations across public surfaces.
- Removed placeholder `#` links, old `/Quiz` leftovers, and stale shell inconsistencies.
- Standardized high-value public routes like strength/recovery and sildenafil-related landers onto clear canonical paths.

## Phase 13: MDI Was Explicitly Deferred

- MDI was not treated as “done” just because some partial integration code existed.
- Wrote a dedicated MDI gap audit explaining what is currently missing for true parity.
- Wrote a dedicated MDI solution plan documenting how to finish MDI properly later:
  - schema expansion
  - outbound order sync
  - inbound partner routes
  - webhook projection/state handling
  - patient-portal parity
  - cutover/testing requirements

See:

- [MDI audit](./mdi-audit.md)
- [MDI solution plan](./mdi-solution-plan.md)

## Phase 14: VPS And Outage Side Work

- Audited the HealSend VPS when `healsend.com` went down.
- Confirmed the outage was caused by the reverse-proxy layer, not a data-loss event.
- Identified the missing active Nginx vhost config for the domain.
- Restored the domain by recovering the correct Nginx config and reloading the proxy.

## Phase 15: Account, Auth, Funnel, And Affiliate Hardening

- Reworked public auth into a shared offcanvas drawer owned by the marketing shell instead of keeping login/signup as separate standalone page experiences.
- Changed `/login` and `/signup` to redirect into the homepage auth drawer path so protected-route handoffs stay consistent.
- Improved patient account behavior by filtering internal/test artifacts more aggressively and surfacing actionable MDI continuation states instead of raw provider ids.
- Embedded the patient consultation portal through a local iframe shell so provider continuation happens inside the app instead of dumping users onto raw external pages.
- Added a real affiliate-marketing dashboard that tracks source, funnel, payment, and patient-journey milestones instead of acting like a placeholder admin page.
- Unified more product and treatment routes under the same product-template system so page families stopped dropping major sections inconsistently.

## Phase 16: Funnel Checkout-Mode Enforcement And Hybrid Payments

- Added an admin-facing funnel checkout-mode control so operators can choose between `Upfront $0` and `All at once`.
- Centralized pricing-mode logic in a shared onboarding pricing helper instead of leaving it scattered between UI and APIs.
- Made checkout mode affect real business behavior:
  - `$0 upfront` funnels use manual card capture and disable BNPL
  - `All at once` funnels use automatic card capture and allow hosted BNPL methods
- Split checkout into two real payment paths:
  - embedded card/link checkout
  - hosted Klarna / Afterpay Checkout Sessions
- Added server-side Klarna account-readiness guarding so inactive Stripe accounts fail safely in-app instead of sending users to dead hosted Klarna pages.

## Phase 17: Production Cutover And WordPress Data Migration

- Backed up the production WordPress and preview app state before cutover.
- Migrated WordPress-origin content and account data needed for live use:
  - users
  - products
  - orders
  - subscriptions
  - saved payment methods
  - marketing pages
  - onboarding templates
- Added legacy password compatibility so imported WordPress users can sign in without forced resets.
- Added `wp-login.php` callback compatibility so Google/Apple auth could keep working on the live domain without immediate provider-console rewiring.
- Switched `healsend.com` to the Next.js app.
- Copied WordPress uploads into the app container and removed the need to proxy live media requests back through WordPress.
- Shifted the project from implementation/cutover mode into post-launch monitoring and hardening.

## Current State

The project is now very far beyond the initial two-page extraction:

- the public site replacement is largely dynamic and DB-backed
- the WordPress parity surface is broadly covered
- shortcode/runtime/public-media coverage is audited and documented
- affiliate attribution and patient-journey analytics exist as real admin functionality
- funnel checkout mode is now a real enforced system, not just a dashboard preference
- the remaining major unfinished areas are now MDI provider confidence and hosted-payment readiness, not basic route coverage

For the live status tracker, see:

- [Replacement progress tracker](./replacement-progress.md)
