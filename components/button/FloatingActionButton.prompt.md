**FloatingActionButton** — round action using the active `--cs-accent` fill and `--cs-accent-on` foreground (fixed bottom-right by default); optional speed-dial `actions`. The default Earth accent is Ochre; other element variants follow their generated accent.

```jsx
<FloatingActionButton icon={<Icon name="sparkle"/>} label="Make a wish"
  actions={[{icon:<Icon name="chat" size="sm"/>,label:"Talk to Lumi"}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

On coarse pointers, each speed-dial action has a minimum 44 × 44 CSS-pixel target. The main action stays 56 × 56.

Keyboard: Tab reaches the native main/action buttons; Enter/Space opens the dial or activates an action. Escape closes the dial through the shared overlay stack. With actions, the main button toggles the dial; without them it calls `onClick`.

Localization: The required main label and each action label are caller-owned. There is no built-in translation or `lang` prop.

Source evidence: `FloatingActionButton.jsx` and `FloatingActionButton.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
