# Form

> A form that validates its fields, focuses the first error and shows server errors under the right field.

```tsx
import { Button, Form, TextField } from '@cyberskill/design';
```

Use `Form` around `TextField`, `Field` and other form controls. It runs native validation (`required`, `type="email"`, `minLength`, `pattern`) on submit, shows each message under its field and moves focus to the first invalid one. For React Hook Form, see [Forms](/docs/components/forms).

## Sign-up with a server error

Submit empty to see native errors. Enter `linh@acme.vn` to see a server error: it appears under the email field and clears as soon as you edit it.

```tsx
const [errors, setErrors] = useState({});

<Form
  errors={errors}
  onFormSubmit={async (values) => {
    const res = await signUp(values); // { email: 'linh@acme.vn', … }
    if (res.error) setErrors({ email: res.error });
  }}
>
  <TextField label="Full name" name="name" required />
  <TextField label="Work email" name="email" type="email" required />
  <TextField label="Password" name="password" type="password" required minLength={8} />
  <Button type="submit" loading={loading}>Create account</Button>
</Form>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `errors` | `Record<string, string \| string[]>` | – | Server errors keyed by field name; each shows under that field until its value changes |
| `onFormSubmit` | `(values, details) => void` | – | Called with the values as an object after validation passes |
| `onSubmit` | `(event) => void` | – | The native submit event, for form libraries |
| `validationMode` | `'onSubmit' \| 'onBlur' \| 'onChange'` | `'onSubmit'` | When fields validate; after a submit they re-validate on change |
| `actionsRef` | `RefObject<{ validate(name?) }>` | – | Validate all fields, or one, on demand |

Each field needs a `name`: it keys both the values and the `errors`.

## Accessibility

- Errors are linked to their input with `aria-describedby` and set `aria-invalid`, so screen readers read the message with the field.
- On a failed submit, focus moves to the first invalid field.
- Messages use text plus color, never color alone. Give the form an `aria-label` when it has no visible heading.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the button focusable and announces it as busy. */
  loading?: boolean;
  /** Icon before the label (decorative). */
  iconStart?: ReactNode;
  /** Icon after the label (decorative). */
  iconEnd?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
};
export type FormProps<V extends Values = Values> = Omit<BaseUI.Form.Props<V>, 'className'> & {
  className?: string;
};
export type TextFieldProps = Omit<InputProps, 'children'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
```
