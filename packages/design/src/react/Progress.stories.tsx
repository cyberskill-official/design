import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { label: 'Uploading 3 files', value: 42 },
  argTypes: { tone: { control: 'inline-radio', options: ['primary', 'warning', 'danger'] } },
  render: args => <div style={{ width: '100%', maxWidth: 360 }}><Progress {...args} /></div>,
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: 'Uploading 3 files' });
    await expect(bar).toHaveAttribute('aria-valuenow', '42');
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 360 }}>
      <Progress label="Importing contacts" value={64} />
      <Progress label="Storage" value={86} warnAt={80} />
      <Progress label="Import stopped" value={30} tone="danger" />
    </div>
  ),
};

export const Indeterminate: Story = { args: { label: 'Preparing export', value: null } };

/** Warning and danger add their status to the name ("Retrying sync, Critical") and keep the icon without a value. */
export const IndeterminateDanger: Story = {
  args: { label: 'Retrying sync', value: null, tone: 'danger' },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: /^Retrying sync ?, Critical$/ });
    await expect(bar.querySelector('.cs-progress-value svg')).not.toBeNull();
  },
};

export const Complete: Story = { args: { label: 'Upload complete', value: 100 } };
