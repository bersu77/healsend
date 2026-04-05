# HealSend WordPress Content Map

This document tracks the WordPress-origin content that has been brought into the custom HealSend Next.js app.

It is meant to answer these questions quickly:

1. What content came from WordPress?
2. Where does it live now?
3. Which parts are fully native vs still imported-and-cleaned?
4. How do we refresh it and audit it?

## Current Status

As of `2026-03-26`:

- WordPress sitemap parity audit coverage: `693 / 693` URLs resolved in the custom app
- Imported `MarketingPage` rows in the database: `733`
- Major public route families are already covered in the custom app
- The remaining content work is mostly long-tail polish, not missing route families

Important nuance:

- `693` is the live WordPress sitemap URL count used for route parity auditing
- `733` is the number of imported `MarketingPage` records currently stored in the custom app database
- these are related, but they are not the same metric

## Imported Content Counts

### By Source Post Type

| Source Post Type | Count | Meaning |
| --- | ---: | --- |
| `page` | `107` | Imported WordPress pages |
| `post` | `587` | Imported WordPress blog/editorial posts |
| `healsend_product` | `38` | Imported WooCommerce / treatment-style marketing content |
| `generated` | `1` | App-generated fallback content record |

### By Marketing Page Type

| Page Type | Count | Meaning |
| --- | ---: | --- |
| `HOME` | `1` | Home-page content record |
| `CATEGORY` | `3` | DB-backed category landing pages |
| `PRODUCT` | `10` | DB-backed public product marketing pages |
| `CUSTOM` | `719` | Imported custom pages/posts and other long-tail content |

## Where This Content Lives

The imported WordPress content is stored in the Prisma `MarketingPage` model and resolved through the shared marketing route/data layer.

Core runtime files:

- `src/app/[slug]/page.jsx`
- `src/lib/marketing-data.js`
- `src/lib/marketing-pages.js`
- `src/components/marketing/*`

In practice, WordPress-origin content now lands in one of these buckets:

### 1. Native Home

- Route: `/`
- Primary source: `HOME` marketing data + app-native shell
- Rendered by the custom homepage components, not raw imported HTML

### 2. Category / Umbrella Landing Pages

These are public treatment-category entrypoints such as:

- `/weight-loss`
- `/sexual-health`
- `/anti-aging`
- `/strength-recovery`
- `/sleep`
- `/glutathione-ldn`
- `/psychiatry`

Not all of these are literal imported `CATEGORY` rows.

Current DB-backed `CATEGORY` rows:

| Slug | Current Title | Source |
| --- | --- | --- |
| `sexual-health` | `PT-141 Nasal Spray - Sexual Wellness Peptide` | `healsend_product` |
| `strength-recovery` | `Sermorelin` | `page` |
| `weight-loss` | `GLP-1 Weight Loss` | `page` |

Config-backed native category experiences also exist for:

- `anti-aging`
- `sleep`
- `glutathione-ldn`

These live in `src/lib/marketing-pages.js` and render through the same public category route system.

### 3. Public Marketing Product Pages

Current public `PRODUCT` marketing pages:

| Slug | Current Title | Source |
| --- | --- | --- |
| `enclomiphene` | `Enclomiphene – Hormone & Fertility Therapy Online` | `page` |
| `glutathione` | `Glutathione Injection Therapy — Doctor-Supervised Antioxidant & Detox Program | Healsend Telehealth` | `page` |
| `low-dose-naltrexone-ldn` | `Low-Dose Naltrexone (LDN)` | `healsend_product` |
| `nad-nasal-spray` | `NAD+ Nasal Spray | Cognitive Energy & Cellular Repair Boost` | `page` |
| `oxytocin-nasal-spray` | `Oxytocin Nasal Spray` | `healsend_product` |
| `pt-141-nasal-spray` | `PT-141 – Sexual Wellness Peptide Therapy Online` | `page` |
| `pt-141-nasal-spray-2` | `PT‑141 Nasal Spray (Bremelanotide)` | `healsend_product` |
| `semaglutide-injections` | `Semaglutide Injections Online` | `healsend_product` |
| `semaglutide-tablets` | `Semaglutide Tablets (Oral Semaglutide Pills for Weight Loss)` | `page` |
| `sermorelin-injection` | `Sermorelin Injection` | `healsend_product` |

These resolve through the marketing slug layer and the dedicated marketing product page renderer.

### 4. Imported Custom Pages And Posts

This is the biggest bucket: `719` `CUSTOM` rows.

These include:

- long-tail treatment pages
- promotional landing pages
- legal/compliance pages
- editorial/blog posts
- older WordPress builder pages

They no longer all render through one raw generic shell. They now fan out into native template families where possible.

## Native vs Imported-Cleaned Status

### Already Native Or Mostly Native

These content families now have dedicated app-native page treatments:

- homepage
- category/umbrella pages
- public product marketing pages
- psychiatry landing page
- high-value medication landing pages
- high-value treatment landing pages
- legal/compliance pages
- editorial/article pages
- shop, onboarding, account, cart, and order-confirmation app surfaces

Examples of native treatment/medication landers already moved off the generic imported shell:

- `adderall`
- `vyvanse-lisdexamfetamine`
- `lexapro`
- `wellbutrin-bupropion`
- `propranolol`
- `xanax-alprazolam`
- `paxil-paroxetine`
- `prozac`
- `klonopin-clonazepam`
- `lorazepam-ativan`
- `ambien-zolpidem`
- `tirzepatide-sublingual`
- `oral-tirzepatide`
- `tirzepatide-b12`
- `semaglutide-b12`
- `tirzepatide-injection`
- `lipotropic`
- `l-cartinine-injection`
- `mic-injection`
- `sermorelin-injection-2`
- `cjc-1295-ipamorelin`
- `viagra-sildenafil`

### Still Imported, But Cleaned And Controlled

Some long-tail WordPress-origin pages still derive their content from imported WordPress HTML, but they now render through structured native section layouts instead of dumping one raw imported body blob.

Current cleanup/normalization already in place:

- legacy internal WordPress links are rewritten to canonical custom-app routes
- duplicate hero images are stripped
- shortcode noise is removed or routed away
- old builder accordion/tab scaffolding is stripped
- placeholder `#` links and stale `/Quiz` links are removed
- suspicious placeholder/test image URLs are normalized away
- route-aware metadata, canonicals, and social images are generated in the custom app

So the remaining work is mostly page-by-page polish and curation, not missing route handling or raw-body rendering cleanup.

## Template Map

WordPress-origin content currently routes through these template families:

| Template Family | Used For | Main File |
| --- | --- | --- |
| Marketing category page | category / umbrella treatment pages | `src/components/marketing/category-page.jsx` |
| Marketing product page | public product marketing pages | `src/components/marketing/product-page.jsx` |
| Psychiatry page | psychiatry umbrella page | `src/components/marketing/psychiatry-page.jsx` |
| Medication / treatment landing | native medication and treatment pages | `src/components/marketing/medication-page.jsx` |
| Editorial article page | long-form posts and article-like pages | `src/components/marketing/article-page.jsx` |
| Legal document page | legal/compliance content | `src/components/marketing/legal-page.jsx` |
| Cleaned custom page | remaining imported custom content | `src/components/marketing/custom-page.jsx` |

## Redirect And Alias Layer

Not every old WordPress URL is meant to stay as-is.

The custom app also uses:

- canonical redirects for legacy WordPress slugs
- category/product alias handling
- shortcode fallback routing
- public route normalization such as `/home -> /` and `/admin-login -> /login`

That means some WordPress content is represented in the custom app through:

- direct rendering
- canonical redirects
- native replacement pages
- cleaned imported-content rendering

## How To Refresh The WordPress Content

The import script is:

```bash
npm run import:wordpress:content
```

It uses:

- SSH access to the WordPress/VPS host
- remote MySQL access through the WordPress DB container
- WordPress uploads/media URL normalization

Required environment variables:

- `WORDPRESS_SSH_HOST`
- `WORDPRESS_DB_USER`
- `WORDPRESS_DB_PASSWORD`

Optional environment variables:

- `WORDPRESS_SSH_PORT`
- `WORDPRESS_SSH_USER`
- `WORDPRESS_DB_CONTAINER`
- `WORDPRESS_DB_NAME`
- `WORDPRESS_SITE_URL`
- `WORDPRESS_ASSET_BASE_URL`

## How To Audit It

Useful commands:

```bash
npm run audit:wordpress:parity
npm run audit:shortcodes
npm run verify:shortcodes
npm run audit:media
npm run audit:seo
npm run verify:non-mdi
npm run verify:cutover:non-mdi
```

Important docs:

- `docs/audits/wordpress-parity-latest.md`
- `docs/audits/shortcode-pages-latest.md`
- `docs/audits/shortcode-runtime-latest.md`
- `docs/audits/public-media-latest.md`
- `docs/audits/public-seo-latest.md`
- `docs/audits/non-mdi-runtime-latest.md`
- `docs/replacement-progress.md`

## What Still Needs Content-Level Attention

The remaining WordPress-content work is no longer “find missing pages.”

What is still worth doing over time:

- re-author more long-tail imported pages into truly native custom sections
- keep reviewing long-tail CTAs, images, and copy for quality
- refresh/import again if live WordPress content changes materially before cutover
- use staging/production env validation before cutover for the non-content external pieces like Stripe, GHL, uploads, and webhooks

## Bottom Line

For WordPress-origin content, the custom app is now in a controlled state:

- route parity is effectively complete
- major public content families are mapped and covered
- the highest-value content is already on native app templates
- the remaining WordPress-origin work is mostly long-tail polish and curation
