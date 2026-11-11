import { EmptyState, Link } from '@cyberskill/design';
import { MagnifyingGlass } from '@phosphor-icons/react/ssr';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export const metadata = { title: 'Page not found' };

// Inside the site's header layout, so a lost reader still has the nav and search.
export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="not-found">
        <EmptyState
          size="lg"
          headingLevel={1}
          icon={<MagnifyingGlass />}
          title="Page not found"
          description="This page doesn't exist or has moved. Components, patterns and foundations are all one search away."
          action={<Link href="/docs/">Browse the design system</Link>}
        />
        <p className="not-found-legacy">
          Looking for the 2.x (Umber &amp; Ochre) docs or Storybook? They stay on the{' '}
          <Link href="https://github.com/cyberskill-official/design/tree/legacy">legacy branch</Link>. Moving an app over:{' '}
          <Link href="/docs/migration/">Migrating from&nbsp;2.x</Link>.
        </p>
      </main>
    </HomeLayout>
  );
}
