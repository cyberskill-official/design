import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { TextField, Textarea } from './Field';
import { expectAccessibleInThemes } from '../test/a11y';

describe('TextField', () => {
  it('labels the input and accepts typing', async () => {
    render(<TextField label="Work email" type="email" />);
    const input = screen.getByLabelText('Work email');
    await userEvent.type(input, 'linh@company.vn');
    expect(input).toHaveValue('linh@company.vn');
  });

  it('connects help text and marks errors', () => {
    render(<TextField label="API key name" description="Shown in the audit log." error="Use letters, numbers and dashes only." />);
    const input = screen.getByLabelText('API key name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Use letters, numbers and dashes only.'));
    expect(screen.getByText('Use letters, numbers and dashes only.')).toBeVisible();
  });

  it('textarea gets the same wiring', () => {
    render(<Textarea label="Instructions" description="Plain text only." />);
    expect(screen.getByLabelText('Instructions').tagName).toBe('TEXTAREA');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12 }}>
        <TextField label="Work email" description="For sign-in." />
        <TextField label="API key name" error="Use letters, numbers and dashes only." defaultValue="prod key!" />
        <TextField label="Workspace" startAdornment="https://" endAdornment=".cyberskill.world" />
        <TextField label="Disabled" disabled defaultValue="Locked" />
      </div>,
    );
  });
});
