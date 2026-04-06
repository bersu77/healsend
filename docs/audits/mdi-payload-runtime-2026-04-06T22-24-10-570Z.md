# MDI Payload Variant Verification

- Generated at: `2026-04-06T22:24:10.570Z`
- Base URL: `http://127.0.0.1:3000`
- Demo user: `demo@healsend.com`
- Order ID: `cmnfllubk001qmt0usfrl4wkm`
- Case ID: `mdi-payload-case-1775514248230`
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
- `user visits reflect variant payloads` — PASS — 12 visits
- `user messages reflect variant payloads` — PASS — 10 messages
- `database projection after variant flow` — PASS — events 2 / tag active
