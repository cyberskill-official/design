import { render, screen } from '@testing-library/react';
import { page as browserPage, userEvent } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Pagination, pageItems } from './Pagination';
import { expectAccessibleInThemes } from '../test/a11y';

function Controlled({ start = 1, count = 20 }: { start?: number; count?: number }) {
  const [page, setPage] = useState(start);
  return <Pagination page={page} pageCount={count} onPageChange={setPage} />;
}

describe('pageItems', () => {
  it('keeps first, last and the current page with siblings, at a constant length', () => {
    expect(pageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageItems(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(pageItems(4, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(pageItems(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
    expect(pageItems(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
    expect(pageItems(10, 20, 2)).toEqual([1, 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 20]);
    expect(pageItems(1, 0)).toEqual([]);
  });
});

describe('Pagination', () => {
  // Desktop layout unless a test says otherwise (the runner's default 414px is a phone).
  beforeEach(async () => {
    await browserPage.viewport(1024, 768);
  });

  it('renders a labelled nav and marks the current page', () => {
    render(<Controlled start={10} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Page 10' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 9' })).not.toHaveAttribute('aria-current');
  });

  it('previous, next and page buttons change the page; the ends disable their arrow', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={20} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole('button', { name: 'Page 20' }));
    expect(onPageChange).toHaveBeenLastCalledWith(20);
  });

  it('moves through pages from the keyboard', async () => {
    render(<Controlled start={19} />);
    screen.getByRole('button', { name: 'Next page' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Page 20' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('takes Vietnamese labels', () => {
    render(<Pagination page={2} pageCount={3} onPageChange={() => {}} label="Phân trang" previousLabel="Trang trước" nextLabel="Trang sau" pageLabel={n => `Trang ${n}`} />);
    expect(screen.getByRole('navigation', { name: 'Phân trang' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Trang trước' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Trang 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps 32px buttons with a 44px tall touch area', () => {
    render(<Controlled />);
    const button = screen.getByRole('button', { name: 'Page 2' });
    expect(button.getBoundingClientRect().height).toBe(32);
    expect(parseFloat(getComputedStyle(button, '::before').height)).toBeGreaterThanOrEqual(44);
  });

  it('gives every button a 44px wide touch area that never overlaps its neighbour', () => {
    render(<Controlled start={10} />);
    const hits = screen.getAllByRole('button').map(b => {
      const r = b.getBoundingClientRect();
      const w = parseFloat(getComputedStyle(b, '::before').width);
      return { w, left: r.left + r.width / 2 - w / 2, right: r.left + r.width / 2 + w / 2 };
    });
    for (const hit of hits) expect(hit.w).toBeGreaterThanOrEqual(44);
    for (let i = 1; i < hits.length; i++) expect(hits[i]!.left).toBeGreaterThanOrEqual(hits[i - 1]!.right - 0.5);
  });

  it('fits a 375px phone on one row by dropping the siblings', async () => {
    await browserPage.viewport(375, 812);
    render(<div style={{ width: 343 }}><Controlled start={10} /></div>);
    const nav = screen.getByRole('navigation');
    expect(nav.scrollWidth).toBeLessThanOrEqual(343);
    expect(screen.getAllByRole('button').map(b => b.getAttribute('aria-label'))).toEqual(['Previous page', 'Page 1', 'Page 10', 'Page 20', 'Next page']);
    expect(new Set(screen.getAllByRole('button').map(b => b.getBoundingClientRect().top)).size).toBe(1);
    expect(parseFloat(getComputedStyle(screen.getByRole('button', { name: 'Page 10' }), '::before').width)).toBeGreaterThanOrEqual(44);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getAllByRole('button').map(b => b.getAttribute('aria-label'))).toEqual(['Previous page', 'Page 1', 'Page 11', 'Page 20', 'Next page']);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Pagination page={10} pageCount={20} onPageChange={() => {}} />);
  });
});
