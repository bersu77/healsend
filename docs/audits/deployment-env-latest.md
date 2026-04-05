# Deployment Environment Audit

- Generated at: `2026-03-26T06:15:52.601Z`
- Target: `production`
- External connectivity checks: `disabled`
- Pass: `1`
- Warn: `4`
- Fail: `4`

The configured environment is not cutover-ready yet. Fix the failing items below before treating the target environment as production-ready.

## Checks

- [FAIL] `NEXT_PUBLIC_APP_URL` — App URL still points at a local host (http://localhost:3000).
  Action: Use the real production HTTPS origin so canonicals, OAuth callbacks, robots, and sitemap output are correct.
- [FAIL] `STRIPE_SECRET_KEY` — Stripe secret key is not live-mode (test).
  Action: Use a live Stripe secret key before production cutover.
- [FAIL] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key is not live-mode (test).
  Action: Use a live publishable key before production cutover.
- [FAIL] `STRIPE_WEBHOOK_SECRET` — Stripe webhook secret is missing or placeholder.
  Action: Set the real Stripe webhook signing secret for the deployed endpoint.
- [WARN] `Google OAuth` — Google OAuth is disabled in this environment.
  Action: If you want Google sign-in at cutover, set real credentials and re-enable the provider.
- [WARN] `Apple OAuth` — Apple OAuth is disabled in this environment.
  Action: If you want Apple sign-in at cutover, set the full Apple OAuth config and re-enable the provider.
- [WARN] `GHL_API_KEY` — GoHighLevel sync/API is disabled in this environment.
  Action: If CRM contact sync is required at cutover, set a real GHL_API_KEY and re-enable GHL sync.
- [WARN] `GHL OAuth` — GHL OAuth is disabled in this environment.
  Action: If you depend on the OAuth flow, set real GHL_CLIENT_ID and GHL_CLIENT_SECRET and re-enable it.
- [PASS] `Uploads` — The app uses local filesystem uploads under public/uploads and does not require extra upload env vars.
  Action: Still verify runtime upload/write permissions in the deployed environment.
