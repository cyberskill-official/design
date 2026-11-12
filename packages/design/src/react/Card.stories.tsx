import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkle } from '@phosphor-icons/react';
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

/** A soft tinted card says what kind of content it holds: a gold AI suggestion, a warning notice. */
export const Tones: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      <Card tone="accent">
        <CardHeader>
          <CardTitle>Suggested reply</CardTitle>
          <CardDescription>Drafted from the last three messages.</CardDescription>
        </CardHeader>
        <CardFooter><Button variant="soft" tone="accent" size="sm" iconStart={<Sparkle />}>Use draft</Button></CardFooter>
      </Card>
      <Card tone="warning">
        <CardHeader>
          <CardTitle>Trial ends in 3 days</CardTitle>
          <CardDescription>Add a payment method to keep your projects.</CardDescription>
        </CardHeader>
      </Card>
      <Card tone="teal">
        <CardHeader>
          <CardTitle>Support team</CardTitle>
          <CardDescription>6 people, 42 open conversations.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};

/** One brand moment per view. `ink` renders its content in the dark theme; `aurora` is a soft wash. */
export const Surfaces: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
      <Card surface="ink">
        <CardHeader>
          <CardTitle>Pro plan</CardTitle>
          <CardDescription>84% of this month's seats are in use.</CardDescription>
        </CardHeader>
        <CardFooter><Button size="sm">Upgrade</Button><Button variant="ghost" size="sm">Compare plans</Button></CardFooter>
      </Card>
      <Card surface="aurora">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Three things changed since your last visit.</CardDescription>
        </CardHeader>
      </Card>
    </div>
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
