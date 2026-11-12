import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from './Collapsible';
import { TextField } from './Field';

const meta = {
  title: 'Structure/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  render: args => (
    <div style={{ maxWidth: 420 }}>
      <Collapsible {...args}>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsiblePanel>
          <div style={{ display: 'grid', gap: 12, padding: '4px 2px 8px' }}>
            <TextField label="Temperature" type="number" defaultValue="0.2" />
            <TextField label="Max tokens" type="number" defaultValue="800" />
          </div>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Advanced settings' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByLabelText('Temperature')).toBeVisible();
  },
};

export const Open: Story = { args: { defaultOpen: true } };

export const Disabled: Story = { args: { disabled: true } };
