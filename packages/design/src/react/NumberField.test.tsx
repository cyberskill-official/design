import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';
import { expectAccessibleInThemes } from '../test/a11y';

describe('NumberField', () => {
  it('is labelled and steps with the − and + buttons within min and max', async () => {
    const onValueChange = vi.fn();
    render(<NumberField label="Seats" defaultValue={2} min={1} max={3} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input).toHaveValue('3');
    expect(onValueChange).toHaveBeenLastCalledWith(3, expect.anything());
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(input).toHaveValue('2');
  });

  it('steps with the arrow keys', async () => {
    render(<NumberField label="Replicas" defaultValue={5} step={5} />);
    const input = screen.getByRole('textbox', { name: 'Replicas' });
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(input).toHaveValue('10');
  });

  it('formats currency', () => {
    render(<NumberField label="Budget" locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} defaultValue={1500000} incrementLabel="Tăng" decrementLabel="Giảm" />);
    expect(screen.getByRole('textbox', { name: 'Budget' })).toHaveValue(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1500000));
    expect(screen.getByRole('button', { name: 'Tăng' })).toBeVisible();
  });

  it('wires description and error to the input', () => {
    render(<NumberField label="Seats" description="Billed per seat." error="At least 1 seat." />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Billed per seat.'));
    expect(input).toHaveAccessibleDescription(expect.stringContaining('At least 1 seat.'));
  });

  it('is as tall as a text field', () => {
    render(<NumberField label="Seats" />);
    expect(document.querySelector('.cs-number-field-group')!.getBoundingClientRect().height).toBe(40);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 240 }}>
        <NumberField label="Seats" defaultValue={3} min={1} description="Billed per seat." />
        <NumberField label="Budget" locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} defaultValue={2000000} size="lg" />
        <NumberField label="Quantity" error="At least 1." size="sm" />
        <NumberField label="Locked" defaultValue={10} disabled />
      </div>,
    );
  });
});
