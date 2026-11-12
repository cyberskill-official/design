# Forms (React Hook Form)

> FormField connects React Hook Form to every field component and shows its validation message.

```tsx
import { Button, Checkbox, SelectField, TextField } from '@cyberskill/design';
import { FormField } from '@cyberskill/design/forms';
```

`FormField` is React Hook Form's `Controller` plus one thing: it hands your render function the field's validation message as `error`, ready for the `error` prop of `TextField`, `Textarea`, `SelectField`, `Checkbox`, `CheckboxGroup`, `RadioGroup` and the date and time pickers. It lives in its own entry so apps that don't use React Hook Form never load it.

```bash
npm install react-hook-form
```

```tsx
import { FormField } from '@cyberskill/design/forms';
```

## Example

Submit the empty form to see the errors; the first invalid field gets focus.

```tsx
const { control, handleSubmit } = useForm<Values>({
  defaultValues: { email: '', plan: null, billing: null, terms: false },
});

<form noValidate onSubmit={handleSubmit(onSubmit)}>
  <FormField
    control={control}
    name="email"
    rules={{ required: 'Enter a work email.' }}
    render={({ field, error }) => <TextField label="Work email" type="email" {...field} error={error} />}
  />
  <FormField
    control={control}
    name="plan"
    rules={{ required: 'Choose a plan.' }}
    render={({ field, error }) => (
      <SelectField label="Plan" items={plans} placeholder="Choose a plan"
        name={field.name} value={field.value} onValueChange={field.onChange}
        onBlur={field.onBlur} ref={field.ref} error={error} />
    )}
  />
  <FormField
    control={control}
    name="terms"
    rules={{ validate: (accepted) => accepted || 'Accept the terms to continue.' }}
    render={({ field, error }) => (
      <Checkbox label="I accept the terms of service" checked={field.value}
        onCheckedChange={field.onChange} inputRef={field.ref} error={error} />
    )}
  />
  <Button type="submit">Start trial</Button>
</form>
```

## With a zod schema

Install `zod` and `@hookform/resolvers`, then pass the resolver to `useForm`. `FormField` is unchanged: the schema's messages arrive as `error`.

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.email('Enter a valid email, like name@company.vn.'),
  plan: z.string('Choose a plan.'),
  terms: z.literal(true, 'Accept the terms to continue.'),
});

const { control, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues });
```

## Wiring each component

Text inputs take `{...field}` directly. Other controls use their own value props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `TextField, Textarea` | `{...field}` | – | value, onChange, onBlur, ref and name map one to one |
| `SelectField` | `value, onValueChange, onBlur, ref` | – | ref focuses the trigger on error. Start the value at null, not undefined |
| `Checkbox, Switch` | `checked, onCheckedChange, inputRef` | – | The field value is a boolean |
| `CheckboxGroup` | `value, onValueChange` | – | The field value is a string array |
| `RadioGroup` | `value, onValueChange, inputRef` | – | Start the value at null for "nothing chosen" |
| `DatePicker, DateRangePicker, TimePicker, DateTimePicker` | `name, value, onValueChange, onBlur, inputRef` | – | Start at null. Invalid typed text sets the value to null, so required rules catch it |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `control / name` | `Control / field path` | – | From useForm (required) |
| `rules` | `RegisterOptions` | – | React Hook Form validation rules, when you don’t use a resolver |
| `render` | `({ field, fieldState, formState, error }) => ReactElement` | – | Renders the field; error is fieldState.error?.message, or invalidLabel when the rule has no message |
| `invalidLabel` | `string` | `'Invalid value'` | Error text for a failed rule without a message, e.g. required: true |
| `defaultValue / shouldUnregister / disabled` | `–` | – | Same as Controller |

## Accessibility

- Errors appear as text under the field and are linked to it, so screen readers announce them; invalid fields set `aria-invalid`.
- On a failed submit, React Hook Form moves focus to the first invalid field (pass `ref` / `inputRef` as shown).
- Add `noValidate` to the form so the browser's own bubbles don't compete with these messages.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. `secondary` is a soft ink fill; `soft` is the same fill in any `tone`. */
  variant?: ButtonVariant;
  /** Tint of a `soft` button, e.g. `success` for Approve or `danger` for a quiet Remove. Ignored by other variants. */
  tone?: 'primary' | 'accent' | StatusTone;
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
export type CheckboxProps = Omit<BaseUI.Checkbox.Root.Props, 'className' | 'children'> & {
  /** Class for the row (box + label + description). */
  className?: string;
  /** Visible label beside the box. Clicking it toggles the checkbox. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
  /** Error message for a standalone checkbox (e.g. "Accept the terms to continue"). Marks it invalid. */
  error?: ReactNode;
};
export type SelectFieldProps<Value = string> = SelectProps<Value> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
export type TextFieldProps = Omit<InputProps, 'children'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
export type FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, TTransformedValues = TFieldValues> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> & {
  render: (props: FormFieldRenderProps<TFieldValues, TName, TTransformedValues>) => ReactElement;
  /** Error text for a failed rule without a message (`required: true`), so the field never turns invalid with no words. */
  invalidLabel?: string;
};
```
