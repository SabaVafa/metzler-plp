# Metzler — Product Listing Pages (PLP)

Static redesigns of two Metzler category pages, built on the shared Home design
system. No build step — plain HTML/CSS/JS.

## Pages
| File | Page |
|------|------|
| `briefkasten.html` | Briefkästen (mailboxes) category page |
| `sprechanlage.html` | Türsprechanlagen (door intercoms) category page |

## Code
- `plp.css` — all PLP styles. Loads `../Home/styles-v2.css` first and reuses its
  design tokens (`--teal`, `--sp-*`, `--r-*`, `.btn`, `.container`, header, footer).
  Shared by both pages; the Sprechanlage page scopes its overrides under `body.sprech`.
- `plp.js` — Briefkasten page engine: renders product cards, the subcategory rail,
  filters, pagination, and the KI-Kaufberater advisor from in-file data arrays.
- `sprechanlage.js` — Sprechanlage engine (same architecture as `plp.js`, with
  Türsprechanlagen data + a 7-step Kaufberater quiz).

## Assets
- `Product Image/` — product + subcategory photos (`Sprechanlage/` and
  `Briefkastenanlage/` subfolders).
- `Poster/` — nav-dropdown promo posters.
- `Banner/` — in-grid promo banner (desktop + mobile).
- `Badge/` — Red Dot award SVGs (`reddot-award-lockup.svg` = full lockup for the
  banner; `reddot-award-badge.svg` = on the product card).
- `../Home/` — shared design system + brand assets (logo, icons, trust badges).
  Owned by the Home project; referenced via `../Home/…`.

## Run locally
The pages reference `../Home/…`, so the server must be rooted at the **parent**
folder (the one containing both `PLP/` and `Home/`):

```bash
# from the parent of this folder
python -m http.server 8780
# then open http://localhost:8780/PLP/sprechanlage.html
```

## Deploy (GitHub Pages)
Live site is served from `main` → `/docs`:
- https://sabavafa.github.io/metzler-plp/PLP/briefkasten.html
- https://sabavafa.github.io/metzler-plp/PLP/sprechanlage.html

`docs/` is a **self-contained deploy bundle**: `docs/PLP/*` (pages + assets) and
`docs/Home/*` (the Home assets so `../Home/` resolves). `docs/.nojekyll` serves
files raw. **After editing a source file, copy the changed file(s) into
`docs/PLP/` (or `docs/Home/`) before pushing** — otherwise the live site is stale.
CSS/JS are cache-busted with a `?v=N` query in the HTML; bump it on changes.

## Reference docs
- `metzler-design-system.md` — colours, spacing, radii, typography spec.
- `chevron-spec.md` — chevron icon sizing/stroke spec.
- `KI-KAUFBERATER-HANDOFF.md` — KI-Kaufberater advisor notes.
