// Decides how npm-publish.yml publishes, and refuses anything unsafe. Writes dist_tag and published to $GITHUB_OUTPUT.
//   node tools/release-meta.mjs               check version/tag/pre mode and the registry
//   node tools/release-meta.mjs --check-npm X fail unless npm X >= 11.5.1 (trusted publishing)
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function decide({ version, refType, refName, preTag }) {
  const prerelease = version.includes('-');
  if (refType === 'tag' && refName !== `v${version}`) return { error: `tag ${refName} does not match package version ${version} (expected v${version})` };
  if (prerelease && !preTag) return { error: `${version} is a prerelease but changesets is not in pre mode (.changeset/pre.json); it would publish as latest` };
  if (!prerelease && preTag) return { error: `${version} is stable but changesets is still in pre mode; run "npx changeset pre exit" first` };
  if (!prerelease && refType !== 'tag') return { error: `stable ${version} publishes only from its v${version} tag, not a manual run` };
  return { distTag: prerelease ? preTag : 'latest' };
}

function main() {
  const fail = msg => { console.error(`✗ ${msg}`); process.exit(1); };
  const args = process.argv.slice(2);
  if (args[0] === '--check-npm') {
    const [maj, min, pat] = (args[1] ?? '').split('.').map(Number);
    if (!(maj > 11 || (maj === 11 && (min > 5 || (min === 5 && pat >= 1))))) fail(`npm ${args[1]} is too old for trusted publishing; need 11.5.1+`);
    console.log(`✓ npm ${args[1]}`); return;
  }


  const pkg = JSON.parse(readFileSync('packages/design/package.json', 'utf8'));
  const preTag = existsSync('.changeset/pre.json') ? JSON.parse(readFileSync('.changeset/pre.json', 'utf8')).tag : undefined;
  const d = decide({ version: pkg.version, refType: process.env.GITHUB_REF_TYPE, refName: process.env.GITHUB_REF_NAME, preTag });
  if (d.error) fail(d.error);

  let published = false;
  try {
    published = execFileSync('npm', ['view', `${pkg.name}@${pkg.version}`, 'version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() === pkg.version;
  } catch (e) {
    if (!/E404|404 Not Found/.test(String(e.stderr))) fail(`could not reach the npm registry: ${String(e.stderr).trim()}`); // fail closed
  }
  console.log(published ? `= ${pkg.name}@${pkg.version} is already on npm; nothing to publish` : `✓ will publish ${pkg.name}@${pkg.version} as "${d.distTag}"`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `dist_tag=${d.distTag}\npublished=${published}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
