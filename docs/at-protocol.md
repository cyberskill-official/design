# Assistive-technology protocol

Repeatable manual AT and IME review for high-risk widgets. Empty slots are not passes. Published on Storybook **Docs** at `design.cyberskill.world`.

## Scope

Run this protocol before promoting a component to Stable and before each minor release. CI axe and keyboard fixtures are necessary, not sufficient.

Required surfaces: Dialog, AlertDialog, Menu, Combobox, DataGrid, Sortable, Editor, Carousel, DatePicker, TimePicker, Image preview.

## Platforms

Record pass/fail per cell. Do not mark a cell pass without a dated operator note.

1. NVDA + Firefox (Windows)
2. JAWS + Chrome (Windows)
3. VoiceOver + Safari (macOS)
4. VoiceOver + Safari (iOS)
5. TalkBack + Chrome (Android)
6. IME composition (Vietnamese Telex / VNI) on TextField, Editor, Combobox

## Checks

For each surface:

1. Name, role, and value announced on focus
2. Keyboard-only path reaches every action
3. Focus moves into the overlay and restores to the trigger on close
4. Live regions announce sort, carousel, and upload results
5. 200% and 400% zoom still expose the same controls
6. Forced colors keep focus and selected state visible

Store dated notes under `docs/tasks/` when a release claims AT evidence. This file is the protocol, not a completed run log.

## Related

- Support matrix: `docs/support-matrix.md`
- Component contract: `docs/component-contract.md`
- SLOs: `docs/slo.md`
