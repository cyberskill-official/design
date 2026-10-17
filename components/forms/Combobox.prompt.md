**Combobox** — filterable single-select (typeahead + listbox, arrows/Enter/Escape). Bilingual placeholder + empty state via the registry.

```jsx
<Combobox value={squad} onChange={setSquad} label="Squad"
  options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]}/>
```

When nested in a modal, Escape dismisses only this open child. Modal Tab trapping resumes after dismissal.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

Listbox and active-option references use a hydration-stable React ID. Server and client must render the same component tree; provide distinct identifier prefixes when hydrating independent React roots.

Keyboard: Typing filters options; Up/Down changes the highlighted option, Enter selects it, and Escape dismisses the popup. Arrow and Enter handlers ignore keys flagged as composing by nativeEvent.isComposing or legacy keyCode 229; ordinary text input still updates the local filter. Supply `label` for field context and apply `onChange` to `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Option labels remain caller-owned.

Source evidence: `Combobox.jsx` and `Combobox.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
