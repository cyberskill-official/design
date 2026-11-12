import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { SearchField } from './SearchField';
import { expectAccessibleInThemes } from '../test/a11y';

describe('SearchField', () => {
  it('is a labelled searchbox with a leading search icon', () => {
    render(<SearchField label="Search agents" placeholder="Name or ID" />);
    const input = screen.getByRole('searchbox', { name: 'Search agents' });
    expect(input).toHaveAttribute('type', 'search');
    expect(input.closest('.cs-input-group')!.querySelector('[data-side="start"] svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('reports typing, then shows a clear button that empties the field and keeps focus', async () => {
    const onValueChange = vi.fn();
    render(<SearchField label="Search" onValueChange={onValueChange} />);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    await userEvent.type(input, 'hà nội');
    expect(onValueChange).toHaveBeenLastCalledWith('hà nội');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('Escape clears the text; with nothing to clear it bubbles on', async () => {
    const onOuterKeyDown = vi.fn();
    render(<div onKeyDown={e => onOuterKeyDown(e.key)}><SearchField label="Search" defaultValue="report" /></div>);
    const input = screen.getByRole('searchbox');
    input.focus();
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(onOuterKeyDown).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onOuterKeyDown).toHaveBeenCalledWith('Escape');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [q, setQ] = useState('abc');
      return (
        <>
          <SearchField label="Search" value={q} onValueChange={setQ} />
          <output>{`q=${q}`}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole('searchbox'), 'd');
    expect(screen.getByText('q=abcd')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByText('q=')).toBeVisible();
  });

  it('a controlled value reset to undefined (React Hook Form reset()) empties the field', async () => {
    function Form() {
      const [q, setQ] = useState<string | undefined>('abc');
      return (
        <>
          <SearchField label="Search" value={q} onValueChange={setQ} />
          <button type="button" onClick={() => setQ(undefined)}>Reset</button>
        </>
      );
    }
    render(<Form />);
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'd');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('');
  });

  it('announces loading and shows the shortcut hint while empty; labels are overridable', async () => {
    render(<SearchField label="Tìm kiếm" shortcut="⌘K" loading loadingLabel="Đang tải" clearLabel="Xoá tìm kiếm" />);
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải');
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
    await userEvent.type(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), 'x');
    expect(screen.queryByText('⌘K')).toBeNull();
    expect(screen.getByRole('button', { name: 'Xoá tìm kiếm' })).toBeVisible();
  });

  it('keeps the clear button (24px or more) and its inset focus ring inside the box at every size', () => {
    render(
      <>
        <SearchField label="Small" size="sm" defaultValue="a" />
        <SearchField label="Large" size="lg" defaultValue="a" />
      </>,
    );
    for (const button of screen.getAllByRole('button')) {
      const box = button.closest('.cs-input-group')!.getBoundingClientRect();
      const r = button.getBoundingClientRect();
      expect(Math.min(r.width, r.height)).toBeGreaterThanOrEqual(24); // WCAG 2.5.8
      expect(getComputedStyle(button).outlineOffset).toBe('-2px'); // the ring is drawn inside the button
      expect(r.top - box.top).toBeGreaterThanOrEqual(1); // inside the 1px border
      expect(box.right - r.right).toBeGreaterThanOrEqual(1);
    }
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
        <SearchField label="Search agents" placeholder="Name or ID" shortcut="⌘K" />
        <SearchField label="Search docs" defaultValue="tokens" loading description="Searches titles and body text." />
        <SearchField label="Filter" hideLabel size="sm" defaultValue="vn" />
        <SearchField label="Search" disabled defaultValue="locked" />
        <SearchField label="Search" error="Type at least 2 characters." defaultValue="a" />
      </div>,
    );
  });
});
