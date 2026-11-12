import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowClockwise, Copy, DownloadSimple, PencilSimple } from '@phosphor-icons/react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button, ButtonGroup, IconButton } from './Button';
import { Tooltip, TooltipProvider } from './Tooltip';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Copies the key once.', children: <IconButton label="Copy API key" icon={<Copy />} /> },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] } },
  decorators: [Story => <div style={{ padding: 48 }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { delay: 0 },
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('button', { name: 'Copy API key' }));
    const tip = await screen.findByText('Copies the key once.');
    await waitFor(() => expect(getComputedStyle(tip).opacity).toBe('1'));
  },
};

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
        <Tooltip key={side} side={side} content={`Opens on the ${side}`}>
          <Button variant="secondary" size="sm">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Toolbar: once one tooltip is open, moving to the next shows it instantly. */
export const SharedDelay: Story = {
  render: () => (
    <TooltipProvider delay={300}>
      <ButtonGroup label="Agent tools">
        <Tooltip content="Edit"><IconButton label="Edit" icon={<PencilSimple />} /></Tooltip>
        <Tooltip content="Retrain"><IconButton label="Retrain" icon={<ArrowClockwise />} /></Tooltip>
        <Tooltip content="Export transcripts"><IconButton label="Export transcripts" icon={<DownloadSimple />} /></Tooltip>
      </ButtonGroup>
    </TooltipProvider>
  ),
};
