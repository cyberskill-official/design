import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { FormField } from './FormField';
import { Button, Checkbox, SelectField, TextField } from '../react';

type Values = { email: string; plan: string | null; terms: boolean };
const plans = [{ value: 'team', label: 'Team' }, { value: 'business', label: 'Business' }];

function SignUp() {
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { email: '', plan: null, terms: false } });
  return (
    <form noValidate onSubmit={handleSubmit(() => {})} style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
      <FormField control={control} name="email" rules={{ required: 'Enter a work email.' }}
        render={({ field, error }) => <TextField label="Work email" type="email" placeholder="name@company.vn" {...field} error={error} />} />
      <FormField control={control} name="plan" rules={{ required: 'Choose a plan.' }}
        render={({ field, error }) => <SelectField label="Plan" placeholder="Choose a plan" items={plans} name={field.name} value={field.value} onValueChange={field.onChange} onBlur={field.onBlur} ref={field.ref} error={error} />} />
      <FormField control={control} name="terms" rules={{ validate: accepted => accepted || 'Accept the terms to continue.' }}
        render={({ field, error }) => <Checkbox label="I accept the terms of service" name={field.name} checked={field.value} onCheckedChange={field.onChange} inputRef={field.ref} error={error} />} />
      <div><Button type="submit">Start trial</Button></div>
    </form>
  );
}

const meta = { title: 'Forms/FormField', component: SignUp, tags: ['autodocs'] } satisfies Meta<typeof SignUp>;
export default meta;
type Story = StoryObj<typeof meta>;

/** React Hook Form fields wired through FormField: label, control, error text and aria-invalid in one place. */
export const Default: Story = {};

/** Submitting empty shows each field's error, linked to its control. */
export const Errors: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Start trial' }));
    await expect(await c.findByText('Enter a work email.')).toBeVisible();
    await expect(c.getByRole('textbox', { name: 'Work email' })).toHaveAttribute('aria-invalid', 'true');
  },
};
