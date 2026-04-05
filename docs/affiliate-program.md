# Affiliate Program — Implementation Reference

_Created during the Phase 6 build. Covers everything added to support the HealSend affiliate program._

---

## Overview

The affiliate program lets approved users earn flat-rate commissions on every new patient subscription they refer. Commissions are tracked via `AffiliateApplication`, `AffiliateEvent`, and `AffiliateSession` Prisma models (already existed in the schema before this build).

---

## Commission Structure

| Product                | Monthly | 3-Month | 12-Month |
| ---------------------- | ------- | ------- | -------- |
| Tirzepatide Injections | $50     | $100    | $260     |
| Semaglutide Injections | $35     | $70     | $200     |

Defined in: `src/lib/affiliate-commissions.js`

---

## Files Added / Modified

### New Files

| File                                   | Purpose                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `src/lib/affiliate-commissions.js`     | Commission table constants (`AFFILIATE_COMMISSIONS`, `PLAN_INTERVAL_LABELS`) |
| `src/app/api/affiliate/apply/route.js` | `POST /api/affiliate/apply` — Create or re-submit an affiliate application   |
| `src/app/api/affiliate/stats/route.js` | `GET /api/affiliate/stats` — Return current user's application + earnings    |

### Modified Files

| File                                 | What Changed                                                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/account/account-client.jsx` | Added `"affiliate"` entry to `TABS` array; added `{activeTab === "affiliate" && <AffiliateTab />}` renderer; appended `AffiliateTab` and `AffiliateApplyForm` components at end of file |

---

## API Endpoints

### `POST /api/affiliate/apply`

**Auth:** Session cookie required  
**Body:**

```json
{
  "motivation": "string (required)",
  "website": "string (optional)",
  "notes": "string (optional)"
}
```

**Behavior:**

- Returns existing application unchanged if status is `PENDING` or `APPROVED`
- Creates a new application (status `PENDING`) if none exists
- Resets `status` to `PENDING` and clears `rejectionReason` if the previous application was `REJECTED`
- `firstName`, `lastName` are parsed from `user.name`; `phone` from `user.phone`

**Responses:**

- `201` — `{ application }` (created or re-submitted)
- `200` — `{ application }` (already pending/approved, no change)
- `400` — `{ error }` (missing motivation)
- `401` — Unauthenticated

---

### `GET /api/affiliate/stats`

**Auth:** Session cookie required  
**Response:** `{ application: AffiliateApplication | null }`

Returns the current user's `AffiliateApplication` record including:

- `status` (`PENDING` | `APPROVED` | `REJECTED`)
- `referralCode` (set by admin on approval)
- `totalEarnings`, `pendingPayout` (maintained by backend jobs / admin)
- `rejectionReason` (if rejected)
- `approvedAt`, `createdAt`, `updatedAt`

---

## UI — Affiliate Tab

Located in `src/app/account/account-client.jsx` as `AffiliateTab`.

**States displayed:**

1. **Loading** — spinner text while fetching `/api/affiliate/stats`
2. **No application** — shows commission table + application form
3. **Pending** — yellow notice with submission date
4. **Approved** — stats cards (status badge, referral code, total earned, pending payout) + referral link
5. **Rejected** — red notice with rejection reason + re-application form

**`AffiliateApplyForm` component:**  
Sub-component rendered for `null` and `REJECTED` states. Fields:

- `motivation` (required textarea)
- `website` (optional URL input)

On success it shows a green confirmation message and does not reload the page.

---

## Signup Form Changes

### `src/components/auth/SignupPageClient.jsx`

Added `firstName`, `lastName`, `phone` required input fields (with 2-column name layout). The combined name is passed to `register(email, password, \`${firstName} ${lastName}\`, phone)`.

### `src/app/api/auth/register/route.js`

Added server-side validation:

- `name` is now required (returns 400 if missing/blank)
- `phone` is now required (returns 400 if missing/blank)
- `user.create` uses `name.trim()` and `phone.trim()` (no longer nullable on new signups)

---

## Data Model (unchanged — pre-existing)

```prisma
model AffiliateApplication {
  id               String                    @id @default(cuid())
  userId           String                    @unique
  status           AffiliateApplicationStatus @default(PENDING)
  referralCode     String?
  firstName        String
  lastName         String
  phone            String
  motivation       String?
  website          String?
  notes            String?
  rejectionReason  String?
  approvedAt       DateTime?
  totalEarnings    Float                     @default(0)
  pendingPayout    Float                     @default(0)
  createdAt        DateTime                  @default(now())
  updatedAt        DateTime                  @updatedAt
  user             User                      @relation(fields: [userId], references: [id])
}

enum AffiliateApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## Admin Workflow (manual, not yet automated)

1. Review pending applications in DB / admin panel
2. Set `status` to `APPROVED` or `REJECTED`
3. On approval: assign a unique `referralCode` and set `approvedAt`
4. Commission tracking via `AffiliateEvent` records (tracked by `/api/affiliate/track`)
5. Payout: update `totalEarnings` / `pendingPayout` manually or via future payout script
