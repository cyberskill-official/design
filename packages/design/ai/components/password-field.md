# Password field

> A labelled password input with a show/hide toggle that keeps focus and the caret in the input.

```tsx
import { PasswordField } from '@cyberskill/design';
```

`PasswordField` is a `TextField` for passwords: same label, help and error wiring, plus a button at the end of the box that shows or hides what was typed. Clicking it leaves focus and the caret in the input, so people can check a character and keep typing. Use `autoComplete="new-password"` on sign-up and change-password forms so password managers offer a strong one. For one-time codes, use the OTP field instead.

## States

```tsx
<PasswordField label="Password" name="password" />
<PasswordField label="New password" autoComplete="new-password" description="At least 12 characters. A short sentence works well." />
<PasswordField label="Confirm password" error="Use at least 12 characters." />
<PasswordField label="Password" disabled />
```

## Sizes

```tsx
<PasswordField label="Small" size="sm" />
<PasswordField label="Medium" />
<PasswordField label="Large" size="lg" defaultVisible />
```

## Vietnamese text

```tsx
<PasswordField label="Mật khẩu" showPasswordLabel="Hiện mật khẩu" hidePasswordLabel="Ẩn mật khẩu" description="Ít nhất 12 ký tự." />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required). hideLabel (boolean) hides it visually, as on TextField |
| `description / error / optionalLabel` | `ReactNode` | – | Help text, error message (marks the field invalid) and "Optional" text, as on TextField |
| `autoComplete` | `string` | `'current-password'` | Use 'new-password' on sign-up and change-password forms |
| `showPasswordLabel` | `string` | `'Show password'` | Accessible name of the toggle while the password is hidden |
| `hidePasswordLabel` | `string` | `'Hide password'` | Accessible name of the toggle while the password is shown |
| `defaultVisible` | `boolean` | `false` | Start with the password shown |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `required / disabled / name` | `boolean / boolean / string` | – | Form semantics; disabled also disables the toggle |
| `startAdornment` | `ReactNode` | – | Content before the text, e.g. a lock icon |

All other native input props (`value`, `onChange`, `minLength`, `ref`…) pass through to the input. `spellCheck`, `autoCorrect` and `autoCapitalize` are off by default, so a shown password is never sent to a spellcheck service.

## Accessibility

- The toggle is a real button (`type="button"`, never submits the form) named "Show password" or "Hide password" (or your labels) to match what a press will do.
- A click or tap on the toggle keeps focus and the caret in the input. From the keyboard, Tab reaches the toggle and Space or Enter flips it; focus stays on the toggle so its new state is announced.
- The label, help text and error are linked to the input; errors set `aria-invalid` and show an icon with the text.
- The toggle is at least 24px in every size and draws the focus ring inside the box.

## Exact types

```ts
export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'> & {
  /** Accessible name of the toggle while the password is hidden, e.g. "Hiện mật khẩu". */
  showPasswordLabel?: string;
  /** Accessible name of the toggle while the password is shown, e.g. "Ẩn mật khẩu". */
  hidePasswordLabel?: string;
  /** Start with the password shown. */
  defaultVisible?: boolean;
};
```
