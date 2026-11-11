'use client';
import { SearchField } from '@cyberskill/design';
import { useEffect, useState } from 'react';

const agents = ['Support Copilot', 'Sales Assistant', 'Onboarding Guide', 'Billing Helper', 'Hà Nội Front Desk'];
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function SearchFieldFilter() {
  const [query, setQuery] = useState('');
  const shown = agents.filter((a) => fold(a).includes(fold(query.trim())));
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <SearchField label="Search agents" placeholder="Name or ID" value={query} onValueChange={setQuery} />
      <p className="cs-caption" aria-live="polite">{shown.length} of {agents.length} agents: {shown.join(', ') || 'none'}</p>
    </div>
  );
}

export function SearchFieldLoading() {
  const [query, setQuery] = useState('invoice');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(id);
  }, [query]);
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <SearchField label="Search documents" value={query} onValueChange={setQuery} loading={loading} description="Results update as you type." />
    </div>
  );
}

export function SearchFieldShortcut() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <SearchField label="Search" hideLabel placeholder="Search…" shortcut="⌘K" />
      <SearchField label="Search" hideLabel placeholder="Search…" shortcut="/" size="sm" />
    </div>
  );
}

export function SearchFieldVietnamese() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <SearchField label="Tìm kiếm" placeholder="Tên hoặc mã" defaultValue="hà nội" clearLabel="Xoá tìm kiếm" loadingLabel="Đang tải" />
    </div>
  );
}
