# Component semantic contracts

`components/specifications.json` separates source observations, authored semantic contracts and exact runtime requirements. Read each category's status and source evidence. A source excerpt establishes the inspected implementation; a passing interaction establishes the tested behavior. Neither establishes manual assistive-technology acceptance or every possible consumer composition.

The authored categories describe anatomy, roles, states, slots, keyboard behavior and examples. A component without a custom keyboard widget still needs a specific contract. For example, Kbd displays key notation without registering shortcuts; Chart is a read-only labelled image; LocaleProvider creates no DOM target; Sidebar delegates native navigation to its descendants. These are source-supported applicability boundaries, not automatic passes for missing tests. Forwarded native attributes or caller-provided children may add behavior outside the component-owned contract.

Native semantics are preserved deliberately:

| Component | Owned behavior and boundary |
| --- | --- |
| RadioGroup | Native fieldset/legend and same-name radios. Disabled choices are skipped; selection and boundary behavior follow the browser's radio model. It is not a tablist. |
| ButtonGroup | Grouping around independent native buttons. It adds no roving selection or arrow-key model. |
| Card, Item, NavItem, ListItem | Their documented native button/anchor targets supply activation and Tab behavior. Custom `as` or caller attributes retain caller responsibility. |
| ScrollArea | Native focusable overflow. PageDown/Space scroll; Arrow behavior follows the browser. It adds no synthetic scrollbar or focus trap. |
| TreeTable | Native table and disclosure buttons. Expansion exposes direct child-row controls; it does not implement an APG treegrid key model. |
| Editor | Native toolbar buttons followed by contenteditable editing. Formatting commands, selection and sanitized output have dedicated tests; it does not add a roving toolbar arrow model. |
| Form/FormField | Native editing/submission and label/description/error/required associations. They add no form-wide keyboard shortcut or wrapper focus trap. |

The native keyboard regression first checks an independently authored HTML radio group. On macOS WebKit, the all-controls traversal chord can be Option+Tab, and native radio arrows stop at group boundaries. Chromium/Firefox can wrap. The component must match the verified native model; the test does not impose one engine's behavior on another. Actual PageDown/Space scrolling and unprevented Arrow input are checked separately, since a single ArrowDown does not scroll the tested native WebKit overflow element. Raw baseline observations are retained with the test evidence.

Slots also require source review. Spinner's inherited native span children are forwarded. Icon and LumiAvatar own their rendered glyph/avatar content. Logo accepts inherited SVG children for type compatibility but ignores them to preserve the official artwork and generated title; nested titles/fragments cannot replace its content or cause a children/inner-HTML collision. SearchField and Slider deliberately discard inherited children because their native inputs are void elements. Protected `rootProps` bags cannot replace owned children.

Run the focused regressions with the repository's pinned Node/npm toolchain:

```sh
CS_TEST_BROWSER=chromium node _audit/ci/test-semantic-keyboard-contracts-browser.mjs
CS_TEST_BROWSER=firefox node _audit/ci/test-semantic-keyboard-contracts-browser.mjs
CS_TEST_BROWSER=webkit node _audit/ci/test-semantic-keyboard-contracts-browser.mjs
node _audit/ci/test-logo-owned-content-types.mjs
CS_TEST_BROWSER=chromium node _audit/ci/test-logo-owned-content-browser.mjs
CS_TEST_BROWSER=firefox node _audit/ci/test-logo-owned-content-browser.mjs
CS_TEST_BROWSER=webkit node _audit/ci/test-logo-owned-content-browser.mjs
```

The keyboard tests use real browser key input and reject actual source regressions that suppress radio changes, remove native scroll entry or ignore disclosure activation. Existing Editor tests additionally exercise formatting through mouse, Enter and Space. Logo tests cover React 18/19 SSR and browser SVG behavior, object/callback ref cleanup, naming/decorative output and exact default artwork preservation; the pre-fix source must reproduce the collision. Strict type fixtures preserve inherited SVG children compatibility and native ref/event/size types.

Do not rewrite an unverified field as “not applicable” from a component name or a missing key literal. Inspect its render paths, helper components, native targets and caller extension points, write the bounded statement, and bind exact source excerpts. Changed excerpts require review. Support approvals and release acceptance remain separate records.
