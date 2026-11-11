'use client';
import { Avatar, AvatarGroup } from '@cyberskill/design';

// Inline stand-in photo so the demo never depends on an outside image host.
const PHOTO = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#5B8CC4"/><circle cx="20" cy="16" r="7" fill="#E6ECF5"/><rect x="8" y="26" width="24" height="16" rx="8" fill="#E6ECF5"/></svg>')}`;

export function AvatarSizes() {
  return (
    <>
      <Avatar name="Trần Thị Linh" size="sm" />
      <Avatar name="Trần Thị Linh" size="md" />
      <Avatar name="Trần Thị Linh" size="lg" />
      <Avatar name="Minh Anh" size="lg" src={PHOTO} />
      <Avatar name="Broken photo" size="lg" src="/missing.png" initials="BP" />
    </>
  );
}

export function AvatarGroupDemo() {
  return (
    <AvatarGroup label="Project members" max={4}>
      <Avatar name="An Nguyen" />
      <Avatar name="Binh Tran" src={PHOTO} />
      <Avatar name="Chi Le" />
      <Avatar name="Dung Pham" />
      <Avatar name="Em Vo" />
      <Avatar name="Giang Ho" />
    </AvatarGroup>
  );
}
