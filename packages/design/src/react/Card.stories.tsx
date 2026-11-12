import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
        <CardDescription>12,480 of 20,000 API requests. Resets on the 1st.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Badge tone="success">Healthy</Badge>
          <Badge tone="neutral">62% used</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">View details</Button>
        <Button size="sm">Upgrade plan</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      <Card interactive render={<a href="#billing" />}>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Plans, invoices and payment methods.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive render={<a href="#security" />}>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>SSO, audit log and data residency.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getAllByRole('link', { name: /Billing/ })[0]).toHaveFocus();
  },
};
