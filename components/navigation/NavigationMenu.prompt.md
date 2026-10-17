**NavigationMenu** — site nav; entries link out or open a panel of rich links.

```jsx
<NavigationMenu items={[{label:"Services",panel:[{label:"Web apps",desc:"Product apps",href:"#"}]},{label:"Work",href:"#"}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Panel-link descriptions preserve numeric zero; null, false and empty strings omit the description.

Rich panels retain two flexible columns within the viewport’s inline width,
with an 8px allowance at each inline edge. Long labels and descriptions wrap within their cards. Positioning
updates when switching panels, scrolling or resizing the viewport.

Keyboard: Tab reaches native panel buttons and links. Enter/Space toggles a panel button; Enter follows a link. Native Tab reaches panel links, selection closes the panel, and Escape dismisses through the shared overlay stack. This implementation adds no arrow-key navigation.

Localization: All top-level labels, panel labels, descriptions and destinations are caller-owned; there is no built-in translation.

Source evidence: `NavigationMenu.jsx` and `NavigationMenu.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
