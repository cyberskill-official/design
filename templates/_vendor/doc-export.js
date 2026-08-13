/**
 * CyberSkill document export — one Download menu (PDF | DOCX).
 * PDF/DOCX are built from the live `.cs-sheet` so attachments match the HTML preview.
 * Loaded by ds-base.js when <meta name="omelette-owns-print"> is present.
 * No CDN; ZIP via CompressionStream (deflate-raw).
 */
(() => {
  const UMBER = '45210E';
  const A4 = { w: 11906, h: 16838, name: 'A4', ptW: 595.28, ptH: 841.89 };
  const LETTER = { w: 12240, h: 15840, name: 'Letter', ptW: 612, ptH: 792 };
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

    const total = locals.reduce((n, b) => n + b.length, 0) + centralSize + end.length;
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

  function isChrome(el) {
    return el.getAttribute && el.getAttribute('data-omelette-chrome') != null;
  }

  function textRuns(el) {
    const parts = [];
    const walk = (node, italic, bold, color) => {
      if (node.nodeType === 3) {
        const raw = node.textContent || '';
        if (!raw) return;
        if (!raw.replace(/\s+/g, '').length) {
          if (parts.length) parts.push({ t: ' ', italic, bold, color });
          return;
        }
        parts.push({ t: raw.replace(/\s+/g, ' '), italic, bold, color });
        return;
      }
      if (node.nodeType !== 1) return;
      if (isChrome(node)) return;
      const tag = node.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript') return;
      const st = window.getComputedStyle(node);
      const nextItalic = italic || st.fontStyle === 'italic' || tag === 'i' || tag === 'em';
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
    const merged = [];
    for (const r of parts) {
      const prev = merged[merged.length - 1];
      if (
        prev &&
        prev.italic === r.italic &&
        prev.bold === r.bold &&
        prev.color === r.color
      ) {
        prev.t += r.t;
      } else {
        merged.push({ ...r });
      }
    }
    return merged;
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

  function cellInnerXml(cell, fillWhite) {
    const blocks = [...cell.children].filter((c) =>
      /^(DIV|P|UL|OL|H1|H2|H3|H4|H5|H6)$/.test(c.tagName),
    );
    const paint = (runs) =>
      runs.map((r) => (fillWhite ? { ...r, color: r.color || 'FFFFFF' } : r));
    if (blocks.length && blocks.length === cell.children.length) {
      const paras = blocks
        .map((b) => {
          const runs = paint(textRuns(b));
          return runs.length ? `<w:p>${runsToXml(runs)}</w:p>` : '';
        })
        .filter(Boolean);
      return paras.join('') || `<w:p>${runsToXml([])}</w:p>`;
    }
    return `<w:p>${runsToXml(paint(textRuns(cell)))}</w:p>`;
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
        const umberFill = bg && /rgb\(\s*69\s*,\s*33\s*,\s*14\s*\)/.test(bg);
        const shade = umberFill
          ? `<w:tcPr><w:shd w:val="clear" w:fill="${UMBER}"/><w:tcW w:w="${colW}" w:type="dxa"/></w:tcPr>`
          : `<w:tcPr><w:tcW w:w="${colW}" w:type="dxa"/></w:tcPr>`;
        xml += `<w:tc>${shade}${cellInnerXml(cell, umberFill)}</w:tc>`;
      }
      xml += '</w:tr>';
    }
    xml += '</w:tbl>';
    return xml;
  }

  function gridColCount(el) {
    const st = window.getComputedStyle(el);
    if (st.display !== 'grid' && st.display !== 'inline-grid') return 0;
    const tpl = st.gridTemplateColumns || '';
    const parts = tpl.split(/\s+/).filter(Boolean);
    return parts.length >= 2 ? parts.length : 0;
  }

  function gridAsTable(el) {
    const cols = gridColCount(el);
    if (!cols) return '';
    const kids = [...el.children].filter((c) => c.nodeType === 1 && !isChrome(c));
    if (kids.length < 2) return '';
    const colW = Math.floor(9000 / cols);
    let xml = `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>
      <w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>
      <w:insideH w:val="nil"/><w:insideV w:val="nil"/>
    </w:tblBorders></w:tblPr><w:tblGrid>${'<w:gridCol w:w="' + colW + '"/>'.repeat(cols)}</w:tblGrid>`;
    for (let i = 0; i < kids.length; i += cols) {
      xml += '<w:tr>';
      for (let c = 0; c < cols; c++) {
        const src = kids[i + c];
        const inner = src ? cellInnerXml(src, false) : `<w:p>${runsToXml([])}</w:p>`;
        xml += `<w:tc><w:tcPr><w:tcW w:w="${colW}" w:type="dxa"/></w:tcPr>${inner}</w:tc>`;
      }
      xml += '</w:tr>';
    }
    xml += '</w:tbl>';
    return xml;
  }

  function sheetBodyXml(sheet) {
    const blocks = [];
    const visit = (nodes) => {
      for (const el of nodes) {
        if (el.nodeType !== 1) continue;
        if (isChrome(el)) continue;
        const tag = el.tagName.toLowerCase();
        if (tag === 'table') {
          blocks.push(tableXml(el));
          continue;
        }
        if (/^h[1-6]$/.test(tag)) {
          blocks.push(paraXml(el, 'Heading1'));
          continue;
        }
        const gridXml = gridAsTable(el);
        if (gridXml) {
          blocks.push(gridXml);
          continue;
        }
        if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'li') {
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
    visit([...sheet.children]);
    return blocks.filter(Boolean).join('');
  }

  function headerFooterText() {
    return {
      header: 'CyberSkill · Hiện Thực Hoá Ý Chí',
      footer: 'CyberSkill · MST 0316475200 · info@cyberskill.world',
    };
  }

  async function buildDocxBlob(sheet) {
    const page = pageSizeFromCss();
    const enc = new TextEncoder();
    const { header, footer } = headerFooterText();
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
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
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

  function cssVarBlock() {
    const cs = getComputedStyle(document.documentElement);
    const parts = [];
    for (let i = 0; i < cs.length; i++) {
      const p = cs[i];
      if (p.startsWith('--')) parts.push(`${p}:${cs.getPropertyValue(p)}`);
    }
    return parts.length ? `:root{${parts.join(';')}}` : '';
  }

  function dataUrlToBytes(dataUrl) {
    const b64 = dataUrl.split(',')[1] || '';
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function canvasHasInk(ctx, w, h) {
    const stepX = Math.max(1, Math.floor(w / 12));
    const stepY = Math.max(1, Math.floor(h / 16));
    for (let y = 8; y < h; y += stepY) {
      for (let x = 8; x < w; x += stepX) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        if (p[0] < 248 || p[1] < 248 || p[2] < 248) return true;
      }
    }
    return false;
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('sheet-image-failed'));
      img.src = url;
    });
  }

  function concatBytes(parts) {
    const total = parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const p of parts) {
      out.set(p, o);
      o += p.length;
    }
    return out;
  }

  function jpegPagesToPdf(pages, mediaW, mediaH) {
    const enc = new TextEncoder();
    const nl = enc.encode('\n');
    const chunks = [enc.encode('%PDF-1.4\n')];
    const offsets = [0];
    const pushObj = (id, dict, stream) => {
      offsets[id] = chunks.reduce((n, c) => n + c.length, 0);
      chunks.push(enc.encode(`${id} 0 obj\n`));
      if (stream) {
        chunks.push(enc.encode(dict));
        chunks.push(nl);
        chunks.push(enc.encode('stream\n'));
        chunks.push(stream);
        chunks.push(enc.encode('\nendstream\nendobj\n'));
      } else {
        chunks.push(enc.encode(dict));
        chunks.push(enc.encode('\nendobj\n'));
      }
    };

    const pageIds = [];
    let nextId = 3;
    for (const page of pages) {
      const pageId = nextId++;
      const imgId = nextId++;
      const contentId = nextId++;
      pageIds.push(pageId);
      const content = `q ${mediaW.toFixed(2)} 0 0 ${mediaH.toFixed(2)} 0 0 cm /Im0 Do Q\n`;
      pushObj(
        pageId,
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${mediaW.toFixed(2)} ${mediaH.toFixed(2)}] /Resources << /XObject << /Im0 ${imgId} 0 R >> >> /Contents ${contentId} 0 R >>`,
      );
      pushObj(
        imgId,
        `<< /Type /XObject /Subtype /Image /Width ${page.w} /Height ${page.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>`,
        page.jpeg,
      );
      const contentBytes = enc.encode(content);
      pushObj(contentId, `<< /Length ${contentBytes.length} >>`, contentBytes);
    }

    pushObj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    pushObj(
      2,
      `<< /Type /Pages /Kids [${pageIds.map((id) => id + ' 0 R').join(' ')}] /Count ${pageIds.length} >>`,
    );

    const body = concatBytes(chunks);
    const xrefAt = body.length;
    let xref = `xref\n0 ${nextId}\n0000000000 65535 f \n`;
    for (let i = 1; i < nextId; i++) {
      xref += String(offsets[i] || 0).padStart(10, '0') + ' 00000 n \n';
    }
    const trailer = `trailer\n<< /Size ${nextId} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;
    return concatBytes([body, enc.encode(xref), enc.encode(trailer)]);
  }

  function relBox(el, origin, sheet) {
    const r = el.getBoundingClientRect();
    return {
      x: r.left - origin.left + sheet.scrollLeft,
      y: r.top - origin.top + sheet.scrollTop,
      w: r.width,
      h: r.height,
    };
  }

  function paintBox(ctx, el, origin, sheet) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return;
    const b = relBox(el, origin, sheet);
    const bg = cs.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      ctx.fillStyle = bg;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    const sides = [
      ['Top', b.x, b.y, b.x + b.w, b.y],
      ['Right', b.x + b.w, b.y, b.x + b.w, b.y + b.h],
      ['Bottom', b.x, b.y + b.h, b.x + b.w, b.y + b.h],
      ['Left', b.x, b.y, b.x, b.y + b.h],
    ];
    for (const [side, x1, y1, x2, y2] of sides) {
      const w = parseFloat(cs[`border${side}Width`]) || 0;
      if (w <= 0 || cs[`border${side}Style`] === 'none') continue;
      ctx.strokeStyle = cs[`border${side}Color`];
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function paintTextNode(ctx, node, origin, sheet) {
    const raw = node.textContent || '';
    if (!raw.replace(/\s+/g, '').length) return;
    const parent = node.parentElement;
    if (!parent) return;
    const cs = getComputedStyle(parent);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    ctx.save();
    ctx.fillStyle = cs.color || '#000';
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.textBaseline = 'top';
    const range = document.createRange();
    const parts = raw.split(/(\s+)/);
    let offset = 0;
    for (const part of parts) {
      const next = offset + part.length;
      if (part.replace(/\s+/g, '').length) {
        try {
          range.setStart(node, offset);
          range.setEnd(node, Math.min(next, raw.length));
          const r = range.getBoundingClientRect();
          if (r.width || r.height) {
            ctx.fillText(
              part,
              r.left - origin.left + sheet.scrollLeft,
              r.top - origin.top + sheet.scrollTop,
            );
          }
        } catch (_) {
          /* invalid offsets on some hosts */
        }
      }
      offset = next;
    }
    ctx.restore();
  }

  async function paintSvg(ctx, svg, origin, sheet) {
    const b = relBox(svg, origin, sheet);
    if (b.w < 1 || b.h < 1) return;
    try {
      const xml = new XMLSerializer().serializeToString(svg);
      if (/foreignObject/i.test(xml)) return;
      const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml));
      ctx.drawImage(img, b.x, b.y, b.w, b.h);
    } catch (_) {
      /* skip logo if SVG paint fails */
    }
  }

  async function paintSheet(sheet, scale) {
    const origin = sheet.getBoundingClientRect();
    const width = Math.max(sheet.scrollWidth, sheet.clientWidth, 1);
    const height = Math.max(sheet.scrollHeight, sheet.clientHeight, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    const svgs = [];
    const walk = (node) => {
      if (node.nodeType === 1) {
        if (isChrome(node)) return;
        const tag = node.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'noscript') return;
        if (tag === 'svg') {
          paintBox(ctx, node, origin, sheet);
          svgs.push(node);
          return;
        }
        paintBox(ctx, node, origin, sheet);
        for (const c of node.childNodes) walk(c);
        return;
      }
      if (node.nodeType === 3) paintTextNode(ctx, node, origin, sheet);
    };
    walk(sheet);
    for (const svg of svgs) await paintSvg(ctx, svg, origin, sheet);
    return { canvas, width, height, ctx };
  }

  async function rasterizeSheet(sheet) {
    const page = pageSizeFromCss();
    const scale = 2;
    const painted = await paintSheet(sheet, scale);
    const { canvas, width, height, ctx } = painted;
    let ink = true;
    try {
      ink = canvasHasInk(ctx, canvas.width, Math.min(canvas.height, 400));
    } catch (_) {
      ink = true;
    }
    if (!ink) throw new Error('blank-raster');
    const pageH = Math.round(width * (page.h / page.w) * scale);
    const pages = [];
    let y = 0;
    while (y < canvas.height - 1) {
      const ch = Math.min(pageH, canvas.height - y);
      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = Math.max(1, ch);
      const sctx = slice.getContext('2d');
      sctx.fillStyle = '#ffffff';
      sctx.fillRect(0, 0, slice.width, slice.height);
      sctx.drawImage(canvas, 0, y, canvas.width, ch, 0, 0, canvas.width, ch);
      pages.push({
        jpeg: dataUrlToBytes(slice.toDataURL('image/jpeg', 0.92)),
        w: slice.width,
        h: slice.height,
      });
      y += pageH;
      if (pages.length > 40) break;
    }
    if (!pages.length) throw new Error('no-pages');
    return jpegPagesToPdf(pages, page.ptW, page.ptH);
  }

  async function buildPdfBlob(sheet) {
    const bytes = await rasterizeSheet(sheet);
    return new Blob([bytes], { type: 'application/pdf' });
  }

  function printPdf() {
    const sheet = document.querySelector('.cs-sheet') || document.body;
    const page = pageSizeFromCss();
    const size = page.name === 'Letter' ? 'letter' : 'A4';
    const clone = sheet.cloneNode(true);
    clone.querySelectorAll('[data-omelette-chrome]').forEach((n) => n.remove());
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map((l) => `<link rel="stylesheet" href="${xmlEscape(l.href)}">`)
      .join('');
    const styles = [...document.querySelectorAll('style')]
      .filter((s) => s.getAttribute('data-omelette-chrome') == null)
      .map((s) => `<style>${s.textContent || ''}</style>`)
      .join('');
    const title = xmlEscape(document.title || 'document');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
      ${links}${styles}
      <style>${cssVarBlock()}
        @page{size:${size};margin:16mm 14mm}
        html,body{margin:0;padding:0;background:#fff!important;height:auto!important;max-height:none!important;overflow:visible!important}
        .cs-desk{background:#fff!important;padding:0!important;min-height:0!important}
        .cs-sheet{box-shadow:none!important;margin:0 auto!important}
        [data-omelette-chrome]{display:none!important}
      </style></head><body>${clone.outerHTML}</body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    let w = null;
    try {
      w = window.open(url, '_blank');
    } catch (_) {
      w = null;
    }
    if (!w) {
      URL.revokeObjectURL(url);
      window.print();
      return;
    }
    let printed = false;
    const go = () => {
      if (printed) return;
      printed = true;
      try {
        w.focus();
        w.print();
      } catch (_) {
        /* ignore */
      }
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    };
    w.addEventListener('load', () => setTimeout(go, 400));
    setTimeout(go, 1600);
  }

  async function downloadBlob(blob, filename) {
    const type = blob.type || 'application/octet-stream';
    try {
      const file = new File([blob], filename, { type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') return;
        }
      }
    } catch (_) {
      /* File/share unsupported */
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 4000);
  }

  function suggestName(ext) {
    const t = (document.title || 'document').replace(/\s*[·|].*$/, '').trim() || 'document';
    return t.replace(/[^\w\u00C0-\u024F\- ]+/g, '').replace(/\s+/g, '-').slice(0, 80) + ext;
  }

  async function downloadPdf() {
    const sheet = document.querySelector('.cs-sheet') || document.body;
    try {
      const blob = await buildPdfBlob(sheet);
      if (!blob || blob.size < 200) throw new Error('empty-pdf');
      await downloadBlob(blob, suggestName('.pdf'));
    } catch (e) {
      console.warn('[doc-export] raster PDF failed, printing sheet clone', e);
      printPdf();
    }
  }

  async function downloadDocx() {
    const sheet = document.querySelector('.cs-sheet') || document.body;
    const blob = await buildDocxBlob(sheet);
    await downloadBlob(blob, suggestName('.docx'));
  }

  function injectToolbar() {
    if (document.querySelector('[data-omelette-chrome="export"]')) return;
    const meta = document.querySelector('meta[name="omelette-owns-print"]');
    if (!meta) return;

    const style = document.createElement('style');
    style.setAttribute('data-omelette-chrome', 'export-style');
    style.textContent = `
      [data-omelette-chrome="export"]{
        position:fixed;z-index:2147483000;top:12px;right:12px;display:flex;flex-direction:column;align-items:flex-end;gap:4px;
        font-family:var(--cs-font-family-ui,system-ui,sans-serif);pointer-events:auto;
      }
      [data-omelette-chrome="export"] button{
        appearance:none;border:1px solid #c9b8a8;background:#fff;color:#45210E;
        border-radius:8px;padding:8px 12px;font-size:12.5px;font-weight:700;cursor:pointer;
        box-shadow:0 1px 2px rgba(35,26,18,.08);
      }
      [data-omelette-chrome="export"] button:hover{background:#f7f0e6}
      [data-omelette-chrome="export"] button:focus-visible{outline:2px solid #F4BA17;outline-offset:2px}
      [data-cs-export="menu"]{
        min-width:148px;background:#fff;border:1px solid #c9b8a8;border-radius:8px;
        box-shadow:0 8px 24px rgba(35,26,18,.12);overflow:hidden;padding:4px;
      }
      [data-cs-export="menu"][hidden]{display:none!important}
      [data-cs-export="menu"] button{
        display:block;width:100%;border:0;border-radius:6px;box-shadow:none;text-align:left;font-weight:650;
      }
      @media print{
        [data-omelette-chrome="export"],[data-omelette-chrome="export-style"]{display:none!important}
        html,body,#dc-root,#dc-root>.sc-host{
          height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important
        }
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.setAttribute('data-omelette-chrome', 'export');
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Tải tài liệu · Download document');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.setAttribute('data-cs-export', 'trigger');
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = 'Tải / Download ▾';

    const menu = document.createElement('div');
    menu.setAttribute('data-cs-export', 'menu');
    menu.setAttribute('role', 'menu');
    menu.hidden = true;

    const pdfItem = document.createElement('button');
    pdfItem.type = 'button';
    pdfItem.setAttribute('role', 'menuitem');
    pdfItem.setAttribute('data-cs-export', 'pdf');
    pdfItem.textContent = 'PDF';

    const docxItem = document.createElement('button');
    docxItem.type = 'button';
    docxItem.setAttribute('role', 'menuitem');
    docxItem.setAttribute('data-cs-export', 'docx');
    docxItem.textContent = 'DOCX';

    const setOpen = (open) => {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    trigger.addEventListener('click', () => setOpen(menu.hidden));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        pdfItem.focus();
      }
    });
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        trigger.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!bar.contains(e.target)) setOpen(false);
    });

    pdfItem.addEventListener('click', async () => {
      setOpen(false);
      await downloadPdf();
    });
    docxItem.addEventListener('click', async () => {
      setOpen(false);
      try {
        await downloadDocx();
      } catch (e) {
        console.error('[doc-export] DOCX failed', e);
        alert('DOCX export failed: ' + (e && e.message ? e.message : e));
      }
    });

    menu.appendChild(pdfItem);
    menu.appendChild(docxItem);
    bar.appendChild(trigger);
    bar.appendChild(menu);
    document.body.appendChild(bar);
  }

  window.__csDocExport = {
    buildDocxBlob,
    buildPdfBlob,
    pageSizeFromCss,
    injectToolbar,
    printPdf,
    downloadPdf,
    downloadDocx,
  };

  const boot = () => injectToolbar();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(boot, 800);
})();
