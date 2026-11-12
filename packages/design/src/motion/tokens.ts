// The motion tokens as Motion transition objects, read from the same JSON the CSS recipes are built from.
// Pure data, no React and no Motion import: Server Components can use it.
import foundations from '../../tokens/foundations.json';

export type SpringName = 'smooth' | 'snappy' | 'bouncy';
export type RecipeName = 'state' | 'fade' | 'press' | 'release' | 'move' | 'popIn' | 'popOut' | 'modalIn' | 'modalOut' | 'sheetIn' | 'sheetOut' | 'reveal' | 'celebrate';
/** A physical spring for Motion's `transition` prop. */
export type SpringTransition = { type: 'spring'; stiffness: number; damping: number; mass: number };
/** A timed curve for Motion's `transition` prop: duration in seconds and a cubic Bézier. */
export type TweenTransition = { duration: number; ease: [number, number, number, number] };

const tokens = <T>(group: object) => Object.entries(group).filter(([k]) => !k.startsWith('$')) as [string, T][];
const seconds = (v: string) => parseFloat(v) / (v.endsWith('ms') ? 1000 : 1);
const bezier = (v: string) => v.match(/-?\d*\.?\d+/g)!.map(Number) as TweenTransition['ease'];
const camel = (k: string) => k.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
const { duration, ease } = foundations as unknown as Record<'duration' | 'ease', Record<string, string>>;

/** The token springs (Apple's duration and bounce) as stiffness and damping: `transition={springs.snappy}`. */
export const springs = Object.fromEntries(tokens<{ duration: number; bounce: number }>(foundations.spring).map(([name, { duration: d, bounce }]) => [
  name,
  { type: 'spring', stiffness: ((2 * Math.PI) / d) ** 2, damping: (4 * Math.PI * (1 - bounce)) / d, mass: 1 },
])) as Record<SpringName, SpringTransition>;

/** The CSS motion recipes (`--motion-pop-in` …) for Motion: `transition={transitions.popIn}`. */
export const transitions = Object.fromEntries(tokens<string | [string, string]>(foundations.motion).map(([name, v]) => [
  camel(name),
  typeof v === 'string' ? springs[v as SpringName] : { duration: seconds(duration[v[0]]!), ease: bezier(ease[v[1]]!) },
])) as Record<RecipeName, SpringTransition | TweenTransition>;
