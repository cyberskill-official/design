import React from 'react';
import { AlertDialog } from '../components/overlays/AlertDialog.jsx';
import { Button } from '../components/button/Button.jsx';

const TONES = ['default', 'destructive'];

export default {
  title: 'Components/Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    tone: { control: 'select', options: TONES },
    variant: { control: 'select', options: TONES },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    lang: { control: 'select', options: ['en', 'vi'] },
    onConfirm: { control: false },
    onCancel: { control: false },
    onOpenChange: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting AlertDialog. Portable consumers use styles.css + bundle, not Storybook. `tone` and `variant` are aliases (`destructive` styles the confirm action).',
      },
    },
  },
  args: {
    title: 'Delete workspace?',
    description: 'Removes every project and release. This cannot be undone.',
    tone: 'destructive',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
    lang: 'en',
  },
};

function Demo(args) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="danger-ghost" size="sm" onClick={() => setOpen(true)}>
        Delete workspace
      </Button>
      <AlertDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

export const Default = {
  render: (args) => <Demo {...args} />,
};

export const Matrix = {
  name: 'Matrix / Tones · labels · uncontrolled',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <AlertDialog
        open
        title="Save changes?"
        description="Your profile edits will be kept."
        tone="default"
        confirmLabel="Save"
        cancelLabel="Discard"
        lang="en"
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
      <AlertDialog
        open
        title="Xóa workspace?"
        description="Không thể hoàn tác."
        variant="destructive"
        lang="vi"
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
      <UncontrolledDemo />
    </div>
  ),
};

function UncontrolledDemo() {
  return (
    <div>
      <p style={{ margin: '0 0 8px', fontSize: 13 }}>Uncontrolled (`defaultOpen`)</p>
      <AlertDialog
        defaultOpen
        title="Leave page?"
        description="Unsaved edits will be lost."
        tone="default"
        confirmLabel="Leave"
        cancelLabel="Stay"
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Exhaustive tone × variant product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / tone · variant',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {TONES.map((tone) => (
        <AlertDialog
          key={`tone-${tone}`}
          open
          {...args}
          title={`tone=${tone}`}
          description="Confirm action."
          tone={tone}
          variant={undefined}
          onOpenChange={() => {}}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      ))}
      {TONES.map((variant) => (
        <AlertDialog
          key={`variant-${variant}`}
          open
          {...args}
          title={`variant=${variant}`}
          description="Confirm action."
          tone={undefined}
          variant={variant}
          onOpenChange={() => {}}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      ))}
    </div>
  ),
};
