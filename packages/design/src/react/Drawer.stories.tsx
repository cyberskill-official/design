import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from './Drawer';
import { TextField } from './Field';

const meta = {
  title: 'Overlays/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  args: { title: 'Edit Support Copilot', description: 'Changes apply to new conversations.' },
  render: args => (
    <Drawer>
      <DrawerTrigger render={<Button variant="secondary" />}>Edit agent</DrawerTrigger>
      <DrawerContent
        {...args}
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
  ),
} satisfies Meta<typeof DrawerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const openAndClose = async (canvasElement: HTMLElement, trigger: string) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  const drawer = await screen.findByRole('dialog');
  await waitFor(() => expect(getComputedStyle(drawer).transform).toBe('matrix(1, 0, 0, 1, 0, 0)')); // slid in
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
};

export const Right: Story = { play: ({ canvasElement }) => openAndClose(canvasElement, 'Edit agent') };

export const Left: Story = {
  render: args => (
    <Drawer side="left">
      <DrawerTrigger render={<Button variant="secondary" />}>Filters</DrawerTrigger>
      <DrawerContent {...args} title="Filters" description="Narrow the conversation list." size="sm">
        <TextField label="Customer" placeholder="Name or email" />
      </DrawerContent>
    </Drawer>
  ),
  play: ({ canvasElement }) => openAndClose(canvasElement, 'Filters'),
};

/** Mobile bottom sheet with a grab handle. Swipe down to dismiss. */
export const BottomSheet: Story = {
  render: args => (
    <Drawer side="bottom">
      <DrawerTrigger render={<Button variant="secondary" />}>Share</DrawerTrigger>
      <DrawerContent {...args} title="Share conversation" description="Anyone with the link can read it." size="sm">
        <TextField label="Link" readOnly defaultValue="https://app.example.vn/c/8F3K2" />
        <Button fullWidth>Copy link</Button>
      </DrawerContent>
    </Drawer>
  ),
  play: ({ canvasElement }) => openAndClose(canvasElement, 'Share'),
};
