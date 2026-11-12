'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

// next-themes writes both the `dark` class (Fumadocs' own styles) and data-theme (our tokens).
export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} theme={{ attribute: ['class', 'data-theme'], defaultTheme: 'system', enableSystem: true }}>
      {children}
    </RootProvider>
  );
}
