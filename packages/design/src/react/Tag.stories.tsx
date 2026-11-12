import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tag } from './Tag';
import { toneFor } from './tone';

const meta = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'SOC 2' },
  argTypes: { tone: { control: 'select', options: [undefined, 'blue', 'amber', 'teal', 'magenta', 'violet'] } },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  args: { onRemove: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Remove SOC 2' }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

function TagList() {
  const [tags, setTags] = useState(['SOC 2', 'ISO 27001', 'v2.4.1', 'Enterprise']);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map(t => <Tag key={t} onRemove={() => setTags(tags.filter(x => x !== t))}>{t}</Tag>)}
    </div>
  );
}

/** Category tints, one per team. `toneFor(text)` picks a stable tone from the text itself. */
export const Tones: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {['Design', 'Finance', 'Support', 'Marketing', 'Research'].map(team => <Tag key={team} tone={toneFor(team)} onRemove={() => {}}>{team}</Tag>)}
    </div>
  ),
};

export const List: Story = {
  globals: { theme: 'side-by-side' },
  render: () => <TagList />,
};

export const RemoveFromList: Story = {
  render: () => <TagList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove v2.4.1' }));
    await expect(canvas.queryByText('v2.4.1')).toBeNull();
    await expect(canvas.getAllByRole('button')).toHaveLength(3);
  },
};
