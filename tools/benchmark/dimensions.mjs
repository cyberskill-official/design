// The benchmark's rubric: what each dimension measures, against which standard, and whether a failure blocks.
// required: any failure fails the run. advisory: scored; only failures missing from baseline.json fail (a ratchet).
// The rubric page (docs/benchmark.md) is written from this list, so the two never drift.
export const DIMENSIONS = [
  // WCAG 2.2 AA, measured on every story in light and dark
  { id: 'D1', group: 'WCAG 2.2 AA', level: 'required', name: 'Text contrast', standard: 'WCAG 1.4.3', how: 'Every text run, on the colors actually painted (opacity and layered backgrounds blended): 4.5:1, or 3:1 for large text.' },
  { id: 'D2', group: 'WCAG 2.2 AA', level: 'required', name: 'Non-text contrast', standard: 'WCAG 1.4.11', how: 'Form-control boundaries, and the indicator of every checked, selected or pressed item: 3:1 against what is next to them.' },
  { id: 'D3', group: 'WCAG 2.2 AA', level: 'required', name: 'Focus visible', standard: 'WCAG 2.4.7, 2.4.11', how: 'Each Tab stop, by pixel difference before and after focus: a change of at least 3:1 covering a 1px outline of the control, not hidden by other content.' },
  { id: 'D4', group: 'WCAG 2.2 AA', level: 'required', name: 'Keyboard reach', standard: 'WCAG 2.1.1, 2.1.2', how: 'Every visible, enabled control is a Tab stop or sits in an arrow-key group that has one; Tab never gets stuck outside a modal dialog.' },
  { id: 'D5', group: 'WCAG 2.2 AA', level: 'required', name: 'Target size', standard: 'WCAG 2.5.8', how: 'At phone width, every target is 24px or more, or its 24px circle touches no other target. Hit-slop and wrapping labels count.' },
  { id: 'D6', group: 'WCAG 2.2 AA', level: 'required', name: 'Reflow at 320px', standard: 'WCAG 1.4.10', how: 'At 320px wide the page never scrolls sideways. Tables, charts and code may scroll inside their own box.' },
  { id: 'D7', group: 'WCAG 2.2 AA', level: 'required', name: 'Text spacing', standard: 'WCAG 1.4.12', how: 'With line height 1.5, paragraph spacing 2em, letter spacing 0.12em and word spacing 0.16em forced on, no text is newly clipped or spills out of its box.' },
  { id: 'D8', group: 'WCAG 2.2 AA', level: 'required', name: 'Names, roles, values', standard: 'WCAG 1.3.1, 4.1.2', how: 'axe-core WCAG 2.0–2.2 A and AA rules on every story: zero violations (contrast is D1\'s job).' },
  // Beyond AA: scored and ratcheted
  { id: 'D9', group: 'Beyond AA', level: 'advisory', name: 'Focus appearance', standard: 'WCAG 2.4.13 (AAA)', how: 'The focus change covers at least a 2px outline of the control at 3:1.' },
  { id: 'D10', group: 'Beyond AA', level: 'advisory', name: 'Comfortable targets', standard: 'WCAG 2.5.5 (AAA)', how: 'At phone width, every target offers a 44px hit area.' },
  { id: 'D11', group: 'Beyond AA', level: 'advisory', name: 'Forced colors', standard: 'Windows contrast themes', how: 'With forced colors on, form controls keep a visible boundary, checked and selected items still look different, and focus still shows.' },
  { id: 'D12', group: 'Beyond AA', level: 'advisory', name: 'Reduced motion', standard: 'WCAG 2.3.3 (AAA)', how: 'With reduced motion requested, nothing animates for longer than 200ms or loops.' },
  { id: 'D13', group: 'Beyond AA', level: 'advisory', name: 'Reader font size', standard: 'WCAG 1.4.4', how: 'With the browser font size at 200%, text grows with it (rem-based) and none is newly clipped.' },
  // CyberSkill rules
  { id: 'D14', group: 'CyberSkill', level: 'required', name: 'Dark mode and clean render', standard: 'House rule', how: 'Every story renders in light and dark without errors, and dark mode has no light patches (an opaque light surface left from light mode).' },
  { id: 'D15', group: 'CyberSkill', level: 'required', name: 'Vietnamese diacritics', standard: 'House rule', how: 'The ink of every glyph, stacked marks included (Ẫ Ỗ Ữ ặ ỵ), stays inside the box that clips it, in every story and in input values.' },
  { id: 'D16', group: 'CyberSkill', level: 'required', name: 'Long content', standard: 'House rule', how: 'Long Vietnamese and English text, IDs and emails at 240 and 320px: no component grows past its container and no text spills out.' },
  { id: 'D17', group: 'CyberSkill', level: 'required', name: 'Invalid states', standard: 'WCAG 3.3.1, 1.4.1', how: 'Every form control in error is announced (aria-invalid), linked to visible error text, and its boundary changes visibly (ΔE 15+, 3:1 against the page).' },
  { id: 'D18', group: 'CyberSkill', level: 'required', name: 'Theme scoping', standard: 'House rule', how: 'A ThemeScope inside a page of the other theme gets its own theme, and so do popups opened from inside it.' },
  { id: 'D19', group: 'CyberSkill', level: 'required', name: 'Status colors', standard: 'WCAG 1.4.1', how: 'Rendered status tones stay apart: ΔE 15+ for normal vision, 8+ for protan and deutan vision. Each carries an icon and text.' },
  // The package as apps consume it
  { id: 'D20', group: 'Package', level: 'required', name: 'Server Components', standard: 'React 19 RSC', how: "'use client' on every module that uses hooks and on no entry barrel; the core entry never imports an optional peer (Recharts, TanStack, React Hook Form, react-day-picker, date-fns)." },
  { id: 'D21', group: 'Package', level: 'required', name: 'Docs parity', standard: 'House rule', how: 'Every component has a story, a test file, a site page, a site demo and a generated AI doc.' },
  { id: 'D22', group: 'Package', level: 'required', name: 'Token discipline', standard: 'DTCG 2025.10', how: 'Component CSS uses no raw colors; every token has a $value and a $type (its own or its group\'s).' },
];

export const byId = Object.fromEntries(DIMENSIONS.map(d => [d.id, d]));
