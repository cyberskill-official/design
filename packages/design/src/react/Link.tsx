import { useRender } from '@base-ui/react/use-render';
import { ArrowUpRight } from '@phosphor-icons/react';
import { cx } from '../utils/cx';

export type LinkProps = useRender.ComponentProps<'a'> & {
  /** `default` ink, `muted` for secondary links (footers, meta lines). */
  tone?: 'default' | 'muted';
  /** Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"`, an icon and screen-reader text. */
  external?: boolean;
  /** Screen-reader text for external links. Pass a Vietnamese string in Vietnamese UIs. */
  externalLabel?: string;
};

/** Underlined text link. Use `render={<NextLink href="…" />}` for client-side routing. Use a Button for actions. */
export function Link({ tone = 'default', external, externalLabel = '(opens in new tab)', render, className, children, ...props }: LinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
      ...props,
      'data-tone': tone,
      className: cx('cs-link', className),
      children: (
        <>
          {children}
          {external && (
            <>
              <ArrowUpRight className="cs-link-icon" aria-hidden="true" />
              <span className="cs-visually-hidden"> {externalLabel}</span>
            </>
          )}
        </>
      ),
    },
  });
}
