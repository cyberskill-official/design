#!/usr/bin/env node
/**
 * Push colour tokens from tokens/tokens.dtcg.json into a Figma file as local Variables.
 *
 * Env (required for live push; omit for --dry-run / --check-only helpers):
 *   FIGMA_TOKEN      personal access token
 *   FIGMA_FILE_KEY   file key from figma.com/design/<KEY>/...
 *
 * Usage:
 *   node _audit/ci/push-figma-variables.mjs --dry-run
 *   node _audit/ci/push-figma-variables.mjs --check   # GET file + list collections only
 *   node _audit/ci/push-figma-variables.mjs           # create/update CyberSkill color variables
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { recordCiVerdict } from './ci-verdict.mjs';

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
  if (h.length !== 6 && h.length !== 8) throw new Error('bad hex: ' + hex);
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
  return leaves.filter((L) => {
    if (L.type === 'color') return typeof L.value === 'string' && L.value.startsWith('#');
    return typeof L.value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(L.value);
  });
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
    throw new Error(`Figma ${method} ${path} → ${res.status}: ${msg}`);
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
    hex: c.value,
    color: hexToFigmaColor(c.value),
  }));
}

async function main() {
  const fileKey = process.env.FIGMA_FILE_KEY;
  const colors = loadColors();
  console.log(`Loaded ${colors.length} colour tokens from tokens.dtcg.json`);

  if (dryRun) {
    console.log('Dry-run sample (first 8):');
    for (const c of colors.slice(0, 8)) {
      console.log(`  ${c.name}  ${c.hex}`);
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

/** Figma Variables REST API is Enterprise-only (file_variables:read/write). Soft-skip for CI. */
export function isEnterpriseVariablesBlock(err) {
  const msg = String(err?.message || err || '');
  return /file_variables:(read|write)/i.test(msg)
    || /Invalid scope\(s\)/i.test(msg)
    || /Enterprise plan only/i.test(msg)
    || (/variables\/local/i.test(msg) && /\b403\b/.test(msg));
}

/** Rate-limit or unavailable endpoint — soft-skip in CI (non-Enterprise plans hit these). */
export function isSoftSkippableFigmaError(err) {
  const msg = String(err?.message || err || '');
  return /\b429\b/.test(msg)
    || /\b503\b/.test(msg)
    || /\b404\b/.test(msg)
    || /Rate limit/i.test(msg)
    || /Too many requests/i.test(msg);
}

// Run when executed as CLI (skip when imported for unit tests)
const invoked = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invoked) {
  main().catch((e) => {
    const msg = e.message || String(e);
    console.error(msg);
    if (isEnterpriseVariablesBlock(e)) {
      console.error('');
      console.error('SOFT SKIP — Figma Variables REST API requires an Enterprise plan.');
      console.error('Scopes file_variables:read and file_variables:write only appear when generating a PAT on Enterprise.');
      console.error('Your token scopes (file_content, comments, webhooks, …) cannot call /variables/local.');
      console.error('Options: upgrade to Figma Enterprise, or hand-sync / Tokens Studio. See docs/figma.md.');
      const report = {
        skipped: true,
        reason: 'enterprise_variables_api',
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
        reason: 'enterprise_variables_api',
        detail: msg,
      });
      process.exit(0);
    }
    if (isSoftSkippableFigmaError(e)) {
      console.error('');
      console.error(`SOFT SKIP — Figma API returned ${e.message.match(/\b(429|503|404)\b/)?.[0] || 'a non-success'} (rate limit / unavailable / endpoint not found).`);
      console.error('Non-Enterprise plans do not have access to the Variables REST API (404) and are subject to rate limits.');
      console.error('Options: retry later, upgrade to Figma Enterprise, or hand-sync / Tokens Studio. See docs/figma.md.');
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
