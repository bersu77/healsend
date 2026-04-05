# Commerce Runtime Verification

- Generated at: `2026-03-28T00:06:44.206Z`
- Base URL: `https://healsend.barikhan.studio`
- Demo user: `demo@healsend.com`
- Checks: `8`
- Passing: `8`
- Failing: `0`

The seeded authenticated commerce path is resolving cleanly for login, account, orders, subscriptions, payment methods, address, cart, and order confirmation.

## Check Results

- `login` — PASS — status 200
- `account page` — PASS — status 200 at /account
- `user orders api` — PASS — 2 orders
- `user payment methods api` — PASS — 1 payment methods
- `user subscriptions api` — PASS — 1 subscriptions
- `user address api` — PASS — 123 Wellness Way
- `cart api` — PASS — 2 cart items
- `order confirmation page` — PASS — status 200 at /order-confirmation?orderId=cmn9cj7hw0004jc2itsy9ey5r
