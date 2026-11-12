'use client';
import { Trash } from '@phosphor-icons/react';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, Button } from '@cyberskill/design';

export function DestructiveAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="secondary" iconStart={<Trash />} />}>Delete agent</AlertDialogTrigger>
      <AlertDialogContent
        title="Delete Support Copilot?"
        description="This removes the agent, its 14 training sources and all conversation history. This cannot be undone."
        confirmLabel="Delete agent"
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
      />
    </AlertDialog>
  );
}

export function NeutralAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button />}>Publish</AlertDialogTrigger>
      <AlertDialogContent
        tone="neutral"
        title="Publish to production?"
        description="Customers start talking to version 12 of Support Copilot right away."
        confirmLabel="Publish"
        onConfirm={() => {}}
      />
    </AlertDialog>
  );
}
