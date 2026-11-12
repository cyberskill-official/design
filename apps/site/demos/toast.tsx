'use client';
import { Button, ToastProvider, useToast } from '@cyberskill/design';

// The site layout has no ToastProvider, so the demo brings its own. In an app, wrap the root once.
export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  );
}

function ToastButtons() {
  const { toast } = useToast();
  return (
    <>
      <Button variant="secondary" onClick={() => toast({ title: 'Export started', description: 'We will email you when the CSV is ready.' })}>Info</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'success', title: 'Changes saved' })}>Success</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'warning', title: '80% of API calls used', description: 'Requests are throttled after 1M calls.' })}>Warning</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'danger', title: 'Payment failed', description: 'The card ending 4242 was declined.', timeout: 0 })}>Danger</Button>
      <Button
        onClick={() =>
          toast({
            tone: 'success',
            title: 'Project archived',
            description: 'Support Copilot moved to Archive.',
            action: { label: 'Undo', onClick: () => toast({ title: 'Project restored' }) },
            timeout: 8000,
          })
        }
      >
        Archive project
      </Button>
    </>
  );
}
