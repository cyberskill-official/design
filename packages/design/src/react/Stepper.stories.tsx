import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stepper } from './Stepper';

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Agent setup',
    steps: [
      { title: 'Connect sources', description: '14 documents synced', status: 'complete' },
      { title: 'Train agent', description: 'About 5 minutes', status: 'current' },
      { title: 'Test answers', description: 'Try it in the playground', status: 'upcoming' },
      { title: 'Go live', status: 'upcoming' },
    ],
  },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  play: async ({ canvasElement }) => {
    const items = within(canvasElement).getAllByRole('listitem');
    await expect(items[1]).toHaveAttribute('aria-current', 'step');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [Story => <div style={{ maxWidth: 320 }}><Story /></div>],
};
