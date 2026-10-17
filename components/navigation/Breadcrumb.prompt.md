**Breadcrumb** — hierarchical trail; last item is the current page.

```jsx
<Breadcrumb items={[{label:"Status Hub",href:"/"},{label:"Platform"},{label:"Design System v1.6"}]} />
```

Keyboard: Tab reaches native links before the final current-page item; Enter follows them. The last item is noninteractive current-page text. Supply explicit destinations for earlier items; omitted href uses #.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Item labels and destinations remain caller-owned.

Source evidence: `Breadcrumb.jsx` and `Breadcrumb.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
