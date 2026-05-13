# Lantern Strategic Website — Astro Setup Design

**Date:** 2026-05-12
**Status:** Draft for review

## Purpose

Stand up a two-page marketing website for Lantern Strategic, an operations and technology consulting firm. The site is a credible landing place for people met at networking events and a self-serve introduction to the Lantern Diagnostics. The visual design and copy are already finalized in `design-source/` as static HTML references; the task is to port them to a maintainable Astro project.

## Pages

- `/` — Landing page. Hero (stamp-centered variant), "Problems that don't announce themselves" grid, three engagement models, engagement CTA panel, About Zach, contact form, footer.
- `/diagnostics` — Long-form diagnostics page. Hero with watermarked stamp, index strip, three diagnostic blocks (Operational Risk Velocity, Sensing & Feedback Loops, Antifragile) each with a fillable-PDF download, dark invitation block, footer.
- `/privacy-policy` and `/terms` — Placeholder stub pages so footer links resolve. "Coming soon" copy until real legal content is written.

## Tech Stack

- **Astro 6.3.1** with `output: 'static'`. No SSR adapter; the entire site builds to static HTML/CSS/JS.
- **TypeScript** in strict mode across `.astro` and `.ts` files.
- **Tailwind CSS v4** installed as a Vite plugin (`@tailwindcss/vite`). Design tokens declared in a `@theme` block in `src/styles/global.css` so brand colors, fonts, and other tokens become first-class utility classes.
- **No UI framework.** All interactivity is small inline `<script>` blocks in Astro components (sticky-nav scroll state, mobile menu toggle, contact form submit, smooth-scroll anchors, footer year). Vue was considered for the contact form and possible future surveys but dropped: the diagnostic surveys turn out to be downloadable fillable PDFs, not web forms, and the contact form is a simple submit handler. Vue can be added later with `astro add vue` if a real interactive feature emerges.
- **Web3Forms** for contact-form submissions. The form posts directly from the browser via `fetch()` to the Web3Forms API with an access key embedded in the page (the service is designed for this — the key is public by design and has built-in spam protection).

## Directory Layout

```
lantern-strategic/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile
├── Caddyfile
├── public/
│   ├── favicon.svg
│   ├── images/                 # lantern-stamp.png, lantern-mark.png, zach-casual.jpg, ...
│   └── diagnostics/            # PDFs (placeholder until real files provided)
├── src/
│   ├── config.ts               # shared constants: Calendly URL, contact info, brand name
│   ├── data/
│   │   └── diagnostics.ts      # typed array of diagnostic content
│   ├── pages/
│   │   ├── index.astro
│   │   ├── diagnostics.astro
│   │   ├── privacy-policy.astro
│   │   └── terms.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── SiteNav.astro
│   │   ├── SiteFooter.astro
│   │   ├── Eyebrow.astro
│   │   ├── SectionHead.astro
│   │   ├── Button.astro
│   │   ├── Hero.astro
│   │   ├── ProblemTile.astro
│   │   ├── EngageCard.astro
│   │   ├── EngagePanel.astro
│   │   ├── AboutBlock.astro
│   │   ├── ContactSection.astro
│   │   ├── ContactForm.astro
│   │   ├── DiagHero.astro
│   │   ├── DiagIndexStrip.astro
│   │   ├── DiagBlock.astro
│   │   └── InviteBlock.astro
│   └── styles/
│       └── global.css          # Tailwind import, @theme tokens, body texture, attribute selectors
├── design-source/              # design handoff bundle (HTML refs, content, assets)
└── docs/
    └── superpowers/specs/
        └── 2026-05-12-astro-setup-design.md   # this document
```

## Component Breakdown

Components are flat under `src/components/` — the project is small enough that subfolders aren't worth the friction.

**Shared (both pages):**

| Component | Purpose |
|-----------|---------|
| `BaseLayout.astro` | HTML shell, `<head>`, Google Fonts preconnect/stylesheet, body texture, slot for page content. Accepts `title` and `description` props for per-page meta. |
| `SiteNav.astro` | Sticky header. Brand mark + wordmark on the left, four links, crimson pill "Book a call" CTA on the right. Mobile hamburger sheet below 880px. Inline script handles `data-scrolled` attribute and mobile toggle. |
| `SiteFooter.astro` | Three-column footer + legal row. Inline script sets `#year` text from `new Date().getFullYear()`. |
| `Eyebrow.astro` | Small uppercase label with leading rule. Used across both pages. |
| `SectionHead.astro` | Two-column section head: eyebrow + h2 + supporting paragraph. |
| `Button.astro` | Variants: `primary` (crimson pill), `ghost` (charcoal outline). Optional `arrow` modifier for animated `→`. Supports `href`, `external`, and `aria-label`. |

**Landing-specific:**

| Component | Purpose |
|-----------|---------|
| `Hero.astro` | Stamp-centered variant only. Centered eyebrow, large lantern stamp, h1, serif subline, two CTAs. v1 and v3 variants omitted per design handoff. |
| `ProblemTile.astro` | Numeral + serif heading + warm-gray body. Four instances in a responsive grid (4-up at ≥1080px, 2×2 at 760–1080px, single column below). |
| `EngageCard.astro` | Warm-blush pill + serif h3 + italic examples line + body + bordered "when it fits" footer. Hover lifts 2px with crimson border. |
| `EngagePanel.astro` | Full-width parchment card with 4px crimson left rule. Eyebrow + serif callout on the left, CTA + subtext on the right, faded lantern watermark bottom-right. |
| `AboutBlock.astro` | Two-column: headshot (Astro `<Image>` for optimization) left, copy + 3-column stat row right. |
| `ContactSection.astro` | Dark section. Left column: copy + three direct-contact rows. Right column: `ContactForm`. |
| `ContactForm.astro` | Name / company / email / phone / message fields. Inline `<script>` posts to Web3Forms via `fetch()`, shows success card on 2xx or inline error on failure. |

**Diagnostics-specific:**

| Component | Purpose |
|-----------|---------|
| `DiagHero.astro` | Text-left layout with lantern stamp bleeding off the right edge. Two-column inner grid: copy + four-row meta panel (Time / Best for / Format / Cost). |
| `DiagIndexStrip.astro` | Parchment-2 horizontal band with three quick-jump anchor links prefixed by serif crimson numerals. |
| `DiagBlock.astro` | Props: `num`, `title`, `time`, `bestFor`, `question`, `paragraphs[]`, `domains[]`, `downloadHref`. Two-column at ≥880px with large numeral + metadata card on the left and content + chips + download CTA on the right. |
| `InviteBlock.astro` | Dark section with copy + two CTAs (primary Calendly + ghost link to `/#about`) and the headshot. Same visual pattern as `ContactSection` but with different inner structure — no shared wrapper component, the overlap is too thin to justify it. |

## Shared Data and Constants

**`src/config.ts`** — single source of truth for values referenced from multiple components:

```ts
export const CALENDLY_URL = "https://calendly.com/zacharynelson/consulting-welcome";
export const CONTACT_EMAIL = "..."; // TBD from final copy
export const CONTACT_PHONE = "..."; // TBD from final copy
export const BRAND_NAME = "Lantern Strategic";
```

**`src/data/diagnostics.ts`** — typed array consumed by `diagnostics.astro`:

```ts
export type Diagnostic = {
  id: "risk-velocity" | "sensing" | "antifragile";
  num: "01" | "02" | "03";
  title: string;
  time: string;
  bestFor: string;
  question: string;
  paragraphs: string[];
  domains: string[];
  downloadHref: string;
};

export const diagnostics: Diagnostic[] = [ /* three entries */ ];
```

## Styling Approach

**Tailwind v4 + minimal global CSS.**

`src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-crimson: #761215;
  --color-deep-crimson: #4d0b0d;
  --color-ember: #a01a1e;
  --color-rust: #c4403a;
  --color-warm-blush: #f5e6e6;
  --color-parchment: #faf6f0;
  --color-parchment-2: #f3ece0;
  --color-charcoal: #2a2421;
  --color-warm-gray: #7a6e6b;
  --color-stone: #e8e0dc;
  --font-display: "Playfair Display", serif;
  --font-body: "Source Sans 3", sans-serif;
}

/* Plain CSS for things Tailwind doesn't model */
body::before { /* SVG noise texture, multiply blend */ }
[data-scrolled="true"] { /* sticky nav scroll state */ }
/* fluid type clamps for h1/h2/h3 if not expressed via Tailwind utilities */
```

Brand tokens declared in `@theme` become utility classes automatically (`bg-parchment`, `text-crimson`, `font-display`, etc.). The handful of things that don't fit utilities — body noise texture, `data-scrolled` attribute selectors, fluid type clamps — live as plain CSS rules in the same file.

**Images:**

- Headshot (`zach-casual.jpg`) goes through Astro's `<Image>` from `astro:assets` for responsive sizing and format conversion.
- Lantern stamps and marks (`lantern-stamp.png`, `lantern-mark.png`) stay as plain `<img>` tags — their distressed/textured appearance is intentional per the design handoff and Astro's image pipeline could degrade it.

## Contact Form Flow

1. User fills name / company / email / phone / message.
2. Client-side `required` validation on name / company / email.
3. On submit, an inline `<script>` POSTs JSON to `https://api.web3forms.com/submit` with the `access_key` (read from `PUBLIC_WEB3FORMS_ACCESS_KEY` env var), `botcheck` honeypot field, and all form fields.
4. On 2xx response: hide the form, show the warm-blush success card (already styled in the design reference).
5. On error or non-2xx: show inline error message, leave the form populated so the user can retry.

No captcha. Web3Forms' built-in honeypot is sufficient for a low-volume marketing site.

## Deployment

**Build:** `astro build` produces `dist/` containing all static assets.

**Container:** Two-stage Dockerfile.

- Stage 1 — `node:20-alpine` builder: `npm ci` → `npm run build`.
- Stage 2 — `caddy:alpine` runtime: copy `dist/` into the served directory, drop in a one-line `Caddyfile` to serve from that directory.

The container exposes one HTTP port. SSL termination, HTTPS redirect, gzip, and host routing are handled upstream by the existing Traefik instance on the Hostinger Docker host — the container itself does not need to handle any of that.

Final image is small (~50MB Caddy alpine + the static bundle).

## Configuration

**`.env.example`** committed to the repo:

```
PUBLIC_WEB3FORMS_ACCESS_KEY=your-key-here
```

`.env` (with the real key) is gitignored. Astro's `PUBLIC_` prefix is required for the value to be available client-side.

## Testing

**Deferred until the port is functionally complete.** Once both pages render correctly and the form submits successfully, add a Playwright visual-regression suite that diffs the Astro build at multiple viewport widths (320 / 600 / 880 / 1080 / 1440) against the reference HTML files in `design-source/designs/`. The design handoff README contains the recipe.

During active development, testing is manual: `astro dev`, walk through both pages at each breakpoint, submit the form with a test Web3Forms key, verify mobile menu opens and closes on link click, verify smooth-scroll anchors land with correct offset under the sticky nav.

## Out of Scope

- The Tweaks panel from the design references — strip out during the port per the handoff README.
- Hero variants `v1` (editorial) and `v3` (portrait split) — omit per the handoff README.
- Real legal copy for `/privacy-policy` and `/terms` — placeholder stubs only.
- Real PDF files for the three diagnostics — use placeholder files at the right paths; Zach will swap in real PDFs later.
- Optional stock photography (warm/golden interiors) mentioned in the handoff — leave hooks but don't include.
- Playwright visual regression suite — deferred to post-port QA pass.
- Future web-based diagnostic surveys — not part of this scope; Vue can be added later if/when those exist.

## Open Questions

None blocking. A few items to resolve during implementation:

- Final contact email and phone for `src/config.ts` — pull from the final HTML reference.
- Whether to commit `design-source/` to the repo long-term, or move it elsewhere once the port is complete. Recommend committing initially so Playwright tests can reference it.
