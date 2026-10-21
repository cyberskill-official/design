# Runtime API contract

This guide describes the compiled React runtime delivered by this package. It does not change the existing template runtime, document export contract, license grant or release approval requirements. Component declarations are the precise source for supported targets and props.

## Entries and peers

```jsx
import {Button, TextField, LocaleProvider, useMessages} from '@cyberskill/design';
import '@cyberskill/design/styles.css';
```

The package root and `/react` resolve to compiled ESM at `dist/esm/_esm/react.mjs`. Compiled deep imports such as `@cyberskill/design/components/forms/Form.jsx` share module/context identity with the root. React and react-dom are external peers supporting React 18 and 19. This ESM path supports Node SSR without a JSX loader; it promises no CommonJS entry. The generated modules retain `"use client"` boundaries and linked source maps.

`@cyberskill/design/source` and `/source/components/*` explicitly expose raw JSX/JS for source-aware bundlers. Transpile that entry and use one module family consistently within a component tree. `/legacy` is the browser-only global runtime. Load CSS separately; components do not inject it.

## Native targets and fields

`ref` reaches each component's declared primary native element; it is not mechanically the outer wrapper. For example, TextField forwards to its input and Menu forwards to its div root. Conditional targets may be null while unmounted. The additional `controlRef` exists only where the declaration documents a distinct control target. Context-only OverlayProvider and LocaleProvider have no native ref. Callback/object refs are composed with internal refs; React 19 callback cleanup remains supported.

Where declared, `rootProps` addresses the existing wrapper and `controlProps` the documented control or semantic group. They do not replace component-owned roles, popup relationships, state, values or behavior. Internal handlers run before caller handlers. Reserved ref/key/children/HTML-injection/prototype properties are ignored by target bags; use explicit ref APIs. Existing rest-prop targets remain as documented by each component.

Participating inputs inside FormField inherit field label, hint, error and required associations. Explicit local names retain precedence; descriptions merge without sharing generated control IDs. Value ownership and native form serialization remain separate component contracts: a prop bag does not invent hidden fields or array serialization.

## Messages and menu keyboard behavior

LocaleProvider provides immutable namespace dictionaries without adding DOM or selecting a language. Call `useMessages(namespace, lang)` unconditionally inside a component. Existing component language selection remains in effect. For each key, requested primary language, English, then Vietnamese are tried across provider scopes and built-ins; unresolved keys return themselves. Pass a new dictionary reference to update messages. See [scoped UI messages](locale-messages.md) for validation, fallback ordering and boundaries.

Menu is a menu button: trigger ArrowDown/ArrowUp opens at the first/last enabled item; roving arrows, Home/End and typeahead navigate. Enter/Space activates an item. Tab closes and follows sequential focus order; Escape closes and restores the trigger. Controlled open/onOpenChange callers must commit requested changes.

## Anchored panels and compatibility

The 17 supported anchored owners default to body placement with collision handling; `portal={false}` retains inline placement. Original inline insertion ancestry inside form or fieldset forces inline placement even when portal is explicitly true, preserving native ancestry. Automatic context changes use the stable host to preserve child state. Explicit portal mode changes can remount children. Platform focus restoration can still produce native blur/focus events; do not infer same-task focus continuity or native form associations across arbitrary cross-document movement. Component declarations specify supported placement props; custom unregistered portals remain caller-owned.

The SegmentedControl default is a radiogroup value picker; explicit `mode="tabs"` preserves tab semantics for caller-provided panels. The deprecated semantic aliases `role="tablist"` and `role="radiogroup"` remain supported: when `mode` is omitted they select matching tab or radio children; explicit `mode` wins. Other role values reject. No published notice version/date is asserted; the two-published-minor and 90-day notice policy still applies before alias removal. Any future removal of these retained aliases remains subject to the release notice policy: a major version alone does not waive the required published-minor and elapsed-time notice. This guide is not release authorization or support acceptance.
