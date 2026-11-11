import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper, type StepperStep } from './Stepper';
import { expectAccessibleInThemes } from '../test/a11y';

const steps: StepperStep[] = [
  { title: 'Connect sources', description: '14 documents', status: 'complete' },
  { title: 'Train agent', description: 'About 5 minutes', status: 'current' },
  { title: 'Go live', status: 'upcoming' },
];

describe('Stepper', () => {
  it('renders an ordered list with the current step marked and every status in text', () => {
    const { container } = render(<Stepper steps={steps} aria-label="Agent setup" />);
    const list = screen.getByRole('list', { name: 'Agent setup' });
    expect(list.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[0]!.textContent).toMatch(/^Connect sources, Completed/);
    expect(items[1]!.textContent).toMatch(/^Train agent, Current step/);
    expect(items[2]!.textContent).toMatch(/^Go live, Not started$/);
    expect(container.querySelectorAll('.cs-stepper-check')).toHaveLength(1);
  });

  it('colors the bar by status: primary, accent, border', () => {
    const { container } = render(<Stepper steps={steps} />);
    const bars = [...container.querySelectorAll('.cs-stepper-bar')].map(b => getComputedStyle(b).backgroundColor);
    const token = (name: string) => {
      const probe = document.createElement('i');
      probe.style.background = `var(--${name})`;
      container.appendChild(probe);
      return getComputedStyle(probe).backgroundColor;
    };
    expect(bars).toEqual([token('primary'), token('accent'), token('border')]);
  });

  it('takes Vietnamese status labels and a vertical layout', () => {
    render(<Stepper steps={steps} orientation="vertical" statusLabels={{ complete: 'Đã xong', current: 'Bước hiện tại', upcoming: 'Chưa bắt đầu' }} />);
    expect(screen.getAllByRole('listitem')[1]!.textContent).toMatch(/^Train agent, Bước hiện tại/);
    expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('wraps steps into rows on a phone instead of letting titles run into the next step', () => {
    const four: StepperStep[] = ['Connect sources', 'Train agent', 'Test answers', 'Go live'].map((title, i) => ({ title, status: i === 0 ? 'complete' : i === 1 ? 'current' : 'upcoming' }));
    const { container } = render(<div style={{ width: 240 }}><Stepper steps={four} /></div>);
    for (const step of container.querySelectorAll('.cs-stepper-step')) {
      const text = document.createRange();
      text.selectNodeContents(step.querySelector('.cs-stepper-title')!);
      // the rendered words, not the title box: in a column too narrow they spill past the step into its neighbour
      expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(step.getBoundingClientRect().right + 1);
    }
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div>
        <Stepper steps={steps} aria-label="Agent setup" />
        <Stepper steps={steps} orientation="vertical" aria-label="Agent setup, vertical" />
      </div>,
    );
  });
});
