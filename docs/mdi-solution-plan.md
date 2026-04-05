# HealSend MDI Solution Plan

This document turns the MDI audit into an implementation plan.

It answers one practical question:

How do we move the current partial MDI wiring in this Next.js app to full WordPress-parity medical workflow support?

## Goal

Replace the live WordPress MDI contract with a production-ready Next.js implementation that supports:

- outbound order submission to MDI
- stable user-to-patient linkage
- stable order-to-case linkage
- webhook-driven lifecycle updates
- consultation launch and refresh
- patient portal parity for messages, visits, and action items

This is the work required before HealSend can claim true medical-workflow replacement parity.

## Current State

The current app has partial MDI scaffolding:

- [src/app/api/create-consultation/route.js](../src/app/api/create-consultation/route.js)
  - gets an MDI partner token
  - requests a patient auth link
  - can fall back to a direct webhook endpoint
  - stores consultation URL/state on the order
- [src/app/api/webhooks/mdi/route.js](../src/app/api/webhooks/mdi/route.js)
  - accepts a narrow webhook payload
  - resolves orders only by order id/order number/consultation id
  - stores consultation id/url/status
- [src/app/consultation/[orderId]/page.jsx](../src/app/consultation/[orderId]/page.jsx)
  - launches the iframe
  - refreshes auth when needed
  - handles the OTP/embed handshake

The database only models MDI at a consultation level today:

- [prisma/schema.prisma](../prisma/schema.prisma)
  - `Order.consultationId`
  - `Order.consultationUrl`
  - `Order.consultationStatus`

That is not enough to replace the live WordPress workflow.

## What WordPress Is Doing That We Still Need

The audited WordPress plugins use MDI for more than consultation launch.

The missing parity areas are:

- full order submission to MDI
- patient linkage back onto the customer
- MDI order tags / voucher state
- case and encounter tracking
- richer event handling beyond consultation status
- message/visit portal behavior based on MDI state

So the target contract is not:

"open an iframe"

It is:

"order -> patient -> case -> consultation -> webhook lifecycle -> patient portal state"

## Target Architecture

## 1. Durable schema

Expand local persistence so MDI state is not hidden in ad hoc payloads.

Recommended additions:

### `User`

- `mdiPatientId String? @unique`
- `mdiPatientStatus String?`
- `mdiLastSyncedAt DateTime?`

### `Order`

- `mdiOrderId String?`
- `mdiCaseId String?`
- `mdiEncounterId String?`
- `mdiOrderTag String?`
- `mdiOrderStatus String?`
- `mdiVoucherCode String?`
- `mdiWorkflowPhase String?`
- `mdiLastWebhookAt DateTime?`
- `mdiConsultationRefreshedAt DateTime?`

### New tables

Recommended new models:

- `MdiWebhookEvent`
  - raw payload log
  - delivery id / event type
  - processed status
  - linked `orderId`
- `MdiCaseSnapshot`
  - current normalized case state
  - status, provider, offerings, prescriptions, notes
- `MdiPatientMessageSync`
  - local sync watermark / cursor if message parity is needed

The important rule is: webhook events should be append-only, while order/case state should be the latest normalized projection.

## 2. Outbound integration flow

The current app creates consultation access too late in the lifecycle.

The live parity flow should be:

1. customer completes onboarding / checkout
2. local order is created and paid
3. app sends the full order payload to MDI
4. MDI returns or later emits patient/case linkage
5. local order stores the linkage fields
6. consultation launch reads those saved fields instead of inventing them on demand

Implementation target:

- create a shared server module such as `src/lib/mdi-client.js`
- move all outbound MDI HTTP calls there
- add a service-level function such as `submitOrderToMdi(orderId)`
- trigger that from the post-payment success path, not only from consultation open

The checkout side should stay idempotent:

- if an order has already been submitted, do not submit it twice
- store MDI request ids / external ids where possible

## 3. Inbound partner routes

The current webhook endpoint is too narrow.

Add explicit inbound routes for the behaviors WordPress already supports:

- patient linkage
  - example: patch the local user/customer with `mdiPatientId`
- order tag updates
  - store MDI tag/status progression on the order
- order tag reads
  - only if MDI expects to query local order state
- partner auth completion
  - only if required by the real MDI partner flow

These should live under a dedicated namespace, for example:

- `src/app/api/mdi/customers/[id]/route.js`
- `src/app/api/mdi/orders/[id]/tags/route.js`
- `src/app/api/mdi/orders/[id]/route.js`

The goal is to separate:

- consultation launch routes for the frontend
- machine-to-machine MDI routes for lifecycle syncing

## 4. Webhook processing

Replace the current thin webhook handler with a real event processor.

The webhook layer should:

- authenticate the event
- persist the raw event first
- resolve the local order/user/case linkage
- update normalized state tables
- update the order projection
- mark the event processed

Resolution order should be broader than today:

1. local internal order id
2. local order number
3. `mdiOrderId`
4. `mdiCaseId`
5. `mdiPatientId` plus current open order heuristics
6. voucher/tag fallback if MDI uses that contract

Event types to support:

- patient linked / customer linked
- consultation created
- consultation ready
- consultation completed
- case created
- case assigned
- case updated
- offering added
- offering submitted
- prescription submitted
- case cancelled / closed

The current [src/app/api/webhooks/mdi/route.js](../src/app/api/webhooks/mdi/route.js) should eventually become a thin HTTP entrypoint that calls a shared processor module.

## 5. Consultation route

The consultation page is already the strongest part of the current implementation.

Keep:

- iframe launch
- OTP handshake
- refresh-auth logic

Change:

- read `mdiPatientId`, `mdiCaseId`, and `mdiWorkflowPhase` from normalized order state
- do not treat `consultationId` as a stand-in for patient id
- log refresh attempts and store refresh timestamps
- present clear UI states when:
  - case exists but messaging auth is not ready
  - patient link is missing
  - webhook sync is pending

## 6. Patient portal parity

After lifecycle sync exists, rebuild the account experience around MDI state.

Eventually the account area should support:

- doctor chat/messages
- case / visit status
- consultation continuation
- medication / prescription state where applicable

That should come from:

- normalized local MDI projection tables
- and, where needed, direct MDI patient API reads

Do not build final portal parity on generic local placeholder messages.

## Recommended Build Order

### Phase 1: Schema and infrastructure

- expand Prisma schema
- add migrations
- add shared MDI client module
- add raw webhook event table

### Phase 2: Outbound order sync

- create `submitOrderToMdi`
- trigger it from the paid-order lifecycle
- store `mdiOrderId`, `mdiPatientId`, `mdiCaseId` when available

### Phase 3: Inbound sync and projection

- add partner/customer routes
- replace the webhook handler with event processing
- build normalized order/case projections

### Phase 4: Consultation + portal parity

- update consultation launch to use normalized MDI state
- rebuild account messages/visits/actions around MDI-backed data

### Phase 5: Staging cutover

- test against real MDI sandbox or staging credentials
- verify event delivery and replay handling
- verify patient linkage
- verify consultation launch and refresh
- verify post-checkout -> MDI -> account lifecycle

## Testing Plan

Required tests before live cutover:

### Unit / service tests

- token/auth client behavior
- outbound payload mapping
- webhook signature/auth validation
- order resolution rules
- idempotent event handling

### Integration tests

- paid order submits once to MDI
- webhook creates patient/order/case linkage
- consultation page launches with stored case context
- refresh-auth path updates the order correctly

### Staging scenarios

- new patient order
- existing patient repeat order
- missing webhook retry
- duplicate webhook delivery
- case closed / cancelled
- consultation auth expired and refreshed

## Env and Secrets

Production MDI cutover should use a clean dedicated env contract:

- `MD_API_BASE_URL`
- `MD_CLIENT_ID`
- `MD_CLIENT_SECRET`
- `MD_WEBHOOK_SECRET`
- `MD_WEBHOOK_URL`
- `MD_IFRAME_URL` if still required

Local-only fallback envs like `MD_LOCAL_DEV_FALLBACK` must stay disabled in production.

## Cutover Rule

Do not switch the medical workflow until all of these are true:

- outbound order submission is live
- inbound patient/case linkage is persisted
- webhook processing is idempotent and observable
- consultation launch uses real stored MDI state
- account/portal surfaces reflect real MDI lifecycle state
- staging has passed end-to-end tests with real MDI credentials

## Definition of Done

MDI is only solved when:

- WordPress is no longer the source of truth for MDI lifecycle state
- the Next app can create, receive, reconcile, and display the full MDI order-to-patient-to-case flow
- support staff can inspect MDI state from the custom app and DB
- a patient can go from checkout to consultation to follow-up without relying on WordPress

## Short Version

The fix is not "make the iframe work better."

The fix is:

- store real MDI patient/case/order state
- sync orders outbound at the right lifecycle moment
- process MDI events inbound into durable projections
- rebuild consultation and account behavior on top of that model
