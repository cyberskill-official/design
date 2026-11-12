'use client';
import { TagInput, type TagRejectReason } from '@cyberskill/design';
import { useState } from 'react';

const isEmail = (tag: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);

export function TagInputBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <TagInput label="Keywords" placeholder="Type and press Enter" defaultValue={['design', 'tokens']} description="Enter or a comma adds a keyword." />
    </div>
  );
}

export function TagInputEmails() {
  const [emails, setEmails] = useState<string[]>(['an@acme.vn']);
  const [error, setError] = useState<string>();
  const messages: Record<TagRejectReason, (tag: string) => string> = {
    duplicate: (tag) => `${tag} is already on the list.`,
    invalid: (tag) => `${tag} is not an email address.`,
    max: () => 'Invite up to 5 people at a time.',
  };
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 420 }}>
      <TagInput
        label="Invite by email"
        placeholder="name@company.vn"
        description="Paste a list, or press Enter after each address."
        value={emails}
        onValueChange={(next) => { setEmails(next); setError(undefined); }}
        validate={isEmail}
        max={5}
        onReject={(tag, reason) => setError(messages[reason](tag))}
        error={error}
        inputMode="email"
      />
      <p style={{ margin: 0, fontSize: 13 }}>Value: <code>{JSON.stringify(emails)}</code></p>
    </div>
  );
}

export function TagInputStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TagInput label="Reviewers" defaultValue={['an', 'binh', 'chi']} max={3} description="Up to 3 reviewers." />
      <TagInput label="Topics" defaultValue={['billing']} error="Add at least two topics." />
      <TagInput label="Locked" defaultValue={['Hà Nội', 'Huế']} disabled />
      <TagInput label="Từ khoá" size="sm" defaultValue={['Ổn định', 'Đà Nẵng']} removeLabel={(tag) => `Xoá ${tag}`} />
    </div>
  );
}
