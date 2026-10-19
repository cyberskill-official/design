/**
 * Unit tests for the shipped nav model (guidelines/nav-model.cjs).
 * Drives the real module — no reimplementation of classify/group logic here.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const nav = require(join(root, 'guidelines/nav-model.cjs'));

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

// classifyTemplate merges HR ops + suite
assert(nav.classifyTemplate('HR · Interview kit') === 'HR', 'HR ops → HR');
assert(nav.classifyTemplate('HR Suite · Labor Contract') === 'HR', 'HR Suite → HR');
assert(nav.classifyTemplate('Board · Memo') === 'Board', 'Board prefix');
assert(nav.classifyTemplate('Dashboard') === 'Product', 'bare product');
assert(nav.classifyTemplate('Mystery Widget') === 'Other', 'unknown bare');

// short names drop category prefix
assert(nav.templateShortName('HR Suite · Offer') === 'Offer', 'short suite');
assert(nav.templateShortName('Board · Memo') === 'Memo', 'short board');

// groupStories sorts names within grp
const stories = [
  { tier: 'Molecule', name: 'TextField', grp: 'Forms' },
  { tier: 'Molecule', name: 'Combobox', grp: 'Forms' },
  { tier: 'Molecule', name: 'Card', grp: 'Data' },
  { tier: 'Molecule', name: 'Avatar', grp: 'Data' },
  { tier: 'Atom', name: 'Button', grp: 'Core' },
];
const tree = nav.groupStories(stories);
const mol = tree.get('Molecule');
assert(mol, 'Molecule tier present');
const forms = mol.get('Forms').map((s) => s.name);
assert(JSON.stringify(forms) === JSON.stringify(['Combobox', 'TextField']), 'Forms alpha: ' + forms.join(','));
const data = mol.get('Data').map((s) => s.name);
assert(JSON.stringify(data) === JSON.stringify(['Avatar', 'Card']), 'Data alpha');
const groups = nav.sortedGroupNames(mol);
assert(JSON.stringify(groups) === JSON.stringify(['Data', 'Forms']), 'group names alpha');

// groupTemplates: HR merge + order
const tpls = [
  { name: 'HR Suite · A', src: 'a' },
  { name: 'HR · B', src: 'b' },
  { name: 'Dashboard', src: 'd' },
  { name: 'Board · Z', src: 'z' },
  { name: 'Board · A', src: 'ba' },
];
const grouped = nav.groupTemplates(tpls);
const cats = grouped.map((g) => g.category);
assert(cats.includes('HR') && cats.includes('Product') && cats.includes('Board'), 'cats present');
const hr = grouped.find((g) => g.category === 'HR');
assert(hr.items.length === 2, 'HR has both ops + suite');
assert(hr.items.every((i) => i.category === 'HR'), 'HR items tagged');
const board = grouped.find((g) => g.category === 'Board');
assert(board.items[0].shortName === 'A' && board.items[1].shortName === 'Z', 'board short sorted');
// Product before Board in TEMPLATE_ORDER
assert(cats.indexOf('Product') < cats.indexOf('Board'), 'Product before Board');
assert(cats.indexOf('Board') < cats.indexOf('HR'), 'Board before HR');

console.log('PASS test-nav-model', {
  forms,
  data,
  cats,
  hrCount: hr.items.length,
});
