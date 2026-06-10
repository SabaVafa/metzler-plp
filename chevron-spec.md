# Chevron Icon — Style Specification

Portable spec for the chevron icon system. There is **one** chevron asset in active
use (`#i-chevron-right`); rotation produces the other directions. Color is inherited
via `currentColor`, so the icon adapts to its container's text color.

---

## 1. Base symbol — `#i-chevron-right`

Define once in an inline SVG sprite (e.g. a hidden `<svg>` at the top of `<body>`):

```html
<symbol id="i-chevron-right" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 6l6 6-6 6"/>
</symbol>
```

Use it with:

```html
<svg><use href="#i-chevron-right"/></svg>
```

| Property            | Value                                            |
| ------------------- | ------------------------------------------------ |
| viewBox             | `0 0 24 24`                                       |
| path                | `M9 6l6 6-6 6`                                     |
| fill                | `none`                                            |
| stroke              | `currentColor` (inherits parent `color`)          |
| stroke-width        | **1.5**                                           |
| stroke-linecap      | `round`                                           |
| stroke-linejoin     | `round`                                           |

**Rules**
- Never set `stroke`/`color` on the SVG itself — it inherits via `currentColor` from the container's `color`.
- Get other directions with CSS `transform: rotate()`, not separate icons:
  - right (default): `0deg`
  - left / back: `rotate(180deg)`
  - down: `rotate(90deg)`
  - up: `rotate(-90deg)`

> Optional companion symbol `#i-chevron-down` (`path M6 9l6 6 6-6`, **stroke-width 2.5**)
> exists for heavier down-carets (e.g. select menus). Only include it if needed.

---

## 2. Design tokens referenced

| Token            | Value                       | Role                          |
| ---------------- | --------------------------- | ----------------------------- |
| `--teal`         | `#015253`                   | Brand anchor / hover fill     |
| `--teal-10`      | `rgba(1, 82, 83, 0.10)`     | Focus ring                    |
| `--teal-75`      | `#E3F2F0`                   | Light hover tint              |
| `--schwarz`      | `#1A171B`                   | Default icon color            |
| `--graphite-500` | `#A1A1A1`                   | Breadcrumb separator color    |
| `--line`         | `#DADADA`                   | Button border                 |
| `--white`        | `#FFFFFF`                   | Icon on teal / button bg      |
| `--r-m`          | `4px`                       | Button radius                 |

---

## 3. Usage — Breadcrumb separator

| Property      | Value                                              |
| ------------- | -------------------------------------------------- |
| Size          | **14 × 14 px**                                     |
| Color         | `--graphite-500` (`#A1A1A1`)                        |
| stroke-width  | 1.5 (from symbol)                                  |
| Rotation      | none (points right)                                |
| Container     | `inline-flex; align-items:center`, `aria-hidden="true"` |

```css
.crumb li        { display: inline-flex; align-items: center; }
.crumb li svg    { width: 14px; height: 14px; color: #A1A1A1; }
```

---

## 4. Usage — Carousel arrows (prev / next)

Square icon button used for horizontal carousels/rails.

| Property        | Value                                                              |
| --------------- | ----------------------------------------------------------------- |
| Button size     | **40 × 40 px**                                                    |
| Button radius   | `4px` (`--r-m`)                                                   |
| Button border   | `1px solid #DADADA` (`--line`)                                    |
| Button bg       | `#fff`                                                            |
| Icon size       | **24 × 24 px**, `stroke-width: 1.5`                              |
| Icon color      | `#1A171B` (`--schwarz`)                                          |
| prev            | `transform: rotate(180deg)`                                      |
| **Hover**       | bg `#015253` (`--teal`), icon `#fff`, border `#015253`           |
| **Focus**       | `box-shadow: 0 0 0 3px rgba(1,82,83,.10)` (`--teal-10`)          |

```css
.arrow {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 3;
  width: 40px; height: 40px; border-radius: 4px;
  border: 1px solid #DADADA; background: #fff; color: #1A171B;
  display: grid; place-items: center;
  transition: background .15s ease, color .15s ease;
}
.arrow svg          { width: 24px; height: 24px; stroke-width: 1.5; }
.arrow--prev        { left: 0; }
.arrow--prev svg    { transform: rotate(180deg); }
.arrow--next        { right: 0; }
.arrow:hover        { background: #015253; color: #fff; border-color: #015253; }
.arrow:focus-visible{ outline: none; box-shadow: 0 0 0 3px rgba(1,82,83,.10); }
```

---

## 5. Usage — Pagination arrows (prev / next)

Same geometry as carousel arrows, lighter hover (tint, not solid fill).

| Property        | Value                                                              |
| --------------- | ----------------------------------------------------------------- |
| Button size     | **40 × 40 px**                                                    |
| Button radius   | `4px` (`--r-m`)                                                   |
| Button border   | `1px solid #DADADA` (`--line`)                                    |
| Button bg       | `transparent`                                                    |
| Icon size       | **24 × 24 px**, `stroke-width: 1.5`                              |
| Icon color      | `#1A171B` (`--schwarz`)                                          |
| prev            | `transform: rotate(180deg)`                                      |
| **Hover**       | bg `#E3F2F0` (Teal 75), border `#015253`                         |

```css
.pg-arrow {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 4px;
  background: transparent; border: 1px solid #DADADA; color: #1A171B;
  cursor: pointer; transition: background .15s ease;
}
.pg-arrow svg        { width: 24px; height: 24px; stroke-width: 1.5; }
.pg-arrow--prev svg  { transform: rotate(180deg); }
.pg-arrow:hover      { background: #E3F2F0; border-color: #015253; }
```

---

## Quick reference

- **One asset:** `#i-chevron-right`, thin **1.5** stroke, `currentColor`, rounded caps.
- **Render sizes:** `14px` (breadcrumb) · `24px` (all arrow buttons).
- **Arrow buttons:** identical 40 × 40 px / 4px radius / 1px `#DADADA` border.
  Difference is hover only — carousel = solid teal fill + white icon; pagination = Teal-75 tint + teal border.
- **Direction:** rotate the same icon (`180deg` = left/back, `90deg` = down, `-90deg` = up).
