import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Spinner', () => {
  it('is a status announced as "Loading" by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('takes a translated label and a size', () => {
    render(<Spinner label="Đang tải" size="lg" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Đang tải');
    expect((status.firstElementChild as HTMLElement).getBoundingClientRect().width).toBe(32);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'flex', gap: 16 }}>
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" label="Loading report" />
      </div>,
    );
  });
});
