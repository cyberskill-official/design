# CyberSkill Design System — Exhaustive Visual Audit & Systemic Remediation Record

> **Document Role:** `visual_audit_record` (repository-only diagnostic & engineering record; never self-certifies human aesthetic or accessibility acceptance).  
> **Design System Version:** `2.8.0` · **Audit Scope:** `287` items (`38` Foundations · `125` Public Exports · `14` Compositions · `94` Templates · `16` Product/Reference Pages)  
> **Companion Coverage Ledger:** [`_audit/visual-audit-ledger.json`](visual-audit-ledger.json)

---

## Epistemic & Outcome Separation Contract

Throughout this record, four epistemic categories are kept strictly distinct:

1. **Observed Facts** — Deterministic DOM geometry (`getBoundingClientRect`, `scrollWidth`, `scrollHeight`), computed CSS properties, perceptual OKLCH coordinates, APCA (`Lc`) / WCAG 2.x contrast ratios, git history diffs, and automated multi-engine test receipts.
2. **Design Judgments** — Reasoned typographic, spatial, optical, and hierarchy evaluations grounded in observed measurements and CyberSkill's normative identity (`docs/doctrine.md`).
3. **Hypotheses** — Causal explanations for why prior visual regressions survived technical gates (verified against git blame where possible, flagged where inferred).
4. **Unverified Claims / Out-of-Scope Boundaries** — Real human assistive-technology listening (VoiceOver, NVDA, JAWS), physical mobile OLED/LCD hardware inspection, external document host rendering (desktop Word, PowerPoint PPTX, third-party email clients), and canonical GitHub Actions `ubuntu-latest` runner font rasterization.

Per Section 8 of the audit mandate, completion outcomes are reported in three separate buckets (**Technical Verification**, **Visual Assessment**, and **Human Approval**) and never collapsed into a synthetic "100% beautiful" score.

---

## 1. Exhaustive Inventory, Source Authority & Risk-Based Coverage Strategy

### 1.1 Source of Truth & Outward Dependency Chain

1. **Normative Doctrine & Brand Immutables:** `docs/doctrine.md` → `scripts/guidance-source.json` → `SKILL.md`, `AGENTS.md`, `DESIGN.md` (`docs/vi/entrypoints/*`).
2. **Token Foundations (`tokens/`):** Authored CSS custom properties in `tokens/{colors,typography,spacing,radius,elevation,motion,elements,glass,component-tokens}.css` + `tokens/base-inventory.json` + `tokens/element-seeds.json` → generated `tokens/tokens.json`, `tokens/tokens.dtcg.json`, `tokens/modes/*.dtcg.json` (`256` standalone modes), and native Swift/Kotlin/Dart mode packs.
3. **Base CSS Layer (`base/` → `styles.css`):** `16` modular `.cs-*` stylesheets (`reset`, `typography`, `layout`, `surfaces`, `glass`, `components`, `forms`, `controls`, `collections`, `data`, `feedback`, `navigation`, `ai`, `a11y`, `responsive`) concatenated into `styles.css` (`dist/styles.css`, `dist/styles.layered.css`, `dist/styles.min.css`).
4. **Shared Component Runtime (`components/`):** `107` authored `.jsx` modules + TypeScript `.d.ts` declarations + `.prompt.md` contracts → compiled ESM (`dist/`), React entry (`_esm/react.mjs`), legacy browser bundle (`_ds_bundle.js` / `_esm/cs.mjs`), and static DOM reference (`components/static-html-reference.json`).
5. **Guideline Specimens (`guidelines/*.html`):** `29` live HTML specimens (including `guidelines/atomic-view.html` mounting `96/96` authored Atomic stories).
6. **Templates (`templates/`):** `85` `.dc.html` templates (`6` product screens, `38` Vietnamese A4 legal instruments, `21` Letter business documents, `7` send-path emails, `4` 16:9 decks, `9` reference/social templates) + `2` composite HTML specimens (`kitchen-sink.html`, `ai-cluster-demo.html`).
7. **Complete Product, Kit & Reference Pages:** `4` Website UI kit pages (`ui_kits/website/{index,work,careers,chat}.html`), `4` Status Hub UI kit pages (`ui_kits/status-hub/{index,project,settings,login}.html`), `deck/index.html`, `2` consumer examples (`examples/static-html/hello.html`, `examples/npm-consumer/index.html`), and `2` interactive documentation viewers (`docs.html`, `tokens.html`).

### 1.2 Product Identity, Users, Primary Tasks & Density

- **Identity:** CyberSkill is a Saigon-rooted AI-native software and enterprise operations studio (*Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí*), anchored by warm **Umber `#45210E`** and **Ochre `#F4BA17`**, Vietnamese-first bilingual parity (`EN` + `VI`), and Lumi (the golden genie assistant that scopes clear wishes and hands high-stakes actions to a mandatory human review gate).
- **Target Users & Primary Tasks:** Enterprise portfolio/release leads monitoring multi-squad delivery (`Status Hub`), legal/HR/finance teams authoring bilingual statutory instruments (`vn-*` A4 & Letter templates), operators conversing with Lumi (`chat.html`, `AI Cluster`), and prospective clients evaluating studio craft (`ui_kits/website/`).
- **Appropriate Information Density:** Dual-mode by task — breathable `comfortable` rhythm (`44px` minimum coarse touch targets, `80px` editorial sections) for storytelling, forms, and conversational AI; structured `compact` (`data-cs-density="compact"`) tabular density for portfolio boards, `DataTable`/`DataGrid` views, and statutory schedules.

### 1.3 Coverage Ledger Summary & Risk-Based Combination Strategy

Every scoped item is recorded with stable IDs, dependencies, before/after evidence paths, and separate `isolatedStatus` vs. `composedStatus` in [`_audit/visual-audit-ledger.json`](visual-audit-ledger.json):

| Category | ID Prefix | Total | Isolated: Verified | Isolated: Improved | Isolated: N/A (Non-DOM) | Composed: Improved |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Foundations (9 token modules + 29 guidelines) | `FND-*` | 38 | 26 | 12 | 0 | 16 |
| Public Component Exports (`lifecycle.json`) | `CMP-*` | 125 | 95 | 23 | 7 (`4` const, `1` hook, `2` context/SR-only) | 23 |
| Compositions & Patterns | `PAT-*` | 14 | 14 | 0 | 0 | 11 |
| Templates (85 `.dc.html` + 7 `email-safe` + 2 composites) | `TPL-*` | 94 | 74 | 20 | 0 | 20 |
| Complete Product, Kit & Viewer Pages | `PAG-*` | 16 | 5 | 11 | 0 | 11 |
| **Total Scoped Inventory** | — | **287** | **214** | **66** | **7** | **81** |

*(Note: Non-DOM exports — `CS_ICONS`, `CS_LOGO_MARK_INNER`, `CS_LOGO_VIEWBOX`, `TONE_ROLES`, `useCyberSkillI18n`, `LocaleProvider`, `OverlayProvider` — are explicitly marked `not_applicable` in isolation rather than falsely marked visually rendered.)*

**Risk-Based Combination Strategy:** Across `2 themes × 16 element contexts × 2 languages × 2 style packs × 2 densities × 2 contrast modes × 5 viewports × 9 states` (`92,160` theoretical permutations per item), testing was stratified into four risk tiers:
- **Tier 1 (Exhaustive Automated Matrix):** Focus indicators (`43,776` rendered cases per browser × `3` engines = `131,328` checks), body-text contrast (`55,080` rendered rows across `256` modes), token/surface APCA & WCAG contrast (`192/192` matrix cells), axis scope permutations (`36,864` nested cases), component theme scopes (`15,660` nested cases × `3` engines), template primary CTAs (`238` contexts / `340` text samples), and secondary UI kit contrast (`2,028` cases).
- **Tier 2 (Component State, `matte-paper`, Narrow Mobile & 200% Zoom Stress):** All `21` `.card.html` boards + `96` Atomic View stories + `states-and-stress` fixture rendered in Light & Dark, `liquid-glass` & `matte-paper`, `320px` mobile width, and `200%` root font-size scaling (`WCAG 1.4.4`).
- **Tier 3 (Complete Product Pages & Screen Templates):** All `15` product/kit/viewer pages and `6` product-screen `.dc.html` templates rendered and DOM-measured at `1280×820` (Light EN + Dark VI + `matte-paper`), `909×540` (Pixel CI frame), `390×844` mobile, and `320×568` narrow stress across Chromium, Firefox, and WebKit.
- **Tier 4 (Document, Deck & Email Templates):** All `79` print/deck/email `.dc.html` templates rendered at `1280×820` and `390×844` with zero-error, overflow, clipping, deck heading contrast, email heading/CTA/label contrast, and bilingual parity checks.

---

## 2. Foundations Review & Systemic Token Remediations (Isolated & In Use)

### 2.1 Perceptual Color Measurement Method & Limitations

- **Method:** Computed CSS colors were resolved in headless Chromium across Light and Dark themes and all `16` Ngũ Hành accent contexts (`neutral` + `15` `data-cs-element` / `data-cs-variant` packs), converted from sRGB (`[0..255]`) to linear-light sRGB, transformed via the Björn Ottosson `M1`/`M2` matrices into **OKLab** (`L, a, b`) and cylindrical **OKLCH** (`L ∈ [0,1]`, chroma `C`, hue `H ∈ [0°,360°)`), and cross-checked against **APCA (`Lc`)** and **WCAG 2.x** luminance contrast ratios (`_audit/exports/visual-audit-2026-11/step1-2-foundations-after.json`).
- **Limitations:** OKLCH models isolated uniform patches under standard D65 viewing conditions; it does not model spatial frequency (thin `1px` borders vs. `60px` display type), surround adaptation (`liquid-glass` backdrop blur), or subpixel font hinting. Perceptual color metrics inform design judgment and never replace APCA/WCAG accessibility thresholds or human visual review.

### 2.2 Key Foundation Findings & Implemented Root-Cause Fixes

1. **Primary vs. Muted Ink Hierarchy Separation (`tokens/colors.css` & `scripts/generate-element-packs.mjs`):**
   - *Observed Fact (Before):* In Light mode, `--cs-color-text-primary` (`#45210E`) measured `OKLCH(L=0.2676, C=0.0645, H=48.1°)` while `--cs-color-text-muted` (`#3F2D21`) measured `OKLCH(L=0.3121, C=0.0416, H=50.5°)` — a lightness delta of only `ΔL = +0.0445` (`ΔE_ok = 0.0501`), making primary and secondary ink nearly indistinguishable in swatches and metadata labels.
   - *Root-Cause Implementation (After):* Lightened Light `--cs-color-text-muted` in `tokens/colors.css` to `#5E4436` (`OKLCH(L=0.412, C=0.042, H=48°)` — expanding perceptual lightness separation from `#45210E` by **`3.2×` in OKLCH `ΔL` / `5.6×` in linear luminance** while clearing `APCA Lc ≥ 77` on neutral, soft, and middle surfaces), and bound per-pack `--_cs-light-color-text-muted` / `--_cs-dark-color-text-muted` channels via `ensureLinkOnSurfaces(..., 4.5, 77)` in `scripts/generate-element-packs.mjs` and `scripts/lib/theme-resolver.mjs` so deep element packs (`tho.clay`, `hoa.lava`, `thuy.ocean`, `moc.forest`, `kim.steel`) preserve `APCA Lc ≥ 75` across all `55,080` body-text contrast rows.
2. **Bezold–Brücke Hue Shift on Thổ `--cs-accent-strong` (`scripts/generate-element-packs.mjs`):**
   - *Observed Fact (Before):* Brand Ochre `#F4BA17` sits at `OKLCH(L=0.8184, C=0.1651, H=84.4°)`. Darkening at constant hue angle (`H=85.5°–90.8°`) produced olive-brass `#916D11` in Light mode and olive-mustard `#795800` in Dark mode (Bezold–Brücke hue shift), whereas `tokens/element-seeds.json` already authored `tho.clay` at `H = 60.0°` (`dh: -25.2`) to keep deep earth warm.
   - *Root-Cause Implementation (After):* Rotated `pinThoStudio` (`tho` middle) `--cs-accent-strong` seed hue to `62°` in both Light (`#A4631E` roasted amber; `WCAG 4.79:1`, `APCA Lc 78.4` with `#FFFFFF`; `APCA Lc 66.8` on `#FBF4E9` tint; derived `--cs-color-link` `#644A05 → #744000`) and Dark (`#7D480C` warm roasted amber; `APCA Lc ≥ 78` with `#FFFDF8`), eliminating the olive cast across banners, email headers, secondary button borders, and Dark `tho` primary CTAs.
3. **Warm Umber Elevation Shadow Harmonization (`tokens/elevation.css`):**
   - *Observed Fact & Fix:* Light `--cs-shadow-md` and `--cs-shadow-xl` used colder near-black `rgba(31, 19, 11, 0.14/0.24)` while `xs`, `sm`, and `lg` used brand Umber `rgba(69, 33, 14, ...)`. Harmonized `--cs-shadow-md` (`0 12px 30px rgba(69, 33, 14, 0.14)`) and `--cs-shadow-xl` (`0 24px 80px rgba(69, 33, 14, 0.24)`) in `tokens/elevation.css` and `base/components.css` fallbacks.
4. **Container Hairline vs. Interactive Input Border (`tokens/component-tokens.css` & `base/`):**
   - *Observed Fact & Fix:* `--cs-color-border-default` (`#E7D9C6`, `1.24:1` on `#FFFFFF`) vs. `--cs-component-textfield-border-default` (`#BFA58F`, `2.33:1`). Rebound all `11` Wave-2/3 form/picker controls to `var(--cs-component-textfield-border-default, var(--cs-color-border-default))`.
5. **`matte-paper` Style-Pack Zero-Blur Contract (`base/glass.css`, `base/controls.css`, `ui_kits/`, `templates/`, `guidelines/`):**
   - *Observed Fact & Fix:* Under `[data-cs-style="matte-paper"]`, `.cs-dock` and seven consumer sticky bars/inputs (`.wish input`, `.lumi-top`, `status.css .bar`, `kitchen-sink .top`, `playground .bar`, `atomic-view .toolbar`, `MarketingPage .cs-mktg-nav`) still painted `backdrop-filter: blur(8px–16px)` and translucent `color-mix(..., transparent)` fills, while nested `[data-cs-style="liquid-glass"]` inside `matte-paper` could not restore `.cs-aurora::before`. Added explicit `[data-cs-style="matte-paper"]` zero-blur opaque overrides, `@media (prefers-reduced-transparency: reduce)` parity on `.cs-dock`, and nested `liquid-glass` restoration.
6. **Guideline Specimen Defects (`guidelines/colors-text.html`, `guidelines/atomic-view.html`):**
   - *Observed Fact & Fix:* Bound `colors-text.html` chips to live CSS tokens for Dark mode and updated `#6E5A4C` → `#5E4436` (`guideline-hex-policy.json` + `guideline-translations.json`); removed the `@media (max-width:768px),(min-width:1024px)` forced-bold rule and anchored `<Popover portal={false}>` in `atomic-view.html`.

---

## 3. Component Isolation Review (`125` Public Exports)

All renderable components were mounted and inspected across variants, sizes, interaction states (`default`, `hover`, `focus-visible`, `active`, `selected`, `disabled`, `loading`, `empty`, `error`, `success`), `liquid-glass` & `matte-paper`, `320px` narrow mobile width, and `200%` text scaling (`_audit/exports/visual-audit-2026-11/step3-deep-states-after.json`):

| Finding ID | Component(s) | Source Path | Observed Defect (Before) | Systemic Fix Implemented (After) |
| --- | --- | --- | --- | --- |
| `CMP-F01` | `Button` (`as="a"` / `<a class="cs-button">`) | `base/components.css` | Global `a:hover { color: var(--cs-color-link-hover); text-decoration: underline }` overrode `.cs-button`, turning hovered primary anchor buttons `#45210E` on `#45210E` (**`1.00:1` invisible**) with underline. | Explicitly locked per-variant `:hover` foreground tokens and `text-decoration: none` on `.cs-button` (`rgb(255,255,255)` on `rgb(69,33,14)` verified). |
| `CMP-F03` | `NativeSelect` vs. `Select` / `TextField` | `base/forms.css` | `.cs-native-select-field` set `display: block`, overriding `.cs-field { display: grid; gap: 6px }` and shifting `NativeSelect` **`6px` higher** (`414.75px` vs `420.75px`) than peer inputs. | Changed `.cs-native-select-field` to `display: grid` (`420.75px === 420.75px` exact top-edge parity + 100% JSX CSS hook coverage preserved). |
| `CMP-F04` | `Switch` | `base/forms.css` | Unchecked `.cs-switch__track` (`1.24:1` `#E7D9C6` on white) lacked edge clarity; focusing `Switch` painted **two simultaneous focus rings** (pill track + outer rectangular `.cs-switch:focus-within`). | Added `inset 0 0 0 1px var(--cs-component-textfield-border-default)` when unchecked (`none` when `:checked`), kept `44×26px` D19 geometry, and removed duplicate `.cs-switch:focus-within` rule. |
| `CMP-F02`, `F05–F15` | `Select`, `InputOTP`, `Combobox`, `InputGroup`, `TagInput`, `DatePicker`, `TimePicker`, `TreeSelect`, `Cascader`, `ColorPicker`, `PromptInput` | `base/forms.css`, `base/controls.css`, `base/ai.css`, `_audit/ci/fixtures/focus-indicator-cases.mjs` | `1.24:1` container border instead of `2.33:1` input border; `1px` vs `2px` focus `outline-offset`; fixed `min-inline-size: 260px–280px` overflowed `320px` containers; `6` static-HTML alias focus selectors lacked rendered probes. | Bound all `11` controls to `--cs-component-textfield-border-default`, aligned `outline-offset: 2px`, added `min-inline-size: 0` at `<=360px`, and added `6` rendered focus probes (`43,776` focus cases/engine, `0` failures). |
| `CMP-F16` | `TypingIndicator` | `base/ai.css` | `.cs-typing` (`display: inline-flex`) stretched across `100%` of parent width (`680px`) inside CSS Grid containers (`.cs-chat`, `#cluster`). | Added `justify-self: start; inline-size: fit-content` so the typing bubble hugs its three dots in both flex and grid layouts. |
| `CMP-F17` | `Card` (`CardHeader`, `CardBody`) | `base/data.css` | `components/card/card.card.html` overflowed horizontally by **`22px`** at `320px` viewport width due to missing `min-inline-size: 0` and long unbroken tokens. | Added `min-inline-size: 0` on `.cs-card`, `.cs-card__header`, `.cs-card__body` and `overflow-wrap: anywhere` on `.cs-card__title`, `.cs-card__subtitle` (`ov320: 22px → 0px`). |
| `CMP-DOCK-01` | `Dock` | `base/controls.css` | `.cs-dock` kept `backdrop-filter: blur(12px)` and translucent fill under `[data-cs-style="matte-paper"]` and `prefers-reduced-transparency: reduce`. | Added `-webkit-backdrop-filter`, opaque `prefers-reduced-transparency` fallback, `matte-paper` zero-blur override, and nested `liquid-glass` restoration. |

---

## 4. Compositions & Patterns Review (`14` Patterns)

Evaluating components together exposed seven composed defects that did **not** appear when components were viewed one by one:

1. **Multi-Column Form Grid Alignment (`PAT-form-field-peer-grid`):** In `.cs-field` grids, intrinsic controls (`TimePicker`, `ColorPicker`, `NumberField`, `SegmentedControl`, `Toggle`) stretched across `100%` of wide columns while `DatePicker`/`Combobox`/`TagInput` capped out at `220–280px`. Added `.cs-field > :is(...)` rules in `base/controls.css` so text/picker fields fill their grid track cleanly while intrinsic controls `justify-self: start`.
2. **Status Hub Filter Toolbar Mismatch (`PAT-filter-toolbar-and-search`):** `.facet select` rendered as a `32px`-tall `8px`-rounded rectangle beside `38px`-tall `999px` pill search and segmented controls (`ui_kits/status-hub/status.css`). Unified to `38px` pill geometry with custom SVG chevron and `2.33:1` input border.
3. **Competing Accent Borders on Portfolio Cards (`PAT-editorial-and-case-cards`):** In `Status Hub`, `5 out of 6` project cards had `.card.hot` (`border-color: var(--cs-color-brand-ochre)` all around), visually competing with the top `.now` (`NOW SHIPPING`) callout banner. Refined `.card.hot` to a `3px` Ochre inline-start indicator rail (`border-inline-start: 3px solid var(--cs-color-brand-ochre)`) on neutral card borders, restoring clear primary-vs-secondary emphasis.
4. **KPI Stat Row Baseline Stretch (`PAT-kpi-stat-cards`):** In `Dashboard.dc.html`, `AppShell.dc.html`, `BodDeck.dc.html`, `DeliveryQbrDeck.dc.html`, and `SalesProposalDeck.dc.html`, multi-column KPI rows stretched 2-line items vertically or bottom-aligned uneven captions, misaligning large numerals. Fixed via `align-items: start; font-variant-numeric: tabular-nums`.
5. **Nested Sidebar Double Chrome (`PAT-sidebar-and-app-shell`):** `ui_kits/website/chat.html` placed `<Sidebar>` (`.cs-sidebar`: `240px` width, `16px` padding, `1px` end border) inside `.lumi-side` (`280px` width, `18px` padding, `1px` end border), creating two parallel vertical lines `22px` apart and cramping conversation items. Scoped `.lumi-side .cs-sidebar` to `inline-size: 100%; padding: 0; border-inline-end: 0; background: transparent`.
6. **Composite Specimen Collisions (`PAT-ai-lumi-conversational-flow`, `PAT-composite-kitchen-sink`):** Fixed `0px` vertical stacking in `templates/ai-cluster-demo.html` (`display: grid; gap: 16px; align-items: start`) and unpadded `0px`-inset cream background stripes in `templates/kitchen-sink.html` (`24px`-padded, `1px`-bordered, `16px`-rounded raised cards).

---

## 5. Templates (`87`) & Complete Product Pages (`15`) Review

### 5.1 Root Cause of Prior Visual Disharmony

Git history inspection (`commit eeda6d8ee`, `v2.1.0`) confirmed a critical **Observed Fact**: to satisfy automated benchmark heuristics without triggering the `909×540` `pixel-diff.mjs` gate, previous compliance patches injected `@media (max-width: 768px), (min-width: 1024px)` rules — **explicitly carving out `769px–1023px` where `909×540` lives!** — across `ui_kits/website/site.css`, `ui_kits/status-hub/status.css`, `guidelines/atomic-view.html`, and `templates/kitchen-sink.html`:
- Forced `font-weight: 700` across `75%–90%` of text nodes at real user viewports (`390px` mobile and `1280px–1440px` desktop).
- Inflated `site.css` `.hero-in` to `min-height: 740px` (`96%` of a `1280×820` desktop viewport) and `.sec` to `padding: 168px 0` (`336px` blank gaps between sections, bloating `ui_kits/website/index.html` to `4,585px` tall).
- Distorted `.svc-grid` to `1.12fr 1fr 1fr` and jumped `status.css` font sizes discontinuously across `768px` and `1024px`.

### 5.2 Slide-Deck (`4` `.dc.html` + `deck/index.html`) & Email (`7` `.dc.html`) Findings & Fixes

- **`DeliveryQbrDeck.dc.html` (`TPL-DECK-01`, High):** Closing slide `05 / 05` `<h2>` (*"Shall we keep going?"* / *"Tiếp tục cùng nhau nhé?"*) painted `color: var(--cs-accent-strong)` (`#5A3004` under default `tho.clay`) on `background: var(--cs-color-brand-umber)` (`#45210E`) — **`1.14:1` dark-brown-on-umber near-invisibility**. Fixed to `color: var(--cs-accent-bright)` (`#F2C5A3` luminous cream-gold) and aligned KPI numerals.
- **`BodDeck.dc.html` & `SalesProposalDeck.dc.html` (`TPL-DECK-02/03`, Low):** Harmonized light-slide kickers from `--cs-accent-strong` to `--cs-color-text-accent` and normalized KPI grids (`align-items: start; font-variant-numeric: tabular-nums`, fixing `align-items: end` ragged baseline on `SalesProposalDeck` slide `07`).
- **`MarketingNewsletter.dc.html` (`TPL-EMAIL-01`, High):** Both primary CTA pills hardcoded `background: var(--cs-color-brand-umber)` (`#45210E`): in Dark mode *"Read the story →"* blended into `#221710` (`1.20:1`), and in **all** themes *"Make a wish"* sat on a `#45210E` footer banner (**`1.00:1` completely invisible pill boundary**). Rebound *"Read the story →"* to `background: var(--cs-accent-strong); color: var(--cs-accent-on-strong)` (`#A4631E` Light / `#7D480C` Dark roasted amber) and *"Make a wish"* on `#45210E` to a crisp `#FFFDF8` cream pill with `var(--cs-color-brand-umber)` ink (`APCA Lc 99.5`, `WCAG 14.9:1`).
- **`DeliveryStatusEmail.dc.html` & `BodInvestorUpdate.dc.html` (`TPL-EMAIL-02/03`, Medium/Low):** Added `border: 1.5px solid var(--cs-accent-on-strong)` to the *"On track"* status pill inside the `--cs-accent-strong` header (`1.00:1` invisible pill boundary fixed) and `font-variant-numeric: tabular-nums` to `BodInvestorUpdate` KPIs.

### 5.3 Rendered Geometry, Chrome & Task-Specific Fold Budget (`1280×820` Desktop, `390×844` & `320×568` Mobile)

| Page / Template | Source Path | Before Height (`1280px`) | After Height (`1280px`) | Header / Sidebar Chrome | Above-the-Fold Primary Task Allocation (`1280×820`) | Overflow (`1280 / 390 / 320px`) |
| --- | --- | ---: | ---: | --- | --- | --- |
| Website Home (`PAG-website-home`) | `ui_kits/website/index.html` | `4,585px` | **`2,893px`** | `65px` sticky top nav (`7.9%` vertical) | Hero headline + bilingual slogan + Lumi wish bar + marquee + `SERVICES · What we build` entry visible in first `820px` (was `96%` hero-only). | `0 / 0 / 0px` |
| Website Work (`PAG-website-work`) | `ui_kits/website/work.html` | `1,632px` | **`1,505px`** | `65px` top nav (`#themeToggle` integrated; `0px` footer occlusion) | Page header + full top half of 3 symmetric case-study cards visible above `820px` fold (was `41px` overflow at `320px`). | `0 / 0 / 0px` |
| Website Careers (`PAG-website-careers`) | `ui_kits/website/careers.html` | `2,014px` | **`1,848px`** | `65px` top nav (`#themeToggle` integrated) | Hero + Studio values row visible above fold; open role cards below with balanced `22px 24px` padding (`ov320: 41px → 0px`). | `0 / 0 / 0px` |
| Lumi Chat (`PAG-website-chat`) | `ui_kits/website/chat.html` | `820px` | **`820px`** | `280px` left rail (`21.9%` inline) + `63px` top bar | Full app-height split workspace (`100dvh`): Lumi greeting, suggestion chips, and bottom prompt composer all visible without page scroll; single crisp rail border. | `0 / 0 / 0px` |
| Status Hub Home (`PAG-status-hub-home`) | `ui_kits/status-hub/index.html` | `1,029px` | **`1,025px`** | `75px` Umber header (`9.1%` vertical) | Portfolio KPI summary + 7-week velocity chart + `NOW SHIPPING` callout + filter toolbar + top row of 4 project cards visible above `820px` fold. | `0 / 0 / 0px` |
| Status Hub Project (`PAG-status-hub-project`) | `ui_kits/status-hub/project.html` | `1,247px` | **`1,163px`** | `75px` Umber header (`11:1` ghost `#langToggle` + `#themeToggle`) | Breadcrumb + project title/actions + 4 KPI stats + progress bar + active task list & squad details visible above `820px` fold. | `0 / 0 / 0px` |
| Dashboard Template (`TPL-dashboard`) | `templates/dashboard/Dashboard.dc.html` | `820px` | **`820px`** | `72px` `#A4631E` warm amber header | Header (`Dự án mới` CTA high-contrast in Light, Dark & all 16 packs) + 4 aligned KPI stats + Tabs + 3 project cards fit cleanly in `820px`. | `0 / 0 / 0px` |
| AppShell Template (`TPL-app-shell`) | `templates/app-shell/AppShell.dc.html` | `820px` | **`820px`** | `240px` sidebar (`18.8%` inline) + `61px` top bar | Search + `Dự án mới` CTA + 4 aligned KPI stats + `DataTable` (`4` project rows) fit cleanly in `820px` viewport. | `0 / 0 / 0px` |
| Marketing Template (`TPL-marketing-page`) | `templates/marketing-page/MarketingPage.dc.html` | `2,248px` | **`2,248px`** | `65px` top bar | Hero + Lumi wish prompt + `DỊCH VỤ` entry above fold; bottom `--cs-accent-strong` CTA banner fixed from `1.00:1` invisible to `APCA ≥ 77.1`. | `0 / 0 / 0px` |

*(Note on non-defect clipping flags: Automated DOM scans flagged `1×1px` `.cs-sr-only` `"Loading table"` in `datatable.card.html` and `"Skip to content"` skip links across the `6` product-screen `.dc.html` templates; both are intentional accessible screen-reader/focus-reveal patterns, not visual clipping defects.)*

---

## 6. Evidence-Based Visual Direction & Principles

1. **Typography & Perceptual Ink Hierarchy:** Pair perceptual lightness separation (`#45210E` primary `L=0.268` vs. `#5E4436` muted `L=0.412`, `APCA Lc ≥ 77` on neutral/soft/middle surfaces and `Lc ≥ 75` per-pack on deep surfaces) with deliberate weight steps (`400` prose/cells vs. `600/700/800` headings, buttons, and KPI numerals).
2. **Spacing & Grouping:** Enforce internal-padding `<` sibling-gap `<` section-gap (`12–24px` card padding `<` `16–20px` grid gap `<` `56–80px` page section rhythm) across every viewport — zero viewport-carveout `@media` hacks.
3. **Component Proportions & Density:** Standardize primary interactive controls on the `44px` comfortable touch floor (`36–38px` in explicit compact toolbars, expanding to `44px` under `@media (pointer: coarse)`), with aligned `6px` label-to-control `.cs-field` gaps.
4. **Layout Grids & Content Widths:** Symmetric multi-column card grids (`repeat(3, minmax(0, 1fr))`), `min-inline-size: 0` flex/grid children, and `overflow-wrap: anywhere` on headings/subtitles so `320px` viewports and long Vietnamese/compound strings never clip or overflow.
5. **Color Emphasis, Warm Hue Constancy & Surface Hierarchy:** Rotate darkened Thổ ochre toward warm roasted amber (`62°`, `#A4631E` Light / `#7D480C` Dark) to prevent Bezold–Brücke olive shift; keep Ochre `#F4BA17` selective; invert CTA tokens (`#FFFDF8` / `--cs-accent-on-strong`) when placing buttons onto `#45210E` or `--cs-accent-strong` banners; and ensure `[data-cs-style="matte-paper"]` renders strictly opaque zero-blur editorial paper.
6. **Borders, Radii, Shadows & Optical Corrections:** Separate passive container hairlines (`--cs-color-border-default`, `1.24:1`) from interactive input borders (`--cs-component-textfield-border-default`, `2.33:1`), unify Light elevation shadows onto warm brand Umber `rgba(69, 33, 14, ...)`, and maintain concentric radii (`8px` controls inside `14–16px` cards) with `2px` dual-ring focus offset.

---

## 7. Summary of Outward Implementation Changes

1. **Layer 0 — Token Foundations & Generators (`tokens/`, `scripts/`):**
   - [`tokens/colors.css`](../tokens/colors.css), [`scripts/generate-element-packs.mjs`](../scripts/generate-element-packs.mjs), [`scripts/lib/theme-resolver.mjs`](../scripts/lib/theme-resolver.mjs): Lightened Light `--cs-color-text-muted` (`#3F2D21 → #5E4436`) with per-pack `APCA ≥ 77` solver channels; rotated `pinThoStudio` Light & Dark `--cs-accent-strong` to `62°` (`#916D11 → #A4631E` Light, `#795800 → #7D480C` Dark).
   - [`tokens/elevation.css`](../tokens/elevation.css): Harmonized Light `--cs-shadow-md` and `--cs-shadow-xl` to `rgba(69, 33, 14, 0.14/0.24)`.
2. **Layer 1 — Shared Base CSS, Native Mirrors & Style-Pack Rules (`base/`, `examples/native/`):**
   - [`base/components.css`](../base/components.css), [`base/forms.css`](../base/forms.css), [`base/controls.css`](../base/controls.css), [`base/collections.css`](../base/collections.css), [`base/navigation.css`](../base/navigation.css), [`base/ai.css`](../base/ai.css), [`base/data.css`](../base/data.css), [`base/glass.css`](../base/glass.css), [`examples/native/`](../examples/native/): Locked `.cs-button:hover` tokens, aligned `.cs-native-select-field`, refined `.cs-switch` border/focus, upgraded `11` controls to `2.33:1` input borders + `2px` focus offset + `<=360px` containment (`+6` focus probes in `focus-indicator-cases.mjs`), raised always-dark `CodeBlock` (`--cs-code-muted`) and `Terminal` (`--cs-term-muted`) muted ink + SwiftUI/Compose/Flutter native constants from `#c9b7a3` (`APCA Lc 62.8–64.3`) to `#e9d6c2` (`APCA Lc 81.2–83.0`) with `color-scheme: dark`, raised `.cs-breadcrumb__sep` `/` separators to `--cs-color-text-muted` (`APCA Lc >= 77`), fixed `.cs-typing` grid width and `.cs-card` `320px` wrapping, and enforced `matte-paper` zero-blur + nested `liquid-glass` restoration on `.cs-aurora` and `.cs-dock`.
3. **Layer 2 — Guideline/Component Specimens & Entrance Prose (`guidelines/`, `components/data/data.card.html`, `README.md`, `scripts/`):**
   - [`guidelines/atomic-view.html`](../guidelines/atomic-view.html), [`guidelines/colors-surfaces.html`](../guidelines/colors-surfaces.html), [`guidelines/colors-text.html`](../guidelines/colors-text.html), [`guidelines/elements-components.html`](../guidelines/elements-components.html), [`guidelines/brand-imagery.html`](../guidelines/brand-imagery.html), [`guidelines/elements-concept.html`](../guidelines/elements-concept.html), [`guidelines/motion.html`](../guidelines/motion.html), [`guidelines/responsive-bilingual.html`](../guidelines/responsive-bilingual.html), [`components/data/data.card.html`](../components/data/data.card.html), [`scripts/guideline-hex-policy.json`](../scripts/guideline-hex-policy.json), [`scripts/guideline-translations.json`](../scripts/guideline-translations.json): Fixed Dark-mode `1.00:1` blank CTAs and `1.09:1`–`1.41:1` white-on-white cards in `colors-surfaces.html` and `elements-components.html`, fixed `1.23:1` dark-on-dark `text-inverse` `Aa` chip and `#5E4436` label in `colors-text.html`, replaced neutral-root `--cs-accent-tint` Dark cream-on-cream (`APCA Lc 13.8`) specimen fills in `data.card.html` and `atomic-view.html` with `--cs-color-surface-raised`, raised Dark accent copy in `motion.html` and `responsive-bilingual.html` to `--cs-color-text-accent` (`APCA Lc >= 75.3`), added Umber fallback and warning-bar scrim in `brand-imagery.html` and `elements-concept.html`, anchored `portal={false}` Popovers and `matte-paper` `.toolbar` in `atomic-view.html`, and aligned `README.md` + `docs/vi/entrypoints/README.md` (`#3F2D21 → #5E4436`).
4. **Layer 3 — Screen, Deck, Email & DOCX Export Templates (`templates/` & `scripts/`):**
   - [`templates/kitchen-sink.html`](../templates/kitchen-sink.html), [`templates/playground.html`](../templates/playground.html), [`templates/ai-cluster-demo.html`](../templates/ai-cluster-demo.html), [`templates/dashboard/Dashboard.dc.html`](../templates/dashboard/Dashboard.dc.html), [`templates/app-shell/AppShell.dc.html`](../templates/app-shell/AppShell.dc.html), [`templates/marketing-page/MarketingPage.dc.html`](../templates/marketing-page/MarketingPage.dc.html): Fixed card padding, `16px` AI rhythm, high-contrast banner CTAs, KPI alignment, and `matte-paper` sticky bars.
   - [`templates/delivery-qbr-deck/DeliveryQbrDeck.dc.html`](../templates/delivery-qbr-deck/DeliveryQbrDeck.dc.html), [`templates/bod-deck/BodDeck.dc.html`](../templates/bod-deck/BodDeck.dc.html), [`templates/sales-proposal-deck/SalesProposalDeck.dc.html`](../templates/sales-proposal-deck/SalesProposalDeck.dc.html), [`templates/marketing-newsletter/MarketingNewsletter.dc.html`](../templates/marketing-newsletter/MarketingNewsletter.dc.html), [`templates/delivery-status-email/DeliveryStatusEmail.dc.html`](../templates/delivery-status-email/DeliveryStatusEmail.dc.html), [`templates/bod-investor-update/BodInvestorUpdate.dc.html`](../templates/bod-investor-update/BodInvestorUpdate.dc.html), [`templates/email/Email-VN-standalone.html`](../templates/email/Email-VN-standalone.html), [`templates/email-safe/*.html`](../templates/email-safe/), [`templates/_vendor/doc-export.js`](../templates/_vendor/doc-export.js), [`scripts/template-display-fields.json`](../scripts/template-display-fields.json): Fixed `1.14:1` QBR closing heading, harmonized deck kickers & KPI alignment, fixed `1.00:1`/`1.20:1` newsletter, delivery-status, and `Email-VN-standalone.html` email CTAs/badges, aligned all `7` standalone VML `email-safe` Light (`#6e5a4c → #5E4436`, `APCA Lc 84.3`) and Dark (`#c9b7a3 → #E9D6C2`, `APCA Lc 62.8 → 81.2`) `.muted` inks, and added `<br> → <w:r><w:br/></w:r>` OpenXML line-break serialization in `doc-export.js` (`_audit/ci/test-docx-mixed-content.mjs` verified across Chromium, Firefox, WebKit) after real LibreOffice `.docx` → PDF visual inspection revealed concatenated multi-line address/date blocks on `FinanceInvoice`.
5. **Layer 4 — Product UI Kits & Interactive Viewers (`ui_kits/`, `tokens/viewer.html`):**
   - [`ui_kits/website/site.css`](../ui_kits/website/site.css), [`work.html`](../ui_kits/website/work.html), [`careers.html`](../ui_kits/website/careers.html), [`chat.html`](../ui_kits/website/chat.html), [`ui_kits/status-hub/status.css`](../ui_kits/status-hub/status.css), [`project.html`](../ui_kits/status-hub/project.html), [`settings.html`](../ui_kits/status-hub/settings.html), [`login.html`](../ui_kits/status-hub/login.html), [`tokens/viewer.html`](../tokens/viewer.html): Removed `v2.1.0` `@media` hacks, integrated `#themeToggle`, eliminated double sidebar rail, refined `.card.hot` and `.facet select`, fixed `project.html` `#langToggle` contrast, enforced `matte-paper` opaque surfaces on `.wish input`, `.lumi-top`, and `.bar`, and added `#tablePanel { padding-block-end: 20px }` on `tokens/viewer.html` so narrow-viewport horizontal scrollbars never overlap the final row's `44px` copy buttons.
6. **Derived Artifacts & Reference Fixtures Synchronized:** Rebuilt `256` standalone DTCG & native Swift/Kotlin/Dart mode packs, `styles.css`, `dist/`, `_ds_bundle.js`, `components/*.json`, `DESIGN.md`, `_audit/state-machines.*`, and reference fixtures (`a01-theme-mirrors/{colors,elevation}.css`, `a01-elements-before.css`, `theme-colocated.json`, `theme-component-colocated.{json.gz,linux.json.gz}`, and Linux `_audit/baselines/*.png`).

---

## 8. Separated Verification, Visual Assessment & Human Approval Outcomes

### 8.1 Outcome A — Technical Verification (Executed & Verified)

- **Canonical Build, Token & Freshness Prechecks (`npm run build && npm run build:check && npm run tokens:check`):** `PASS` (`0` errors; `256` standalone mode documents + native packs fresh; `129/129` `D1–D20` audit benchmarks at `10.0/10`; `192/192` token contrast cells; `100%` JSX `.cs-*` CSS hook coverage; `110` Atomic story modules).
- **Security Audits (`npm run security:audit` & `npm run security:audit-python`):** `PASS` (`0` advisories across pinned npm lockfile and Python font/PDF verification toolchain).
- **Fast Audit Gate Board (`_audit/run.html`) & Whole-Set Overflow Audits (`responsive-overflow.html`, `language-overflow.html`, `theme-overflow.html`):** `PASS` (`42/42` hard gates + `docs-consistency.html` + `bilingual-parity.html` + all three whole-set viewport/language/theme sweeps).
- **Storybook & Public Site Build (`npm run build:site`, `test:public-site`, `test:site-csp-browser`, `test-storybook-runtime-browser`, `test-component-scenario-stories-browser`, `test-storybook-freshness`):** `PASS` across Chromium, Firefox, and WebKit.
- **Cross-Engine Portable Unit Suite (`npm run test:unit`):** `PASS` (`435/435` suites across shards `1/4`–`4/4` on Chromium, Firefox, and WebKit, including `55,080` body-text contrast rows, `131,328` focus-indicator cases, `36,864` axis-scope cases, `15,660×3` component theme-scope cases, deck contrast, email/newsletter contrast, and paper contrast).
- **Linux Pixel CI (`_audit/ci/pixel-diff.mjs` in `mcr.microsoft.com/playwright:v1.62.0-noble`):** Pre-update diff inspection confirmed drift occurred exclusively on intentional token/banner targets; refreshed Linux `909×540` baselines verified at `16/16` (`0.000%` drift, `drifted=[]`).
- **Native Swift Compiler, Cross-Element/Compact/Zoom Sweeps & Real LibreOffice `.docx` Print Verification (Phase 3):** Compiled and executed `tokens/native/CSModes.swift` via Apple `swiftc 6.4.2` (`test-native-mode-swift.mjs`: `49,664` getter observations, `256` omission lists, `1,584` axis requests, `2` compile-negative proofs) + `swift build --package-path examples/native/swiftui` (`exit 0`); swept `104` non-Thổ (`Kim`, `Mộc`, `Thuỷ`, `Hoả` + `tho.sand`) × Light/Dark product-page permutations (`0` contrast/overflow issues), `data-density="compact"` + `prefers-contrast: more` + `200%` font scaling (`0` overflow), `@media print` across all `63` print templates (`0` geometry defects), and real LibreOffice (`soffice --headless --convert-to pdf`) `.docx` exports (`bod-report`, `finance-invoice`, `legal-msa`, `vn-labor-contract`, `vn-offer-letter`).
- **Release Readiness Plan (`scripts/prepare-release.mjs --version 2.9.0`):** `test-component-lifecycle.mjs` (`125` exports reviewed) and `test-release-compatibility.mjs` pass with `0` lifecycle/compatibility blockers; `VERSION` is `2.8.0` (so `1.9.0` is SemVer-invalid; next minor is `2.9.0`), with clean git commit, human visual/AT sign-off, GitHub CI check-runs, and manual OIDC workflow dispatch remaining before publication.

### 8.2 Outcome B — Visual Assessment (Observed Improvements & Remaining Trade-Offs)

- **Observed Improvements:** Restored clear primary-vs-muted ink hierarchy (`#45210E` vs. `#5E4436`) and regular `400` vs. `700/800` weight contrast; eliminated Bezold–Brücke olive cast on Thổ `--cs-accent-strong` in both Light (`#A4631E`) and Dark (`#7D480C`); unified warm Umber elevation shadows; enforced genuine zero-blur opaque editorial surfaces in `matte-paper`; resolved `1.14:1` dark-on-dark QBR deck closing heading and `1.00:1`/`1.20:1` invisible email CTAs/pills; restored Website `1280×820` fold budget (`4,585px → 2,893px`); unified `2.33:1` input borders and `0px` peer alignment; and eliminated `320px` horizontal overflow (`0px`).
- **Remaining Visual Trade-Offs:**
  1. On the `5` deep element packs (`tho.clay`, `hoa.lava`, `thuy.ocean`, `moc.forest`, `kim.steel`), Light `--cs-color-text-muted` automatically darkens (`#442B1E`–`#284032`) so `APCA Lc ≥ 75` holds on `15%`-tinted raised surfaces; hierarchy in deep packs continues to lean primarily on weight and scale.
  2. Document/A4 statutory templates (`vn-*`) prioritize authentic Vietnamese legal paper margins and fixed print geometry over fluid mobile reflow; horizontal scrolling inside `320px` viewports on print-sheet previews is an intentional paper-preview trade-off.

### 8.3 Outcome C — Human Approval Required (Explicit Owner Decisions)

Agent judgment does **not** constitute product-owner approval. The following items require explicit human owner review:

1. **Intentional Foundation Token & Baseline Updates (`tokens/{colors,elevation,elements}.css` + `_audit/baselines/*.png`):** Review and sign off on the perceptual palette refinements (`#5E4436` Light muted ink, `#A4631E`/`#7D480C` `62°` roasted-amber Thổ `--cs-accent-strong`, warm Umber `md`/`xl` shadows) and refreshed `909×540` Linux baselines (archived `before`/`after` specimens in `_audit/exports/visual-audit-2026-11/`); when merging on GitHub, confirm against the canonical `ubuntu-latest` `pixel-baselines-linux` CI artifact (`_audit/baselines/README.md`).
2. **Manual Assistive Technology & Physical Device Acceptance:** Screen-reader listening (VoiceOver, NVDA, JAWS) across Vietnamese + English mixed copy and physical mobile touch ergonomics remain human acceptance gates per `docs/doctrine.md`.
