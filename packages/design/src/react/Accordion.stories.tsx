import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from './Accordion';

const faq = [
  { value: 'billing', q: 'How is usage billed?', a: 'Per message, at the end of each month. You can set a monthly cap in workspace settings.' },
  { value: 'data', q: 'Where is my data stored?', a: 'In the region you pick when you create the workspace. It never leaves that region.' },
  { value: 'sso', q: 'Can I use single sign-on?', a: 'Yes, with any SAML 2.0 or OIDC provider on the Business and Enterprise plans.' },
];

const meta = {
  title: 'Structure/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  render: args => (
    <div style={{ maxWidth: 560 }}>
      <Accordion {...args}>
        {faq.map(item => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionPanel>{item.a}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const billing = canvas.getByRole('button', { name: 'How is usage billed?' });
    await userEvent.click(billing);
    await expect(billing).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Where is my data stored?' }));
    await expect(billing).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['billing'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Where is my data stored?' }));
    await expect(canvas.getByRole('button', { name: 'How is usage billed?' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: 'Where is my data stored?' })).toHaveAttribute('aria-expanded', 'true');
  },
};

export const DefaultOpen: Story = { args: { defaultValue: ['data'] } };

export const DisabledItem: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion>
        <AccordionItem value="plan">
          <AccordionTrigger>Plan and seats</AccordionTrigger>
          <AccordionPanel>Business plan, 24 of 30 seats used.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="audit" disabled>
          <AccordionTrigger>Audit log (Enterprise)</AccordionTrigger>
          <AccordionPanel>Upgrade to see every change in your workspace.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
