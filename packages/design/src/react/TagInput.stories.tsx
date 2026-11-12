import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TagInput, type TagRejectReason } from './TagInput';

const isEmail = (tag: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);

const meta = {
  title: 'Pickers/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  args: { label: 'Keywords', placeholder: 'Type and press Enter', onValueChange: fn(), onReject: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 400 }}>
      <TagInput {...args} />
    </div>
  ),
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Keywords' });
    await userEvent.type(input, 'design{Enter}tokens,');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['design', 'tokens']);
    await userEvent.keyboard('{Backspace}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['design']);
    await expect(canvas.getByRole('button', { name: 'Remove design' })).toBeVisible();
  },
};

export const Emails: Story = {
  args: { label: 'Invite by email', placeholder: 'name@company.vn', description: 'Paste a list or press Enter after each address.', validate: isEmail, defaultValue: ['an@acme.vn'] },
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Invite by email' });
    await userEvent.click(input);
    await userEvent.paste('binh@acme.vn, not-an-email\nAN@acme.vn');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['an@acme.vn', 'binh@acme.vn']);
    await expect(args.onReject).toHaveBeenCalledWith('not-an-email', 'invalid');
    await expect(args.onReject).toHaveBeenCalledWith('AN@acme.vn', 'duplicate');
    await expect(input).toHaveValue('not-an-email, AN@acme.vn');
  },
};

/** The app turns `onReject` into the field's error text. */
export const ShowingRejections: Story = {
  render: function Render() {
    const [message, setMessage] = useState<string>();
    const text: Record<TagRejectReason, (tag: string) => string> = {
      duplicate: tag => `${tag} is already on the list.`,
      invalid: tag => `${tag} is not an email address.`,
      max: () => 'You can invite up to 3 people at a time.',
    };
    return (
      <div style={{ maxWidth: 400 }}>
        <TagInput
          label="Invite by email"
          validate={isEmail}
          max={3}
          defaultValue={['an@acme.vn']}
          error={message}
          onReject={(tag, reason) => setMessage(text[reason](tag))}
          onValueChange={() => setMessage(undefined)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Invite by email' }), 'an@acme.vn{Enter}');
    await expect(canvas.getByText('an@acme.vn is already on the list.')).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Invite by email' })).toHaveAccessibleDescription('an@acme.vn is already on the list.');
  },
};

export const Max: Story = { args: { label: 'Reviewers', defaultValue: ['an', 'binh', 'chi'], max: 3, description: 'Up to 3 reviewers.' } };
export const WithError: Story = { args: { defaultValue: ['design'], error: 'Add at least two keywords.' } };
export const Disabled: Story = { args: { defaultValue: ['design', 'tokens'], disabled: true } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
      <TagInput label="Small" size="sm" defaultValue={['Hà Nội', 'Huế']} />
      <TagInput label="Medium" defaultValue={['Hà Nội', 'Huế']} />
      <TagInput label="Large" size="lg" defaultValue={['Hà Nội', 'Huế']} removeLabel={tag => `Xoá ${tag}`} />
    </div>
  ),
};
