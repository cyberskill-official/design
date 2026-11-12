'use client';
import { PasswordField } from '@cyberskill/design';

export function PasswordFieldStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <PasswordField label="Password" name="password" />
      <PasswordField label="New password" name="new-password" autoComplete="new-password" description="At least 12 characters. A short sentence works well." />
      <PasswordField label="Confirm password" defaultValue="short" error="Use at least 12 characters." />
      <PasswordField label="Password" defaultValue="secret" disabled />
    </div>
  );
}

export function PasswordFieldSizes() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <PasswordField label="Small" size="sm" defaultValue="correct horse" />
      <PasswordField label="Medium" defaultValue="correct horse" />
      <PasswordField label="Large" size="lg" defaultValue="correct horse" defaultVisible />
    </div>
  );
}

export function PasswordFieldVietnamese() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <PasswordField label="Mật khẩu" showPasswordLabel="Hiện mật khẩu" hidePasswordLabel="Ẩn mật khẩu" description="Ít nhất 12 ký tự." />
    </div>
  );
}
