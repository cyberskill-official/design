'use client';
import { Combobox, ComboboxField, type ComboboxItem } from '@cyberskill/design';
import { useRef, useState } from 'react';

const regions: ComboboxItem[] = [
  { value: 'sgn', label: 'Ho Chi Minh City', description: 'ap-southeast-1' },
  { value: 'han', label: 'Hanoi', description: 'ap-southeast-2' },
  { value: 'dad', label: 'Da Nang', description: 'ap-southeast-3' },
  { value: 'sin', label: 'Singapore', description: 'ap-southeast-4' },
  { value: 'tyo', label: 'Tokyo', description: 'Coming soon', disabled: true },
];

const people: ComboboxItem[] = ['Linh Nguyen', 'Minh Tran', 'An Pham', 'Bao Le', 'Chi Vo', 'Duc Hoang'].map((name) => ({ value: name.toLowerCase().replace(' ', '-'), label: name }));

export function ComboboxStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 380 }}>
      <ComboboxField label="Region" items={regions} placeholder="Search regions" description="Where your data is stored." />
      <ComboboxField label="Backup region" items={regions} defaultValue="sgn" error="Choose a different region from the primary." />
      <ComboboxField label="Locked" items={regions} defaultValue="han" disabled />
    </div>
  );
}

export function ComboboxSizes() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 380 }}>
      <Combobox aria-label="Region" items={regions} size="sm" placeholder="Small" />
      <Combobox aria-label="Region" items={regions} placeholder="Medium" />
      <Combobox aria-label="Region" items={regions} size="lg" placeholder="Large" />
    </div>
  );
}

export function ComboboxControlled() {
  const [region, setRegion] = useState<string | null>('han');
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 380 }}>
      <ComboboxField label="Region" items={regions} value={region} onValueChange={setRegion} emptyText="Không tìm thấy khu vực" />
      <p style={{ margin: 0, fontSize: 13 }}>Value: <code>{String(region)}</code></p>
    </div>
  );
}

export function ComboboxAsync() {
  const [items, setItems] = useState<ComboboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <ComboboxField
        label="Assignee"
        placeholder="Type a name"
        items={items}
        loading={loading}
        loadingText="Searching…"
        filter={null}
        onInputValueChange={(query, { reason }) => {
          if (reason === 'item-press') return;
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            setItems(people.filter((p) => p.label.toLowerCase().includes(query.trim().toLowerCase())));
            setLoading(false);
          }, 400);
        }}
      />
    </div>
  );
}
