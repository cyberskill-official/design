**ButtonGroup** — segmented cluster of Buttons (shared borders, one rounded outline).

```jsx
<ButtonGroup label="View">
  <Button variant="secondary" size="sm">Board</Button>
  <Button variant="secondary" size="sm">List</Button>
</ButtonGroup>
```

Keyboard: The wrapper has `role="group"`; each child retains its own native keyboard behavior. It does not provide arrow navigation or selection state.

Localization: The accessible group label and child content are caller-owned; there is no `lang` prop or built-in translated label.

Source evidence: `ButtonGroup.jsx` and `ButtonGroup.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
