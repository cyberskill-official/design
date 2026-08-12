#!/usr/bin/env node
/**
 * One-shot: extract normalized plain text from scraps/hr-suite-docx Templates
 * into _audit/fixtures/hr-suite-docx-text/<slug>.txt
 *
 * Sources are gitignored; fixtures are committed for CI parity checks.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const templatesDir = join(root, 'scraps/hr-suite-docx/Templates');
const outDir = join(root, '_audit/fixtures/hr-suite-docx-text');

/** English title fragment (zip filename suffix after " - ") → slug */
const TITLE_TO_SLUG = [
  ['CyberSkill Document Style Guide', 'doc-style-guide'],
  ['CyberSkill Document Template', 'doc-templates'],
  ['Employment Suite Usage Guide', 'doc-suite-index'],
  ['HR Document Suite Index', 'doc-suite-index'],
  ['Labor Contract', 'vn-labor-contract'],
  ['Exit-Handover Agreement', 'vn-exit-handover'],
  ['NDNCA & IP', 'vn-ndnca-ip'],
  ['Phantom Stock Agreement', 'vn-phantom-stock'],
  ['Total Rewards & Career Path Appendix', 'vn-total-rewards-appendix'],
  ['Labor Contract Amendment Appendix', 'vn-contract-amendment'],
  ['Appointment & Transfer Decision', 'vn-appointment-transfer'],
  ['Probation Contract', 'vn-probation-contract'],
  ['Internal Labor Regulations', 'vn-internal-labor-regulations'],
  ['Decision on Termination', 'vn-termination-decision'],
  ['Disciplinary Schedule (Annex to ILR)', 'vn-disciplinary-schedule'],
  ['Training & Service Commitment Agreement', 'vn-training-commitment'],
  ['Internship Agreement', 'vn-internship-agreement'],
  ['Employment Offer Letter', 'vn-offer-letter'],
  ['Personal Data Consent (PDPL)', 'vn-pdpl-consent'],
  ['Foreign Employee Work Permit Pack', 'vn-foreign-employee-pack'],
  ['Independent Contractor Agreement', 'vn-contractor-agreement'],
  ['Employee Request Form', 'vn-employee-request'],
  ['Job Description', 'vn-job-description'],
  ['Acknowledgement of Receipt', 'vn-receipt-acknowledgement'],
  ['Labour Management Book', 'vn-labour-management-book'],
  ['Performance Review Form', 'vn-performance-review-form'],
  ['Onboarding Checklist', 'vn-onboarding-checklist'],
  ['Mutual NDA', 'vn-mutual-nda'],
  ['Statement of Work', 'vn-sow-appendix'],
  ['Disciplinary Case File', 'vn-disciplinary-case-file'],
  ['Certificate of Employment', 'vn-certificate-of-employment'],
  ['Resignation Letter', 'vn-resignation-letter'],
  ['Travel & Expense Policy', 'vn-travel-expense-policy'],
  ['Grassroots Democracy Regulation', 'vn-grassroots-democracy'],
  ['Salary Scale and Payroll Table', 'vn-salary-scale'],
  ['Remote & Hybrid Work Policy', 'vn-remote-work-policy'],
  ['Code of Conduct', 'vn-code-of-conduct'],
  ['Compensation & Reward Regulation', 'vn-compensation-regulation'],
  ['Personal Data Protection Policy', 'vn-data-protection-policy'],
  ['Information Security & Acceptable Use Policy', 'vn-infosec-policy'],
  ['Performance Evaluation Regulation', 'vn-performance-evaluation-regulation'],
  ['Framework Agreement (Software Services)', 'vn-framework-agreement'],
];

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** Insert space between runs when Word omitted it at VI↔EN / ALLCAPS boundaries. */
function joinRuns(runs) {
  if (!runs.length) return '';
  let out = runs[0];
  for (let i = 1; i < runs.length; i++) {
    const b = runs[i];
    if (!b) continue;
    if (!out) {
      out = b;
      continue;
    }
    const left = out.slice(-1);
    const right = b[0];
    const needSpace =
      left &&
      right &&
      !/\s/.test(left) &&
      !/\s/.test(right) &&
      ((/[\p{L}\p{N}]/u.test(left) && /[A-ZÁÀẢÃẠĂÂĐÉÊÍÓÔƠÚƯÝ]/.test(right)) ||
        (/[A-ZÁÀẢÃẠĂÂĐÉÊÍÓÔƠÚƯÝ]/.test(left) && /[A-ZÁÀẢÃẠĂÂĐÉÊÍÓÔƠÚƯÝ]/.test(right)));
    out += (needSpace ? ' ' : '') + b;
  }
  return out;
}

/** Paragraph-aware: join w:t within each <w:p>, separate paragraphs with newlines. */
function extractParagraphs(xml) {
  const paras = xml.split(/<\/w:p>/);
  const out = [];
  for (const p of paras) {
    const runs = [];
    const re = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
    let m;
    while ((m = re.exec(p))) {
      runs.push(decodeXmlEntities(m[1]));
    }
    if (runs.length) out.push(joinRuns(runs));
  }
  return out;
}

function listZipMembers(docxPath) {
  const out = execFileSync('unzip', ['-Z1', docxPath], { encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
}

function extractDocxText(docxPath) {
  const members = listZipMembers(docxPath);
  const parts = members.filter(
    (n) =>
      n === 'word/document.xml' ||
      /^word\/header\d+\.xml$/.test(n) ||
      /^word\/footer\d+\.xml$/.test(n),
  );
  // Prefer document first, then headers/footers in name order
  parts.sort((a, b) => {
    if (a === 'word/document.xml') return -1;
    if (b === 'word/document.xml') return 1;
    return a.localeCompare(b);
  });
  const chunks = [];
  for (const part of parts) {
    const xml = execFileSync('unzip', ['-p', docxPath, part], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    const paras = extractParagraphs(xml);
    if (paras.length) chunks.push(paras.join('\n'));
  }
  return normalizePlain(chunks.join('\n\n'));
}

function normalizePlain(text) {
  return text
    .normalize('NFC')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function matchSlug(filename) {
  // Match longest English title first
  const sorted = [...TITLE_TO_SLUG].sort((a, b) => b[0].length - a[0].length);
  for (const [title, slug] of sorted) {
    if (filename.includes(title)) return slug;
  }
  return null;
}

if (!existsSync(templatesDir)) {
  console.error('Missing', templatesDir);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const files = readdirSync(templatesDir).filter((f) => /\.(docx|dotx)$/i.test(f));
/** @type {Map<string, string[]>} */
const bySlug = new Map();

for (const file of files) {
  const slug = matchSlug(file);
  if (!slug) {
    console.warn('UNMAPPED', file);
    continue;
  }
  const text = extractDocxText(join(templatesDir, file));
  if (!bySlug.has(slug)) bySlug.set(slug, []);
  bySlug.get(slug).push(`<!-- source: ${file} -->\n${text}`);
  console.log('OK', slug, '←', file, `(${text.length} chars)`);
}

let written = 0;
for (const [slug, parts] of [...bySlug.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const body = parts.join('\n\n---\n\n');
  writeFileSync(join(outDir, `${slug}.txt`), body + '\n', 'utf8');
  written += 1;
}

console.log(`Wrote ${written} fixtures to ${outDir}`);
console.log(`Mapped source files: ${files.length}; unmatched check above.`);
