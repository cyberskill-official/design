import {assertThemePaletteFreshness} from './theme-palette-projection.mjs';
import {readFileSync} from 'node:fs';
import {readContrastMaps} from './contrast-maps.mjs';

// Preserve the authored literal palettes. This resolver is runtime composition;
// machine-readable exports continue to use the literal source declarations.
function declarations(block) {
  return Object.fromEntries([...block.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/(--cs-[\w-]+)\s*:\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
}
function palette(file, selector) {
  const css=readFileSync(file,'utf8');
  const start=css.indexOf(selector+' {');
  if(start<0)throw new Error(`Missing palette ${selector} in ${file}`);
  return declarations(css.slice(start+selector.length+2,css.indexOf('}',start)));
}
const channel=(mode,key)=>`--_cs-${mode}-${key.slice(5)}`;
// No stylesheet space between channels. A space survives as a second
// background-shorthand layer when the inactive channel substitutes nothing,
// and Chromium then keeps the previous used color across a theme toggle.
const choose=(key)=>`var(--_cs-light, var(${channel('light',key)}))var(--_cs-dark, var(${channel('dark',key)}))`;
const lines=map=>Object.entries(map).map(([k,v])=>`  ${k}: ${v};`).join('\n');
export function emitThemeResolver(root,packs,roleKeys) {
  assertThemePaletteFreshness(root);
  const light=palette(new URL('tokens/colors.css',root),':root');
  const dark={...light,...palette(new URL('tokens/colors.css',root),'[data-theme="dark"]')};
  // Include every theme-dependent component/elevation value, not only CTA colors.
  // Otherwise a light/system scope can inherit dark field borders or shadows.
  for (const file of ['tokens/component-tokens.css','tokens/elevation.css']) {
    const defaults=palette(new URL(file,root),':root');
    const overrides=palette(new URL(file,root),'[data-theme="dark"]');
    for (const [key,value] of Object.entries(overrides)) {
      if (defaults[key] === undefined) throw new Error(`Missing light default for ${key} in ${file}`);
      light[key]=defaults[key];
      dark[key]=value;
    }
  }
  const roles=packs.find(p=>p.el==='tho'&&!p.variant).light;
  for(const key of roleKeys){light[key]=roles[key];dark[key]=roles[key];}
  const channels=(l,d)=>Object.fromEntries(Object.keys(l).flatMap(k=>[[channel('light',k),l[k]],[channel('dark',k),d[k]]]));
  let css=`\n/* ---- Generated scope resolver ----
 * Private channels carry both palettes independently of the selected theme.
 * Empty/initial custom-property switches select one channel without JS or a
 * newer color-function requirement. Rebinding at each scope avoids stale
 * inherited public values. Unmarked descendants simply inherit.
 * The selector list matches the maximum existing element/variant specificity;
 * it supersedes legacy contextual declarations without !important.
 */\n:root {\n${lines(channels(light,dark))}\n  --_cs-standard: initial;\n  --_cs-high: ;\n}\n
:root, [data-theme="light"], [data-theme="system"] { --_cs-light: initial; --_cs-dark: ; }
[data-theme="dark"] { --_cs-light: ; --_cs-dark: initial; }
@media (prefers-color-scheme: dark) {
  [data-theme="system"] { --_cs-light: ; --_cs-dark: initial; }
}
@media (prefers-contrast: more) {
  :root:where(:not([data-cs-contrast])) { --_cs-standard: ; --_cs-high: initial; }
}
[data-cs-contrast="standard"] { --_cs-standard: initial; --_cs-high: ; }
[data-cs-contrast="high"] { --_cs-standard: ; --_cs-high: initial; }
`;
  for(const p of packs){
    const l={},d={};
    for(const k of roleKeys){l[k]=p.light[k];d[k]=p.dark[k]??p.light[k];}
    for(const k of ['--cs-color-text-accent','--cs-color-link']){l[k]=p.light[k]??light[k];d[k]=p.dark[k]??dark[k];}
    l['--cs-color-link-hover']=light['--cs-color-link-hover'];d['--cs-color-link-hover']=dark['--cs-color-link-hover'];
    for(const [surface,lp,dp] of [['panel',4,10],['page',8,8],['raised',15,14],['border-default',40,40]]){
      const k=surface==='border-default'?'--cs-color-border-default':`--cs-color-surface-${surface}`;
      l[k]=`color-mix(in oklab, var(${channel('light','--cs-accent')}) ${lp}%, ${light[k]})`;
      d[k]=`color-mix(in oklab, var(${channel('dark','--cs-accent')}) ${dp}%, ${dark[k]})`;
    }
    l['--cs-component-button-primary-bg']=light['--cs-component-button-primary-bg'];
    l['--cs-component-button-primary-fg']=light['--cs-component-button-primary-fg'];
    d['--cs-component-button-primary-bg']=p.dark['--cs-accent-strong'];
    d['--cs-component-button-primary-fg']=p.dark['--cs-accent-on-strong'];
    css+=`\n[data-cs-element="${p.el}"]${p.variant?`[data-cs-variant="${p.variant}"]`:''} {\n${lines(channels(l,d))}\n}\n`;
  }
  const bindings=Object.fromEntries(Object.keys(light).map(k=>[k,choose(k)]));
  const contrasts=readContrastMaps(root);
  for(const [key,lo] of Object.entries(contrasts['high-light'])){
    const hi=contrasts['high-dark'][key];
    bindings[key]=`var(--_cs-standard, ${choose(key)})var(--_cs-high, var(--_cs-light, ${lo})var(--_cs-dark, ${hi}))`;
  }
  css+=`\n:is(:root, [data-theme], [data-cs-element], [data-cs-contrast], [data-theme][data-cs-element][data-cs-variant]) {\n${lines(bindings)}\n  color-scheme: var(--_cs-light, light)var(--_cs-dark, dark);\n}\n`;
  return css;
}
