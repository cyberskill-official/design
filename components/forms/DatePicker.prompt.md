**DatePicker** — field + popover Calendar; VN format DD/MM/YYYY, Monday week-start.

The popup dialog takes its accessible name from the nonblank `label`, then the
nonblank `placeholder`, then “Select a date” / “Chọn ngày”. Whitespace-only names
use the same fallback. An open dialog follows label and language changes.

```jsx
<DatePicker value={date} onChange={setDate}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

Numeric timestamps include epoch `0`; it displays the same date as `new Date(0)` in the local time zone. Empty values retain the placeholder.

The popup stays within the viewport’s inline width with an 8px allowance at each inline edge, including when
its field is near the right edge or the viewport changes while open. On narrow
hosts the calendar scrolls locally, preserving 44px coarse-pointer day targets.

Keyboard: Enter/Space on the field opens the popup; its Calendar uses native day/month buttons. Escape dismisses it. Date selection calls `onChange`; the consumer commits the selected value.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. VN uses DD/MM/YYYY; EN uses a day, abbreviated month and year in local time.

Source evidence: `DatePicker.jsx` and `DatePicker.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
