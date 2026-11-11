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

  it('puts a warning icon before the error text, hidden from screen readers and aligned to the first line', () => {
    render(<TextField label="API key name" error="Use letters, numbers and dashes only." />);
    expect(screen.getByLabelText('API key name')).toHaveAccessibleDescription('Use letters, numbers and dashes only.');
    const error = screen.getByText('Use letters, numbers and dashes only.').closest<HTMLElement>('.cs-field-error')!;
    const icon = error.firstElementChild as SVGElement;
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    const [box, glyph] = [error.getBoundingClientRect(), icon.getBoundingClientRect()];
    expect(glyph.width).toBe(16);
    expect(glyph.top - box.top).toBeCloseTo(1, 1); // centred on the first 18px line
  });

  it('textarea gets the same wiring', () => {
    render(<Textarea label="Instructions" description="Plain text only." />);
    expect(screen.getByLabelText('Instructions').tagName).toBe('TEXTAREA');
  });

  it('keeps the label and input together when a grid row stretches the field', () => {
    render(
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: 600 }}>
        <TextField label="Name" />
        <Textarea label="Bio" description="Shown on your profile." error="Keep it under 200 characters." />
      </div>,
    );
    const label = screen.getByText('Name').getBoundingClientRect();
    const input = screen.getByLabelText('Name').getBoundingClientRect();
    expect(label.height).toBe(20);
    expect(input.top - label.bottom).toBe(6);
    expect(input.height).toBe(40);
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
