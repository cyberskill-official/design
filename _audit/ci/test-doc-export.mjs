#!/usr/bin/env node
/**
 * TASK-IMP-022 — every omelette-owns-print template under the site CSP:
 * no EvalError, export toolbar present, PDF magic + page size, DOCX ZIP + OOXML.
 */
import { createServer } from 'node:http';
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { inflateRawSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self'";

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
};

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

function listPrintTemplates() {
  const out = [];
  for (const name of readdirSync(join(root, 'templates'))) {
    if (name === '_vendor') continue;
    const dir = join(root, 'templates', name);
    if (!statSync(dir).isDirectory()) continue;
    const dc = readdirSync(dir).find((f) => f.endsWith('.dc.html'));
    if (!dc) continue;
    const html = readFileSync(join(dir, dc), 'utf8');
    if (!/omelette-owns-print/i.test(html)) continue;
    const letter = /@page\s*\{[^}]*size:\s*letter/i.test(html);
    out.push({
      folder: name,
      entry: `templates/${name}/${dc}`,
      format: letter ? 'Letter' : 'A4',
    });
  }
  return out.sort((a, b) => a.folder.localeCompare(b.folder));
}

function unzipEntries(buf) {
  // Minimal ZIP local-file walker (deflate or store).
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const entries = {};
  let i = 0;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  while (i + 30 <= u8.length) {
    const sig = dv.getUint32(i, true);
    if (sig !== 0x04034b50) break;
    const method = dv.getUint16(i + 8, true);
    const comp = dv.getUint32(i + 18, true);
    const uncomp = dv.getUint32(i + 22, true);
    const nameLen = dv.getUint16(i + 26, true);
    const extraLen = dv.getUint16(i + 28, true);
    const name = new TextDecoder().decode(u8.subarray(i + 30, i + 30 + nameLen));
    const start = i + 30 + nameLen + extraLen;
    const data = u8.subarray(start, start + comp);
    let raw;
    if (method === 0) raw = data;
    else if (method === 8) raw = inflateRawSync(data);
    else throw new Error(`unsupported zip method ${method} for ${name}`);
    entries[name] = Buffer.from(raw);
    assert(entries[name].length === uncomp || method === 8, `size mismatch ${name}`);
    i = start + comp;
  }
  return entries;
}

function pdfPageCount(pdf) {
  const s = pdf.toString('latin1');
  const m = s.match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
  if (m) return Number(m[1]);
  // Fallback: count page objects
  const pages = [...s.matchAll(/\/Type\s*\/Page(?![s\w])/g)];
  return pages.length || 0;
}

function pdfMediaBox(pdf) {
  const s = pdf.toString('latin1');
  const m = s.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
  if (!m) return null;
  return {
    w: Number(m[3]) - Number(m[1]),
    h: Number(m[4]) - Number(m[2]),
  };
}

const templates = listPrintTemplates();
assert(templates.length >= 60, `expected ≥60 print templates, got ${templates.length}`);

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = join(root, p.replace(/^\//, ''));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Security-Policy': CSP });
    res.end('404');
    return;
  }
  res.writeHead(200, {
    'Content-Type': MIME[extname(file)] || 'application/octet-stream',
    'Content-Security-Policy': CSP,
  });
  res.end(readFileSync(file));
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

const outDir = join(root, '.tmp-doc-export');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
let failed = 0;

try {
  for (const t of templates) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message || e)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
      await page.goto(`${base}/${t.entry}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      // Wait for DC boot + export chrome
      await page.waitForFunction(
        () =>
          !!document.querySelector('[data-omelette-chrome="export"]') &&
          typeof window.__csDocExport?.buildDocxBlob === 'function' &&
          !!document.querySelector('.cs-sheet'),
        null,
        { timeout: 90000 },
      );
      // Extra settle for React paint
      await page.waitForTimeout(400);

      const evalBlocked = errors.some((e) => /EvalError|unsafe-eval|Content Security Policy.*eval/i.test(e));
      assert(!evalBlocked, `${t.folder}: EvalError under CSP — ${errors.filter((e) => /eval/i.test(e)).join('; ')}`);

      const live = await page.evaluate(() => {
        const sheet = document.querySelector('.cs-sheet');
        const text = (sheet || document.body).innerText || '';
        const bar = document.querySelector('[data-omelette-chrome="export"]');
        const trigger = bar && bar.querySelector('[data-cs-export="trigger"]');
        const menu = bar && bar.querySelector('[data-cs-export="menu"]');
        const topButtons = bar ? [...bar.querySelectorAll(':scope > button')] : [];
        return {
          toolbar: !!bar,
          trigger: !!(trigger && /Tải|Download/i.test(trigger.textContent || '')),
          menuPdf: !!(menu && menu.querySelector('[data-cs-export="pdf"]')),
          menuDocx: !!(menu && menu.querySelector('[data-cs-export="docx"]')),
          dualTopButtons: topButtons.length === 2,
          counselBanner: /Counsel review required before real use — commercial framework/.test(text),
          hasVn: /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text),
          hasEn: /the|and|agreement|party|cyberSkill|CyberSkill/i.test(text),
          sample: text.replace(/\s+/g, ' ').trim().slice(0, 240),
        };
      });
      assert(live.toolbar, `${t.folder}: export toolbar missing`);
      assert(live.trigger, `${t.folder}: missing Tải / Download trigger`);
      assert(live.menuPdf && live.menuDocx, `${t.folder}: menu must list PDF and DOCX`);
      assert(!live.dualTopButtons, `${t.folder}: old dual PDF+DOCX buttons still present`);
      if (t.folder === 'vn-framework-agreement') {
        assert(!live.counselBanner, 'vn-framework-agreement still shows counsel-review banner');
      }

      // Print media must unlock FULL_PAGE_CSS height:100% (Safari blank-page bug).
      await page.emulateMedia({ media: 'print' });
      const printLayout = await page.evaluate(() => {
        const check = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return { sel, missing: true };
          const cs = getComputedStyle(el);
          return {
            sel,
            height: cs.height,
            maxHeight: cs.maxHeight,
            overflow: cs.overflow,
          };
        };
        return {
          html: check('html'),
          body: check('body'),
          root: check('#dc-root'),
          host: check('.sc-host'),
          sheetText: (document.querySelector('.cs-sheet') || document.body).innerText.trim().length,
          printPdf: typeof window.__csDocExport?.printPdf === 'function',
          buildPdfBlob: typeof window.__csDocExport?.buildPdfBlob === 'function',
        };
      });
      assert(printLayout.printPdf, `${t.folder}: __csDocExport.printPdf missing`);
      assert(printLayout.buildPdfBlob, `${t.folder}: __csDocExport.buildPdfBlob missing`);
      assert(printLayout.sheetText > 40, `${t.folder}: print media has no sheet text`);
      for (const node of [printLayout.html, printLayout.body, printLayout.root, printLayout.host]) {
        if (node.missing) continue;
        assert(node.overflow === 'visible', `${t.folder}: ${node.sel} overflow=${node.overflow} in print`);
        assert(node.maxHeight === 'none', `${t.folder}: ${node.sel} maxHeight=${node.maxHeight} in print`);
        // Used height may still be numeric; reject explicit 100% from FULL_PAGE_CSS.
        assert(node.height !== '100%', `${t.folder}: ${node.sel} still height:100% in print`);
      }
      await page.emulateMedia({ media: 'screen' });

      // DOCX
      const docxB64 = await page.evaluate(async () => {
        const sheet = document.querySelector('.cs-sheet') || document.body;
        const blob = await window.__csDocExport.buildDocxBlob(sheet);
        const ab = await blob.arrayBuffer();
        const bytes = new Uint8Array(ab);
        let s = '';
        for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
        return btoa(s);
      });
      const docx = Buffer.from(docxB64, 'base64');
      assert(docx[0] === 0x50 && docx[1] === 0x4b, `${t.folder}: DOCX not a ZIP`);
      const entries = unzipEntries(docx);
      assert(entries['[Content_Types].xml'], `${t.folder}: missing [Content_Types].xml`);
      assert(entries['word/document.xml'], `${t.folder}: missing word/document.xml`);
      const docXml = entries['word/document.xml'].toString('utf8');
      assert(/w:document/.test(docXml), `${t.folder}: document.xml not OOXML`);
      assert(
        entries['word/header1.xml'] && entries['word/footer1.xml'],
        `${t.folder}: missing header/footer parts`,
      );
      const pg = docXml.match(/w:pgSz[^>]*w:w="(\d+)"[^>]*w:h="(\d+)"/);
      assert(pg, `${t.folder}: missing w:pgSz`);
      if (t.format === 'A4') {
        assert(Number(pg[1]) === 11906 && Number(pg[2]) === 16838, `${t.folder}: expected A4 pgSz`);
      } else {
        assert(Number(pg[1]) === 12240 && Number(pg[2]) === 15840, `${t.folder}: expected Letter pgSz`);
      }
      if (live.hasVn) {
        assert(
          /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(docXml),
          `${t.folder}: DOCX missing VN diacritics`,
        );
      }
      const tableCountDom = await page.evaluate(
        () => document.querySelectorAll('.cs-sheet table').length,
      );
      const tableCountDocx = (docXml.match(/<w:tbl>/g) || []).length;
      if (tableCountDom > 0) {
        assert(tableCountDocx > 0, `${t.folder}: DOM has tables but DOCX has none`);
      }

      const sheetWords = await page.evaluate(() => {
        const text = (document.querySelector('.cs-sheet') || document.body).innerText || '';
        return text
          .normalize('NFC')
          .split(/\s+/)
          .filter((w) => w.length >= 6)
          .slice(0, 40);
      });
      const docPlain = docXml.replace(/<[^>]+>/g, ' ');
      if (sheetWords.length >= 10) {
        let hits = 0;
        for (const w of sheetWords) {
          if (docPlain.includes(w)) hits += 1;
        }
        assert(
          hits / sheetWords.length >= 0.7,
          `${t.folder}: DOCX missing sheet text (${hits}/${sheetWords.length})`,
        );
      }
      if (t.folder === 'vn-framework-agreement') {
        assert(
          !/Counsel review required before real use/.test(docXml),
          'framework DOCX still contains counsel-review banner',
        );
        assert(
          /w:highlight w:val="yellow"|w:fill="FDE68A"/.test(docXml),
          'framework DOCX missing yellow placeholder fills',
        );
        assert(
          /w:gridSpan w:val="2"/.test(docXml),
          'framework DOCX missing colspan on party table headers',
        );
        const hdr = (entries['word/header1.xml'] || Buffer.from('')).toString('utf8');
        assert(
          !/HỢP ĐỒNG NGUYÊN TẮC|CÔNG TY CỔ PHẦN/.test(hdr),
          'framework DOCX header still duplicates the sheet lockup',
        );
        assert(
          !/091Trang/.test(docXml),
          'framework DOCX mashes phone into page label',
        );
      }

      // Downloaded PDF (buildPdfBlob): one unstretched page of the live sheet.
      if (t.folder === 'vn-framework-agreement') {
        const painted = await page.evaluate(async () => {
          const sheet = document.querySelector('.cs-sheet') || document.body;
          const r = sheet.getBoundingClientRect();
          const blob = await window.__csDocExport.buildPdfBlob(sheet);
          const ab = await blob.arrayBuffer();
          const bytes = new Uint8Array(ab);
          let s = '';
          for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
          return {
            b64: btoa(s),
            sheetW: Math.max(sheet.scrollWidth, r.width),
            sheetH: Math.max(sheet.scrollHeight, r.height),
          };
        });
        const paintedBuf = Buffer.from(painted.b64, 'base64');
        assert(paintedBuf.slice(0, 4).toString() === '%PDF', 'framework buildPdfBlob missing %PDF');
        assert(pdfPageCount(paintedBuf) === 1, 'framework downloaded PDF must be one page (no A4 slice)');
        const paintedBox = pdfMediaBox(paintedBuf);
        assert(paintedBox, 'framework buildPdfBlob MediaBox missing');
        const expectW = t.format === 'Letter' ? 612 : 595.28;
        assert(Math.abs(paintedBox.w - expectW) < 3, `framework PDF width ${paintedBox.w} not ${expectW}`);
        const expectRatio = painted.sheetH / painted.sheetW;
        const gotRatio = paintedBox.h / paintedBox.w;
        assert(
          Math.abs(gotRatio - expectRatio) < 0.08,
          `framework PDF aspect ${gotRatio.toFixed(3)} != sheet ${expectRatio.toFixed(3)} (stretched/sliced)`,
        );
        writeFileSync(join(outDir, 'VnFrameworkAgreement.download.pdf'), paintedBuf);
      }

      // PDF via Playwright (print path / CI smoke)
      const pdf = await page.pdf({
        format: t.format === 'Letter' ? 'Letter' : 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
      const pdfBuf = Buffer.from(pdf);
      assert(pdfBuf.slice(0, 4).toString() === '%PDF', `${t.folder}: PDF magic missing`);
      const box = pdfMediaBox(pdfBuf);
      assert(box, `${t.folder}: PDF MediaBox missing`);
      // Points: A4 ≈ 595×842, Letter ≈ 612×792 (±2)
      if (t.format === 'A4') {
        assert(Math.abs(box.w - 595.28) < 3 || Math.abs(box.w - 595) < 3, `${t.folder}: PDF not A4 width (${box.w})`);
      } else {
        assert(Math.abs(box.w - 612) < 3, `${t.folder}: PDF not Letter width (${box.w})`);
      }
      const pages = pdfPageCount(pdfBuf);
      assert(pages >= 1, `${t.folder}: PDF page count < 1`);

      // Bilingual string presence in PDF text stream (lossy but catches empty exports)
      const pdfLatin = pdfBuf.toString('latin1');
      if (live.hasEn) {
        // At least some printable content embedded
        assert(pdfLatin.length > 800, `${t.folder}: PDF suspiciously small`);
      }

      // Keep VnFrameworkAgreement artifacts for human review
      if (t.folder === 'vn-framework-agreement') {
        writeFileSync(join(outDir, 'VnFrameworkAgreement.pdf'), pdfBuf);
        writeFileSync(join(outDir, 'VnFrameworkAgreement.docx'), docx);
      }

      results.push({
        folder: t.folder,
        format: t.format,
        pdfPages: pages,
        tables: tableCountDocx,
        ok: true,
      });
      process.stdout.write('.');
    } catch (e) {
      failed++;
      results.push({ folder: t.folder, ok: false, error: String(e.message || e).slice(0, 240) });
      process.stdout.write('F');
      console.error('\nFAIL', t.folder, e.message || e);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log('');
const pass = results.filter((r) => r.ok).length;
assert(failed === 0, `${failed} template(s) failed export checks`);
assert(pass === templates.length, 'not all templates passed');

// Framework agreement human-style check: PDF pages ≥ 1 and DOCX on disk
assert(existsSync(join(outDir, 'VnFrameworkAgreement.pdf')), 'framework PDF missing');
assert(existsSync(join(outDir, 'VnFrameworkAgreement.docx')), 'framework DOCX missing');

console.log('PASS test-doc-export', {
  templates: templates.length,
  pass,
  sample: results.filter((r) => r.ok).slice(0, 3),
  frameworkArtifacts: relative(root, outDir),
});
