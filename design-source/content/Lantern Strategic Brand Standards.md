# Lantern Strategic Brand Standards

_Republic Insights, LLC dba Lantern Strategic_

## Logo

**Style:** Vintage stamp/seal with kerosene lantern illustration **Format on file:** `LS-Square.png` (square format) **Character:** Authoritative, craft-forward, not corporate

### Logo Usage Notes

- Works best on white or very light backgrounds
- Monochromatic by nature — no color variants needed
- The distressed/textured quality is intentional; do not clean it up

---

## Colors

### Brand Primary

|Token|Hex|Usage|
|---|---|---|
|Crimson|`#761215`|Primary brand color, headers, strong accents|

### Extended Palette

|Token|Hex|Usage|
|---|---|---|
|Deep Crimson|`#4d0b0d`|Dark backgrounds, hover states, depth|
|Ember|`#a01a1e`|Hover states, secondary accents|
|Rust|`#c4403a`|Lighter accent, highlights|
|Warm Blush|`#f5e6e6`|Light backgrounds, card fills|
|Parchment|`#faf6f0`|Page background (warm off-white)|
|Charcoal|`#2a2421`|Body text (warm-tinted dark)|
|Warm Gray|`#7a6e6b`|Secondary text, captions|
|Stone|`#e8e0dc`|Borders, dividers, subtle UI|

### Quick Reference — Element Mapping

|Element|Color|
|---|---|
|Primary buttons|`#761215`|
|Button hover|`#4d0b0d`|
|Headers / Hero|`#761215`|
|Body text|`#2a2421`|
|Page background|`#faf6f0`|
|Card backgrounds|`#f5e6e6`|
|Borders / dividers|`#e8e0dc`|
|Secondary text|`#7a6e6b`|

### Color Notes

- Palette is intentionally warm throughout — cool grays would fight the crimson
- Parchment background (`#faf6f0`) reinforces the vintage/craft aesthetic of the logo
- No blue accent — keep the brand monochromatic crimson to maintain distinctiveness

---

## Typography

_To be finalized — recommendations below pending selection._

|Role|Font|Weights|Notes|
|---|---|---|---|
|Headings|TBD|—|Consider a serif or slab-serif to match stamp aesthetic|
|Body|TBD|—|Readable sans-serif or warm serif|

### Typography Direction

The vintage stamp logo suggests headings could support a **serif or condensed serif** (e.g., Playfair Display, Libre Baskerville, or Roboto Condensed) rather than a geometric sans. Body text should stay clean and readable regardless of heading choice.

---

## CSS Variables Snippet

```css
:root {
  /* Lantern Strategic Brand Colors */
  --color-crimson:     #761215;
  --color-deep-crimson: #4d0b0d;
  --color-ember:       #a01a1e;
  --color-rust:        #c4403a;
  --color-warm-blush:  #f5e6e6;
  --color-parchment:   #faf6f0;
  --color-charcoal:    #2a2421;
  --color-warm-gray:   #7a6e6b;
  --color-stone:       #e8e0dc;
}
```

## Tailwind Config Tokens

```js
// tailwind.config.mjs
colors: {
  'crimson':      '#761215',
  'deep-crimson': '#4d0b0d',
  'ember':        '#a01a1e',
  'rust':         '#c4403a',
  'warm-blush':   '#f5e6e6',
  'parchment':    '#faf6f0',
  'charcoal':     '#2a2421',
  'warm-gray':    '#7a6e6b',
  'stone':        '#e8e0dc',
}
```

## Stack Context

Built for **Nuxt 4 + Tailwind CSS + Nuxt UI** projects.

---

## Brand Links

- Site: [lanternstrategic.com](https://lanternstrategic.com/)
- Parent entity: Republic Insights, LLC (EIN 45-3026066)
- Publication: _Beyond the Plateau_ (consulting thought leadership)