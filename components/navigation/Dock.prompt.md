**Dock** — magnifying icon dock (active dot, aria labels).

```jsx
<Dock label="Apps" items={[{icon:<Icon name="chat"/>,label:"Lumi",active:true}]}/>
```

Keyboard: Each native button is in Tab order and supports Enter/Space; focus also applies magnification. The wrapper does not add arrow-key roving. The caller handles onSelect and active state.

Localization: Toolbar and item labels are caller-owned. There is no built-in translated application list; provide a meaningful dock label.

Source evidence: `Dock.jsx` and `Dock.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
