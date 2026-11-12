import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkle } from '@phosphor-icons/react';
import { Badge, type BadgeTone } from './Badge';

const tones: BadgeTone[] = ['neutral', 'primary', 'accent', 'success', 'warning', 'danger', 'info'];
const labels: Record<BadgeTone, string> = { neutral: 'Draft', primary: 'Beta', accent: 'New', success: 'Active', warning: 'Trial ends soon', danger: 'Failed', info: 'Syncing' };

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Active', tone: 'success', variant: 'soft', size: 'md' },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['soft', 'solid', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const Row = ({ variant }: { variant: 'soft' | 'solid' | 'outline' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {tones.map(tone => <Badge key={tone} tone={tone} variant={variant}>{labels[tone]}</Badge>)}
  </div>
);

export const Soft: Story = { render: () => <Row variant="soft" /> };
export const Solid: Story = { render: () => <Row variant="solid" /> };
export const Outline: Story = { render: () => <Row variant="outline" /> };

/** Light and dark side by side, so the story test checks contrast in both themes. */
export const BothThemes: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Row variant="soft" />
      <Row variant="solid" />
      <Row variant="outline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <Badge size="sm" tone="success">Active</Badge>
      <Badge size="md" tone="success">Active</Badge>
      <Badge size="sm" tone="primary">12</Badge>
      <Badge size="md" tone="primary">12</Badge>
    </div>
  ),
};

export const CustomIcon: Story = { args: { tone: 'accent', icon: <Sparkle />, children: 'AI assisted' } };
