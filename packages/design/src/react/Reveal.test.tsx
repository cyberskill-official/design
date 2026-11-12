import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Reveal, Stagger } from './Reveal';
import { expectAccessibleInThemes, waitForSettledUI } from '../test/a11y';

const items = (n: number) => Array.from({ length: n }, (_, i) => <Reveal key={i} render={<li />}>Item {i + 1}</Reveal>);

describe('Reveal', () => {
  it('renders its content in place, as another element with render, keeping both elements’ props', () => {
    render(<Reveal render={<section aria-label="Plan" className="theirs" style={{ padding: 4 }} />} className="mine" data-x="1">Team plan</Reveal>);
    const region = screen.getByRole('region', { name: 'Plan' });
    expect(region).toHaveClass('cs-reveal', 'theirs', 'mine');
    expect(region).toHaveAttribute('data-x', '1');
    expect(region).toHaveStyle({ padding: '4px' });
    expect(region).toHaveTextContent('Team plan');
  });

  it('is in the server HTML with its content and nothing that hides it', () => {
    expect(renderToString(<Reveal>Team plan</Reveal>)).toBe('<div class="cs-reveal">Team plan</div>');
    expect(renderToString(<Reveal delay={120}>Team plan</Reveal>)).toBe('<div class="cs-reveal" style="--_reveal-delay:120ms">Team plan</div>');
  });

  it('plays the reveal keyframes once and ends fully visible in place', async () => {
    render(<Reveal>Team plan</Reveal>);
    const el = screen.getByText('Team plan');
    expect(getComputedStyle(el)).toMatchObject({ animationName: 'cs-reveal', animationIterationCount: '1', animationFillMode: 'backwards' });
    await waitForSettledUI();
    expect(getComputedStyle(el).opacity).toBe('1');
    expect(getComputedStyle(el).translate).toBe('none'); // nothing held afterwards, so no stacking context is left behind
  });

  it('with reduced motion appears at once, without rising or staggering', () => {
    render(<Stagger>{items(3)}</Stagger>);
    for (const li of screen.getAllByText(/^Item/)) {
      expect(getComputedStyle(li).animationDuration).toBe('0.001s');
      expect(getComputedStyle(li).animationDelay).toBe('0s');
    }
  });

  it('with reduced motion a delayed Reveal is visible at once, not after its delay', async () => {
    render(<Reveal delay={2000}>Team plan</Reveal>);
    const el = screen.getByText('Team plan');
    expect(getComputedStyle(el).animationDelay).toBe('0s');
    await new Promise(r => setTimeout(r, 50));
    expect(getComputedStyle(el).opacity).toBe('1');
  });

  it('Stagger gives its children one step each, at most five, and adds their own delay', () => {
    // read the schedule from the steps: under reduced motion (the test browser) every computed delay is 0
    render(<><Stagger render={<ul />}>{items(8)}</Stagger><Stagger><Reveal>A</Reveal><Reveal delay={100}>B</Reveal></Stagger></>);
    expect(screen.getByRole('list')).toHaveClass('cs-stagger');
    expect(screen.getAllByRole('listitem').map(li => getComputedStyle(li).getPropertyValue('--_reveal-step') || '0')).toEqual(['0', '1', '2', '3', '4', '5', '5', '5']);
    expect(getComputedStyle(screen.getByText('B')).getPropertyValue('--_reveal-delay')).toBe('100ms');
  });

  it('has no axe violations in light and dark', async () => {
    await expectAccessibleInThemes(<Stagger render={<ul />}><Reveal render={<li />}>Lessons</Reveal><Reveal render={<li />}>Reviews</Reveal></Stagger>);
  });
});
