# MDI Deployment Environment Audit

- Generated at: `2026-04-07T08:12:02.952Z`
- Target: `production`
- Pass: `8`
- Warn: `1`
- Fail: `0`

The configured environment is ready for staging/provider-side MDI validation. Remaining work is the live external flow itself, not missing MDI configuration.

## Checks

- [PASS] `NEXT_PUBLIC_APP_URL` — Using https://healsend.com.
- [PASS] `MD_API_BASE_URL` — Using https://api.mdintegrations.com.
- [PASS] `MD_WEBHOOK_URL` — Using https://api.mdintegrations.com/woocommerce/orders.
- [PASS] `MD_CLIENT_ID` — MDI client id is set.
- [PASS] `MD_CLIENT_SECRET` — MDI client secret is set.
- [PASS] `MD_WEBHOOK_SECRET` — MDI webhook secret is set.
- [PASS] `MD_LOCAL_DEV_FALLBACK` — MDI local fallback is disabled.
- [WARN] `MD_IFRAME_URL` — No explicit iframe URL override is set.
  Action: This is fine if the provider returns auth links directly. Set MD_IFRAME_URL only if your provider requires a fixed embed URL.
- [PASS] `MD_PATIENT_ID / MD_DEFAULT_PATIENT_ID` — No fixed patient id override is set.
