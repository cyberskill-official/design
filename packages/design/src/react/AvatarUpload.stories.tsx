import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AvatarUpload } from './AvatarUpload';

// 1×1 PNG, so the stories need no network.
const PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
const png = async (name: string) => new File([await (await fetch(PHOTO)).blob()], name, { type: 'image/png' });

const meta = {
  title: 'Pickers/AvatarUpload',
  component: AvatarUpload,
  tags: ['autodocs'],
  args: { label: 'Profile photo', description: 'PNG, JPEG or WebP, up to 2 MB.', fallback: 'TL', maxSize: 2 * 1024 * 1024, onValueChange: fn() },
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const file = await png('me.png');
    await userEvent.upload(canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!, file);
    await expect(args.onValueChange).toHaveBeenCalledWith(file);
    await waitFor(() => expect(canvasElement.querySelector('.cs-avatar-upload-preview img')).toBeTruthy());
    await expect(canvas.getByRole('button', { name: 'Replace photo' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove photo' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await expect(canvas.getByRole('button', { name: 'Choose photo' })).toHaveFocus();
  },
};

export const WithPhoto: Story = { args: { defaultValue: PHOTO } };

export const Refused: Story = {
  play: async ({ canvasElement }) => {
    // a file the picker would let through on "All files"
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    const dt = new DataTransfer();
    dt.items.add(new File(['x'], 'notes.txt', { type: 'text/plain' }));
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const button = within(canvasElement).getByRole('button', { name: 'Choose photo' });
    await waitFor(() => expect(button).toHaveAttribute('aria-invalid', 'true'));
    await expect(button).toHaveAccessibleDescription(expect.stringContaining('notes.txt is not an accepted file type.'));
  },
};

export const WithError: Story = { args: { error: 'Add a photo so teammates recognise you.' } };
export const Disabled: Story = { args: { defaultValue: PHOTO, disabled: true } };
export const Vietnamese: Story = {
  args: {
    label: 'Ảnh đại diện',
    description: 'PNG, JPEG hoặc WebP, tối đa 2 MB.',
    fallback: 'ỮẪ',
    chooseLabel: 'Chọn ảnh',
    replaceLabel: 'Đổi ảnh',
    removeLabel: 'Xoá ảnh',
  },
};
