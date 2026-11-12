import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from './PreviewCard';

const avatar = {
  display: 'grid',
  placeItems: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'var(--accent)',
  color: 'var(--accent-foreground)',
  font: '700 15px/1 var(--font-display)',
} as const;

const meta = {
  title: 'Overlays/PreviewCard',
  component: PreviewCardContent,
  tags: ['autodocs'],
  render: args => (
    <p className="cs-body" style={{ maxWidth: 480 }}>
      This answer was reviewed by{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#lan">Nguyễn Thị Lan</PreviewCardTrigger>
        <PreviewCardContent {...args}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={avatar} aria-hidden="true">L</span>
            <div style={{ display: 'grid' }}>
              <strong>Nguyễn Thị Lan</strong>
              <span style={{ color: 'var(--muted)' }}>Support lead, Hà Nội</span>
            </div>
          </div>
          <span>Reviews agent answers for billing and refunds. 42 agents reviewed this quarter.</span>
        </PreviewCardContent>
      </PreviewCard>{' '}
      before it went live.
    </p>
  ),
} satisfies Meta<typeof PreviewCardContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Person: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('link', { name: 'Nguyễn Thị Lan' }));
    const text = await screen.findByText('Support lead, Hà Nội', {}, { timeout: 2000 }); // after the 600ms delay
    await waitFor(() => expect(getComputedStyle(text.closest('.cs-preview-card')!).opacity).toBe('1'));
  },
};
