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

const regions = [
  { label: 'Asia Pacific', items: [{ value: 'sg', label: 'Singapore' }, { value: 'hcm', label: 'Ho Chi Minh City' }] },
  { label: 'Europe', items: [{ value: 'fra', label: 'Frankfurt' }, { value: 'ams', label: 'Amsterdam', disabled: true }] },
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

  it('renders groups as labelled sections and shows the picked label', async () => {
    const onValueChange = vi.fn();
    render(<SelectField label="Region" items={[...regions, { value: 'us', label: 'Virginia' }]} placeholder="Choose a region" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Region' });
    await userEvent.click(trigger);
    const europe = await screen.findByRole('group', { name: 'Europe' });
    expect(screen.getByRole('group', { name: 'Asia Pacific' })).toContainElement(screen.getByRole('option', { name: 'Singapore' }));
    expect(europe).toContainElement(screen.getByRole('option', { name: 'Frankfurt' }));
    expect(screen.getByRole('option', { name: 'Amsterdam' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: 'Virginia' })).toBeVisible();
    await userEvent.click(screen.getByRole('option', { name: 'Frankfurt' }));
    expect(onValueChange).toHaveBeenCalledWith('fra', expect.anything());
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveTextContent('Frankfurt');
  });

  it('shows the label of a grouped default value', () => {
    render(<Select aria-label="Region" items={regions} defaultValue="hcm" />);
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveTextContent('Ho Chi Minh City');
  });

  it('puts a hidden warning icon before the error text, so the description is the text only', () => {
    render(<SelectField label="Region" items={plans} error="Choose a region." />);
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveAccessibleDescription('Choose a region.');
    const error = screen.getByText('Choose a region.').closest<HTMLElement>('.cs-field-error')!;
    const icon = error.firstElementChild as SVGElement;
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.getBoundingClientRect().width).toBe(16);
    expect(error.querySelector(':scope > span')).toHaveTextContent('Choose a region.');
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
    for (const [theme, items] of [['light', plans], ['dark', plans], ['light', regions], ['dark', regions]] as const) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<SelectField label="Plan" items={[...items]} defaultValue="team" />);
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
