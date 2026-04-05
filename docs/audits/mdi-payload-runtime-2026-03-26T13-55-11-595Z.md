# MDI Payload Variant Verification

- Generated at: `2026-03-26T13:55:11.595Z`
- Base URL: `http://127.0.0.1:3213`
- Demo user: `demo@healsend.com`
- Order ID: `cmn5usz7j001q5i2vwa5ics2s`
- Case ID: `mdi-payload-case-1774533311124`
- Checks: `13`
- Passing: `7`
- Failing: `6`

## Failures

- `customer patch camelCase payload` — expected patient id mdi-payload-patient-1774533311124, got 404
- `customer get route` — expected linked customer projection, got 404
- `order patch nested payload` — expected nested order projection, got 404
- `order get route` — expected order projection with case snapshot, got 404
- `order tags patch alias payload` — expected updated tags/voucher, got 404
- `order tags get route` — expected voucher/tag projection, got 404

## Check Results

- `login` — PASS — status 200
- `customer patch camelCase payload` — FAIL — status 404
- `customer get route` — FAIL — status 404
- `order patch nested payload` — FAIL — status 404
- `order get route` — FAIL — status 404
- `order tags patch alias payload` — FAIL — status 404
- `order tags get route` — FAIL — status 404
- `partner auth GET redirect` — PASS — status 307
- `webhook voucher fallback nested payload` — PASS — status 200
- `webhook mixed snake/camel payload` — PASS — status 200
- `user visits reflect variant payloads` — PASS — 4 visits
- `user messages reflect variant payloads` — PASS — 14 messages
- `database projection after variant flow` — PASS — events 2 / tag none
