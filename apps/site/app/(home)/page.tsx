import Link from 'next/link';
import { Button } from '@cyberskill/design';
import { HomeShowcase } from '@/components/home-showcase';

const SECTIONS = [
  { href: '/docs/foundations/color', title: 'Foundations', body: 'Ink & Gold color, Manrope and Be Vietnam Pro type, spacing, radius, shadows and motion, as tokens.' },
  { href: '/docs/components', title: 'Components', body: 'Accessible React components on Base UI. Keyboard, focus and screen readers work out of the box.' },
  { href: '/docs/patterns', title: 'Patterns', body: 'Dashboards, AI assistant, command palette, data tables and pricing, composed from the components.' },
];

export default function HomePage() {
  return (
    <main className="home">
      <section className="home-hero">
        <p className="cs-overline">CyberSkill Design System · 3.0</p>
        <h1 className="home-title">One system for every CyberSkill product</h1>
        <p className="home-lede">Tokens, components and patterns in Ink & Gold. Checked for contrast and color-blind safety on every build, in light and dark.</p>
        <div className="home-actions">
          <Button size="lg" render={<Link href="/docs/get-started" />} nativeButton={false}>Get started</Button>
          <Button size="lg" variant="secondary" render={<Link href="/docs/components" />} nativeButton={false}>Browse components</Button>
        </div>
        <pre className="home-install"><code>npm install @cyberskill/design</code></pre>
      </section>
      <HomeShowcase />
      <section className="home-sections">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="home-card">
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
