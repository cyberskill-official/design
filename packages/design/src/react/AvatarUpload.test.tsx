import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';
import { expectAccessibleInThemes } from '../test/a11y';

// 1×1 PNG, so previews load without the network.
const PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
const png = async (name: string) => new File([await (await fetch(PHOTO)).blob()], name, { type: 'image/png' });
const input = () => document.querySelector<HTMLInputElement>('input[type="file"]')!;
const previewImg = () => document.querySelector<HTMLImageElement>('.cs-avatar-upload-preview img');
/** Sets the input's files the way the picker does; unlike userEvent.upload it does not filter by `accept`. */
const choose = (file: File) => {
  const dt = new DataTransfer();
  dt.items.add(file);
  input().files = dt.files;
  input().dispatchEvent(new Event('change', { bubbles: true }));
};

afterEach(() => vi.restoreAllMocks());

describe('AvatarUpload', () => {
  it('is a labelled group whose button opens the file picker', async () => {
    render(<AvatarUpload label="Profile photo" description="PNG, JPEG or WebP, up to 2 MB." fallback="TL" />);
    expect(screen.getByRole('group', { name: 'Profile photo' })).toBeVisible();
    const button = screen.getByRole('button', { name: 'Choose photo' });
    expect(button).toHaveAccessibleDescription('PNG, JPEG or WebP, up to 2 MB.');
    expect(screen.queryByRole('button', { name: 'Remove photo' })).toBeNull();
    expect(document.querySelector('.cs-avatar-upload-preview')).toHaveTextContent('TL');
    expect(input()).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp');
    const click = vi.spyOn(input(), 'click').mockImplementation(() => {});
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(click).toHaveBeenCalled();
  });

  it('shows a picked image in the preview, then replaces and removes it', async () => {
    const onValueChange = vi.fn();
    render(<AvatarUpload label="Profile photo" onValueChange={onValueChange} />);
    const me = await png('me.png');
    await userEvent.upload(input(), me);
    expect(onValueChange).toHaveBeenLastCalledWith(me);
    await expect.poll(() => previewImg()?.src).toMatch(/^blob:/);
    expect(screen.getByRole('button', { name: 'Replace photo' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Remove photo' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(previewImg()).toBeNull();
    // the Remove button is gone: focus lands on the button that picks a new photo
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Choose photo' }));
  });

  it('refuses a wrong type or a file over maxSize with linked error text, keeping the current photo', async () => {
    const onValueChange = vi.fn();
    render(
      <AvatarUpload
        label="Ảnh đại diện"
        defaultValue={PHOTO}
        maxSize={1000}
        onValueChange={onValueChange}
        wrongTypeMessage={f => `${f.name} không phải ảnh.`}
        tooLargeMessage={(f, max) => `${f.name} lớn hơn ${max}.`}
      />,
    );
    const replace = screen.getByRole('button', { name: 'Replace photo' });
    choose(new File(['x'], 'notes.txt', { type: 'text/plain' }));
    expect(await screen.findByText('notes.txt không phải ảnh.')).toBeVisible();
    expect(replace).toHaveAttribute('aria-invalid', 'true');
    expect(replace).toHaveAccessibleDescription('notes.txt không phải ảnh.');
    choose(new File([new Uint8Array(5000)], 'big.png', { type: 'image/png' }));
    expect(await screen.findByText('big.png lớn hơn 1,000 byte.')).toBeVisible();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(previewImg()?.src).toBe(PHOTO);
    // a good file clears the message
    choose(await png('ok.png'));
    await expect.poll(() => screen.queryByText(/lớn hơn/)).toBeNull();
    expect(replace).not.toHaveAttribute('aria-invalid');
  });

  it('revokes each preview URL when the file changes and on unmount', async () => {
    const create = vi.spyOn(URL, 'createObjectURL');
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    const { unmount } = render(<AvatarUpload label="Profile photo" />);
    await userEvent.upload(input(), await png('a.png'));
    const first = create.mock.results.at(-1)!.value as string;
    expect(revoke).not.toHaveBeenCalledWith(first);
    await userEvent.upload(input(), await png('b.png'));
    const second = create.mock.results.at(-1)!.value as string;
    expect(revoke).toHaveBeenCalledWith(first);
    expect(revoke).not.toHaveBeenCalledWith(second);
    unmount();
    expect(revoke).toHaveBeenCalledWith(second);
    expect(create).toHaveBeenCalledTimes(revoke.mock.calls.length);
  });

  it('revokes the preview when the photo is removed', async () => {
    const create = vi.spyOn(URL, 'createObjectURL');
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    render(<AvatarUpload label="Profile photo" />);
    await userEvent.upload(input(), await png('a.png'));
    await userEvent.click(screen.getByRole('button', { name: 'Remove photo' }));
    expect(revoke).toHaveBeenCalledWith(create.mock.results.at(-1)!.value);
  });

  it('name: a native form submits the shown file, not a refused one, and nothing after removal', async () => {
    const { container } = render(<form><AvatarUpload label="Profile photo" name="avatar" /></form>);
    const form = container.querySelector('form')!;
    const submitted = () => (new FormData(form).get('avatar') as File | null)?.name || null;
    await userEvent.upload(input(), await png('me.png'));
    await expect.poll(submitted).toBe('me.png');
    choose(new File(['x'], 'notes.txt', { type: 'text/plain' }));
    await expect.poll(submitted).toBe('me.png');
    await userEvent.click(screen.getByRole('button', { name: 'Remove photo' }));
    await expect.poll(submitted).toBeNull();
  });

  it('a controlled value reset to undefined (React Hook Form reset()) clears the photo', async () => {
    function Form() {
      const [photo, setPhoto] = useState<File | string | null | undefined>(PHOTO);
      return (
        <>
          <AvatarUpload label="Profile photo" value={photo} onValueChange={setPhoto} fallback="AN" />
          <button type="button" onClick={() => setPhoto(undefined)}>Reset</button>
        </>
      );
    }
    render(<Form />);
    expect(screen.getByRole('button', { name: 'Replace photo' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('button', { name: 'Choose photo' })).toBeVisible();
    expect(previewImg()).toBeNull();
  });

  it('disabled: no picking or removing', () => {
    render(<AvatarUpload label="Profile photo" defaultValue={PHOTO} disabled />);
    expect(screen.getByRole('button', { name: 'Replace photo' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove photo' })).toBeDisabled();
    expect(input()).toBeDisabled();
  });

  it('a form error is linked and marks the button invalid', () => {
    render(<AvatarUpload label="Profile photo" error="Add a photo so teammates recognise you." />);
    const button = screen.getByRole('button', { name: 'Choose photo' });
    expect(button).toHaveAttribute('aria-invalid', 'true');
    expect(button).toHaveAccessibleDescription('Add a photo so teammates recognise you.');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
        <AvatarUpload label="Profile photo" description="PNG, JPEG or WebP, up to 2 MB." fallback="TL" />
        <AvatarUpload label="Team logo" defaultValue={PHOTO} error="Use a square image." />
        <AvatarUpload label="Locked" defaultValue={PHOTO} disabled />
      </div>,
    );
  });
});
