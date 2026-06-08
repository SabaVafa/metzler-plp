# Metzler Design System — Developer Reference

> \\\*\\\*Purpose:\\\*\\\* Paste this file into Claude AI as project context. Every rule is unambiguous and copy-paste ready.

\---

## 1\. Overview

**What:** The Metzler Design System is a single-source-of-truth UI library for all Metzler digital products (e-commerce, configurators, catalog pages, landing pages).

**Who:** Front-end developers and Claude AI sessions building or extending Metzler products.

**Stack:** React 18 + Babel Standalone (single-file `index.html`). All components use inline React styles or plain CSS class names. No external CSS framework. Font: `'Helvetica Neue', Helvetica, Arial, sans-serif`.

**Base:** `16px = 1rem`. All values in rem — never px in output code.

\---

## 2\. Color Tokens

Never hardcode hex. Reference tokens by name. All hex values are listed for lookup only.

### Teal Tones

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Teal 50|`#F2F6F6`|242 · 246 · 246|Subtle brand-tinted backgrounds, selected row highlight, hover row|
|Teal 75|`#E3F2F0`|227 · 242 · 240|Button hover fills, active list row, light teal accent surfaces, section backgrounds|
|Teal 100|`#E6EEEE`|230 · 238 · 238|Info box fills, selected filter chip, tooltip backgrounds|
|**Teal 500** *(default)*|`#015253`|1 · 82 · 83|CTAs, nav, active states, focus rings, links — **the single brand anchor**|
|Teal 600|`#014A4B`|1 · 74 · 75|Hover/pressed state for any teal interactive element|
|Teal 700|`#013E3E`|1 · 62 · 62|High-contrast icons, focus rings on light bg, accessible text on Teal 50/100|
|Teal 900|`#001D1D`|0 · 29 · 29|Footer background (dark footer), maximum-contrast text on teal surfaces|

### Brand

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Metzler Rot|`#D42924`|212 · 41 · 36|Logo M-square, discount badge (–10%) on product cards. **Never for CTAs, body text, or large fills**|
|Digital Schwarz|`#1A171B`|26 · 23 · 27|Product titles, page headings, "METZLER" wordmark, table rules, icon fills|

### Green

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Green / Select|`#009951`|0 · 153 · 81|In-stock badge, success alert/toast, checkbox (Configurator variant), radio active, textfield active/done border|
|Green 50%|`rgba(0,153,81,0.5)`|—|Muted in-stock, disabled selected checkboxes, greyed-out availability indicators|

### Red Tones

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Red 50|`#FFF1F1`|255 · 241 · 241|Alert/error background fills, validation row tints|
|**Red 500** *(default)*|`#C90000`|201 · 0 · 0|Sale prices, error text, error badges, error borders. **Never on CTA buttons**|
|Red 600|`#A30000`|163 · 0 · 0|Hover/pressed state for any red interactive element|
|Red 900|`#4A0000`|74 · 0 · 0|Readable text on Red 50 alert surfaces (error messages, alert body text)|

### Yellow

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Star Yellow|`#FFC041`|255 · 192 · 65|Review star fill on product cards, PDP rating bars, order confirmation star rating|

### Graphite Surfaces

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Paper White (Graphite 50)|`#F5F6FA`|245 · 246 · 250|Page background, sidebar, search bar pill|
|Graphite 100|`#F0F0F0`|240 · 240 · 240|Row dividers, inactive tabs, skeletons, badges|
|Graphite 200|`#E6E6E8`|230 · 230 · 232|Hairline separators in lists|
|Graphite 300|`#DADADA`|218 · 218 · 218|Default input borders, card outlines, swatches|
|Graphite 400|`#BFBFC2`|191 · 191 · 194|Focused borders, table outline, selected ring|

### Graphite Text

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Graphite 500|`#A1A1A1`|161 · 161 · 161|Placeholder text, disabled labels, inactive icons|
|Graphite 600|`#7A7A82`|122 · 122 · 130|Metadata, captions, "in stock", timestamps|
|Graphite 700|`#54545C`|84 · 84 · 92|Secondary text, helper text, secondary nav|
|Graphite 800|`#2E2E36`|46 · 46 · 54|Body paragraphs, primary nav, input values|
|Graphite 900|`#1A1A1F`|26 · 26 · 31|Headings, product names, prices|

### Graphite Overlays

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|True Black|`#000000`|0 · 0 · 0|Logo, primary CTA, "Add to cart"|
|Pure White|`#FFFFFF`|255 · 255 · 255|Card backgrounds, modal surfaces, button labels on teal/dark, icon fill on teal|
|White 50%|`rgba(255,255,255,0.5)`|—|Footer accordion labels, footer nav text, top-bar secondary text on teal|

### Accent

|Token Name|Hex|RGB|Usage Rule|
|-|-|-|-|
|Teal Mint|`#5CDBD3`|92 · 219 · 211|Hyperlinks on dark/teal backgrounds, hover colour for footer nav links|

\---

## 3\. Border Radius Tokens

5 tokens. Default is `border-radius` (4px). Never use other values without a token.

|Variable|rem|px|Used For|
|-|-|-|-|
|`border-radius-sm`|`0.125rem`|2px|Badges|
|`border-radius` *(default)*|`0.25rem`|4px|Buttons, pagination, navigation arrows, checkboxes, text fields, inputs|
|`border-radius-lg`|`0.5rem`|8px|Product cards, filter sections|
|`border-radius-xl`|`0.75rem`|12px|Popups, modals|
|`border-radius-pill`|`624.94rem`|9999px|Pill shape / fully rounded elements|

\---

## 4\. Typography

**Font family (all components):** `'Helvetica Neue', Helvetica, Arial, sans-serif`

**Base:** 16px = 1rem. All sizes in rem.

### Fluid / Responsive — landing \& editorial

|Name|rem / clamp|Weight|Line Height|Token|Used For|
|-|-|-|-|-|-|
|Display 1|`clamp(3rem, 9vw, 8rem)`|700|0.85|`--display-1`|Landing hero heading|
|Display 2|`clamp(3rem, 7vw, 6rem)`|700|0.95|`--display-2`|Section feature titles|
|Display 3|`clamp(2rem, 5vw, 4.5rem)`|700|1.05|`--display-3`|Landing intro / large body|
|Display 4|`2.875rem`|700|1.15|`--display-4`|Landing hero|

### Headings — page \& section structure

|Name|rem|px|Weight|Line Height|Token|Used For|
|-|-|-|-|-|-|-|
|H1|`1.875rem`|30px|700|1.25|`--text-h1`|Page title|
|H2|`1.5rem`|24px|700|1.3|`--text-h2`|Section heading|
|H3|`1.25rem`|20px|700|1.35|`--text-h3`|Card \& drawer titles|
|H4|`1.125rem`|18px|700|1.375|`--text-h4`|List items, panels|

### Body — reading \& content

|Name|rem|px|Weight|Line Height|Token|Used For|
|-|-|-|-|-|-|-|
|Body Regular|`1rem`|16px|400|1.5|`--text-body`|Default everywhere|
|Body Medium|`1rem`|16px|500|1.5|`--text-body-medium`|Emphasis, UI text|
|Body Bold|`1rem`|16px|700|1.375|`--text-body-bold`|Strong emphasis|
|Body SM Regular|`0.875rem`|14px|400|1.5|`--text-body-sm`|Sidebars, cards|
|Body SM Medium|`0.875rem`|14px|500|1.5|`--text-body-sm-medium`|Labels, nav items|
|Body SM Bold|`0.875rem`|14px|700|1.375|`--text-body-sm-bold`|Small labels|
|Caption Regular|`0.75rem`|12px|400|1.4|`--text-caption`|Helper text, metadata, timestamps|
|Caption Medium|`0.75rem`|12px|500|1.4|`--text-caption-medium`|Tags, badges|
|Caption Bold|`0.75rem`|12px|700|1.4|`--text-caption-bold`|Small badges|

\---

## 5\. Spacing \& Sizing

**Base unit:** `1rem = 16px`. All spacing in rem.

### Common spacing scale

|rem|px|
|-|-|
|`0.125rem`|2px|
|`0.25rem`|4px|
|`0.5rem`|8px|
|`0.75rem`|12px|
|`0.875rem`|14px|
|`1rem`|16px|
|`1.25rem`|20px|
|`1.5rem`|24px|
|`2rem`|32px|

### Button heights

|Size|Class|Height|Font size|Weight|
|-|-|-|-|-|
|Large|`.btn-lg`|`3.125rem` (50px)|`1.1rem`|600|
|Medium (default)|—|`2.625rem` (42px)|`1rem`|500|
|Small|`.btn-sm`|`2.1875rem` (35px)|`0.9rem`|400|

### Button padding

|Size|Padding|
|-|-|
|`.btn` (all)|`0.7rem 1.2rem`|
|`.btn-dark`, `.btn-dark-outline`|`0.875rem 1.75rem`|

### Input padding

|Class|Padding|Font size|
|-|-|-|
|`.form-control-lg`|`0.8rem 1rem`|`1.125rem`|
|`.form-control` (default)|`0.7rem 0.9375rem`|`1rem`|
|`.form-control-sm`|`0.35rem 0.75rem`|`0.875rem`|

\---

## 6\. Components

### Buttons

**Class base:** `.btn`

**Variants:** `.btn-primary`, `.btn-secondary`, `.btn-proceed`, `.btn-white`, `.btn-dark`, `.btn-dark-outline`, `.btn-block`

**Sizes:** `.btn-lg`, `.btn-sm` (no modifier = medium)

**When to use:**

* `.btn-primary` / `.btn-proceed` — main CTA, "Add to cart", form submit
* `.btn-secondary` — secondary action alongside primary (e.g., Cancel)
* `.btn-white` — on dark or colored section backgrounds
* `.btn-dark` / `.btn-dark-outline` — exclusively on dark hero or image backgrounds; uppercase, wide letter-spacing
* `.btn-block` — full-width button in forms or mobile contexts

**When NOT to use:**

* Never use red (`#C90000`) on any button variant — red triggers purchase anxiety
* Never use `.btn-dark` or `.btn-dark-outline` on white/light backgrounds

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.625rem;
  padding: .7rem 1.2rem;
  border-radius: 0.25rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.btn-lg    { font-size: 1.1rem; font-weight: 600; }
.btn-sm    { font-size: 0.9rem; font-weight: 400; }
.btn-block { display: flex; text-align: center; width: 100%; }

.btn-primary,
.btn-proceed { background: #015253; color: #fff; border: none; }
.btn-primary:hover,  .btn-proceed:hover  { background: #014A4B; }
.btn-primary:active, .btn-proceed:active { background: #013E3E; }
.btn-primary:disabled, .btn-proceed:disabled { background: #A1A1A1; cursor: default; }

.btn-secondary { background: transparent; color: #015253; border: 0.125rem solid #015253; }
.btn-secondary:hover  { background: #E6EEEE; }
.btn-secondary:active { background: #015253; color: #fff; }
.btn-secondary:disabled { color: #A1A1A1; border-color: #A1A1A1; cursor: default; }

.btn-white { background: transparent; color: #fff; border: 0.125rem solid #fff; }
.btn-white:hover  { background: rgba(255,255,255,0.1); }
.btn-white:active { background: #fff; color: #015253; border-color: #fff; }
.btn-white:disabled { color: rgba(255,255,255,0.35); border-color: rgba(255,255,255,0.25); cursor: default; }

/\\\* Dark / Hero variants — use ONLY on dark or image backgrounds \\\*/
.btn-dark,
.btn-dark-outline {
  padding: 0.875rem 1.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  transition: opacity 0.2s, border-color 0.3s, background 0.3s;
}
.btn-dark { background: #015253; color: #fff; border: none; }
.btn-dark:hover  { opacity: 0.85; }
.btn-dark:disabled { background: rgba(1,82,83,0.4); color: rgba(255,255,255,0.5); cursor: default; }

.btn-dark-outline { background: transparent; color: #fff; border: 0.0625rem solid #fff; }
.btn-dark-outline:hover  { border-color: #015253; background: rgba(255,255,255,0.05); }
.btn-dark-outline:disabled { color: rgba(255,255,255,0.35); border-color: rgba(255,255,255,0.25); cursor: default; }
```

#### .btn-proceed — directional CTA with arrow

Same fill as `.btn-primary`. Always includes a right-pointing SVG arrow icon. The icon is inline, sourced from the Icons page — never a custom SVG.

```html
<button class="btn btn-proceed">
  Weiter
  <svg width="12" height="10" viewBox="0 0 14 12" fill="none">
    <path d="M1 6h12M7 1l6 5-6 5" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
```

\---

### Navigation Arrows (`.btn-nav`)

Square icon-only buttons for carousels, sliders, and gallery navigation.

**Sizes:**

* `.btn-nav-lg` — `3.125rem × 3.125rem` (50px)
* `.btn-nav` (default) — `2.625rem × 2.625rem` (42px)
* `.btn-nav-sm` — `2.1875rem × 2.1875rem` (35px)

**Variants:** default (light surface), `.btn-nav-inverted` (dark/teal surface)

**When to use:** carousel prev/next, image gallery navigation, slider controls
**When NOT to use:** page-level navigation, replacing breadcrumbs

```css
.btn-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.625rem;
  height: 2.625rem;
  border-radius: 0.25rem;
  background: transparent;
  color: #015253;
  border: 0.0625rem solid #015253;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.btn-nav-lg { width: 3.125rem; height: 3.125rem; }
.btn-nav-sm { width: 2.1875rem; height: 2.1875rem; }

.btn-nav:hover    { background: #E6EEEE; }
.btn-nav:active   { background: #015253; color: #fff; }
.btn-nav:disabled { color: #A1A1A1; border-color: #A1A1A1; cursor: default; }

/\\\* Inverted — use on teal or dark section backgrounds \\\*/
.btn-nav-inverted {
  background: transparent;
  color: #fff;
  border: 0.0625rem solid rgba(255, 255, 255, 0.55);
}
.btn-nav-inverted:hover  { background: rgba(255, 255, 255, 0.12); }
.btn-nav-inverted:active { background: #fff; color: #015253; }
.btn-nav-inverted:disabled {
  color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
  cursor: default;
}
```

\---

### Pagination (`.listing-btn`)

Numbered page buttons used in product listing pagination. Always paired with `.btn-nav` prev/next arrows.

**Sizes:**

* `.listing-btn--lg` — `3.125rem × 3.125rem`
* `.listing-btn` (default) — `2.625rem × 2.625rem`
* `.listing-btn--sm` — `2.1875rem × 2.1875rem`

**States:** default, `:hover`, `.active` (current page), `.more` (ellipsis — no border, not clickable)

**When to use:** product listing pages, search results
**When NOT to use:** navigation arrows (use `.btn-nav` for those)

```html
<nav class="pagination">
  <button class="btn-nav" disabled>‹</button>
  <button class="listing-btn">1</button>
  <button class="listing-btn active">2</button>
  <button class="listing-btn">3</button>
  <button class="listing-btn more">…</button>
  <button class="listing-btn">8</button>
  <button class="btn-nav">›</button>
</nav>
```

```css
.listing-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.625rem;
  height: 2.625rem;
  border-radius: 0.25rem;
  background: #ffffff;
  border: 0.0625rem solid #015253;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.listing-btn--lg { width: 3.125rem;  height: 3.125rem;  font-size: 1.1rem; }
.listing-btn--sm { width: 2.1875rem; height: 2.1875rem; font-size: 0.9rem; }

.listing-btn:hover  { background: rgba(1, 82, 83, 0.05); color: #005253; }
.listing-btn.active { background: #005253; border-color: #005253; color: #ffffff; cursor: default; }
.listing-btn.more   { border: none; cursor: default; }

/\\\* Inverted — teal or dark section backgrounds \\\*/
.listing-btn-inverted {
  background: transparent;
  border: 0.0625rem solid rgba(255, 255, 255, 0.5);
  color: #ffffff;
}
.listing-btn-inverted:hover  { background: rgba(255, 255, 255, 0.12); }
.listing-btn-inverted.active { background: #ffffff; color: #015253; border-color: #ffffff; cursor: default; }
.listing-btn-inverted.more   { border: none; }
```

\---

### Breadcrumbs (`.breadcrumb`)

Hierarchical navigation trail. No border-radius token used — purely text-based.

**Rules:**

* Active (current) page: `color: #000000`, no underline
* Parent links: `color: #005253`, underlined
* Separator: `#A1A1A1` chevron SVG (`›`), `0.375rem × 0.625rem`
* Font: `0.875rem` (14px), weight 400

**When to use:** every page below the homepage
**When NOT to use:** single-level pages, modal headers

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Briefkästen</a></li>
    <li class="breadcrumb-item active" aria-current="page">Metzler Briefkasten Typ 200</li>
  </ol>
</nav>
```

```css
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.breadcrumb-item a {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.875rem;
  color: #005253;
  text-decoration: underline;
  cursor: pointer;
}
.breadcrumb-item.active {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.875rem;
  color: #000000;
  text-decoration: none;
}
/\\\* Chevron separator — SVG data URI \\\*/
.breadcrumb-item + .breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: '';
  display: inline-block;
  width: 0.375rem;
  height: 0.625rem;
  background: url("data:image/svg+xml,%3Csvg width='6' height='10' viewBox='0 0 6 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4-4 4' stroke='%23A1A1A1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center;
}
```

\---

### Textfield (`.form-control`)

Floating-label input. Border changes state; no background change.

**States:**

* Default: border `#DADADA`, placeholder text `#A1A1A1`
* Active (focused): border `#009951` (Green), label floats above
* Done (has value): border `#009951`, label stays floated
* Error: border `#C90000`, error message bottom-right on border line

**Sizes:** `.form-control-lg` (large), `.form-control` (default), `.form-control-sm` (small)

**When to use:** all text inputs, search fields, form entries
**When NOT to use:** non-text inputs (checkboxes, radios use their own components)

```html
<!-- Floating label pattern -->
<div class="field-wrapper">
  <input type="text" class="form-control" placeholder=" " id="name">
  <label for="name">Name</label>
</div>

<!-- Error state -->
<div class="field-wrapper">
  <input type="text" class="form-control error" placeholder=" " id="name2">
  <label for="name2">Name</label>
  <span class="field\\\_\\\_error">Dieses Feld ausfüllen</span>
</div>
```

```css
/\\\* Base input — padding-based sizing, no fixed height \\\*/
.form-control {
  display: block;
  width: 100%;
  padding: 0.7rem 0.9375rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #000;
  background: #fff;
  border: 0.0625rem solid #DADADA;
  border-radius: 0.25rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}
.form-control:focus   { border-color: #015253; }
.form-control.error   { border-color: #C90000; }
.form-control-lg      { padding: 0.8rem 1rem;      font-size: 1.125rem; }
.form-control-sm      { padding: 0.35rem 0.75rem;  font-size: 0.875rem; }

/\\\* Floating label wrapper \\\*/
.field-wrapper { position: relative; }
.field-wrapper label {
  position: absolute;
  left: 0.9375rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #A1A1A1;
  pointer-events: none;
  transition: all 0.15s ease;
  background: transparent;
  padding: 0;
  line-height: 1.4;
  white-space: nowrap;
  z-index: 1;
}
/\\\* Float label above border on focus or when value present \\\*/
.field-wrapper .form-control:focus + label,
.field-wrapper .form-control:not(:placeholder-shown) + label {
  top: -0.5625rem;
  left: 0.6875rem;
  transform: none;
  font-size: 0.75rem;
  color: #000;
  background: #fff;
  padding: 0 0.3125rem;
}
/\\\* Error text — on the bottom border line \\\*/
.field\\\_\\\_error {
  position: absolute;
  bottom: -0.4375rem;
  right: 0.6875rem;
  background: #fff;
  padding: 0 0.3125rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.75rem;
  color: #C90000;
  white-space: nowrap;
  line-height: 0.875rem;
}
.field\\\_\\\_hint {
  display: block;
  margin-top: 0.3125rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.8125rem;
  color: #888;
  line-height: 1.45;
}
```

\---

### Checkbox (`.checkbox`)

**Variants:**

* **Filter** (default): checked fill `#015253` (Teal 500) — for filter panels and navigation
* **Configurator**: checked fill `#009951` (Green) — for product configurators and selection lists

**Sizes:**

* Default: `1.5625rem × 1.5625rem` (25px), `border-radius: 0.25rem`
* Small (`.checkbox-sm`): `1.125rem × 1.125rem` (18px), `border-radius: 0.1875rem`

**States:** unchecked (white, `#DADADA` border), checked (colored fill, white checkmark SVG)

**When to use:** multi-select filter panels, configurators, agreement checkboxes
**When NOT to use:** single-select (use Radio Button)

```html
<!-- Filter variant (teal) -->
<label class="checkbox-wrapper">
  <span class="checkbox checked-filter"></span>
  Filter option
</label>

<!-- Configurator variant (green) -->
<label class="checkbox-wrapper">
  <span class="checkbox checked-config"></span>
  Configurator option
</label>

<!-- Small size -->
<label class="checkbox-wrapper checkbox-sm">
  <span class="checkbox"></span>
  Small option
</label>
```

```css
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5625rem;
  cursor: pointer;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #000000;
  user-select: none;
}
.checkbox-wrapper.checkbox-sm { font-size: 0.875rem; }

.checkbox {
  width: 1.5625rem;
  height: 1.5625rem;
  border-radius: 0.25rem;
  border: 0.0625rem solid #DADADA;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: background 0.12s;
}
.checkbox-sm .checkbox { width: 1.125rem; height: 1.125rem; border-radius: 0.1875rem; }

.checkbox.checked-filter { background: #015253; border-color: #015253; }
.checkbox.checked-config  { background: #009951; border-color: #009951; }
```

\---

### Radio Button (`.radio`)

Single-select control. Active dot colour is always `#009951` (Green), not teal.

**Sizes:**

* Default: `1.25rem × 1.25rem` (20px)
* Small (`.radio-sm`): `1rem × 1rem` (16px)

**States:** default (white, `#DADADA` border), active (`#009951` border + green dot), error (`#C90000` border), disabled (opacity 0.45, `cursor: not-allowed`)

**When to use:** single-select from a list (shipping method, payment type, product variant)
**When NOT to use:** multi-select (use Checkbox)

```html
<label class="radio-wrapper">
  <span class="radio"></span>
  Unselected
</label>

<label class="radio-wrapper">
  <span class="radio active"></span>
  Selected
</label>

<label class="radio-wrapper disabled">
  <span class="radio"></span>
  Disabled
</label>

<label class="radio-wrapper">
  <span class="radio error"></span>
  Error state
</label>

<!-- Small size -->
<label class="radio-wrapper radio-sm">
  <span class="radio active"></span>
  Selected small
</label>
```

```css
.radio-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5625rem;
  cursor: pointer;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  color: #000000;
  user-select: none;
}
.radio-wrapper.radio-sm  { font-size: 0.875rem; }
.radio-wrapper.disabled  { opacity: 0.45; cursor: not-allowed; }

.radio {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.0625rem solid #DADADA;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: border-color 0.12s;
}
.radio-sm .radio { width: 1rem; height: 1rem; }

.radio.active::after {
  content: '';
  width: 0.8125rem;
  height: 0.8125rem;
  border-radius: 50%;
  background: #009951;
}
.radio-sm .radio.active::after { width: 0.625rem; height: 0.625rem; }
.radio.active { border-color: #009951; }
.radio.error  { border-color: #C90000; }
```

\---

## 7\. Rules — Non-Negotiable

**Unit rule:** Always use `rem`. Never output `px` in production CSS. Base: `16px = 1rem`.

**Color rule:** Never hardcode hex values. Always reference the token name (e.g., "Teal 500", "Red 500") in comments and use the corresponding hex only as its value.

**Red on CTAs:** Red (`#C90000`, `#D42924`) is strictly forbidden on any clickable button. Red is for sale prices, error states, and the logo M-square only. It triggers purchase anxiety and must never appear on call-to-action elements.

**Dark buttons on dark backgrounds only:** `.btn-dark` and `.btn-dark-outline` are only valid on dark hero sections, full-bleed images, or teal backgrounds. On white/light surfaces they break visual hierarchy.

**Icon source:** All icons must come from the Metzler Icons page in the design system. Never create custom inline SVGs or import from external libraries (Heroicons, Feather, etc.). Reference icons by their exact name from the Icons page.

**Border widths:**

* Default interactive element border: `0.0625rem` (1px solid)
* Secondary button border: `0.125rem` (2px solid) — `.btn-secondary`, `.btn-white`
* Input border: `0.0625rem` (1px solid)

**Breakpoint:** The critical mobile/desktop threshold is `768px`. Below this: hamburger nav, stacked footer, block buttons in forms. Above: full desktop header, multi-column grid, auto-width buttons.

**Checkbox colour split:** Filter checkboxes (filter panels, navigation) use Teal 500 (`#015253`). Configurator checkboxes (product selection, configurators) use Green (`#009951`). Never mix them.

**Radio active colour:** Always Green (`#009951`), never Teal. This distinguishes selection/availability from brand navigation.

**Floating label inputs:** Always use the `.field-wrapper` + `placeholder=" "` pattern. The label must be a sibling `<label>` element immediately after the `<input>`, not a `<div>` or text node. This is required for the CSS `+` sibling selector to work.

\---

## 8\. Usage for Claude AI

Paste this file at the start of any Claude session where you are building or extending Metzler UI. Tell Claude: "Use the Metzler Design System rules in `metzler-design-system.md` as your source of truth. Never hardcode hex values — always use the token names listed in Section 2. Never use px — always use rem as defined in Section 1. For every component you build, check Section 6 for the exact CSS class names, states, and CSS definitions. If a value you need is not listed in this document, ask before inventing one — all tokens are defined and exhaustive."

