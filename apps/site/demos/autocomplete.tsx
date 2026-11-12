'use client';
import { Autocomplete, Field } from '@cyberskill/design';
import { useState } from 'react';

const cities = ['Hà Nội', 'Hải Phòng', 'Huế', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh', 'Cần Thơ'];

const workspace = [
  { label: 'Pages', items: [{ value: 'billing', label: 'Billing', description: 'Settings › Billing' }, { value: 'members', label: 'Members', description: 'Settings › Team' }] },
  { label: 'People', items: ['Linh Nguyen', 'Minh Tran', 'An Pham'] },
];

export function AutocompleteSearch() {
  const [query, setQuery] = useState('');
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 380 }}>
      <Autocomplete aria-label="Search cities" items={cities} placeholder="Search cities" value={query} onValueChange={setQuery} />
      <p style={{ margin: 0, fontSize: 13 }}>Query: <code>{JSON.stringify(query)}</code></p>
    </div>
  );
}

export function AutocompleteGrouped() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Autocomplete aria-label="Search workspace" items={workspace} placeholder="Search pages and people" />
    </div>
  );
}

export function AutocompleteInField() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 380 }}>
      <Field label="City" description="Free text is fine if your city is not listed.">
        <Autocomplete items={cities} icon={null} placeholder="e.g. Đà Lạt" emptyText={null} />
      </Field>
      <Autocomplete aria-label="Search" items={cities} size="sm" placeholder="Small, no highlight" highlightMatches={false} />
    </div>
  );
}
