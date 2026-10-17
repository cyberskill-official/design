**Button** — the primary action control; Umber-filled by default, composite focus indicator (text-primary contour + Ochre halo), 44px touch target. Use for the main action in a view; step down to `secondary` / `tertiary` / `ghost` for lower emphasis, `danger` for destructive actions.

```jsx
<Button variant="primary" size="md" onClick={save}>Save wish</Button>
<Button variant="secondary" icon={<Icon name="arrow-right" />}>Learn more</Button>
<Button variant="danger" loading>Deleting…</Button>
```

- **variant**: `primary` (Umber) · `secondary` (outlined) · `tertiary` (subtle raised) · `ghost` · `danger` · `danger-ghost`

- **size**: `xs` (28px) · `sm` (36px) · `md` (44px, default) · `lg` (52px) — sizes from `--cs-component-button-{xs,sm,md,lg}-*` tokens; coarse pointers bump via `--cs-component-button-{xs,sm,md}-minHeight-coarse`
- **loading** shows a spinner + sets `aria-busy`; **fullWidth** stretches; **icon** adds a leading glyph.

The icon slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

`danger` pairs its fill with `--cs-color-semantic-danger-fg`; `danger-ghost` uses `--cs-color-semantic-danger-text` on its surrounding surface.

For primary Button text, use its generated component foreground. Dark elemental primary foreground consumes `--cs-accent-on-strong`, paired with the strong fill; `--cs-accent-on` belongs to the bright fill. The maintained strong-text browser check covers static primary states and regular callout text, with separate UI and body floors.

Keyboard: Uses native button focus and Enter/Space activation. `loading` disables the button and sets `aria-busy`; the default type is `button`, so set `type="submit"` for form submission.

Localization: Labels and children are caller-owned; there is no built-in translated action text. The icon and loading spinner are decorative.

Source evidence: `Button.jsx` and `Button.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
