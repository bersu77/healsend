# HealSend MDI Staging Validation

This document covers the remaining MDI work that cannot be proven by repo code alone.

The app-side MDI implementation is now in place.

What remains is validating the real provider contract in a staging or production-like environment.

## Local Preflight

Before touching staging, run the local MDI verifier:

```bash
npm run verify:mdi
npm run verify:mdi:payloads
npm run audit:mdi:env
```

Run the two runtime verifiers sequentially, not in parallel, because they intentionally project onto the same seeded local demo user/order during local validation.

This verifies the repo-side MDI flow locally against a running app instance:

- partner-auth completion
- webhook projection
- case snapshot creation
- message sync state
- visit history
- patient-facing MDI messages
- machine-route payload variants for customer linkage, order updates, voucher/tag updates, and voucher-based webhook resolution
- target-environment configuration readiness for the MDI-specific env surface

The latest local report is written to:

- [docs/audits/mdi-runtime-latest.md](./audits/mdi-runtime-latest.md)
- [docs/audits/mdi-payload-runtime-latest.md](./audits/mdi-payload-runtime-latest.md)
- [docs/audits/mdi-deployment-env-latest.md](./audits/mdi-deployment-env-latest.md)

## Required Staging Inputs

These values must be set to real staging/provider values before calling MDI cutover-ready:

- `NEXT_PUBLIC_APP_URL`
- `MD_API_BASE_URL`
- `MD_WEBHOOK_URL`
- `MD_CLIENT_ID`
- `MD_CLIENT_SECRET`
- `MD_WEBHOOK_SECRET`

Optional, depending on provider behavior:

- `MD_PATIENT_ID`
- `MD_DEFAULT_PATIENT_ID`
- `MD_IFRAME_URL`
- `MD_LOCAL_DEV_FALLBACK=false`

## Staging Validation Checklist

1. Confirm staging uses the real provider base URL and webhook URL.
2. Confirm MDI machine auth works with the staging client id/secret or webhook secret.
3. Complete a real staging checkout.
4. Verify the paid order is submitted to MDI.
5. Verify the returned/stored values:
   - `User.mdiPatientId`
   - `Order.mdiOrderId`
   - `Order.mdiCaseId`
   - `Order.mdiEncounterId` when applicable
6. Trigger or wait for representative webhook events:
   - `patient_linked`
   - `case_created`
   - `case_assigned`
   - `offering_submitted`
   - `prescription_submitted`
   - `consultation_completed`
7. Confirm the app persists:
   - `MdiWebhookEvent`
   - `MdiCaseSnapshot`
   - `MdiPatientMessageSync`
   - patient-facing `Message` rows
8. Verify patient-facing routes:
   - `/account`
   - `/consultation/[orderId]`
   - `/api/user/messages`
   - `/api/user/visits`
9. Verify partner-auth completion route if the provider/browser flow uses it:
   - `/api/mdi/partner-auth/complete`
10. Confirm no fallback/local-dev MDI path is being used in staging.

## Expected Staging Outcomes

The following should be true after a healthy staging run:

- the patient can open the consultation without manual DB edits
- account action items reflect the MDI case state
- the order shows provider/case/visit progression
- visits route returns normalized case snapshots
- patient messages contain MDI-derived care updates
- webhook logs match the expected lifecycle

## What Still Requires Human Validation

These cannot be fully proven by local code alone:

- exact provider payload variants for every live event type
- any provider-specific partner-auth redirect quirks
- real iframe/auth-link behavior against the live provider
- exact portal parity versus the current WordPress production behavior

## Decision Rule

MDI should only be called cutover-ready after:

- `npm run verify:mdi` passes locally
- `npm run verify:mdi:payloads` passes locally
- `npm run audit:mdi:env` passes in the target environment
- staging checkout-to-consultation flow passes with real MDI credentials
- representative live webhook events match the stored projection
- patient account/consultation behavior matches the expected care flow
