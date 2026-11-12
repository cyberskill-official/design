import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpen, ChartBar, ChatsCircle, Code, Plug, Robot } from '@phosphor-icons/react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuLinkCard, NavigationMenuTrigger } from './NavigationMenu';

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  args: { 'aria-label': 'Main' },
  render: args => (
    <NavigationMenu {...args}>
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
  ),
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MegaMenu: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Product' }));
    const card = await screen.findByRole('link', { name: /Agents/ });
    await waitFor(() => expect(getComputedStyle(card.closest('.cs-navigation-menu-popup')!).opacity).toBe('1'));
    await expect(card).toHaveAttribute('aria-current', 'page');
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Developers' }));
    await screen.findByRole('link', { name: /Documentation/ });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('link', { name: /Documentation/ })).toBeNull());
  },
};
