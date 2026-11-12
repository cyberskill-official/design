'use client';
import { ArrowRight, BookOpen, ChartBar, ChatsCircle, Code, Lightning, List, Plug, Robot, ShieldCheck, Translate } from '@phosphor-icons/react';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  IconButton,
  Link,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkCard,
  NavigationMenuTrigger,
  Separator,
} from '@cyberskill/design';

const mobileLinks = [
  { href: '#agents', label: 'Agents' },
  { href: '#inbox', label: 'Inbox' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#docs', label: 'Documentation' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#customers', label: 'Customers' },
];

const features = [
  { icon: <Lightning />, title: 'Answers in seconds', text: 'Agents reply around the clock in your tone, from your help center, docs and past tickets.' },
  { icon: <ChatsCircle />, title: 'Hands off cleanly', text: 'When a question needs a person, the full conversation lands in your helpdesk with a summary.' },
  { icon: <Translate />, title: '40+ languages', text: 'Customers write in their language and get an answer in it, with no extra setup.' },
  { icon: <ShieldCheck />, title: 'Safe by default', text: 'Answers cite their sources, and agents never invent refunds, prices or policies.' },
];

const footer = [
  { title: 'Product', links: ['Agents', 'Inbox', 'Analytics', 'Integrations', 'Pricing'] },
  { title: 'Developers', links: ['Documentation', 'API reference', 'SDKs', 'Status'] },
  { title: 'Company', links: ['About', 'Customers', 'Careers', 'Contact'] },
  { title: 'Legal', links: ['Terms', 'Privacy', 'Security', 'DPA'] },
];

export function MarketingSitePattern() {
  return (
    <div className="pt-app">
      <header className="pt-site-header">
        <a href="#home" className="pt-shell-brand" style={{ padding: 0, color: 'inherit', textDecoration: 'none' }}>Northwind</a>

        <NavigationMenu aria-label="Main" className="pt-nav-desktop">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLinkCard href="#agents" icon={<Robot />} title="Agents" description="Build, train and publish support agents." />
              <NavigationMenuLinkCard href="#inbox" icon={<ChatsCircle />} title="Inbox" description="Hand conversations over to your team." />
              <NavigationMenuLinkCard href="#analytics" icon={<ChartBar />} title="Analytics" description="See what customers ask and where agents fail." />
              <NavigationMenuLinkCard href="#integrations" icon={<Plug />} title="Integrations" description="Zendesk, Intercom, Slack and WhatsApp." />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
            <NavigationMenuContent columns={1}>
              <NavigationMenuLinkCard href="#docs" icon={<BookOpen />} title="Documentation" description="Guides and API reference." />
              <NavigationMenuLinkCard href="#sdk" icon={<Code />} title="SDKs" description="TypeScript and Python clients." />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#pricing">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#customers">Customers</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>

        <span className="pt-spacer" />
        <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#signin" />} className="pt-nav-desktop">Sign in</Button>
        <Button size="sm" nativeButton={false} render={<a href="#signup" />}>Start free</Button>

        {/* Narrow screens: the same links in a left drawer */}
        <Drawer side="left">
          <DrawerTrigger render={<IconButton label="Open menu" icon={<List />} variant="ghost" className="pt-nav-mobile" />} />
          <DrawerContent title="Menu" size="sm">
            <nav aria-label="Main" style={{ display: 'grid', gap: 4 }}>
              {mobileLinks.map((link) => (
                <Button key={link.href} variant="ghost" fullWidth nativeButton={false} render={<a href={link.href} />} style={{ justifyContent: 'flex-start' }}>
                  {link.label}
                </Button>
              ))}
              <Separator />
              <Button variant="secondary" fullWidth nativeButton={false} render={<a href="#signin" />}>Sign in</Button>
            </nav>
          </DrawerContent>
        </Drawer>
      </header>

      <main>
        <section className="pt-hero" aria-labelledby="hero-title">
          <span className="cs-overline">AI support agents</span>
          <h2 id="hero-title" className="pt-hero-title">Resolve half your tickets before anyone opens them</h2>
          <p className="pt-hero-lede">
            Northwind agents learn from your help center and past conversations, answer customers on every channel,
            and hand the hard ones to your team with the context already written up.
          </p>
          <div className="pt-row" style={{ gap: 12 }}>
            <Button size="lg" iconEnd={<ArrowRight />} nativeButton={false} render={<a href="#signup" />}>Start free</Button>
            <Button size="lg" variant="secondary" nativeButton={false} render={<a href="#demo" />}>Book a demo</Button>
          </div>
          <p className="pt-muted" style={{ margin: 0, fontSize: 13 }}>
            Free for 500 messages a month · No credit card · Used by 2,400 support teams
          </p>
        </section>

        <section className="pt-features-grid" aria-label="Features">
          {features.map((f) => (
            <Card key={f.title}>
              <span className="pt-icon-tile" aria-hidden>{f.icon}</span>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      <footer className="pt-footer">
        {footer.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l}><Link href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} tone="muted">{l}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <p className="pt-muted" style={{ margin: 0, fontSize: 13, gridColumn: '1 / -1' }}>© 2026 Northwind Labs. Sample content for this pattern.</p>
      </footer>
    </div>
  );
}
