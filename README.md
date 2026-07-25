# CyberSkill Global Design System

> **Turn Your Will Into Real — Hiện Thực Hoá Ý Chí**

[![Design System Gates](https://github.com/cyberskill-official/design-system/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design-system/actions/workflows/design-system-gates.yml)

## Start here

This is the **entrance document** for the CyberSkill Design System — pinned **v1.0.0** (see `VERSION`). The **product site** is Storybook at **`/`** on `design.cyberskill.world` (host-only; local: `npm run storybook`). Legacy `/dashboard`, `/dashboard.html`, and `/playground/*` redirect to `/`. One sentence: a warm, Vietnamese-first, enterprise-grade system where every surface resolves three independent axes — **Theme** (light · dark) × **Element** (Ngũ Hành product identity: Kim · Mộc · Thủy · Hỏa · Thổ, 15 variants) × **Language** (EN · VI). Surface treatment is liquid-glass (fixed).

**Quick start by audience**
- **Designers** — open Storybook (Foundations / Components / Maintainer surfaces) and the Templates picker (84 starting points, including the 37-document lawyer-validated Employment Suite); the Identity Lab (`ui_kits/status-hub/identity-lab.html`) lets you flip axes live.

- **Claude Code / Claude Design** — read `SKILL.md` (normative Hard rules + orientation), then the guide below; compose with `styles.css` + bundler `@cyberskill/design` (`_esm/react.mjs`) / legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve). DC `*.dc.html` templates only when the session has the compiler. Component contracts live beside each component (`.d.ts` + `.prompt.md`).

- **Google Stitch** — start at **`DESIGN.md`** (generated open-spec) → `llms.txt` → `tokens/tokens.dtcg.json`. Build **static** UI with `styles.css` + `.cs-*` / kitchen-sink / `examples/static-hello/`. **Do not** treat `templates/**/*.dc.html` as source of truth.

- **Consuming projects** — npm package **`@cyberskill/design@1.0.0`** (see `docs/consuming.md`; grant in `docs/consumer-grant.md` — still UNLICENSED). **Next/SSR:** `import { Button } from "@cyberskill/design"` (peer React). **Browser demo:** **`examples/npm-hello/`** (Lumi · Hỏa · plasma, legacy `_esm/cs.mjs`). Or link **`styles.css`** from a clone/subtree (one file = everything), or copy a `templates/<slug>/` folder and edit one line in its `ds-base.js` (one-line rebind, validated end-to-end Jul 2026). Scope identity with `data-theme` · `data-cs-element` (+`data-cs-variant`) · `lang`. Release signal: tip SHA + `docs/release-notes.md` (VERSION stays **1.0.0**; no CHANGELOG).

**Document map — consumers**

| Doc | What it answers |
|---|---|
| `README.md` (this file, below) | The full guide: anchors, voice, visual foundations, components, templates, index |
| `DESIGN.md` | **This repo's** generated open-spec surface (Stitch-style) — doctrine + every token value + inventory, from DTCG; regenerate via `npm run build:design-md`. Do not hand-edit. |
| `SKILL.md` | Agent entry — hard rules + fast orientation |
| `docs/consuming.md` | Adopting & upgrading — Claude Code vs Stitch dual path, npm package name, axes, upgrade + extend |
| `docs/consumer-grant.md` | Written npm consumer grant (CyberSkill portfolio; UNLICENSED + named products) |
| `docs/conventions.md` | How to extend the system (naming grammar, checklists, the three axes) |
| `docs/release-notes.md` | Curated product highlights (not a changelog) |
| `docs/design-styles.md` | The live styling axes (Theme × Element × Language) and the fixed liquid-glass treatment |
| `docs/products.md` | Product → element registry (**locked** — do not invent assignments) |
| `docs/contrast-report.md` | Generated APCA elemental sweep — 0 failures at its Lc ≥ 60 UI-label floor. Body text authors to the stricter Lc ≥ 75 floor (see Anchor immutables); the sweep's Lc ≥ 60 rows are accent/label pairings, not body text. |
| `docs/template-schema-v2.md` | Typed content-slot spec for templates — opt-in, machine-checkable |
| `docs/deploy.md` | Deploying the live site — Vercel (zero-config) · generic VPS/nginx · post-deploy checklist |
| `docs/live-hub.md` | Storybook at `/` is the product surface; surface map |
| `docs/storybook.md` | Host Storybook product surface at `/` |
| `docs/figma.md` | Figma / Tokens Studio import recipe for consumers and maintainers |
| `docs/vi/*.md` | Vietnamese mirror of every operator-facing `docs/*.md` (toggle EN\|VI in `docs/viewer.html`; entrance docs stay EN) |

**Document map — maintainers** (CI, decisions, gates — not consumer onboarding)

| Doc | What it answers |
|---|---|
| `docs/decisions.md` | Recorded owner decisions + open maintainer tasks (Code Connect deferred) |
| `docs/ci-cd.md` | CI/CD automation — GitHub Actions workflow, headless gate runner, token-provenance pre-check, badge |
| `docs/quality-gates.md` | Benchmark reference — every quality gate, what it asserts, pass criterion, where it runs |
| `docs/sync.md` | Repo ↔ authoring-environment round-trip fidelity & two-way sync |
| `_audit/archive/` | Historical audit notes (not public docs) |

---

A warm, enterprise-grade, **Vietnamese-first** design system for **CyberSkill** — a Saigon software studio (est. 2020) that turns a clear *wish* into working software. Anchored on **Umber** and **Ochre**, guided by **Lumi** the golden genie. This project packages CyberSkill's tokens, components, brand assets, and product recreations so any agent can design on-brand artifacts and production UI.
Consumers link one file: **`styles.css`**.

## Sources

**This repository** (`cyberskill-official/design-system`) is the design-system source of truth: tokens, React components, brand assets, templates, and gates live here.

Related CyberSkill repos (not in this tree — explore for product/marketing fidelity):
- **Marketing site** (Next.js, bilingual, Lumi genie, in-repo icon set): https://github.com/cyberskill-official/landing-page
- **Audit framework** (referenced tooling): https://github.com/cyberskill-official/design-system-audit-framework

**[`DESIGN.md`](DESIGN.md) in this repo** is the generated open-spec surface (Google-Stitch-style: brand doctrine, every token value light + dark, component/template inventory). It is built from `tokens/tokens.dtcg.json` + `_ds_manifest.json` by `npm run build:design-md`. Never edit it by hand; the `design-md-parity` gate pins it byte-for-byte to the token source. It is not a separate upstream doctrine file.

---

## Anchor immutables (never change these)

| Immutable | Value |
|---|---|
| **Slogan** | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| **Primary brand** | **Umber** `#45210E` · `oklch(0.265 0.073 44.3)` |
| **Primary accent** | **Ochre** `#F4BA17` · `oklch(0.811 0.162 83.7)` |
| **Voice** | warm · direct · honest · respectful (a chord — all four at once) |
| **Vietnamese-first** | every UI string ships an EN + VN pair |
| **Accessibility floor** | APCA Lc ≥ 75 body text, focus rings never removed, ≥ 44px touch targets |

---

## CONTENT FUNDAMENTALS

**Voice is a four-axis chord, sounded all at once:** *warm · direct · honest · respectful.* Never "fun/playful/edgy" — that is explicitly off-brand.

- **Warm, human, second-person.** Speak to "you"; the studio is "we". Lumi speaks as "I". Copy is gentle and encouraging, never corporate. e.g. *"Lovely. What should I call you?"*, *"The lamp is resting for a moment."*
- **Direct and concrete.** Short sentences, plain outcomes, no hedging. e.g. *"Send a short note. We reply within one business day."*, *"Built to ship, and built to last."*
- **Honest about trade-offs.** The brand advertises candour: *"senior, small, and honest about trade-offs."* Risks are stated in words, never hidden or colour-only.

- **Respectful of consent & privacy.** Ask before contacting; promise not to share. e.g. *"Your details go straight to the team. We never share them."*
- **The "wish" metaphor is the spine.** Products are *wishes*; Lumi (a golden genie) *grants* them by handing them to a real human team. Verbs: *make a wish, grant, shape it, ship, last.* Use it warmly, never gimmicky.

**Casing & mechanics:** Sentence case for headings and buttons (*"Make a wish"*, *"Tell us your wish"*). UPPERCASE + wide tracking only for small eyebrows/labels/table headers. Titles avoid trailing punctuation; body uses full stops. Numerals as digits (*"one business day"* in prose is fine, but *"3 business days"* for concrete SLAs). Em dashes for asides.

**Bilingual (Vietnamese-first):** Every user-facing string has an EN + VN counterpart or an explicit deferral note. VN is a first-class citizen, not a translation afterthought — diacritics are preserved everywhere (*Nguyễn Hoàng Vũ*, *Hiện Thực Hoá Ý Chí*). Vietnamese-safe line-heights (body 1.5 / heading 1.35) leave room for stacked marks.

**Emoji:** **Not used** in product UI or brand copy. Meaning is carried by words and the line-icon set, not emoji. (The mascot and the sparkle "wish" glyph do the affective work.)

---

## VISUAL FOUNDATIONS

**Palette — warm earth, never cold.** Umber `#45210E` grounds everything (it *is* the primary text colour); Ochre `#F4BA17` is the single accent — CTAs on dark, focus rings, highlights, the genie. Surfaces are warm paper: page `#FFFDF8`, panel `#FFFFFF`, raised `#FBF4E9`. Every neutral is warmed toward umber — borders are `#E7D9C6`, muted text `#6E5A4C`. Semantic colours (success `#166534`, danger `#B42318`, warning `#92400E`, info `#1D4ED8`) are used sparingly and never as the only signal. **Max one accent per surface** — on core surfaces that accent is Ochre; a *product* may swap in its element accent (see Elemental identity below), never add a second hue beside it. No bluish-purple gradients.

**Typography.** UI: **Be Vietnam Pro** (300–800; a Vietnamese-first Google family) — the default for every surface, headings included. Display/headline: **Space Grotesk** (variable 300–700), the **opt-in** face behind `--cs-font-family-display`; nothing points at it until a scope opts in with `.cs-display-face`, which retargets `--cs-heading-family` and leaves body copy on the UI face. Code/data: **JetBrains Mono**. Display headings are heavy (800 on the UI face; under `.cs-display-face`, Space Grotesk tops out at 700 so 800 clamps within that family), tight tracking (−0.02em); body is 400/500 at 1.5. Uppercase eyebrows at 0.08–0.12em tracking. The size ramp runs xs 12 → 5xl 60 on a 16px base.

**Spacing & layout.** 4px base grid (`--cs-space-*`); section padding lives between 64 and 96px; content max-width ~1200–1320px. Generous, calm whitespace.

**Corners & cards.** Radii: sm 4, md 8 (default), **lg 14 (cards/panels)**, full 999 (pills, inputs, chips). A default card = white panel, 1px warm border `#E7D9C6`, 14px radius, soft warm shadow. No coloured-left-border cards.

**Surfaces — Liquid Glass (the default treatment).** Five materials over the anchors: **Whisper** (hero washes), **Light** (nav/sidebar), **Standard** (cards over imagery), **Heavy** (modals/popovers), **Solid** (dense content, tables). Glass = `color-mix` translucency + `backdrop-filter` blur/saturate + a 1px lens-edge gradient. It is **opt-in and additive** — apply a `cs-surface-*` class after checking APCA against the backdrop; dense content stays Solid. Collapses to solid under `prefers-reduced-transparency`, `forced-colors`, print, and unsupported browsers.

**Shadows** are warm and umber-tinted (`rgba(69,33,14,…)`), a soft five-step scale from `xs` hairline to `xl` dialog lift. Never grey, never harsh.

**Depth** is an explicit z-scale mapped to glass tiers: bg 0 → section 5 → card 10 → nav 50 → modal 100 → toast 200.

**Backgrounds & imagery** glow from within: deep-umber darks with **warm gold particle light** (`aurora-gold.jpg`), never cold or flat — and each element carries its own wash (`assets/aurora-{hoa,thuy,moc,kim}.png`, applied via the `.cs-aurora-wash` overlay class; Thổ's is the official gold). Photography is warm-toned. Full-bleed umber sections anchor heroes, careers bands, and footers; on umber, the Ochre slogan and white body carry the message. The mascot, **Lumi**, is a polished golden genie rendered on transparent backgrounds.

**Elemental product identity — Ngũ Hành.** The studio itself is **Thổ/Earth** (Umber + Ochre — the traditional earth-yellow); each CyberSkill *product* may take one element — **Kim** (metal) · **Mộc** (wood) · **Thủy** (water) · **Hỏa** (fire) · **Thổ** (earth) — via `data-cs-element` (+ `data-cs-variant`, e.g. Hỏa: ember · lava · plasma). Each pack sets the nine **`--cs-accent-*`** role tokens (accent / strong / bright / on / tint / ink / glow / grad-a / grad-b) defined in `tokens/elements.css`; inside the scope the element fully takes Ochre's accent roles. Never elemental: semantic statuses, and the **3px Ochre focus ring** — the studio's accessibility signature on every product. Mixing follows the cycles: a secondary element may appear only as a gradient endpoint along **Tương sinh** (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc); **Tương khắc** pairs never mix. Product→element mapping lives in `docs/products.md`. **Every template carries the Element tweak** — anything that should follow the product's element must consume `--cs-accent-*`, never raw hex. **Lumi stays golden in every element** — the genie is the studio's constant; only the environment re-tints.

**Surface treatment.** Liquid-glass is fixed. Surfaces resolve **Theme × Element × Language** independently.



**Motion** is calm and purposeful: short durations (120–320ms), a soft decelerate `cubic-bezier(0.2,0,0,1)`, small translate/scale and fades (e.g. the hero mascot's gentle float). No bounce, no flash. Everything collapses to 0 under `prefers-reduced-motion`.

**Interaction states.** Hover: brighten ~8% (filled) or fill to `surface-raised` (subtle). Press: a 0.5–1px nudge. Focus: a **3px Ochre ring, 2px offset** — always visible, never removed. Disabled: opacity 0.58. Touch targets ≥ 44px on coarse pointers.

**Transparency & blur** appear only on glass surfaces and the hero wish-input — deliberate, backed by fallbacks — never as decoration.

---

## ICONOGRAPHY

CyberSkill ships **no external icon library**. It uses its own small **in-repo line-icon set** (from the marketing site, `TASK-DS-010`): each icon is data (a viewBox + primitive paths) rendered through one `<Icon>` component. Style: **line icons, `currentColor` stroke, 1.75 weight, round caps/joins, 24×24 viewBox** — so icons follow the surrounding text token and recolour by setting `color`. Sizes come from `--cs-icon-sm|md|lg` (16/20/24).
The set: `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off`, extended in v2.0 with `search · sliders · upload · download · calendar · user · plus · trash · external · menu` and in v2.13 with `chevron-down/up/left/right · edit · copy · info · alert-triangle` (same grammar, marked as extensions). `sparkle` is the brand's **"wish"** glyph. **No emoji** and no unicode-glyph icons in product UI. The one exception to "line icons" is the **brand mark** (`Logo`) and **Lumi** mascot, which are filled artwork.
Copied assets live in `assets/`: `logo-mark.svg` / `logo-mark.png` (official master mark, Umber ground + Ochre genie), `favicon.svg`, `aurora-gold.jpg` (warm gold hero wash), `lumi-poster.webp` (the golden-genie mascot). **The logo is the real master file — never recreate, recolour, or approximate it;** for third-party tenants, swap the tenant's own logo.
---

## Components

**A comprehensive library — 115 exports across 8 groups.** 99 of these are primary component files, and every primary ships the full contract trio — a `.jsx`, a `.d.ts` props contract, a `.prompt.md` — plus a Design-System card. The other 16 are co-exports (sub-parts such as `CardHeader`, `Tab`, `MenuItem`, `Radio`, and data consts such as `CS_ICONS`) documented inside their parent's files rather than with files of their own. Mount from the compiled bundle. The bundle's global is `window.CyberSkillDesignSystem_<projectId>` — the 6-hex suffix is assigned by the compiler and **changes when this system is imported into another project**, so resolve it by prefix rather than hardcoding it: `const CS = window[Object.keys(window).find(k => /^CyberSkillDesignSystem_/.test(k))]; const { Button } = CS;`

- **Core — actions & overlays** — `Button`, `ButtonGroup`, `FloatingActionButton`, `Dialog`

- **Forms** — `TextField`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` (+ `Radio`), `Switch`, `SearchField`, `NumberField`, `Slider`, `FileUpload`, `SegmentedControl`, `Toggle`, `Rating`, `InputOTP`, `InputGroup`, `TagInput`, `TimePicker`, `Combobox`, `Mentions`, `InlineEdit`, `ColorPicker`, `Calendar`, `DatePicker`, `Cascader`, `TreeSelect`, `Transfer`, `Editor`, `Form` (+ `FormField`, `FormFieldArray`, `FormWizard`)

- **Data & layout** — `DataTable`, `DataGrid`, `TreeTable`, `Card` (+ `CardHeader`, `CardBody`, `CardFooter`), `Stat`, `Avatar` (+ `AvatarGroup`), `Tooltip`, `Divider`, `List` (+ `ListItem`), `DescriptionList`, `Timeline`, `Accordion`, `Kbd`, `CodeBlock`, `Tree`, `Comment`, `Carousel`, `Image`, `Masonry`, `Splitter`, `Sortable`, `Chart`, `Terminal`, `QRCode`, `Watermark`

- **Feedback & status** — `Badge`, `Tag`, `Alert`, `Toast` (+ `ToastStack`), `Spinner`, `ProgressBar`, `Skeleton`, `StatusIndicator`, `EmptyState`, `Result`

- **Navigation** — `Tabs` (+ `Tab`), `Breadcrumb`, `Pagination`, `Menu` (+ `MenuItem`), `Sidebar` (+ `NavItem`), `Steps`, `CommandPalette`, `Menubar`, `NavigationMenu`, `Anchor`, `Toolbar`, `Dock`, `BackTop`, `Link`, `HotKeys`

- **Overlays** — `Popover`, `Drawer`, `HoverCard`, `Popconfirm`, `ContextMenu`, `Tour`

- **AI-native** — `AIDisclosureBadge`, `HumanReviewGate`, `PromptInput`, `ChatMessage`, `ConfidenceMeter`, `PromptSuggestions`, `TypingIndicator`, `CitationList`

- **Brand** — `Logo` (+ the `CS_LOGO_MARK_INNER` / `CS_LOGO_VIEWBOX` data consts), `Icon` (+ the `CS_ICONS` data const), `LumiAvatar`

**Atomic tiers** — the same 115 exports seen through the design-composition lens (browsable live in `guidelines/atomic-view.html`, where one toolbar reskins every tier across Theme × Element × Language). The eight groups above are the *functional/import* grouping (how the bundle is organized); these tiers are the *composition* grouping — same components, two lenses.

- **Atoms** (indivisible primitives) — `Button`, `Icon`, `Badge`, `Tag`, `StatusIndicator`, `Spinner`, `ProgressBar`, `Skeleton`, `Avatar` (+ `AvatarGroup`), `Divider`, `Kbd`, `Logo`, `LumiAvatar`, `Toggle`, `Link`

- **Molecules** (a few atoms bonded into one control) — `TextField`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `SearchField`, `NumberField`, `Slider`, `FileUpload`, `SegmentedControl`, `Tabs`, `Breadcrumb`, `Pagination`, `Menu`, `Steps`, `Stat`, `Card`, `Tooltip`, `List`, `DescriptionList`, `CodeBlock`, `Alert`, `Toast`, `ConfidenceMeter`, `AIDisclosureBadge`, `PromptSuggestions`, `TypingIndicator`, `CitationList`, `Rating`, `InputOTP`, `ButtonGroup`, `Combobox`, `InputGroup`, `TagInput`, `TimePicker`, `HoverCard`, `Popconfirm`, `ContextMenu`, `FloatingActionButton`, `InlineEdit`, `Toolbar`, `Anchor`, `Image`, `Watermark`, `BackTop`, `Mentions`, `ColorPicker`, `QRCode`

- **Organisms** (composite, self-contained sections) — `Sidebar` (+ `NavItem`), `CommandPalette`, `DataTable`, `Accordion`, `Timeline`, `EmptyState`, `Dialog`, `Drawer`, `Popover`, the `PromptInput` + `ChatMessage` conversation, `HumanReviewGate`, `Calendar`, `DatePicker`, `Result`, `Menubar`, `NavigationMenu`, `Carousel`, `Comment`, `Form` (+ `FormField`), `Tree`, `TreeSelect`, `Cascader`, `Transfer`, `Tour`, `Masonry`, `Splitter`, `HotKeys`, `Dock`, `DataGrid`, `TreeTable`, `Sortable`, `Chart`, `Editor`, `Terminal`

Highlights: **Button** — Umber primary; variants primary/secondary/tertiary/ghost/danger/danger-ghost; sizes xs–lg; loading, icon, fullWidth. **TextField / Textarea / Select** share one `.cs-field` frame (label + description + inline error; diacritic/IME-safe). **DataTable** — caption, scoped headers, per-column render, empty state. **Card** — warm panel + header/body/footer. **Logo** renders the exact official mark; **Icon** drives the in-repo line-icon set. The **AI-native** family carries the brand's explainability doctrine — disclosure, human review, wish capture, and confidence, all stated in words (never colour alone).

**Install / package name.** This monolith publishes as **`@cyberskill/design`** (live at **1.0.0**; grant in `docs/consumer-grant.md` governs *use* — package remains UNLICENSED). Do **not** install `@cyberskill/react` for this tree — that name is historical marketing-site inventory, not this package.

**Source inventory vs. extensions.** An earlier CyberSkill surface shipped six primitives — `Button`, `TextField`, `Dialog`, `DataTable`, `AIDisclosureBadge`, `HumanReviewGate` — plus a brand `Logo`. Everything else in **this** package is an **intentional extension** built in the brand's own token vocabulary so consumers have a complete working kit: `Icon` (the marketing site's real in-repo line-icon set), the standard Forms / Feedback / Data / Navigation / Overlays primitives (search, stepper, slider, file upload, list, description list, timeline, accordion, kbd, code block, sidebar, steps, command palette, popover, drawer, and more), added AI-native pieces (`PromptInput`, `ChatMessage`, `ConfidenceMeter`, `PromptSuggestions`, `TypingIndicator`, `CitationList`) that formalise the Lumi wish-flow, and the `LumiAvatar` mascot. None invent new visual language — they reuse the anchors, surfaces, type, and motion already defined.

---

## Templates

Copyable starting points for consuming projects (the **Templates** picker — these replace the old per-component "starting points"). Each lives in `templates/<slug>/` as a Design Component that loads this system via a sibling `ds-base.js`.

- **Marketing page** (`templates/marketing-page/`) — bilingual landing: umber hero with a `PromptInput` wish box, service cards, process band, Lumi chat launcher.

- **Dashboard** (`templates/dashboard/`) — Status-Hub-style portfolio: KPI `Stat`s, `Tabs` board/table lenses, status cards with `ProgressBar` + `Badge`, and a `DataTable`.

- **Slide deck** (`templates/slide-deck/`) — 16:9 brand deck: umber title + closing, ochre accents, light content layouts.

- **Sign in** (`templates/auth/`) — split auth: umber brand panel + form (`TextField`, `Switch`, `Button`).

- **Settings** (`templates/settings/`) — `Tabs`, form fields, switches, and a danger zone.

- **App shell** (`templates/app-shell/`) — `Sidebar` nav, topbar with `SearchField`, KPI `Stat`s, and a `DataTable`.

- **Article** (`templates/article/`) — long-form post: title, author meta, prose, `Alert` callout, `CodeBlock`.

- **Email** (`templates/email/`) — centred 600px announcement: umber header, ochre CTA, footer.

Every template exposes the **Element (Ngũ Hành)** tweak (15 variants) plus a behavior toggle; screen templates also carry theme light/dark, and the letter-print business docs are **light-only** (no theme tweak — print doctrine).

### Team artifact templates

Branded documents, emails, reports, and decks per department — each a copyable `.dc.html` composing the design-system components. Groups now cover **Tech, Team, HR, Board, Marketing, Culture, Delivery, Legal, Finance, Sales** — the full operations map (coverage research, Jul 2026). Counsel-gated drafts (PIP, board resolution, VN employment contract) ship **banner-marked**: legal/HR review is mandatory before real use.

- **Tech** — `tech-release-notes` (release email), `tech-incident-report` (blameless postmortem: timeline + action table), `tech-rfc` (design doc: proposal, trade-offs, rollout).

- **Team** — `team-meeting-agenda` (time-boxed items, owners, decisions log, ground rules).

- **HR** — `hr-announcement` (team-news email). *(The offer letter, onboarding checklist, and job description now live in the lawyer-validated Employment Suite below as `vn-offer-letter`, `vn-onboarding-checklist`, and `vn-job-description`.)*
- **Board** — `bod-report` (quarterly review: KPI stats, portfolio table, risks, AI-assisted disclosure), `bod-deck` (16:9 board deck — stacked slides, PDF/PPTX-exportable), `bod-memo` (one-page exec memo with a single ask).

- **Marketing** — `marketing-campaign-brief` (objective, audience, channels, metrics), `marketing-newsletter` (“The Lamp” issue email), `marketing-launch` (product launch announcement), `marketing-case-study` (result hero, proof stats, quote — print-ready), `marketing-press-release` (dateline, boilerplate, media contact — print-ready).

### Business, legal & sales templates

Print-ready letter documents and client decks — the paperwork a studio actually sends. Legal and finance docs are Letter-sized with an `@page` + `@media print` block, so **File → Print / Save as PDF** paginates cleanly with 0.6in margins; on screen they render as a warm sheet on a desk.

- **Legal** — `legal-msa` (master services agreement — the umbrella SOWs hang off: definitions, IP, fees, liability, term), `legal-sow` (statement of work: deliverables & milestone tables, fees, acceptance, sign-off). *(The standalone mutual NDA now lives in the Employment Suite as the lawyer-validated `vn-mutual-nda`.)*
- **Finance** — `finance-invoice` (bill-to/from, line items in đồng, VAT, total, bank details), `finance-quote` (scoped estimate with optional add-on, valid-until, accept CTA).

- **Sales** — `sales-one-pager` (leave-behind: umber hero, services, proof stats, the wish process, contact CTA), `sales-proposal-deck` (8-slide 16:9 client proposal — the wish, understanding, approach, scope, timeline, team, investment, next steps).

**Bilingual — full coverage.** Every one of the 84 templates is bilingual. The 37 `vn-*` HR-suite instruments and the three `doc-*` references are Vietnamese-first with English stacked beneath (Ink/Slate). Every other template carries a **Language** tweak (*English · Tiếng Việt*) that swaps the entire body between the two; several emails (`email`, `marketing-launch`, `tech-release-notes`, `delivery-status-email`, `finance-dunning-email`) add a *Both* mode that stacks them. Where doctrine says **EN-first** (client/media collateral), that means English is the *default* Language value — still with a full bilingual Language tweak — not an English-only exemption. Legal and finance docs (MSA, SOW, invoice, quote) print their Vietnamese side as an **unreviewed draft** behind a warning banner stating the English governs — have counsel review before real use. As of v2.6.0 the last English-only holdouts — board & comms (`bod-report`, `bod-deck`, `bod-investor-update`, `bod-resolution`) and the client decks/docs (`sales-proposal-deck`, `tech-rfc`, `delivery-kickoff`, `delivery-qbr-deck`) — carry the tweak too.

### Reference documents (govern EVERY template)

Three suite-wide reference documents define and catalogue the whole template library — legal, HR, finance, sales, client-facing paperwork, and EN-first communications alike. They live in `templates/doc-*/` and print as A4 bilingual documents themselves:
- **Documents · Style Guide** (`templates/doc-style-guide/`) — the presentation standard: palette, type ramp, bilingual Ink/Slate rule, tables, fill-ins, tick-boxes, signing blocks, data hygiene, header/footer (Articles 1–10, verbatim from the lawyer-validated original), plus **Article 11 — scope & archetypes**, mapping the A4 rules onto Letter-print, email, product-screen, deck and social archetypes.

- **Documents · Suite Index & Usage Guide** (`templates/doc-suite-index/`) — Part I catalogues every template by group (HR suite, legal, finance, sales, product, comms); Part II is the usage guide (employment lifecycle, which documents carry disciplinary force, the eight house presentation rules, and the 8-step “add a new template” workflow).

- **Documents · Templates** (`templates/doc-templates/`) — Part A is the blank A4 bilingual shell (header, title block, sample clause, Party A pre-filled / Party B blank, signing block); Part B is the archetype map (A4 · Letter print · email · product screen · deck · social) with an example per family.

### HR & Employment Suite (lawyer-validated)

Thirty-seven **counsel-validated** bilingual instruments supplied by the client (built on an earlier version of the system) were **converted one-by-one into templates, content preserved verbatim**, and re-skinned to the latest design system. They live under the **HR Suite** group (`templates/vn-*/`) and follow the house standard set out in the reference documents above: **A4, Vietnamese-first bilingual** (Ink `#1A1614` VN over Slate `#3F4C55` italic EN pairs), state-motto header, umber table title bars, yellow fill-in blanks, PDPL data-hygiene (Party B always blank), and signing blocks that never split. Every one carries the Element (15) tweaks like all templates; none carries a language tweak (they are inherently bilingual). Because these are validated instruments, **`vn-labor-contract` supersedes the earlier fictional `legal-employment-contract`**, and `vn-mutual-nda` / `vn-offer-letter` / `vn-onboarding-checklist` / `vn-job-description` supersede the fictional `legal-nda` / `hr-offer-letter` / `hr-onboarding` / `hr-job-description` (all removed); the remaining fictional templates are EN-first comms (announcements, newsletters, press releases) and client-facing sales/finance paperwork — a different purpose, so they stay.

- **Compensation & rewards** — `vn-total-rewards-appendix`, `vn-phantom-stock`, `vn-salary-scale`, `vn-compensation-regulation`.

- **Policies & regulations** — `vn-internal-labor-regulations`, `vn-disciplinary-schedule`, `vn-performance-evaluation-regulation`, `vn-grassroots-democracy`, `vn-code-of-conduct`, `vn-infosec-policy`, `vn-data-protection-policy`, `vn-remote-work-policy`, `vn-travel-expense-policy`.

- **Hiring & records** — `vn-job-description`, `vn-onboarding-checklist`, `vn-receipt-acknowledgement`, `vn-labour-management-book`, `vn-foreign-employee-pack`, `vn-pdpl-consent`.

- **Performance & requests** — `vn-performance-review-form`, `vn-employee-request` (leave · overtime consent · other).

- **Outside relationships** — `vn-internship-agreement`, `vn-contractor-agreement`, `vn-sow-appendix`, `vn-mutual-nda`.

- **Discipline & exit** — `vn-disciplinary-case-file` (4-part A→D), `vn-resignation-letter`, `vn-certificate-of-employment` (deliberately neutral), `vn-training-commitment`.

These are the client's validated legal text; keep the content as-is and have counsel review any edits before real use.

### Component coverage map

How the templates exercise the component library — every group is covered by at least one starting point:
| Component group | Exercised by templates |
|---|---|
| **Core** (Button, Dialog) | marketing-page · auth · settings · sales-one-pager · finance-quote |
| **Forms** (TextField, Select, Switch, SearchField…) | auth · settings · app-shell |
| **Data & layout** (Stat, DataTable, Card, Avatar, Divider) | dashboard · app-shell · bod-report · sales-proposal-deck · hr-announcement |
| **Feedback & status** (Badge, Alert, ProgressBar) | dashboard · bod-report · bod-memo |
| **Navigation** (Tabs, Sidebar, NavItem) | dashboard · app-shell · settings |
| **AI-native** (AIDisclosureBadge, PromptInput) | marketing-page · bod-report |
| **Brand** (Logo, Icon, LumiAvatar) | every template |

Raw markup (numbered clauses, invoice tables, milestone rows) in the legal/finance/HR-suite docs is composed from tokens + `.cs-*` type utilities rather than components, by design — these are documents, not app UI. Their frame is defined by the three reference documents (Style Guide · Suite Index & Usage Guide · Templates), not the component library.

### Archetype coverage map

Every template resolves to one of six archetypes, framed by `templates/doc-templates`:
| Archetype | Frame | Templates |
|---|---|---|
| **A4 bilingual instrument** | State-motto header · Articles · Party A/B tables · signing block; Style-Guide 1–10 in full | the 37 `vn-*` HR-suite instruments |
| **Letter print doc** | Letter, 0.6in margins, desk + sheet, clean Print/PDF | `finance-invoice` · `finance-quote` · `finance-expense-report` · `legal-msa` · `legal-sow` · `sales-one-pager` · `bod-*` docs |
| **Email (600px)** | Centred body, system header/CTA, no motto/signing; bilingual via Language tweak | `email` · `hr-announcement` · `marketing-newsletter` · `tech-release-notes` · `delivery-status-email` · `finance-dunning-email` |
| **Product screen** | Components + tokens; Theme × Element × Language; no print geometry | `marketing-page` · `dashboard` · `app-shell` · `auth` · `settings` · `article` |
| **Deck (16:9)** | Stacked 16:9 slides, umber cover, element accent, bilingual via Language tweak, PDF/PPTX | `slide-deck` · `bod-deck` · `sales-proposal-deck` · `delivery-qbr-deck` |
| **Social image** | Fixed per-channel size (1080² · 1200×630 · 1080×1920) | `marketing-social-kit` |

---

## Index / manifest

```
styles.css                 ← single entry point (@import manifest only) · VERSION 1.0.0
tokens/                    fonts · colors · typography · spacing · elevation · motion · component-tokens · elements (Ngũ Hành packs)
base/                      reset · typography · components · forms · feedback · data · navigation · ai · controls · collections · shell · glass · interaction · a11y · responsive
components/                button · textfield · dialog · datatable · forms · feedback · data · navigation · overlays · ai · logo · icon · brand
                           (each Name: Name.jsx + Name.d.ts + Name.prompt.md; one *.card.html per group)
guidelines/                specimen cards (Colors · Type · Spacing · Surfaces · Brand · Motion · Elements · Responsive & Bilingual) · atomic-view.html
templates/                 marketing-page · dashboard · slide-deck · auth · settings · app-shell · article · email (copyable .dc.html)
                           + team artifacts — tech (release/incident/rfc) · team (meeting-agenda) · hr (announcement) · board (report/deck/memo) · marketing (brief/newsletter/launch/case-study/press-release)
                           + business — legal (vn-mutual-nda / msa / sow; fictional legal-nda retired) · finance (invoice/quote) · sales (one-pager/proposal-deck) — letter print docs + client deck
                           + Documents (reference, govern all templates) — doc-style-guide · doc-suite-index (index & usage) · doc-templates (archetypes)
                           + HR Suite — 37 lawyer-validated bilingual A4 instruments (vn-*); content verbatim, latest-DS skin
ui_kits/status-hub/        Status Hub recreation (index · login · settings · project · identity-lab + status.css · data.js · StatusHub.jsx)
ui_kits/website/           cyberskill.world recreation (index · work · careers · chat + site.css · copy.js · Website.jsx)
ui_kits/deck/              brand deck on deck-stage (index.html; deck-stage runtime lives in templates/_vendor/, outside the compiled bundle; export PPTX/PDF on demand)
assets/                    logo-mark.svg/png · favicon.svg · aurora-gold.jpg + aurora-{hoa,thuy,moc,kim}.png · lumi-poster.webp
docs/                      the full doc set (see Document map above) + viewer.html reader (EN|VI)
docs/vi/                   Vietnamese translations of every operator-facing docs/*.md
fonts/                     self-hosted Be Vietnam Pro + Space Grotesk + JetBrains Mono woff2 (latin · latin-ext · vietnamese)
thumbnail.html             project tile
SKILL.md                   Agent-Skills-compatible entry
```

**UI kits** (product recreations, composing the tokens + `.cs-*` classes): **Status Hub** (portfolio dashboard — KPIs, board/table/releases lenses, drawer — plus **sign-in**, **settings**, **project detail**, and the **Identity Lab** for live Theme × Element × Language switching), **cyberskill.world** (bilingual marketing home with Lumi chat — plus **Work**, **Careers**, and a full-page **Lumi assistant**), and a **Brand deck** (16:9, `deck-stage`, PDF/PPTX-ready). See each kit's `README.md`.

**Storybook** renders every card: Components (115 exports — Core, Forms, Data, Feedback, Navigation, Overlays, AI-native, Brand), Foundations (Colors, Type, Spacing, Surfaces, Brand, Motion, Responsive & Bilingual, **Elements**), plus Maintainer surfaces for Status Hub (incl. Identity Lab), Website, and Deck.

---


## Substitutions & caveats

- **Fonts:** Be Vietnam Pro (300–800 + italics), Space Grotesk (variable 300–700), and JetBrains Mono are **self-hosted** in `fonts/` as subset-split woff2 (latin · latin-ext · vietnamese) — no CDN dependency. Same families as the source (which ships them via `next/font`); no visual substitution. `_audit/font-face-integrity.html` is the gate: it proves every face is local, subset-split, Vietnamese-covered, and mirrored in the manifest.

- **Display face is opt-in, not a second default.** `--cs-font-family-display` (Space Grotesk) exists so a product with a headline face — cyberskill.world / Lumi — consumes a DS token instead of hand-rolling its own `@font-face`. Nothing in the DS points at it: opt a subtree in with `.cs-display-face`. Product → element mappings are unaffected (`docs/products.md` stays locked).

- **Type size ramp & motion tokens** are a documented convention layered on the doctrine (the token source ships families + line-heights only); they mirror real in-product usage. The ramp also carries semantic role aliases (`--cs-text-h1`…) and `.cs-h1` / `.cs-body` / … utilities in `base/typography.css`.

- **UI kits are cosmetic recreations** — data is fictional, interactions are shallow, and the marketing site's production 3D/genie layer is not reproduced (the HTML-first base is).

*Welcome. Hiện Thực Hoá Ý Chí.*
