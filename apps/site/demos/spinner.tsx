'use client';
import { Spinner } from '@cyberskill/design';

export function SpinnerSizes() {
  return (
    <>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </>
  );
}

export function SpinnerInline() {
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, color: 'var(--muted)', font: '400 14px/20px var(--font-sans)' }}>
      <Spinner size="sm" label="Checking DNS records" />
      <span aria-hidden="true">Checking DNS records…</span>
    </p>
  );
}
