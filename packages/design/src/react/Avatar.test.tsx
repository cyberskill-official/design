import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarGroup } from './Avatar';
import { toneFor } from './tone';
import { expectAccessibleInThemes } from '../test/a11y';

// 1×1 PNG, so the image loads without the network.
const PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

describe('Avatar', () => {
  it('is an image named after the person, showing initials without a photo', () => {
    render(<Avatar name="Trần Thị Linh" />);
    const avatar = screen.getByRole('img', { name: 'Trần Thị Linh' });
    expect(avatar).toHaveTextContent('TL');
    expect(avatar).toHaveAttribute('data-size', 'md');
  });

  it('shows the photo once it loads, and accepts custom initials', async () => {
    render(<Avatar name="Minh Anh" src={PHOTO} initials="MA" size="lg" />);
    const avatar = screen.getByRole('img', { name: 'Minh Anh' });
    await expect.poll(() => avatar.querySelector('img.cs-avatar-image')).not.toBeNull();
    expect(avatar.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('falls back to initials when the photo fails', async () => {
    render(<Avatar name="Quốc Bảo" src="data:image/png;base64,broken" />);
    await expect.poll(() => screen.getByRole('img', { name: 'Quốc Bảo' }).textContent).toBe('QB');
  });

  it('group shows up to max avatars and a named +N bubble', () => {
    render(
      <AvatarGroup label="Project members" max={2} size="sm">
        <Avatar name="An Nguyen" />
        <Avatar name="Binh Tran" />
        <Avatar name="Chi Le" />
        <Avatar name="Dung Pham" />
      </AvatarGroup>,
    );
    const group = screen.getByRole('group', { name: 'Project members' });
    expect(screen.getByRole('img', { name: 'Binh Tran' })).toHaveAttribute('data-size', 'sm');
    expect(screen.queryByRole('img', { name: 'Chi Le' })).toBeNull();
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
    expect(group.children).toHaveLength(3);
  });

  it('takes a tone; toneFor gives the same name the same category tone every time', () => {
    const names = ['An Nguyen', 'Binh Tran', 'Chi Le', 'Dung Pham', 'Em Vo', 'Giang Ho', 'Trần Thị Linh', ''];
    for (const name of names) {
      expect(['blue', 'amber', 'teal', 'magenta', 'violet']).toContain(toneFor(name));
      expect(toneFor(name)).toBe(toneFor(name));
    }
    expect(new Set(names.map(toneFor)).size).toBeGreaterThan(1);
    render(<Avatar name="Chi Le" tone={toneFor('Chi Le')} />);
    expect(screen.getByRole('img', { name: 'Chi Le' })).toHaveAttribute('data-tone', toneFor('Chi Le'));
  });

  it('toneFor gives one name one tone in any Unicode form', () => {
    const nfc = 'Nguyễn Văn An'.normalize('NFC');
    const nfd = nfc.normalize('NFD');
    expect(nfd).not.toBe(nfc);
    expect(toneFor(nfd)).toBe(toneFor(nfc));
  });

  it("keeps an app's own data-tone when no tone is given", () => {
    render(<><Avatar name="An Nguyen" data-tone="custom" /><Avatar name="Chi Le" data-tone="custom" tone="teal" /></>);
    expect(screen.getByRole('img', { name: 'An Nguyen' })).toHaveAttribute('data-tone', 'custom');
    expect(screen.getByRole('img', { name: 'Chi Le' })).toHaveAttribute('data-tone', 'teal');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {(['primary', 'blue', 'amber', 'teal', 'magenta', 'violet'] as const).map(tone => <Avatar key={tone} name={`${tone} person`} tone={tone} />)}
        <Avatar name="An Nguyen" size="sm" />
        <Avatar name="Binh Tran" />
        <Avatar name="Chi Le" size="lg" />
        <AvatarGroup label="Reviewers" max={2} overflowLabel={n => `${n} người khác`}>
          <Avatar name="An Nguyen" />
          <Avatar name="Binh Tran" />
          <Avatar name="Chi Le" />
        </AvatarGroup>
      </div>,
    );
  });
});
