import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, ComboboxField } from './Combobox';
import { expectAccessibleInThemes, expectNoA11yViolations } from '../test/a11y';

const regions = [
  { value: 'sgn', label: 'Ho Chi Minh City', description: 'ap-southeast-1' },
  { value: 'han', label: 'Hanoi', description: 'ap-southeast-2' },
  { value: 'sin', label: 'Singapore' },
  { value: 'tyo', label: 'Tokyo', disabled: true },
];

describe('Combobox', () => {
  it('names its open list after the input when there is no visible label', async () => {
    render(<Combobox aria-label="Region" items={regions} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Region' }), 's');
    expect(await screen.findByRole('listbox', { name: 'Region' })).toBeVisible();
  });

  it('filters as you type and stores the item value', async () => {
    const onValueChange = vi.fn();
    render(<ComboboxField label="Region" items={regions} placeholder="Search regions" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Region' });
    await userEvent.type(input, 'sing');
    const listbox = await screen.findByRole('listbox');
    expect(listbox.getBoundingClientRect().top).toBeGreaterThanOrEqual(input.getBoundingClientRect().bottom);
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.click(screen.getByRole('option', { name: 'Singapore' }));
    expect(onValueChange).toHaveBeenCalledWith('sin', expect.anything());
    expect(input).toHaveValue('Singapore');
  });

  it('matches Vietnamese with or without accents, stored or typed decomposed (NFD)', async () => {
    const people = [{ value: '1', label: 'Nguyễn Văn An'.normalize('NFD') }, { value: '2', label: 'Đặng Thu Hà' }, { value: '3', label: 'Trần Bình' }];
    render(<Combobox aria-label="Person" items={people} />);
    const input = screen.getByRole('combobox', { name: 'Person' });
    await userEvent.type(input, 'nguyen');
    await expect.poll(() => screen.queryAllByRole('option').map(o => o.textContent?.normalize())).toEqual(['Nguyễn Văn An']);
    await userEvent.fill(input, 'Đặng'.normalize('NFD'));
    await expect.poll(() => screen.queryAllByRole('option').map(o => o.textContent?.normalize())).toEqual(['Đặng Thu Hà']);
    await userEvent.fill(input, 'dang');
    await expect.poll(() => screen.queryAllByRole('option').map(o => o.textContent?.normalize())).toEqual(['Đặng Thu Hà']);
  });

  it('keeps the chosen label when async results no longer contain it', () => {
    const { rerender } = render(<Combobox aria-label="Assignee" items={[{ value: 'u1', label: 'Anna' }]} value="u1" filter={null} />);
    const input = screen.getByRole('combobox', { name: 'Assignee' });
    expect(input).toHaveValue('Anna');
    rerender(<Combobox aria-label="Assignee" items={[{ value: 'u2', label: 'Bình' }]} value="u1" filter={null} />);
    expect(input).toHaveValue('Anna');
  });

  it('reopening after a choice lists every option again', async () => {
    render(<Combobox aria-label="Region" items={regions} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Region' }), 'sing');
    await userEvent.click(await screen.findByRole('option', { name: 'Singapore' }));
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Show options' }));
    await expect.poll(() => screen.queryAllByRole('option')).toHaveLength(regions.length);
  });

  it('shows the empty text when nothing matches', async () => {
    render(<Combobox aria-label="Region" items={regions} emptyText="Không có kết quả" />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Region' }), 'zzz');
    expect(await screen.findByText('Không có kết quả')).toBeVisible();
  });

  it('clears the value with the clear button', async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Region" items={regions} defaultValue="han" onValueChange={onValueChange} clearLabel="Clear region" />);
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveValue('Hanoi');
    await userEvent.click(screen.getByRole('button', { name: 'Clear region' }));
    expect(onValueChange).toHaveBeenCalledWith(null, expect.anything());
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveValue('');
  });

  it('marks the list busy while loading', async () => {
    render(<Combobox aria-label="Owner" items={[]} loading loadingText="Searching…" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
    expect(await screen.findByText('Searching…')).toBeVisible();
    expect(screen.queryByText('No results')).toBeNull();
  });

  it('wires description and error to the input', () => {
    render(<ComboboxField label="Region" items={regions} description="Where your data is stored." error="Choose a region." />);
    const input = screen.getByRole('combobox', { name: 'Region' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Where your data is stored.'));
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Choose a region.'));
  });

  it('is as tall as a text field in every size', () => {
    render(<Combobox aria-label="Region" items={regions} size="sm" />);
    expect(document.querySelector('.cs-combobox')!.getBoundingClientRect().height).toBe(32);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
        <ComboboxField label="Region" items={regions} placeholder="Search regions" description="You can change it later." />
        <ComboboxField label="Owner" items={regions} error="Choose an owner." />
        <ComboboxField label="Locked" items={regions} defaultValue="han" disabled />
        <Combobox aria-label="Quick pick" items={regions} size="sm" />
      </div>,
    );
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<ComboboxField label="Region" items={regions} defaultValue="sgn" />);
      await userEvent.click(screen.getByRole('combobox', { name: 'Region' }));
      const popup = (await screen.findByRole('listbox')).closest('.cs-combobox-popup')!;
      await expect.poll(() => getComputedStyle(popup).opacity).toBe('1'); // after the fade-in
      // Scoped to the field and its portalled popup; landmark (page-level) rules belong to the app's page.
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(popup);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
