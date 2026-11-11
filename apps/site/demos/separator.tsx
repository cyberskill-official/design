'use client';
import { Button, Separator } from '@cyberskill/design';

export function SeparatorHorizontal() {
  return (
    <div className="cs-ui" style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <span>Workspace</span>
      <Separator />
      <span>Members</span>
    </div>
  );
}

export function SeparatorLabelled() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <Button variant="secondary" fullWidth>Continue with Google</Button>
      <Separator label="or" />
      <Button fullWidth>Continue with email</Button>
    </div>
  );
}

export function SeparatorVertical() {
  return (
    <div className="cs-ui" style={{ display: 'flex', alignItems: 'center', gap: 12, height: 24 }}>
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>API reference</span>
      <Separator orientation="vertical" />
      <span>Changelog</span>
    </div>
  );
}
