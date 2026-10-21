# Scoped UI messages

`LocaleProvider` supplies UI copy to its descendants without rendering a DOM element. Import it and `useMessages` from `@cyberskill/design` (or the explicit `@cyberskill/design/source` authoring entry). Existing component `lang` props and DOM language inheritance still select the language. Providers carry dictionaries; they do not select a language.

```jsx
import {LocaleProvider, Pagination, useMessages} from '@cyberskill/design';

const messages = {
  Pagination: {en: {next: 'Continue'}, vi: {next: 'Tiếp tục'}},
  Checkout: {fr: {pay: 'Payer'}, en: {pay: 'Pay now'}},
};
function CheckoutCopy() {
  const t = useMessages('Checkout', 'fr-FR');
  return <p>{t('pay')}</p>;
}
function App() {
  return <LocaleProvider messages={messages}>
    <Pagination lang="en" pageCount={10}/>
    <CheckoutCopy/>
  </LocaleProvider>;
}
```

Existing namespace names and keys are declared in [the built-in registry](../components/_i18n/strings.js). Application namespaces can add independent keys; `useMessages(namespace, lang)` requires an explicit language. It is a React hook: call it unconditionally at component scope. The returned resolver may be called conditionally. Caller-supplied component labels and content keep their existing precedence; dictionaries change built-in messages, not arbitrary props.

For each key, lookup tries the requested primary language, English, then Vietnamese. Within each language it checks the nearest provider, its parents, then the built-in table. A parent's requested-language value therefore wins over a child's English fallback. Missing keys return the key itself; empty strings remain empty. Sibling providers are independent, and unmounting a provider removes its overrides. Nested scopes may intentionally override the same namespace/key.

Locale tags use the existing primary-language normalization: `fr-FR` and `fr-CA` both select `fr`; existing aliases such as `English` also normalize. Defining two aliases for one primary language inside the same namespace is an error, even if their keys differ. Split regional copy into application namespaces if necessary; this API does not provide regional-language negotiation.

`messages` must be a plain record (ordinary or null prototype), containing namespace records, locale records and string values. Empty names, symbols, `__proto__`, `prototype`, `constructor`, accessor properties, non-string values and non-plain records are rejected. Validation reads property descriptors and does not invoke dictionary getters. Copy renders as ordinary React text; there is no HTML interpolation or executable message function.

The provider snapshots and freezes accepted data without modifying the caller's objects or the immutable built-in registry. Pass a **new `messages` object reference** to update copy. Mutating an already supplied object does not update its snapshot. Invalid input throws before an accepted registry is created; applications can show an ordinary React error boundary. Registries are held in provider context, so independent React roots and server requests do not install global overrides.

This is a UI-message extension. It does not extend date/number formatting, change existing formatter fallback behavior, set `dir`, or add RTL layout support. An added `fr` dictionary can translate a component's built-in UI while its formatter retains the existing unsupported-locale fallback. Accessibility names derived from built-in messages change with copy; component roles, keyboard behavior and state remain component-owned. `LocaleProvider` has no native root, `rootProps`, ref target or keyboard behavior.

The declaration is [LocaleProvider.d.ts](../components/i18n/LocaleProvider.d.ts). The [runtime API contract](runtime-api.md) records its context-only boundary; copied markup does not carry provider behavior.
