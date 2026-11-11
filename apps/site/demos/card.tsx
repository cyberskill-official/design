'use client';
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
