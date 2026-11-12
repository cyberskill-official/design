'use client';
import { Trash, UserPlus } from '@phosphor-icons/react';
import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, TextField } from '@cyberskill/design';
import { useState } from 'react';

export function ConfirmDialog() {
  const [text, setText] = useState('');
  return (
    <Dialog onOpenChange={(open) => !open && setText('')}>
      <DialogTrigger render={<Button variant="secondary" iconStart={<Trash />} />}>Delete project</DialogTrigger>
      <DialogContent size="sm" icon={<Trash />} tone="danger" title="Delete Support Copilot?" description="This removes the agent, its 14 training sources and all conversation history. This cannot be undone.">
        <TextField label="Type DELETE to confirm" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} />
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <Button variant="danger" disabled={text !== 'DELETE'}>Delete agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button iconStart={<UserPlus />} />}>Invite people</DialogTrigger>
      <DialogContent title="Invite people" description="They get an email with a link to join this workspace.">
        <TextField label="Work email" type="email" placeholder="name@company.vn" />
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
