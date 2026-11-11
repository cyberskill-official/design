'use client';
import { Faders, ShareNetwork } from '@phosphor-icons/react';
import { Button, Drawer, DrawerClose, DrawerContent, DrawerTrigger, TextField } from '@cyberskill/design';

export function SideDrawer() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="secondary" />}>Edit agent</DrawerTrigger>
      <DrawerContent
        title="Edit Support Copilot"
        description="Changes apply to new conversations."
        footer={
          <>
            <DrawerClose render={<Button variant="secondary" />}>Cancel</DrawerClose>
            <Button>Save changes</Button>
          </>
        }
      >
        <TextField label="Name" defaultValue="Support Copilot" />
        <TextField label="Greeting" defaultValue="Xin chào! How can I help?" />
      </DrawerContent>
    </Drawer>
  );
}

export function LeftDrawer() {
  return (
    <Drawer side="left">
      <DrawerTrigger render={<Button variant="secondary" iconStart={<Faders />} />}>Filters</DrawerTrigger>
      <DrawerContent title="Filters" description="Narrow the conversation list." size="sm">
        <TextField label="Customer" placeholder="Name or email" />
      </DrawerContent>
    </Drawer>
  );
}

export function BottomSheet() {
  return (
    <Drawer side="bottom">
      <DrawerTrigger render={<Button variant="secondary" iconStart={<ShareNetwork />} />}>Share</DrawerTrigger>
      <DrawerContent title="Share conversation" description="Anyone with the link can read it." size="sm">
        <TextField label="Link" readOnly defaultValue="https://app.example.vn/c/8F3K2" />
        <Button fullWidth>Copy link</Button>
      </DrawerContent>
    </Drawer>
  );
}
