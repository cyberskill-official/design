'use client';
import { Button, Tag } from '@cyberskill/design';
import { useState } from 'react';

const initial = ['SOC 2', 'ISO 27001', 'v2.4.1', 'Enterprise'];

export function TagStatic() {
  return (
    <>
      <Tag>SOC 2</Tag>
      <Tag>v2.4.1</Tag>
      <Tag>Enterprise</Tag>
    </>
  );
}

export function TagRemovable() {
  const [tags, setTags] = useState(initial);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      {tags.map((t) => (
        <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
      ))}
      {tags.length < initial.length && (
        <Button variant="link" size="sm" onClick={() => setTags(initial)}>Reset</Button>
      )}
    </div>
  );
}
