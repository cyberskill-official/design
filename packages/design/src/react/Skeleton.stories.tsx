import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Skeleton, SkeletonText } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { width: 240, height: 16, radius: 'md' },
  argTypes: { radius: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Block: Story = {};

export const Text: Story = { render: () => <div style={{ width: '100%', maxWidth: 360 }}><SkeletonText lines={4} /></div> };

/** The recommended loading pattern: one hidden status names the wait, the shapes stay out of the accessibility tree. */
export const CardLoading: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360, boxSizing: 'border-box', padding: 20, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <span role="status" className="cs-visually-hidden">Loading project</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton width={40} height={40} radius="full" />
        <div style={{ display: 'grid', gap: 8, flex: 1 }}>
          <Skeleton width="50%" height={14} />
          <Skeleton width="30%" height={12} />
        </div>
      </div>
      <SkeletonText lines={3} />
      <Skeleton height={120} radius="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading project');
  },
};
