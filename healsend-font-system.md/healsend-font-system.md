# HealSend — Font System (Cleaned Up)

## Font Families Used

| # | Font Family         | Category | Weights Loaded          | Role on Site                          |
|---|---------------------|----------|-------------------------|---------------------------------------|
| 1 | **Fraunces**        | Serif    | 400, 500, 400 italic    | Headlines, section titles, italic accents |
| 2 | **Inter**           | Sans-serif | 400, 500, 600, 700    | Everything else                       |

**Total: 2 font families, 7 weight variants**

---

## What We Removed and Why

| Removed Font     | Was Used For                        | Replace With              |
|------------------|-------------------------------------|---------------------------|
| Manrope          | Headlines & section titles          | Fraunces 500              |
| Figtree          | Marketing page titles               | Fraunces 500              |
| Playfair Display | Italic accent words                 | Fraunces 400 italic ✅ same job, one font |
| Open Sans        | Secondary / legacy text             | Inter 400                 |
| Poppins          | Secondary / legacy text             | Inter 400                 |
| Roboto           | Secondary / legacy text             | Inter 400                 |

---

## Where Each Font Is Applied

### Fraunces — headlines and italic accents

- All `<h1>`–`<h3>` tags across marketing and landing pages
- Section titles on all product pages
- Dashboard headings
- Cart, account, and authentication page headings
- Onboarding flow headings
- **Italic accent words inside headlines** (e.g., *"not the needle"*, *"real results"*, *"peptide science."*)

### Inter — everything else

- Main body text across all pages
- Onboarding flow body copy
- Navbar and footer text
- Bullet points
- Buttons (weight 600)
- Tags, labels, and pills (weight 700, letter-spacing 0.1em)
- Prices and numbers
- Form fields and inputs
- Dashboard body copy

---

## Italic Accent Rule (replaces Playfair Display entirely)

The italic serif accent treatment — the purple italic words inside headlines — is now handled by **Fraunces italic**. Not a separate font. Same family, just italic variant.

**Before (wrong):**
```
font-family: 'Playfair Display', serif;
font-style: italic;
```

**After (correct):**
```css
em, .accent {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: "opsz" 144, "SOFT" 100;
  color: var(--brand-purple);
}
```

Wrap any italic accent word in `<em>` tags and it automatically becomes Fraunces italic in HealSend purple. No separate font needed.

---

## Weight Rules

### Fraunces — only these weights:
- **400** — body-weight headlines, italic accents
- **500** — standard headlines (H1, H2, H3)
- **NEVER** use 600, 700, 800, or 900 — kills the premium feel

### Inter — only these weights:
- **400** — body copy, subheads, footer
- **500** — emphasized body copy, secondary labels
- **600** — buttons, strong emphasis
- **700** — uppercase section labels with letter-spacing 0.1em+
- **NEVER** use 800 or 900 — reads as streetwear/supplement brand, not clinical

---

## Headline Pattern — Every Page

Every major headline follows this pattern without exception:

**Structural half** → Fraunces 500, ink black
**Emotional/accent half** → Fraunces 400 italic, HealSend purple

### Examples:
| Structural (Fraunces 500, black) | Accent (Fraunces 400 italic, purple) |
|----------------------------------|--------------------------------------|
| Backed by published              | *peptide science.*                   |
| Two clinically-guided            | *GH protocols.*                      |
| Start and stay                   | *with HealSend.*                     |
| What matters *most* to you?      | (*most* = italic purple inline)      |
| Sleep,                           | *restored.*                          |
| The fog has                      | *a fix.*                             |

---

## Loading Strategy

- **Method:** Self-hosted local `.ttf` files from `/fonts/google/` (same as current)
- **Font display:** All use `font-display: swap`
- **Defined in:** `src/styles/local-fonts.css` (7 `@font-face` rules, down from 24)
- **Tailwind classes defined in:** `src/index.css` via `@layer components`
- **Tailwind config (`tailwind.config.js`):** No `fontFamily` extensions — classes are CSS-only

---

## Google Fonts Import (replace current import)

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap');
```

Or if self-hosting (recommended for performance):
Download both fonts from Google Fonts, place in `/fonts/google/`, and update `local-fonts.css` with the 7 `@font-face` rules below.

---

## @font-face Rules (local-fonts.css — replace entire file)

```css
/* Fraunces Regular */
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/google/Fraunces-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Fraunces Medium */
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/google/Fraunces-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

/* Fraunces Italic */
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/google/Fraunces-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* Inter Regular */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/google/Inter-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Inter Medium */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/google/Inter-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

/* Inter SemiBold */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/google/Inter-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* Inter Bold */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/google/Inter-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

---

## Tailwind Utility Classes (src/index.css — replace current font classes)

```css
@layer components {

  /* Headlines — Fraunces 500 */
  .font-headline {
    font-family: 'Fraunces', serif;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  /* Italic accent words — Fraunces 400 italic + brand purple */
  .font-accent {
    font-family: 'Fraunces', serif;
    font-weight: 400;
    font-style: italic;
    font-variation-settings: "opsz" 144, "SOFT" 100;
    color: var(--brand-purple);
  }

  /* Body copy — Inter 400 */
  .font-body {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }

  /* Buttons — Inter 600 */
  .font-button {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
  }

  /* Labels / tags — Inter 700 uppercase */
  .font-label {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

}
```

---

## Global Base Styles (add to body/root)

```css
body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

em {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: "opsz" 144, "SOFT" 100;
  color: var(--brand-purple);
}
```

---

## Migration Checklist for Dev

- [ ] Download Fraunces (400, 500, 400 italic) and Inter (400, 500, 600, 700) from Google Fonts
- [ ] Place `.ttf` files in `/fonts/google/`
- [ ] Replace entire `local-fonts.css` with the 7 `@font-face` rules above
- [ ] Replace font utility classes in `src/index.css` with the 5 classes above
- [ ] Add global base styles to body/root
- [ ] Find and replace all `.font-title` (Figtree) → `.font-headline` (Fraunces)
- [ ] Find and replace all `.font-playfair` (Playfair Display) → `.font-accent` (Fraunces italic)
- [ ] Find and replace all Open Sans, Poppins, Roboto references → Inter
- [ ] Remove Manrope, Figtree, Playfair Display, Open Sans, Poppins, Roboto from `/fonts/google/`
- [ ] Remove their `@font-face` rules from `local-fonts.css`
- [ ] QA every page — check headlines, italic accents, body copy, buttons, labels
- [ ] Check funnel/onboarding flow separately — Inter 700 for quiz headlines is fine

---

## Summary

**Before:** 7 font families, 24 weight variants, inconsistent application
**After:** 2 font families, 7 weight variants, one clear rule for every element

The brand gets tighter, pages load faster, and every designer/dev on the team knows exactly which font to use without asking.
