import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from '@phosphor-icons/react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button, IconButton } from './Button';
import { TextField } from './Field';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const meta = {
  title: 'Overlays/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  args: { title: 'Monthly limit', description: 'Agents pause when the workspace reaches this many messages.' },
  render: args => (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" />}>Usage limits</PopoverTrigger>
      <PopoverContent {...args}>
        <TextField label="Messages per month" type="number" defaultValue="20000" />
        <Button size="sm">Save limit</Button>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallForm: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Usage limits' }));
    const popover = await screen.findByRole('dialog', { name: 'Monthly limit' });
    await waitFor(() => expect(getComputedStyle(popover).opacity).toBe('1')); // after the fade-in
  },
};

/** An info button whose only job is to open details: a popover, not a tooltip, so touch and screen reader users get it too. */
export const Details: Story = {
  args: { title: 'What counts as a message?', description: 'Every reply an agent sends, including retries. Messages you send in the playground are free.' },
  render: args => (
    <Popover>
      <PopoverTrigger render={<IconButton label="About message limits" icon={<Info />} variant="ghost" size="sm" />} />
      <PopoverContent {...args} side="right" />
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'About message limits' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};
