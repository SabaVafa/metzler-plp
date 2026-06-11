# KI-Kaufberater — Session Handoff

Context doc for continuing work on the **KI-Kaufberater** (AI buying advisor) on the
Metzler Briefkasten **PLP / category page**. Hand this to the next session.

---

## 1. Project & workflow

- **Working dir:** `C:\Users\s.vafakhah\Desktop\PLP` · git repo `main` → `https://github.com/SabaVafa/metzler-plp`.
- **The advisor lives in 3 source files:**
  - `briefkasten.html` — the `.advisor` section markup (collapsed bar + expandable card).
  - `plp.js` — `wireAiAdvisor()` holds the whole quiz engine.
  - `plp.css` — all `.advisor*` / `.adv-*` styles (advisor section starts ~line 716, `PILL RULE` comment ~757).
- **Deploy:** GitHub Pages serves the **`docs/`** copies. After editing source you MUST
  `Copy-Item` the changed file(s) into `docs/PLP/` (and `docs/Home/` if touched), then commit + push.
- **Cache-busting (critical):** bump the `?v=N` query on the `plp.css` / `plp.js` (and `../Home/styles-v2.css`)
  tags in `briefkasten.html` on **every** change or assets serve stale.
  **Current versions: `plp.css?v=79`, `plp.js?v=57`, `styles-v2.css?v=9`.**
- **Preview/verify:** Claude_Preview server (`plp-preview`, port **8780**), URL
  `http://localhost:8780/PLP/briefkasten.html?v=<Date.now()>` (server root is the **parent** of PLP).
  Verify with CSSOM measurements via `preview_eval` — `preview_screenshot` has been **timing out** all session
  (page is fine; capture tool stuck), so rely on measurements. The result renders ~1.5–1.8s after the last step.
- **Git commit gotcha (PowerShell):** here-string commit messages break on embedded `"` double-quotes,
  `%`, `…`, em-dashes. Use plain ASCII in messages (`@'...'@` single-quoted here-string, closing `'@` at column 0).
- **HEAD:** `b00c0ad`. Co-author trailer used on commits: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## 2. What the KI-Kaufberater is now

A **collapsible dropdown** (collapsed by default to save space above the product grid). Two states share
the `.advisor` section; `.is-open` toggles them.

**Collapsed = `.advisor__bar`** (slim ~72px teal-tinted bar, always the default):
`[KI-Kaufberater pill] Finden statt Suchen` on line 1, sub `In wenigen Fragen zum passenden Briefkasten`
left-aligned below, `Berater öffnen ⌄` CTA on the right. Clicking expands.

**Expanded = `.advisor__card`** (`id="advisorPanel"`): **intro block was removed** — it is now a
single full-width column showing only the quiz (progress tracker + question + option tiles + nav),
with a bare teal collapse chevron top-right (`.advisor__collapse`, no container). Branding lives only
in the collapsed bar. Toggling is wired in `wireAiAdvisor()` via `[data-ai-toggle]`; the quiz height-lock
runs **on open** (card is `display:none` at init → width 0), and the current step is force-settled (`is-in`)
on open so content aligns to the content top.

### The quiz (needs-based, NOT a mirror of the manual filters)
7 steps, researched from the live site `https://edelstahl-tuerklingel.de/briefkasten`. Multi-select tiles
(toggle, no auto-advance), advance with **Weiter** (empty = skip), **Zurück** preserves picks. Selected tile =
teal border + inset ring + teal-50 fill (no checkbox squares — removed). Step height is **locked to the
tallest question step** (offscreen probe in `lockQuizHeight()`), result step excluded.

1. **Für welche Wohnsituation…** → `faecher` 1/2/3 (Einfamilien/Zwei/Mehrfamilienhaus)
2. **Wo möchten Sie … anbringen?** → `montage` wand/stand/unterputz (Hauswand / Standfuß / **Zaun→stand** / Mauer→unterputz)
3. **Mit welchem Postaufkommen…** → Pakete→`faecher:paketfach`, Viel Post→`zeitung:integriert`, Briefpost→neutral
4. **Welche Zusatzfunktion…** → Funkklingel→`zusatz:klingel`, Sprechanlage→`zusatz:klingel+sprech`, **Sichtfenster→`material:acrylglas`**, Keine→neutral
5. **Wie stark … der Witterung…** → Übliche Lage→neutral, Rau/Küste→**`material:edelstahl`**
6. **Welche Optik…** (full-width colour-bar swatch tiles) → Klassische Farbe→`colorset`[anthrazit,braun,schwarz,eisenglimmer,weiss,grau], Edelstahl→`material:edelstahl`, Holzoptik→`material:holz`, Wunschfarbe→`color:wunschfarbe`
7. **Wie … beschriften?** → `pref` (Lasergravur / Namensschild / Edelstahl-Namensschild / Ohne) — noted only, not filtered

### Engine notes (in `wireAiAdvisor()` + shared helpers)
- `active` gained a **`material`** group; `matches(p)` checks it; `sat(p,o)` handles new groups **`colorset`**
  (set of colours, ORed) and **`material`**. `applyPicks()`: non-`pref` options are facets; `setActive` maps
  `colorset` → `active.color`; relaxation drop-order `['faecher','zusatz','montage','zeitung','material','colorset','color']`.
- Options carry: `neutral` (no filter), `chip` (short result-chip label), `values` (colorset), `swatch` (Optik tiles).
- **Result:** always **2 cards** (pads with next-best alternative when only 1 exact match, so no lone-card blank);
  title shows the count only when ≥2 exact matches else "Unsere Top-Empfehlungen für Sie". No match-% badges
  (removed — they were fabricated). Removable chips (× per chip → `removePick(label)` → `renderResult()` re-curates
  instantly, no loader). `renderResult()` was extracted from `finish()` so it can re-run.
- **Grid coupling:** the advisor writes its picks into the page's `active` filters (grid filters to match).
  An **`advisorChips` flag** keeps those filters out of the catalog toolbar chips + "Alle entfernen"
  (they already show inside the KI). Any manual sidebar toggle / clearAll / "Quiz neu starten" clears the flag.
- **Result actions:** "Alle X Modelle ansehen" = filled primary; "Quiz neu starten" = underlined teal link;
  gap between them sp-5. Chips + actions share one row (`.advisor__summary`, space-between).
- **E-mail capture (GDPR):** real validation (DS Red error state), Datenschutz hint line, double-opt-in info
  banner (`#E6F1FB`/`#185FA5`) shown only when the newsletter box is ticked, success confirmation auto-reverts
  to the pristine form after 4s.

### Pill design rule (codified in plp.css `PILL RULE` comment)
Every pill is text-only; **fill = the light 100-tint of its container's background** (teal panel → Teal 100 `#E6EEEE`;
white card → Graphite 100 `#F0F0F0`); **label = a darker shade of that same fill** (teal→Teal 700, graphite→Schwarz);
faint same-family hairline; pill radius; **no icons**. The `.mega-feature__badge` (3D-Konfigurator, in the nav dropdown)
follows the same rule.

---

## 3. Known caveats / decisions (prototype dataset = local 18-product sample, not the full 80)

- **Holzoptik** (Q6) → `material:holz`, which no local product has → it **relaxes** to "beste Alternativen".
  Works once wired to the full catalogue (Anton/Masiva wood line).
- **Sichtfenster** → mapped to the one Acrylglas model; **Zaun** → mapped to `montage:stand` (no dedicated attrs locally).
  Real integration should add `sichtfenster` / `zaun` product attributes (and a `holz` finish).
- **Height lock** keeps steps from jumping but leaves empty space on the shortest step (step 1, 3 options).
  Card ≈ 318px expanded. Open question: keep the lock (no jump, some empty space) vs size-to-step (compact, slight jump).
- Live site research notes (collected via Chrome MCP): RAL names Anthrazit **RAL7016**, Verkehrsweiß **RAL9016**,
  Graualuminium **RAL9007**, Eisenglimmer **DB703**, Tiefschwarz **RAL9005**; rostfreier **Edelstahl V2A**;
  Holzoptik/Echtholz **Eiche/Lärche**; **Sichtfenster** models; delivery **Germany-only**.

---

## 4. Open items / offers the user may pick up next

- Restore the **pill + title** inside the expanded card if they decide the quiz panel feels too unbranded
  (currently fully removed; branding only in the collapsed bar).
- Make the collapsed bar **stateful** ("Ihre Empfehlungen sind bereit" / "Fortsetzen — Schritt x von 7")
  like the standalone prototype.
- Decide on the **height-lock vs size-to-step** tradeoff (empty space on short steps).
- **Real-catalogue integration:** extend product data with `sichtfenster`, `zaun`, `holz` so every quiz path
  returns exact matches; wire to the live 80-product catalogue.
- Optional polish: auto-collapse the advisor when "Alle Modelle ansehen" scrolls to the grid; keep a single
  "Alle entfernen" affordance visible while advisor filters are active.

## 5. Reference files
- `ki-kaufberater-prototype.html` — standalone redesign prototype (NOT integrated; has the dark live-panel,
  stateful teaser, scanning-arcs motif). Source of ideas if reviving the premium look.
- `metzler-design-system.md` — DS tokens (Teal 500 `#015253`, Green/success `#009951`, radii, type, 14px floor).
