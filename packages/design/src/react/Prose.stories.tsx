import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Prose } from './Prose';

const answer = `
<h2>Refund a duplicate charge</h2>
<p>Duplicate charges usually come from a <strong>retried</strong> card payment. Check the <a href="#policy">refund policy</a> first.</p>
<ol>
  <li>Open the customer in <em>Billing</em> and confirm both charges show the same invoice.
    <ul><li>Same amount, same day.</li><li>Different charge IDs, e.g. <code>ch_3PqR</code> and <code>ch_3PqS</code>.</li></ul>
  </li>
  <li>Refund the second charge in full.</li>
  <li>Reply with the refund ID.</li>
</ol>
<blockquote><p>Refunds under $500 need no approval.</p></blockquote>
<h3>From the API</h3>
<pre><code>curl https://api.example.com/v1/refunds \\
  -d charge=ch_3PqS -d reason=duplicate</code></pre>
<h4>Limits</h4>
<table tabindex="0">
  <thead><tr><th>Plan</th><th>Refund window</th><th>Approval</th><th>Contact</th></tr></thead>
  <tbody>
    <tr><td>Team</td><td>30 days</td><td>Under $500: none</td><td>billing-approvals@example.com</td></tr>
    <tr><td>Business</td><td>60 days</td><td>Under $2,000: none</td><td>finance-approvals@example.com</td></tr>
  </tbody>
</table>
<hr />
<p>Questions? Write to <a href="mailto:billing@example.com">billing@example.com</a>.</p>
`;

const meta = {
  title: 'Data Display/Prose',
  component: Prose,
  tags: ['autodocs'],
  args: { dangerouslySetInnerHTML: { __html: answer } },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  render: args => (
    <div style={{ maxWidth: 640 }}>
      <Prose {...args} />
    </div>
  ),
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Refund a duplicate charge', level: 2 })).toBeVisible();
    await expect(within(canvasElement).getByRole('table')).toBeVisible();
  },
};

export const Small: Story = { args: { size: 'sm' } };

/** At phone width, long words wrap and the table scrolls sideways inside its own box. */
export const Narrow: Story = {
  render: args => (
    <div style={{ width: 280 }}>
      <Prose {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector('table')!;
    await expect(table.scrollWidth).toBeGreaterThan(table.clientWidth);
    await expect(canvasElement.querySelector<HTMLElement>('.cs-prose')!.scrollWidth).toBeLessThanOrEqual(280);
  },
};

export const Vietnamese: Story = {
  args: {
    lang: 'vi',
    dangerouslySetInnerHTML: {
      __html: '<h2>Ổn định Ữ Ẫ Ẵ</h2><p>Đơn hàng <code>ĐH-Ỗ-2026</code> đã được hoàn tiền ặ ọ ỵ. Xem <a href="#chinh-sach">chính sách hoàn tiền</a>.</p><ul><li>Hằng tháng Ữ ỵ</li><li>Hằng năm Ặ ọ</li></ul>',
    },
  },
};
