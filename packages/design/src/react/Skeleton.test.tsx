import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton, SkeletonText } from './Skeleton';
import { expectAccessibleInThemes } from '../test/a11y';

function Loading() {
  return (
    <div aria-busy="true" style={{ display: 'grid', gap: 12, width: 320 }}>
      <span role="status" className="cs-visually-hidden">Loading projects</span>
      <Skeleton width={40} height={40} radius="full" />
      <SkeletonText lines={3} />
    </div>
  );
}

describe('Skeleton', () => {
  it('is hidden from assistive tech; the container status names the wait', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading projects');
    for (const el of document.querySelectorAll('.cs-skeleton, .cs-skeleton-text')) {
      expect(el.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('applies size and radius', () => {
    const { container } = render(<Skeleton width={120} height="2rem" radius="full" />);
    const block = container.firstElementChild as HTMLElement;
    expect(block.style.width).toBe('120px');
    expect(block.style.height).toBe('2rem');
    expect(block).toHaveAttribute('data-radius', 'full');
  });

  it('SkeletonText renders n lines with a shorter last line', () => {
    const { container } = render(<SkeletonText lines={4} style={{ width: 400 }} />);
    const lines = container.querySelectorAll('.cs-skeleton');
    expect(lines).toHaveLength(4);
    expect(lines[3]!.getBoundingClientRect().width).toBeLessThan(lines[0]!.getBoundingClientRect().width);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Loading />);
  });
});
