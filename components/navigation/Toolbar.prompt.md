**Toolbar** — action bar with APG arrow navigation, "⋯" overflow menubutton + popup menu, and "-" separators. Escape closes the overflow menu.

```jsx
<Toolbar label="Editor" overflowAfter={3} items={[{icon:<Icon name="edit" size="sm"/>,label:"Edit"},"-",{label:"Share"},{label:"Export"},{label:"Archive"}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Visible action labels preserve numeric zero, including the accessible action name. Null, false and empty strings omit the label span.

Keyboard: Left/Right and Home/End move among head buttons and the overflow button, stopping at the ends. Down/Enter/Space opens overflow and focuses its first item; Up/Down and Home/End move within it. Escape dismisses through the shared overlay stack. Native activation calls supplied onSelect. Use a nonnegative whole overflowAfter index.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The toolbar name, action labels and icons are caller-owned; the overflow button has a localized accessible name.

Source evidence: `Toolbar.jsx` and `Toolbar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
