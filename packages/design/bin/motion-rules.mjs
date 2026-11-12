// The one set of motion rules, shared by the CSS lint (scripts/check-css.mjs), the benchmark (D24) and
// `npx @cyberskill/design check`. It lives in bin/ because bin/ ships with the package, so apps run the same rules.
// Why: reduced motion is handled once, by redefining the --motion-* recipes in tokens.css. Motion that skips the
// recipes (raw times, raw curves, duration or ease tokens) or animates every property keeps running for readers who
// asked for less.

/** A function from a character index in `text` to its 1-based line. */
export function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  return i => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= i) lo = mid; else hi = mid - 1; } return lo + 1; };
}

/** Every rule of a stylesheet, nested ones and those inside @media included: `chain` holds the enclosing preludes. */
export function cssRules(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const lineOf = lineIndex(text);
  const rules = [], stack = [];
  let start = 0, depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') depth++; else if (ch === ')') depth = Math.max(0, depth - 1);
    if ((ch !== '{' && ch !== '}' && ch !== ';') || (ch === ';' && depth)) continue; // `;` inside url(data:…) is not an end
    const seg = text.slice(start, i), own = seg.trim(), line = lineOf(start + seg.search(/\S|$/));
    if (ch === '{') { const r = { chain: [...stack.map(s => s.own), own], own, line, decls: [] }; r.selector = r.chain.join(' '); rules.push(r); stack.push(r); }
    else if (stack.length && own) {
      const apply = /^@apply\s/.test(own), k = own.indexOf(':');
      if (apply) stack.at(-1).decls.push({ prop: '@apply', value: own.slice(7).trim(), line });
      else if (k > 0) stack.at(-1).decls.push({ prop: own.slice(0, k).trim(), value: own.slice(k + 1).trim(), line });
    }
    if (ch === '}') stack.pop();
    start = i + 1;
  }
  return rules;
}

/** `@media (prefers-reduced-motion: reduce)` exactly: not negated, not mixed with another condition. */
export const REDUCED_MEDIA = /^@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)$/;

// Size and position may animate only on recipes that end at once under reduced motion: move (an indicator following its
// target), pop-in (a panel opening), and press / release (a switch thumb stretching while held).
export const SIZE_RECIPES = ['move', 'pop-in', 'press', 'release'];
// state and fade are kept under reduced motion (color and opacity, 200ms or less), so nothing that moves may ride them
export const KEPT_RECIPES = ['state', 'fade'];
const TRANSFORMS = /^(transform|translate|scale|rotate)$/;
const SIZES = /^((min-|max-)?(width|height|block-size|inline-size)|top|right|bottom|left|inset(-[\w-]+)?|margin(-[\w-]+)?|padding(-[\w-]+)?)$/;
// the one exception: a gesture scaling a duration by a runtime value (a hard flick closes a drawer faster)
const GESTURE = /^calc\(\s*var\(--(?!duration-|ease-|spring-|motion-)[\w-]+(\s*,[^()]*)?\)\s*\*\s*var\(--duration-[\w-]+\)\s*\)$/;
const RAW = [
  [/var\(--(duration|ease|spring)-[\w-]*\)/, m => `uses ${m[0]} directly; use a --motion-* recipe, which pairs a time with a curve and handles reduced motion`],
  [/(?<![\w.-])(?=\d*\.?\d*[1-9])\d*\.?\d+m?s(?![\w-])/, m => `has a raw time (${m[0]}); use a --motion-* recipe`], // 0s and 0ms are fine
  [/(cubic-bezier|linear|steps)\(/, m => `has a raw curve ${m[1]}(…); use a --motion-* recipe`],
  [/(?<![\w-])(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)(?![\w-])/, m => `has a raw curve (${m[1]}); use a --motion-* recipe`],
];
const rawIssue = v => { for (const [re, say] of RAW) { const m = re.exec(v); if (m) return say(m); } return null; };
const splitTop = v => { const out = []; let d = 0, cur = ''; for (const ch of v) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { out.push(cur.trim()); cur = ''; } else cur += ch; } return [...out, cur.trim()].filter(Boolean); };
const ALL = /(?<![\w-])all(?![\w-])/;
const EXAMPLE = '(transition: opacity var(--motion-fade), transform var(--motion-pop-in))';

/** Motion declarations this module judges: transition and animation, their longhands, with or without a vendor prefix. */
export const isMotionProp = prop => /^(-(webkit|moz|o)-)?(transition|animation)(-[a-z-]+)?$/.test(prop);

/**
 * What is wrong with one motion declaration, as messages (empty when it is fine).
 * `ruleDecls` are the declarations of the same rule, so an infinite loading loop is recognised only from its own rule.
 */
export function motionProblems(prop, value, ruleDecls = []) {
  const base = prop.replace(/^-(webkit|moz|o)-/, ''), v = value.trim();
  if (!isMotionProp(prop) || /^(none|initial|inherit|unset|revert)$/.test(v)) return [];
  if (base === 'transition') {
    const out = [];
    const items = splitTop(v);
    if (items.some(i => ALL.test(i.split(/\s+/)[0]))) out.push(`${prop}: all; list each property with its recipe ${EXAMPLE}`);
    for (const item of items) {
      const raw = rawIssue(item);
      if (raw) { out.push(`${prop} ${raw}`); continue; }
      if (/^var\(--motion-[\w-]+\)$/.test(item)) { out.push(`${prop}: ${item} names no property, which means all; name each one ${EXAMPLE}`); continue; }
      const m = /^([a-z-]+)\s+var\(--motion-([\w-]+)\)$/.exec(item);
      if (!m) { if (!ALL.test(item)) out.push(`${prop} has '${item}', which is not one property on a recipe; use <property> var(--motion-…)`); continue; }
      const [, name, recipe] = m;
      if (TRANSFORMS.test(name) && KEPT_RECIPES.includes(recipe)) out.push(`${name} animates with var(--motion-${recipe}), a color and opacity recipe that keeps running under reduced motion; use the recipe for that movement (var(--motion-move), var(--motion-pop-in), var(--motion-press)…)`);
      if (SIZES.test(name) && !SIZE_RECIPES.includes(recipe)) out.push(`${name} animates with var(--motion-${recipe}); size and position animate only on ${SIZE_RECIPES.map(r => `var(--motion-${r})`).join(', ')}, which end at once under reduced motion`);
    }
    return [...new Set(out)];
  }
  if (base === 'transition-property') return ALL.test(v) ? [`${prop}: all; list each property with its recipe ${EXAMPLE}`] : [];
  if (base.startsWith('transition-')) {
    if (base === 'transition-duration' && GESTURE.test(v)) return [];
    const raw = rawIssue(v);
    if (raw) return [`${prop} ${raw}`];
    const other = v.replace(/var\(--motion-[\w-]+\)/g, '').split(/[\s,]+/).find(t => t && !/^[a-z][a-z-]*$/.test(t) && !/^0+(\.0+)?(m?s)?$/.test(t));
    return other ? [`${prop} has '${other}', which is not a recipe; use var(--motion-…), property names, none or 0s`] : [];
  }
  // animation: a loading loop (infinite in this declaration, or an infinite iteration count in this rule) keeps its timing
  const infinite = d => /(?<![\w-])infinite(?![\w-])/.test(d.value) && /^(-(webkit|moz|o)-)?animation(-iteration-count)?$/.test(d.prop);
  if (infinite({ prop, value: v }) || ruleDecls.some(infinite)) return [];
  const raw = rawIssue(v);
  const loop = 'only an infinite loading loop may use raw timing, so give it a recipe (animation: cs-name var(--motion-reveal))';
  if (base === 'animation') return raw ? [`${prop} ${raw}; ${loop}`] : /var\(--motion-/.test(v) ? [] : [`${prop} has no --motion-* recipe; give it one (animation: cs-name var(--motion-reveal)), or make it an infinite loading loop`];
  return raw && /^animation-(duration|timing-function|delay)$/.test(base) ? [`${prop} ${raw}; ${loop}`] : [];
}

/** Every motion problem in a stylesheet, with the line its declaration starts on. */
export function stylesheetMotionProblems(css) {
  return cssRules(css).flatMap(r => r.decls.flatMap(d => motionProblems(d.prop, d.value, r.decls).map(message => ({ line: d.line, message }))));
}
