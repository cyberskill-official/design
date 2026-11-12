'use client';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// One lazily loaded component per demo export. Loaded from this client module (not from the MDX page, a Server
// Component), so Next gives each demo file its own chunk and a page fetches only the ones it renders.
const cache = new Map<string, ComponentType<Record<string, unknown>>>();

export function LazyDemo({ file, name, ...props }: { file: string; name: string } & Record<string, unknown>) {
  const key = `${file}:${name}`;
  let Demo = cache.get(key);
  if (!Demo) {
    Demo = dynamic(() => import(`../demos/${file}.tsx`).then(m => m[name] as ComponentType<Record<string, unknown>>));
    cache.set(key, Demo);
  }
  return <Demo {...props} />;
}
