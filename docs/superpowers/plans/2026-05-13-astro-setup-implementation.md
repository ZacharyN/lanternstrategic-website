# Lantern Strategic Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Lantern Strategic two-page marketing website by scaffolding an Astro 6 project, porting the finalized HTML/CSS design references into `.astro` components, wiring the contact form to Web3Forms, and packaging the build into a Caddy container deployable behind the existing Traefik on Hostinger.

**Architecture:** Pure-static Astro site (no SSR, no UI framework) with Tailwind v4 design tokens declared via `@theme`. Sixteen small, focused components rendered into four pages. Contact form submits client-side to Web3Forms. Production runtime is a `caddy:alpine` container serving the prebuilt `dist/` behind Traefik for SSL/routing.

**Tech Stack:** Astro 6.3.1, TypeScript (strict), Tailwind CSS v4 (Vite plugin), Web3Forms, Caddy, Docker.

**Spec reference:** `docs/superpowers/specs/2026-05-12-astro-setup-design.md`

**Design references:** `design-source/designs/Landing Page.html` and `design-source/designs/Diagnostics.html` — these are the source of truth for markup, styling, and inline JS. Both files inline all CSS in a `<style>` block at the top; extract values verbatim.

---

## Verification Approach

This is a design-port project, not a behavior-driven feature. Classical unit-test TDD doesn't fit most tasks. Instead, each task is verified by the most appropriate signal:

- **Config/scaffold tasks** → `npm run build` and `npx astro check` succeed.
- **Component port tasks** → component is imported into a page, `npm run dev` is running, manual visual check against the corresponding section of the reference HTML.
- **Contact form** → submit a real test message against a Web3Forms key, confirm the message arrives.
- **Docker** → `docker build` succeeds, `docker run` serves the site, `curl localhost:<port>` returns the homepage HTML.

Each task ends with a commit so progress is incremental and reversible.

---

## Phase 1 — Scaffold

### Task 1: Initialize Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro`, `src/env.d.ts`

- [ ] **Step 1: Run the Astro scaffolder with the minimal template**

From the project root `/var/home/zacharyn/PycharmProjects/lantern-strategic/`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston --yes
```

Expected: scaffolds `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `src/env.d.ts`, `public/favicon.svg`, `.gitignore`, `README.md`. Does not install dependencies, does not initialize git (we already initialized git when committing the spec).

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: creates `node_modules/` and `package-lock.json`. No errors.

- [ ] **Step 3: Verify the scaffolded site builds**

```bash
npm run build
```

Expected: build succeeds, `dist/index.html` exists.

- [ ] **Step 4: Verify TypeScript is strict**

Open `tsconfig.json` and confirm it extends `astro/tsconfigs/strict`. If it extends `astro/tsconfigs/base` instead, change the `extends` value:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 5: Verify type-check passes**

```bash
npx astro check
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/ public/ README.md
git commit -m "feat: scaffold Astro project with strict TypeScript"
```

---

### Task 2: Add Tailwind CSS v4 via the Vite plugin

**Files:**
- Modify: `astro.config.mjs`, `package.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Run the Astro Tailwind installer**

```bash
npx astro add tailwind --yes
```

Expected: installs `@tailwindcss/vite` and `tailwindcss`, modifies `astro.config.mjs` to register the Vite plugin, creates `src/styles/global.css` with a `@import "tailwindcss";` line.

- [ ] **Step 2: Replace `src/styles/global.css` with the full theme block**

Open `src/styles/global.css` and replace its contents with:

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

  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Source Sans 3", system-ui, sans-serif;
}

:root {
  --gutter: clamp(20px, 4vw, 56px);
  --max-content: 1240px;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--color-parchment);
  color: var(--color-charcoal);
  font-size: 17px;
  line-height: 1.55;
}

/* Paper texture overlay — copy the SVG noise data URI from
   design-source/designs/Landing Page.html (search the <style>
   block for the `body::before` rule that uses url("data:image/svg+xml..."))
   and paste it verbatim below. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: multiply;
  opacity: 0.35;
  background-image: url("data:image/svg+xml;utf8,<PASTE_NOISE_SVG_DATA_URI_HERE>");
}

/* Sticky-nav scrolled state — applied by inline script in SiteNav */
[data-scrolled="true"] {
  border-bottom: 1px solid var(--color-stone);
}
```

- [ ] **Step 3: Import the stylesheet into the (still-default) index page so it loads**

Open `src/pages/index.astro` and add this import at the top of the frontmatter:

```astro
---
import "../styles/global.css";
---
```

(The existing default page body stays for now — we'll rewrite it in Phase 5.)

- [ ] **Step 4: Verify the build still succeeds**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 5: Verify Tailwind utilities resolve**

```bash
npm run dev
```

Open `http://localhost:4321/` in a browser. Open devtools, inspect `<body>`, confirm the parchment background color is applied via the CSS variable. Stop the dev server (`Ctrl+C`).

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json src/styles/global.css src/pages/index.astro
git commit -m "feat: add Tailwind v4 with brand theme tokens"
```

---

### Task 3: Copy design assets into `public/`

**Files:**
- Create: `public/images/lantern-stamp.png`, `public/images/lantern-mark.png`, `public/images/lantern-stamp-inverted.png`, `public/images/lantern-mark-inverted.png`, `public/images/zach-casual.jpg`
- Create: `public/diagnostics/.gitkeep`

- [ ] **Step 1: Copy lantern stamps and headshot to `public/images/`**

```bash
mkdir -p public/images public/diagnostics
cp design-source/designs/assets/lantern-stamp.png public/images/
cp design-source/designs/assets/lantern-stamp-inverted.png public/images/
cp design-source/designs/assets/lantern-mark.png public/images/
cp design-source/designs/assets/lantern-mark-inverted.png public/images/
cp design-source/designs/assets/zach-casual.jpg public/images/
touch public/diagnostics/.gitkeep
```

- [ ] **Step 2: Verify the files are in place**

```bash
ls public/images/ public/diagnostics/
```

Expected: five image files in `public/images/`, `.gitkeep` in `public/diagnostics/`.

- [ ] **Step 3: Commit**

```bash
git add public/images/ public/diagnostics/
git commit -m "feat: add brand assets and PDF download directory"
```

---

### Task 4: Add Google Fonts preconnect and stylesheet loading

This task is folded into Task 5 (BaseLayout creation). Skip and proceed to Task 5.

---

## Phase 2 — Shared Foundation

### Task 5: Create `BaseLayout.astro`

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create the file with the full HTML shell**

```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <link rel="icon" type="image/png" href="/images/lantern-mark.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
    />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="/images/lantern-stamp.png" />
    <meta property="og:type" content="website" />
  </head>
  <body data-texture="on">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with fonts and meta scaffolding"
```

---

### Task 6: Create `src/config.ts` with shared constants

**Files:**
- Create: `src/config.ts`

- [ ] **Step 1: Write the config module**

```ts
export const BRAND_NAME = "Lantern Strategic";
export const CALENDLY_URL = "https://calendly.com/zacharynelson/consulting-welcome";

// Pull these from the contact-section markup in
// design-source/designs/Landing Page.html (search for the
// .contact-rows section). Replace placeholders below.
export const CONTACT_EMAIL = "REPLACE_WITH_REAL_EMAIL_FROM_LANDING_HTML";
export const CONTACT_PHONE = "REPLACE_WITH_REAL_PHONE_FROM_LANDING_HTML";

export const NAV_LINKS = [
  { href: "/#approach", label: "Approach" },
  { href: "/#engage", label: "Engagements" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;
```

- [ ] **Step 2: Open `design-source/designs/Landing Page.html` and search for the contact section.** Extract the real email and phone from the markup. Replace the two `REPLACE_WITH_REAL_*` placeholders in `src/config.ts` with the real values.

- [ ] **Step 3: Verify type-check passes**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/config.ts
git commit -m "feat: add shared config for brand constants and contact info"
```

---

### Task 7: Add `.env.example` and Web3Forms environment plumbing

**Files:**
- Create: `.env.example`
- Modify: `.gitignore` (verify `.env` is excluded)
- Create: `src/env.d.ts` modifications if needed

- [ ] **Step 1: Create `.env.example`**

```
PUBLIC_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here
```

- [ ] **Step 2: Verify `.env` is in `.gitignore`**

Open `.gitignore` and confirm a line `.env` (or `.env*`) exists. The Astro scaffold should include this by default. If missing, append:

```
.env
.env.production
.env.local
```

- [ ] **Step 3: Add type declaration for the env var**

Open `src/env.d.ts` (created by the scaffolder). After the existing `/// <reference path="../.astro/types.d.ts" />` line, add:

```ts
interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 4: Create a local `.env` for development**

```bash
cp .env.example .env
```

Then edit `.env` and paste in a real Web3Forms access key (Zach will provide one from web3forms.com; if not yet available, leave the placeholder — the form submission will fail gracefully and we'll plug in the key before deploying).

- [ ] **Step 5: Verify type-check passes**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 6: Commit (the example file, not the real `.env`)**

```bash
git add .env.example src/env.d.ts .gitignore
git commit -m "feat: add Web3Forms environment variable plumbing"
```

---

## Phase 3 — Shared Components

### Task 8: Create `Eyebrow.astro`

**Files:**
- Create: `src/components/Eyebrow.astro`

- [ ] **Step 1: Open `design-source/designs/Landing Page.html`** and find the `.eyebrow` CSS rule in the `<style>` block. Note the exact properties (font, size, weight, letter-spacing, color, the `::before` rule for the leading horizontal line). This determines what the component renders.

- [ ] **Step 2: Write the component**

```astro
---
interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;
---
<span class:list={["eyebrow", className]}>
  <slot />
</span>

<style>
  .eyebrow {
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-warm-gray);
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
  .eyebrow::before {
    content: "";
    width: 28px;
    height: 1px;
    background: var(--color-warm-gray);
  }
</style>
```

Confirm these values match what's in the reference HTML's `.eyebrow` rule. If anything differs (color variant, line length, weight), match the reference exactly.

- [ ] **Step 3: Verify it builds**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Eyebrow.astro
git commit -m "feat: add Eyebrow component"
```

---

### Task 9: Create `Button.astro`

**Files:**
- Create: `src/components/Button.astro`

- [ ] **Step 1: Open `design-source/designs/Landing Page.html`** and find the `.btn`, `.btn-primary`, `.btn-ghost`, and `.btn-arrow` CSS rules. Note exact padding, border-radius (999px = pill), font weight, transitions, hover states.

- [ ] **Step 2: Write the component**

```astro
---
interface Props {
  href: string;
  variant?: "primary" | "ghost";
  arrow?: boolean;
  external?: boolean;
  class?: string;
}

const {
  href,
  variant = "primary",
  arrow = false,
  external = false,
  class: className = "",
} = Astro.props;

const rel = external ? "noopener noreferrer" : undefined;
const target = external ? "_blank" : undefined;
---
<a
  href={href}
  target={target}
  rel={rel}
  class:list={["btn", `btn-${variant}`, { "btn-arrow": arrow }, className]}
>
  <slot />
  {arrow && <span class="arrow">→</span>}
</a>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 26px;
    border-radius: 999px;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, transform 0.15s, border-color 0.15s;
    border: 1px solid transparent;
  }
  .btn-primary {
    background: var(--color-crimson);
    color: var(--color-parchment);
  }
  .btn-primary:hover {
    background: var(--color-deep-crimson);
  }
  .btn-ghost {
    background: transparent;
    color: var(--color-charcoal);
    border-color: var(--color-charcoal);
  }
  .btn-ghost:hover {
    border-color: var(--color-crimson);
    color: var(--color-crimson);
  }
  .btn-arrow .arrow {
    transition: transform 0.15s;
  }
  .btn-arrow:hover .arrow {
    transform: translateX(3px);
  }
</style>
```

Cross-check the values against the reference. Adjust if different.

- [ ] **Step 3: Verify it builds**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Button.astro
git commit -m "feat: add Button component with primary/ghost variants"
```

---

### Task 10: Create `SectionHead.astro`

**Files:**
- Create: `src/components/SectionHead.astro`

- [ ] **Step 1: Find the two-column section-head pattern in `design-source/designs/Landing Page.html`** — the "Problems that don't announce themselves" section uses it. Note the column ratio, h2 styling, and supporting paragraph styling.

- [ ] **Step 2: Write the component**

```astro
---
interface Props {
  eyebrow: string;
  heading: string;
}

const { eyebrow, heading } = Astro.props;
---
<header class="section-head">
  <div class="left">
    <span class="eyebrow"><span class="rule"></span>{eyebrow}</span>
    <h2>{heading}</h2>
  </div>
  <div class="right">
    <slot />
  </div>
</header>

<style>
  .section-head {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: clamp(40px, 5vw, 64px);
  }
  @media (min-width: 880px) {
    .section-head {
      grid-template-columns: 1fr 1fr;
      gap: 56px;
    }
  }
  .eyebrow {
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-warm-gray);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .rule {
    display: inline-block;
    width: 28px;
    height: 1px;
    background: var(--color-warm-gray);
  }
  h2 {
    font-family: var(--font-display);
    font-size: clamp(30px, 4.2vw, 52px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.018em;
    text-wrap: balance;
    margin: 0;
  }
  .right {
    font-size: 17px;
    line-height: 1.6;
    color: var(--color-warm-gray);
    text-wrap: pretty;
  }
</style>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SectionHead.astro
git commit -m "feat: add SectionHead two-column component"
```

---

### Task 11: Create `SiteNav.astro` with scroll behavior and mobile menu

**Files:**
- Create: `src/components/SiteNav.astro`

- [ ] **Step 1: Open `design-source/designs/Landing Page.html`** and locate the `<nav>` element and all `.nav`, `.nav-*`, and `.menu-*` CSS rules. Also locate the inline script that handles `data-scrolled` on scroll and the mobile menu toggle. Plan to copy that script verbatim.

- [ ] **Step 2: Write the component (transcribe markup and styles from the reference)**

```astro
---
import { CALENDLY_URL, NAV_LINKS } from "../config";
---
<nav id="nav" data-scrolled="false">
  <div class="nav-inner">
    <a href="/" class="brand" aria-label="Lantern Strategic home">
      <img src="/images/lantern-mark.png" alt="" class="brand-mark" />
      <span class="brand-word">Lantern <em>Strategic</em></span>
    </a>

    <ul class="nav-links">
      {NAV_LINKS.map((link) => (
        <li><a href={link.href}>{link.label}</a></li>
      ))}
    </ul>

    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      class="nav-cta"
    >
      Book a call <span class="arrow">→</span>
    </a>

    <button
      class="menu-toggle"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <span></span><span></span><span></span>
    </button>
  </div>

  <div id="mobile-menu" class="mobile-menu" data-open="false">
    <ul>
      {NAV_LINKS.map((link) => (
        <li><a href={link.href}>{link.label}</a></li>
      ))}
    </ul>
  </div>
</nav>

<style>
  /* Transcribe the .nav, .nav-inner, .brand, .brand-mark, .brand-word,
     .nav-links, .nav-cta, .menu-toggle, .mobile-menu rules from
     design-source/designs/Landing Page.html verbatim into this block.
     They are large but self-contained — paste them as-is. */
</style>

<script>
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      nav.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
  const sheet = document.getElementById("mobile-menu");
  if (toggle && sheet) {
    toggle.addEventListener("click", () => {
      const isOpen = sheet.getAttribute("data-open") === "true";
      sheet.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    sheet.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        sheet.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
</script>
```

**Note:** the `<style>` block is intentionally left as a comment placeholder. The exact CSS rules from the reference HTML must be pasted in. They cover: parchment-with-blur backdrop, sticky positioning, layout (brand left / links center / CTA right), mobile sheet styling triggered by `[data-open="true"]`, hamburger button visibility above/below 880px.

- [ ] **Step 3: Mount `SiteNav` in a test page to visually verify it**

Open `src/pages/index.astro` and replace its body content with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SiteNav from "../components/SiteNav.astro";
---
<BaseLayout title="Lantern Strategic" description="Scaffolding preview">
  <SiteNav />
  <main style="min-height: 200vh; padding: 120px var(--gutter);">
    <p>Scroll to verify the sticky nav scroll state.</p>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321/`. Check:
- Nav is sticky at the top.
- Scrolling down past 8px adds a bottom border to the nav (visual confirmation of `data-scrolled="true"`).
- At wide width: links are visible, hamburger is hidden.
- At <880px (use devtools responsive mode): links hide, hamburger appears, clicking it opens the mobile sheet, clicking a link closes it.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.astro src/pages/index.astro
git commit -m "feat: add SiteNav with sticky scroll state and mobile menu"
```

---

### Task 12: Create `SiteFooter.astro` with auto-updating year

**Files:**
- Create: `src/components/SiteFooter.astro`

- [ ] **Step 1: Find the `<footer>` markup and all `.footer-*` CSS rules in `design-source/designs/Landing Page.html`.** Note: the footer is on a charcoal background, three-column at ≥880px, with brand on the left, "Explore" links middle, "Talk" links right, and a bottom row with copyright + legal links.

- [ ] **Step 2: Write the component**

```astro
---
import { CALENDLY_URL, CONTACT_EMAIL } from "../config";
---
<footer class="site-footer">
  <div class="footer-inner">
    <div class="col brand-col">
      <img src="/images/lantern-stamp.png" alt="Lantern Strategic" class="footer-stamp" />
      <p class="tagline">Operations &amp; technology consulting.</p>
    </div>

    <div class="col">
      <h4>Explore</h4>
      <ul>
        <li><a href="/#approach">Approach</a></li>
        <li><a href="/#engage">Engagements</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/diagnostics">Diagnostics</a></li>
      </ul>
    </div>

    <div class="col">
      <h4>Talk</h4>
      <ul>
        <li><a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a call</a></li>
        <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-legal">
    <p>&copy; <span id="year"></span> Lantern Strategic. All rights reserved.</p>
    <p>
      <a href="/privacy-policy">Privacy Policy</a> &middot;
      <a href="/terms">Terms of Service</a>
    </p>
  </div>
</footer>

<style>
  /* Transcribe the .site-footer (or equivalent class name from the
     reference HTML), .footer-inner, .col, .brand-col, .footer-stamp,
     .footer-legal, h4, and link rules verbatim from
     design-source/designs/Landing Page.html. */
</style>

<script>
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
</script>
```

- [ ] **Step 3: Mount the footer in `src/pages/index.astro` below the placeholder main**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SiteNav from "../components/SiteNav.astro";
import SiteFooter from "../components/SiteFooter.astro";
---
<BaseLayout title="Lantern Strategic" description="Scaffolding preview">
  <SiteNav />
  <main style="min-height: 100vh; padding: 120px var(--gutter);">
    <p>Preview body.</p>
  </main>
  <SiteFooter />
</BaseLayout>
```

- [ ] **Step 4: Verify visually**

```bash
npm run dev
```

Confirm the footer renders on charcoal, with three columns at wide width, and the current year (2026) appears in the legal row. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteFooter.astro src/pages/index.astro
git commit -m "feat: add SiteFooter with dynamic year"
```

---

## Phase 4 — Landing Page Components

For each component in this phase: find the corresponding section in `design-source/designs/Landing Page.html`, transcribe its markup and styles into the component, mount it in `src/pages/index.astro`, and verify visually before committing.

### Task 13: Create `Hero.astro` (stamp-centered variant only)

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: In the reference HTML, locate the `.hero` element and find the variant gated by `data-variant="v2"` (stamp-centered).** This is the only variant we're porting; ignore v1 and v3. Note the eyebrow, large lantern stamp image at `clamp(160px, 18vw, 220px)`, h1, serif subline, and two CTAs.

- [ ] **Step 2: Write the component**

```astro
---
import { CALENDLY_URL } from "../config";
import Button from "./Button.astro";
---
<section class="hero">
  <div class="hero-inner">
    <span class="eyebrow"><span class="rule"></span>Operations &amp; technology consulting</span>
    <img src="/images/lantern-stamp.png" alt="" class="hero-stamp" />
    <h1>Helping businesses move forward when the path isn't obvious.</h1>
    <p class="subline">[Transcribe subline from reference HTML]</p>
    <div class="hero-ctas">
      <Button href={CALENDLY_URL} external arrow>Book a 30-minute call</Button>
      <Button href="#approach" variant="ghost">See how we work</Button>
    </div>
  </div>
</section>

<style>
  /* Transcribe the .hero[data-variant="v2"] rules (the stamp-centered
     layout) and any shared .hero, .hero-inner, .hero-stamp, .subline,
     .hero-ctas rules from the reference HTML. Skip the v1 and v3 styles. */
</style>
```

- [ ] **Step 3: Mount and visually verify**

Replace the body of `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SiteNav from "../components/SiteNav.astro";
import SiteFooter from "../components/SiteFooter.astro";
import Hero from "../components/Hero.astro";
---
<BaseLayout title="Lantern Strategic" description="Operations &amp; technology consulting">
  <SiteNav />
  <Hero />
  <SiteFooter />
</BaseLayout>
```

Run `npm run dev`. Compare visually to `design-source/designs/Landing Page.html` opened in the same browser. The hero should match: centered eyebrow, large stamp, h1, subline, two CTAs. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add stamp-centered Hero"
```

---

### Task 14: Create `ProblemTile.astro` and assemble the problems section

**Files:**
- Create: `src/components/ProblemTile.astro`

- [ ] **Step 1: Locate the "Problems that don't announce themselves" section in the reference HTML.** Note the four tiles (each with a serif numeral 01–04, serif heading, warm-gray body) and the surrounding container, large serif pull line, and `parchment-2` background.

- [ ] **Step 2: Write the tile component**

```astro
---
interface Props {
  num: string;
  heading: string;
}

const { num, heading } = Astro.props;
---
<article class="problem-tile">
  <span class="num">{num}</span>
  <h3>{heading}</h3>
  <p><slot /></p>
</article>

<style>
  .problem-tile {
    padding: 32px 24px;
    border-top: 1px solid var(--color-stone);
  }
  .num {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 500;
    color: var(--color-crimson);
    display: block;
    margin-bottom: 16px;
  }
  h3 {
    font-family: var(--font-display);
    font-size: clamp(20px, 1.9vw, 26px);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 0 0 12px;
  }
  p {
    color: var(--color-warm-gray);
    margin: 0;
  }
</style>
```

Cross-check styling against the reference; adjust if needed.

- [ ] **Step 3: Add the problems section to `src/pages/index.astro`**

After `<Hero />` and before `<SiteFooter />`, add:

```astro
import SectionHead from "../components/SectionHead.astro";
import ProblemTile from "../components/ProblemTile.astro";
```

```astro
<section id="approach" class="problems">
  <div class="container">
    <SectionHead eyebrow="Approach" heading="The problems that don't announce themselves.">
      <p>[Transcribe the supporting paragraph from reference HTML]</p>
    </SectionHead>

    <p class="pull-line">
      [Transcribe the large serif pull line — note the
      <em class="crimson">crimson italic accent</em> on "quiet problems"]
    </p>

    <div class="problem-grid">
      <ProblemTile num="01" heading="[Title from reference]">[Body from reference]</ProblemTile>
      <ProblemTile num="02" heading="[Title from reference]">[Body from reference]</ProblemTile>
      <ProblemTile num="03" heading="[Title from reference]">[Body from reference]</ProblemTile>
      <ProblemTile num="04" heading="[Title from reference]">[Body from reference]</ProblemTile>
    </div>
  </div>
</section>

<style>
  .problems {
    background: var(--color-parchment-2);
    padding: clamp(72px, 9vw, 130px) 0;
  }
  .container {
    max-width: var(--max-content);
    margin: 0 auto;
    padding: 0 var(--gutter);
  }
  .pull-line {
    font-family: var(--font-display);
    font-size: clamp(28px, 3.4vw, 44px);
    line-height: 1.2;
    margin: clamp(40px, 5vw, 64px) 0;
    text-wrap: balance;
  }
  .pull-line .crimson {
    color: var(--color-crimson);
    font-style: italic;
  }
  .problem-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 760px) {
    .problem-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1080px) {
    .problem-grid { grid-template-columns: repeat(4, 1fr); }
  }
</style>
```

Then transcribe the four tile titles/bodies and the pull line from the reference HTML, replacing the bracketed placeholders.

- [ ] **Step 4: Visually verify**

```bash
npm run dev
```

Open both `http://localhost:4321/` and `design-source/designs/Landing Page.html` (open the file directly in the browser). Compare the problems section. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProblemTile.astro src/pages/index.astro
git commit -m "feat: add problems section with ProblemTile"
```

---

### Task 15: Create `EngageCard.astro` and `EngagePanel.astro`, assemble the engagements section

**Files:**
- Create: `src/components/EngageCard.astro`, `src/components/EngagePanel.astro`

- [ ] **Step 1: Locate the "Three ways to engage" section in the reference HTML.** Note: three cards side-by-side at ≥880px, each with warm-blush pill ("01 · Defined projects"), serif h3, italic warm-gray "examples" line, body, and a bordered "When it fits" footer. Cards lift `-2px` on hover with a crimson border.

- [ ] **Step 2: Write `EngageCard.astro`**

```astro
---
interface Props {
  num: string;
  category: string;
  heading: string;
  examples: string;
}

const { num, category, heading, examples } = Astro.props;
---
<article class="engage-card">
  <span class="pill">{num} &middot; {category}</span>
  <h3>{heading}</h3>
  <p class="examples">{examples}</p>
  <p class="body"><slot /></p>
  <footer class="when-it-fits">
    <slot name="when-it-fits" />
  </footer>
</article>

<style>
  .engage-card {
    background: var(--color-parchment);
    border: 1px solid var(--color-stone);
    border-radius: 6px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: transform 0.15s, border-color 0.15s;
  }
  .engage-card:hover {
    transform: translateY(-2px);
    border-color: var(--color-crimson);
  }
  .pill {
    align-self: flex-start;
    background: var(--color-warm-blush);
    color: var(--color-crimson);
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  h3 {
    font-family: var(--font-display);
    font-size: clamp(20px, 1.9vw, 26px);
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
  }
  .examples {
    font-style: italic;
    color: var(--color-warm-gray);
    margin: 0;
  }
  .body {
    margin: 0;
  }
  .when-it-fits {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--color-stone);
    font-size: 14px;
    color: var(--color-warm-gray);
  }
</style>
```

Cross-check against reference; adjust where it differs.

- [ ] **Step 3: Write `EngagePanel.astro`**

```astro
---
import { CALENDLY_URL } from "../config";
import Button from "./Button.astro";
---
<aside class="engage-panel">
  <div class="left">
    <span class="eyebrow"><span class="rule"></span>The first step</span>
    <p class="callout">
      The first conversation usually tells <em>us both</em>.
    </p>
  </div>
  <div class="right">
    <Button href={CALENDLY_URL} external arrow>Book a 30-minute call</Button>
    <p class="subtext">30 minutes &middot; no obligation</p>
  </div>
  <img src="/images/lantern-mark.png" alt="" class="watermark" aria-hidden="true" />
</aside>

<style>
  .engage-panel {
    background: var(--color-parchment);
    border-left: 4px solid var(--color-crimson);
    padding: clamp(40px, 5vw, 64px);
    margin-top: clamp(48px, 6vw, 80px);
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 880px) {
    .engage-panel {
      grid-template-columns: 2fr 1fr;
      align-items: center;
    }
  }
  .eyebrow {
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-warm-gray);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .rule { display: inline-block; width: 28px; height: 1px; background: currentColor; }
  .callout {
    font-family: var(--font-display);
    font-size: clamp(28px, 3.4vw, 44px);
    line-height: 1.2;
    margin: 0;
    text-wrap: balance;
  }
  .callout em {
    color: var(--color-crimson);
    font-style: italic;
  }
  .subtext { color: var(--color-warm-gray); font-size: 14px; margin: 12px 0 0; }
  .watermark {
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 220px;
    opacity: 0.08;
    pointer-events: none;
  }
</style>
```

Cross-check exact values against the reference (the watermark size/position and the panel's color/spacing should match).

- [ ] **Step 4: Add the engagements section to `src/pages/index.astro`**

Import the new components and add this section after the problems section:

```astro
<section id="engage" class="engagements">
  <div class="container">
    <SectionHead eyebrow="Engagements" heading="Three ways to engage.">
      <p>[Transcribe intro paragraph from reference HTML]</p>
    </SectionHead>

    <div class="engage-grid">
      <EngageCard num="01" category="Defined projects" heading="[Title]" examples="[Examples line]">
        [Body copy]
        <Fragment slot="when-it-fits">[When it fits copy]</Fragment>
      </EngageCard>
      <EngageCard num="02" category="..." heading="..." examples="...">
        [Body]
        <Fragment slot="when-it-fits">[When it fits]</Fragment>
      </EngageCard>
      <EngageCard num="03" category="..." heading="..." examples="...">
        [Body]
        <Fragment slot="when-it-fits">[When it fits]</Fragment>
      </EngageCard>
    </div>

    <EngagePanel />
  </div>
</section>

<style>
  .engagements {
    background: var(--color-parchment);
    padding: clamp(72px, 9vw, 130px) 0;
  }
  .engage-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 880px) {
    .engage-grid { grid-template-columns: repeat(3, 1fr); }
  }
</style>
```

Then fill in all bracketed copy by transcribing from the reference HTML's three engagement cards.

- [ ] **Step 5: Visually verify**

```bash
npm run dev
```

Confirm three cards render in a row at wide width, the engagement panel sits below with its crimson rule on the left and lantern watermark in the corner. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/EngageCard.astro src/components/EngagePanel.astro src/pages/index.astro
git commit -m "feat: add engagements section with EngageCard and EngagePanel"
```

---

### Task 16: Create `AboutBlock.astro` and assemble the About section

**Files:**
- Create: `src/components/AboutBlock.astro`

- [ ] **Step 1: Locate the "About Zach" section in the reference HTML.** Two-column at ≥880px: headshot left (4:5 aspect, max 460px wide, slight desaturation filter), text right. Eyebrow → h2 → serif lede → three paragraphs → 3-column stat row with top/bottom rules.

- [ ] **Step 2: Write the component**

```astro
---
import { Image } from "astro:assets";
import zachCasual from "../../public/images/zach-casual.jpg";
---
<section id="about" class="about">
  <div class="container">
    <div class="grid">
      <div class="photo">
        <Image
          src={zachCasual}
          alt="Zach Nelson, casual portrait"
          widths={[320, 460, 920]}
          sizes="(min-width: 880px) 460px, 100vw"
          loading="lazy"
        />
      </div>
      <div class="text">
        <span class="eyebrow"><span class="rule"></span>About</span>
        <h2>[Transcribe h2 from reference]</h2>
        <p class="lede">[Transcribe serif lede paragraph]</p>
        <p>[Body paragraph 1]</p>
        <p>[Body paragraph 2]</p>
        <p>[Body paragraph 3]</p>

        <div class="stats">
          <div class="stat">
            <span class="num">15</span>
            <span class="label">years</span>
          </div>
          <div class="stat">
            <span class="num">100+</span>
            <span class="label">engagements</span>
          </div>
          <div class="stat">
            <span class="num">5</span>
            <span class="label">industries</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Transcribe the about-section CSS (`.about`, `.grid`, `.photo`,
     `.text`, `.lede`, `.stats`, `.stat`, etc.) from the reference HTML.
     Notable: photo has 4:5 aspect-ratio and a slight saturate/grayscale
     filter; stats row has top and bottom rules. */
</style>
```

Transcribe all bracketed copy from the reference HTML. Verify the stat labels match the reference (the numbers `15 / 100+ / 5` are correct per the design handoff README, but the labels may be different from "years/engagements/industries").

**Note on the image import:** the spec uses Astro's `<Image>` for the headshot. If `astro:assets` rejects importing from `public/`, move `zach-casual.jpg` to `src/assets/` instead and update the import path. The lantern stamps stay in `public/` and use plain `<img>`.

- [ ] **Step 3: Add the import and section to `src/pages/index.astro`**

```astro
import AboutBlock from "../components/AboutBlock.astro";
```

Place `<AboutBlock />` after the engagements section.

- [ ] **Step 4: Visually verify**

```bash
npm run dev
```

Confirm: photo on the left, text on the right at wide width; stacked with photo first below 880px; stats row renders below the prose with top/bottom rules. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/AboutBlock.astro src/pages/index.astro
git commit -m "feat: add AboutBlock with stat row"
```

---

### Task 17: Create `ContactForm.astro` with Web3Forms submission

**Files:**
- Create: `src/components/ContactForm.astro`

- [ ] **Step 1: Locate the contact form markup in the reference HTML.** Fields: name, company, email, phone, message. Note the success-state markup (`.form-success` — warm-blush card with crimson border) and the focus-state styling.

- [ ] **Step 2: Write the component**

```astro
---
const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY;
---
<form id="contact-form" novalidate>
  <input type="hidden" name="access_key" value={accessKey} />
  <input type="hidden" name="from_name" value="Lantern Strategic Website" />
  <input type="hidden" name="subject" value="New contact from lanternstrategic.com" />
  <input type="checkbox" name="botcheck" class="botcheck" tabindex="-1" autocomplete="off" />

  <div class="row">
    <label>
      <span>Name</span>
      <input type="text" name="name" required autocomplete="name" />
    </label>
    <label>
      <span>Company</span>
      <input type="text" name="company" required autocomplete="organization" />
    </label>
  </div>

  <div class="row">
    <label>
      <span>Email</span>
      <input type="email" name="email" required autocomplete="email" />
    </label>
    <label>
      <span>Phone (optional)</span>
      <input type="tel" name="phone" autocomplete="tel" />
    </label>
  </div>

  <label class="full">
    <span>How can we help?</span>
    <textarea name="message" rows="5" required></textarea>
  </label>

  <button type="submit" class="submit">
    Send message <span class="arrow">→</span>
  </button>

  <p class="privacy">[Transcribe privacy note from reference HTML]</p>

  <div class="form-error" hidden></div>
</form>

<div class="form-success" hidden>
  <h3>[Success heading from reference]</h3>
  <p>[Success body from reference]</p>
</div>

<style>
  /* Transcribe all .form-*, input/textarea/label, .row, .botcheck,
     .submit, .form-success, .form-error styles from the reference HTML
     verbatim. The botcheck honeypot must be visually hidden but not
     `display: none` (bots fill hidden but rendered fields). */
</style>

<script>
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const success = document.querySelector<HTMLElement>(".form-success");
  const errorBox = document.querySelector<HTMLElement>(".form-error");

  if (form && success && errorBox) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorBox.hidden = true;

      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const payload: Record<string, string> = {};
      formData.forEach((value, key) => {
        if (typeof value === "string") payload[key] = value;
      });

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Submission failed (${response.status})`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Submission failed");

        form.hidden = true;
        success.hidden = false;
        form.reset();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Submission failed";
        errorBox.textContent = `Sorry — that didn't go through. ${message}. Please try again or email us directly.`;
        errorBox.hidden = false;
      }
    });
  }
</script>
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

(We'll visually verify the form once it's inside `ContactSection` in the next task.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: add ContactForm with Web3Forms submission"
```

---

### Task 18: Create `ContactSection.astro` and assemble the dark contact section

**Files:**
- Create: `src/components/ContactSection.astro`

- [ ] **Step 1: Locate the dark `#contact` section in the reference HTML.** Charcoal background, parchment text. Left column: eyebrow + h2 + intro paragraph + three direct-contact rows (label + value, hairline rules between). Right column: the contact form on a near-white card.

- [ ] **Step 2: Write the component**

```astro
---
import { CONTACT_EMAIL, CONTACT_PHONE } from "../config";
import ContactForm from "./ContactForm.astro";
---
<section id="contact" class="contact-section">
  <div class="container">
    <div class="grid">
      <div class="left">
        <span class="eyebrow"><span class="rule"></span>Contact</span>
        <h2>[Transcribe h2 from reference]</h2>
        <p class="intro">[Transcribe intro paragraph]</p>

        <div class="rows">
          <div class="row">
            <span class="label">Email</span>
            <a href={`mailto:${CONTACT_EMAIL}`} class="value">{CONTACT_EMAIL}</a>
          </div>
          <div class="row">
            <span class="label">Phone</span>
            <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`} class="value">{CONTACT_PHONE}</a>
          </div>
          <div class="row">
            <span class="label">Location</span>
            <span class="value">[Transcribe location from reference]</span>
          </div>
        </div>
      </div>

      <div class="right">
        <ContactForm />
      </div>
    </div>
  </div>
</section>

<style>
  /* Transcribe the .contact-section (or equivalent) CSS from the
     reference HTML. Notable: dark charcoal background, parchment text,
     two-column at ≥880px, hairline rules between contact rows, white-ish
     form card on the right. */
</style>
```

- [ ] **Step 3: Add the import and section to `src/pages/index.astro` (above `<SiteFooter />`)**

```astro
import ContactSection from "../components/ContactSection.astro";
```

```astro
<ContactSection />
```

- [ ] **Step 4: Visually verify**

```bash
npm run dev
```

Confirm contact section renders on charcoal with the form on the right and contact rows on the left. Submit the form (with a real Web3Forms key in `.env`) — confirm the success card replaces the form. If the key is still a placeholder, submitting should show the error message instead of the success card (that's acceptable verification that the error path works).

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactSection.astro src/pages/index.astro
git commit -m "feat: add ContactSection wrapping ContactForm"
```

---

### Task 19: Final landing-page polish pass

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update the page title and description**

Replace the placeholder props on `<BaseLayout>`:

```astro
<BaseLayout
  title="Lantern Strategic — Helping businesses move forward when the path isn't obvious."
  description="Operations & technology consulting for owners and operators navigating the unnoticed friction slowing their business down."
>
```

- [ ] **Step 2: Verify smooth-scroll offset for anchor links**

The reference HTML uses `scroll-margin-top: 90px` on anchor targets to compensate for the sticky nav. Confirm `src/styles/global.css` (or the specific page style) sets this on `[id]` selectors. If missing, add to `global.css`:

```css
:where(section[id], div[id]) {
  scroll-margin-top: 90px;
}
```

- [ ] **Step 3: Final visual diff**

```bash
npm run dev
```

Open `http://localhost:4321/` in one tab and `design-source/designs/Landing Page.html` (open the file directly) in another. Compare section by section at three widths: 1440px, 880px, and 375px. Note any visual deltas and fix them in the corresponding components. Stop dev server.

- [ ] **Step 4: Commit any polish fixes**

```bash
git add -u
git commit -m "feat: landing page final visual pass"
```

(Skip the commit if no fixes were needed.)

---

## Phase 5 — Diagnostics Page

### Task 20: Create `src/data/diagnostics.ts`

**Files:**
- Create: `src/data/diagnostics.ts`

- [ ] **Step 1: Open `design-source/designs/Diagnostics.html` and locate the three diagnostic blocks** (`#risk`, `#sensing`, `#antifragile`). For each, extract:
- Numeral (01 / 02 / 03)
- Title
- Time
- Best-for
- "Question it asks" pullquote
- Body paragraphs
- Domain chip labels
- Download href (placeholder for now — use `/diagnostics/risk-velocity.pdf`, `/diagnostics/sensing.pdf`, `/diagnostics/antifragile.pdf`)

- [ ] **Step 2: Write the data module**

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

export const diagnostics: Diagnostic[] = [
  {
    id: "risk-velocity",
    num: "01",
    title: "[Transcribe title from Diagnostics.html]",
    time: "[Transcribe time value]",
    bestFor: "[Transcribe best-for value]",
    question: "[Transcribe 'question it asks' pullquote]",
    paragraphs: [
      "[Body paragraph 1]",
      "[Body paragraph 2]",
    ],
    domains: ["[chip 1]", "[chip 2]", "[chip 3]"],
    downloadHref: "/diagnostics/risk-velocity.pdf",
  },
  {
    id: "sensing",
    num: "02",
    title: "[Transcribe title]",
    time: "[time]",
    bestFor: "[best-for]",
    question: "[question]",
    paragraphs: ["[Body 1]", "[Body 2]"],
    domains: ["[chip 1]", "[chip 2]", "[chip 3]"],
    downloadHref: "/diagnostics/sensing.pdf",
  },
  {
    id: "antifragile",
    num: "03",
    title: "[Transcribe title]",
    time: "[time]",
    bestFor: "[best-for]",
    question: "[question]",
    paragraphs: ["[Body 1]", "[Body 2]"],
    domains: ["[chip 1]", "[chip 2]", "[chip 3]"],
    downloadHref: "/diagnostics/antifragile.pdf",
  },
];
```

Replace every bracketed placeholder with the real text from the reference HTML.

- [ ] **Step 3: Verify type-check passes**

```bash
npx astro check
```

- [ ] **Step 4: Commit**

```bash
git add src/data/diagnostics.ts
git commit -m "feat: add typed diagnostics content data"
```

---

### Task 21: Create `DiagHero.astro`

**Files:**
- Create: `src/components/DiagHero.astro`

- [ ] **Step 1: Locate the diagnostics hero in the reference HTML.** Text-left layout, lantern stamp partially bleeding off the right edge (`right: clamp(-180px, -8vw, -60px)`, `width: clamp(280px, 36vw, 520px)`, `opacity: .12–.14`). `overflow: hidden` on `.hero`, `position: relative; z-index: 1` on `.hero-inner`. Two-column inner grid: copy left, meta panel right with four key/value rows (Time / Best for / Format / Cost). Headline has crimson italic accent on "already knows."

- [ ] **Step 2: Write the component**

```astro
---
---
<section class="diag-hero">
  <div class="hero-inner">
    <div class="copy">
      <span class="eyebrow"><span class="rule"></span>The Lantern Diagnostics</span>
      <h1>
        [Transcribe headline. Wrap the
        <em class="crimson">crimson italic accent</em>
        around the words that get it in the reference]
      </h1>
      <p class="lede">[Transcribe lede paragraph]</p>
    </div>

    <aside class="meta">
      <dl>
        <div><dt>Time</dt><dd>[Time value]</dd></div>
        <div><dt>Best for</dt><dd>[Best for value]</dd></div>
        <div><dt>Format</dt><dd>[Format value]</dd></div>
        <div><dt>Cost</dt><dd>[Cost value]</dd></div>
      </dl>
    </aside>
  </div>
  <img src="/images/lantern-stamp.png" alt="" class="watermark" aria-hidden="true" />
</section>

<style>
  /* Transcribe the diagnostics hero CSS from
     design-source/designs/Diagnostics.html — including the
     `overflow: hidden`, `position: relative`, watermark positioning,
     two-column inner grid, and meta panel rules. */
</style>
```

Fill in copy and meta values from the reference.

- [ ] **Step 3: Build verification**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/DiagHero.astro
git commit -m "feat: add DiagHero with bleed watermark"
```

---

### Task 22: Create `DiagIndexStrip.astro`

**Files:**
- Create: `src/components/DiagIndexStrip.astro`

- [ ] **Step 1: Locate the index strip in the reference HTML.** A parchment-2 horizontal band with three quick-jump anchor links prefixed by serif crimson numerals.

- [ ] **Step 2: Write the component**

```astro
---
import { diagnostics } from "../data/diagnostics";
---
<nav class="diag-index" aria-label="Diagnostics index">
  <ul>
    {diagnostics.map((d) => (
      <li>
        <a href={`#${d.id}`}>
          <span class="num">{d.num}</span>
          <span class="title">{d.title}</span>
        </a>
      </li>
    ))}
  </ul>
</nav>

<style>
  /* Transcribe the index-strip styles from
     design-source/designs/Diagnostics.html — parchment-2 band,
     serif crimson numerals, horizontal layout at ≥880px (stacked below).
  */
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DiagIndexStrip.astro
git commit -m "feat: add DiagIndexStrip nav"
```

---

### Task 23: Create `DiagBlock.astro`

**Files:**
- Create: `src/components/DiagBlock.astro`

- [ ] **Step 1: Locate one of the three diagnostic blocks in the reference HTML (`#risk`, `#sensing`, or `#antifragile`).** All three share the same structure:
- Two-column at ≥880px
- Left: huge serif numeral (96px on desktop) + h2 + metadata card (parchment background, stone border, 3px crimson rule along the left edge) with Time + Best-for rows
- Right: serif "question it asks" pullquote with crimson italic emphasis, two body paragraphs, domain chips (warm-blush pill, crimson text), and a "Download the diagnostic" CTA with "PDF · fillable · 15 minutes" caption
- Blocks separated by stone-colored top border

- [ ] **Step 2: Write the component**

```astro
---
import type { Diagnostic } from "../data/diagnostics";
import Button from "./Button.astro";

interface Props {
  diagnostic: Diagnostic;
}

const { diagnostic: d } = Astro.props;
---
<article id={d.id} class="diag-block">
  <div class="left">
    <span class="num">{d.num}</span>
    <h2>{d.title}</h2>
    <aside class="meta-card">
      <div class="row">
        <span class="label">Time</span>
        <span class="value">{d.time}</span>
      </div>
      <div class="row">
        <span class="label">Best for</span>
        <span class="value">{d.bestFor}</span>
      </div>
    </aside>
  </div>

  <div class="right">
    <p class="question">
      <em>{d.question}</em>
    </p>
    {d.paragraphs.map((p) => <p>{p}</p>)}
    <ul class="chips">
      {d.domains.map((c) => <li>{c}</li>)}
    </ul>
    <div class="download">
      <Button
        href={d.downloadHref}
        arrow
        external={false}
        class="download-btn"
      >
        Download the diagnostic
      </Button>
      <p class="caption">PDF · fillable · 15 minutes</p>
    </div>
  </div>
</article>

<style>
  /* Transcribe the diagnostic-block styles from the reference HTML:
     - `.diag-block` two-column grid at ≥880px
     - huge serif numeral
     - `.meta-card` with 3px crimson left rule
     - `.question` pullquote with crimson italic
     - `.chips` warm-blush pills with crimson text, 6px×12px padding, fully rounded
     - download button + caption
     - top border between blocks. */
</style>
```

Cross-check the actual `download` link attribute the reference uses (`data-download="risk-velocity"` etc.) — if it's also there as a download link with that attribute, include it. Most browsers should download a `.pdf` link from a normal `<a>` automatically; the `download` attribute on the anchor forces it. The current `<Button>` component doesn't pass through arbitrary attributes — if a `download` attribute is needed, extend `Button.astro`'s props to accept it.

- [ ] **Step 3: Build verification**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/DiagBlock.astro src/components/Button.astro
git commit -m "feat: add DiagBlock for individual diagnostics"
```

(Include `Button.astro` in the commit only if you modified it to support extra attributes.)

---

### Task 24: Create `InviteBlock.astro`

**Files:**
- Create: `src/components/InviteBlock.astro`

- [ ] **Step 1: Locate the `#talk` invitation section at the bottom of the reference Diagnostics HTML.** Same dark-section pattern as landing-page contact. Left column: eyebrow ("If something surfaces"), h2 ("Forty-five minutes. Coffee, cocktails, lunch, or virtual."), serif lede, two body paragraphs, two CTAs (primary Calendly + ghost "Learn more about Lantern Strategic" linking to `/#about`). Right column: same chambray-shirt headshot, 4:5 aspect.

- [ ] **Step 2: Write the component**

```astro
---
import { Image } from "astro:assets";
import { CALENDLY_URL } from "../config";
import Button from "./Button.astro";
import zachCasual from "../../public/images/zach-casual.jpg";
---
<section id="talk" class="invite-block">
  <div class="container">
    <div class="grid">
      <div class="left">
        <span class="eyebrow"><span class="rule"></span>If something surfaces</span>
        <h2>Forty-five minutes. Coffee, cocktails, lunch, or virtual.</h2>
        <p class="lede">[Transcribe lede from reference]</p>
        <p>[Body 1]</p>
        <p>[Body 2]</p>
        <div class="ctas">
          <Button href={CALENDLY_URL} external arrow>Grab 45 minutes</Button>
          <Button href="/#about" variant="ghost">Learn more about Lantern Strategic</Button>
        </div>
      </div>
      <div class="right">
        <Image
          src={zachCasual}
          alt="Zach Nelson"
          widths={[320, 460, 920]}
          sizes="(min-width: 880px) 460px, 100vw"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</section>

<style>
  /* Transcribe the #talk / .invite-block styles from
     design-source/designs/Diagnostics.html. Charcoal background,
     parchment text, two-column at ≥880px, photo 4:5 aspect. */
</style>
```

- [ ] **Step 3: Build verification**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/InviteBlock.astro
git commit -m "feat: add InviteBlock dark CTA section"
```

---

### Task 25: Assemble `src/pages/diagnostics.astro`

**Files:**
- Create: `src/pages/diagnostics.astro`

- [ ] **Step 1: Write the page**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SiteNav from "../components/SiteNav.astro";
import SiteFooter from "../components/SiteFooter.astro";
import DiagHero from "../components/DiagHero.astro";
import DiagIndexStrip from "../components/DiagIndexStrip.astro";
import DiagBlock from "../components/DiagBlock.astro";
import InviteBlock from "../components/InviteBlock.astro";
import { diagnostics } from "../data/diagnostics";
---
<BaseLayout
  title="The Lantern Diagnostics — Lantern Strategic"
  description="Three short diagnostics — operational risk, sensing & feedback, antifragility — designed to surface what your business already knows."
>
  <SiteNav />
  <DiagHero />
  <DiagIndexStrip />
  <main>
    {diagnostics.map((d) => <DiagBlock diagnostic={d} />)}
  </main>
  <InviteBlock />
  <SiteFooter />
</BaseLayout>

<style>
  main {
    background: var(--color-parchment);
    padding: clamp(72px, 8vw, 120px) 0;
  }
</style>
```

- [ ] **Step 2: Visually verify against the reference**

```bash
npm run dev
```

Open `http://localhost:4321/diagnostics` and `design-source/designs/Diagnostics.html` side by side. Walk through the page at 1440, 880, and 375px widths. Stop dev server.

- [ ] **Step 3: Verify the Diagnostics link in the nav gets `aria-current="page"` and a crimson underline (per the design handoff README).** This requires the `SiteNav` component to be aware of the current path. Two options:
1. Add an `Astro.url.pathname` check inside `SiteNav.astro`. Recommended.
2. Use the `aria-current` selector in CSS to style the active link.

To implement option 1, modify `SiteNav.astro`:

```astro
---
import { CALENDLY_URL, NAV_LINKS } from "../config";
const currentPath = Astro.url.pathname;
---
```

In the markup for each link, add:

```astro
<li>
  <a
    href={link.href}
    aria-current={link.href === currentPath ? "page" : undefined}
  >
    {link.label}
  </a>
</li>
```

And in `SiteNav.astro`'s `<style>` block, add:

```css
.nav-links a[aria-current="page"] {
  color: var(--color-crimson);
  border-bottom: 2px solid var(--color-crimson);
}
```

The Diagnostics page isn't in `NAV_LINKS` (only Approach / Engagements / About / Contact are). The README says "The 'Diagnostics' link gets `aria-current='page'`" — implying there should be a Diagnostics link in the nav on this page. Add Diagnostics to the nav by either:
- Appending `{ href: "/diagnostics", label: "Diagnostics" }` to `NAV_LINKS` in `src/config.ts` (it will then appear on every page)
- Or adding a conditional link in `SiteNav.astro` that only appears when on `/diagnostics`

Recommend the first (consistent navigation across pages).

- [ ] **Step 4: Commit**

```bash
git add src/pages/diagnostics.astro src/components/SiteNav.astro src/config.ts
git commit -m "feat: assemble diagnostics page and add active-link state"
```

---

## Phase 6 — Placeholder Pages

### Task 26: Create `privacy-policy.astro` and `terms.astro` stubs

**Files:**
- Create: `src/pages/privacy-policy.astro`, `src/pages/terms.astro`

- [ ] **Step 1: Write `src/pages/privacy-policy.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SiteNav from "../components/SiteNav.astro";
import SiteFooter from "../components/SiteFooter.astro";
---
<BaseLayout
  title="Privacy Policy — Lantern Strategic"
  description="Privacy Policy for Lantern Strategic."
>
  <SiteNav />
  <main class="placeholder">
    <div class="container">
      <span class="eyebrow"><span class="rule"></span>Legal</span>
      <h1>Privacy Policy</h1>
      <p>Coming soon. In the meantime, reach out via the contact form on the <a href="/#contact">home page</a>.</p>
    </div>
  </main>
  <SiteFooter />
</BaseLayout>

<style>
  .placeholder {
    background: var(--color-parchment);
    padding: clamp(120px, 12vw, 180px) 0;
    min-height: 60vh;
  }
  .container {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 var(--gutter);
  }
  .eyebrow {
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-warm-gray);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .rule { display: inline-block; width: 28px; height: 1px; background: currentColor; }
  h1 {
    font-family: var(--font-display);
    font-size: clamp(40px, 6.4vw, 84px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.022em;
    margin: 0 0 24px;
  }
</style>
```

- [ ] **Step 2: Write `src/pages/terms.astro`** — same structure as above, with `title="Terms of Service — Lantern Strategic"` and an h1 of `Terms of Service`.

- [ ] **Step 3: Verify both render**

```bash
npm run dev
```

Open `http://localhost:4321/privacy-policy` and `http://localhost:4321/terms`. Confirm both render and the footer's "Privacy Policy" and "Terms of Service" links navigate correctly. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy-policy.astro src/pages/terms.astro
git commit -m "feat: add privacy and terms placeholder pages"
```

---

## Phase 7 — Docker Deployment

### Task 27: Create the production Dockerfile and Caddyfile

**Files:**
- Create: `Dockerfile`, `Caddyfile`, `.dockerignore`

- [ ] **Step 1: Write `.dockerignore`**

```
node_modules
dist
.git
.env
.env.local
.env.production
design-source
docs
README.md
*.md
.claude
.vscode
.idea
```

- [ ] **Step 2: Write `Caddyfile`**

```
:80 {
    root * /srv
    file_server
    encode gzip

    @notFound {
        not file
    }
    handle @notFound {
        rewrite * /404.html
        file_server
    }

    header /assets/* Cache-Control "public, max-age=31536000, immutable"
    header * Cache-Control "public, max-age=300"
}
```

Notes:
- Listening on `:80` only; Traefik handles SSL upstream.
- `/assets/*` cache-busted by Astro's hashed filenames, so safe to cache for a year.
- Other resources (HTML) get 5-minute cache.
- 404 falls back to `/404.html` — Astro auto-generates this if you add `src/pages/404.astro`. Skipping that for now; the fallback rewrite will 404-loop if the file doesn't exist. To avoid that, add a basic `404.astro` page in a follow-up task, or remove the `handle @notFound` block until then. **For this task, remove the `handle @notFound` block** to avoid the loop:

```
:80 {
    root * /srv
    file_server
    encode gzip

    header /assets/* Cache-Control "public, max-age=31536000, immutable"
    header * Cache-Control "public, max-age=300"
}
```

- [ ] **Step 3: Write `Dockerfile`**

```dockerfile
# Stage 1 — build the static site
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public

# PUBLIC_WEB3FORMS_ACCESS_KEY must be set at build time to be inlined
# into the static JS. Pass via `docker build --build-arg`.
ARG PUBLIC_WEB3FORMS_ACCESS_KEY
ENV PUBLIC_WEB3FORMS_ACCESS_KEY=$PUBLIC_WEB3FORMS_ACCESS_KEY

RUN npm run build

# Stage 2 — serve with Caddy
FROM caddy:alpine
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
```

Note: Astro inlines `PUBLIC_*` env vars at build time, not runtime. The Web3Forms key must be passed as a `--build-arg`, not a `docker run -e` env var.

- [ ] **Step 4: Build the image locally**

```bash
docker build \
  --build-arg PUBLIC_WEB3FORMS_ACCESS_KEY=$(grep PUBLIC_WEB3FORMS_ACCESS_KEY .env | cut -d= -f2) \
  -t lantern-strategic:latest .
```

Expected: build succeeds. Final image is ~50–70MB.

- [ ] **Step 5: Run the image and verify**

```bash
docker run -d -p 8080:80 --name lantern-test lantern-strategic:latest
```

Then in another shell:

```bash
curl -sI http://localhost:8080/ | head -5
curl -s http://localhost:8080/ | head -30
curl -sI http://localhost:8080/diagnostics | head -5
curl -sI http://localhost:8080/privacy-policy | head -5
curl -sI http://localhost:8080/terms | head -5
```

Expected: all return `HTTP/1.1 200 OK`. The body of the homepage should contain `Lantern Strategic` and the brand markup.

- [ ] **Step 6: Open `http://localhost:8080/` in a browser** and walk through both pages. Confirm the site behaves identically to `npm run dev`.

- [ ] **Step 7: Tear down the test container**

```bash
docker stop lantern-test
docker rm lantern-test
```

- [ ] **Step 8: Commit**

```bash
git add Dockerfile Caddyfile .dockerignore
git commit -m "feat: add Docker build with Caddy static-serve container"
```

---

### Task 28: Final cross-browser and responsive QA pass

**Files:** none

- [ ] **Step 1: Run a full production build and serve it**

```bash
npm run build
npm run preview
```

- [ ] **Step 2: Walk through both pages at three viewport widths** — 375px (mobile), 880px (tablet boundary), 1440px (desktop). Check:
- Sticky nav scroll state activates
- Mobile menu opens/closes
- All anchor links land at the correct offset under the nav
- Hero stamp renders without overflow on mobile
- Engagement cards lift on hover at wide widths
- Contact form: all fields focus correctly, validation triggers, submit produces success or error state
- Diagnostics page: index strip links jump to correct blocks
- Footer year displays the current year (2026)
- All Calendly buttons open in a new tab

- [ ] **Step 3: Note any deltas in a follow-up issue list** — don't block on small visual differences; commit fixes for anything significant inline.

- [ ] **Step 4: Final commit (if anything was fixed)**

```bash
git add -u
git commit -m "fix: final responsive and behavior QA fixes"
```

(Skip if no fixes were needed.)

---

## Out of Scope (for this plan)

- Playwright visual-regression suite — deferred until the port is functionally complete; the design handoff README has the recipe to add it later.
- Real legal copy for `/privacy-policy` and `/terms` — Zach will write these later.
- Real PDF files for the three diagnostic downloads — Zach will provide; until then the download links 404. No further code change needed when the PDFs arrive — just drop them into `public/diagnostics/` with the matching filenames (`risk-velocity.pdf`, `sensing.pdf`, `antifragile.pdf`).
- Hosting setup on the Hostinger Docker host with Traefik labels — orchestration config lives outside this repo per the user's existing Traefik setup.
- Optional stock photography — deferred per the design handoff.
- Web-based diagnostic surveys — out of scope; will require adding `astro add vue` and a separate plan when those exist.

---

## Self-Review Notes (for the plan author, not for execution)

Spec coverage: every section of `docs/superpowers/specs/2026-05-12-astro-setup-design.md` maps to one or more tasks above. The contact-email/phone placeholders flagged in the spec's Open Questions are resolved during Task 6 (config.ts) by transcribing from the reference HTML. The Astro `<Image>` vs plain `<img>` distinction (spec §"Images") is enforced in Task 16 (AboutBlock) and Task 24 (InviteBlock).

Placeholder scan: there are intentional `[Transcribe ...]` markers in component tasks, each of which is bounded to a specific section of the reference HTML and resolved by reading that section. These are not "TBD" — they're "transcribe verbatim from this exact source." The plan does not contain "TBD", "implement later", or "handle appropriately" anywhere.

Type consistency: `Diagnostic` type (Task 20) → consumed by `DiagBlock` (Task 23) → mapped over in `diagnostics.astro` (Task 25). `NAV_LINKS` (Task 6) → consumed in `SiteNav` (Task 11). `CALENDLY_URL` and contact info (Task 6) → consumed in `Hero`, `EngagePanel`, `InviteBlock`, `SiteFooter`, `ContactSection`. All identifiers are consistent across tasks.
