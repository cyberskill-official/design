import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { OtpField } from './OtpField';
import { expectAccessibleInThemes } from '../test/a11y';

describe('OtpField', () => {
  it('renders six labelled boxes and calls onComplete once typed', async () => {
    const onComplete = vi.fn();
    render(<OtpField label="Verification code" onComplete={onComplete} />);
    const first = screen.getByRole('textbox', { name: 'Verification code' });
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
    expect(screen.getByRole('textbox', { name: 'Character 6 of 6' })).toBeVisible();
    await userEvent.click(first);
    await userEvent.keyboard('123456');
    expect(onComplete).toHaveBeenCalledWith('123456', expect.anything());
  });

  it('fills every box from a paste', async () => {
    const onComplete = vi.fn();
    render(<OtpField label="Code" length={4} onComplete={onComplete} slotLabel={(n, t) => `Ký tự ${n}/${t}`} />);
    const first = screen.getByRole('textbox', { name: 'Code' });
    await userEvent.click(first);
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', '4821');
    first.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
    await expect.poll(() => onComplete.mock.calls[0]?.[0]).toBe('4821');
    expect(screen.getByRole('textbox', { name: 'Ký tự 4/4' })).toHaveValue('1');
  });

  it('ignores letters in numeric mode', async () => {
    render(<OtpField label="Code" />);
    await userEvent.click(screen.getByRole('textbox', { name: 'Code' }));
    await userEvent.keyboard('a1');
    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveValue('1');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <OtpField label="Verification code" description="We sent a 6-digit code to your phone." />
        <OtpField label="Wrong code" defaultValue="123456" error="That code is not valid." />
        <OtpField label="Locked" length={4} defaultValue="12" disabled />
      </div>,
    );
  });
});
