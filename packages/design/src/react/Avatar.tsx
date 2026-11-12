import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { Children, cloneElement, isValidElement, type ComponentProps, type ReactElement } from 'react';
import type { CategoryTone } from './tone';
import { cx } from '../utils/cx';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarProps = Omit<BaseAvatar.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Person or team name. Becomes the accessible name and the initials. */
  name: string;
  /** Photo URL. Initials show until it loads, and if it fails. */
  src?: string;
  /** Override the initials taken from `name`. */
  initials?: string;
  /** `sm` 24px, `md` 32px (default), `lg` 40px. */
  size?: AvatarSize;
  /** Tint of the initials. Defaults to `primary` (ink). `toneFor(name)` gives each person a stable category tone. */
  tone?: CategoryTone | 'primary';
};

/** First letters of the first and last word: "Trần Thị Linh" → "TL". */
function toInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initial = (word = '') => [...word][0] ?? '';
  return (initial(words[0]) + (words.length > 1 ? initial(words.at(-1)) : '')).toUpperCase();
}

/** A person's photo with an initials fallback. Announced as an image named `name`; pass `aria-hidden` when the name is already shown beside it. */
export function Avatar({ name, src, initials, size = 'md', tone, className, ...props }: AvatarProps) {
  return (
    <BaseAvatar.Root {...props} role="img" aria-label={name} data-size={size} data-tone={tone} className={cx('cs-avatar', className)}>
      {src && <BaseAvatar.Image src={src} alt="" className="cs-avatar-image" />}
      <BaseAvatar.Fallback className="cs-avatar-fallback">{initials ?? toInitials(name)}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export type AvatarGroupProps = ComponentProps<'div'> & {
  /** Names the group for screen readers, e.g. "Project members". */
  label?: string;
  /** Show at most this many avatars, then a "+N" bubble. */
  max?: number;
  /** Size applied to every avatar in the group. */
  size?: AvatarSize;
  /** Accessible name of the "+N" bubble. Pass a Vietnamese string in Vietnamese UIs. */
  overflowLabel?: (count: number) => string;
};

/** Overlapping row of avatars with a "+N" overflow count. */
export function AvatarGroup({ label, max, size = 'md', overflowLabel = n => `${n} more`, className, children, ...props }: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const shown = max != null && items.length > max ? items.slice(0, max) : items;
  const hidden = items.length - shown.length;
  return (
    <div role="group" aria-label={label} {...props} data-size={size} className={cx('cs-avatar-group', className)}>
      {shown.map(item => cloneElement(item, { size }))}
      {hidden > 0 && (
        <span role="img" aria-label={overflowLabel(hidden)} data-size={size} data-overflow="" className="cs-avatar">
          +{hidden}
        </span>
      )}
    </div>
  );
}
