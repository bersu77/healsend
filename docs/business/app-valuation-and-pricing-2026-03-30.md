# HealSend App Valuation And Pricing Note

Date: March 30, 2026

This is a practical pricing memo, not a formal valuation report or investment-bank appraisal.

It answers three different questions:

1. What would it cost to rebuild this app properly?
2. What would a client likely be quoted for it by different types of teams?
3. What might the codebase be worth in a distressed or asset-sale scenario?

## What Is Being Valued

The estimate below is for the software platform and launch work as it exists today, including:

- public marketing site and product-detail pages
- custom homepage/editor/dashboard tooling
- funnel and onboarding system
- checkout and payment-mode logic
- Stripe integration
- social auth
- MDI / consultation integration
- customer account area
- order / subscription / payment-method handling
- WordPress content and account migration tooling
- production deployment and cutover work

It is not a valuation of the whole business brand, customer list, medical network, or future revenue stream.

## Core Assumptions

- This is more complex than a brochure site or theme customization.
- The system has meaningful business logic, migration complexity, and third-party integration risk.
- A buyer or client is paying for working software and delivery risk reduction, not just raw lines of code.
- Ranges below assume competent engineering and a real launch-ready handoff, not a hacked demo.

## Four Practical Value Buckets

### 1. Fair Replacement Value

Estimated value: **$140,000 to $240,000**

This is the most neutral answer to "what is the software itself worth to recreate correctly?"

Why:

- the system combines commerce, healthcare intake, auth, dashboard CMS, migration, and deployment work
- there is real custom logic, not just front-end templates
- there is a meaningful amount of integration and QA surface area
- replacing it from scratch would take months, not days

This is the range I would use as the closest thing to a balanced software replacement estimate.

### 2. If A U.S. Team Built It

Estimated client-facing build cost: **$250,000 to $450,000**

Why:

- U.S. agency and senior-contract rates are materially higher
- product management, QA, revision cycles, deployment, and handoff usually get bundled into the bill
- healthcare-like workflows and payments raise delivery risk and review overhead

This number can go higher if the client wants:

- formal QA cycles
- accessibility and legal review
- stronger analytics / CRM / lifecycle automation
- mobile-app parity
- long-term maintenance SLAs

### 3. If A Pakistan Team Built It

Estimated client-facing build cost: **$70,000 to $170,000**

Why:

- labor cost is lower while technical capability can still be high
- the same scope can often be delivered at a much lower total budget
- even so, a serious team still needs to price for integration risk, revisions, and support

This assumes a good team that can actually own:

- product logic
- dashboard fixes
- payments
- migrations
- live deployment

It is not a "cheap freelancer" estimate.

### 4. If Sold By Someone Desperate

Estimated distressed-sale value: **$20,000 to $60,000**

Why the number collapses:

- buyers discount hard when handoff risk is high
- buyer assumes they will have to clean up code, docs, infra, and ownership gaps
- many distressed buyers value software as a shortcut, not as a premium asset
- urgency destroys negotiating leverage

This is the "I need to sell this now" range, not the fair value range.

## Client Quote View

If this were being quoted to a client today, I would frame it like this:

### Lean But Serious Quote

Estimated quote: **$120,000 to $180,000**

Use this when:

- scope is locked tightly
- one strong team handles design, build, and deployment
- the client is pragmatic and not asking for a long revision tail

### Full Agency Quote

Estimated quote: **$275,000 to $500,000**

Use this when:

- the client wants white-glove delivery
- project management and QA are formalized
- launch support and warranty are expected
- change requests are likely

## Resale / Acquisition View

There are two different ways people misuse "what is it worth?"

### Code-Only Asset Sale

Estimated value: **$40,000 to $120,000**

Why:

- buyers are valuing the shortcut and engineering time saved
- they are not paying a full rebuild price unless the handoff is exceptionally clean
- code-only sales usually get discounted for maintenance and knowledge-transfer risk

### Live Business Sale

This cannot be priced responsibly from code alone.

For a live operating business, value depends more on:

- trailing twelve-month revenue
- gross margin
- retention
- chargebacks / refunds
- customer acquisition efficiency
- clinical / operational dependency risk

In other words:

- **software value** and **business value** are not the same thing
- a modest software asset can sit inside a much more valuable operating business

## Recommended Talking Points

If someone asks casually, use one of these:

- "Fair rebuild value is roughly **$140k to $240k**."
- "A U.S. shop would probably charge **$250k to $450k**."
- "A strong Pakistan team could likely build it in the **$70k to $170k** range."
- "In a desperate asset sale, it could fall to **$20k to $60k**."

## Why The Range Is Not Lower

This app includes several categories of work that usually get underestimated:

- dashboard and CMS logic
- user/account and session systems
- healthcare-style intake flows
- third-party auth and payment integration
- migration from a legacy WordPress production setup
- deployment, rollback, and launch-risk handling

Any estimate that treats this like "just a landing page plus checkout" is too low.

## External Rate References

These links are useful for sanity-checking labor-side assumptions:

- Clutch 2026 software development pricing:
  - https://clutch.co/developers/pricing
- Clutch 2026 web development pricing:
  - https://clutch.co/web-developers/pricing
- Clutch 2026 web design pricing:
  - https://clutch.co/web-designers/pricing
- U.S. Bureau of Labor Statistics software developer wage data:
  - https://www.bls.gov/oes/2023/May/oes151252.htm

## Bottom Line

If someone asks for the single most honest shorthand answer:

**The app itself is probably worth around $140k to $240k as a fair replacement-value software asset, but the client quote or business sale number can be much higher depending on team geography, delivery model, and operating revenue.**
