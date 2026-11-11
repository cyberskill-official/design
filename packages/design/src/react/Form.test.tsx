import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Button } from './Button';
import { TextField } from './Field';
import { Form } from './Form';
import { expectAccessibleInThemes, expectNoA11yViolations } from '../test/a11y';

function SignUp({ onSubmit }: { onSubmit: (values: { email: string; password: string }) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <Form
      aria-label="Sign up"
      errors={errors}
      onFormSubmit={(values: { email: string; password: string }) => {
        onSubmit(values);
        if (values.email.endsWith('@taken.vn')) setErrors({ email: 'An account with this email already exists.' });
      }}
    >
      <TextField label="Work email" name="email" type="email" required />
      <TextField label="Password" name="password" type="password" required minLength={8} />
      <Button type="submit">Create account</Button>
    </Form>
  );
}

describe('Form', () => {
  it('renders a named form', () => {
    render(<SignUp onSubmit={vi.fn()} />);
    expect(screen.getByRole('form', { name: 'Sign up' })).toBeVisible();
  });

  it('blocks submit, shows native errors and focuses the first invalid field', async () => {
    const onSubmit = vi.fn();
    render(<SignUp onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    const email = screen.getByRole('textbox', { name: 'Work email' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(document.activeElement).toBe(email);
  });

  it('passes values to onFormSubmit and shows a server error under the matching field until it changes', async () => {
    const onSubmit = vi.fn();
    render(<SignUp onSubmit={onSubmit} />);
    await userEvent.fill(screen.getByRole('textbox', { name: 'Work email' }), 'linh@taken.vn');
    await userEvent.fill(screen.getByLabelText(/^Password/), 'correct-horse');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'linh@taken.vn', password: 'correct-horse' });

    const email = screen.getByRole('textbox', { name: 'Work email' });
    await expect.poll(() => email.getAttribute('aria-invalid')).toBe('true');
    expect(email).toHaveAccessibleDescription('An account with this email already exists.');
    expect(document.activeElement).toBe(email);

    await userEvent.type(email, 'x');
    await expect.poll(() => screen.queryByText('An account with this email already exists.')).toBeNull();
  });

  it('has no accessibility violations in light and dark, also with errors showing', async () => {
    const results = await expectAccessibleInThemes(<SignUp onSubmit={vi.fn()} />);
    for (const r of results) {
      await userEvent.click(r.getByRole('button', { name: 'Create account' }));
      await expect.poll(() => r.getByRole('textbox', { name: 'Work email' }).getAttribute('aria-invalid')).toBe('true');
      await expectNoA11yViolations(r.container);
    }
  });
});
