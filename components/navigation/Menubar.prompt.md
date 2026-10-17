**Menubar** — app menu bar (File/Edit-style); hover switches while open, "-" separators.

```jsx
<Menubar menus={[{label:"File",items:[{label:"New"},"-",{label:"Export"}]},{label:"Edit",items:[{label:"Undo"}]}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

ArrowDown/ArrowUp on a top-level item opens and focuses the first/last submenu item. Submenu arrows and Home/End move between items, Left/Right switches menus, and Escape restores the top-level trigger. Each submenu is labelled by its trigger.

Keyboard: Left/Right wrap across top-level menus; Home/End reach the ends. Down/Up opens and focuses the first/last submenu item. Submenu Up/Down wraps, Home/End reaches ends, and Left/Right switches menus. Escape closes and restores the trigger; Tab closes while continuing native focus movement. Selection invokes caller onSelect.

Localization: All menu and item labels are caller-owned; there is no lang prop or built-in translated menu list.

Source evidence: `Menubar.jsx` and `Menubar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
