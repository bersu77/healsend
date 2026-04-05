# Deployment And Verification

This is the current practical runbook for local verification, preview deployment, and post-launch production checks.

## Local Setup

Important scripts from [package.json](../../package.json):

- `npm run db:up`
- `npm run db:wait`
- `npm run db:push`
- `npm run db:generate`
- `npm run seed:admin`
- `npm run seed:dev-data`
- `npm run seed:onboarding-templates`
- `npm run db:bootstrap:dev`

Recommended local bootstrap:

```bash
npm run db:bootstrap:dev
```

## Seeded Credentials

From the seed scripts:

- admin: `admin@healsend.com` / `Admin123!`
- demo customer: `demo@healsend.com` / `Demo123!`

Files:

- [scripts/seed-dev-data.mjs](../../scripts/seed-dev-data.mjs)
- [scripts/seed-admin.mjs](../../scripts/seed-admin.mjs)

## Core Local Checks

Always run at least:

```bash
npm run lint
npm run build
```

## Runtime Verification Commands

These are the important verifier scripts:

- `npm run verify:catalog`
- `npm run verify:shortcodes`
- `npm run verify:non-mdi`
- `npm run verify:commerce`
- `npm run verify:mdi`
- `npm run verify:mdi:payloads`
- `npm run verify:uploads`
- `npm run verify:cutover:non-mdi`

Audit helpers:

- `npm run audit:catalog`
- `npm run audit:seo`
- `npm run audit:media`
- `npm run audit:copy`
- `npm run audit:wordpress:parity`
- `npm run audit:deployment:env`
- `npm run audit:mdi:env`

## Preview Deployment

Preview host:

- `https://healsend.barikhan.studio`

Server/app paths:

- app code: `/opt/healsend-next-preview`
- preview compose: `deploy/docker-compose.preview.yml`

Important warning:

- preserve `deploy/.env.preview` on the server
- do not let deploy sync delete it

Current deploy pattern:

```bash
rsync -az \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='deploy/.env.preview' \
  -e 'ssh -F /dev/null -p 6543' \
  ./ root@173.237.189.106:/opt/healsend-next-preview/

ssh -F /dev/null -p 6543 root@173.237.189.106 \
  'cd /opt/healsend-next-preview && docker compose -f deploy/docker-compose.preview.yml up -d --build app'
```

See also:

- [docs/deploy-preview-vps.md](../deploy-preview-vps.md)

## Production

Production domain:

- `https://healsend.com`

Current state:

- production is served by the Next.js app
- preview is still the safe place for most active testing
- legacy WordPress uploads were copied into the app container and mounted locally, so `/wp-content/uploads/...` URLs no longer depend on proxying back to WordPress

Practical note:

- WordPress still exists on the server for rollback/reference safety, but it is no longer the active public frontend

## Useful Live Checks

Route checks:

```bash
curl -k -sS -I https://healsend.barikhan.studio
curl -k -sS -I 'https://healsend.barikhan.studio/?auth=login'
curl -k -sS -I https://healsend.barikhan.studio/login
curl -k -sS -I https://healsend.barikhan.studio/account
curl -k -sS -I https://healsend.barikhan.studio/dashboard/funnels
curl -k -sS -I https://healsend.barikhan.studio/dashboard/affiliate-marketing
curl -k -sS -I https://healsend.barikhan.studio/pt-141-surge-2-in-1
curl -sS -I https://healsend.com
curl -sS -I https://healsend.com/shop
curl -sS -I https://healsend.com/funnels/glp-1
curl -sS -I https://healsend.com/tirzepatide-injections
curl -sS -I https://healsend.com/account
```

Alias/redirect checks:

```bash
curl -k -sS https://healsend.barikhan.studio/pt-141-oxytocin-nasal-sprays
```

## Smoke Tests Worth Doing After Deploy

### Public

- homepage returns `200`
- one weight-loss route
- one sexual-health route
- one anti-aging route
- one imported/custom editorial route

### Auth

- login opens through the shared homepage auth drawer
- `/login` and `/signup` redirect into `/?auth=...`
- Google / Apple auth buttons render when the environment has them enabled
- legacy provider-console callback compatibility through `wp-login.php?loginSocial=...` still works
- `/account` redirects when logged out
- admin can still reach `/dashboard`

### Checkout

- funnel reaches checkout
- Stripe payment intent initializes for card/link
- card form loads
- `UPFRONT_ZERO` funnels show `$0` due today and use manual capture
- `ALL_AT_ONCE` funnels show full due-today pricing and allow hosted BNPL methods
- `/dashboard/funnels` checkout-mode changes affect real checkout behavior, not just UI text

### MDI

- create-consultation returns a usable hosted URL for a real preview order
- consultation route loads the local iframe shell
- account shows sane patient-facing wording
- consultation page does not leak internal provider/debug copy on production

### Affiliate

- `/dashboard/affiliate-marketing` renders
- source/funnel/payment/patient metrics load

## Current Known Deployment Gotchas

- preview rebuilds can fail if disk is full on the VPS
- `.env.preview` must survive deploy sync
- preview data can contain older seeded/test records, so patient-account smoke tests need judgment
- some verifier failures can be data/timing-sensitive and need manual confirmation before assuming the app is broken
- Klarna still depends on Stripe account activation and buyer eligibility; on inactive accounts the app now fails fast with an in-app error instead of sending users to a dead hosted page
- production should not be treated as the first place to discover dashboard regressions; use preview first whenever possible
