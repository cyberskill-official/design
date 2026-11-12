import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="site-brand">
          <Logo size={26} />
          <span>
            CyberSkill <span className="site-brand-sub">Design</span>
          </span>
        </span>
      ),
    },
    links: [
      { text: 'Get started', url: '/docs/get-started' },
      { text: 'Foundations', url: '/docs/foundations/color' },
      { text: 'Components', url: '/docs/components' },
      { text: 'Patterns', url: '/docs/patterns' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
