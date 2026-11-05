import {designMessage} from "./design-md-language.mjs";

// Shared DESIGN.md model — imported by BOTH scripts/generate-design-md.mjs (Node)
// and _audit/design-md-parity.html (browser), so the generator and the gate can
// never drift: the gate rebuilds the whole document from the same inputs and
// asserts byte equality. Pure functions, no I/O, no dependencies.
//
// Inputs: parsed tokens.dtcg.json, parsed _ds_manifest.json, VERSION string.
// Output: the complete DESIGN.md text (deterministic — the "generated" stamp is
// the DTCG generation date, not the wall clock, so regeneration is a no-op
// unless the sources changed).

/** DTCG display value — $extensions css string wins; else the typed transform
 *  (same rules the token-format-parity gate proves against tokens/*.css). */
export function displayValue(def) {
  const ext = def.$extensions && def.$extensions["com.cyberskill"] && def.$extensions["com.cyberskill"].css;
  if (ext !== undefined) return String(ext);
  const v = def.$value;
  if (def.$type === "cubicBezier" && Array.isArray(v)) return "cubic-bezier(" + v.join(", ") + ")";
  if (def.$type === "fontFamily" && Array.isArray(v)) return v.map((f) => (/[ ]/.test(f) ? "'" + f + "'" : f)).join(", ");
  return String(v);
}

/** Collect { group: { tokenName: def } } for every DTCG leaf. */
export function collectGroups(dtcg) {
  const groups = {};
  for (const g of Object.keys(dtcg)) {
    if (g.charAt(0) === "$") continue;
    for (const k of Object.keys(dtcg[g])) {
      if (k.charAt(0) === "$") continue;
      const def = dtcg[g][k];
      if (!def || def.$value === undefined) continue;
      (groups[g] = groups[g] || {})[k] = def;
    }
  }
  return groups;
}

/** Resolve an alias chain {group.--cs-*} to its final display value. */
function resolveAlias(groups, def) {
  let cur = def, hops = 0;
  while (typeof cur.$value === "string" && /^\{[^{}]+\}$/.test(cur.$value) && hops < 10) {
    const inner = cur.$value.slice(1, -1);
    const dot = inner.indexOf(".");
    const g = inner.slice(0, dot), t = inner.slice(dot + 1);
    const target = groups[g] && groups[g][t];
    if (!target) return "(unresolved " + inner + ")";
    cur = target;
    hops++;
  }
  return displayValue(cur);
}

export function buildDesignMd({ dtcg, manifest, version, language = "en" }) {
  if (!["en", "vi"].includes(language)) throw new Error("Unsupported DESIGN language: " + language);
  const t = text => designMessage(text, language);
  const groups = collectGroups(dtcg);
  const meta = dtcg.$extensions["com.cyberskill"];
  const dark = meta.overrides.themes.dark;
  const q = (s) => "`" + s + "`";

  // Section assignment must cover every group — a new DTCG group without a home
  // fails the generator AND the parity gate until it is placed (expansion rule).
  const SECTION_OF = {
    color: "colors", accent: "colors", doc: "colors",
    font: "typography", text: "typography", letter: "typography", heading: "typography",
    density: "spacing", space: "spacing", radius: "spacing", breakpoint: "spacing", container: "spacing", icon: "spacing",
    shadow: "elevation", depth: "elevation", glass: "elevation",
    duration: "motion", ease: "motion",
    component: "component",
  };
  const unplaced = Object.keys(groups).filter((g) => !SECTION_OF[g]);
  if (unplaced.length) throw new Error("DESIGN.md: unplaced DTCG groups (add them to a section): " + unplaced.join(", "));

  function tokenRow(name, def, withDark) {
    const light = q(displayValue(def));
    if (!withDark) return `| ${q(name)} | ${light} |`;
    const d = dark[name] !== undefined ? q(dark[name]) : "—";
    return `| ${q(name)} | ${light} | ${d} |`;
  }
  function aliasRow(name, def) {
    return `| ${q(name)} | ${q(displayValue(def))} | ${q(resolveAlias(groups, def))} |`;
  }
  function table(header, rows) { return [header.head, header.rule, ...rows].join("\n"); }
  const twoCol = (a, b) => ({ head: `| ${t(a)} | ${t(b)} |`, rule: "|---|---|" });
  const threeCol = (a, b, c) => ({ head: `| ${t(a)} | ${t(b)} | ${t(c)} |`, rule: "|---|---|---|" });
  const rowsOf = (g, withDark) => Object.keys(groups[g]).map((k) => tokenRow(k, groups[g][k], withDark));

  const componentFiles = [...new Set(manifest.components.map((c) => c.sourcePath).filter((p) => /\.(jsx|tsx)$/.test(p)))];
  const exportNames = manifest.components.map((c) => c.name);

  const L = [];
  L.push("---");
  L.push(`name: "CyberSkill Design System"`);
  L.push(`version: "${version}"`);
  L.push(`generated: "${meta.generated}"`);
  L.push(`generator: "scripts/generate-design-md.mjs (npm run build:design-md)"`);
  L.push(`sources:`);
  L.push(`  tokens: "tokens/tokens.dtcg.json"`);
  L.push(`  inventory: "_ds_manifest.json"`);
  L.push(`gate: "_audit/design-md-parity.html (window.__designmd)"`);
  L.push("---");
  L.push("");
  L.push(language === "vi" ? "**Tiếng Việt** · [English](../../../DESIGN.md)" : "**Tiếng Việt:** [Đọc đặc tả đầy đủ](docs/vi/entrypoints/DESIGN.md) · **English**");
  L.push("");
  L.push(t("# CyberSkill Design System — open spec"));
  L.push("");
  L.push(t("> GENERATED FILE — do not edit by hand. Regenerate with `npm run build:design-md` after any token change; the `design-md-parity` gate fails on drift. This is the single-file open-spec surface for design tools and agents that read a root `DESIGN.md` (e.g. Google Stitch); The base typed projection is `tokens/tokens.dtcg.json`; its hashed `tokens/declarations.json` companion preserves the remaining declarations and source conditions. Read both for the repository adapter; use canonical CSS for runtime cascade behavior. This document is a selected token/inventory guide, not a complete conditional-mode or native rendering contract."));
  L.push("");
  L.push(t("> **Stitch / non-DC consumers:** do **not** treat `templates/**/*.dc.html` as source of truth — those files use the shipped `support.js` browser interpreter (tweaks, `__dcSetProps`); a separate host compiler is not required for browser preview. Generate static UI from this file + DTCG + `styles.css` / `.cs-*` / `templates/kitchen-sink.html` / `examples/static-hello/`. DC-capable authoring starts at `SKILL.md` and uses compiled ESM `dist/esm/_esm/react.mjs` by default, explicit raw JSX `_esm/react.mjs` for source authoring, or legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve). Dual path: `docs/consuming.md`. Operator docs are published on the Storybook Docs sidebar at `design.cyberskill.world`."));
  L.push("");
  L.push(t("## Brand & doctrine"));
  L.push("");
  L.push(t("- **Slogan:** *Turn Your Will Into Real — Hiện Thực Hoá Ý Chí*."));
  L.push(t("- **Immutable anchors:** Umber `#45210E` (primary brand) · Ochre `#F4BA17` (accent). Never remap; the composite focus indicator (text-primary contour + ochre halo) is a studio-wide accessibility signature."));
  L.push(t("- **Four axes:** Theme (light · dark · system) × Element (Ngũ Hành — Kim · Mộc · Thủy · Hỏa · Thổ, 15 element×variant packs) × Language (EN · VI) × Style (`data-cs-style` — sole pack **liquid-glass**; absent ≡ default)."));
  L.push(t("- **Language scope:** Vietnamese-first; registered component strings require EN + VI pairs. Template language capabilities are declared per template, and consumer-provided content needs its own translation and review. Preserve diacritics; declared pairs do not certify translation quality or screen-reader pronunciation."));
  L.push(t("- **Text never sits on the mid-tone `-accent`:** use `-bright` or `-tint`, or pair a `-strong` fill with `--cs-accent-on-strong` for body text. `-accent` is for bars, borders, progress fills, and large non-text fills."));
  L.push(t("- **Accessibility floor:** APCA Lc ≥ 75 body text · ≥ 44px touch targets · focus rings never removed · honour `prefers-reduced-motion` / `prefers-contrast`."));
  L.push(t("- **Voice:** warm · direct · honest · respectful — all four at once, never \"fun/playful/edgy\"."));
  L.push("");
  L.push(t("## Colors"));
  L.push("");
  L.push(t("Core semantic colours. Dark values are the `[data-theme=\"dark\"]` overrides (the `system` theme mirrors them under `prefers-color-scheme: dark`)."));
  L.push("");
  L.push(table(threeCol("Token", "Light", "Dark"), rowsOf("color", true)));
  L.push("");
  L.push(t("### Accent roles (Ngũ Hành)"));
  L.push("");
  L.push(t("Default accent pack = Thổ (the studio's own element). All 15 element×variant packs and their APCA-derived dark packs live in `tokens/elements.css` and DTCG `$extensions[\"com.cyberskill\"].overrides.elements` / `.elementsDark`."));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("accent", false)));
  L.push("");
  L.push(t("### Document palette"));
  L.push("");
  L.push(t("Shared ink / paper / rule colours for print-leaning instruments (`--cs-doc-*`). Prefer these over raw hex in VN legal and office templates."));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("doc", false)));
  L.push("");
  L.push(t("## Typography"));
  L.push("");
  L.push(t("Families ship self-hosted (Be Vietnam Pro · Space Grotesk · JetBrains Mono) with declared style/weight/subset faces. The bounded Vietnamese NFC/NFD repertoire is recorded in `fonts/subset-recipe.json`; it does not certify every Unicode sequence, shaping engine or native installation. `--cs-font-family-display` is the opt-in headline face; nothing points at it by default."));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("font", false)));
  L.push("");
  L.push(t("### Type roles & tracking"));
  L.push("");
  L.push(t("Semantic aliases into the ramp — write intent, not magic numbers. `Resolves to` follows the alias chain."));
  L.push("");
  L.push(table(threeCol("Token", "CSS form", "Resolves to"), Object.keys(groups.text).map((k) => aliasRow(k, groups.text[k]))));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("letter", false)));
  L.push("");
  L.push(t("### Heading treatment"));
  L.push("");
  L.push(table(threeCol("Token", "CSS form", "Resolves to"), Object.keys(groups.heading).map((k) => aliasRow(k, groups.heading[k]))));
  L.push("");
  L.push(t("## Spacing & radius"));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("space", false)));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("radius", false)));
  L.push("");
  L.push(t("### Density (Theme attribute)"));
  L.push("");
  L.push(table(threeCol("Token", "CSS form", "Resolves to"), Object.keys(groups.density).map(k => aliasRow(k, groups.density[k]))));
  L.push("");
  L.push(t("Scoped overrides (distinct from the base token rows):"));
  L.push("");
  L.push(table(threeCol("Scope", "Token", "CSS override"), ["compact", "comfortable"].flatMap(scope =>
    Object.entries(meta.overrides.densities[scope]).map(([k,v]) => `| ${q('data-cs-density="' + scope + '"')} | ${q(k)} | ${q(v)} |`))));
  L.push("");
  L.push(t("### Layout & iconography"));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("breakpoint", false).concat(rowsOf("container", false), rowsOf("icon", false))));
  L.push("");
  L.push(t("## Elevation"));
  L.push("");
  L.push(t("Shadow values are the raw CSS box-shadow strings from `$extensions[\"com.cyberskill\"].css` (structured DTCG objects carry the same layers). Dark overrides shown."));
  L.push("");
  L.push(table(threeCol("Token", "Light", "Dark"), rowsOf("shadow", true)));
  L.push("");
  L.push(t("### Depth scale & Liquid Glass materials"));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("depth", false).concat(rowsOf("glass", false))));
  L.push("");
  L.push(t("## Motion"));
  L.push("");
  L.push(t("Calm, purposeful motion; the global `prefers-reduced-motion` safety net reduces animation/transition durations to 0.01ms and disables smooth scrolling at runtime; components can disable animation entirely — these exported values are the real ones (80/120/200/320ms)."));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("duration", false).concat(rowsOf("ease", false))));
  L.push("");
  L.push(t("## Component tokens"));
  L.push("");
  L.push(t("Component-level design decisions (button · textfield). Dark values are theme overrides."));
  L.push("");
  L.push(table(threeCol("Token", "Light", "Dark"), rowsOf("component", true)));
  L.push("");
  L.push(t("## Static HTML component anatomy (.cs-*)"));
  L.push("");
  L.push(t("Static HTML consumers and zero-runtime generators style semantic HTML elements directly with `.cs-*` classes from `styles.css` (or `styles.layered.css`). Interactive state management, keyboard roving, focus trapping and ARIA live announcements require the React components or consumer-supplied scripts; see `docs/static-html-reference.md` for rendered DOM snapshots."));
  L.push("");
  L.push(t("- **Actions & buttons (`base/components.css`):** primary `.cs-button`, variants `.cs-button--secondary`, `.cs-button--tertiary`, `.cs-button--ghost`, `.cs-button--danger`, `.cs-button--danger-ghost`; sizes `.cs-button--xs` (`28px`, `44px` on `pointer: coarse`), `.cs-button--sm` (`36px`, `44px` on `pointer: coarse`), default medium (`44px`), `.cs-button--lg` (`52px`), full-width `.cs-button--full`; states `.is-disabled`, `.is-loading` with `.cs-button__spinner`."));
  L.push(t("- **Form controls & fields (`base/components.css`, `base/forms.css`, `base/controls.css`):** field wrapper `.cs-field` with `.cs-field__label`, `.cs-field__control`, `.cs-field__description`, `.cs-field__error` and invalid state `.cs-field.is-invalid`; selection controls `.cs-check`, `.cs-radio`, `.cs-switch` (`.cs-switch__track`); composite inputs `.cs-select`, `.cs-native-select`, `.cs-search` (`.cs-search__clear`), `.cs-stepper`, `.cs-otp`, `.cs-slider`, `.cs-segmented`."));
  L.push(t("- **Cards & Liquid Glass surfaces (`base/data.css`, `base/glass.css`):** card container `.cs-card` (modifiers `.cs-card--flat`, `.cs-card--interactive`; slots `.cs-card__media`, `.cs-card__header`, `.cs-card__title`, `.cs-card__subtitle`, `.cs-card__body`, `.cs-card__footer`); optical glass tiers `.cs-surface-whisper`, `.cs-surface-light`, `.cs-surface-standard` (alias `.cs-glass-card`), `.cs-surface-heavy`, opaque fallback `.cs-surface-solid` (alias `.cs-surface-matte`), and brand hero wash `.cs-aurora` (`.cs-aurora--photo`)."));
  L.push(t("- **Data display & typography (`base/components.css`, `base/data.css`, `base/typography.css`, `base/collections.css`):** responsive table wrapper `.cs-table-wrap` and `.cs-table` with right-aligned tabular numeric cells `.cs-table__cell--numeric` and subtle row rule `var(--cs-color-border-subtle)`; KPI block `.cs-stat` (`.cs-stat__label`, `.cs-stat__value`, `.cs-stat__delta--up`, `.cs-stat__delta--down`, `.cs-stat__delta--flat`); status pills `.cs-badge` (`.cs-badge--solid`, `.cs-badge--ochre`, `.cs-badge--success`, `.cs-badge--warning`, `.cs-badge--danger`, `.cs-badge--info`, `.cs-badge__dot`) and removable `.cs-tag`; `.cs-avatar` (`.cs-avatar--sm`, `.cs-avatar--md`, `.cs-avatar--lg`, `.cs-avatar--square`, `.cs-avatar-group`); `.cs-kbd`, `.cs-code`, `.cs-dl`; type role classes `.cs-display`, `.cs-display--fluid`, `.cs-h1`, `.cs-h1--fluid`, `.cs-h2`, `.cs-h3`, `.cs-h4`, `.cs-body-lg`, `.cs-body`, `.cs-secondary`, `.cs-caption`, `.cs-eyebrow`, `.cs-mono`, `.cs-tabular`, and opt-in display scope `.cs-display-face`."));
  L.push(t("- **Feedback & overlays (`base/feedback.css`, `base/components.css`, `base/shell.css`):** inline banner `.cs-alert` (`.cs-alert--info`, `.cs-alert--success`, `.cs-alert--warning`, `.cs-alert--danger`, `.cs-alert__icon`, `.cs-alert__title`, `.cs-alert__body`, `.cs-alert__dismiss`); toast stack `.cs-toast-stack` and `.cs-toast`; modal `.cs-dialog-layer` with theme-adaptive backdrop `.cs-dialog__overlay` (`var(--cs-color-surface-scrim)`), panel `.cs-dialog` (`.cs-dialog__header`, `.cs-dialog__title`, `.cs-dialog__body`, `.cs-dialog__actions`) and `.cs-alert-dialog` (`.cs-alert-dialog--destructive`); slide-over `.cs-drawer-scrim` and `.cs-drawer` (`.cs-drawer--left`); `.cs-popover` (`.cs-popover__panel`), `.cs-tooltip` (`.cs-tooltip__bubble`), `.cs-progress` (`.cs-progress__fill`), `.cs-spinner`, `.cs-skeleton`."));
  L.push(t("- **Navigation, app shell & AI (`base/navigation.css`, `base/shell.css`, `base/ai.css`, `base/controls.css`):** app sidebar `.cs-sidebar` (`.cs-sidebar__label`, `.cs-nav-item`, `.cs-nav-item.is-active`), `.cs-tabs` (`.cs-tab`, `.cs-tab__count`), `.cs-breadcrumb`, `.cs-pagination`, `.cs-menu` (`.cs-menu__list`, `.cs-menu__item`, `.cs-menu__item--danger`, `.cs-menu__sep`), `.cs-steps` (`.cs-step`, `.cs-step--done`, `.cs-step--active`), command palette `.cs-cmdk-scrim` and `.cs-cmdk` (`.cs-cmdk__search`, `.cs-cmdk__list`, `.cs-cmdk__item`); AI surfaces `.cs-prompt`, `.cs-chat-msg`, `.cs-ai-disclosure` (`.cs-ai-disclosure__badge`, `.cs-ai-disclosure__panel`), `.cs-review-gate`, and `.cs-terminal`."));
  L.push("");
  L.push(t("## Layout, grid & responsive strategy"));
  L.push("");
  L.push(t("Layouts compose on a `4px` spatial rhythm (`--cs-space-1` to `--cs-space-24`) with container caps (`--cs-container-sm` `640px` through `--cs-container-2xl` `1440px`) and two density scopes (`data-cs-density=\"comfortable\"` default vs `data-cs-density=\"compact\"`). Mark resizable panes or split regions with `.cs-cq` (`container-type: inline-size`) to collapse child grids via `.cs-cq-cols-2`, `.cs-cq-cols-3`, `.cs-cq-cols-4`, `.cs-cq-stack`, and `.cs-cq-hide-narrow` independent of viewport width."));
  L.push("");
  L.push(t("- **Desktop & wide (`> 1024px`, `--cs-breakpoint-lg` / `--cs-breakpoint-xl` `1280px` / `--cs-breakpoint-2xl` `1536px`):** full multi-column grids, persistent `248px` `.cs-sidebar` + `1fr` main workspace, generous sheet padding (`40px+`), and full display typography (`--cs-text-display` `3.75rem`, `--cs-text-h1` `2.25rem`). Fixed-aspect 16:9 decks and social canvases inside `.cs-canvas-desk` preserve authored tracks and scroll horizontally below `1280px` (`min-width: 960px`)."));
  L.push(t("- **Tablet (`<= 768px`, `--cs-breakpoint-md`):** 3–6 column inline grids collapse to `repeat(2, 1fr)`; `.cs-sidebar` converts from a fixed column into a horizontal wrapping navigation strip; `.cs-table-wrap` and `.cs-table-scroll` scroll horizontally; `.cs-display` steps down to `--cs-font-size-4xl` (`3rem`) and `.cs-h1` to `--cs-font-size-2xl` (`1.875rem`) outside `.cs-canvas-desk` (or scale smoothly when opted into `.cs-display--fluid` / `.cs-h1--fluid`); `.cs-nav-item` and `.cs-search` enforce the `44px` touch height."));
  L.push(t("- **Mobile & narrow (`<= 640px` `--cs-breakpoint-sm`, `<= 480px` `--cs-breakpoint-xs`, `<= 360px` reflow floor):** all multi-column content grids collapse to `1fr`; `.cs-dialog` widens to `calc(100vw - 1rem)` at `4vh` (`4dvh` safe-area aware) with full-flex action buttons; `.cs-display` steps down to `--cs-font-size-3xl` (`2.25rem`) and `.cs-h1` to `--cs-font-size-xl` (`1.5rem`); at `<= 360px` (WCAG 1.4.10), `.cs-tabs`, `.cs-pagination`, `.cs-otp`, and `.cs-dl` wrap or scroll without horizontal page overflow while preserving `>= 44px` coarse-pointer targets."));
  L.push("");
  L.push(t("## Guardrails (Do's & Don'ts)"));
  L.push("");
  L.push(t("- **Do (Brand & colour):** anchor interfaces on Umber `#45210E` and Ochre `#F4BA17`; use `--cs-color-surface-page`, `--cs-color-surface-panel`, `--cs-color-surface-raised`, `--cs-color-border-default`, `var(--cs-color-border-subtle)`, and `var(--cs-color-surface-scrim)` so light, `[data-theme=\"dark\"]`, `[data-theme=\"system\"]`, `[data-cs-contrast=\"high\"]`, and all 15 Ngũ Hành element packs adapt automatically."));
  L.push(t("- **Don't (Brand & colour):** never place body text on mid-tone `--cs-accent` (pair `--cs-accent-strong` with `--cs-accent-on-strong`, or use `--cs-accent-tint` / `--cs-accent-bright` with dark ink), and never hardcode light-only `rgba(69, 33, 14, ...)` borders or `rgba(31, 19, 11, ...)` scrims in component stylesheets."));
  L.push(t("- **Do (Typography & Vietnamese localization):** keep `--cs-font-line-height-body` (`1.5`) and `--cs-font-line-height-heading` (`1.35`) so stacked Vietnamese diacritics (`ẫ`, `ệ`, `ự`, `ở`) never clip; apply `.cs-tabular` or `.cs-table__cell--numeric` (`font-variant-numeric: tabular-nums`) on KPIs, prices, timestamps, badges, and pagination counts; ship both EN and VI copy for registered UI strings."));
  L.push(t("- **Don't (Typography & Vietnamese localization):** never tighten body line-height below `1.5` or heading line-height below `1.35` on Vietnamese text, never strip diacritics, and never make `--cs-font-family-display` (`Space Grotesk`) the default body font (opt in only for headlines via `.cs-display-face` or `--cs-heading-family`)."));
  L.push(t("- **Do (Accessibility & motion):** preserve the dual-ring focus indicator (`outline: 2px solid var(--cs-color-text-primary)` + `box-shadow: 0 0 0 5px var(--cs-color-accent-ochre)`), maintain `APCA Lc >= 75` for body text, enforce `>= 44px` hit targets under `@media (pointer: coarse)`, and provide opaque surface fallbacks under `prefers-reduced-transparency: reduce` and `forced-colors: active`."));
  L.push(t("- **Don't (Accessibility & runtime boundary):** never remove `:focus-visible` outlines without an ancestor `:focus-within` composite ring, never rely on colour alone to communicate status (always pair semantic colour with an icon, badge text, or border weight), and never claim static `.cs-*` HTML markup alone provides React keyboard navigation, focus trapping, or ARIA state updates."));
  L.push("");
  L.push(t("## Components inventory"));
  L.push("");
  L.push(language === "vi" ? `${componentFiles.length} tệp thành phần · ${exportNames.length} mục xuất (từ \`_ds_manifest.json\`). Mỗi thành phần chính có \`.jsx\` + \`.d.ts\` + \`.prompt.md\`.` : `${componentFiles.length} component files · ${exportNames.length} exports (from \`_ds_manifest.json\`). Every primary ships \`.jsx\` + \`.d.ts\` + \`.prompt.md\`.`);
  L.push("");
  L.push(exportNames.map((n) => "`" + n + "`").join(" · "));
  L.push("");
  L.push(t("## Templates"));
  L.push("");
  L.push(language === "vi" ? `${manifest.templates.length} mẫu có hỗ trợ ngôn ngữ được khai báo rõ trong \`templates/*/\` (mỗi mẫu gồm \`.dc.html\` + bản runtime \`support.js\` giống hệt từng byte; xem \`docs/template-schema-v2.md\` về các vị trí nội dung nguồn có kiểu; chúng không tự động trở thành props khi chạy). **Chỉ dành cho soạn thảo có hỗ trợ DC / bản sao toàn bộ kho mã** — Stitch không được dùng \`*.dc.html\` làm nguồn chuẩn; hãy dùng kitchen-sink / \`.cs-*\` / ví dụ tĩnh.` : `${manifest.templates.length} templates with explicitly scoped language support in \`templates/*/\` (each a \`.dc.html\` + byte-identical \`support.js\` runtime; see \`docs/template-schema-v2.md\` for typed source-content slots; these are not automatically runtime props). **DC-capable authoring / full-clone only** — Stitch must not consume \`*.dc.html\` as SoT; use kitchen-sink / \`.cs-*\` / static examples instead.`);
  L.push("");
  L.push(t("## Links"));
  L.push("");
  L.push(t("- [README.md](README.md) — entrance document (voice, foundations, index)"));
  L.push(t("- [SKILL.md](SKILL.md) — agent entry: hard rules + fast orientation"));
  L.push(t("- [llms.txt](llms.txt) — agent/tool front door, capability-based consume-by-audience map"));
  L.push(t("- [docs/consuming.md](docs/consuming.md) — adopt/upgrade + DC-capable vs static dual path"));
  L.push(t("- [docs/doctrine.md](docs/doctrine.md) — expansion rule, verification depth, immutables"));
  L.push(t("- [docs/sync.md](docs/sync.md) — repo ↔ authoring-environment round-trip & what non-DC agents can consume"));
  L.push(t("- [tokens/](tokens/) — CSS custom properties + `tokens.json` / `tokens.js` (ESM) / `tokens.dtcg.json` (DTCG 2025.10 emitted-value profile) / `native/` (SwiftUI · Compose · Flutter)"));
  L.push(t("- [docs/quality-gates.md](docs/quality-gates.md) — every deterministic gate incl. `design-md-parity`, which pins this file to the DTCG source"));
  L.push("");
  const output = L.join("\n") + "\n";
  return language === "vi" ? output.replace(/\]\((?![a-z]+:|#|\/|\.\.\/)([^)]+)\)/gi, "](" + "../../../$1)") : output;
}
