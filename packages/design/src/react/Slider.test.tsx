import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';
import { expectAccessibleInThemes } from '../test/a11y';
import { withRuntimeLocale } from '../test/locale';

describe('Slider', () => {
  it('labels the thumb, shows the value and steps with the keyboard', async () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={40} step={10} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(50, expect.anything());
    expect(screen.getByText('50')).toBeVisible();
  });

  it('formats the shown value in en-US by default, whatever the runtime locale, so server and client HTML match', () => {
    withRuntimeLocale('de-DE', () => {
      render(<Slider label="Price" defaultValue={1234.5} max={5000} format={{ maximumFractionDigits: 3 }} />);
      expect(screen.getByText('1,234.5')).toBeVisible();
    });
  });

  it('range sliders name each thumb', async () => {
    render(<Slider label="Price" defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} />);
    expect(screen.getByRole('slider', { name: /Minimum price/ })).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByRole('slider', { name: /Maximum price/ })).toHaveAttribute('aria-valuenow', '80');
    expect(screen.getByText('20 – 80')).toBeVisible();
  });

  it('places marks along the track', () => {
    render(<Slider label="Level" defaultValue={50} marks={[0, { value: 50, label: 'Mid' }, 100]} />);
    expect(screen.getByText('Mid')).toBeVisible();
    const track = document.querySelector('.cs-slider-track')!.getBoundingClientRect();
    const mid = screen.getByText('Mid').getBoundingClientRect();
    expect(Math.abs(mid.left + mid.width / 2 - (track.left + track.width / 2))).toBeLessThan(2);
  });

  it('keeps a 44px touch target on the thumb', () => {
    render(<Slider thumbLabels={['Zoom']} defaultValue={10} />);
    const hit = getComputedStyle(document.querySelector('.cs-slider-thumb')!, '::before');
    expect(parseFloat(hit.width)).toBeGreaterThanOrEqual(44);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 24, maxWidth: 360 }}>
        <Slider label="Volume" defaultValue={40} />
        <Slider label="Price" defaultValue={[2000000, 8000000]} min={0} max={10000000} step={500000} locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} thumbLabels={['Giá thấp nhất', 'Giá cao nhất']} />
        <Slider label="Level" defaultValue={50} marks={[0, { value: 50, label: '50' }, { value: 100, label: '100' }]} />
        <Slider label="Locked" defaultValue={30} disabled />
        <Slider thumbLabels={['Zoom']} defaultValue={10} />
      </div>,
    );
  });
});
