**Calendar** — month grid, Monday week-start, bilingual (Tháng 7 · T2–CN). Controlled Date value.

```jsx
<Calendar value={date} onChange={setDate}/>
```

Numeric timestamp `0` is a valid value. A change to the selected year/month
updates the visible month; passing an equivalent date preserves manual browsing.
Dates are displayed in the browser local timezone. Invalid date values behave
as no selection. `onChange` proposes a date; the caller commits it through `value`.

On coarse pointers, day controls retain 44px targets and the day grid can scroll
inside a narrow calendar. The month header fits the visible calendar width and
stays visible during horizontal scrolling.

Keyboard: Tab reaches month navigation and each rendered day button; Enter/Space activates them. This implementation does not provide arrow-key date-grid navigation.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Month and weekday headings follow the selected language; dates use local time.

Source evidence: `Calendar.jsx` and `Calendar.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
