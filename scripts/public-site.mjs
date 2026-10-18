/** Shared audience boundary for Storybook staging and the final webroot. */
import assert from 'node:assert/strict';
import { readFileSync, lstatSync, readdirSync, mkdirSync, rmSync, copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';

export const POLICY_PATH = 'scripts/public-site-policy.json';
export const STAGING_DIR = '.storybook-public';
export const legacyRedirectFiles = ['dashboard.html','dashboard/index.html','playground/index.html'];
export const legacyRedirectHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CyberSkill Design System</title><meta http-equiv="refresh" content="0; url=/"><link rel="canonical" href="https://design.cyberskill.world/"></head><body><p>The design system is at <a href="/">Storybook</a>.</p><script>location.replace('/');</script></body></html>\n`;
export function loadPublicPolicy(root) {
  const policy = JSON.parse(readFileSync(join(root, POLICY_PATH), 'utf8'));
  assert.equal(policy.schemaVersion, 1);
  const files = new Map();
  function add(path, details) {
    assert(path && !path.includes('\\') && !path.startsWith('/') && path.split('/').every(p => p && p !== '.' && p !== '..'), `Unsafe public path: ${path}`);
    assert(!/^(?:\.|docs\/(?:tasks|audits|plans|status)\/|_audit\/(?:archive|revision|exports)\/)/.test(path) && !/(^|\/)package-lock\.json$/.test(path), `Private/maintenance path cannot be public: ${path}`);
    assert(!path.startsWith('scripts/') || ['scripts/design-md-lib.mjs','scripts/lib/oklch.mjs','scripts/lib/dtcg-values.mjs'].includes(path), `Unreviewed public script: ${path}`);
    assert(!files.has(path), `Duplicate public path: ${path}`);
    assert(details.purpose && details.audience, `Missing audience/purpose: ${path}`);
    files.set(path, details);
  }
  for (const [audience, group] of Object.entries(policy.audiences)) for (const path of group.files) add(path, { audience, purpose: group.purpose, optional: false });
  for (const [path, entry] of Object.entries(policy.optionalGenerated || {})) add(path, { ...entry, optional:true });
  assert(files.size > 0, 'Public inventory cannot be empty');
  return files;
}
export function assertRegularSource(root, path) {
  let current = root;
  for (const segment of path.split('/')) {
    current = join(current, segment);
    assert(!lstatSync(current).isSymbolicLink(), `Public source symlink is forbidden: ${path}`);
  }
  assert(lstatSync(current).isFile(), `Public source must be a file: ${path}`);
  return current;
}
export function stagePublicFiles(root) {
  const policy = loadPublicPolicy(root);
  const stage = join(root, STAGING_DIR);
  rmSync(stage, {recursive:true, force:true});
  mkdirSync(stage, {recursive:true});
  for (const [path, entry] of policy) {
    if (entry.optional && !existsSync(join(root, path))) continue;
    const source = assertRegularSource(root, path);
    mkdirSync(dirname(join(stage,path)), {recursive:true});
    copyFileSync(source,join(stage,path));
  }
  writePublicDirectoryIndexes(stage);
  return stage;
}
export function listFiles(root, prefix = '') {
  return readdirSync(join(root,prefix), {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(entry => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    assert(!entry.isSymbolicLink(), `Public output symlink is forbidden: ${path}`);
    return entry.isDirectory() ? listFiles(root,path) : [path];
  });
}
/** Public source directories remain navigable on hosts without directory listing.
 * Only files already in the staged allowlist can appear in these indexes. */
function writePublicDirectoryIndexes(root) {
  const directories=new Set(listFiles(root).flatMap(path => {
    const parts=path.split('/');parts.pop();
    return parts.map((_,i)=>parts.slice(0,i+1).join('/'));
  }));
  const escape=text=>text.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  for(const dir of [...directories].sort()) {
    const index=join(root,dir,'index.html');
    if(existsSync(index))continue;
    const entries=readdirSync(join(root,dir),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name));
    const items=entries.map(entry=>`<li><a href="${encodeURIComponent(entry.name)}${entry.isDirectory()?'/':''}">${escape(entry.name)}${entry.isDirectory()?'/':''}</a></li>`).join('');
    writeFileSync(index,`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(dir)} · CyberSkill</title><link rel="stylesheet" href="/styles.css"><main style="max-width:70rem;margin:2rem auto;padding:1rem;overflow-wrap:anywhere"><a href="/">CyberSkill</a><h1>Tệp công khai / Public files: ${escape(dir)}</h1><ul>${items}</ul></main></html>\n`);
  }
}

const generatedRoot = new Set(['index.html','iframe.html','index.json','project.json','favicon.svg','favicon-wrapper.svg','vite-inject-mocker-entry.js','.cs-freshness.json',
  'nunito-sans-regular.woff2','nunito-sans-italic.woff2','nunito-sans-bold.woff2','nunito-sans-bold-italic.woff2']);
export function publicOutputEntry(path, policy) {
  if (policy.has(path)) return policy.get(path);
  if (path.endsWith('/index.html') && [...policy.keys()].some(source => source.startsWith(path.slice(0,-10)))) return {audience:'host',purpose:'Generated navigation for an allowlisted public source directory.'};
  if (generatedRoot.has(path) || /^sb-addons\/[^\s]+\.js\.LEGAL\.txt$/.test(path) || /^(assets|sb-addons|sb-common-assets|sb-manager)\/[^\s]+\.(js|mjs|css|woff2?|ttf|svg|png|jpe?g|gif|webp|avif|json)$/.test(path)) {
    return {audience:'host',purpose:'Generated Storybook shell, rendered stories or supporting build assets.'};
  }
  throw new Error(`Unclassified public output: ${path}`);
}
export function validatePublicOutput(dir, policy) {
  return listFiles(dir).map(path => {
    const entry=publicOutputEntry(path,policy);
    const bytes=readFileSync(join(dir,path));
    return {path,audience:entry.audience,purpose:entry.purpose,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
  });
}
