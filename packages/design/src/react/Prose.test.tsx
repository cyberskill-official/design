import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Prose } from './Prose';
import { expectAccessibleInThemes } from '../test/a11y';

const EMAIL = 'nguyen.thi.thanh.huong.accounting@cyberskill.world';
const html = `
  <h2>Refund a duplicate charge</h2>
  <p>Duplicate charges usually come from a <strong>retried</strong> card payment. See the <a href="#policy">refund policy</a>.</p>
  <ol>
    <li>Open the customer in <em>Billing</em>.
      <ul><li>Check both invoice numbers.</li><li>Note the <code>RF-20931</code> ID.</li></ul>
    </li>
    <li>Refund the second charge.</li>
  </ol>
  <blockquote><p>Refunds under $500 need no approval.</p></blockquote>
  <pre><code>curl -X POST https://api.example.com/v1/refunds -d charge=ch_123 -d reason=duplicate</code></pre>
  <table tabindex="0"><thead><tr><th>Plan</th><th>Seats</th><th>Contact</th></tr></thead><tbody><tr><td>Team</td><td>25</td><td>${EMAIL}</td></tr></tbody></table>
  <hr />
  <p>Questions? Write to ${EMAIL}.</p>
`;

describe('Prose', () => {
  it('renders a div with the house class, size and passed props', () => {
    render(<Prose size="sm" className="answer" aria-label="Answer" role="region"><p>Hi</p></Prose>);
    const box = screen.getByRole('region', { name: 'Answer' });
    expect(box).toHaveClass('cs-prose', 'answer');
    expect(box).toHaveAttribute('data-size', 'sm');
  });

  it('has no hooks or effects: renders to static HTML (Server Components)', () => {
    expect(renderToStaticMarkup(<Prose dangerouslySetInnerHTML={{ __html: '<p>Xin chào</p>' }} />)).toBe('<div data-size="md" class="cs-prose"><p>Xin chào</p></div>');
  });

  it('spaces blocks evenly and trims the first and last margins', () => {
    render(<Prose data-testid="p" dangerouslySetInnerHTML={{ __html: '<p>One</p><p>Two</p><h2>Heading</h2><p>Three</p>' }} />);
    const box = screen.getByTestId('p').getBoundingClientRect();
    const [one, two, three] = screen.getAllByText(/One|Two|Three/).map(el => el.getBoundingClientRect());
    const heading = screen.getByRole('heading', { name: 'Heading' }).getBoundingClientRect();
    expect(one!.top).toBe(box.top);
    expect(three!.bottom).toBe(box.bottom);
    expect(two!.top - one!.bottom).toBe(16);
    expect(heading.top - two!.bottom).toBe(24); // more room above a heading…
    expect(three!.top - heading.bottom).toBe(8); // …than below it
  });

  it('size sm tightens the type and spacing', () => {
    render(<Prose size="sm" dangerouslySetInnerHTML={{ __html: '<p>One</p><p>Two</p>' }} />);
    const [one, two] = screen.getAllByText(/One|Two/);
    expect(getComputedStyle(one!).fontSize).toBe('14px');
    expect(two!.getBoundingClientRect().top - one!.getBoundingClientRect().bottom).toBe(12);
  });

  it('keeps long words, code and wide tables inside a narrow column; the table scrolls in its own box', () => {
    render(<div style={{ width: 240 }}><Prose data-testid="p" dangerouslySetInnerHTML={{ __html: html }} /></div>);
    const prose = screen.getByTestId('p');
    expect(prose.scrollWidth).toBeLessThanOrEqual(240);
    const table = prose.querySelector('table')!;
    expect(table.getBoundingClientRect().width).toBeLessThanOrEqual(240);
    expect(table.scrollWidth).toBeGreaterThan(table.clientWidth);
    expect(screen.getByRole('table')).toBeInTheDocument(); // still announced as a table
    expect(prose.querySelector('pre')!.scrollWidth).toBeLessThanOrEqual(240);
  });

  it('as an item of a 1fr grid column, a wide table scrolls instead of widening the column', () => {
    render(<div style={{ display: 'grid', gridTemplateColumns: '1fr', width: 240 }}><Prose data-testid="p" dangerouslySetInnerHTML={{ __html: html }} /></div>);
    expect(screen.getByTestId('p').getBoundingClientRect().width).toBe(240);
    const table = document.querySelector('.cs-prose table')!;
    expect(table.scrollWidth).toBeGreaterThan(table.clientWidth);
  });

  it('nests list styles and shrinks images to the column', () => {
    render(<div style={{ width: 300 }}><Prose dangerouslySetInnerHTML={{ __html: `${html}<p><img alt="Chart" width="800" height="400" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" /></p>` }} /></div>);
    expect(getComputedStyle(document.querySelector('.cs-prose ol')!).listStyleType).toBe('decimal');
    expect(getComputedStyle(document.querySelector('.cs-prose li ul')!).listStyleType).toBe('circle');
    expect(screen.getByRole('img', { name: 'Chart' }).getBoundingClientRect().width).toBeLessThanOrEqual(300);
  });

  it('links get the house link style and focus ring', async () => {
    render(<Prose dangerouslySetInnerHTML={{ __html: '<p>See the <a href="#policy">refund policy</a>.</p>' }} />);
    const link = screen.getByRole('link', { name: 'refund policy' });
    expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    await userEvent.tab();
    expect(document.activeElement).toBe(link);
    expect(getComputedStyle(link).outlineStyle).toBe('solid');
    expect(getComputedStyle(link).outlineWidth).toBe('2px');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      // 240px: the table scrolls sideways in its own box
      <div style={{ display: 'grid', gap: 24, width: 240 }}>
        <Prose dangerouslySetInnerHTML={{ __html: `<h1>Billing guide</h1>${html}<h3>Before you start</h3><h4>Who can refund</h4>` }} />
        <Prose size="sm" lang="vi" dangerouslySetInnerHTML={{ __html: '<p>Ổn định Ữ Ẫ Ẵ ặ ọ ỵ, <code>Ỗ</code> và <a href="#a">liên kết Ữ</a>.</p>' }} />
      </div>,
    );
  });
});
