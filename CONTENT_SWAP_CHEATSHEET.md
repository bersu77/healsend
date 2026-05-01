# Funnel Cloning Cheat Sheet

> A practical find-and-replace map for cloning `glp1-funnel.html` into a new
> telehealth vertical (hair loss, ED, skincare, mental health, fertility,
> hormone therapy, weight management variants, etc.).

**Use this with `glp1-funnel.html` as your starting point.** Open both files
side-by-side, follow the steps in order, and you'll have a complete new
funnel in roughly 90 minutes.

---

## TL;DR — The 5-Minute Quick Start

1. **Duplicate the file** → rename to `<vertical>-funnel.html` (e.g. `hairloss-funnel.html`).
2. **Find-and-replace** brand strings: `HealSend` → `YourBrand`, `GLP-1` → `<your category>`, `weight loss` → `<your outcome>`.
3. **Edit the `CONTENT` block** (~line 2631) — every user-facing string lives there.
4. **Edit the `CONFIG` block** (~line 2864) — pricing, products, clinical thresholds, stats.
5. **Replace 3 vertical-specific steps** (search `🔁 SWAP FOR NEW VERTICAL`):
   - Step 3 (Calculator/Intake)
   - Step 5 (Results/Projection)
   - Step 8 (Medication picker)
6. **Replace embedded images** (logo, doctor, badge — all base64 data URIs).
7. **Plug in your backend** by setting `window.API = {...}` before the script tag.

Done. Everything else works as-is.

---

## Section 1 — The CONTENT Block: Every String, In Order

Search for `const CONTENT = {` (around line 2631). This is where every
headline, lede, button, error message, and microcopy string lives. The
values below are CURRENT (GLP-1) — replace each with your vertical's copy.

### Brand & meta

| CONTENT key | Current (GLP-1) | What it is |
|-------------|-----------------|------------|
| `pageTitle` | `'HealSend · Lose weight with GLP-1'` | `<title>` tag in browser tab |
| `loading.planLoading` | `'LOADING YOUR PLAN…'` | Mono caption under preview-step progress bar |

### Step 1 — Goal selection (the very first screen)

| CONTENT key | Current | Replace with |
|-------------|---------|--------------|
| `goal.eyebrow` | `'Step 1 · Your goal'` | Same shape, just match step count |
| `goal.frameStripBad` | `'Diets'` | The thing that DOESN'T work in your vertical (e.g. `'Hair pills'`, `'Drugstore creams'`) |
| `goal.frameStripGood` | `'Real, lasting weight loss'` | The outcome that DOES work (e.g. `'Real, lasting regrowth'`, `'Real, lasting clear skin'`) |
| `goal.headline` | `{ text: 'What matters ', accent: 'most', tail: ' to you?' }` | Keep "What matters most" framing — works for any vertical |
| `goal.lede` | `'No wrong answers. We use this to personalize your plan.'` | Reusable as-is |
| `goal.options` | 4 weight-loss motivations | **REPLACE WITH YOUR 4 OPTIONS** — see vertical examples below |

**Vertical examples for `goal.options`:**

```js
// HAIR LOSS
goal.options: [
  { value: 'stop',      title: 'Stop my hair loss',           desc: 'Halt the receding line.' },
  { value: 'regrow',    title: 'Regrow what I\'ve lost',      desc: 'Restore visible density.' },
  { value: 'thicken',   title: 'Thicken thinning hair',       desc: 'Maintain what I have.' },
  { value: 'confidence',title: 'Get my confidence back',      desc: 'Look in the mirror again.' },
],

// ED
goal.options: [
  { value: 'perform',   title: 'Perform reliably',            desc: 'No more anxious nights.' },
  { value: 'duration',  title: 'Last longer',                 desc: 'Take your time.' },
  { value: 'reconnect', title: 'Reconnect with my partner',   desc: 'Intimacy without stress.' },
  { value: 'discreet',  title: 'Get help discreetly',         desc: 'No awkward conversations.' },
],

// SKINCARE / ACNE
goal.options: [
  { value: 'clear',     title: 'Clear up active breakouts',   desc: 'Stop new pimples forming.' },
  { value: 'scars',     title: 'Fade post-acne marks',        desc: 'Even out my skin tone.' },
  { value: 'prevent',   title: 'Prevent future acne',         desc: 'Keep skin clear long-term.' },
  { value: 'glow',      title: 'Get a clear, glowing look',   desc: 'Skin I\'m proud to show.' },
],
```

### Step 2 — Preview / loading screen

| CONTENT key | Current | Notes |
|-------------|---------|-------|
| `preview.headline` | `'Your Personalized Plan — in 2 minutes.'` | Reusable as-is |
| `preview.goalLabel` | `'Primary goal:'` | Reusable as-is |
| `preview.timeline[0]` | `Quick health profile / Target weight, body & lifestyle / 60s` | **EDIT desc** to fit your intake |
| `preview.timeline[1]` | `We match your plan / Medication, dose & timeline / 30s` | Reusable |
| `preview.timeline[2]` | `Clinician reviews & prescribes / Fast provider review / 30s` | Reusable |

### Step 3 — Calculator / Intake (vertical-specific markup, see Section 3)

The CONTENT keys here drive labels but the *fields themselves* are in HTML
markup that needs to change for new verticals.

| CONTENT key | Current (BMI calc) | For new verticals |
|-------------|--------------------|--------------------|
| `calc.eyebrow` | `'Step 3 · Quick numbers'` | Keep, edit step number |
| `calc.headline` | `'Your basics. We\'ll do the math.'` | E.g. `'A few questions. We\'ll do the rest.'` |
| `calc.ledePrefix` | `'Takes 15 seconds.'` | Reusable |
| `calc.lede` | `' We use this to personalize your projection.'` | Reusable |
| `calc.labelHeight` | `'Your height'` | Replace with your field labels |
| `calc.labelWeight` | `'Your current weight'` | Replace with your field labels |
| `calc.placeholderFt/In/Lbs` | `'Feet' / 'Inches' / 'Pounds'` | Replace with your placeholders |
| `calc.cta` | `'Show me my transformation'` | Reusable — outcome-focused works for any vertical |
| `calc.errors` | `{ height, weight }` | Replace with errors for your fields |

### Step 4 — Account (signup + login) — REUSABLE AS-IS

This entire step is reusable. Only edit if you want different microcopy.

### Step 5 — Results (vertical-specific viz, see Section 3)

| CONTENT key | Current (12-month weight projection) |
|-------------|--------------------------------------|
| `results.eyebrow` | `'Your results · Ready'` |
| `results.headline` | `'In 12 months, you could weigh —'` |
| `results.lede` | `'Your personalized GLP-1 projection, based on real patient data.'` |
| `results.disclaimer` | Long medical-legal disclaimer |

**Replace headline + disclaimer for your vertical.** E.g. for hair loss:
`'In 6 months, you could see [X]% more density'`.

### Step 6 — Proof (verified outcomes) — REUSABLE AS-IS

Just edit `CONFIG.proofStats` (4 stat cards). Layout stays the same.

### Step 7 — Contact info — REUSABLE AS-IS

Name + phone form. Same for any vertical.

### Step 8 — Medication picker (vertical-specific markup, see Section 3)

| CONTENT key | Current | For new verticals |
|-------------|---------|--------------------|
| `medication.eyebrow` | `'Step 8 · Pick your medication'` | Keep |
| `medication.headline` | `'Choose your GLP-1.'` | E.g. `'Choose your treatment.'` |
| `medication.lede` | About FDA-regulated GLP-1 | Replace with your category's safety/regulatory blurb |

### Step 9 — Plans — REUSABLE AS-IS

Pricing in `CONFIG.medications[*].plans`. Plan card markup is reusable.

### Step 10 — SMS opt-in / Loop — REUSABLE AS-IS

Just edit `CONTENT.loop.headline` if you want different framing.

### Step 11 — Checkout — MOSTLY REUSABLE

| CONTENT key | Notes |
|-------------|-------|
| `checkout.headline` / `lede` | Reusable |
| `checkout.perksBar` | Edit the 3 perks (`['Free shipping', 'Provider visit included', 'HSA/FSA eligible']`) — keep what applies |
| `checkout.benefitsTitle` | Reusable |
| `checkout.warrantyHeadline` / `warrantyTagline` | Replace `'Weight Loss Warranty'` with your guarantee name (e.g. `'Hair Regrowth Guarantee'`) |
| `checkout.faq` | **REPLACE 4 Q&As** with vertical-specific FAQ |

### Step 12 — Success — REUSABLE AS-IS

### Delivery / Live trust — REUSABLE AS-IS

---

## Section 2 — The CONFIG Block: Every Number

Search for `const CONFIG = {` (around line 2864). All pricing, products,
clinical thresholds, and quantitative content live here.

### `CONFIG.brand`

```js
brand: {
  name: 'YourBrand',                    // Used everywhere
  supportEmail: 'help@yourbrand.com',
  supportPhone: '+1 (555) 000-0000',
}
```

### `CONFIG.clinical` — Eligibility logic

This is the BMI threshold logic. **Replace entirely for non-weight-loss
verticals.** Examples:

```js
// HAIR LOSS — Norwood scale eligibility
clinical: {
  norwoodMin: 2,         // mild thinning or worse
  norwoodMax: 6,         // severe loss
  ageMin: 18,
  ageMax: 65,
}

// ED — Symptom score
clinical: {
  iiefMaxForEligibility: 25,   // International Index of Erectile Function
  ageMin: 18,
  contraindicationDrugs: ['nitrates', 'alpha-blockers'],
}
```

### `CONFIG.limits` — Input boundaries

For BMI calc. Replace with your field bounds (age range, etc.).

### `CONFIG.pricing.competitor` — Used in savings stat callout

```js
pricing: {
  competitor: { name: 'Local pharmacy GLP-1', monthly: 1499 },
  ours: { name: 'HealSend GLP-1', monthly: 299 },
}
```

For new vertical: change competitor name + price.

### `CONFIG.medications` — THE BIG ONE

Each medication has its own `plans{}` object with explicit prices per
plan tier. **No multipliers — every price is explicit so you can run
A/B variants safely.**

```js
medications: {
  // Replace these keys for your vertical's products
  semaglutide: {
    name: 'Semaglutide',
    tagline: 'Classic GLP-1',
    effectiveness: '~15% body weight loss',
    badge: 'CLASSIC',
    plans: {
      '12mo':   { firstMonthPrice: 0,   recurringPrice: 299, totalMonths: 12 },
      '3mo':    { firstMonthPrice: 149, recurringPrice: 299, totalMonths: 3 },
      'monthly':{ firstMonthPrice: 299, recurringPrice: 299, totalMonths: 1 },
    },
  },
  tirzepatide: {
    name: 'Tirzepatide',
    tagline: 'Most effective',
    effectiveness: '~21% body weight loss',
    badge: 'MOST EFFECTIVE',
    preferred: true,                    // shows the "preferred" highlight
    plans: { /* ... */ },
  },
}
```

**Vertical examples:**
- Hair loss: `finasteride` + `minoxidil` + `combo`
- ED: `sildenafil` + `tadalafil`
- Skincare: `tretinoin` + `clindamycin` + `hydroquinone`

### `CONFIG.plans` — Plan-level metadata

```js
plans: {
  '12mo':   { name: '12-month plan',  tagline: 'BEST VALUE', cta: 'Choose 12-month',  totalMonths: 12 },
  '3mo':    { name: '3-month plan',   tagline: 'POPULAR',    cta: 'Choose 3-month',   totalMonths: 3  },
  'monthly':{ name: 'Monthly plan',   tagline: 'FLEXIBLE',   cta: 'Choose monthly',   totalMonths: 1  },
}
```

Generally reusable. Edit taglines if needed.

### `CONFIG.liveTrust` — Today's signups counter

```js
liveTrust: {
  todayCountMin: 120,
  todayCountMax: 200,
  rating: 4.9,
}
```

Reusable — just adjust ranges to match your real volume.

### `CONFIG.checkoutCta` — 3 button-text variants

Marketing-safe CTAs that depend on the plan:

```js
checkoutCta: {
  free:       { button: 'Start my transformation', meta: 'Free shipping · Weight Loss Warranty · HSA/FSA eligible' },
  discounted: { button: 'Lock in my plan',         meta: '...' },
  flat:       { button: 'Begin treatment',         meta: 'No commitment · Cancel anytime · Free shipping' },
}
```

Edit `meta` strings to match your benefits + warranty name.

### `CONFIG.inclusiveBenefits` — 6 benefits with strikethrough $ → FREE

```js
inclusiveBenefits: [
  { name: 'Unlimited doctor communication', value: 129 },
  { name: 'HSA/FSA eligible',               value: 0, noStrike: true },  // shows "INCLUDED" instead
  { name: 'Free overnight shipping',        value: 49 },
  { name: 'Provider visit included',        value: 99 },
  { name: 'Patient concierge line',         value: 99 },
  { name: 'Weight Loss Warranty',           value: 179 },
]
```

`noStrike: true` shows "INCLUDED" instead of struck-through dollar value.

### `CONFIG.delivery`

```js
delivery: {
  carrier: 'FedEx Express',
  eta: 'Medicine arrives within 2 business days',
}
```

Reusable.

### `CONFIG.orderSummaryLines` — Line items in checkout summary

```js
orderSummaryLines: [
  { label: 'Online Clinician Visit', original: 49,  current: 0, freeLabel: 'FREE' },
  { label: 'Overnight Shipping',     original: 19.99, current: 0, freeLabel: 'FREE' },
  { label: 'Weight Loss Warranty',   original: null, current: 0, freeLabel: 'Activated' },
]
```

Reusable structure. Replace label names per vertical.

### `CONFIG.proofStats` — 4 stat cards (Step 6)

```js
proofStats: [
  { label: 'Members see results',   value: 94.6, suffix: '%', decimals: 1, caption: 'of members lose at least 5% of body weight.', icon: 'chart' },
  { label: 'Reach their target',    value: 96.8, suffix: '%', decimals: 1, caption: 'of members on the 12-month plan reach their target weight.', icon: 'star' },
  { label: 'Members stay',          value: 93,   suffix: '%', decimals: 0, caption: 'of members stay past 90 days.', icon: 'people' },
  { label: 'Risk-free',             value: 0,    prefix: '$', caption: "If it doesn't work for you, you're covered by the Weight Loss Warranty.", icon: 'shield' },
]
```

**Replace value + caption per vertical.** Available icons: `chart`, `star`,
`people`, `shield`, `dollar`. Add new icons by extending `PROOF_ICONS` object.

---

## Section 3 — The 3 Vertical-Specific Steps

Search the file for `🔁 SWAP FOR NEW VERTICAL` — every place that needs
real markup/logic changes is marked.

### Step 3 — Calculator (`#step-calc`)

**Current:** Height (feet + inches) + weight inputs.

**For other verticals, replace the input fields with vertical-specific intake:**

| Vertical | Replace with |
|----------|--------------|
| Hair loss | Norwood scale picker (image grid) + age input + duration of loss |
| ED | IIEF-5 questionnaire (5 multi-choice questions) + age + meds checklist |
| Skincare | Skin type quiz (4 buttons: oily/dry/combo/sensitive) + concerns multi-select + age |
| Mental health | PHQ-9 / GAD-7 questionnaire (multi-step) |

**The CTA + sticky CTA wiring stays the same** — just change what gets
collected and stored in `state`.

### Step 5 — Results (`#step-results`)

**Current:** Animated count-up of projected weight loss + 5-row monthly
timeline + savings callout.

**For other verticals:**
- **Hair loss:** Density % regrowth curve + before/after illustration grid + savings vs hair transplants
- **ED:** "Most users see results in [N] days" + dosing schedule visual
- **Skincare:** "Skin clarity score" trajectory + side-by-side timeline imagery

The `animateValue()` and `animateBar()` helpers are reusable — just
change what they animate to.

### Step 8 — Medication picker (`#step-medication`)

**Current:** 2-card picker (Semaglutide vs Tirzepatide).

**For other verticals:**
- Hair loss: 3 cards (Finasteride / Minoxidil / Combo)
- ED: 2 cards (Sildenafil / Tadalafil)
- Skincare: 2-3 cards (Tretinoin / Clindamycin / Combo)

**Card structure stays the same** — auto-advances on tap, stores
`state.selectedMedication`, drives plan pricing on Step 9.

---

## Section 4 — Image Replacements

All images embedded as base64 data URIs. Search for these markers:

| What | Find this in HTML | How to replace |
|------|-------------------|----------------|
| **Brand logo** (top bar) | `data:image/webp;base64,UklGR...` | Re-encode your logo as base64, paste over |
| **Doctor portrait** (preview slide) | `data:image/jpeg;base64,/9j/...` | Replace with your provider photo |
| **Weight Loss Warranty badge** (proof slide) | `data:image/png;base64,iVBOR...` followed by `alt="Weight Loss Warranty"` | Design new badge for your vertical's guarantee |
| **FedEx logo** (delivery section) | `class="delivery-fedex-logo"` | Reusable — keep as-is for any shipping vertical |
| **Google trust badge** (top bar) | Inline SVG, not base64 | Edit SVG colors/text directly |

**Quick base64 encoding:**
```bash
# macOS/Linux:
base64 -i your-image.png | pbcopy   # macOS
base64 -w0 your-image.png            # Linux
```

Then prefix with `data:image/png;base64,` (or `image/jpeg`, `image/webp`).

---

## Section 5 — Backend Integration (Node.js / any backend)

Search for `API LAYER` (around line 2553). The funnel calls 4 async
methods that you override with real `fetch()` calls.

```html
<!-- Add this BEFORE the funnel <script> tag -->
<script>
  window.API = {
    async signup({ email, password, bioSex, ...rest }) {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, bioSex, ...rest })
      });
      const data = await res.json();
      return { ok: res.ok, user: data.user, error: data.error };
    },

    async login({ email, password }) {
      const res = await fetch('/api/auth/login', { /* ... */ });
      const data = await res.json();
      return { ok: res.ok, user: data.user, error: data.error };
    },

    async oauth({ provider, mode }) {
      // Redirect to your OAuth flow
      window.location.href = `/api/auth/oauth/${provider}?mode=${mode}`;
      return { ok: false, redirecting: true };
    },

    async createOrder({ plan, medication, payment, customer, clinical, consent }) {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, medication, payment, customer, clinical, consent })
      });
      const data = await res.json();
      return { ok: res.ok, orderId: data.orderId, error: data.error };
    },
  };
</script>
<script src="your-funnel.html"></script>
```

**Demo mode:** if you don't override `window.API`, the funnel works
end-to-end with mocked success responses. Useful for design QA.

---

## Section 6 — What NOT to Edit

These work for any subscription telehealth vertical and should be
left alone unless you have a specific reason:

- **Topbar layout** — back btn + logo + Google trust badge
- **Top progress bar** — auto-fills as user advances
- **Sticky bottom CTA system** — handles all step transitions
- **Account step** — signup/login tabs, OAuth, password validation
- **Contact step** — name + phone collection
- **Plan picker layout** — 12mo / 3mo / monthly cards
- **SMS opt-in step** — generic enough for any vertical
- **Checkout flow** — BNPL + Apple/Google Pay + card form + FAQ accordion
- **Success screen** — order confirmation
- **Visual design system** — dark mode tokens, brand colors, typography, shimmer effects
- **All animations** — count-ups, bar fills, fade-ins
- **The API hook layer** — same 4 methods work for any subscription product

---

## Section 7 — Quick Vertical Templates (Starter Configs)

Copy-paste these into `CONFIG` and `CONTENT` to bootstrap a new vertical fast.

### Hair Loss Funnel

```js
// CONTENT
brand:    { name: 'Stronger', supportEmail: 'help@stronger.com' },
goal:     {
  frameStripBad: 'Hair pills',
  frameStripGood: 'Real, lasting regrowth',
},
calc:     { headline: { text: 'Quick hair check. ', accent: "We'll match your meds.", tail: '' } },
results:  { headline: { text: 'In 6 months, you could see ', accent: '+41% density', tail: '' } },
checkout: { warrantyHeadline: 'Hair Regrowth Guarantee.', warrantyTagline: 'Visible regrowth in 6 months or your money back.' },

// CONFIG
medications: {
  finasteride: { name: 'Finasteride', tagline: 'Stop loss',     plans: { /* ... */ } },
  minoxidil:   { name: 'Minoxidil',   tagline: 'Regrow',        plans: { /* ... */ } },
  combo:       { name: 'Combo Therapy', tagline: 'BEST RESULTS', preferred: true, plans: { /* ... */ } },
},
proofStats: [
  { label: 'Members see regrowth',  value: 87.2, suffix: '%', caption: 'of members see visible regrowth at 6 months.' },
  { label: 'Halt the recession',    value: 94.5, suffix: '%', caption: 'of members halt further hair loss.' },
  { label: 'Stay on plan',          value: 91,   suffix: '%', caption: 'of members stay past 90 days.' },
  { label: 'Risk-free',             value: 0,    prefix: '$', caption: 'Covered by our Hair Regrowth Guarantee.' },
],
```

### ED Funnel

```js
brand:    { name: 'Confidence Rx' },
goal:     { frameStripBad: 'Awkward pharmacy visits', frameStripGood: 'Real, discreet treatment' },
results:  { headline: { text: 'You could be performing reliably in ', accent: 'as little as 30 minutes', tail: '' } },
medications: {
  sildenafil: { name: 'Sildenafil',  tagline: 'Generic Viagra®', plans: { /* ... */ } },
  tadalafil:  { name: 'Tadalafil',   tagline: 'Generic Cialis®', preferred: true, plans: { /* ... */ } },
},
checkout: { warrantyHeadline: 'Performance Guarantee.', warrantyTagline: 'It works for you, or your money back.' },
```

### Skincare / Acne Funnel

```js
brand:    { name: 'ClearSkin Co' },
goal:     { frameStripBad: 'Drugstore creams', frameStripGood: 'Real, prescription-strength clarity' },
results:  { headline: { text: 'In 90 days, you could see ', accent: '85% clearer skin', tail: '' } },
medications: {
  tretinoin:    { name: 'Tretinoin',    tagline: 'Gold standard',    preferred: true, plans: { /* ... */ } },
  clindamycin:  { name: 'Clindamycin',  tagline: 'For active acne',  plans: { /* ... */ } },
  hydroquinone: { name: 'Hydroquinone', tagline: 'For hyperpigmentation', plans: { /* ... */ } },
},
```

---

## Section 8 — Process for Cloning (Recommended Order)

Follow this order to avoid getting tangled:

1. **Duplicate** `glp1-funnel.html` → `<vertical>-funnel.html`.
2. **Edit `CONTENT.brand`** + page title — sets the world.
3. **Edit `CONFIG.medications`** — your products are the foundation.
4. **Edit `CONFIG.clinical`** + `CONFIG.limits` — your eligibility rules.
5. **Edit `CONFIG.proofStats`** — your social proof.
6. **Edit `CONFIG.inclusiveBenefits`** + `CONFIG.checkoutCta` — your offer.
7. **Replace 3 vertical-specific steps** (Step 3, 5, 8) — markup + logic.
8. **Edit remaining CONTENT strings** — headlines, ledes, FAQ, error msgs.
9. **Replace embedded images** — logo, doctor, badge.
10. **Plug in your backend** — set `window.API = {...}`.
11. **Test demo mode end-to-end** in browser before pointing at backend.
12. **Test with real backend** (auth + order placement).

If you're working with Claude in a new conversation, paste this entire
document at the start and reference it as the "cloning spec" when asking
to build the new vertical.
