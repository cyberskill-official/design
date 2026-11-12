import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './RadioGroup';
import { expectAccessibleInThemes } from '../test/a11y';

function Billing(props: { onValueChange?: (value: string) => void; error?: string }) {
  return (
    <RadioGroup label="Billing cycle" description="You can switch at renewal." defaultValue="monthly" onValueChange={v => props.onValueChange?.(v)} error={props.error}>
      <Radio value="monthly" label="Monthly" />
      <Radio value="yearly" label="Yearly" description="Two months free." />
      <Radio value="custom" label="Custom contract" disabled />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('is a labelled radio group with labelled, described options', () => {
    render(<Billing />);
    const group = screen.getByRole('radiogroup', { name: 'Billing cycle' });
    expect(group).toHaveAccessibleDescription(expect.stringContaining('You can switch at renewal.'));
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Yearly' })).toHaveAccessibleDescription(expect.stringContaining('Two months free.'));
  });

  it('selects by click and moves with arrow keys', async () => {
    const onValueChange = vi.fn();
    render(<Billing onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText('Yearly'));
    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('yearly');
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Monthly' }));
  });

  it('shows a group error', () => {
    render(<Billing error="Choose a billing cycle." />);
    expect(screen.getByText('Choose a billing cycle.')).toBeVisible();
    expect(screen.getByRole('radiogroup', { name: 'Billing cycle' })).toHaveAccessibleDescription(expect.stringContaining('Choose a billing cycle.'));
  });

  it('keeps a 44px touch target around each dot', () => {
    render(<Billing />);
    const hit = getComputedStyle(screen.getByRole('radio', { name: 'Monthly' }), '::before');
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Billing error="Choose a billing cycle." />);
  });
});
