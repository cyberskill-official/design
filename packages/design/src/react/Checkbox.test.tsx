import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Checkbox', () => {
  it('is named by its label, described by its help text and toggles from the label', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Email me a weekly summary" description="Sent on Mondays at 9:00." onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox', { name: 'Email me a weekly summary' });
    expect(box).toHaveAccessibleDescription('Sent on Mondays at 9:00.');
    expect(box).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(screen.getByText('Email me a weekly summary'));
    expect(box).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('fills gold with an --accent-text edge when checked or mixed, and the tick leaves after unchecking', async () => {
    render(
      <div style={{ display: 'grid', gap: 24 }}>
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Mixed" indeterminate />
        <span data-testid="probe" style={{ background: 'var(--accent)', borderColor: 'var(--accent-text)' }} />
      </div>,
    );
    const probe = getComputedStyle(screen.getByTestId('probe'));
    for (const name of ['Checked', 'Mixed']) {
      const box = getComputedStyle(screen.getByRole('checkbox', { name }));
      expect([box.backgroundColor, box.borderTopColor]).toEqual([probe.backgroundColor, probe.borderTopColor]);
    }
    const checked = screen.getByRole('checkbox', { name: 'Checked' });
    await userEvent.click(checked);
    await expect.poll(() => checked.querySelector('.cs-checkbox-indicator')).toBeNull();
    await userEvent.click(checked);
    await expect.poll(() => checked.querySelector('.cs-checkbox-indicator svg')).not.toBeNull();
  });

  it('announces the mixed state', () => {
    render(<Checkbox label="Select all" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('shows an error and marks the box invalid', () => {
    render(<Checkbox label="I accept the terms" error="Accept the terms to continue." />);
    const box = screen.getByRole('checkbox', { name: 'I accept the terms' });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription(expect.stringContaining('Accept the terms to continue.'));
  });

  it('keeps a 44px touch target around the box', () => {
    render(<Checkbox label="Remember me" />);
    const hit = getComputedStyle(screen.getByRole('checkbox'), '::before');
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
    expect(parseFloat(hit.width)).toBeGreaterThanOrEqual(44);
  });

  it('groups options under a labelled group and reports the checked values', async () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup label="Notify me about" description="Pick any." defaultValue={['mentions']} onValueChange={onValueChange}>
        <Checkbox value="mentions" label="Mentions" />
        <Checkbox value="replies" label="Replies" description="Only in threads you follow." />
        <Checkbox value="digest" label="Weekly digest" disabled />
      </CheckboxGroup>,
    );
    expect(screen.getByRole('group', { name: 'Notify me about' })).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Mentions' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: 'Replies' })).toHaveAccessibleDescription(expect.stringContaining('Only in threads you follow.'));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Replies' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['mentions', 'replies'], expect.anything());
    expect(screen.getByRole('checkbox', { name: 'Weekly digest' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Checkbox label="Unchecked" description="Help text." />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Mixed" indeterminate />
        <Checkbox label="Disabled" disabled defaultChecked />
        <Checkbox label="I accept the terms" error="Accept the terms to continue." />
        <CheckboxGroup label="Channels" description="Where we send alerts." error="Pick at least one channel." defaultValue={['email']}>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" description="Carrier rates apply." />
        </CheckboxGroup>
      </div>,
    );
  });
});
