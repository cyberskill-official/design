# Quality benchmark

`npm run benchmark` scores the design system on 23 dimensions and fails CI when one breaks. It replaces the 2.x
"20D" benchmark. That one asserted exact CSS values on three fixture pages; this one measures what a person gets, on
every Storybook story, in real Chromium, in light and dark.

```bash
npm run build && npm run build-storybook -w @cyberskill/design
npm run benchmark                                  # about 2 minutes, every story
npm run benchmark -- --stories forms-select,benchmark  # only story ids starting with these
npm run benchmark -- --update-baseline             # after fixing advisory gaps, lock the new scores in
```

It prints a scorecard (also written to the CI job summary) and writes `tools/benchmark/out/report.json` with every
failure. The stories are loaded from the Storybook build, which imports `dist/styles.css` and the package's `fonts.css`, so it
measures the stylesheet and fonts exactly as apps get them. The run fails if the fonts did not load. Target sizes are
measured on a 360px touch screen, so touch-only hit-area rules apply.

## How it scores

- Each dimension measures many subjects (a text run, a Tab stop, a control, a story) and scores the share that pass.
  The overall score is the mean of the dimension scores.
- **Required** dimensions fail the run on any failure: WCAG 2.2 AA, the CyberSkill rules and the package checks.
- **Advisory** dimensions (AAA and best practice) are a ratchet: the run fails when one scores lower than in
  `tools/benchmark/baseline.json` (with half a point of tolerance for font rendering between Linux and macOS), when
  more than a handful of its failures are new (0.5% of what it measures), or when it measures nothing.
  The report lists failures that are new and baseline entries that now pass.

## Dimensions

### WCAG 2.2 AA (required)

| | Dimension | Standard | Level | How it is measured |
|---|---|---|---|---|
| D1 | Text contrast | WCAG 1.4.3 | required | Every text run, on the colors actually painted (opacity and layered backgrounds blended): 4.5:1, or 3:1 for large text. |
| D2 | Non-text contrast | WCAG 1.4.11 | required | Form-control boundaries, and the indicator of every checked, selected or pressed item: 3:1 against what is next to them. |
| D3 | Focus visible | WCAG 2.4.7, 2.4.11 | required | Each Tab stop, by pixel difference before and after focus: a change of at least 3:1 covering a 1px outline of the control, not hidden by other content. |
| D4 | Keyboard reach | WCAG 2.1.1, 2.1.2 | required | Every visible, enabled control is a Tab stop or sits in an arrow-key group that has one; Tab never gets stuck outside a modal dialog. |
| D5 | Target size | WCAG 2.5.8 | required | At phone width, every target is 24px or more, or its 24px circle touches no other target. Hit-slop and wrapping labels count. |
| D6 | Reflow at 320px | WCAG 1.4.10 | required | At 320px wide the page never scrolls sideways. Tables, charts and code may scroll inside their own box. |
| D7 | Text spacing | WCAG 1.4.12 | required | With line height 1.5, paragraph spacing 2em, letter spacing 0.12em and word spacing 0.16em forced on, no text is newly clipped or spills out of its box. |
| D8 | Names, roles, values | WCAG 1.3.1, 4.1.2 | required | axe-core WCAG 2.0–2.2 A and AA rules on every story: zero violations (contrast is D1's job). |

### Beyond AA (advisory)

| | Dimension | Standard | Level | How it is measured |
|---|---|---|---|---|
| D9 | Focus appearance | WCAG 2.4.13 (AAA) | advisory | The focus change covers at least a 2px outline of the control at 3:1. |
| D10 | Comfortable targets | WCAG 2.5.5 (AAA) | advisory | At phone width, every target offers a 44px hit area. |
| D11 | Forced colors | Windows contrast themes | advisory | With forced colors on, form controls keep a visible boundary, checked and selected items still look different, and focus still shows. |
| D12 | Reduced motion | WCAG 2.3.3 (AAA) | advisory | With reduced motion requested, nothing animates for longer than 200ms or loops. |
| D13 | Reader font size | WCAG 1.4.4 | advisory | With the browser font size at 200%, text grows with it (rem-based) and none is newly clipped. |

### CyberSkill rules

| | Dimension | Standard | Level | How it is measured |
|---|---|---|---|---|
| D14 | Dark mode and clean render | House rule | required | Every story renders in light and dark without errors, and dark mode has no light patches (an opaque light surface left from light mode). |
| D15 | Vietnamese diacritics | House rule | required | The ink of every glyph, stacked marks included (Ẫ Ỗ Ữ ặ ỵ), stays inside the box that clips it, in every story (textarea values included). |
| D16 | Long content | House rule | required | Long Vietnamese and English text, IDs and emails at 240 and 320px: no component grows past its container and no text spills out. |
| D17 | Invalid and disabled states | WCAG 3.3.1, 1.4.1 | required | Every form control in error is announced (aria-invalid), linked to visible error text, and its boundary changes visibly (ΔE 15+, 3:1 against the page), also while hovered. Every disabled control, and each disabled button inside it, looks different from its enabled twin. |
| D18 | Theme scoping | House rule | required | A ThemeScope inside a page of the other theme gets its own theme, and so do popups opened from inside it. |
| D19 | Status colors | WCAG 1.4.1 | required | Rendered status tones stay apart: ΔE 15+ for normal vision, 8+ for protan and deutan vision. Each carries an icon and text. |
| D23 | Vietnamese in input fields | House rule | required | Single-line inputs clip their value to the font's ascent and descent, so stacked capitals (Ẫ, Ỗ) need a font whose ascent clears them. The package's fonts.css raises Be Vietnam Pro's ascent for this; the check fails if that override is lost. |

### The package (required)

| | Dimension | Standard | Level | How it is measured |
|---|---|---|---|---|
| D20 | Server Components | React 19 RSC | required | 'use client' on every module that uses hooks and on no entry barrel; the core entry never imports an optional peer (Recharts, TanStack, React Hook Form, react-day-picker, date-fns). |
| D21 | Docs parity | House rule | required | Every component has a story, a test file, a site page, a site demo and a generated AI doc. |
| D22 | Token discipline | DTCG 2025.10 | required | Component CSS uses no raw colors; every token has a $value and a $type (its own or its group's). |

## Stress-test stories

Most checks run on every story. Five stories under **Benchmark/** pack one hard case across every component it
applies to (`packages/design/src/benchmark/Benchmark.stories.tsx`), marked with `data-bench-*` attributes:

- **VietnameseText**: every text-bearing component at every size with stacked marks (Ẫ Ỗ Ữ Ẵ ặ ọ ỵ). Feeds D15 and D23.
- **LongContent**: long Vietnamese and English text, IDs and emails at 240 and 320px. Feeds D16.
- **InvalidStates** and **DisabledStates**: each form control valid next to invalid, and enabled next to disabled. Feed D17.
- **NestedThemes**: a dark ThemeScope in a light page and the reverse, with a popup opened inside. Feeds D18.
- **StatusTones**: every status tone in Badge (each variant) and Alert. Feeds D19.

A new form control goes into InvalidStates; a new text-bearing component goes into VietnameseText and LongContent.

## From the 2.x benchmark

| 2.x dimension | In 3.0 |
|---|---|
| D1 dark-mode tint safety, D3 Umber surface separation | D14 (no light patches), D1 and D2 in dark |
| D2 32-scope non-text contrast | D2, on every story and state |
| D4 13-control invalid-state parity | D17 (17 controls, plus disabled states) |
| D5 Vietnamese diacritic clearance | D15, on every story plus the stress test |
| D6 scoped nested theme | D18 (Liquid Glass is not in 3.0) |
| D7 DESIGN.md and asset contract | D21 docs parity, plus the generated AI docs check in CI |
| D8 focus appearance and dual ring | D3 (AA) and D9 (AAA) |
| D9 touch targets and motion safety | D5 (24px), D10 (44px), D12 |
| D10 high contrast, density, status parity | D11 forced colors, D19 |
| D11 type scale, prose, tabular numerals | D13 reader font size (tabular numerals are not measured) |
| D14 data, navigation, overlay stack; D15 and D17 reflow, container queries | D3, D4 and D6 on every story, D16 |
| D16 cross-runtime spec, 4-axis orthogonality | D20 Server Components, D22 token discipline |
| D20 cross-locale resilience | D15, D16 |
| D12 elevation and print, D13 AI surfaces, D18 print, D19 micro-interactions | Not carried over: print and the Lumi AI surfaces are not part of 3.0 |

## Adding a dimension

Add it to `tools/benchmark/dimensions.mjs`, measure it in `run.mjs` (in-page code goes in `page.js`, file checks in
`static.mjs`), add its row to this page (a test keeps the two in sync), run it, then fix what it finds or, for an
advisory dimension, accept today's gaps with `--update-baseline`.
