# MDI Payload Variant Verification

- Generated at: `2026-03-26T13:56:37.071Z`
- Base URL: `http://127.0.0.1:3213`
- Demo user: `demo@healsend.com`
- Order ID: `cmn5usz7j001q5i2vwa5ics2s`
- Case ID: `mdi-payload-case-1774533396736`
- Checks: `13`
- Passing: `13`
- Failing: `0`

The machine-route contract is handling the expected payload variants cleanly: customer linkage, nested order payloads, tag/voucher updates, GET partner-auth completion, and voucher-based webhook resolution all projected correctly.

## Check Results

- `login` — PASS — status 200
- `customer patch camelCase payload` — PASS — status 200
- `customer get route` — PASS — status 200
- `order patch nested payload` — PASS — status 200
- `order get route` — PASS — status 200
- `order tags patch alias payload` — PASS — status 200
- `order tags get route` — PASS — status 200
- `partner auth GET redirect` — PASS — status 307
- `webhook voucher fallback nested payload` — PASS — status 200
- `webhook mixed snake/camel payload` — PASS — status 200
- `user visits reflect variant payloads` — PASS — 7 visits
- `user messages reflect variant payloads` — PASS — 26 messages
- `database projection after variant flow` — PASS — events 2 / tag priority-review
