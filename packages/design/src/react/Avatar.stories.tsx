import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarGroup } from './Avatar';
import { toneFor } from './tone';

// A self-contained photo stand-in so stories never hit the network.
const PHOTO = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#5B8CC4"/><circle cx="20" cy="16" r="7" fill="#E6ECF5"/><rect x="8" y="26" width="24" height="16" rx="8" fill="#E6ECF5"/></svg>')}`;

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Trần Thị Linh', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['primary', 'blue', 'amber', 'teal', 'magenta', 'violet'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Trần Thị Linh' })).toHaveTextContent('TL');
  },
};

export const WithPhoto: Story = { args: { src: PHOTO } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <Avatar name="An Nguyen" size="sm" />
      <Avatar name="An Nguyen" size="md" />
      <Avatar name="An Nguyen" size="lg" />
      <Avatar name="Binh Tran" size="lg" src={PHOTO} />
    </div>
  ),
};

/** `toneFor(name)` gives each person a stable category tint, so a list of initials is easier to tell apart. */
export const Tones: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      {['An Nguyen', 'Binh Tran', 'Chi Le', 'Dung Pham', 'Em Vo', 'Giang Ho'].map(name => <Avatar key={name} name={name} tone={toneFor(name)} />)}
      <Avatar name="Trần Thị Linh" tone="primary" />
    </div>
  ),
};

export const Group: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <AvatarGroup key={size} label="Project members" max={3} size={size}>
          <Avatar name="An Nguyen" />
          <Avatar name="Binh Tran" src={PHOTO} />
          <Avatar name="Chi Le" />
          <Avatar name="Dung Pham" />
          <Avatar name="Em Vo" />
        </AvatarGroup>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('img', { name: '2 more' }).length).toBeGreaterThan(0);
  },
};
