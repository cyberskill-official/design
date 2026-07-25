import React from 'react';
import { AlertDialog } from '../components/overlays/AlertDialog.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    tone: { control: 'select', options: ['default', 'destructive'] },
    open: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting AlertDialog. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: {
    title: 'Delete workspace?',
    description: 'Removes every project and release. This cannot be undone.',
    tone: 'destructive',
  },
};

function Demo(args) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="danger-ghost" size="sm" onClick={() => setOpen(true)}>
        Delete workspace
      </Button>
      <AlertDialog {...args} open={open} onOpenChange={setOpen} onConfirm={() => {}} />
    </div>
  );
}

export const Default = {
  render: (args) => <Demo {...args} />,
};

export const Matrix = {
  name: 'Matrix / Tones',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <AlertDialog
        open
        title="Save changes?"
        description="Your profile edits will be kept."
        tone="default"
        onOpenChange={() => {}}
      />
    </div>
  ),
};
