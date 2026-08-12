/**
 * CyberSkill document export — PDF (print) + editable OOXML DOCX.
 * Loaded by ds-base.js when <meta name="omelette-owns-print"> is present.
 * No CDN; ZIP via CompressionStream (deflate-raw).
 */
(() => {
  const UMBER = '45210E';
  const A4 = { w: 11906, h: 16838, name: 'A4' }; // twips
  const LETTER = { w: 12240, h: 15840, name: 'Letter' };

  function pageSizeFromCss() {
    const styles = [...document.querySelectorAll('style')].map((s) => s.textContent || '').join('\n');
    if (/@page\s*\{[^}]*size:\s*letter/i.test(styles)) return LETTER;
    return A4;
  }

  function xmlEscape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return ~c >>> 0;
  }

  async function deflateRaw(u8) {
    if (typeof CompressionStream === 'undefined') {
      // Store uncompressed (ZIP method 0) — still a valid OOXML package.
      return { data: u8, method: 0 };
    }
    const cs = new CompressionStream('deflate-raw');
    const writer = cs.writable.getWriter();
    writer.write(u8);
    writer.close();
    const ab = await new Response(cs.readable).arrayBuffer();
    return { data: new Uint8Array(ab), method: 8 };
  }

  async function buildZip(files) {
    // files: [{ name, bytes: Uint8Array }]
    const enc = new TextEncoder();
    const locals = [];
    const centrals = [];
    let offset = 0;
    for (const f of files) {
      const nameBytes = enc.encode(f.name);
      const { data, method } = await deflateRaw(f.bytes);
      const crc = crc32(f.bytes);
      const local = new Uint8Array(30 + nameBytes.length + data.length);
      const dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0, true);
      dv.setUint16(8, method, true);
      dv.setUint16(10, 0, true);
      dv.setUint16(12, 0, true);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, data.length, true);
      dv.setUint32(22, f.bytes.length, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      local.set(data, 30 + nameBytes.length);
      locals.push(local);

      const central = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0, true);
      cv.setUint16(10, method, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, data.length, true);
      cv.setUint32(24, f.bytes.length, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      central.set(nameBytes, 46);
      centrals.push(central);
      offset += local.length;
    }
    const centralSize = centrals.reduce((n, b) => n + b.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    const total =
      locals.reduce((n, b) => n + b.length, 0) + centralSize + end.length;
    const out = new Uint8Array(total);
    let o = 0;
    for (const b of locals) {
      out.set(b, o);
      o += b.length;
    }
    for (const b of centrals) {
      out.set(b, o);
      o += b.length;
    }
    out.set(end, o);
    return out;
  }

  function textRuns(el) {
    const parts = [];
    const walk = (node, italic, bold, color) => {
      if (node.nodeType === 3) {
        const t = node.textContent;
        if (t && t.replace(/\s+/g, '').length) parts.push({ t, italic, bold, color });
        return;
      }
      if (node.nodeType !== 1) return;
      if (node.getAttribute && node.getAttribute('data-omelette-chrome') != null) return;
      const tag = node.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript') return;
      const st = window.getComputedStyle(node);
      const nextItalic =
        italic || st.fontStyle === 'italic' || tag === 'i' || tag === 'em';
      const nextBold =
        bold ||
        Number(st.fontWeight) >= 600 ||
        tag === 'b' ||
        tag === 'strong' ||
        /^h[1-6]$/.test(tag);
      let nextColor = color;
      if (/^h[1-6]$/.test(tag) || (st.color && /rgb\(\s*69\s*,\s*33\s*,\s*14\s*\)/.test(st.color))) {
        nextColor = UMBER;
      }
      for (const c of node.childNodes) walk(c, nextItalic, nextBold, nextColor);
    };
    walk(el, false, false, null);
    return parts;
  }

  function runsToXml(runs) {
    if (!runs.length) {
      return '<w:r><w:t xml:space="preserve"></w:t></w:r>';
    }
    return runs
      .map((r) => {
        const rPr = [];
        if (r.bold) rPr.push('<w:b/>');
        if (r.italic) rPr.push('<w:i/>');
        if (r.color) rPr.push(`<w:color w:val="${r.color}"/>`);
        rPr.push('<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>');
        const pr = rPr.length ? `<w:rPr>${rPr.join('')}</w:rPr>` : '';
        return `<w:r>${pr}<w:t xml:space="preserve">${xmlEscape(r.t)}</w:t></w:r>`;
      })
      .join('');
  }

  function paraXml(el, style) {
    const runs = textRuns(el);
    if (!runs.length && !el.querySelector?.('br')) return '';
    const pPr = style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : '';
    return `<w:p>${pPr}${runsToXml(runs)}</w:p>`;
  }

  function tableXml(table) {
    const rows = [...table.querySelectorAll(':scope > tbody > tr, :scope > thead > tr, :scope > tr')];
    if (!rows.length) return '';
    const gridCols = Math.max(...rows.map((r) => r.children.length), 1);
    const colW = Math.floor(9000 / gridCols);
    let xml = `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>
      <w:top w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:left w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:bottom w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:right w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:insideH w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:insideV w:val="single" w:sz="4" w:color="C9B8A8"/>
    </w:tblBorders></w:tblPr><w:tblGrid>${'<w:gridCol w:w="' + colW + '"/>'.repeat(gridCols)}</w:tblGrid>`;
    for (const tr of rows) {
      xml += '<w:tr>';
      for (const cell of tr.children) {
        const bg = window.getComputedStyle(cell).backgroundColor;
        const shade =
          bg && /rgb\(\s*69\s*,\s*33\s*,\s*14\s*\)/.test(bg)
            ? `<w:tcPr><w:shd w:val="clear" w:fill="${UMBER}"/><w:tcW w:w="${colW}" w:type="dxa"/></w:tcPr>`
            : `<w:tcPr><w:tcW w:w="${colW}" w:type="dxa"/></w:tcPr>`;
        const cellColor = shade.includes(UMBER) ? 'FFFFFF' : null;
        const runs = textRuns(cell).map((r) =>
          cellColor ? { ...r, color: r.color || cellColor } : r,
        );
        xml += `<w:tc>${shade}<w:p>${runsToXml(runs)}</w:p></w:tc>`;
      }
      xml += '</w:tr>';
    }
    xml += '</w:tbl>';
    return xml;
  }

  function sheetBodyXml(sheet) {
    const blocks = [];
    const kids = [...sheet.children];
    const visit = (nodes) => {
      for (const el of nodes) {
        if (el.nodeType !== 1) continue;
        if (el.getAttribute('data-omelette-chrome') != null) continue;
        const tag = el.tagName.toLowerCase();
        if (tag === 'table') {
          blocks.push(tableXml(el));
          continue;
        }
        if (/^h[1-6]$/.test(tag)) {
          blocks.push(paraXml(el, 'Heading1'));
          continue;
        }
        if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'li') {
          // Prefer leaf paragraphs; if a div only wraps structure, descend.
          const hasBlock = [...el.children].some((c) =>
            /^(DIV|TABLE|SECTION|UL|OL|H1|H2|H3|H4|H5|H6)$/.test(c.tagName),
          );
          if (hasBlock && tag !== 'p') {
            visit([...el.children]);
          } else {
            const px = paraXml(el);
            if (px) blocks.push(px);
          }
          continue;
        }
        if (tag === 'ul' || tag === 'ol') {
          visit([...el.children]);
          continue;
        }
        visit([...el.children]);
      }
    };
    visit(kids);
    return blocks.filter(Boolean).join('');
  }

  function headerFooterText(sheet) {
    const headerEl = sheet.querySelector(':scope > div');
    const header = headerEl ? textRuns(headerEl).map((r) => r.t).join('').trim() : 'CyberSkill';
    const footer = 'CyberSkill · MST 0316475200 · Hiện Thực Hoá Ý Chí';
    return { header: header.slice(0, 200) || 'CyberSkill', footer };
  }

  async function buildDocxBlob(sheet) {
    const page = pageSizeFromCss();
    const enc = new TextEncoder();
    const { header, footer } = headerFooterText(sheet);
    const body = sheetBodyXml(sheet);

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`;

    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/><w:qFormat/>
    <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:qFormat/>
    <w:rPr><w:b/><w:color w:val="${UMBER}"/><w:sz w:val="28"/></w:rPr>
  </w:style>
</w:styles>`;

    const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:color="C9B8A8"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${UMBER}"/><w:sz w:val="18"/></w:rPr>
      <w:t xml:space="preserve">${xmlEscape(header)}</w:t></w:r>
  </w:p>
</w:hdr>`;

    const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w:p>
    <w:r><w:rPr><w:sz w:val="16"/><w:color w:val="6B5D4F"/></w:rPr>
      <w:t xml:space="preserve">${xmlEscape(footer)} · </w:t></w:r>
    <w:r><w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p>
</w:ftr>`;

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${body || '<w:p><w:r><w:t></w:t></w:r></w:p>'}
    <w:sectPr>
      <w:headerReference w:type="default" r:id="rId2"/>
      <w:footerReference w:type="default" r:id="rId3"/>
      <w:pgSz w:w="${page.w}" w:h="${page.h}"/>
      <w:pgMar w:top="1440" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    const zip = await buildZip([
      { name: '[Content_Types].xml', bytes: enc.encode(contentTypes) },
      { name: '_rels/.rels', bytes: enc.encode(rels) },
      { name: 'word/document.xml', bytes: enc.encode(documentXml) },
      { name: 'word/_rels/document.xml.rels', bytes: enc.encode(docRels) },
      { name: 'word/styles.xml', bytes: enc.encode(styles) },
      { name: 'word/header1.xml', bytes: enc.encode(headerXml) },
      { name: 'word/footer1.xml', bytes: enc.encode(footerXml) },
    ]);
    return new Blob([zip], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }

  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1500);
  }

  function suggestName(ext) {
    const t = (document.title || 'document').replace(/\s*[·|].*$/, '').trim() || 'document';
    return t.replace(/[^\w\u00C0-\u024F\- ]+/g, '').replace(/\s+/g, '-').slice(0, 80) + ext;
  }

  function injectToolbar() {
    if (document.querySelector('[data-omelette-chrome="export"]')) return;
    const meta = document.querySelector('meta[name="omelette-owns-print"]');
    if (!meta) return;

    const style = document.createElement('style');
    style.setAttribute('data-omelette-chrome', 'export-style');
    style.textContent = `
      [data-omelette-chrome="export"]{
        position:fixed;z-index:2147483000;top:12px;right:12px;display:flex;gap:8px;
        font-family:var(--cs-font-family-ui,system-ui,sans-serif);pointer-events:auto;
      }
      [data-omelette-chrome="export"] button{
        appearance:none;border:1px solid #c9b8a8;background:#fff;color:#45210E;
        border-radius:8px;padding:8px 12px;font-size:12.5px;font-weight:700;cursor:pointer;
        box-shadow:0 1px 2px rgba(35,26,18,.08);
      }
      [data-omelette-chrome="export"] button:hover{background:#f7f0e6}
      [data-omelette-chrome="export"] button:focus-visible{outline:2px solid #F4BA17;outline-offset:2px}
      @media print{
        [data-omelette-chrome="export"],[data-omelette-chrome="export-style"]{display:none!important}
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.setAttribute('data-omelette-chrome', 'export');
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Document export · Xuất tài liệu');

    const pdfBtn = document.createElement('button');
    pdfBtn.type = 'button';
    pdfBtn.textContent = 'PDF · In / Print';
    pdfBtn.addEventListener('click', () => window.print());

    const docxBtn = document.createElement('button');
    docxBtn.type = 'button';
    docxBtn.textContent = 'DOCX · Tải / Download';
    docxBtn.addEventListener('click', async () => {
      try {
        const sheet = document.querySelector('.cs-sheet') || document.body;
        const blob = await buildDocxBlob(sheet);
        downloadBlob(blob, suggestName('.docx'));
      } catch (e) {
        console.error('[doc-export] DOCX failed', e);
        alert('DOCX export failed: ' + (e && e.message ? e.message : e));
      }
    });

    bar.appendChild(pdfBtn);
    bar.appendChild(docxBtn);
    document.body.appendChild(bar);
  }

  // Test / automation hooks
  window.__csDocExport = {
    buildDocxBlob,
    pageSizeFromCss,
    injectToolbar,
  };

  const boot = () => injectToolbar();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  // DC boots async — re-try after paint so .cs-sheet exists for future exports.
  setTimeout(boot, 800);
})();
