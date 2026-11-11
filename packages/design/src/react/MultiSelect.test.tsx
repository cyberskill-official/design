import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { MultiSelect, MultiSelectField } from './MultiSelect';
import { expectAccessibleInThemes, expectNoA11yViolations } from '../test/a11y';

const skills = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust', description: 'Systems' },
];

describe('MultiSelect', () => {
  it('adds chosen values as chips', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelectField label="Skills" items={skills} placeholder="Add skills" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Skills' });
    await userEvent.type(input, 'type');
    await userEvent.click(await screen.findByRole('option', { name: 'TypeScript' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['ts'], expect.anything());
    await userEvent.click(input);
    await userEvent.click(await screen.findByRole('option', { name: 'Go' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['ts', 'go'], expect.anything());
    expect(screen.getByRole('option', { name: 'Go' })).toHaveAttribute('aria-selected', 'true');
    // While the list is open Base UI hides the rest of the page from screen readers, so check chips after closing.
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove Go' })).toBeVisible();
  });

  it('matches decomposed (NFD) Vietnamese labels typed without accents', async () => {
    render(<MultiSelect aria-label="People" items={[{ value: '1', label: 'Nguyễn Văn An'.normalize('NFD') }, { value: '2', label: 'Trần Bình' }]} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'People' }), 'nguyen');
    await expect.poll(() => screen.queryAllByRole('option').map(o => o.textContent?.normalize())).toEqual(['Nguyễn Văn An']);
  });

  it('removes a chip with its remove button', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect aria-label="Skills" items={skills} defaultValue={['react', 'go']} onValueChange={onValueChange} removeLabel={l => `Bỏ ${l}`} />);
    const remove = screen.getByRole('button', { name: 'Bỏ React' });
    expect(remove.getBoundingClientRect().width).toBeGreaterThanOrEqual(24);
    await userEvent.click(remove);
    expect(onValueChange).toHaveBeenCalledWith(['go'], expect.anything());
    expect(screen.queryByRole('button', { name: 'Bỏ React' })).toBeNull();
  });

  it('Backspace in the empty input removes the last chip', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect aria-label="Skills" items={skills} defaultValue={['react', 'go']} onValueChange={onValueChange} />);
    screen.getByRole('combobox', { name: 'Skills' }).focus();
    await userEvent.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenCalledWith(['react'], expect.anything());
  });

  it('disables other options once max is reached', async () => {
    render(<MultiSelect aria-label="Skills" items={skills} defaultValue={['react', 'ts']} max={2} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Skills' }));
    expect(await screen.findByRole('option', { name: 'Go' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: 'React' })).not.toHaveAttribute('aria-disabled');
  });

  it('collapses extra chips into a +N count', () => {
    render(<MultiSelect aria-label="Skills" items={skills} defaultValue={['react', 'ts', 'node', 'go']} maxChips={2} />);
    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(2);
    expect(screen.getByText('+2')).toBeVisible();
  });

  it('starts at text-field height and grows as chips wrap', () => {
    render(
      <div style={{ width: 200 }}>
        <MultiSelect aria-label="One" items={skills} defaultValue={['go']} />
        <MultiSelect aria-label="Many" items={skills} defaultValue={['react', 'ts', 'node', 'go']} />
      </div>,
    );
    const [one, many] = document.querySelectorAll('.cs-multi-select');
    expect(one!.getBoundingClientRect().height).toBe(40);
    expect(many!.getBoundingClientRect().height).toBeGreaterThan(40);
  });

  it('keeps its width as chips are added; they wrap inside it', () => {
    render(
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, width: 900 }}>
        <MultiSelect aria-label="None" items={skills} />
        <MultiSelect aria-label="One" items={skills} defaultValue={['go']} />
        <MultiSelect aria-label="All" items={skills} defaultValue={['react', 'ts', 'node', 'go']} />
      </div>,
    );
    const [none, one, all] = Array.from(document.querySelectorAll('.cs-multi-select'), el => el.getBoundingClientRect());
    expect(one!.width).toBe(none!.width);
    expect(all!.width).toBe(none!.width);
    expect(all!.height).toBeGreaterThan(none!.height);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <MultiSelectField label="Skills" items={skills} placeholder="Add skills" description="Pick up to three." />
        <MultiSelectField label="Reviewers" items={skills} defaultValue={['react', 'go']} error="Choose at least three." />
        <MultiSelectField label="Locked" items={skills} defaultValue={['ts']} disabled />
        <MultiSelect aria-label="Tags" items={skills} defaultValue={['node']} size="sm" />
      </div>,
    );
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<MultiSelectField label="Skills" items={skills} defaultValue={['react']} />);
      await userEvent.click(screen.getByRole('combobox', { name: 'Skills' }));
      const popup = (await screen.findByRole('listbox')).closest('.cs-combobox-popup')!;
      await expect.poll(() => getComputedStyle(popup).opacity).toBe('1');
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(popup);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
