# WordPress URL Coverage Explained

This document explains the `693 / 693 URLs resolved` result in plain language.

It is meant to answer:

1. What does the `693` number actually represent?
2. Why are there so many URLs?
3. Does that mean the app has `693` custom-built pages?
4. How are those URLs handled in the custom app?
5. Which URLs actually matter most for the replacement?

Related docs:

- [WordPress content map](./wordpress-content-map.md)
- [Replacement progress tracker](./replacement-progress.md)
- [Latest WordPress parity audit](./audits/wordpress-parity-latest.md)

## Short Version

`693 / 693 URLs resolved` means:

- the old HealSend WordPress site exposed `693` public sitemap URLs
- the custom Next.js app can now handle all `693` of them
- each one either:
  - renders directly in the custom app, or
  - redirects to the right canonical route

It does **not** mean:

- the app has `693` handcrafted bespoke pages
- every one of those URLs is equally important
- every one of those pages was rewritten from scratch

The number is a **coverage metric**, not a “custom page count”.

## Where The `693` Comes From

The number comes from the live WordPress sitemap parity audit in [docs/audits/wordpress-parity-latest.md](./audits/wordpress-parity-latest.md).

Current snapshot:

- Total sitemap URLs audited: `693`
- Direct coverage: `638`
- Redirected coverage: `55`
- Missing: `0`
- Errors: `0`

By source type:

| Source Type | Total | What It Mostly Means |
| --- | ---: | --- |
| `page` | `84` | WordPress pages, landing pages, legal pages, misc marketing pages |
| `post` | `587` | Blog/editorial articles |
| `category` | `7` | Legacy category archives |
| `product_cat` | `15` | Legacy WooCommerce product-category URLs |

This is why the number gets large very quickly: most of it is long-tail content, especially blog posts.

## Why There Are So Many URLs

The old WordPress site accumulated multiple kinds of public URLs over time:

- homepage and primary marketing pages
- treatment landing pages
- product pages
- onboarding/prefunnel pages
- legal/compliance pages
- blog/editorial posts
- category archives
- WooCommerce product-category archives
- duplicate marketing slugs
- legacy aliases and older SEO paths

WordPress naturally grows a lot of “surface area” because:

- every post becomes its own URL
- categories create more URLs
- legacy landing pages are rarely deleted
- duplicate slugs often survive migrations and experiments

So `693` is not surprising for an older WordPress marketing site.

## The Important Distinction: Coverage Vs Custom Page Count

This is the main thing to keep straight.

### Coverage

Coverage answers:

- “If someone or Google visits an old WordPress URL, does the custom app know what to do with it?”

That can mean:

- render a page
- render a dynamic page from DB content
- render imported content through a controlled template
- redirect to the modern canonical page

### Custom Page Count

Custom page count would answer:

- “How many pages were hand-designed and hand-built as unique custom experiences?”

That number is much smaller than `693`.

The replacement is a mix of:

- native public templates
- dynamic DB-backed content
- cleaned imported WordPress content
- redirects for legacy/duplicate routes

So the audit proves route coverage, not one-off bespoke page creation.

## How The Custom App Handles Those URLs

The easiest way to think about it is that each old URL falls into one of four buckets.

## Bucket 1: Native App Pages

These are pages or page families that the app now owns directly through purpose-built Next.js templates and logic.

Examples:

- `/`
- `/weight-loss`
- `/sexual-health`
- `/anti-aging`
- `/strength-recovery`
- `/sleep`
- `/psychiatry`
- public product marketing pages
- `/shop`
- `/shop/[slug]`
- `/onboarding/[slug]`
- `/login`
- `/signup`
- `/account`
- `/cart`

These are the most important business pages.

## Bucket 2: Dynamic DB-Backed Pages

Some pages are not hardcoded one by one. They are generated from database content and route by slug.

Examples:

- product marketing slugs
- category slugs
- imported WordPress pages/posts resolved by slug

This is why many URLs can be covered without creating a separate physical file for every single page.

## Bucket 3: Imported WordPress Content In Controlled Templates

A large part of the WordPress long tail still uses imported content as source material.

That does **not** mean the app is just dumping raw WordPress pages anymore.

These pages now render through controlled templates such as:

- treatment/medication page templates
- article/editorial templates
- legal/compliance templates
- cleaned custom-page templates

This means the route is covered and the content is presented inside the custom app, even if that specific page was not fully rewritten from zero.

## Bucket 4: Redirects To Canonical Pages

Some old WordPress URLs should not remain distinct public pages.

Instead, they redirect to the modern canonical route.

Examples from the parity audit:

- `/patient-login` -> `/login`
- `/patient-signup` -> `/signup`
- `/get-started` -> `/`
- `/nad-therapy` -> `/nad`
- `/oxytocin` -> `/oxytocin-nasal-spray`
- `/category/weight-loss` -> `/weight-loss`
- `/product-category/enclomiphene` -> `/enclomiphene`

These are counted as “resolved” because the custom app still knows how to handle them correctly.

## What The `638 Direct` And `55 Redirected` Numbers Mean

From the latest audit:

- `638` URLs are handled directly by the custom app
- `55` URLs are handled by redirecting to a better canonical route

So:

- direct coverage means the URL itself renders content in the custom app
- redirected coverage means the URL is intentionally normalized to a newer route

This is a good thing. Redirecting duplicates and legacy aliases is cleaner than preserving every old path as a separate live page forever.

## Why `693` Is Not The Same As `733 MarketingPage Rows`

This is another place where the numbers can look confusing.

Current content map says there are `733` imported `MarketingPage` rows in the database.

That is **not** the same thing as the `693` sitemap URLs from the WordPress audit.

The difference exists because:

- the DB contains imported content records, not just sitemap URLs
- some DB records are not part of the live sitemap set
- some URLs are aliases or redirects rather than one-to-one DB pages
- some content exists in the DB for routing flexibility or fallback behavior

So:

- `693` = public URL audit set
- `733` = imported content records in the app database

They are related, but they answer different questions.

## Which URLs Matter Most

Not all `693` URLs matter equally.

The highest-value pages are:

- homepage
- category / umbrella treatment pages
- product marketing pages
- shop and product detail
- onboarding flows
- login/signup/account/cart
- legal pages that users actually need to trust the site

The lower-value but still useful pages are:

- blog/editorial posts
- older landing pages
- duplicate slugs
- category archives
- WooCommerce archive leftovers

This is why the project can be close to cutover-ready even though the raw URL count is huge. Most of the count is long-tail content, not core commerce flow.

## What “Resolved” Does And Does Not Guarantee

## What it guarantees

- no missing public sitemap routes in the audit
- no obvious public 404 gaps from the old site
- old URLs are either rendered or redirected correctly
- the custom app can stand in front of the WordPress public URL surface

## What it does not guarantee

- every page is rewritten as a fully custom handcrafted experience
- every long-tail page is visually perfect
- every vendor integration is complete
- medical workflow parity is complete

That is why the project tracker still separates:

- public non-MDI parity
- deferred MDI/medical workflow work

## How To Read The URL Surface Without Getting Lost

If you want a practical mental model, think of the site in these layers:

### Layer 1: Core business pages

These are the ones to care about first:

- homepage
- category landers
- product/treatment pages
- shop
- onboarding
- login/signup
- account/cart/order flows

### Layer 2: Supporting trust content

- privacy policy
- terms
- consent/compliance pages
- FAQ-like long-form pages

### Layer 3: SEO long tail

- blog posts
- educational content
- old promo pages
- duplicate SEO slugs

### Layer 4: Legacy alias layer

- old category paths
- old WooCommerce product-category paths
- renamed marketing slugs
- historic prefunnel URLs

When you see `693`, most of the sprawl sits in Layer 3 and Layer 4.

## Current Reality

As of the latest repo docs:

- the custom app covers all audited public sitemap URLs
- the core business routes are largely native and DB-backed
- many content families now use dedicated native templates
- remaining long-tail pages are handled through controlled templates and cleaned imported content
- the biggest remaining overall gap is MDI, not public URL coverage

## If You Need The Fastest Possible Read

Use these docs in this order:

1. [docs/replacement-progress.md](./replacement-progress.md)
2. [docs/wordpress-content-map.md](./wordpress-content-map.md)
3. [docs/audits/wordpress-parity-latest.md](./audits/wordpress-parity-latest.md)

That gives you:

1. replacement status
2. content inventory
3. exact URL coverage numbers
