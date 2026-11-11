import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete } from './Autocomplete';
import { Field } from './Field';
import { expectAccessibleInThemes, expectNoA11yViolations } from '../test/a11y';

const cities = ['Hà Nội', 'Hải Phòng', 'Huế', 'Đà Nẵng', 'Hồ Chí Minh'];
const grouped = [
  { label: 'Pages', items: [{ value: 'billing', label: 'Billing', description: 'Settings' }, { value: 'team', label: 'Team members' }] },
  { label: 'People', items: ['Linh Nguyen', 'Minh Tran'] },
];

describe('Autocomplete', () => {
  it('suggests as you type and fills the input with the chosen text', async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete aria-label="City" items={cities} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'City' });
    await userEvent.type(input, 'hai');
    expect(await screen.findAllByRole('option')).toHaveLength(1);
    await userEvent.click(screen.getByRole('option', { name: 'Hải Phòng' }));
    expect(input).toHaveValue('Hải Phòng');
    expect(onValueChange).toHaveBeenLastCalledWith('Hải Phòng', expect.anything());
  });

  it('keeps free text that matches nothing', async () => {
    render(<Autocomplete aria-label="City" items={cities} emptyText="Không tìm thấy" />);
    const input = screen.getByRole('combobox', { name: 'City' });
    await userEvent.type(input, 'Cần Thơ');
    expect(await screen.findByText('Không tìm thấy')).toBeVisible();
    expect(input).toHaveValue('Cần Thơ');
  });

  it('highlights the matched text, ignoring accents', async () => {
    render(<Autocomplete aria-label="City" items={cities} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'City' }), 'phong');
    const option = await screen.findByRole('option', { name: 'Hải Phòng' });
    expect(option.querySelector('mark')).toHaveTextContent('Phòng');
  });

  it('renders groups with their labels', async () => {
    render(<Autocomplete aria-label="Search" items={grouped} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Search' }), 'n');
    expect(await screen.findByRole('group', { name: 'People' })).toBeVisible();
    expect(screen.getByRole('option', { name: /Linh Nguyen/ })).toBeVisible();
  });

  it('can be labelled by Field', () => {
    render(
      <Field label="Search docs">
        <Autocomplete items={cities} />
      </Field>,
    );
    expect(screen.getByRole('combobox', { name: 'Search docs' })).toBeVisible();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Autocomplete aria-label="Search" items={cities} placeholder="Search cities" />
        <Autocomplete aria-label="Search small" items={cities} size="sm" icon={null} defaultValue="Huế" />
        <Autocomplete aria-label="Search disabled" items={cities} disabled />
      </div>,
    );
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Autocomplete aria-label="Search" items={grouped} />);
      await userEvent.type(screen.getByRole('combobox', { name: 'Search' }), 'i');
      const popup = (await screen.findByRole('listbox')).closest('.cs-combobox-popup')!;
      await expect.poll(() => getComputedStyle(popup).opacity).toBe('1');
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(popup);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
