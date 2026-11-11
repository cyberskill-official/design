<!-- BEGIN GENERATED ENTRY LANGUAGE ROUTE v1 -->
**Tiếng Việt:** [Đọc hướng dẫn đầy đủ](docs/vi/entrypoints/README.md) · **English:** full original guidance follows below.
<!-- END GENERATED ENTRY LANGUAGE ROUTE v1 -->

# CyberSkill Global Design System

> **Turn Your Will Into Real — Hiện Thực Hoá Ý Chí**

[![Design System Gates](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml)

A warm, enterprise-grade, **Vietnamese-first** design system for **CyberSkill** — a Saigon software studio (est. 2020) that turns a clear *wish* into working software. Anchored on **Umber** and **Ochre**, guided by **Lumi** the golden genie, every surface resolves four independent axes: **Theme** (light · dark · system) × **Element** (Ngũ Hành product identity: Kim · Mộc · Thủy · Hỏa · Thổ, 15 variants) × **Language** (VI · EN) × **Style** (`data-cs-style` — **liquid-glass** default, absent ≡ default · **matte-paper** opaque crisp paper surfaces). Consumers link one file: **`styles.css`** (`dist/styles.css` is the same closure flattened into one file for environments that don't follow `@import` chains (card renderers, some sandboxes); regenerate with `npm run build:css` after editing `tokens/` or `base/`).

---

## Start here

This is the **entrance document** for the CyberSkill Design System — source checkout VERSION **<!-- cs-source-version:checkout -->2.8.0<!-- /cs-source-version -->** (see `VERSION`; this does not establish registry availability). The **product site** is Storybook at **`/`** on `design.cyberskill.world` (host-only; local: `npm run storybook`). Operator documentation is published in the Storybook **Docs** sidebar and the Documentation Library at `/docs/viewer.html` (legacy `/dashboard`, `/dashboard.html`, and `/playground/*` redirect to `/`).

### Quick start by audience

- **Designers** — open Storybook (**Foundations / Components / Templates / Pages / Docs**). **Templates** lists all <!-- cs-count:templates -->85<!-- /cs-count --> starting points (Gallery → Atomic View, plus category stories including the 38-document VN A4 suite (Employment Suite + commercial framework) under **Templates → HR**). Flip Theme × Element × Language × Style live via the Storybook toolbar, Atomic View, and the Elements Geometry specimen.
- **Browser template authoring** (static HTTP server) — read `SKILL.md` (runtime routing + design constraints), then the guide below; compose with `styles.css` + compiled ESM `@cyberskill/design` (`dist/esm/_esm/react.mjs`; raw JSX via `@cyberskill/design/source`) / legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve). The shipped `support.js` interprets `*.dc.html` in a browser; see `docs/template-grammar.md` for grammar and host-only boundaries. Component contracts live beside each component (`.d.ts` + `.prompt.md`).
- **Static / open-spec** (e.g. Google Stitch) — start at **`DESIGN.md`** (generated open-spec) → `llms.txt` → `tokens/tokens.dtcg.json`. Build **static** UI with `styles.css` + `.cs-*` / kitchen-sink / `examples/static-hello/`. Use `.dc.html` through the shipped interpreter or a grammar-aware tool; plain HTML tools consume `.cs-*` or a verified rendered snapshot.
- **Implementers** — published stable npm package **`@cyberskill/design@2.8.0`** (see `docs/consuming.md`; grant in `docs/consumer-grant.md` — still UNLICENSED). **Next/SSR:** `import { Button } from "@cyberskill/design"` (peer React). **Browser demo:** **`examples/npm-hello/`** (Lumi · Hỏa · plasma, legacy `_esm/cs.mjs`). Or link **`styles.css`** from a clone/subtree (one file = everything), or copy a `templates/<slug>/` folder and edit one line in its `ds-base.js` (one-line rebind, validated end-to-end Jul 2026). Scope identity with `data-theme` · `data-cs-element` (+`data-cs-variant`) · `lang`. Release signal: tip SHA + `docs/release-notes.md` (source VERSION is **<!-- cs-source-version:release-signal -->2.8.0<!-- /cs-source-version -->**; no CHANGELOG).
- **Maintainers** — `docs/doctrine.md` (expansion + verification), then `CONTRIBUTING.md` and `docs/quality-gates.md`.

### Document map — consumers

| Doc | What it answers |
|---|---|
| `README.md` (this file) | The full guide: anchors, voice, visual foundations, components, templates, repository index |
| `DESIGN.md` | **This repo's** generated open-spec surface (Stitch-style) — doctrine + every token value + inventory, from DTCG; regenerate via `npm run build:design-md`. Do not hand-edit. |
| `SKILL.md` | Agent entry — runtime routing + design constraints |
| `docs/consuming.md` | Adopting & upgrading — DC-capable vs static dual path, npm package name, axes, upgrade + extend |
| `docs/consumer-grant.md` | Written npm consumer grant (CyberSkill portfolio; UNLICENSED + named products) |
| `docs/conventions.md` | How to extend the system (naming grammar, checklists, the four axes) |
| `docs/release-notes.md` | Curated product highlights (not a changelog) |
| `docs/design-styles.md` | The live styling axes (Theme × Element × Language × Style) and surface material packs (liquid-glass · matte-paper) |
| `docs/products.md` | Product → element registry (**locked** — do not invent assignments) |
| `docs/contrast-report.md` | Generated APCA elemental sweep — 0 failures at its Lc ≥ 60 UI-label floor. Body text authors to the stricter Lc ≥ 75 floor (see Anchor immutables); the sweep's Lc ≥ 60 rows are accent/label pairings, not body text. |
| `docs/template-schema-v2.md` | Typed content-slot spec for templates — opt-in, machine-checkable |
| `docs/deploy.md` | Deploying the live site — GitHub Pages (`.github/workflows/pages.yml`) · Vercel · generic VPS/nginx · post-deploy checklist |
| `docs/live-hub.md` | Storybook at `/` is the product surface; surface map |
| `docs/storybook.md` | Host Storybook product surface at `/` — Docs sidebar is the published reading surface |
| `docs/figma.md` | Figma / Tokens Studio import recipe for consumers and maintainers |
| `docs/vi/*.md` | Vietnamese mirror of every operator-facing `docs/*.md` (toggle EN\|VI in `docs/viewer.html`; paired entry translations live under `docs/vi/entrypoints/`) |

### Document map — maintainers

| Doc | What it answers |
|---|---|
| `docs/doctrine.md` | Expansion rule, verification depth, immutables (host files such as `CLAUDE.md` are shims) |
| `docs/decisions.md` | Recorded owner decisions + open maintainer tasks |
| `docs/ci-cd.md` | CI/CD automation — GitHub Actions workflow, headless gate runner, token-provenance pre-check, badge |
| `docs/quality-gates.md` | Benchmark reference — every quality gate, what it asserts, pass criterion, where it runs |
| `docs/sync.md` | Repo ↔ authoring-environment round-trip fidelity & two-way sync |

### Sources & upstream repositories

- **Source of truth:** `cyberskill-official/design` holds all tokens, React components, brand assets, templates, and verification gates.
- **Generated open-spec:** [`DESIGN.md`](DESIGN.md) is built from `tokens/tokens.dtcg.json` + `_ds_manifest.json` by `npm run build:design-md` (`design-md-parity` pins it byte-for-byte).
- **Related CyberSkill repos:** Marketing site (`https://github.com/cyberskill-official/landing-page`) and Audit framework (`https://github.com/cyberskill-official/design-system-audit-framework`).

---

## Anchor immutables

<!-- BEGIN DOCTRINE IMMUTABLES -->
| Immutable | Value |
|---|---|
| Slogan | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| Primary brand | Umber `#45210E` |
| Primary accent | Ochre `#F4BA17` |
| Voice | warm · direct · honest · respectful (all four at once) |
| Language | Vietnamese-first; every UI string ships an EN + VN pair |
| Accessibility floor | APCA Lc ≥ 75 body text; focus rings never removed; ≥ 44px touch targets |
| Axes | Theme × Element × Language × Style (independent) |
| Style pack | liquid-glass (default; absent ≡ default) · matte-paper |
<!-- END DOCTRINE IMMUTABLES -->

---

## Content & voice fundamentals

**Voice is a four-axis chord, sounded all at once:** *warm · direct · honest · respectful.* Never "fun/playful/edgy" — that is explicitly off-brand.

- **Warm, human, second-person.** Speak to "you"; the studio is "we". Lumi speaks as "I". Copy is gentle and encouraging, never corporate (e.g. *"Lovely. What should I call you?"*, *"The lamp is resting for a moment."*).
- **Direct and concrete.** Short sentences, plain outcomes, no hedging (e.g. *"Send a short note. We reply within one business day."*, *"Built to ship, and built to last."*).
- **Honest about trade-offs.** The brand advertises candour: *"senior, small, and honest about trade-offs."* Risks are stated in words, never hidden or colour-only.
- **Respectful of consent & privacy.** Ask before contacting; promise not to share (e.g. *"Your details go straight to the team. We never share them."*).
- **The "wish" metaphor is the spine.** Products are *wishes*; Lumi (a golden genie) *grants* them by handing them to a real human team. Verbs: *make a wish, grant, shape it, ship, last.* Use it warmly, never gimmicky.

**Casing & mechanics:** Sentence case for headings and buttons (*"Make a wish"*, *"Tell us your wish"*). UPPERCASE + wide tracking only for small eyebrows/labels/table headers. Titles avoid trailing punctuation; body uses full stops. Numerals as digits (*"one business day"* in prose is fine, but *"3 business days"* for concrete SLAs). Em dashes for asides.

**Bilingual (Vietnamese-first):** Every user-facing string has an EN + VN counterpart or an explicit deferral note. VN is a first-class citizen, not a translation afterthought — diacritics are preserved everywhere (*Nguyễn Hoàng Vũ*, *Hiện Thực Hoá Ý Chí*). Vietnamese-safe line-heights (body 1.5 / heading 1.35) leave room for stacked marks.

**Emoji:** **Not used** in product UI or brand copy. Meaning is carried by words and the line-icon set, not emoji. (The mascot and the sparkle "wish" glyph do the affective work.)

---

## Visual foundations

- **Palette — warm earth, never cold.** Umber `#45210E` grounds everything (it *is* the primary text colour); Ochre `#F4BA17` is the single accent — CTAs on dark, focus rings, highlights, the genie. Surfaces are warm paper: page `#FFFDF8`, panel `#FFFFFF`, raised `#FBF4E9`. Every neutral is warmed toward umber — borders are `#E7D9C6`, muted text `#5E4436`. Semantic colours (success `#166534`, danger `#B42318`, warning `#92400E`, info `#1D4ED8`) are used sparingly and never as the only signal. **Max one accent per surface** — on core surfaces that accent is Ochre; a *product* may swap in its element accent, never add a second hue beside it. No bluish-purple gradients.
- **Typography.** UI: **Be Vietnam Pro** (300–800; a Vietnamese-first Google family) — the default for every surface, headings included. Display/headline: **Space Grotesk** (variable 300–700), the **opt-in** face behind `--cs-font-family-display`; nothing points at it until a scope opts in with `.cs-display-face`, which retargets `--cs-heading-family` and leaves body copy on the UI face. Code/data: **JetBrains Mono**. Display headings are heavy (800 on the UI face; under `.cs-display-face`, Space Grotesk tops out at 700 so 800 clamps within that family), tight tracking (−0.02em); body is 400/500 at 1.5. Uppercase eyebrows at 0.08–0.12em tracking. The size ramp runs xs 12 → 5xl 60 on a 16px base.
- **Spacing & layout.** 4px base grid; section padding lives between 64 and 96px; content max-width ~1200–1320px. Generous, calm whitespace.
- **Corners & cards.** Radii: sm 4, md 8 (default), **lg 14 (cards/panels)**, full 999 (pills, inputs, chips). A default card = white panel, 1px warm border `#E7D9C6`, 14px radius, soft warm shadow. No coloured-left-border cards.
- **Surfaces — Liquid Glass (the default treatment).** Five materials over the anchors: **Whisper** (hero washes), **Light** (nav/sidebar), **Standard** (cards over imagery), **Heavy** (modals/popovers), **Solid** (dense content, tables). Glass = `color-mix` translucency + `backdrop-filter` blur/saturate + a 1px lens-edge gradient. It is **opt-in and additive** — apply a `cs-surface-*` class after checking APCA against the backdrop; dense content stays Solid. Collapses to solid under `prefers-reduced-transparency`, `forced-colors`, print, and unsupported browsers. Surfaces resolve **Theme × Element × Language × Style** independently.
- **Shadows & depth.** Shadows are warm and umber-tinted (`rgba(69,33,14,…)`), a soft five-step scale from `xs` hairline to `xl` dialog lift. Depth is an explicit z-scale mapped to glass tiers: bg 0 → section 5 → card 10 → nav 50 → dropdown 60 → overlay 80 → modal 100 → toast 200.
- **Backgrounds & imagery.** Deep-umber darks glow with **warm gold particle light** (`aurora-tho.webp`), never cold or flat — each element carries its own wash (`assets/aurora-{tho,hoa,thuy,moc,kim}.webp`, applied via the `.cs-aurora-wash` overlay class; Thổ's is the official gold). Full-bleed umber sections anchor heroes, careers bands, and footers. The mascot, **Lumi**, is a polished golden genie rendered on transparent backgrounds.
- **Elemental product identity — Ngũ Hành.** The studio itself is **Thổ/Earth** (Umber + Ochre); each CyberSkill *product* may take one element — **Kim** (metal) · **Mộc** (wood) · **Thủy** (water) · **Hỏa** (fire) · **Thổ** (earth) — via `data-cs-element` (+ `data-cs-variant`, e.g. Hỏa: ember · lava · plasma). Each pack sets the ten **`--cs-accent-*`** role tokens (accent / strong / bright / on / on-strong / tint / ink / glow / grad-a / grad-b) defined in `tokens/elements.css`; inside the scope the element fully takes Ochre's accent roles. Never elemental: semantic statuses, and the **composite focus indicator** (text-primary contour + ochre halo). Mixing follows the cycles: a secondary element may appear only as a gradient endpoint along **Tương sinh** (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc); **Tương khắc** pairs never mix. Product→element mapping lives in `docs/products.md`. Every template carries the Element tweak (`--cs-accent-*`, never raw hex). **Lumi stays golden in every element.**
- **Motion & interaction states.** Calm durations (120–320ms) with soft decelerate `cubic-bezier(0.2,0,0,1)`; `prefers-reduced-motion` reduces animation and transition durations to 0.01ms and disables smooth scrolling. Hover brightens ~8% (filled) or fills to `surface-raised` (subtle); press nudges 0.5–1px; focus preserves the **composite indicator** (2px text-primary contour + Ochre halo) as specified in `docs/doctrine.md`. Touch targets ≥ 44px on coarse pointers. Transparency & blur appear only on glass surfaces and the hero wish-input.

---

## Iconography & brand assets

CyberSkill ships **no external icon library**. It uses its own **in-repo line-icon set** (`TASK-DS-010`): each icon is data (a viewBox + primitive paths) rendered through one `<Icon>` component.

- **Style:** line icons, `currentColor` stroke, 1.75 weight, round caps/joins, 24×24 viewBox — sizes come from `--cs-icon-sm|md|lg` (16/20/24).
- **Inventory:** `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off`, extended in v2.0 with `search · sliders · upload · download · calendar · user · plus · trash · external · menu` and in v2.13 with `chevron-down/up/left/right · edit · copy · info · alert-triangle`. `sparkle` is the brand's **"wish"** glyph. **No emoji** and no unicode-glyph icons in product UI.
- **Master brand artwork:** `assets/` holds `logo-mark.svg` / `logo-mark.png` (official master mark, Umber ground + Ochre genie), `favicon.svg`, `aurora-tho.webp` (`aurora-gold.jpg` kept as a sample still), and `lumi-poster.webp`. **Never recreate, recolour, or approximate the master logo;** for third-party tenants, swap the tenant's own logo.

---

## Components

<!-- BEGIN CATALOG COMPONENT INVENTORY -->
Generated from the public source catalog and actual Atomic story AST. **125 exports across 9 import groups**; kinds include components, constants and hooks. Inventory membership is not semantic or human acceptance.

- **AI-native** — `AIDisclosureBadge`, `ChatMessage`, `CitationList`, `ConfidenceMeter`, `HumanReviewGate`, `PromptInput`, `PromptSuggestions`, `TypingIndicator`

- **Data & layout** — `Accordion`, `AspectRatio`, `Avatar`, `AvatarGroup`, `Card`, `CardBody`, `CardFooter`, `CardHeader`, `Carousel`, `Chart`, `CodeBlock`, `Collapsible`, `Comment`, `DataGrid`, `DataTable`, `DescriptionList`, `Divider`, `Image`, `Item`, `Kbd`, `List`, `ListItem`, `Masonry`, `QRCode`, `ScrollArea`, `Sortable`, `Splitter`, `Stat`, `Terminal`, `Timeline`, `Tooltip`, `Tree`, `TreeTable`, `Watermark`

- **Feedback & status** — `Alert`, `Badge`, `EmptyState`, `ProgressBar`, `Result`, `Skeleton`, `Spinner`, `StatusIndicator`, `Tag`, `Toast`, `ToastStack`

- **Overlays** — `AlertDialog`, `ContextMenu`, `Drawer`, `HoverCard`, `OverlayProvider`, `Popconfirm`, `Popover`, `Tour`

- **Navigation** — `Anchor`, `BackTop`, `Breadcrumb`, `CommandPalette`, `Dock`, `HotKeys`, `Link`, `Menu`, `MenuItem`, `Menubar`, `NavItem`, `NavigationMenu`, `Pagination`, `Sidebar`, `Steps`, `Tab`, `Tabs`, `Toolbar`

- **Core** — `Button`, `ButtonGroup`, `Dialog`, `FloatingActionButton`

- **Brand** — `CS_ICONS` (constant), `CS_LOGO_MARK_INNER` (constant), `CS_LOGO_VIEWBOX` (constant), `Icon`, `Logo`, `LumiAvatar`

- **Forms** — `Calendar`, `Cascader`, `Checkbox`, `ColorPicker`, `Combobox`, `DatePicker`, `EDITOR_SCHEMA` (constant), `Editor`, `FileUpload`, `Form`, `FormField`, `FormFieldArray`, `FormWizard`, `InlineEdit`, `InputGroup`, `InputOTP`, `Mentions`, `NativeSelect`, `NumberField`, `Radio`, `RadioGroup`, `Rating`, `SearchField`, `SegmentedControl`, `Select`, `Slider`, `Switch`, `TagInput`, `TextField`, `Textarea`, `TimePicker`, `Toggle`, `Transfer`, `TreeSelect`

- **Localization** — `LocaleProvider`, `useMessages` (hook)

**Observed Atomic compositions** — these lists derive from actual JSX render targets in the authored tier stories, including reused children. A target can occur in more than one tier. Context-only providers, constants and hooks do not imply standalone visual specimens.

- **Atom** — `AspectRatio`, `Avatar`, `AvatarGroup`, `Badge`, `Button`, `Divider`, `Icon`, `Item`, `Kbd`, `Link`, `Logo`, `LumiAvatar`, `ProgressBar`, `Skeleton`, `Spinner`, `StatusIndicator`, `Switch`, `Tag`, `Toggle`

- **Molecule** — `AIDisclosureBadge`, `Alert`, `Anchor`, `Avatar`, `AvatarGroup`, `BackTop`, `Badge`, `Breadcrumb`, `Button`, `ButtonGroup`, `Card`, `CardBody`, `CardFooter`, `CardHeader`, `ChatMessage`, `Checkbox`, `CitationList`, `CodeBlock`, `Collapsible`, `ColorPicker`, `Combobox`, `ConfidenceMeter`, `ContextMenu`, `DescriptionList`, `FileUpload`, `FloatingActionButton`, `HoverCard`, `Icon`, `Image`, `InlineEdit`, `InputGroup`, `InputOTP`, `List`, `ListItem`, `Mentions`, `Menu`, `MenuItem`, `NativeSelect`, `NumberField`, `Pagination`, `Popconfirm`, `PromptSuggestions`, `QRCode`, `RadioGroup`, `Rating`, `ScrollArea`, `SearchField`, `SegmentedControl`, `Select`, `Slider`, `Stat`, `Steps`, `Switch`, `Tabs`, `TagInput`, `TextField`, `Textarea`, `Toast`, `ToastStack`, `Toolbar`, `Tooltip`, `TypingIndicator`, `Watermark`

- **Organism** — `Accordion`, `AlertDialog`, `Avatar`, `Badge`, `Button`, `Calendar`, `Carousel`, `Cascader`, `Chart`, `ChatMessage`, `CommandPalette`, `Comment`, `DataGrid`, `DataTable`, `DatePicker`, `Dialog`, `Dock`, `Drawer`, `Editor`, `EmptyState`, `Form`, `FormField`, `FormFieldArray`, `FormWizard`, `HotKeys`, `HumanReviewGate`, `Icon`, `Kbd`, `LocaleProvider`, `Masonry`, `Menubar`, `NavItem`, `NavigationMenu`, `OverlayProvider`, `Pagination`, `Popover`, `PromptInput`, `RadioGroup`, `Result`, `Sidebar`, `Sortable`, `Splitter`, `Terminal`, `TextField`, `TimePicker`, `Timeline`, `Tour`, `Transfer`, `Tree`, `TreeSelect`, `TreeTable`
<!-- END CATALOG COMPONENT INVENTORY -->

- **Highlights:** **Button** — Umber primary; variants primary/secondary/tertiary/ghost/danger/danger-ghost; sizes xs–lg; loading, icon, fullWidth. **TextField / Textarea / Select / NativeSelect** share one `.cs-field` frame (label + description/error; diacritic/IME-safe). **DataTable** — caption, scoped headers, per-column render, idle/loading/error/empty triad. **Card** — warm panel + header/body/footer. **Logo** renders the exact official mark; **Icon** drives the in-repo line-icon set. The **AI-native** family carries the brand's explainability doctrine — disclosure, human review, wish capture, and confidence, all stated in words (never colour alone).
- **Install / package name:** The package name is **`@cyberskill/design`** (source checkout VERSION **<!-- cs-source-version:package-source -->2.8.0<!-- /cs-source-version -->**; grant in `docs/consumer-grant.md` governs *use* — package remains UNLICENSED). Do **not** install `@cyberskill/react` for this tree — that name is historical marketing-site inventory, not this package.
- **Source inventory vs. extensions:** An earlier CyberSkill surface shipped six primitives — `Button`, `TextField`, `Dialog`, `DataTable`, `AIDisclosureBadge`, `HumanReviewGate` — plus a brand `Logo`. Everything else in **this** package is an **intentional extension** built in the brand's own token vocabulary so consumers have a complete working kit: `Icon`, the standard Forms / Feedback / Data / Navigation / Overlays primitives, added AI-native pieces (`PromptInput`, `ChatMessage`, `ConfidenceMeter`, `PromptSuggestions`, `TypingIndicator`, `CitationList`) that formalise the Lumi wish-flow, and the `LumiAvatar` mascot.

---

## Templates

Copyable starting points for consuming projects (`templates/<slug>/`, each loading this system via a sibling `ds-base.js`):

- **Marketing page** (`templates/marketing-page/`) — bilingual landing: umber hero with a `PromptInput` wish box, service cards, process band, Lumi chat launcher.
- **Dashboard** (`templates/dashboard/`) — Status-Hub-style portfolio: KPI `Stat`s, `Tabs` board/table lenses, status cards with `ProgressBar` + `Badge`, and a `DataTable`.
- **Slide deck** (`templates/slide-deck/`) — 16:9 brand deck: umber title + closing, ochre accents, light content layouts.
- **Sign in** (`templates/auth/`) — split auth: umber brand panel + form (`TextField`, `Switch`, `Button`).
- **Settings** (`templates/settings/`) — `Tabs`, form fields, switches, and a danger zone.
- **App shell** (`templates/app-shell/`) — `Sidebar` nav, topbar with `SearchField`, KPI `Stat`s, and a `DataTable`.
- **Article** (`templates/article/`) — long-form post: title, author meta, prose, `Alert` callout, `CodeBlock`.
- **Email** (`templates/email/`) — centred 600px announcement: umber header, ochre CTA, footer.

Every template declares the **Element (Ngũ Hành)** selector (15 variants). The source catalog declares <!-- cs-count:templatesWithBooleanControl -->15<!-- /cs-count --> templates with at least one boolean control and <!-- cs-count:templatesWithoutBooleanControl -->70<!-- /cs-count --> without one; <!-- cs-count:templatesWithThemeControl -->16<!-- /cs-count --> templates declare a Theme control, while <!-- cs-count:templatesWithoutThemeControl -->69<!-- /cs-count --> do not. Letter-print business documents remain light-only under the print doctrine.

### Team artifact templates

Branded `.dc.html` documents, emails, reports, and decks across **Tech, Team, HR, Board, Marketing, Culture, Delivery, Legal, Finance, Sales** (counsel-gated drafts ship banner-marked):

- **Tech** — `tech-release-notes` (release email), `tech-incident-report` (blameless postmortem), `tech-rfc` (design doc).
- **Team** — `team-meeting-agenda` (time-boxed items, owners, decisions log, ground rules).
- **HR** — `hr-announcement` (team-news email; offer letter, onboarding checklist, and job description live in the Employment Suite as `vn-offer-letter`, `vn-onboarding-checklist`, and `vn-job-description`).
- **Board** — `bod-report` (quarterly review), `bod-deck` (16:9 board deck), `bod-memo` (one-page exec memo).
- **Marketing** — `marketing-campaign-brief`, `marketing-newsletter`, `marketing-launch`, `marketing-case-study`, `marketing-press-release`.

### Business, legal & sales templates

Print-ready Letter documents (`@page` + `@media print`, 0.6in margins) and client decks:

- **Legal** — `legal-msa` (master services agreement), `legal-sow` (statement of work; standalone mutual NDA lives in the Employment Suite as `vn-mutual-nda`).
- **Finance** — `finance-invoice` (line items in đồng, VAT, total, bank details), `finance-quote` (scoped estimate with accept CTA).
- **Sales** — `sales-one-pager` (leave-behind), `sales-proposal-deck` (8-slide 16:9 client proposal).

**Template language is scoped.** The source catalog declares <!-- cs-count:templatesWithLanguageControl -->44<!-- /cs-count --> entries with a Language control and <!-- cs-count:templatesWithoutLanguageControl -->41<!-- /cs-count --> without one. Legal and finance documents expose Vietnamese text as an **unreviewed draft** where indicated; retain the governing-language warning and obtain content-owner review before real use.

### Reference documents (govern every template)

- **Documents · Style Guide** (`templates/doc-style-guide/`) — presentation standard (Articles 1–10) plus **Article 11 — scope & archetypes**.
- **Documents · Suite Index & Usage Guide** (`templates/doc-suite-index/`) — Part I catalogues every template by group; Part II covers the employment lifecycle, presentation rules, and 8-step template workflow.
- **Documents · Templates** (`templates/doc-templates/`) — Part A blank A4 bilingual shell; Part B archetype map.

### HR & Employment Suite (client-supplied)

Thirty-eight bilingual A4 instruments (**thirty-seven** Employment Suite docs plus **`vn-framework-agreement`** commercial framework) live under `templates/vn-*/` (see `docs/hr-suite-sources.md`). They follow the A4 Vietnamese-first bilingual house standard (Ink `#1A1614` VN over Slate `#26323A` italic EN pairs, state-motto header, umber table title bars, yellow fill-in blanks, PDPL data-hygiene, non-splitting signing blocks). **`vn-labor-contract`** supersedes `legal-employment-contract`, and `vn-mutual-nda` / `vn-offer-letter` / `vn-onboarding-checklist` / `vn-job-description` supersede `legal-nda` / `hr-offer-letter` / `hr-onboarding` / `hr-job-description`.

- **Compensation & rewards** — `vn-total-rewards-appendix`, `vn-phantom-stock`, `vn-salary-scale`, `vn-compensation-regulation`.
- **Policies & regulations** — `vn-internal-labor-regulations`, `vn-disciplinary-schedule`, `vn-performance-evaluation-regulation`, `vn-grassroots-democracy`, `vn-code-of-conduct`, `vn-infosec-policy`, `vn-data-protection-policy`, `vn-remote-work-policy`, `vn-travel-expense-policy`.
- **Hiring & records** — `vn-job-description`, `vn-onboarding-checklist`, `vn-receipt-acknowledgement`, `vn-labour-management-book`, `vn-foreign-employee-pack`, `vn-pdpl-consent`.
- **Performance & requests** — `vn-performance-review-form`, `vn-employee-request`.
- **Outside relationships** — `vn-internship-agreement`, `vn-contractor-agreement`, `vn-sow-appendix`, `vn-mutual-nda`.
- **Commercial / client framework** — `vn-framework-agreement` (counsel-gated).
- **Discipline & exit** — `vn-disciplinary-case-file`, `vn-resignation-letter`, `vn-certificate-of-employment`, `vn-training-commitment`.

### Component & archetype coverage maps

| Component group | Exercised by templates |
|---|---|
| **Core** (Button, Dialog) | marketing-page · auth · settings · sales-one-pager · finance-quote |
| **Forms** (TextField, Select, Switch, SearchField…) | auth · settings · app-shell |
| **Data & layout** (Stat, DataTable, Card, Avatar, Divider) | dashboard · app-shell · bod-report · sales-proposal-deck · hr-announcement |
| **Feedback & status** (Badge, Alert, ProgressBar) | dashboard · bod-report · bod-memo |
| **Navigation** (Tabs, Sidebar, NavItem) | dashboard · app-shell · settings |
| **AI-native** (AIDisclosureBadge, PromptInput) | marketing-page · bod-report |
| **Brand** (Logo, Icon, LumiAvatar) | every template |

| Archetype (`templates/doc-templates`) | Frame | Templates |
|---|---|---|
| **A4 bilingual instrument** | State-motto header · Articles · Party A/B tables · signing block; Style-Guide 1–10 in full | the 38 `vn-*` A4 instruments |
| **Letter print doc** | Letter, 0.6in margins, desk + sheet, clean Print/PDF | `finance-invoice` · `finance-quote` · `finance-expense-report` · `legal-msa` · `legal-sow` · `sales-one-pager` · `bod-*` docs |
| **Email (600px)** | Centred body, system header/CTA, no motto/signing; bilingual via Language tweak | `email` · `hr-announcement` · `marketing-newsletter` · `tech-release-notes` · `delivery-status-email` · `finance-dunning-email` |
| **Product screen** | Components + tokens; Theme × Element × Language × Style; no print geometry | `marketing-page` · `dashboard` · `app-shell` · `auth` · `settings` · `article` |
| **Deck (16:9)** | Stacked 16:9 slides, umber cover, element accent, bilingual via Language tweak, browser print / host-dependent PPTX | `slide-deck` · `bod-deck` · `sales-proposal-deck` · `delivery-qbr-deck` |
| **Social image** | Fixed per-channel size (1080² · 1200×630 · 1080×1920) | `marketing-social-kit` |

---

## Repository layout & UI kits

```
styles.css                 ← single entry point (@import manifest only) · checkout version: see VERSION
tokens/                    fonts · colors · typography · spacing · elevation · motion · component-tokens · elements (Ngũ Hành packs)
base/                      reset · typography · components · forms · feedback · data · navigation · ai · controls · collections · shell · glass · interaction · a11y · responsive
components/                button · textfield · dialog · datatable · forms · feedback · data · navigation · overlays · ai · logo · icon · brand
                           (each Name: Name.jsx + Name.d.ts + Name.prompt.md; one *.card.html per group)
guidelines/                specimen cards (Colors · Type · Spacing · Surfaces · Brand · Motion · Elements · Responsive & Bilingual; default to English, `?language=vi` for Vietnamese) · atomic-view.html
templates/                 marketing-page · dashboard · slide-deck · auth · settings · app-shell · article · email (copyable .dc.html)
                           + team artifacts — tech (release/incident/rfc) · team (meeting-agenda) · hr (announcement) · board (report/deck/memo) · marketing (brief/newsletter/launch/case-study/press-release)
                           + business — legal (vn-mutual-nda / msa / sow; fictional legal-nda retired) · finance (invoice/quote) · sales (one-pager/proposal-deck) — letter print docs + client deck
                           + Documents (reference, govern all templates) — doc-style-guide · doc-suite-index (index & usage) · doc-templates (archetypes)
                           + VN A4 suite — bilingual Employment Suite + commercial framework agreement (`vn-framework-agreement`); counsel review before real use
ui_kits/status-hub/        Status Hub recreation (index · login · settings · project + status.css · data.js · StatusHub.jsx)
ui_kits/website/           cyberskill.world recreation (index · work · careers · chat + site.css · copy.js · Website.jsx)
ui_kits/deck/              brand deck on deck-stage (index.html; deck-stage runtime lives in templates/_vendor/, outside the compiled bundle; browser print; PPTX requires a compatible host exporter)
assets/                    logo-mark.svg/png · favicon.svg · aurora-{tho,hoa,thuy,moc,kim}.webp (+ sample aurora-gold.jpg) · lumi-poster.webp
docs/                      the full doc set (see Document map above) + viewer.html reader (EN|VI)
docs/vi/                   Vietnamese translations of every operator-facing docs/*.md
fonts/                     self-hosted Be Vietnam Pro + Space Grotesk + JetBrains Mono woff2 (latin · latin-ext · vietnamese)
thumbnail.html             project tile
SKILL.md                   Agent-Skills-compatible entry
```

- **VN A4 source inventory:** contains <!-- cs-count:vietnameseInstrumentTemplates -->38<!-- /cs-count --> bilingual instruments (`vn-*`), covering the Employment Suite and the commercial framework agreement. Obtain counsel review before real use.
- **UI kits:** **Status Hub** (portfolio dashboard, sign-in, settings, project detail), **cyberskill.world** (bilingual marketing home with Lumi chat, Work, Careers, Lumi assistant), and **Brand deck** (16:9, `deck-stage`, browser print and host capture hooks). See each kit's `README.md`.
- **Storybook:** renders Components (<!-- cs-count:publicExports -->125<!-- /cs-count --> exports — Core, Forms, Data, Feedback, Navigation, Overlays, AI-native, Brand), Foundations, **Templates** (<!-- cs-count:templates -->85<!-- /cs-count --> starting points from the manifest), **Pages** (Status Hub, Website, Deck), and Maintainer gate mirrors.

---

## Substitutions, verification & toolchain

- **Self-hosted fonts:** Be Vietnam Pro (300–800 + italics), Space Grotesk (variable 300–700), and JetBrains Mono are self-hosted in `fonts/` as subset-split WOFF2 (latin · latin-ext · vietnamese) — no CDN dependency. `_audit/font-face-integrity.html` checks local WOFF2 sources, subset declarations, manifest parity, Vietnamese subsets, sample loading, and the display-face scope.
- **Display face is opt-in:** `--cs-font-family-display` (Space Grotesk) is activated only when a subtree opts in with `.cs-display-face` (`docs/products.md` stays locked).
- **Type ramp, motion & contrast roles:** `tokens/typography.css` and `tokens/motion.css` ship semantic role aliases (`--cs-text-h1`…) and `.cs-h1` / `.cs-body` utilities in `base/typography.css`. Semantic statuses expose separate fill, paired foreground (`-fg`), and surface-text (`-text`) roles. `--cs-accent-on-strong` is the paired foreground for strong callout fills (APCA ≥ 75 body text and WCAG ≥ 4.5 in both modes; generator targets 78, verified by `test:strong-text-contrast`).
- **UI kits & reference catalog:** UI kits are cosmetic HTML-first recreations with fictional data. Declared counts and public document roles are generated in [the reference catalog](docs/reference-catalog.json).
- **Accessibility verification:** `_audit/a11y-harness.html` and `npm run test:a11y-harness` check accessible names with the pinned local axe engine across Chromium, Firefox, and WebKit.
- **Live browser benchmark & non-regression gate:** `npm run test:audit-regression` (`_audit/ci/verify-audit-benchmarks-browser.mjs`) scores **129/129** checks across 20 dimensions (`D1`–`D20`) at **10.0 / 10**, **64/64** core baseline checks at **10.0 / 10**, **192/192** cells (`≥ 3.0:1`) across the 32×6 non-text contrast matrix, and **3/3** Generation-2 complex stress-test screens with **0 watch** items. Dark default-scope tint ink measures **8.42:1–10.54:1** (`.cs-result__icon` **8.42:1**, `.cs-item.is-selected` **10.54:1** — both clearing WCAG AAA `7:1`).

### Setup, extension & benchmark playbook

- **Setup & local servers:** Run `node scripts/bootstrap-toolchain.mjs && node scripts/npm.mjs ci` once on Node >=22.12.0. Launch Storybook with `node scripts/npm.mjs run storybook` (`http://127.0.0.1:6006`) or serve the static audit board with `node scripts/npm.mjs run verify:serve` (`http://127.0.0.1:8765/_audit/run.html`). Production pushes to `main` deploy automatically via `.github/workflows/pages.yml` to `https://design.cyberskill.world/`.
- **Extending tokens, components, templates & open-spec:** Edit `tokens/*.css`, `tokens/base-inventory.json`, and `base/*.css`, then run `node scripts/npm.mjs run tokens:generate && node scripts/npm.mjs run build:css`. Add or update React primitives under `components/<group>/<Name>.{jsx,d.ts,prompt.md}`, `stories/<Name>/<Name>.stories.jsx`, and `components/lifecycle.json`, then run `node scripts/npm.mjs run build`. Register templates under `templates/<slug>/` and `_ds_manifest.json` (`node scripts/generate-template-inventory.mjs`), and rebuild the Stitch/LLM open-spec with `node scripts/npm.mjs run build:design-md`.
- **Auditing, reviewing & benchmarking in the future:** Run `node scripts/npm.mjs run test:audit-regression` to execute the 20-Dimension (`D1`–`D20`) live Chromium benchmark defined in `_audit/ci/lib/benchmark-checks.mjs` against `_audit/ci/fixtures/benchmark-20d.html`, `_audit/ci/fixtures/benchmark-baseline.html`, and `_audit/ci/fixtures/benchmark-gen2.html`. When running external AI design benchmarks (Google Stitch or Claude Design), codify any newly discovered visual or ergonomic rules into `_audit/ci/lib/benchmark-checks.mjs`, verify with `node scripts/npm.mjs run build:check`, and remove temporary external benchmark HTML/screenshots once the regression assertion is locked into CI.

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Before running source-repository `npm ci` or `npm run` commands, use Node >=22.12.0 and run `node scripts/bootstrap-toolchain.mjs` directly. This installs the audited, lockfile-pinned npm 11.21.1 fixture with lifecycle scripts disabled. Add `_audit/ci/fixtures/npm-cli/node_modules/.bin` to PATH, or run `node scripts/npm.mjs ci` and use `node scripts/npm.mjs` in place of `npm` for subsequent commands (`devEngines` rejects other npm versions in the source repository; published-package consumers keep their own package manager). See [validation and toolchain guidance](docs/validation.md).
<!-- END PINNED TOOLCHAIN BOOTSTRAP -->

*Welcome. Hiện Thực Hoá Ý Chí.*
