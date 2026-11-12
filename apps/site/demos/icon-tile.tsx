'use client';
import { ChartLineUp, CurrencyDollar, Lightning, ShieldCheck, Sparkle, UsersThree, Warning } from '@phosphor-icons/react';
import { IconTile, type Tone } from '@cyberskill/design';

const tones: Tone[] = ['primary', 'accent', 'success', 'warning', 'danger', 'info', 'blue', 'amber', 'teal', 'magenta', 'violet'];

export function IconTileTones() {
  return (
    <>
      {tones.map((tone) => (
        <IconTile key={tone} tone={tone}><Lightning /></IconTile>
      ))}
    </>
  );
}

export function IconTileSizes() {
  return (
    <>
      <IconTile size="sm" tone="blue"><ChartLineUp /></IconTile>
      <IconTile size="md" tone="blue"><ChartLineUp /></IconTile>
      <IconTile size="lg" tone="blue"><ChartLineUp /></IconTile>
    </>
  );
}

export function IconTileInList() {
  const rows = [
    { icon: <CurrencyDollar />, tone: 'accent', title: 'Billing', text: 'Plans, invoices and payment methods.' },
    { icon: <UsersThree />, tone: 'teal', title: 'Members', text: '42 people in 6 teams.' },
    { icon: <ShieldCheck />, tone: 'success', title: 'Security', text: 'SSO is on for every workspace.', label: 'Verified' },
    { icon: <Warning />, tone: 'warning', title: 'Usage', text: '86% of this month\'s API calls used.', label: 'Needs attention' },
    { icon: <Sparkle />, tone: 'violet', title: 'AI assistant', text: 'Drafts replies from your help center.' },
  ] as const;
  return (
    <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 420 }}>
      {rows.map((row) => (
        <li key={row.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile tone={row.tone} aria-label={'label' in row ? row.label : undefined}>{row.icon}</IconTile>
          <div>
            <div style={{ fontWeight: 600 }}>{row.title}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{row.text}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
