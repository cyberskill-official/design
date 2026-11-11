import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Copy, PencilSimple, Plus, Sparkle } from '@phosphor-icons/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, ButtonGroup, IconButton } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'quiet', 'accent', 'danger', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save changes' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button>Start free trial</Button>
      <Button variant="secondary">Talk to sales</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="quiet">Preview</Button>
      <Button variant="accent" iconStart={<Sparkle />}>Ask AI</Button>
      <Button variant="danger">Delete project</Button>
      <Button variant="link">View docs</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="sm" iconStart={<Plus />}>New project</Button>
      <Button size="md">Deploy</Button>
      <Button size="lg" iconEnd={<ArrowRight />}>Book a demo</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving' },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Saving' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton label="Edit" icon={<PencilSimple />} />
      <IconButton label="Copy" icon={<Copy />} size="sm" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <ButtonGroup label="View">
      <Button variant="secondary" size="sm" aria-pressed="true">List</Button>
      <Button variant="secondary" size="sm" aria-pressed="false">Board</Button>
      <Button variant="secondary" size="sm" aria-pressed="false">Timeline</Button>
    </ButtonGroup>
  ),
};
