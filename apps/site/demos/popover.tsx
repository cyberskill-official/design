'use client';
import { Info } from '@phosphor-icons/react';
import { Button, IconButton, Popover, PopoverContent, PopoverTrigger, TextField } from '@cyberskill/design';
import { useState } from 'react';

export function FormPopover() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="secondary" />}>Usage limits</PopoverTrigger>
      <PopoverContent title="Monthly limit" description="Agents pause when the workspace reaches this many messages.">
        <TextField label="Messages per month" type="number" defaultValue="20000" />
        <Button size="sm" onClick={() => setOpen(false)}>Save limit</Button>
      </PopoverContent>
    </Popover>
  );
}

export function InfoPopover() {
  return (
    <Popover>
      <PopoverTrigger render={<IconButton label="About message limits" icon={<Info />} variant="ghost" size="sm" />} />
      <PopoverContent side="right" title="What counts as a message?" description="Every reply an agent sends, including retries. Messages you send in the playground are free." />
    </Popover>
  );
}
