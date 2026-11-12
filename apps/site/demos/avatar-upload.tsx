'use client';
import { AvatarUpload } from '@cyberskill/design';
import { useState } from 'react';

// Inline stand-in photo so the demo never depends on an outside image host.
const PHOTO = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#5B8CC4"/><circle cx="20" cy="16" r="7" fill="#E6ECF5"/><rect x="8" y="26" width="24" height="16" rx="8" fill="#E6ECF5"/></svg>')}`;

export function AvatarUploadBasic() {
  return (
    <AvatarUpload label="Profile photo" description="PNG, JPEG or WebP, up to 2 MB." fallback="TL" maxSize={2 * 1024 * 1024} name="avatar" />
  );
}

export function AvatarUploadControlled() {
  const [photo, setPhoto] = useState<File | string | null>(PHOTO);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <AvatarUpload label="Team logo" value={photo} onValueChange={setPhoto} fallback="NW" maxSize={1024 * 1024} />
      <p style={{ margin: 0, fontSize: 13 }}>
        Value: <code>{photo instanceof File ? `File(${photo.name})` : photo ? 'existing URL' : 'null'}</code>
      </p>
    </div>
  );
}

export function AvatarUploadStates() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <AvatarUpload label="Profile photo" fallback="TL" error="Add a photo so teammates recognise you." />
      <AvatarUpload label="Locked" defaultValue={PHOTO} disabled />
      <AvatarUpload
        label="Ảnh đại diện"
        fallback="LT"
        chooseLabel="Chọn ảnh"
        replaceLabel="Đổi ảnh"
        removeLabel="Xoá ảnh"
        maxSize={2 * 1024 * 1024}
        tooLargeMessage={(f, max) => `${f.name} lớn hơn ${max}.`}
        wrongTypeMessage={(f) => `${f.name} không phải ảnh PNG, JPEG hay WebP.`}
      />
    </div>
  );
}
