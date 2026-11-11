# OTP field

> One-time code input with one box per character, paste support and an onComplete callback.

```tsx
import { OtpField } from '@cyberskill/design';
```

Use an OTP field for short verification codes sent by SMS, email or an authenticator app. Focus moves to the next box as you type, Backspace moves back, and pasting the whole code fills every box. Browsers can autofill the code from SMS. For longer secrets such as API keys, use a text field.

## Verify a code

```tsx
<OtpField
  label="Verification code"
  description="We sent a 6-digit code to +84 90 123 4567."
  onComplete={(code) => verify(code)}
/>
```

## States and options

```tsx
<OtpField label="Wrong code" defaultValue="123456" error="That code is not valid. Check the latest SMS." />
<OtpField label="PIN" length={4} mask />
<OtpField label="Recovery code" length={8} validationType="alphanumeric" slotLabel={(n, total) => `Ký tự ${n} trên ${total}`} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required); names the first box |
| `length` | `number` | `6` | Number of boxes |
| `onComplete` | `(value, details) => void` | – | Called once every box is filled, typed or pasted |
| `value / defaultValue / onValueChange` | `string` | – | The code so far, controlled or initial |
| `validationType` | `'numeric' \| 'alpha' \| 'alphanumeric' \| 'none'` | `'numeric'` | Which characters are accepted |
| `mask` | `boolean` | `false` | Hide the characters like a password |
| `slotLabel` | `(position, length) => string` | ``Character ${n} of ${total}`` | Accessible names of boxes 2…N |
| `description / error` | `ReactNode` | – | Help text, and an error that marks every box invalid |
| `required / disabled / name` | `boolean / boolean / string` | – | Form semantics; the whole code is submitted under name |

Also takes `autoSubmit` (submit the form when complete), `normalizeValue`, `inputMode` and `className` for the row of boxes.

## Accessibility

- The first box is labelled by the field label; the others are named "Character 2 of 6" and so on, so screen readers say where you are.
- Help text and errors are read with the boxes. Rejected characters (letters in a numeric code) are ignored.
- Boxes are 44 × 48px with the same focus ring as text fields. `autocomplete="one-time-code"` is set for SMS autofill.

## Exact types

```ts
type OtpFieldProps = Omit<OTPField.Root.Props, 'className' | 'length' | 'onValueComplete'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  /** Class for the row of boxes. */
  className?: string;
  fieldClassName?: string;
  /** Number of boxes. */
  length?: number;
  /** Called once every box is filled (typed or pasted), e.g. to verify the code. */
  onComplete?: OTPField.Root.Props['onValueComplete'];
  /** Accessible name of boxes 2…N (box 1 uses `label`). Pass Vietnamese text in Vietnamese UIs. */
  slotLabel?: (position: number, length: number) => string;
```
