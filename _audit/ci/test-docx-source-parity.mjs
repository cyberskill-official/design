#!/usr/bin/env node
/**
 * Source parity: fixture phrases from original DOCX plain text must appear
 * in the matching templates/<slug>/*.dc.html (visible-ish text).
 *
 * Soft threshold: ≥85% of sampled significant phrases (len ≥ 12).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureDir = join(root, '_audit/fixtures/hr-suite-docx-text');
const templatesRoot = join(root, 'templates');

const THRESHOLD = 0.85;
const MIN_PHRASE_LEN = 12;
const SAMPLE_CAP = 80;

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

function normalizeWs(s) {
  return s
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function softNormalize(s) {
  return normalizeWs(
    s
      .normalize('NFC')
      .replace(/[\u2013\u2014]/g, '-') // en/em dash → hyphen
      .replace(/([.…_·◆]{2,}|…+)/g, ' ')
      .replace(
        /([a-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ])([A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ])/g,
        '$1 $2',
      ),
  ).toLowerCase();
}

function extractDcScriptStrings(html) {
  const out = [];
  const re = /<script\b[^>]*\bdata-dc-script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const body = m[1];
    const strRe = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
    let s;
    while ((s = strRe.exec(body))) {
      let v = s[0].slice(1, -1);
      v = v
        .replace(/\\n/g, ' ')
        .replace(/\\t/g, ' ')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      v = decodeEntities(v);
      if (v.length >= 8 && /[\p{L}\p{N}]/u.test(v)) out.push(v);
    }
  }
  return out.join(' ');
}

function stripHtmlToText(html) {
  const scriptText = extractDcScriptStrings(html);
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return softNormalize(`${decodeEntities(t)} ${scriptText}`);
}

function loadDcText(slug) {
  const dir = join(templatesRoot, slug);
  assert(existsSync(dir), `missing templates/${slug}`);
  const files = readdirSync(dir).filter((f) => f.endsWith('.dc.html'));
  assert(files.length >= 1, `no .dc.html in templates/${slug}`);
  return files
    .map((f) => stripHtmlToText(readFileSync(join(dir, f), 'utf8')))
    .join(' ');
}

function significantPhrases(fixtureText) {
  // Drop HTML-ish source markers from extractor; keep paragraph lines
  const body = fixtureText
    .normalize('NFC')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/^---$/gm, ' ');
  const lines = body
    .split(/\n+/)
    .map((l) => normalizeWs(l))
    .filter((l) => l.length >= MIN_PHRASE_LEN)
    .filter((l) => /[\p{L}\p{N}]/u.test(l));

  const boilerplate =
    /^(CÔNG TY CỔ PHẦN|Công Ty Cổ Phần|CYBERSKILL SOFTWARE|THE SOCIALIST|CỘNG HÒA XÃ HỘI|Độc lập|Hiện Thực Hoá|Turn Your Will|Số \/ No\.|Phiên bản \/ Version)/i;

  const seen = new Set();
  const out = [];
  for (const line of lines) {
    if (boilerplate.test(line)) continue;
    // Prefer whole lines up to ~100 chars; else take a mid-window of words
    let phrase = line;
    if (phrase.length > 100) {
      const words = phrase.split(' ');
      if (words.length >= 6) {
        const start = Math.max(0, Math.floor((words.length - 8) / 2));
        phrase = words.slice(start, start + 8).join(' ');
      } else {
        phrase = phrase.slice(0, 100).trim();
      }
    }
    if (phrase.length < MIN_PHRASE_LEN) continue;
    // Skip pure fillers / dotted blanks
    if (/^[.\s…·◆\-–—/]+$/.test(phrase)) continue;
    if ((phrase.match(/\./g) || []).length > phrase.length / 3) continue;
    const soft = softNormalize(phrase);
    if (soft.length < MIN_PHRASE_LEN) continue;
    if (seen.has(soft)) continue;
    seen.add(soft);
    out.push(phrase);
  }

  if (out.length <= SAMPLE_CAP) return out;
  const step = out.length / SAMPLE_CAP;
  const sampled = [];
  for (let i = 0; i < SAMPLE_CAP; i++) {
    sampled.push(out[Math.floor(i * step)]);
  }
  return sampled;
}

function phraseMatches(dcText, phrase) {
  const needle = softNormalize(phrase);
  if (needle.length >= MIN_PHRASE_LEN && dcText.includes(needle)) return true;
  // Ordered word fallback for residual bilingual smash / blank-field noise
  const words = needle
    .split(' ')
    .map((w) => w.replace(/^[^a-z0-9à-ỹ]+|[^a-z0-9à-ỹ]+$/gi, ''))
    .filter((w) => w.length >= 4);
  if (words.length < 2) return false;
  let idx = 0;
  let hits = 0;
  for (const w of words) {
    const at = dcText.indexOf(w, idx);
    if (at < 0) continue;
    hits += 1;
    idx = at + w.length;
  }
  return hits / words.length >= 0.75;
}

assert(existsSync(fixtureDir), `fixture dir missing: ${fixtureDir}`);
const fixtures = readdirSync(fixtureDir)
  .filter((f) => f.endsWith('.txt'))
  .sort();

assert(fixtures.length >= 40, `expected ≥40 fixtures, got ${fixtures.length}`);

const results = [];
const failures = [];

for (const file of fixtures) {
  const slug = file.replace(/\.txt$/, '');
  const fixturePath = join(fixtureDir, file);
  const fixtureText = readFileSync(fixturePath, 'utf8');
  assert(fixtureText.trim().length > 50, `fixture too short / missing: ${slug}`);

  let dcText;
  try {
    dcText = loadDcText(slug);
  } catch (e) {
    failures.push({ slug, error: String(e.message || e) });
    results.push({ slug, ok: false, hit: 0, total: 0, rate: 0, misses: [] });
    continue;
  }

  const phrases = significantPhrases(fixtureText);
  assert(phrases.length >= 5, `too few phrases for ${slug} (${phrases.length})`);

  const misses = [];
  let hit = 0;
  for (const p of phrases) {
    if (phraseMatches(dcText, p)) hit += 1;
    else misses.push(p);
  }
  const rate = hit / phrases.length;
  const ok = rate >= THRESHOLD;
  results.push({
    slug,
    ok,
    hit,
    total: phrases.length,
    rate,
    misses: misses.slice(0, 8),
  });
  if (!ok) failures.push({ slug, rate, hit, total: phrases.length, misses: misses.slice(0, 8) });
}

const pass = results.filter((r) => r.ok).length;
const fail = results.length - pass;

console.log('DOCX↔DC source parity');
console.log(
  JSON.stringify(
    {
      fixtures: results.length,
      pass,
      fail,
      threshold: THRESHOLD,
      failing: failures.map((f) => ({
        slug: f.slug,
        rate: f.rate != null ? Number(f.rate.toFixed(3)) : undefined,
        hit: f.hit,
        total: f.total,
        error: f.error,
        sampleMisses: f.misses,
      })),
    },
    null,
    2,
  ),
);

if (fail > 0) {
  process.exitCode = 1;
  console.error(`FAIL test-docx-source-parity: ${fail}/${results.length} below ${THRESHOLD * 100}%`);
} else {
  console.log(`PASS test-docx-source-parity (${pass}/${results.length})`);
}
