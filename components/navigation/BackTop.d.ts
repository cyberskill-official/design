/** Scroll-to-top button; renders after `threshold` px of scroll. Bilingual aria. Respects the live reduced-motion preference. */
export interface BackTopProps {
  /** Show after this many px. Default 320. */
  threshold?: number;
  label?: string;
  lang?: string;
  className?: string;
}
export function BackTop(props: BackTopProps): React.ReactElement;
