import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Workspace', href: '#' },
      { label: 'Agents', href: '#' },
      { label: 'Support Copilot', href: '#' },
      { label: 'Training sources' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Breadcrumb' });
    await expect(within(nav).getByText('Training sources')).toHaveAttribute('aria-current', 'page');
  },
};

export const Vietnamese: Story = {
  args: {
    label: 'Đường dẫn',
    items: [
      { label: 'Không gian làm việc', href: '#' },
      { label: 'Trợ lý', href: '#' },
      { label: 'Trợ lý hỗ trợ' },
    ],
  },
};

/** Children: pass your router's links (e.g. Next.js `Link`) and mark the current one. */
export const CustomLinks: Story = {
  args: { items: undefined },
  render: args => (
    <Breadcrumbs {...args}>
      <a href="#">Workspace</a>
      <a href="#">Billing</a>
      <a href="#" aria-current="page">Invoices</a>
    </Breadcrumbs>
  ),
};
