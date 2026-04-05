# MDI Runtime Verification

- Generated at: `2026-03-28T00:06:51.814Z`
- Base URL: `https://healsend.barikhan.studio`
- Demo user: `demo@healsend.com`
- Order ID: `cmn5usz7j001q5i2vwa5ics2s`
- Case ID: `mdi-case-1774656409784`
- Checks: `13`
- Passing: `3`
- Failing: `10`

## Failures

- `partner auth completion` — expected successful partner auth completion, got 200
- `case_assigned webhook` — expected webhook success, got 401
- `offering_submitted webhook` — expected webhook success, got 401
- `prescription_submitted webhook` — expected webhook success, got 401
- `user projection` — expected user mdiPatientId mdi-patient-1774656409784, got null
- `order projection` — expected order case mdi-case-1774656409784 and encounter mdi-encounter-1774656409784
- `case snapshot projection` — expected provider, offerings, and prescriptions on case snapshot
- `message sync projection` — expected message sync row to store mdi patient id
- `webhook event log` — expected at least 3 logged webhook events, got 0
- `mdi care-team messages` — expected at least one persisted MDI-derived care-team message

## Check Results

- `login` — PASS — status 200
- `partner auth completion` — FAIL — status 200
- `case_assigned webhook` — FAIL — status 401
- `offering_submitted webhook` — FAIL — status 401
- `prescription_submitted webhook` — FAIL — status 401
- `user visits api` — PASS — 8 visits
- `user messages api` — PASS — 35 messages
- `user projection` — FAIL — no patient id
- `order projection` — FAIL — case none / encounter none
- `case snapshot projection` — FAIL — missing case snapshot
- `message sync projection` — FAIL — missing sync row
- `webhook event log` — FAIL — 0 logged events
- `mdi care-team messages` — FAIL — 0 case-specific messages
