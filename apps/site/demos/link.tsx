'use client';
import NextLink from 'next/link';
import { Link } from '@cyberskill/design';

export function LinkInText() {
  return (
    <p style={{ margin: 0, maxWidth: 480, font: '400 15px/24px var(--font-sans)' }}>
      Connect your workspace, then follow the <Link href="#setup">setup guide</Link>. Questions? Check the{' '}
      <Link href="https://example.com" external>status page</Link> or read the <Link href="#terms" tone="muted">terms</Link>.
    </p>
  );
}

export function LinkRouter() {
  return <Link render={<NextLink href="/docs/components/button" />}>Button docs</Link>;
}
