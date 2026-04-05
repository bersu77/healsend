# HealSend MDI Audit and Implementation Status

This document captures the current state of the `MDI` / `MD Integrations` migration for the HealSend custom Next.js site.

MDI is still deferred from cutover, but implementation work has now started.

The implementation path for solving it is documented separately in [docs/mdi-solution-plan.md](./mdi-solution-plan.md).
The remaining staging/provider validation work is documented in [docs/mdi-staging-validation.md](./mdi-staging-validation.md).

## Decision

MDI is not being treated as complete in the current replacement milestone.

The custom site can continue progressing on public-site parity, but it should not yet be considered a full replacement for the live WordPress medical workflow until the items below are completed.

## Current Implementation Status

### Completed in the current MDI phase

- Prisma now stores durable MDI linkage/state on `User` and `Order`
- raw inbound MDI deliveries now persist to `MdiWebhookEvent`
- `src/lib/mdi-client.js` now centralizes MDI config, token/auth calls, payload normalization, outbound order submission, and order/user projection helpers
- `src/app/api/create-consultation/route.js` now reads and writes the richer MDI state instead of relying only on consultation fields
- `src/app/api/webhooks/mdi/route.js` now stores raw events first, resolves orders by broader MDI identifiers, and updates both user and order projections
- new machine-to-machine routes now exist for customer linkage and order state:
  - `src/app/api/mdi/customers/[id]/route.js`
  - `src/app/api/mdi/orders/[id]/route.js`
  - `src/app/api/mdi/orders/[id]/tags/route.js`
- partner auth completion now has a dedicated route:
  - `src/app/api/mdi/partner-auth/complete/route.js`
- normalized visit history now has a dedicated user route:
  - `src/app/api/user/visits/route.js`
- paid Stripe checkout now attempts outbound MDI order submission through `src/app/api/webhooks/stripe/route.js`
- local end-to-end MDI runtime verification now exists via `npm run verify:mdi`
- the latest local verification report is tracked at [docs/audits/mdi-runtime-latest.md](./audits/mdi-runtime-latest.md)
- payload-variant verification now exists via `npm run verify:mdi:payloads`
- the latest payload-variant report is tracked at [docs/audits/mdi-payload-runtime-latest.md](./audits/mdi-payload-runtime-latest.md)
- target-environment config readiness now has a dedicated audit via `npm run audit:mdi:env`
- the latest environment audit is tracked at [docs/audits/mdi-deployment-env-latest.md](./audits/mdi-deployment-env-latest.md)
- the local runtime verifier currently passes `13 / 13`
- the local payload-variant verifier currently passes `13 / 13`

### Not complete yet

- production MDI contract still needs staging verification against the real provider behavior
- live provider payloads still need staging validation against the exact external contract, even though local payload-variant coverage is now in place
- consultation / portal parity is now strong on the repo side, but it still needs real provider QA before it can be called cutover-ready
- the current local env audit still shows concrete staging blockers: localhost app URL, missing explicit `MD_API_BASE_URL`, root-only `MD_WEBHOOK_URL`, missing `MD_WEBHOOK_SECRET`, and `MD_LOCAL_DEV_FALLBACK=true`

## What The Current Next App Already Has

### Existing local implementation

- `src/app/api/create-consultation/route.js`
  - can issue an MDI partner token
  - can request a patient auth link
  - can fall back to a direct webhook-style provider call
  - stores consultation URL and status on the local order
- `src/app/api/webhooks/mdi/route.js`
  - accepts inbound MDI updates
  - resolves orders in a very limited way
  - stores consultation id/url/status
- `src/app/consultation/[orderId]/page.jsx`
  - renders the consultation iframe
  - refreshes auth if the embed expires
  - handles basic embed events

## What The Live WordPress Site Is Doing

The live VPS runs WordPress plugins that implement a broader MDI contract than the current Next app.

### Live plugin areas audited

- `m-d-integrations-connect`
- `telegramd-patient-portal`

### Important live behavior

- WordPress sends the full WooCommerce order to MDI via `POST /woocommerce/orders`
- WordPress stores voucher/tag/case-style state on orders
- WordPress exposes inbound MDI routes for:
  - updating order tag/status
  - reading order tag/status
  - linking an MDI patient to a WooCommerce customer
  - partner auth completion
- WordPress patient portal logic uses richer order resolution rules for incoming MDI events
- WordPress messages/visits behavior depends on patient linkage and MDI patient APIs, not just local order fields

## The Gap

### Current Next implementation is too narrow

Right now the custom app mostly models MDI as:

- create or fetch a consultation URL
- store consultation state on an order
- render an iframe

That is not the same as the live WordPress medical workflow.

### Missing parity areas

- full outbound order submission to MDI
- persistent MDI patient linkage on users
- order tag and voucher lifecycle
- case and encounter tracking
- richer webhook/event handling
- patient messages parity
- visits/medications parity
- production-grade order-to-patient-to-case reconciliation

## Why This Is Deferred From Cutover

The MDI migration is important, but it is a separate cutover track from marketing and content parity.

Deferring it for now is reasonable because:

- public-site replacement can continue independently
- the current custom app already has enough partial MDI scaffolding to inform the final migration
- forcing a rushed MDI cutover would be riskier than explicitly tracking it as unfinished

## What Must Be Built Before MDI Can Be Called Complete

### 1. Expand the Prisma model

Add durable MDI state for users and orders, such as:

- patient id
- case id
- encounter id
- order tag/status from MDI
- voucher/intake metadata
- consultation phase
- offerings added/submitted markers
- prescription metadata
- raw webhook snapshots where useful

Status:
- Mostly complete for the current phase. Core user/order fields, raw webhook storage, `MdiCaseSnapshot`, and `MdiPatientMessageSync` now exist.

### 2. Recreate the real outbound order sync

The custom app should send a real order payload to MDI during the proper order lifecycle, not only at consultation-open time.

Status:
- Started. Paid Stripe checkout now triggers outbound order submission through the shared MDI client.

### 3. Add inbound partner routes

The current app needs equivalents for the live WordPress routes that let MDI:

- patch customer patient ids
- patch order tags
- read order tags
- complete partner auth if needed

Status:
- Complete on the repo side. Customer-link, order-state, order-tag, and partner-auth completion routes now exist. The remaining work is validating the live provider contract in staging.

### 4. Replace the simple webhook handler

The current `src/app/api/webhooks/mdi/route.js` is not enough for parity.

It needs to support:

- case lifecycle events
- offerings events
- prescription events
- patient-linked order resolution
- case-linked order resolution
- voucher-based fallback resolution

Status:
- Complete on the repo side. The webhook now persists raw deliveries, resolves broader identifiers, upserts normalized case snapshots, and creates patient-facing care-team message entries from key lifecycle events. The remaining work is validating payload coverage against the live provider.

### 5. Rebuild patient portal parity

The account area should eventually support the production-required behavior for:

- action items
- messages
- visits
- doctor chat/access

using the real MDI-backed state model.

Status:
- Complete on the repo side for the current scope. Account, care-history, consultation, patient messages, and normalized visit history now consume MDI-backed state. The remaining work is validating parity against the live provider-backed portal behavior.

## Recommended Future Implementation Order

1. Expand DB schema for MDI lifecycle state
2. Add outbound order submission to MDI
3. Add inbound customer/order tag routes
4. Expand webhook event handling
5. Rebuild messages/visits parity
6. Run staging QA before any live cutover

For the concrete build order, target architecture, schema suggestions, and testing plan, use [docs/mdi-solution-plan.md](./mdi-solution-plan.md).

## Current Rule

Until the above is finished:

- public-site parity can continue
- content migration can continue
- catalog and route parity can continue
- MDI should be treated as in progress, documented, and incomplete

## One-Line Summary

The current custom app now has a full repo-side MDI implementation path, but it still needs provider-contract validation in staging before it can replace the live WordPress MDI workflow with confidence.
