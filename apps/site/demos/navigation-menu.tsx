'use client';
import { BookOpen, ChartBar, ChatsCircle, Code, List, Plug, Robot } from '@phosphor-icons/react';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  IconButton,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkCard,
  NavigationMenuTrigger,
} from '@cyberskill/design';

export function HeaderNavigation() {
  return (
    <NavigationMenu aria-label="Main">
      <NavigationMenuItem>
        <NavigationMenuTrigger>Product</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLinkCard href="#agents" icon={<Robot />} title="Agents" description="Build, train and publish support agents." active />
          <NavigationMenuLinkCard href="#inbox" icon={<ChatsCircle />} title="Inbox" description="Hand conversations over to your team." />
          <NavigationMenuLinkCard href="#analytics" icon={<ChartBar />} title="Analytics" description="See what customers ask and where agents fail." />
          <NavigationMenuLinkCard href="#integrations" icon={<Plug />} title="Integrations" description="Zalo, Messenger, Slack and your helpdesk." />
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
        <NavigationMenuLink href="#pricing" active>Pricing</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#customers">Customers</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}

const mobileLinks = [
  { href: '#agents', label: 'Agents', current: true },
  { href: '#inbox', label: 'Inbox' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#docs', label: 'Documentation' },
  { href: '#pricing', label: 'Pricing' },
];

/** Below 768px: the same links in a left drawer behind a menu button. */
export function MobileNavigation() {
  return (
    <Drawer side="left">
      <DrawerTrigger render={<IconButton label="Open menu" icon={<List />} />} />
      <DrawerContent title="Menu" size="sm">
        <nav aria-label="Main" style={{ display: 'grid', gap: 4 }}>
          {mobileLinks.map((link) => (
            <Button
              key={link.href}
              variant={link.current ? 'quiet' : 'ghost'}
              fullWidth
              nativeButton={false}
              render={<a href={link.href} aria-current={link.current ? 'page' : undefined} />}
              style={{ justifyContent: 'flex-start' }}
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
