'use client';
import { Alert, Button } from '@cyberskill/design';
import { useState } from 'react';

export function AlertTones() {
  return (
    <>
      <Alert tone="info" title="Scheduled maintenance on Sunday" description="The dashboard is read-only from 01:00 to 03:00. API traffic is not affected." />
      <Alert tone="success" title="Domain verified" description="support.example.com is live and serving over HTTPS." />
      <Alert tone="warning" title="80% of monthly API calls used" description="Requests are throttled after 1M calls. Upgrade or wait until the 1st." />
      <Alert tone="danger" title="Payment failed" description="The card ending 4242 was declined. Update it to keep the workspace active." />
    </>
  );
}

export function AlertWithAction() {
  const [open, setOpen] = useState(true);
  if (!open) return <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show alert again</Button>;
  return (
    <Alert
      tone="danger"
      title="Payment failed"
      description="The card ending 4242 was declined."
      action={<Button size="sm" variant="secondary">Update card</Button>}
      onDismiss={() => setOpen(false)}
    />
  );
}
