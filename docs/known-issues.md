# HealSend Known Issues

This document tracks known issues in the current codebase without prescribing fixes yet.

It is meant to answer:

1. What is visibly inconsistent today?
2. Which route families are affected?
3. Is the issue cosmetic, structural, content-related, or deployment-related?
4. Which issues are already known but intentionally not being changed yet?

Status note:

- This is not a backlog of committed fixes.
- It is a decision log for issues that still need product or engineering direction.
- MDI is intentionally excluded here and tracked separately in [docs/mdi-audit.md](./mdi-audit.md).

## 1. Layout Consistency Across Page Families

Type: frontend consistency
Severity: high
Decision status: open

Known issue:

- Some route families still do not feel like they belong to exactly the same product system, even though they now use shared shells and shared data sources.

Where this shows up:

- product-detail pages
- native treatment pages
- imported editorial/legal pages
- auth/account/dashboard-adjacent public surfaces

Symptoms:

- some pages feel highly designed and polished
- some pages feel more like structured content pages
- section density, spacing, visual rhythm, and CTA treatment are not uniform
- the product page is still the strongest visual reference point, and some other pages do not yet match that level

Important nuance:

- this is no longer an “old app vs new app” problem
- it is now mostly a “multiple native templates with different visual maturity” problem

## 2. Treatment Pages Still Vary In Quality

Type: frontend/content system
Severity: high
Decision status: open

Known issue:

- native treatment pages now use a dedicated template, but the quality still depends heavily on the imported WordPress source content for each slug.

Where this shows up:

- recovery/strength routes
- peptide/hormone-style landing pages
- some medication-specific pages

Symptoms:

- some pages look reasonably polished
- some pages still feel overloaded, awkward, or too content-heavy
- a route can be technically native while still looking visually weaker than the main product page
- content grouping can still feel forced when the underlying imported content is messy

Examples of likely issue patterns:

- weak benefit chips
- noisy or repetitive copy blocks
- wrong-feeling fallback image choice
- too much information shown at once
- treatment pages that still read like converted landing pages instead of intentional product pages

## 3. Imported WordPress Content Can Still Feel “Converted”

Type: content/presentation
Severity: medium-high
Decision status: open

Known issue:

- many long-tail WordPress-origin routes are now cleaned and structured, but some still visibly feel like imported content instead of fully authored custom-site pages.

Where this shows up:

- long-form educational pages
- lower-priority landing pages
- some legal/editorial routes

Symptoms:

- the route works and no longer leaks raw builder junk
- but the page may still feel text-heavy, generic, or visually flat
- the structure may be cleaner than WordPress while still not feeling fully custom

Important nuance:

- route coverage is largely solved
- content quality parity is not the same thing as route coverage

## 4. Visual Motion Is Not Fully Standardized

Type: frontend motion system
Severity: medium
Decision status: open

Known issue:

- animations and transitions are not yet standardized across the public site.

Where this shows up:

- hero transitions
- tab changes
- FAQ reveals
- section-entry animations

Symptoms:

- some pages have smooth motion
- some pages feel static
- some pages use `framer-motion` more effectively than others
- motion timing and interaction feel are not yet unified

## 5. Icons And Imagery Are Inconsistent By Template

Type: frontend asset system
Severity: medium
Decision status: open

Known issue:

- icon usage and image treatment are not fully consistent across all public templates.

Where this shows up:

- product page vs treatment page comparisons
- long-tail native templates
- imported-content-derived layouts

Symptoms:

- some sections use strong icon-based cards
- some sections still rely mostly on text blocks
- some pages use stronger product imagery treatment than others
- some fallback image choices are technically valid but not visually ideal

Important nuance:

- placeholder/test image leakage has already been largely solved
- what remains is curation/quality consistency, not the old broken placeholder problem

## 6. Hero And Section Hierarchy Are Not Yet Uniform

Type: frontend information architecture
Severity: medium
Decision status: open

Known issue:

- pages do not all follow the same hierarchy for hero, overview, proof, FAQ, and CTA sequencing.

Where this shows up:

- product pages
- treatment pages
- category pages
- imported article/editorial pages

Symptoms:

- some pages open with a strong offer-first hero
- some open more like an informational document
- some have clear mid-page proof/support sections
- some jump directly from intro to dense content

This is one of the main reasons users can perceive the site as visually inconsistent even when the routes technically work.

## 7. Route Coverage And Page Quality Are Easy To Confuse

Type: planning/communication
Severity: medium
Decision status: open

Known issue:

- there are many resolved WordPress URLs, but that does not mean each route has equal design quality or equal business importance.

Symptoms:

- large route counts create the impression that all pages are finished equally
- in reality, some routes are high-polish native pages and others are acceptable but lower-polish imported-content conversions

This is not a runtime bug, but it is a real source of confusion in planning and review.

## 8. Local Dev Can Make UI State Hard To Judge

Type: local development/runtime
Severity: medium
Decision status: open

Known issue:

- stale Next.js dev bundles, cached browser assets, and multiple temporary local servers can make it look like a page is still broken after code has already changed.

Symptoms:

- one browser tab shows an older layout
- another local port shows a newer layout
- CSS or client bundle changes appear inconsistent

Important nuance:

- this is not the same as a production bug
- it still slows review and can mislead visual QA

## 9. Public App vs Dashboard Visual Split Still Exists

Type: product/design consistency
Severity: medium
Decision status: open

Known issue:

- the public marketing side and the admin/dashboard side are functionally connected, but they are still visually different products.

Symptoms:

- public pages are marketing-heavy and branded
- dashboard pages are utilitarian and operational
- this may be correct long-term, but it is still a noticeable split

This is not necessarily wrong. It is only listed because it contributes to the perception that some parts of the site “belong together” less than others.

## 10. Onboarding Account Requirement Is Still A Product Decision

Type: product-flow decision
Severity: medium-high
Decision status: open

Known issue:

- onboarding now handles auth natively inside the funnel account step, but it is still not fully documented whether every funnel must require auth before checkout or whether some should allow a guest-to-order path

Where this shows up:

- onboarding/account-creation steps
- protected follow-up flows that assume an account exists

Symptoms:

- funnel behavior is now more consistent technically, but the product rule itself is still a policy decision
- future developers could accidentally remove or bypass the auth step without realizing it is currently part of the intended live flow

Important nuance:

- this is no longer about missing native UI; the funnel already supports native login/signup in-step
- the remaining open question is product/ops policy, not whether the current code can render or enforce the step

## 11. Remaining Non-MDI Work Is Mostly Quality, Not Coverage

Type: planning
Severity: informational
Decision status: open

Known issue:

- most remaining non-MDI issues are not missing-route issues anymore.
- they are quality, consistency, and deployment-readiness issues.

What that means:

- coverage is largely solved
- parity is mostly solved
- polish and consistency are still open
- deployment validation is still open

## 12. Preview Social OAuth Is Provider-Blocked

Type: third-party integration / deployment config
Severity: high
Decision status: open

Known issue:

- Google and Apple social sign-in can fail on preview even though the app-side auth routes are working.

Where this shows up:

- homepage auth drawer
- `/login` redirect flow
- any protected route that hands users into auth and then tries social sign-in

Symptoms:

- Google shows `Error 400: redirect_uri_mismatch`
- Apple shows `invalid_request` / `Invalid web redirect url`
- the social buttons render, but the provider blocks the sign-in before callback

Current root cause:

- the preview app is correctly sending callback URLs based on `NEXT_PUBLIC_APP_URL`
- but the provider consoles still need to explicitly allow those exact preview callback URLs

Expected preview callback URLs:

- Google redirect URI:
  - `https://healsend.barikhan.studio/api/auth/google/callback`
- Apple return URL:
  - `https://healsend.barikhan.studio/api/auth/apple/callback`
- Apple domain:
  - `healsend.barikhan.studio`

Important nuance:

- this is currently a provider-console mismatch, not a local route-construction bug in the repo
- the relevant app-side routes are:
  - [src/app/api/auth/google/route.js](../src/app/api/auth/google/route.js)
  - [src/app/api/auth/apple/route.js](../src/app/api/auth/apple/route.js)

## Issue Summary By Type

Open cosmetic/UX issues:

- layout inconsistency across page families
- treatment pages varying in polish
- motion inconsistency
- icon/image inconsistency
- non-uniform hero/section hierarchy

Open content-quality issues:

- imported WordPress content still feeling converted on some long-tail routes
- route count causing confusion about true page quality

Open runtime/process issues:

- local dev caching and multiple server states making UI verification harder
- preview social auth can be blocked by provider-console callback mismatch even when app routes are correct

Open product/design decision issues:

- whether the dashboard should feel visually closer to the public site
- whether lower-priority imported pages should remain content-led or be redesigned more aggressively

## What Is Not Being Classified As A Known Issue Here

The following are tracked elsewhere:

- MDI gaps: [docs/mdi-audit.md](./mdi-audit.md)
- MDI implementation path: [docs/mdi-solution-plan.md](./mdi-solution-plan.md)
- replacement status and completed work: [docs/replacement-progress.md](./replacement-progress.md)
- WordPress content inventory and template mapping: [docs/wordpress-content-map.md](./wordpress-content-map.md)
- URL coverage explanation: [docs/wordpress-url-coverage-explained.md](./wordpress-url-coverage-explained.md)

## Current Use Of This Document

Use this file when:

- reviewing pages and noting visual inconsistencies
- deciding which route family to standardize next
- separating “site is broken” from “site is inconsistent”
- planning the next non-MDI design/polish pass
