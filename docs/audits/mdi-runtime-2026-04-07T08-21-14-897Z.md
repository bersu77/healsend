# MDI Runtime Verification

- Generated at: `2026-04-07T08:21:14.897Z`
- Base URL: `http://127.0.0.1:3000`
- Demo user: `demo@healsend.com`
- Order ID: `cmnocnxfl001qpn05dle69bb9`
- Case ID: `mdi-case-1775550074657`
- Checks: `13`
- Passing: `13`
- Failing: `0`

The local MDI contract is resolving cleanly: partner-auth completion, webhook projection, case snapshots, patient message sync, visit history, and account-facing MDI state all updated as expected.

## Check Results

- `login` — PASS — status 200
- `partner auth completion` — PASS — status 200
- `case_assigned webhook` — PASS — status 200
- `offering_submitted webhook` — PASS — status 200
- `prescription_submitted webhook` — PASS — status 200
- `user visits api` — PASS — 1 visits
- `user messages api` — PASS — 6 messages
- `user projection` — PASS — mdi-patient-1775550074657
- `order projection` — PASS — case mdi-case-1775550074657 / encounter mdi-encounter-1775550074657
- `case snapshot projection` — PASS — status completed
- `message sync projection` — PASS — mdi-patient-1775550074657
- `webhook event log` — PASS — 3 logged events
- `mdi care-team messages` — PASS — 4 case-specific messages
