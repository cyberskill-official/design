import Link from 'next/link';
import { ChartBar, Code, Cube, Globe, Keyboard, Moon, Palette, Robot, SquaresFour } from '@phosphor-icons/react/ssr';
import { Button, IconTile } from '@cyberskill/design';
import { HomeShowcase } from '@/components/home-showcase';

const FEATURES = [
  { href: '/docs/foundations/color', icon: <Palette />, tone: 'accent', title: 'Foundations', body: 'Color, type, spacing, motion and icons as tokens, so every screen draws from the same values.' },
  { href: '/docs/components', icon: <Cube />, tone: 'blue', title: 'Components', body: '70 React components, from buttons and forms to overlays, navigation and feedback.' },
  { href: '/docs/patterns', icon: <SquaresFour />, tone: 'violet', title: 'Patterns', body: 'Dashboards, sign-in, onboarding, settings and pricing, composed from the components.' },
  { href: '/docs#principles', icon: <Keyboard />, tone: 'teal', title: 'Accessible by default', body: 'Keyboard, focus and screen readers work out of the box, and every component is tested on each build.' },
  { href: '/docs/components/theme-scope', icon: <Moon />, tone: 'primary', title: 'Light and dark', body: 'Both themes are built into every token and component. Switch the whole app or one part of a page.' },
  { href: '/docs/components/data-table', icon: <ChartBar />, tone: 'magenta', title: 'Data and forms', body: 'Charts, data tables, date pickers and form helpers, added only when a product needs them.' },
  { href: '/docs/foundations/typography', icon: <Globe />, tone: 'amber', title: 'Vietnamese ready', body: 'Self-hosted typefaces with full Vietnamese support, checked in every component.' },
  { href: '/docs/get-started', icon: <Code />, tone: 'blue', title: 'Works in any stack', body: 'Plain CSS underneath: Next.js, Tailwind, Server Components or a plain HTML page.' },
  { href: '/docs/ai-tools', icon: <Robot />, tone: 'accent', title: 'Built for AI tools', body: 'The package ships its own guide, so Claude Code, Cursor and other agents use the system correctly.' },
] as const;

export default function HomePage() {
  return (
    <main className="home">
      <section className="home-hero">
        <p className="cs-overline">CyberSkill Design System</p>
        <h1 className="home-title">One system for every CyberSkill product</h1>
        <p className="home-lede">Tokens, components and patterns in one npm package. Accessible, themed for light and dark, and ready for any stack.</p>
        <div className="home-actions">
          <Button size="lg" render={<Link href="/docs/get-started" />} nativeButton={false}>Get started</Button>
          <Button size="lg" variant="secondary" render={<Link href="/docs/components" />} nativeButton={false}>Browse components</Button>
        </div>
        <pre className="home-install"><code>npm install @cyberskill/design</code></pre>
      </section>
      <HomeShowcase />
      <section className="fd-home" aria-labelledby="home-features">
        <div className="fd-home-head">
          <div>
            <h2 id="home-features">Everything a product team needs</h2>
            <p>From the first token to a finished screen, with the same quality bar at every level.</p>
          </div>
        </div>
        <div className="home-sections">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} className="home-card">
              <IconTile tone={f.tone}>{f.icon}</IconTile>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
