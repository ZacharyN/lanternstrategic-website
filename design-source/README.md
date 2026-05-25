# Handoff: Lantern Strategic Website

## Overview

A two-page marketing site for **Lantern Strategic**, an operations & technology consulting firm led by Zach Nelson. The site's purpose is to give people Zach meets at networking events a clean, credible place to land — and to surface the *Lantern Diagnostics* as a self-serve, low-friction conversation starter.

Two pages are included:

- **Landing Page** (`Landing Page.html`) — front page. Hero, problems framing, three engagement models, About Zach, contact form, footer.
- **Diagnostics Page** (`Diagnostics.html`) — long-form page introducing three downloadable diagnostics (Operational Risk Velocity, Sensing & Feedback Loops, Antifragile) and inviting the reader to book a 45-minute conversation.

Audience is B2B — owners & operators. Designed mobile-first with desktop given equal weight.

---

## About the Design Files

The files in `designs/` are **design references created in HTML** — prototypes that show the intended look, layout, typography, color, copy, and behavior. They are **not** production code to ship directly.

The task is to **recreate these designs as an Astro site**, using Astro's recommended patterns (file-based routing under `src/pages/`, `.astro` components under `src/components/`, scoped styles or a CSS solution of choice). The brand-standards doc was originally written assuming Nuxt + Tailwind, but the project is moving to **Astro** — feel free to use Tailwind with Astro (recommended for parity with the tokens already defined) or plain CSS modules / scoped CSS, whichever matches the dev's preference.

The HTML files inline all CSS in a `<style>` block at the top of each file — that's where every design decision lives. Read it; the values are exact.

A small **Tweaks panel** appears on the landing page (bottom-right). It's a design-time tool for previewing hero variants and color intensity, and it is **not part of the production site** — strip it out during the port. The `tweaks-panel.jsx` and `tweaks-app.jsx` files are not included in this handoff for that reason. Use the default state: stamp-centered hero (`v2`), `balanced` crimson, paper texture on.

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, copy, and component treatments are all final. Recreate the UI pixel-perfectly. Minor judgement calls (e.g., focus rings, link underlines on legal links) can follow standard Astro/Tailwind practice as long as they don't fight the established palette.

---

## Stack Recommendation

- **Astro 4+** (static, no SSR needed)
- **Tailwind CSS** via `@astrojs/tailwind` integration
- **Google Fonts**: Playfair Display (400/500/600/700, italic 400) + Source Sans 3 (300/400/500/600/700) — preloaded via `<link rel="preconnect">` then `<link rel="stylesheet">` in the base layout, or via `@fontsource` if a self-hosted approach is preferred (Zach: no preference).
- **No JS framework needed** — the only interactive bits are sticky-nav scroll state, a mobile menu toggle, the contact form, and smooth-scroll anchors. Plain `<script>` inside an Astro layout or component is sufficient.
- **Form handling** — the contact form on the landing page currently posts to nothing (front-end demo only). Wire it up to whichever endpoint Zach prefers (e.g., a Netlify form, a Resend/Postmark endpoint, or a simple `mailto:`). The frontend already shows success-state on submit.

---

## Pages

### 1. Landing Page (`/`)

**Purpose:** Earn a 30-minute conversation. Establish credibility quickly to networking-event visitors.

**Sections, in order:**

1. **Nav** — sticky, parchment-with-blur background. Brand mark + wordmark on left ("Lantern *Strategic*"), four links (Approach / Engagements / About / Contact), pill-shaped crimson "Book a call →" CTA on the right. Below 880px: links collapse into a hamburger sheet; CTA stays.
2. **Hero** — currently set to the **stamp-centered variant** (`v2`):
   - Centered eyebrow ("Operations & technology consulting"), `clamp(160px, 18vw, 220px)` lantern stamp, h1 ("Helping businesses move forward when the path isn't obvious."), serif subline, two CTAs ("Book a 30-minute call" → Calendly, "See how we work" → `#approach`).
   - Two alternate hero layouts exist in the HTML (`v1` editorial type-led, `v3` portrait split) but are hidden via `data-variant` and **should be omitted** from the Astro implementation unless Zach asks otherwise.
3. **The problems that don't announce themselves** (`#approach`) — section on parchment-2 background. Two-column section head (h2 left, supporting prose right), large serif pull line with crimson italic accent ("quiet problems"), then a four-card grid below: each card has a serif numeral (01–04), serif heading, warm-gray body. Cards are separated by 1px stone-colored dividers (no rounded corners or shadows — flat tile aesthetic).
4. **Three ways to engage** (`#engage`) — three cards side-by-side at ≥880px, stacked below. Each card: warm-blush pill ("01 · Defined projects"), serif h3, italic warm-gray "examples" line, body copy, a bordered "When it fits" footnote at the bottom. Cards lift on hover (`translateY(-2px)`, crimson border).
5. **Engagement CTA panel** — full-width parchment card with a 4px crimson rule on the left edge. Eyebrow → serif callout ("The first conversation usually tells *us both*.") on the left, primary CTA + "30 minutes · no obligation" subtext on the right. Faded lantern mark watermarked in the lower-right corner of the panel.
6. **About Zach** (`#about`) — parchment-2 background. Two-column grid: headshot left (4:5 aspect, max 460px wide, slight desaturation filter), text right. Eyebrow → h2 → serif lede → three paragraphs of body → 3-column stat row (15yrs / 100+ / 5 — top/bottom rules).
7. **Contact** (`#contact`) — **dark section** (charcoal background, parchment text). Left column: eyebrow, h2, intro paragraph, three direct-contact rows (label + value, separated by hairline rules). Right column: white-ish contact form with name/company/email/phone/message fields, primary CTA, privacy note.
8. **Footer** — charcoal, three-column at ≥880px: brand stamp + tagline / Explore links / Talk links. Bottom row: copyright + Privacy Policy · Terms of Service legal links.

### 2. Diagnostics Page (`/diagnostics`)

**Purpose:** Self-serve resource Zach links to before / after networking-event conversations.

**Sections:**

1. **Same nav, same footer** as the landing page. The "Diagnostics" link gets `aria-current="page"` and a crimson underline.
2. **Hero** — text-left layout with the lantern stamp watermarked **partially bleeding off the right edge** (`right: clamp(-180px, -8vw, -60px)`, `width: clamp(280px, 36vw, 520px)`, `opacity: .12–.14`). Hero requires `overflow: hidden` on the `.hero` section and `position: relative` + `z-index: 1` on `.hero-inner` so text sits above the stamp. Headline has crimson italic accent on "already knows." Two-column inner grid: copy left, meta panel right with four key/value rows (Time / Best for / Format / Cost).
3. **Index strip** — parchment-2 horizontal band with three quick-jump links to the diagnostics below, prefixed by serif crimson numerals.
4. **Three long-form diagnostic blocks** (`#risk`, `#sensing`, `#antifragile`) — two-column at ≥880px:
   - **Left**: huge serif numeral (96px on desktop), h2, and a metadata card (parchment background, stone border, 3px crimson rule along the left edge) with Time + Best-for rows.
   - **Right**: serif "question it asks" pullquote with crimson italic emphasis, two body paragraphs, **domain chips** (warm-blush pill, crimson text, 6px×12px padding, fully rounded), and a "Download the diagnostic" CTA with a "PDF · fillable · 15 minutes" caption.
   - Blocks separated by a stone-colored top border + generous vertical padding.
5. **Invitation section (dark)** — `#talk`. Same dark-section pattern as landing-page contact. Left column: eyebrow ("If something surfaces"), h2 ("Forty‑five minutes. Coffee, cocktails, lunch, or virtual."), serif lede, two body paragraphs about Zach, two CTAs (primary Calendly + ghost "Learn more about Lantern Strategic" linking to `/#about`). Right column: same chambray-shirt headshot, 4:5 aspect.
6. **Footer** — same as landing page.

**Note:** Diagnostic download buttons (`Download the diagnostic`) currently use `#` placeholders with `data-download` attributes naming each file. Replace with real PDF URLs when Zach provides them.

---

## Design Tokens

### Color (from brand standards, used verbatim)

```css
--color-crimson:      #761215; /* primary brand, headers, CTAs */
--color-deep-crimson: #4d0b0d; /* CTA hover, depth */
--color-ember:        #a01a1e; /* hover, secondary accents */
--color-rust:         #c4403a; /* highlights, footer-link hover, dark-mode eyebrow */
--color-warm-blush:   #f5e6e6; /* card fills, pill backgrounds */
--color-parchment:    #faf6f0; /* page background */
--color-parchment-2:  #f3ece0; /* alt-section background (slightly deeper) */
--color-charcoal:     #2a2421; /* body text, dark sections */
--color-warm-gray:    #7a6e6b; /* secondary text */
--color-stone:        #e8e0dc; /* borders, dividers */
```

Notes:

- Use `oklab` `color-mix()` for translucent variants where the design needs them (already in the CSS — search for `color-mix`).
- No blue accent anywhere — palette is intentionally monochromatic crimson.

### Typography

| Role     | Font                  | Weights used        | Notes                                                              |
|----------|-----------------------|---------------------|--------------------------------------------------------------------|
| Display  | Playfair Display      | 400, 500 (italic 400) | h1–h3, serif pullquotes, "lede" paragraphs, brand wordmark         |
| Body     | Source Sans 3         | 400, 500, 600, 700  | All UI text outside headings; eyebrows are 600 / 12.5px / uppercase / .18em letter-spacing |

Sizing (clamp ranges from the CSS — recreate exactly):

- `h1`: `clamp(40px, 6.4vw, 84px)` on landing; `clamp(40px, 5.4vw, 72px)` on diagnostics.
- `h2`: `clamp(30px, 4.2vw, 52px)` on landing; `clamp(28px, 3.6vw, 44px)` on diagnostics.
- `h3`: `clamp(20px, 1.9vw, 26px)`.
- Body: 17px / 1.55 line-height.
- Hero subline: `clamp(17px, 1.4vw, 20px)`.
- Eyebrow: 12.5px / 600 / uppercase / .18em letter-spacing.

Headings use `letter-spacing: -0.01em` (`-0.022em` on h1, `-0.018em` on h2) and `text-wrap: balance`. Paragraphs use `text-wrap: pretty` where length warrants.

### Spacing

- `--gutter: clamp(20px, 4vw, 56px)` — page horizontal padding.
- `--max: 1240px` — container max-width.
- Section vertical padding: `clamp(72px, 9vw, 130px)` on landing, `clamp(72px, 8vw, 120px)` on diagnostics.
- Most components use `gap` (flex/grid) for internal spacing — no per-item margins.

### Radii

- Buttons & nav CTA: `999px` (pill).
- Engagement cards: `6px`.
- Form fields: `6px`.
- Photo frames (about, hero portrait, invitation): `4px`.
- Diagnostic domain chips: `999px`.

### Shadows

The design is **flat** — no drop shadows anywhere except the Tweaks panel (which isn't shipped). Hover states use a 2px translate + border-color change instead.

### Paper texture

A fixed, viewport-covering SVG noise pattern is layered via `body::before` with `mix-blend-mode: multiply` and `opacity: .35`. On the landing page it's gated behind `body[data-texture="on"]` (always on in production); on the diagnostics page it's always on. The SVG is inlined as a data URI in the CSS — copy it verbatim.

---

## Components to Build (suggested split)

This is a suggestion — adapt to fit Astro conventions.

- `<BaseLayout>` — html shell, fonts, meta, body texture, sticky nav, footer.
- `<SiteNav>` — sticky header with brand, links, mobile sheet.
- `<SiteFooter>` — three-column footer + legal row.
- `<Eyebrow>` — small uppercase label with leading rule. Used everywhere.
- `<SectionHead>` — eyebrow + h2 + supporting paragraph (two-column at ≥880px).
- `<Button>` — variants: `primary` (crimson pill), `ghost` (charcoal outline). Both support `arrow` modifier (animated `→`).
- Landing-specific:
  - `<Hero>` — currently stamp-centered. (See "Pages" above; other variants can be skipped.)
  - `<ProblemTile>` — numeral + heading + body.
  - `<EngageCard>` — pill + h3 + examples + body + "when it fits" footer.
  - `<EngagePanel>` — the CTA panel below the cards.
  - `<AboutBlock>`.
  - `<ContactSection>` with `<ContactForm>`.
- Diagnostics-specific:
  - `<DiagHero>`.
  - `<DiagIndexStrip>`.
  - `<DiagBlock>` — props: `num`, `title`, `time`, `bestFor`, `question`, `paragraphs[]`, `domains[]`, `downloadHref`.
  - `<InviteBlock>` — the dark CTA section.

---

## Interactions & Behavior

**Sticky nav scroll state:** On scroll past 8px, add `data-scrolled="true"` to the nav → triggers a `border-bottom: 1px solid var(--stone)` to anchor it visually.

```js
const nav = document.getElementById('nav');
const onScroll = () => nav.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
```

**Mobile menu:** Hamburger toggles `data-open` on the menu sheet. Closing on link-click is important — already wired in the HTML.

**Smooth scroll:** `html { scroll-behavior: smooth; }`. All anchor links use `scroll-margin-top: 90px` for proper offset under the sticky nav.

**Button hover:** `transition: background .15s, color .15s, transform .15s, border-color .15s`. The `→` glyph in `.btn-arrow` translates 3px on hover (only when applied directly to the button).

**Engagement card hover:** `translateY(-2px)` + `border-color: var(--crimson)`.

**Form:** Client-side `required` validation on name/company/email. On valid submit, show `.form-success` (warm-blush card with crimson border) and call `form.reset()`. Wire to real endpoint per Zach's preference.

**Form focus state:** `border-color: var(--crimson)` + `box-shadow: 0 0 0 3px color-mix(in oklab, var(--crimson) 18%, transparent)`.

**Year in footer:** Set `#year` text content from `new Date().getFullYear()` on load.

**Calendly:** All "Book a call" / hero CTAs / footer "Book a call" / Diagnostics-page "Grab 45 minutes" CTAs point to **`https://calendly.com/zacharynelson/consulting-welcome`** and open in a new tab (`target="_blank" rel="noopener"`).

---

## Responsive Behavior

Mobile-first. Single breakpoint at **880px** for major layout shifts (column splits, nav links visible), with secondary breakpoints at **600px** (form rows go two-column) and **760px** (some four-column grids step down through two-column).

- Below 880px: sticky nav links → hamburger sheet; section heads stack; hero variants collapse to single column; engagement cards stack; about goes single column with photo first then text.
- 760–1080px: problems grid is 2×2.
- ≥1080px: problems grid is a single 4-up row.

---

## Assets

All in `designs/assets/`:

| File                          | Purpose                                                                 |
|-------------------------------|-------------------------------------------------------------------------|
| `lantern-stamp.png`           | Full vintage stamp logo — footer brand, stamp-centered hero, footer brand block. |
| `lantern-stamp-inverted.png`  | White/light version of the stamp — currently unused, available if needed for dark backgrounds. The footer uses CSS `filter: brightness(0) invert(1)` on the regular stamp instead. |
| `lantern-mark.png`            | Just the lantern (no wordmark) — nav brand mark, faded watermarks (CTA panel, diagnostics hero), `engage-foot` background mark. |
| `lantern-mark-inverted.png`   | Light version of the lantern mark — available if needed.                |
| `zach-casual.jpg`             | Chambray shirt, arms crossed, half-body. Used in About section and in the dark invitation block on diagnostics. |
| `zach-closein.jpg`            | Tight portrait — not currently used; available for future use.          |
| `zach-wide.jpg`               | Wide on-location shot — not currently used; available for future use.    |

The brand stamp's distressed/textured look is **intentional** — do not clean it up, vectorize it, or replace it with crisp SVG.

---

## Copy

Final copy lives in:

- `content/Lantern Strategic Site Rewrite.md` — landing-page source copy.
- `content/The Lantern Diagnostics.md` — diagnostics-page source copy.
- `content/Lantern Strategic Brand Standards.md` — brand reference.

The HTML files contain the **rewritten/tightened** copy that appears on the page. Use what's in the HTML as the source of truth.

---

## SEO / Meta (suggested baseline)

| Page         | Title                                                                       | Description                                                                                                       |
|--------------|------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Landing      | Lantern Strategic — Helping businesses move forward when the path isn't obvious. | Operations & technology consulting for owners and operators navigating the unnoticed friction slowing their business down. |
| Diagnostics  | The Lantern Diagnostics — Lantern Strategic                                  | Three short diagnostics — operational risk, sensing & feedback, antifragility — designed to surface what your business already knows. |

Add `og:image` referencing `assets/lantern-stamp.png` (or a generated 1200×630 social card built from it).

---

## Out of Scope / Future

- The "Tweaks" panel on the landing page is **design-time only** — strip out before deploying.
- Hero variants `v1` (editorial) and `v3` (portrait split) are in the HTML but disabled; omit unless requested.
- Privacy Policy + Terms of Service routes (`/privacy-policy`, `/terms`) are linked but the content isn't yet written.
- The contact form's submission endpoint isn't wired.
- Diagnostic PDF download URLs aren't set — placeholders with `data-download="risk-velocity" | "sensing" | "antifragile"`.
- Zach mentioned he may add stock photography later (warm/golden, dim-light interiors) — leave hooks for an optional hero image and a between-section environmental shot.

---

## Files in this bundle

```
design_handoff_lantern_strategic/
├── README.md                              ← this file
├── designs/
│   ├── Landing Page.html                  ← front page prototype (open in a browser)
│   ├── Diagnostics.html                   ← diagnostics page prototype
│   └── assets/                            ← logos, marks, headshots
├── reference/
│   ├── landing-01-hero.png                ← hero-section reference shot
│   └── diagnostics-01-hero.png            ← hero-section reference shot
└── content/
    ├── Lantern Strategic Site Rewrite.md
    ├── The Lantern Diagnostics.md
    └── Lantern Strategic Brand Standards.md
```

## Using the references with Playwright

The two PNGs in `reference/` are hero-section snapshots for quick visual orientation. For full-page visual regression, **open the `designs/*.html` files directly in Playwright** — they're self-contained (CSS inlined, assets relative-pathed) and render identically to what the final Astro pages should look like. A simple recipe:

```js
// playwright.config — point one project at the design references
import { test, expect } from '@playwright/test';

test('landing matches reference', async ({ page }) => {
  await page.goto('file://' + __dirname + '/design_handoff_lantern_strategic/designs/Landing Page.html');
  await page.setViewportSize({ width: 1440, height: 900 });
  // Hide the Tweaks panel (design-time only)
  await page.addStyleTag({ content: '#tweaks-root { display: none !important; }' });
  await expect(page).toHaveScreenshot('landing-full.png', { fullPage: true });
});
```

Then run the same shape against your Astro build to assert parity.

