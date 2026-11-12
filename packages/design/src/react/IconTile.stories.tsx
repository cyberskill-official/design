import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartLineUp, Lightning, ShieldCheck, Sparkle, UsersThree, Warning } from '@phosphor-icons/react';
import { expect, within } from 'storybook/test';
import { IconTile } from './IconTile';
import type { Tone } from './tone';

const tones: Tone[] = ['primary', 'accent', 'success', 'warning', 'danger', 'info', 'blue', 'amber', 'teal', 'magenta', 'violet'];

const meta = {
  title: 'Data Display/IconTile',
  component: IconTile,
  tags: ['autodocs'],
  args: { tone: 'teal', size: 'md', children: <UsersThree /> },
  argTypes: {
    tone: { control: 'select', options: tones },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every tone in light and dark side by side, so the story test checks both themes. */
export const Tones: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tones.map(tone => <IconTile key={tone} tone={tone}><Lightning /></IconTile>)}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconTile size="sm" tone="blue"><ChartLineUp /></IconTile>
      <IconTile size="md" tone="blue"><ChartLineUp /></IconTile>
      <IconTile size="lg" tone="blue"><ChartLineUp /></IconTile>
    </div>
  ),
};

/** With an `aria-label` the tile is announced as an image; without one it is hidden from screen readers. */
export const Named: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconTile tone="success" aria-label="Verified"><ShieldCheck /></IconTile>
      <IconTile tone="warning" aria-label="Needs review"><Warning /></IconTile>
      <IconTile tone="accent"><Sparkle /></IconTile>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Verified' })).toBeVisible();
    await expect(canvas.getAllByRole('img')).toHaveLength(2);
  },
};
