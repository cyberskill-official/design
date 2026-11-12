import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { PasswordField } from './PasswordField';
import { expectAccessibleInThemes } from '../test/a11y';

describe('PasswordField', () => {
  it('is a labelled password input that autofills the current password', () => {
    render(<PasswordField label="Password" name="password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(screen.getByRole('button', { name: 'Show password' })).toBeVisible();
  });

  it('the toggle shows and hides the password, renaming itself', async () => {
    render(<PasswordField label="Password" defaultValue="hunter2" />);
    const input = screen.getByLabelText('Password');
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    const toggle = screen.getByRole('button', { name: 'Hide password' });
    expect(toggle).not.toHaveAttribute('aria-pressed');
    await userEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Show password' })).toBeVisible();
  });

  it('a click on the toggle keeps focus and the caret in the input', async () => {
    render(<PasswordField label="Password" />);
    const input = screen.getByLabelText<HTMLInputElement>('Password');
    await userEvent.type(input, 'secret');
    input.setSelectionRange(2, 2);
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(document.activeElement).toBe(input);
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 2]);
    await userEvent.keyboard('X');
    expect(input).toHaveValue('seXcret');
  });

  it('works from the keyboard: Tab to the toggle, Space flips it and focus stays on it', async () => {
    render(<PasswordField label="Password" defaultValue="hunter2" />);
    screen.getByLabelText('Password').focus();
    await userEvent.tab();
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(document.activeElement).toBe(toggle);
    await userEvent.keyboard(' ');
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(document.activeElement).toBe(toggle);
  });

  it('never submits the form', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(<form onSubmit={e => onSubmit(e.nativeEvent as SubmitEvent)}><PasswordField label="Password" /></form>);
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('type', 'button');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('takes Vietnamese labels, defaultVisible and new-password autofill', () => {
    render(<PasswordField label="Mật khẩu mới" autoComplete="new-password" defaultVisible showPasswordLabel="Hiện mật khẩu" hidePasswordLabel="Ẩn mật khẩu" />);
    expect(screen.getByLabelText('Mật khẩu mới')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Mật khẩu mới')).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByRole('button', { name: 'Ẩn mật khẩu' })).toBeVisible();
  });

  it('links help and error text, and disables the toggle with the field', () => {
    render(
      <>
        <PasswordField label="Password" description="At least 12 characters." error="Too short." />
        <PasswordField label="Locked" disabled />
      </>,
    );
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Too short.'));
    expect(screen.getByLabelText('Locked')).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Show password' })[1]).toBeDisabled();
  });

  it('the toggle is at least 24px and fits inside the box at every size', () => {
    render(
      <>
        {(['sm', 'md', 'lg'] as const).map(size => <PasswordField key={size} label={size} size={size} />)}
      </>,
    );
    for (const size of ['sm', 'md', 'lg']) {
      const box = screen.getByLabelText(size).closest('.cs-input-group')!.getBoundingClientRect();
      const toggle = screen.getAllByRole('button', { name: 'Show password' })[['sm', 'md', 'lg'].indexOf(size)]!.getBoundingClientRect();
      expect(toggle.height).toBeGreaterThanOrEqual(24);
      expect(toggle.top).toBeGreaterThanOrEqual(box.top + 1);
      expect(toggle.bottom).toBeLessThanOrEqual(box.bottom - 1);
    }
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <PasswordField label="Password" description="At least 12 characters." />
        <PasswordField label="New password" defaultValue="short" defaultVisible error="Use at least 12 characters." />
        <PasswordField label="Locked" disabled defaultValue="secret" size="sm" />
        <PasswordField label="Large" size="lg" />
      </div>,
    );
  });
});
