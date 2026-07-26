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
export function resolveAlias(groups, def) {
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

export function buildDesignMd({ dtcg, manifest, version }) {
  const groups = collectGroups(dtcg);
  const meta = dtcg.$extensions["com.cyberskill"];
  const dark = meta.overrides.themes.dark;
  const q = (s) => "`" + s + "`";

  // Section assignment must cover every group — a new DTCG group without a home
  // fails the generator AND the parity gate until it is placed (expansion rule).
  const SECTION_OF = {
    color: "colors", accent: "colors",
    font: "typography", text: "typography", letter: "typography", heading: "typography",
    space: "spacing", radius: "spacing", breakpoint: "spacing", container: "spacing", icon: "spacing",
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
  const twoCol = (a, b) => ({ head: `| ${a} | ${b} |`, rule: "|---|---|" });
  const threeCol = (a, b, c) => ({ head: `| ${a} | ${b} | ${c} |`, rule: "|---|---|---|" });
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
  L.push("# CyberSkill Design System — open spec");
  L.push("");
  L.push("> GENERATED FILE — do not edit by hand. Regenerate with `npm run build:design-md` after any token change; the `design-md-parity` gate fails on drift. This is the single-file open-spec surface for design tools and agents that read a root `DESIGN.md` (e.g. Google Stitch); the deep machine contract stays `tokens/tokens.dtcg.json`.");
  L.push("");
  L.push("> **Stitch / non-DC consumers:** do **not** treat `templates/**/*.dc.html` as source of truth — those files need the Design Components compiler (tweaks, `__dcSetProps`). Generate static UI from this file + DTCG + `styles.css` / `.cs-*` / `templates/kitchen-sink.html` / `examples/static-hello/`. Claude Code starts at `SKILL.md` and may use bundler `_esm/react.mjs` / legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve). Dual path: `docs/consuming.md`.");
  L.push("");
  L.push("## Brand & doctrine");
  L.push("");
  L.push("- **Slogan:** *Turn Your Will Into Real — Hiện Thực Hoá Ý Chí*.");
  L.push("- **Immutable anchors:** Umber `#45210E` (primary brand) · Ochre `#F4BA17` (accent). Never remap; the 3px ochre focus ring is a studio-wide accessibility signature.");
  L.push("- **Four axes:** Theme (light · dark · system) × Element (Ngũ Hành — Kim · Mộc · Thủy · Hỏa · Thổ, 15 element×variant packs) × Language (EN · VI) × Style (`data-cs-style` — sole pack **liquid-glass**; absent ≡ default).");
  L.push("- **Bilingual EN·VN rule:** Vietnamese-first — every UI string ships an EN + VN pair, diacritics preserved.");
  L.push("- **Text never sits on the mid-tone `-accent`:** text goes on `-bright` or `-tint` only; `-accent` is for bars, borders, progress fills, and large non-text fills.");
  L.push("- **Accessibility floor:** APCA Lc ≥ 75 body text · ≥ 44px touch targets · focus rings never removed · honour `prefers-reduced-motion` / `prefers-contrast`.");
  L.push("- **Voice:** warm · direct · honest · respectful — all four at once, never \"fun/playful/edgy\".");
  L.push("");
  L.push("## Colors");
  L.push("");
  L.push("Core semantic colours. Dark values are the `[data-theme=\"dark\"]` overrides (the `system` theme mirrors them under `prefers-color-scheme: dark`).");
  L.push("");
  L.push(table(threeCol("Token", "Light", "Dark"), rowsOf("color", true)));
  L.push("");
  L.push("### Accent roles (Ngũ Hành)");
  L.push("");
  L.push("Default accent pack = Thổ (the studio's own element). All 15 element×variant packs and their APCA-derived dark packs live in `tokens/elements.css` and DTCG `$extensions[\"com.cyberskill\"].overrides.elements` / `.elementsDark`.");
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("accent", false)));
  L.push("");
  L.push("## Typography");
  L.push("");
  L.push("Families ship self-hosted (Be Vietnam Pro · Space Grotesk · JetBrains Mono, full Vietnamese unicode ranges). `--cs-font-family-display` is the opt-in headline face; nothing points at it by default.");
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("font", false)));
  L.push("");
  L.push("### Type roles & tracking");
  L.push("");
  L.push("Semantic aliases into the ramp — write intent, not magic numbers. `Resolves to` follows the alias chain.");
  L.push("");
  L.push(table(threeCol("Token", "CSS form", "Resolves to"), Object.keys(groups.text).map((k) => aliasRow(k, groups.text[k]))));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("letter", false)));
  L.push("");
  L.push("### Heading treatment");
  L.push("");
  L.push(table(threeCol("Token", "CSS form", "Resolves to"), Object.keys(groups.heading).map((k) => aliasRow(k, groups.heading[k]))));
  L.push("");
  L.push("## Spacing & radius");
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("space", false)));
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("radius", false)));
  L.push("");
  L.push("### Layout & iconography");
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("breakpoint", false).concat(rowsOf("container", false), rowsOf("icon", false))));
  L.push("");
  L.push("## Elevation");
  L.push("");
  L.push("Shadow values are the raw CSS box-shadow strings from `$extensions[\"com.cyberskill\"].css` (structured DTCG objects carry the same layers). Dark overrides shown.");
  L.push("");
  L.push(table(threeCol("Token", "Light", "Dark"), rowsOf("shadow", true)));
  L.push("");
  L.push("### Depth scale & Liquid Glass materials");
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("depth", false).concat(rowsOf("glass", false))));
  L.push("");
  L.push("## Motion");
  L.push("");
  L.push("Calm, purposeful motion; `prefers-reduced-motion` collapses durations to 0ms at runtime only — these exported values are the real ones (80/120/200/320ms).");
  L.push("");
  L.push(table(twoCol("Token", "Value"), rowsOf("duration", false).concat(rowsOf("ease", false))));
  L.push("");
  L.push("## Component tokens");
  L.push("");
  L.push("Component-level design decisions (button · textfield). Dark values are theme overrides.");
  L.push("");
  L.push(table(threeCol("Token", "Light", "Dark"), rowsOf("component", true)));
  L.push("");
  L.push("## Components inventory");
  L.push("");
  L.push(`${componentFiles.length} component files · ${exportNames.length} exports (from \`_ds_manifest.json\`). Every primary ships \`.jsx\` + \`.d.ts\` + \`.prompt.md\`.`);
  L.push("");
  L.push(exportNames.map((n) => "`" + n + "`").join(" · "));
  L.push("");
  L.push("## Templates");
  L.push("");
  L.push(`${manifest.templates.length} copyable bilingual templates in \`templates/*/\` (each a \`.dc.html\` + byte-identical \`support.js\` runtime; see \`docs/template-schema-v2.md\` for typed content slots). **Claude Design / full-clone only** — Stitch must not consume \`*.dc.html\` as SoT; use kitchen-sink / \`.cs-*\` / static examples instead.`);
  L.push("");
  L.push("## Links");
  L.push("");
  L.push("- [README.md](README.md) — entrance document (voice, foundations, index)");
  L.push("- [SKILL.md](SKILL.md) — Claude Code agent entry: hard rules + fast orientation");
  L.push("- [llms.txt](llms.txt) — agent/tool front door, Claude vs Stitch consume-by-audience map");
  L.push("- [docs/consuming.md](docs/consuming.md) — adopt/upgrade + Claude Code vs Stitch dual path");
  L.push("- [docs/sync.md](docs/sync.md) — repo ↔ Claude Design round-trip & what non-DC agents can consume");
  L.push("- [tokens/](tokens/) — CSS custom properties + `tokens.json` / `tokens.js` (ESM) / `tokens.dtcg.json` (W3C DTCG) / `native/` (SwiftUI · Compose · Flutter)");
  L.push("- [docs/quality-gates.md](docs/quality-gates.md) — every deterministic gate incl. `design-md-parity`, which pins this file to the DTCG source");
  L.push("");
  return L.join("\n") + "\n";
}
