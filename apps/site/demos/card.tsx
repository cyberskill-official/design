'use client';
import { Sparkle } from '@phosphor-icons/react';
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@cyberskill/design';

export function CardBasic() {
  return (
    <Card style={{ width: '100%', maxWidth: 380 }}>
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
        <CardDescription>12,480 of 20,000 API requests. Resets on the 1st.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge tone="success">Healthy</Badge>
          <Badge>62% used</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">View details</Button>
        <Button size="sm">Upgrade plan</Button>
      </CardFooter>
    </Card>
  );
}

export function CardLinks() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, width: '100%' }}>
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
  );
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, width: '100%' } as const;

export function CardTones() {
  return (
    <div style={grid}>
      <Card tone="accent">
        <CardHeader>
          <CardTitle>Suggested reply</CardTitle>
          <CardDescription>Drafted from the last three messages.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="soft" tone="accent" size="sm" iconStart={<Sparkle />}>Use draft</Button>
        </CardFooter>
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
  );
}

export function CardSurfaces() {
  return (
    <div style={grid}>
      <Card surface="ink">
        <CardHeader>
          <CardTitle>Pro plan</CardTitle>
          <CardDescription>84% of this month's seats are in use.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm">Upgrade</Button>
          <Button variant="ghost" size="sm">Compare plans</Button>
        </CardFooter>
      </Card>
      <Card surface="aurora">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Three things changed since your last visit.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
