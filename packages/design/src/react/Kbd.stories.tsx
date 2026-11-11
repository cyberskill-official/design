import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Kbd } from './Kbd';

const meta = {
  title: 'Structure/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { children: 'Esc' },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Esc').tagName).toBe('KBD');
  },
};

export const Shortcut: Story = {
  render: () => (
    <p className="cs-ui" style={{ margin: 0 }}>
      Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to search, or <Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd> for commands.
    </p>
  ),
};
