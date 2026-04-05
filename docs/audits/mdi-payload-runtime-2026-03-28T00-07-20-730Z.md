# MDI Payload Variant Verification

- Generated at: `2026-03-28T00:07:20.730Z`
- Base URL: `https://healsend.barikhan.studio`
- Demo user: `demo@healsend.com`
- Order ID: `cmn5usz7j001q5i2vwa5ics2s`
- Case ID: `mdi-payload-case-1774656436602`
- Checks: `13`
- Passing: `1`
- Failing: `12`

## Failures

- `customer patch camelCase payload` — expected patient id mdi-payload-patient-1774656436602, got 401
- `customer get route` — expected linked customer projection, got 401
- `order patch nested payload` — expected nested order projection, got 401
- `order get route` — expected order projection with case snapshot, got 401
- `order tags patch alias payload` — expected updated tags/voucher, got 401
- `order tags get route` — expected voucher/tag projection, got 401
- `partner auth GET redirect` — expected redirect to /account, got 401
- `webhook voucher fallback nested payload` — expected voucher fallback webhook success, got 401
- `webhook mixed snake/camel payload` — expected mixed payload webhook success, got 401
- `user visits reflect variant payloads` — expected visit history for case mdi-payload-case-1774656436602, got 200
- `user messages reflect variant payloads` — expected case-specific patient messages, got 200
- `database projection after variant flow` — expected user/order/case snapshot projection from variant payloads

## Check Results

- `login` — PASS — status 200
- `customer patch camelCase payload` — FAIL — status 401
- `customer get route` — FAIL — status 401
- `order patch nested payload` — FAIL — status 401
- `order get route` — FAIL — status 401
- `order tags patch alias payload` — FAIL — status 401
- `order tags get route` — FAIL — status 401
- `partner auth GET redirect` — FAIL — status 401
- `webhook voucher fallback nested payload` — FAIL — status 401
- `webhook mixed snake/camel payload` — FAIL — status 401
- `user visits reflect variant payloads` — FAIL — 8 visits
- `user messages reflect variant payloads` — FAIL — 35 messages
- `database projection after variant flow` — FAIL — events 0 / tag priority-review
