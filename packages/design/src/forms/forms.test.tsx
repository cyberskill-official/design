import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { FormField } from './index';
import { Button } from '../react/Button';
import { Checkbox } from '../react/Checkbox';
import { Radio, RadioGroup } from '../react/RadioGroup';
import { TextField } from '../react/Field';
import { SelectField } from '../react/Select';
import { DatePicker } from '../date/DatePicker';
import { expectAccessibleInThemes } from '../test/a11y';

// `@hookform/resolvers` is not installed here, so validation uses RHF `rules`; a zod resolver plugs into `useForm` the same way.
type Values = { email: string; plan: string | null; billing: string | null; terms: boolean };

function InviteForm({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { email: '', plan: null, billing: null, terms: false } });
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <FormField
        control={control}
        name="email"
        rules={{ required: 'Enter a work email.', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email, like name@company.vn.' } }}
        render={({ field, error }) => <TextField label="Work email" type="email" {...field} error={error} />}
      />
      <FormField
        control={control}
        name="plan"
        rules={{ required: 'Choose a plan.' }}
        render={({ field, error }) => (
          <SelectField
            label="Plan"
            placeholder="Choose a plan"
            items={[{ value: 'team', label: 'Team' }, { value: 'business', label: 'Business' }]}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={error}
          />
        )}
      />
      <FormField
        control={control}
        name="billing"
        rules={{ required: 'Choose a billing cycle.' }}
        render={({ field, error }) => (
          <RadioGroup label="Billing cycle" name={field.name} value={field.value} onValueChange={field.onChange} inputRef={field.ref} error={error}>
            <Radio value="monthly" label="Monthly" />
            <Radio value="yearly" label="Yearly" />
          </RadioGroup>
        )}
      />
      <FormField
        control={control}
        name="terms"
        rules={{ validate: v => v || 'Accept the terms to continue.' }}
        render={({ field, error }) => (
          <Checkbox label="I accept the terms" name={field.name} checked={field.value} onCheckedChange={field.onChange} inputRef={field.ref} error={error} />
        )}
      />
      <Button type="submit">Send invite</Button>
    </form>
  );
}

// A date picker wired the way the docs show: value/onValueChange, onBlur and inputRef.
function BookingForm({ onSubmit }: { onSubmit: (values: { start: Date | null }) => void }) {
  const { control, handleSubmit } = useForm<{ start: Date | null }>({ mode: 'onBlur', defaultValues: { start: null } });
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <FormField
        control={control}
        name="start"
        rules={{ required: 'Pick a start date.' }}
        render={({ field, error }) => (
          <DatePicker label="Start date" name={field.name} value={field.value} onValueChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} error={error} />
        )}
      />
      <Button type="submit">Book</Button>
    </form>
  );
}

describe('FormField', () => {
  it('passes validation messages into the error props and focuses the first invalid field', async () => {
    const onSubmit = vi.fn();
    render(<InviteForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send invite' }));
    const email = screen.getByLabelText('Work email');
    await expect.poll(() => email.getAttribute('aria-invalid')).toBe('true');
    expect(email).toHaveAccessibleDescription(expect.stringContaining('Enter a work email.'));
    expect(screen.getByRole('combobox', { name: 'Plan' })).toHaveAccessibleDescription(expect.stringContaining('Choose a plan.'));
    expect(screen.getByRole('radiogroup', { name: 'Billing cycle' })).toHaveAccessibleDescription(expect.stringContaining('Choose a billing cycle.'));
    expect(screen.getByText('Accept the terms to continue.')).toBeVisible();
    expect(document.activeElement).toBe(email);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears errors and submits typed values once the form is valid', async () => {
    const onSubmit = vi.fn();
    render(<InviteForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send invite' }));
    await screen.findByText('Enter a work email.');
    await userEvent.type(screen.getByLabelText('Work email'), 'linh@company.vn');
    await userEvent.click(screen.getByRole('combobox', { name: 'Plan' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Business' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Yearly' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'I accept the terms' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send invite' }));
    await expect.poll(() => onSubmit.mock.calls.length).toBe(1);
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ email: 'linh@company.vn', plan: 'business', billing: 'yearly', terms: true });
    expect(screen.queryByText('Enter a work email.')).toBeNull();
  });

  it('DatePicker: a failed submit focuses it, blur validates, and invalid text never submits the old date', async () => {
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.click(input);
    await userEvent.tab(); // mode: 'onBlur' validates on leaving the field
    await expect.poll(() => input.getAttribute('aria-invalid')).toBe('true');
    await userEvent.click(screen.getByRole('button', { name: 'Book' }));
    await expect.poll(() => document.activeElement).toBe(input);
    expect(input).toHaveAccessibleDescription('Pick a start date.');
    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.type(input, '15/03/2026');
    await userEvent.tab();
    await expect.poll(() => input.getAttribute('aria-invalid')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Book' }));
    await expect.poll(() => onSubmit.mock.calls.length).toBe(1);
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ start: new Date(2026, 2, 15) });

    // Typing an impossible date clears the field value; the blur shows the form's error, and submit is blocked.
    await userEvent.clear(input);
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    await expect.poll(() => input.getAttribute('aria-invalid')).toBe('true');
    expect(input).toHaveAccessibleDescription('Pick a start date.');
    await userEvent.click(screen.getByRole('button', { name: 'Book' }));
    await expect.poll(() => document.activeElement).toBe(input);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('a rule without a message still shows words: invalidLabel', async () => {
    function Form({ invalidLabel }: { invalidLabel?: string }) {
      const { control, handleSubmit } = useForm<{ name: string }>({ defaultValues: { name: '' } });
      return (
        <form noValidate onSubmit={handleSubmit(() => {})}>
          <FormField control={control} name="name" rules={{ required: true }} invalidLabel={invalidLabel} render={({ field, error }) => <TextField label="Name" {...field} error={error} />} />
          <Button type="submit">Save</Button>
        </form>
      );
    }
    const { unmount } = render(<Form />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await expect.poll(() => screen.getByLabelText('Name').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Invalid value');
    unmount();
    render(<Form invalidLabel="Giá trị không hợp lệ" />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await expect.poll(() => screen.queryByText('Giá trị không hợp lệ')).not.toBeNull();
  });

  it('DatePicker: reset() without defaultValues drops invalid typed text', async () => {
    function Form() {
      const { control, reset } = useForm<{ start: Date | null }>();
      return (
        <form noValidate>
          <FormField control={control} name="start" render={({ field }) => <DatePicker label="Start date" value={field.value} onValueChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} />} />
          <Button onClick={() => reset()}>Reset</Button>
        </form>
      );
    }
    render(<Form />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.type(input, '15/03/2026');
    await userEvent.tab();
    await userEvent.clear(input);
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await expect.poll(() => (input as HTMLInputElement).value).toBe('');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<InviteForm onSubmit={() => {}} />);
    await expectAccessibleInThemes(<BookingForm onSubmit={() => {}} />);
  });
});
