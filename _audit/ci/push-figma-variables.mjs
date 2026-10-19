#!/usr/bin/env node
/**
 * Push colour tokens from tokens/tokens.dtcg.json into a Figma file as local Variables.
 *
 * Env (required for authenticated --check and live push; omit for --dry-run / pure helpers):
 *   FIGMA_TOKEN      personal access token
 *   FIGMA_FILE_KEY   file key from figma.com/design/<KEY>/...
 *
 * Usage:
 *   node _audit/ci/push-figma-variables.mjs --dry-run
 *   node _audit/ci/push-figma-variables.mjs --check   # GET file + list collections only
 *   node _audit/ci/push-figma-variables.mjs           # create/update CyberSkill color variables
 */
import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordCiVerdict } from './ci-verdict.mjs';
import { srgbToRgba } from '../../scripts/lib/dtcg-values.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DTCG = join(root, 'tokens/tokens.dtcg.json');
const API = 'https://api.figma.com/v1';
const COLLECTION_NAME = 'CyberSkill Tokens';
const MODE_NAME = 'Default';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const checkOnly = args.has('--check');

/** @param {string} hex */
export function hexToFigmaColor(hex) {
  let h = String(hex || '').trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^(?:[0-9a-f]{6}|[0-9a-f]{8})$/i.test(h)) throw new Error('bad hex: ' + hex);
  const n = parseInt(h.slice(0, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a,
  };
}

/** Flatten DTCG-ish tree into { path, value, type } leaves. */
export function flattenDtcg(obj, path = '', out = []) {
  if (!obj || typeof obj !== 'object') return out;
  const hasVal = Object.prototype.hasOwnProperty.call(obj, '$value')
    || Object.prototype.hasOwnProperty.call(obj, 'value');
  if (hasVal) {
    out.push({
      path: path || '(root)',
      value: obj.$value !== undefined ? obj.$value : obj.value,
      type: obj.$type || obj.type || '',
    });
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    flattenDtcg(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

/** CSS custom property path → Figma variable name (slash groups). */
export function toFigmaName(path) {
  // e.g. color.--cs-color-brand-umber → color/brand/umber
  //      accent.--cs-accent-strong → accent/strong
  let p = String(path);
  // drop group prefix before the custom property
  const parts = p.split('.');
  let group = parts.length > 1 ? parts[0] : 'token';
  let prop = parts.length > 1 ? parts.slice(1).join('.') : parts[0];
  prop = prop.replace(/^--cs-color-/, '');
  prop = prop.replace(/^--cs-accent-?/, '');
  prop = prop.replace(/^--cs-/, '');
  prop = prop.replace(/_/g, '-');
  // avoid empty after strip
  if (!prop) prop = parts[parts.length - 1].replace(/^--/, '');
  group = group.replace(/[^a-zA-Z0-9_-]/g, '') || 'token';
  return `${group}/${prop}`.replace(/\/+/g, '/');
}

export function pickColorLeaves(leaves) {
  const byPath=new Map(leaves.map(leaf=>[leaf.path,leaf]));
  function resolve(leaf,seen=new Set()){
    if(seen.has(leaf.path))throw Error('Color alias cycle: '+leaf.path);
    const ref=typeof leaf.value==='string'&&/^\{([^{}]+)\}$/.exec(leaf.value);
    if(ref){
      const target=byPath.get(ref[1]);
      if(!target||target.type!=='color')throw Error('Missing or non-color alias: '+leaf.value);
      return resolve(target,new Set([...seen,leaf.path]));
    }
    // Compatibility for legacy hex inputs; invalid/unsupported colors fail loudly.
    return typeof leaf.value==='string'?hexToFigmaColor(leaf.value):srgbToRgba(leaf.value);
  }
  return leaves.filter(leaf=>leaf.type==='color').map(leaf=>({...leaf,color:resolve(leaf)}));
}

async function figma(path, { method = 'GET', body } = {}) {
  const token = process.env.FIGMA_TOKEN;
  if (!token) throw new Error('FIGMA_TOKEN env is missing');
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    const msg = json?.err || json?.message || text.slice(0, 400);
    const error = new Error(`Figma ${method} ${path} → ${res.status}: ${msg}`);
    error.figmaRequest = Object.freeze({ method, path, status: res.status });
    throw error;
  }
  return json;
}

function loadColors() {
  const dtcg = JSON.parse(readFileSync(DTCG, 'utf8'));
  const leaves = flattenDtcg(dtcg);
  const colors = pickColorLeaves(leaves);
  return colors.map((c) => ({
    path: c.path,
    name: toFigmaName(c.path),
    value: c.value,
    color: c.color,
  }));
}

async function main() {
  const fileKey = process.env.FIGMA_FILE_KEY;
  const colors = loadColors();
  console.log(`Loaded ${colors.length} colour tokens from tokens.dtcg.json`);

  if (dryRun) {
    console.log('Dry-run sample (first 8):');
    for (const c of colors.slice(0, 8)) {
      console.log(`  ${c.name}  ${JSON.stringify(c.color)}`);
    }
    console.log('Dry-run complete — no API calls.');
    recordCiVerdict({
      channel: 'figma-variables',
      kind: 'dry_run',
      detail: `${colors.length} colour tokens`,
    });
    return { dryRun: true, count: colors.length };
  }

  if (!fileKey) throw new Error('FIGMA_FILE_KEY env is missing');

  // Prove secrets work
  const meta = await figma(`/files/${fileKey}?depth=1`);
  console.log(`File OK: “${meta.name || fileKey}” (lastModified ${meta.lastModified || 'n/a'})`);

  const local = await figma(`/files/${fileKey}/variables/local`);
  const collections = Object.values(local.meta?.variableCollections || local.variableCollections || {});
  const variables = Object.values(local.meta?.variables || local.variables || {});
  // API shape: { meta: { variableCollections: {id:..}, variables: {id:..} } }
  const collMap = local.meta?.variableCollections || {};
  const varMap = local.meta?.variables || {};
  const collList = Object.values(collMap);
  const varList = Object.values(varMap);

  console.log(`Existing collections: ${collList.length}, variables: ${varList.length}`);

  if (checkOnly) {
    for (const c of collList) console.log(`  collection: ${c.name} (${c.id}) modes=${(c.modes || []).map((m) => m.name).join(',')}`);
    return { check: true, collections: collList.length, variables: varList.length, file: meta.name };
  }

  // Find or create collection
  let collection = collList.find((c) => c.name === COLLECTION_NAME && !c.hiddenFromPublishing);
  const tempCollectionId = 'VariableCollectionId:csTemp';
  const tempModeId = 'VariableCollectionId:csTemp:ModeId:default';

  /** @type {any} */
  const payload = {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  };

  let collectionId;
  let modeId;

  if (collection) {
    collectionId = collection.id;
    const mode = (collection.modes || [])[0];
    modeId = mode?.modeId || mode?.id;
    if (!modeId) throw new Error('Collection has no mode id');
    console.log(`Using collection “${COLLECTION_NAME}” ${collectionId} mode ${modeId}`);
  } else {
    collectionId = tempCollectionId;
    modeId = tempModeId;
    payload.variableCollections.push({
      action: 'CREATE',
      id: tempCollectionId,
      name: COLLECTION_NAME,
      initialModeId: tempModeId,
      modes: [{ modeId: tempModeId, name: MODE_NAME }],
    });
    console.log(`Will CREATE collection “${COLLECTION_NAME}”`);
  }

  // Index existing variables in this collection by name
  const existingByName = new Map();
  for (const v of varList) {
    if (v.variableCollectionId === collectionId || (!collection && false)) {
      existingByName.set(v.name, v);
    }
  }
  // When collection is new, nothing exists; when existing, match by collection id
  if (collection) {
    existingByName.clear();
    for (const v of varList) {
      if (v.variableCollectionId === collection.id) existingByName.set(v.name, v);
    }
  }

  let createCount = 0;
  let updateCount = 0;
  let i = 0;
  for (const c of colors) {
    const existing = existingByName.get(c.name);
    if (existing) {
      payload.variables.push({
        action: 'UPDATE',
        id: existing.id,
        name: c.name,
      });
      payload.variableModeValues.push({
        variableId: existing.id,
        modeId,
        value: c.color,
      });
      updateCount++;
    } else {
      const tempId = `VariableID:cs${i++}`;
      payload.variables.push({
        action: 'CREATE',
        id: tempId,
        name: c.name,
        variableCollectionId: collectionId,
        resolvedType: 'COLOR',
      });
      payload.variableModeValues.push({
        variableId: tempId,
        modeId,
        value: c.color,
      });
      createCount++;
    }
  }

  console.log(`Plan: create ${createCount}, update ${updateCount} colour variables`);

  if (!payload.variableCollections.length && !payload.variables.length) {
    console.log('Nothing to write.');
    return { createCount, updateCount, wrote: false };
  }

  const result = await figma(`/files/${fileKey}/variables`, { method: 'POST', body: payload });
  console.log('Figma POST variables OK');
  if (result.meta) {
    console.log(`  collections now: ${Object.keys(result.meta.variableCollections || {}).length}`);
    console.log(`  variables now: ${Object.keys(result.meta.variables || {}).length}`);
  }

  // Optional report for CI artifacts
  const report = {
    skipped: false,
    ok: true,
    channel: 'figma-variables',
    file: meta.name,
    fileKey,
    collection: COLLECTION_NAME,
    createCount,
    updateCount,
    totalColors: colors.length,
    sample: colors.slice(0, 5).map((c) => c.name),
    at: new Date().toISOString(),
  };
  try {
    writeFileSync(join(root, '_audit/ci/figma-push-report.json'), JSON.stringify(report, null, 2) + '\n');
  } catch (_) { /* ignore */ }
  recordCiVerdict({
    channel: 'figma-variables',
    kind: 'success',
    detail: `create ${createCount}, update ${updateCount}`,
  });

  return report;
}

/** Actual requests carry metadata; recognize tagged messages for legacy helper callers. */
function figmaRequestFromError(err) {
  if (err?.figmaRequest) return err.figmaRequest;
  const match = String(err?.message || err || '').match(/^Figma ([A-Z]+) (\S+) → (\d{3}):/);
  return match ? { method: match[1], path: match[2], status: Number(match[3]) } : null;
}

/** Variables-only access restrictions; other endpoint scope failures are hard failures. */
export function isEnterpriseVariablesBlock(err) {
  const msg = String(err?.message || err || '');
  const request = figmaRequestFromError(err);
  if (request) {
    const localRead = request.method === 'GET' && /^\/files\/[^/?]+\/variables\/local(?:\?|$)/.test(request.path);
    const variablesWrite = request.method === 'POST' && /^\/files\/[^/?]+\/variables(?:\?|$)/.test(request.path);
    if ((!localRead && !variablesWrite) || request.status !== 403) return false;
    // Preserve the existing unavailable local-read policy. Other write access
    // failures remain hard failures unless the response identifies Variables
    // scopes or the Enterprise API restriction.
    return localRead || /file_variables:(read|write)|Enterprise plan only/i.test(msg);
  }
  return /file_variables:(read|write)/i.test(msg)
    || /Enterprise plan only/i.test(msg);
}

/** Known HTTP unavailability; status-like text in an invalid token is not an API result. */
function isSoftSkippableFigmaError(err) {
  const request = figmaRequestFromError(err);
  if (request) return [429, 503, 404].includes(request.status);
  const msg = String(err?.message || err || '');
  return /\b429\b/.test(msg)
    || /\b503\b/.test(msg)
    || /\b404\b/.test(msg)
    || /Rate limit/i.test(msg)
    || /Too many requests/i.test(msg);
}

// Run when executed as CLI (skip when imported for unit tests)
let invoked = false;
try {
  invoked = Boolean(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
} catch { /* Import/stdin callers without a real argv entry never run the CLI. */ }
if (invoked) {
  main().catch((e) => {
    const msg = e.message || String(e);
    console.error(msg);
    if (e.figmaRequest && isEnterpriseVariablesBlock(e)) {
      console.error('');
      console.error('SOFT SKIP — Figma Variables API access is unavailable for this request.');
      console.error('Check Enterprise membership, Full seat/edit access for writes, and file_variables:read/write scopes.');
      console.error('Token scopes do not override file permissions; file preflight does not prove Variables access.');
      console.error('Verify account and file access, or use the documented hand-sync path. See docs/figma.md.');
      const report = {
        skipped: true,
        reason: 'variables_api_access',
        message: msg,
        channel: 'figma-variables',
        at: new Date().toISOString(),
      };
      try {
        writeFileSync(join(root, '_audit/ci/figma-push-report.json'), JSON.stringify(report, null, 2) + '\n');
      } catch (_) { /* ignore */ }
      recordCiVerdict({
        channel: 'figma-variables',
        kind: 'soft_skip',
        reason: 'variables_api_access',
        detail: msg,
      });
      process.exit(0);
    }
    if (e.figmaRequest && isSoftSkippableFigmaError(e)) {
      console.error('');
      console.error(`SOFT SKIP — Figma API returned ${e.figmaRequest.status} (rate limit / unavailable / endpoint not found).`);
      console.error('Check the file key and endpoint access; retry rate limits or service unavailability when appropriate.');
      console.error('This response does not establish a plan restriction or a successful sync. See docs/figma.md.');
      const report = {
        skipped: true,
        reason: 'figma_api_unavailable',
        message: msg,
        channel: 'figma-variables',
        at: new Date().toISOString(),
      };
      try {
        writeFileSync(join(root, '_audit/ci/figma-push-report.json'), JSON.stringify(report, null, 2) + '\n');
      } catch (_) { /* ignore */ }
      recordCiVerdict({
        channel: 'figma-variables',
        kind: 'soft_skip',
        reason: 'figma_api_unavailable',
        detail: msg,
      });
      process.exit(0);
    }
    process.exit(1);
  });
}
