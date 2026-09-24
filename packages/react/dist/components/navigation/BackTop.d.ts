/** Scroll-to-top button; renders after `threshold` px of scroll. Bilingual aria. */
export interface BackTopProps {
  /** Show after this many px. Default 320. */
  threshold?: number;
  label?: string;
  lang?: string;
  className?: string;
}
export const BackTop: React.ForwardRefExoticComponent<
  BackTopProps & React.RefAttributes<HTMLElement>
>;
