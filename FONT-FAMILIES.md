# HealSend — Font Families

## Font Families Used

| # | Font Family       | Category   | Weights Loaded                              | Role on Site                                      |
|---|-------------------|------------|---------------------------------------------|---------------------------------------------------|
| 1 | **Manrope**       | Sans-serif | 400, 500, 600, 700, 800                     | Headlines & section titles (`.font-headline`)      |
| 2 | **Figtree**       | Sans-serif | 400, 500, 600, 700                          | Page titles & featured content (`.font-title`)     |
| 3 | **Inter**         | Sans-serif | 400, 500, 600                               | Body copy & main content (`.font-body`)            |
| 4 | **Playfair Display** | Serif   | 500 italic                                  | Decorative italic accents (`.font-playfair`)       |
| 5 | **Open Sans**     | Sans-serif | 300, 400, 600, 700                          | Secondary / legacy text                            |
| 6 | **Poppins**       | Sans-serif | 500, 600, 700                               | Secondary / legacy text                            |
| 7 | **Roboto**        | Sans-serif | 500, 600, 700                               | Secondary / legacy text                            |

**Total: 7 font families, 24 weight variants**

---

## Where Each Font Is Applied

### Manrope — `.font-headline`
- All `<h1>`–`<h6>` tags inside marketing sections
- Dashboard headings (users, subscriptions, settings, products)
- Cart, account, and authentication page headings
- Onboarding flow headings

### Figtree — `.font-title`
- Marketing landing page titles (GLP-1, Enclomiphene, TRT, GH Optimization, Glow, Sermorelin, Visceral Fat, Healing Peptides)

### Inter — `.font-body`
- Main body text across marketing pages
- Onboarding flow body copy
- Navbar & footer text

### Playfair Display — `.font-playfair`
- Italic accent words inside headlines on all marketing landing pages (e.g., *"not the needle"*, *"real results"*)

### Open Sans / Poppins / Roboto
- Used in older or secondary sections; not mapped to a dedicated Tailwind utility class

---

## Loading Strategy

- **Method:** Self-hosted local `.ttf` files from `/fonts/google/`
- **Font display:** All use `font-display: swap` (text stays visible during load)
- **Defined in:** `src/styles/local-fonts.css` (24 `@font-face` rules)
- **Tailwind classes defined in:** `src/index.css` via `@layer components`
- **Tailwind config (`tailwind.config.js`):** No `fontFamily` extensions — classes are CSS-only
