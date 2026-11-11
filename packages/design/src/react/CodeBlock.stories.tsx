import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { CodeBlock, CopyButton } from './CodeBlock';

const usage = `import { Button } from '@cyberskill/design';
import '@cyberskill/design/styles.css';

export function Save() {
  return <Button onClick={() => save({ draft: false, notify: ['owner', 'billing'], retryOnConflict: true })}>Save</Button>;
}`;

const meta = {
  title: 'Structure/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  args: { code: usage, title: 'app/save.tsx', language: 'tsx' },
  argTypes: { variant: { control: 'inline-radio', options: ['raised', 'inverted'] } },
  render: args => (
    <div style={{ maxWidth: 560 }}>
      <CodeBlock {...args} />
    </div>
  ),
  // Stories run in a real browser; keep the clipboard out of the test.
  beforeEach: () => {
    const spy = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    return () => spy.mockRestore();
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied'));
  },
};

export const Inverted: Story = { args: { variant: 'inverted' } };

export const Wrapped: Story = { args: { wrap: true } };

export const NoHeader: Story = { args: { code: 'npm install @cyberskill/design', title: undefined, language: undefined } };

export const Vietnamese: Story = { args: { copyLabel: 'Sao chép', copiedLabel: 'Đã sao chép', title: 'Cài đặt', language: 'bash', code: 'npm install @cyberskill/design' } };

export const StandaloneCopyButton: Story = {
  render: () => (
    <div className="cs-ui" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <code style={{ fontFamily: 'var(--font-mono)' }}>ws_8f3k2q</code>
      <CopyButton value="ws_8f3k2q" label="Copy workspace ID" />
    </div>
  ),
};
