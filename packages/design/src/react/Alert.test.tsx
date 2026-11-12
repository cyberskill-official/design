import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';
import { Button } from './Button';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Alert', () => {
  it('uses a polite status role for info and success', () => {
    render(<Alert tone="success" title="Domain verified" description="It is live." />);
    const alert = screen.getByRole('status');
    expect(alert.textContent).toContain('Domain verified');
    expect(alert.textContent).toContain('It is live.');
    expect(alert.querySelector('svg')).not.toBeNull();
  });

  it('uses the alert role for warning and danger, and lets apps override it', () => {
    render(
      <>
        <Alert tone="danger" title="Payment failed" />
        <Alert tone="warning" title="Static note" role="note" />
      </>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    expect(screen.getByRole('note')).toHaveTextContent('Static note');
  });

  it('dismiss button is named and calls onDismiss', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Saved" onDismiss={onDismiss} dismissLabel="Đóng" />);
    await userEvent.click(screen.getByRole('button', { name: 'Đóng' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12 }}>
        <Alert tone="info" title="New export format" description="CSV exports include the workspace ID." />
        <Alert tone="success" title="Domain verified" description="support.acme.vn is live." onDismiss={() => {}} />
        <Alert tone="warning" title="80% of API calls used" description="Requests are throttled after 1M calls." />
        <Alert tone="danger" title="Payment failed" description="The card was declined." action={<Button size="sm" variant="secondary">Update card</Button>} />
      </div>,
    );
  });
});
