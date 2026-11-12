import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import './global.css';

export const metadata: Metadata = {
  title: { default: 'CyberSkill Design System', template: '%s · CyberSkill Design System' },
  description: 'Tokens, accessible React components and patterns for CyberSkill products.',
  metadataBase: new URL('https://design.cyberskill.world'),
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: 'CyberSkill Design System', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'CyberSkill Design System' }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
