# MDI Deployment Environment Audit

- Generated at: `2026-03-26T13:53:49.371Z`
- Target: `production`
- Pass: `3`
- Warn: `1`
- Fail: `5`

The configured environment is not ready for MDI cutover validation yet. Fix the failing items below before treating the environment as provider-ready.

## Checks

- [FAIL] `NEXT_PUBLIC_APP_URL` — App URL still points at a local host (http://localhost:3000).
  Action: Use the real deployed origin so callback URLs and public links are correct.
- [FAIL] `MD_API_BASE_URL` — MDI API base URL is missing or placeholder.
  Action: Set the real provider API base URL explicitly for the target environment.
- [FAIL] `MD_WEBHOOK_URL` — MDI webhook URL does not include a concrete endpoint path (https://api.mdintegrations.com). Outbound order sync will currently skip.
  Action: Set MD_WEBHOOK_URL to the provider's direct order-submission endpoint path, not just the domain root.
- [PASS] `MD_CLIENT_ID` — MDI client id is set.
- [PASS] `MD_CLIENT_SECRET` — MDI client secret is set.
- [FAIL] `MD_WEBHOOK_SECRET` — MDI webhook secret is missing or placeholder.
  Action: Set the real inbound webhook secret so provider callbacks can be authenticated safely.
- [FAIL] `MD_LOCAL_DEV_FALLBACK` — MDI local fallback is still enabled.
  Action: Set MD_LOCAL_DEV_FALLBACK=false before any real staging or production validation.
- [WARN] `MD_IFRAME_URL` — No explicit iframe URL override is set.
  Action: This is fine if the provider returns auth links directly. Set MD_IFRAME_URL only if your provider requires a fixed embed URL.
- [PASS] `MD_PATIENT_ID / MD_DEFAULT_PATIENT_ID` — No fixed patient id override is set.
