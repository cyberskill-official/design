import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Select, SelectField } from './Select';
import { expectAccessibleInThemes, expectNoA11yViolations } from '../test/a11y';

const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
];

describe('Select', () => {
  it('opens a list under the trigger, picks an option and shows its label', async () => {
    const onValueChange = vi.fn();
    render(<SelectField label="Plan" items={plans} placeholder="Choose a plan" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Plan' });
    expect(trigger).toHaveTextContent('Choose a plan');
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(listbox.getBoundingClientRect().top).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().bottom);
    await userEvent.click(screen.getByRole('option', { name: 'Team' }));
    expect(onValueChange).toHaveBeenCalledWith('team', expect.anything());
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveTextContent('Team');
  });

  it('marks the selected option and supports the keyboard', async () => {
    render(<Select aria-label="Plan" items={plans} defaultValue="business" />);
    const trigger = screen.getByRole('combobox', { name: 'Plan' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(await screen.findByRole('option', { name: 'Business' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('wires description and error to the trigger', () => {
    render(<SelectField label="Region" items={plans} description="Where your data is stored." error="Choose a region." />);
    const trigger = screen.getByRole('combobox', { name: 'Region' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription(expect.stringContaining('Where your data is stored.'));
    expect(trigger).toHaveAccessibleDescription(expect.stringContaining('Choose a region.'));
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
        <SelectField label="Plan" items={plans} placeholder="Choose a plan" description="You can change it later." />
        <SelectField label="Region" items={plans} error="Choose a region." />
        <SelectField label="Seats" items={plans} defaultValue="team" disabled />
        <Select aria-label="Sort by" items={plans} size="sm" defaultValue="starter" />
      </div>,
    );
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<SelectField label="Plan" items={plans} defaultValue="team" />);
      await userEvent.click(screen.getByRole('combobox', { name: 'Plan' }));
      const listbox = await screen.findByRole('listbox');
      // Scoped to the field and its portalled popup; landmark (page-level) rules belong to the app's page, not the component.
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(listbox);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
