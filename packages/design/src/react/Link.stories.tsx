import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Link } from './Link';

const meta = {
  title: 'Data Display/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#docs', children: 'Read the setup guide' },
  argTypes: { tone: { control: 'inline-radio', options: ['default', 'muted'] } },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: { href: 'https://example.com', external: true, children: 'Status page' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Status page (opens in new tab)' });
    await expect(link).toHaveAttribute('target', '_blank');
  },
};

export const InText: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <p style={{ maxWidth: 420, margin: 0, font: '400 15px/24px var(--font-sans)' }}>
      Connect your workspace, then follow the <Link href="#guide">setup guide</Link>. Questions? Check the{' '}
      <Link href="https://example.com" external>status page</Link> or read the <Link href="#terms" tone="muted">terms</Link>.
    </p>
  ),
};
