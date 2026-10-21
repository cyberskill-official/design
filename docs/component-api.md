# Current component API grammar

## Compatibility, versions and deprecation

Releases use Semantic Versioning: corrections preserving the supported contract belong in a patch, additive public APIs require a minor release, and incompatible changes require a major release. This applies to package entrypoints, supported peer major versions, native targets, keyboard/focus behavior and documented DOM/placement contracts as well as prop names and types. Classify the actual consumer effect; an unchanged export name does not make a behavior change compatible.

Removing a public contract requires a major release **and both** at least two distinct published minor releases and 90 days of documented deprecation notice. Dates use UTC calendar days. Patch releases within one minor line and major releases alone do not count as two minor releases. Supply a migration path and source-bound evidence of the published releases. Undated aliases, old prose and unpublished notices do not start a notice clock; no existing prop has been newly deprecated by this policy.

The authored `components/release-compatibility.json` records the pre-candidate baseline, reviewed pending change classifications, dated notices and publication evidence. Release planning, prepared-candidate verification and tag verification enforce it alongside the unchanged support-approval and exact-source gates. The approved compiled-default entry, APG Menu keyboard, SegmentedControl radio default and default floating placement changes are classified as breaking for the current unreleased revision; patch/minor preparation is blocked. This does not assign a new release identifier, approve support evidence, create a tag or authorize publication. Before a later release cycle, reconcile the baseline and pending entries against the actual accepted publication; never silently clear notice history.

SegmentedControl retains deprecated semantic aliases `role="tablist"` and `role="radiogroup"`. When `mode` is omitted, the alias selects matching tab or radio children; explicit `mode` takes precedence, and the default remains radio. Other role values reject rather than producing mismatched ARIA semantics. Prefer `mode="tabs"` or `mode="radio"`. The earlier removal proposal is archived in `_audit/remediation/segmented-role-removal-proposal-history.json`; it is not a current removal. Rejecting arbitrary roles remains classified as breaking. Announcement fields remain null: this local guidance does not establish a published notice, date or version. Any future removal still requires a major release after two distinct published minor releases and 90 days of recorded notice, alongside all other release gates.

The currently declared React support lines are 18.x and 19.x; packed-consumer and hydration fixtures test their pinned versions. This is a major-version support window, not proof of every historical patch or a promise about unreleased React majors. Removing a declared line follows the same major-release and deprecation policy. New React majors require explicit compatibility validation before widening peer ranges. Browser targets remain the latest-two policy in the browser-support guide, with engine and physical-device evidence reported separately.

The public contract for a selected export is its adjacent `.d.ts`, `.jsx` and `.prompt.md` trio. `components/api-index.json` locates declarations and inherited prop definitions; it does not prove defaults, passthrough, behavior or human acceptance. Public co-exports are documented in the parent component's files. Confirm the actual source and relevant browser test before extending a contract.

## State ownership and callbacks

For components that declare `value`, `defaultValue` and `onChange`, `value` is controlled state, `defaultValue` seeds local state and `onChange` reports changes. The callback argument comes from that component's declaration: it can be a scalar, collection or event. Never substitute a native DOM event for a declared value callback. Do not switch controlled/local ownership during a mount. [Consuming](consuming.md) describes current ownership exceptions and form integration.

Open-state APIs vary: some overlays require `open` and use `onClose`; others declare `open`, `defaultOpen` and `onOpenChange`. `onDismiss`, `onClose` and `onOpenChange` are distinct contracts. Awaited form callbacks accept the declared asynchronous return type. Use the declaration for the selected export rather than assuming every component supports an ownership triplet.

## Composition, refs and native attributes

`children`, named slots, `label` and render callbacks have component-specific types. An export accepting `className` does not automatically forward `id`, `style`, `data-*`, `aria-*`, native handlers or arbitrary rest props. Confirm explicit declaration and runtime forwarding to the intended DOM node before depending on them. Error text visible in FormField does not automatically establish a composite input's described-by relationship.

Native component exports forward `ref` to their documented native target, with `controlRef` for a distinct owned control. Context-only providers have no DOM ref. See [native refs](runtime-api.md) for targets, null availability and React 18/19 callback behavior. Anchored panels share the [body portal and collision placement contract](runtime-api.md), with an inline opt-out. The current overlay manager coordinates one document-wide stack; consult [the overlay decision](decisions/overlay-manager-design.md) before using multiple bundles or independent document roots.

## Names, enums and accessibility

Existing enum vocabularies and sizes vary by export. `danger`, `destructive` and `error` are not interchangeable aliases; neither are `empty` and `emptyState`, or `tone` and `variant`. Where aliases exist, source defines precedence. Do not rename or normalize public props without a compatibility/deprecation decision and targeted contract tests.

Every new or changed prop needs matching source, declaration, prompt, examples and behavioral checks. Preserve accessible names, roles, keyboard behavior and focus ownership through state changes. A prompt's keyboard summary is descriptive evidence; validate it against implementation and tests. The lifecycle record and API inventory do not replace rendered-state accessibility checks or manual assistive-technology acceptance.

The generated [component source contracts](../components/contracts.json) separate authored and inherited props, preserve literal default expressions and prompt keyboard declarations, and locate CSS hooks with source hashes. Regenerate with `npm run build:component-contracts`; check with `npm run test:component-contracts`. These are observed source facts, not complete authored anatomy, ARIA semantics or verified accessibility contracts.

## Explicit attribute targets and field associations

Components that declare `rootProps` apply it to an existing element; they do not add a wrapper. Adjacent declarations and prompts identify the exact target and protected attributes. For example, Drawer targets its dialog `div`, Popover and Tooltip their outer `span`, DataGrid its scrolling `div`, and CommandPalette its dialog rather than the dismissal scrim. Existing top-level attributes keep their original targets. Context-only OverlayProvider has no DOM target.

`rootProps` merges classes and styles and composes existing handlers, with internal handlers running first. Component-owned roles, state, keyboard behavior and geometry remain protected. The declaration excludes protected keys; runtime guards also reject children, HTML injection, refs and prototype keys when callers bypass types. Use the explicit component `ref`/`controlRef` contract for refs; the bags remain attribute-only.

The participating fields also declare `controlProps`:

| Component | `rootProps` | `controlProps` |
|---|---|---|
| Combobox | Wrapper | Editable combobox input |
| DatePicker | Wrapper | Date trigger button |
| NumberField | Field wrapper | Numeric input; existing native passthrough remains here |
| Cascader, TreeSelect | Wrapper | Popup trigger button |
| TagInput | Wrapper | Text-entry input |
| ColorPicker | Wrapper | Color trigger button; not the separate editor |
| Rating | Existing radiogroup | Same logical radiogroup |
| InputOTP | Existing group | Same logical group; no bag is copied to every digit |

Explicit naming wins over fallback names. FormField supplies label, hint and error references to participating descendants; blank labels retain the field's localized fallback. Controls generate distinct IDs, including multiple controls under one field. Caller description references are deduplicated with field and local help/error references. Numeric `0` is valid label/help/error content. Removing an error removes its association without erasing an explicit caller invalid state.

```jsx
<FormField label="Project" hint="Choose one project" error={error}>
  <Combobox
    options={projects}
    value={project}
    onChange={setProject}
    rootProps={{ 'data-analytics': 'project-field' }}
    controlProps={{ id: 'project-control', 'aria-describedby': 'project-policy' }}
  />
</FormField>
```

Standalone participating fields accept `description`, `error` and `required`. Native NumberField keeps native `name`, FormData and required validity. Buttons do not gain `aria-required` or native constraint validation; InputOTP's group uses an associated required instruction. Rating exposes required state on its radiogroup. Use Form validation rules for controller validation. No hidden submission serialization for selected objects, dates or digit collections is implied. InputOTP digit IDs and labels remain unique and retain positional names; group descriptions/errors reach the digits.

Native input/select/textarea children of FormField receive actual label and description associations. For another custom control, FormField accepts a render function receiving association attributes; apply those to its semantic control. This escape hatch supplies associations, not a new form-value or serialization protocol.

Check native targets with `test-native-refs-browser.mjs`, public declarations with `test-types.mjs`, and cross-entry Form/field associations with `test-compiled-esm-packed.mjs`. These bounded automated checks do not replace manual assistive-technology acceptance.

## Scoped messages and rendered references

Use [scoped UI messages](locale-messages.md) for consumer overrides and additional copy namespaces; date/number formatter fallbacks and directionality remain separate contracts. Verify actual rendered DOM and relevant states; an API inventory is neither a standalone widget nor a complete state/accessibility specification.

## Source facts and evidence limits

`components/contracts.json` records source-bound authored/inherited props, literal default expressions, observed class hooks and declared keyboard prose. Generate it with `npm run build:component-contracts` after the API and CSS indexes, and check its strict source parser with `npm run test:component-contracts`. These facts do not certify behavior, complete accessibility coverage or human acceptance. Inspect the adjacent source and declarations, exercise the actual state and retain manual acceptance separately.

AlertDialog uses `tone` as its canonical spelling and retains `variant` as a compatibility alias. Explicit `tone` wins; when it is omitted, `variant` applies. `destructive` means danger action paint plus initial Cancel focus. `tone="default"` overrides `variant="destructive"`. Button `danger`, validation `error` and component-specific size names remain distinct declared domains; consult the declaration-derived story controls rather than translating values by analogy. No alias is scheduled for removal without the notice policy above.
