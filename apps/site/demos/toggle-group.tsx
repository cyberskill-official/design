'use client';
import { TextAlignCenter, TextAlignLeft, TextAlignRight, TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@cyberskill/design';
import { useState } from 'react';

export function ToggleGroupFormatting() {
  return (
    <ToggleGroup label="Text formatting" multiple defaultValue={['bold']}>
      <ToggleGroupItem value="bold" icon={<TextB />} label="Bold" />
      <ToggleGroupItem value="italic" icon={<TextItalic />} label="Italic" />
      <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Underline" />
    </ToggleGroup>
  );
}

export function ToggleGroupAlignment() {
  const [align, setAlign] = useState(['left']);
  return (
    <ToggleGroup label="Text alignment" value={align} onValueChange={(v) => v.length && setAlign(v)}>
      <ToggleGroupItem value="left" icon={<TextAlignLeft />} label="Align left" />
      <ToggleGroupItem value="center" icon={<TextAlignCenter />} label="Align center" />
      <ToggleGroupItem value="right" icon={<TextAlignRight />} label="Align right" />
    </ToggleGroup>
  );
}

export function ToggleGroupFilters() {
  const [status, setStatus] = useState(['active', 'paused']);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ToggleGroup label="Status" multiple size="sm" value={status} onValueChange={setStatus}>
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
        <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
        <ToggleGroupItem value="archived" disabled>Archived</ToggleGroupItem>
      </ToggleGroup>
      <p className="cs-caption">Showing: {status.join(', ') || 'nothing'}</p>
    </div>
  );
}

export function ToggleGroupVietnamese() {
  return (
    <ToggleGroup label="Định dạng chữ" multiple>
      <ToggleGroupItem value="bold" icon={<TextB />} label="In đậm" />
      <ToggleGroupItem value="italic" icon={<TextItalic />} label="In nghiêng" />
      <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Gạch chân" />
    </ToggleGroup>
  );
}
