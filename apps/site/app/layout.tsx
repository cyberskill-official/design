import type { Metadata } from 'next';
import { Be_Vietnam_Pro, JetBrains_Mono, Manrope } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

const display = Manrope({ subsets: ['latin', 'vietnamese'], weight: ['600', '700', '800'], variable: '--font-site-display' });
const sans = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-site-sans' });
const mono = JetBrains_Mono({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600'], variable: '--font-site-mono' });

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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
