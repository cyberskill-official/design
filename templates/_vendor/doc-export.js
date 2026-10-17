/**
 * CyberSkill document export — one Download menu (PDF | DOCX).
 * PDF/DOCX are built from the live `.cs-sheet` so attachments match the HTML preview.
 * Loaded by ds-base.js when <meta name="omelette-owns-print"> is present.
 * No CDN; ZIP via CompressionStream (deflate-raw).
 */
(() => {
  const UMBER = '45210E';
  const DOC_FILL = 'FDE68A';
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

  function isDocFillColor(bg) {
    return bg && /rgb\(\s*253\s*,\s*230\s*,\s*138\s*\)/i.test(bg);
  }

  function docxBackground(el) {
    // Word has no CSS ancestor backgrounds. Preserve the flat color beneath
    // each run, compositing translucent layers onto the document's white paper.
    const element = el.nodeType === 3 ? el.parentElement : el;
    const sheet = element?.closest?.('.cs-sheet');
    const cell = element?.closest?.('td,th');
    const ancestors = [];
    for (let node = element; node; node = node.parentElement) {
      ancestors.push(node);
      if (node === sheet) break;
    }
    let rgb = [255, 255, 255];
    let cellBackground = null;
    for (const node of ancestors.reverse()) {
      const bg = getComputedStyle(node).backgroundColor;
      const match = bg && bg.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/);
      if (!match) continue;
      const alpha = match[4] == null ? 1 : Math.min(1, Math.max(0, Number(match[4])));
      rgb = rgb.map((value, i) => Number(match[i + 1]) * alpha + value * (1 - alpha));
      if (node === cell) cellBackground = rgb.slice();
    }
    const hex = rgb.map(value => Math.round(value).toString(16).padStart(2, '0')).join('').toUpperCase();
    if (hex !== 'FFFFFF') return hex;
    // A white child must paint over Word's shaded table cell, whereas an
    // unshaded paragraph already uses white paper without an explicit fill.
    return cellBackground?.some(value => Math.round(value) !== 255) ? hex : null;
  }

  function rgbToHex(rgb) {
    const m = rgb && String(rgb).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return null;
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    if (r < 25 && g < 25 && b < 25) return null;
    const hex = [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
    return hex === '000000' ? null : hex;
  }

  function halfPt(fontSize) {
    const px = parseFloat(fontSize);
    if (!px) return null;
    return Math.max(14, Math.round((px * 72) / 96) * 2);
  }

  function textRuns(el) {
    const parts = [];
    const walk = (node, italic, bold, color, fill, size) => {
      if (node.nodeType === 3) {
        const raw = node.textContent || '';
        if (!raw) return;
        if (!raw.replace(/\s+/g, '').length) {
          if (parts.length) parts.push({ t: ' ', italic, bold, color, fill, size });
          return;
        }
        parts.push({ t: raw.replace(/\s+/g, ' '), italic, bold, color, fill, size });
        return;
      }
      if (node.nodeType !== 1) return;
      if (isChrome(node)) return;
      const tag = node.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'svg') return;
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
      } else {
        nextColor = rgbToHex(st.color) || color;
      }
      const nextFill = docxBackground(node);
      const nextSize = halfPt(st.fontSize) || size;
      const kids = [...node.childNodes];
      for (let i = 0; i < kids.length; i++) {
        const before = parts.length;
        walk(kids[i], nextItalic, nextBold, nextColor, nextFill, nextSize);
        const nxt = kids[i + 1];
        if (parts.length > before && nxt) {
          const last = parts[parts.length - 1];
          const nextRaw = nxt.textContent || '';
          if (last && last.t && !/\s$/.test(last.t) && nextRaw.replace(/\s+/g, '') && !/^\s/.test(nextRaw)) {
            parts.push({
              t: ' ',
              italic: nextItalic,
              bold: nextBold,
              color: nextColor,
              fill: nextFill,
              size: nextSize,
            });
          }
        }
      }
    };
    const inherited = el.nodeType === 3 && el.parentElement ? getComputedStyle(el.parentElement) : null;
    walk(el, inherited?.fontStyle === 'italic', inherited ? Number(inherited.fontWeight) >= 600 : false,
      inherited ? rgbToHex(inherited.color) : null,
      inherited ? docxBackground(el) : null,
      inherited ? halfPt(inherited.fontSize) : null);
    const merged = [];
    for (const r of parts) {
      const prev = merged[merged.length - 1];
      if (
        prev &&
        prev.italic === r.italic &&
        prev.bold === r.bold &&
        prev.color === r.color &&
        prev.fill === r.fill &&
        prev.size === r.size
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
        if (r.fill) {
          rPr.push(`<w:shd w:val="clear" w:fill="${r.fill}"/>`);
          if (r.fill === DOC_FILL) rPr.push('<w:highlight w:val="yellow"/>');
        }
        if (r.size) rPr.push(`<w:sz w:val="${r.size}"/><w:szCs w:val="${r.size}"/>`);
        rPr.push('<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>');
        const pr = rPr.length ? `<w:rPr>${rPr.join('')}</w:rPr>` : '';
        return `<w:r>${pr}<w:t xml:space="preserve">${xmlEscape(r.t)}</w:t></w:r>`;
      })
      .join('');
  }

  function pPrXml(el, style) {
    const bits = [];
    if (style) bits.push(`<w:pStyle w:val="${style}"/>`);
    if (el) {
      const st = window.getComputedStyle(el);
      const ta = st.textAlign;
      if (ta === 'center') bits.push('<w:jc w:val="center"/>');
      else if (ta === 'right' || ta === 'end') bits.push('<w:jc w:val="right"/>');
      const before = Math.max(0, Math.round((parseFloat(st.marginTop) || 0) * 15));
      const after = Math.max(0, Math.round((parseFloat(st.marginBottom) || 0) * 15));
      if (before || after) bits.push(`<w:spacing w:before="${before}" w:after="${after}"/>`);
    }
    return bits.length ? `<w:pPr>${bits.join('')}</w:pPr>` : '';
  }

  function paraXml(el, style) {
    const runs = textRuns(el);
    if (!runs.length && !el.querySelector?.('br')) return '';
    return `<w:p>${pPrXml(el, style)}${runsToXml(runs)}</w:p>`;
  }

  function listContentXml(container, bag, depth, numbering = null, fillWhite = false) {
    let xml = '', pending = [], numbered = false;
    const flush = (force = false) => {
      if (!pending.some(r => r.t.trim()) && !force) { pending = []; return; }
      const num = numbering && !numbered ? `<w:numPr><w:ilvl w:val="${depth}"/><w:numId w:val="${numbering}"/></w:numPr>` : '';
      const indent = numbering ? `<w:ind w:left="${(depth + 1) * 360}"${num ? ' w:hanging="180"' : ''}/>` : '';
      const runs = fillWhite ? pending.map(r => ({...r,color:r.color || 'FFFFFF'})) : pending;
      xml += `<w:p><w:pPr>${num}${indent}</w:pPr>${runsToXml(runs)}</w:p>`;
      pending = []; numbered = true;
    };
    const visit = nodes => {
      for (const node of nodes) {
        if (node.nodeType === 3) { pending.push(...textRuns(node)); continue; }
        if (node.nodeType !== 1 || isChrome(node)) continue;
        const tag = node.tagName.toLowerCase();
        if (tag === 'ul' || tag === 'ol') {
          flush(!!numbering && !numbered);
          xml += listXml(node, bag, numbering ? depth + 1 : depth, fillWhite);
        } else if (tag === 'table') {
          flush(!!numbering && !numbered); xml += tableXml(node, bag);
        } else if (/^(div|section|p|h[1-6])$/.test(tag) || node.querySelector('ul,ol')) {
          flush(); visit([...node.childNodes]); flush();
        } else pending.push(...textRuns(node));
      }
    };
    visit([...container.childNodes]); flush(!!numbering && !numbered);
    return xml || '<w:p/>';
  }

  function listXml(list, bag, depth = 0, fillWhite = false) {
    if (depth > 8) throw new Error('DOCX supports at most nine nested list levels');
    const ordered = list.tagName.toLowerCase() === 'ol';
    const items = [...list.children].filter(n => n.tagName.toLowerCase() === 'li');
    const style = getComputedStyle(list).listStyleType;
    const formats = {decimal:'decimal','decimal-leading-zero':'decimalZero','lower-alpha':'lowerLetter','lower-latin':'lowerLetter','upper-alpha':'upperLetter','upper-latin':'upperLetter','lower-roman':'lowerRoman','upper-roman':'upperRoman',disc:'bullet',circle:'bullet',square:'bullet',none:'none'};
    const format = formats[style];
    if (!format) throw new Error('Unsupported DOCX list style: ' + style);
    const reversed = ordered && list.hasAttribute('reversed');
    let value = ordered && list.hasAttribute('start') ? list.start : reversed ? items.length : 1;
    let id;
    const register = start => {
      const id = bag.numbering.length + 1;
      bag.numbering.push({id,depth,start,format,marker:style==='circle'?'○':style==='square'?'▪':'•'});
      return id;
    };
    return items.map((item,index) => {
      const reset = ordered && item.hasAttribute('value');
      if (reset) value = item.value;
      if (!index || reset || reversed) id = register(value);
      const xml = listContentXml(item,bag,depth,id,fillWhite);
      value += reversed ? -1 : 1;
      return xml;
    }).join('');
  }

  function numberingXml(records) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      records.map(r => `<w:abstractNum w:abstractNumId="${r.id}"><w:multiLevelType w:val="multilevel"/>` +
        Array.from({length:9},(_,level)=>`<w:lvl w:ilvl="${level}"><w:start w:val="1"/><w:numFmt w:val="${r.format}"/><w:lvlText w:val="${r.format==='bullet'?r.marker:r.format==='none'?'':'%'+(level+1)+'.'}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${(level+1)*360}"/></w:tabs><w:ind w:left="${(level+1)*360}" w:hanging="180"/></w:pPr></w:lvl>`).join('') + '</w:abstractNum>').join('') +
      records.map(r=>`<w:num w:numId="${r.id}"><w:abstractNumId w:val="${r.id}"/><w:lvlOverride w:ilvl="${r.depth}"><w:startOverride w:val="${r.start}"/></w:lvlOverride></w:num>`).join('') + '</w:numbering>';
  }

  function cellInnerXml(cell, fillWhite, bag) {
    if (cell.matches('ul,ol')) return listXml(cell,bag,0,fillWhite);
    if (cell.querySelector('ul,ol')) return listContentXml(cell,bag,0,null,fillWhite);
    const blocks = [...cell.children].filter((c) =>
      /^(DIV|P|UL|OL|H1|H2|H3|H4|H5|H6)$/.test(c.tagName),
    );
    const paint = (runs) =>
      runs.map((r) => (fillWhite ? { ...r, color: r.color || 'FFFFFF' } : r));
    if (blocks.length && blocks.length === cell.children.length &&
        ![...cell.childNodes].some(node => node.nodeType === 3 && node.textContent.trim())) {
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

  function cellColSpan(cell) {
    return cell.colSpan;
  }

  function tableLayout(rows) {
    let group = null, active = [];
    return rows.map((row, index) => {
      if (row.parentElement !== group) { group = row.parentElement; active = []; }
      active = active.filter(entry => entry.end >= index);
      const entries = active.map(entry => ({...entry, continuation:true}));
      const occupied = new Set(entries.flatMap(e => Array.from({length:e.span},(_,i)=>e.column+i)));
      let column = 0;
      for (const cell of row.cells) {
        while (occupied.has(column)) column++;
        const span = cellColSpan(cell);
        for (let i=0;i<span;i++) {
          if (occupied.has(column+i)) throw new Error('Overlapping HTML table spans cannot be exported to DOCX');
          occupied.add(column+i);
        }
        let available = 1;
        while (rows[index+available]?.parentElement === group) available++;
        const height = cell.rowSpan === 0 ? available : Math.min(cell.rowSpan, available);
        const entry = {cell,column,span,height,end:index+height-1,continuation:false};
        entries.push(entry);
        if (height > 1) active.push(entry);
        column += span;
      }
      return entries.sort((a,b)=>a.column-b.column);
    });
  }

  function tableXml(table, bag) {
    // HTMLTableElement.rows provides header/body/footer order even when tfoot
    // precedes tbody in source, and excludes rows belonging to nested tables.
    const rows = [...table.rows];
    if (!rows.length) return '';
    const layout = tableLayout(rows);
    const gridCols = Math.max(...layout.flat().map(e=>e.column+e.span), 1);
    let colWidths;
    if (gridCols === 2) {
      const tableW = table.getBoundingClientRect().width || 1;
      const sample = rows.find((r) => r.cells.length >= 2) || rows[0];
      const c0 = sample && sample.cells[0];
      const ratio = c0 ? c0.getBoundingClientRect().width / tableW : 0.28;
      const col0 = Math.round(9000 * Math.min(0.42, Math.max(0.18, ratio)));
      colWidths = [col0, 9000 - col0];
    } else {
      const even = Math.floor(9000 / gridCols);
      colWidths = Array.from({ length: gridCols }, () => even);
    }
    const gridColsXml = colWidths.map((w) => `<w:gridCol w:w="${w}"/>`).join('');
    let xml = `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>
      <w:top w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:left w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:bottom w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:right w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:insideH w:val="single" w:sz="4" w:color="C9B8A8"/>
      <w:insideV w:val="single" w:sz="4" w:color="C9B8A8"/>
    </w:tblBorders></w:tblPr><w:tblGrid>${gridColsXml}</w:tblGrid>`;
    const emptyCell = (column, span) => {
      const width = colWidths.slice(column,column+span).reduce((a,b)=>a+b,0);
      return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span>1?`<w:gridSpan w:val="${span}"/>`:''}</w:tcPr><w:p/></w:tc>`;
    };
    for (const entries of layout) {
      xml += '<w:tr>';
      let nextColumn = 0;
      for (const entry of entries) {
        const {cell,column,span,continuation,height} = entry;
        if (column > nextColumn) xml += emptyCell(nextColumn,column-nextColumn);
        nextColumn = column + span;
        const bg = window.getComputedStyle(cell).backgroundColor;
        const umberFill = bg && /rgb\(\s*69\s*,\s*33\s*,\s*14\s*\)/.test(bg);
        const yellowFill = isDocFillColor(bg);
        const spanXml = span > 1 ? `<w:gridSpan w:val="${span}"/>` : '';
        const fillXml = umberFill
          ? `<w:shd w:val="clear" w:fill="${UMBER}"/>`
          : yellowFill
            ? `<w:shd w:val="clear" w:fill="${DOC_FILL}"/>`
            : '';
        const tw = colWidths.slice(column, column + span).reduce((n, w) => n + w, 0);
        const mergeXml = continuation ? '<w:vMerge w:val="continue"/>' : height > 1 ? '<w:vMerge w:val="restart"/>' : '';
        xml += `<w:tc><w:tcPr><w:tcW w:w="${tw}" w:type="dxa"/>${spanXml}${mergeXml}${fillXml}</w:tcPr>${continuation ? '<w:p/>' : cellInnerXml(cell, umberFill, bag)}</w:tc>`;
      }
      if (nextColumn < gridCols) xml += emptyCell(nextColumn,gridCols-nextColumn);
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

  function gridAsTable(el, bag) {
    const cols = gridColCount(el);
    if (!cols) return '';
    const kids = [...el.children].filter((c) => c.nodeType === 1 && !isChrome(c));
    if (kids.length < 2) return '';
    // Preserve numeric, browser-resolved track proportions; other track syntax
    // keeps the historical equal-column fallback. This does not model spans.
    const tracks = window.getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/);
    const pixels = tracks.map(track => /^\d+(?:\.\d+)?px$/.test(track) ? parseFloat(track) : NaN);
    const total = pixels.reduce((sum, value) => sum + value, 0);
    let colWidths = Array.from({ length: cols }, () => Math.floor(9000 / cols));
    if (pixels.length === cols && pixels.every(Number.isFinite) && total > 0) {
      const scaled = pixels.map(value => 9000 * value / total);
      colWidths = scaled.map(Math.floor);
      const remainder = 9000 - colWidths.reduce((sum, value) => sum + value, 0);
      const ranked = scaled.map((value, index) => ({ index, fraction: value - colWidths[index] }))
        .filter(({ index }) => pixels[index] > 0)
        .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
      for (let i = 0; i < remainder; i++) colWidths[ranked[i].index] += 1;
    }
    const gridColsXml = colWidths.map(width => `<w:gridCol w:w="${width}"/>`).join('');
    let xml = `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>
      <w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>
      <w:insideH w:val="nil"/><w:insideV w:val="nil"/>
    </w:tblBorders></w:tblPr><w:tblGrid>${gridColsXml}</w:tblGrid>`;
    for (let i = 0; i < kids.length; i += cols) {
      xml += '<w:tr>';
      for (let c = 0; c < cols; c++) {
        const src = kids[i + c];
        const inner = src ? cellInnerXml(src, false, bag) : `<w:p>${runsToXml([])}</w:p>`;
        xml += `<w:tc><w:tcPr><w:tcW w:w="${colWidths[c]}" w:type="dxa"/></w:tcPr>${inner}</w:tc>`;
      }
      xml += '</w:tr>';
    }
    xml += '</w:tbl>';
    return xml;
  }

  function drawingRun(relId, cx, cy) {
    return `<w:r><w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0">
        <wp:extent cx="${cx}" cy="${cy}"/>
        <wp:docPr id="${relId.replace(/\D/g, '') || '1'}" name="img"/>
        <a:graphic>
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic>
              <pic:nvPicPr><pic:cNvPr id="0" name="image.png"/><pic:cNvPicPr/></pic:nvPicPr>
              <pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
              <pic:spPr>
                <a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>
                <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
              </pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing></w:r>`;
  }

  function findSvg(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.tagName.toLowerCase() === 'svg') return el;
    const light = el.querySelector?.('svg');
    if (light) return light;
    if (el.shadowRoot) {
      const sh = el.shadowRoot.querySelector('svg');
      if (sh) return sh;
    }
    for (const c of el.children || []) {
      const nested = findSvg(c);
      if (nested) return nested;
    }
    return null;
  }

  async function addSvgPng(svg, bag) {
    const box = svg.getBoundingClientRect();
    const cssW = Math.max(box.width || parseFloat(svg.getAttribute('width')) || 18, 12);
    const cssH = Math.max(box.height || parseFloat(svg.getAttribute('height')) || cssW, 12);
    const scale = 3;
    const w = Math.max(1, Math.round(cssW * scale));
    const h = Math.max(1, Math.round(cssH * scale));
    try {
      const clone = svg.cloneNode(true);
      clone.setAttribute('width', String(cssW));
      clone.setAttribute('height', String(cssH));
      if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const xml = new XMLSerializer().serializeToString(clone);
      if (/foreignObject/i.test(xml)) return '';
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      try {
        const img = await loadImage(url);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const bytes = dataUrlToBytes(c.toDataURL('image/png'));
        const n = bag.media.length + 1;
        const relId = `rIdImg${n}`;
        bag.media.push({ name: `word/media/image${n}.png`, bytes, relId });
        const emu = Math.round(cssW * 9525);
        return drawingRun(relId, emu, Math.round(emu * (h / w)));
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (_) {
      return '';
    }
  }

  async function groupInnerXml(els, bag) {
    let drawings = '';
    const textEls = [];
    for (const el of els) {
      const svg = findSvg(el);
      if (svg) drawings += await addSvgPng(svg, bag);
      if (!svg || textRuns(el).length) textEls.push(el);
    }
    let runs = [];
    for (const el of textEls) {
      const next = textRuns(el);
      if (
        runs.length &&
        next.length &&
        !/\s$/.test(runs[runs.length - 1].t) &&
        !/^\s/.test(next[0].t)
      ) {
        runs.push({
          t: ' ',
          italic: next[0].italic,
          bold: next[0].bold,
          color: next[0].color,
          fill: next[0].fill,
          size: next[0].size,
        });
      }
      runs.push(...next);
    }
    if (!drawings && !runs.length) return `<w:p>${runsToXml([])}</w:p>`;
    return `<w:p>${pPrXml(textEls[0] || els[0])}${drawings}${runsToXml(runs)}</w:p>`;
  }

  async function flexAsTable(el, bag) {
    if (el.querySelector('ul,ol')) return '';
    const st = window.getComputedStyle(el);
    if (st.display !== 'flex' && st.display !== 'inline-flex') return '';
    const dir = st.flexDirection || 'row';
    if (dir === 'column' || dir === 'column-reverse') return '';
    const kids = [...el.children].filter((c) => c.nodeType === 1 && !isChrome(c));
    if (kids.length < 2) return '';
    const hasLogo = kids.some((c) => {
      const t = c.tagName.toLowerCase();
      return t === 'svg' || t === 'x-import' || !!findSvg(c);
    });
    if (!hasLogo && kids.length !== 2) return '';
    let split = -1;
    for (let i = 1; i < kids.length; i++) {
      const inline = kids[i].style?.marginLeft || '';
      const attr = kids[i].getAttribute?.('style') || '';
      if (inline === 'auto' || /margin-left\s*:\s*auto/i.test(attr)) {
        split = i;
        break;
      }
    }
    if (split < 0) {
      if (kids.length === 2) split = 1;
      else return '';
    }
    const left = await groupInnerXml(kids.slice(0, split), bag);
    const right = await groupInnerXml(kids.slice(split), bag);
    return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>
      <w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/>
      <w:insideH w:val="nil"/><w:insideV w:val="nil"/>
    </w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="6200"/><w:gridCol w:w="2800"/></w:tblGrid>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:w="6200" w:type="dxa"/></w:tcPr>${left}</w:tc>
      <w:tc><w:tcPr><w:tcW w:w="2800" w:type="dxa"/></w:tcPr>${right}</w:tc>
    </w:tr></w:tbl>`;
  }

  async function sheetBodyXml(sheet, bag) {
    const blocks = [];
    const visit = async (nodes) => {
      for (const el of nodes) {
        if (el.nodeType === 3) {
          if (el.textContent.trim()) blocks.push(`<w:p>${pPrXml(el.parentElement)}${runsToXml(textRuns(el))}</w:p>`);
          continue;
        }
        if (el.nodeType !== 1) continue;
        if (isChrome(el)) continue;
        const tag = el.tagName.toLowerCase();
        if (tag === 'ul' || tag === 'ol') { blocks.push(listXml(el,bag)); continue; }
        const svg = findSvg(el);
        if (svg && (tag === 'svg' || !textRuns(el).length)) {
          const drawing = await addSvgPng(svg, bag);
          if (drawing) blocks.push(`<w:p>${drawing}</w:p>`);
          continue;
        }
        if (tag === 'table') {
          blocks.push(tableXml(el, bag));
          continue;
        }
        if (/^h[1-6]$/.test(tag)) {
          blocks.push(paraXml(el, tag === 'h1' ? 'Heading1' : 'Heading2'));
          continue;
        }
        const gridXml = gridAsTable(el, bag);
        if (gridXml) {
          blocks.push(gridXml);
          continue;
        }
        const flexXml = await flexAsTable(el, bag);
        if (flexXml) {
          blocks.push(flexXml);
          continue;
        }
        if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'li') {
          const hasBlock = [...el.children].some((c) =>
            /^(DIV|TABLE|SECTION|UL|OL|H1|H2|H3|H4|H5|H6|X-IMPORT)$/.test(c.tagName),
          );
          if (hasBlock && tag !== 'p') {
            await visit([...el.childNodes]);
          } else {
            const px = paraXml(el);
            if (px) blocks.push(px);
          }
          continue;
        }
        const leftover = paraXml(el);
        if (leftover) blocks.push(leftover);
        else await visit([...el.childNodes]);
      }
    };
    await visit([...sheet.childNodes]);
    return blocks.filter(Boolean).join('');
  }

  function headerFooterText() {
    // Sheet already carries lockup + footer. Word chrome stays empty so the
    // file does not duplicate the card into header/footer.
    return { header: '', footer: '' };
  }

  async function buildDocxBlob(sheet) {
    const page = pageSizeFromCss();
    const enc = new TextEncoder();
    const { header, footer } = headerFooterText();
    const bag = { media: [], numbering: [] };
    const body = await sheetBodyXml(sheet, bag);

    const pngDefault = bag.media.length
      ? `\n  <Default Extension="png" ContentType="image/png"/>`
      : '';
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>${pngDefault}
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const mediaRels = bag.media
      .map(
        (m) =>
          `  <Relationship Id="${m.relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name.split('/').pop()}"/>`,
      )
      .join('\n');
    const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
<Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
${mediaRels}
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
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:qFormat/>
    <w:rPr><w:b/><w:color w:val="${UMBER}"/><w:sz w:val="24"/></w:rPr>
  </w:style>
</w:styles>`;

    const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>${header ? `<w:r><w:t xml:space="preserve">${xmlEscape(header)}</w:t></w:r>` : ''}</w:p>
</w:hdr>`;

    const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>${footer ? `<w:r><w:t xml:space="preserve">${xmlEscape(footer)}</w:t></w:r>` : ''}</w:p>
</w:ftr>`;

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${body || '<w:p><w:r><w:t></w:t></w:r></w:p>'}
    <w:sectPr>
      <w:headerReference w:type="default" r:id="rId2"/>
      <w:footerReference w:type="default" r:id="rId3"/>
      <w:pgSz w:w="${page.w}" w:h="${page.h}"/>
      <w:pgMar w:top="360" w:right="360" w:bottom="360" w:left="360" w:header="0" w:footer="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    const zip = await buildZip([
      { name: '[Content_Types].xml', bytes: enc.encode(contentTypes) },
      { name: '_rels/.rels', bytes: enc.encode(rels) },
      { name: 'word/document.xml', bytes: enc.encode(documentXml) },
      { name: 'word/_rels/document.xml.rels', bytes: enc.encode(docRels) },
      { name: 'word/styles.xml', bytes: enc.encode(styles) },
      { name: 'word/numbering.xml', bytes: enc.encode(numberingXml(bag.numbering)) },
      { name: 'word/header1.xml', bytes: enc.encode(headerXml) },
      { name: 'word/footer1.xml', bytes: enc.encode(footerXml) },
      ...bag.media.map((m) => ({ name: m.name, bytes: m.bytes })),
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

  function imagePagesToPdf(pages, mediaW, mediaH) {
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
      const filter = page.filter || 'FlateDecode';
      pushObj(
        imgId,
        `<< /Type /XObject /Subtype /Image /Width ${page.w} /Height ${page.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /${filter} /Length ${page.bytes.length} >>`,
        page.bytes,
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

  function canvasRgb(ctx, w, h) {
    const src = ctx.getImageData(0, 0, w, h).data;
    const rgb = new Uint8Array(w * h * 3);
    let j = 0;
    for (let i = 0; i < src.length; i += 4) {
      rgb[j++] = src[i];
      rgb[j++] = src[i + 1];
      rgb[j++] = src[i + 2];
    }
    return rgb;
  }

  async function deflateZlib(u8) {
    const cs = new CompressionStream('deflate');
    const writer = cs.writable.getWriter();
    writer.write(u8);
    writer.close();
    const ab = await new Response(cs.readable).arrayBuffer();
    return new Uint8Array(ab);
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
    let scale = 3;
    let painted;
    try {
      painted = await paintSheet(sheet, scale);
    } catch (_) {
      scale = 2;
      painted = await paintSheet(sheet, scale);
    }
    const { canvas, ctx } = painted;
    let ink = true;
    try {
      ink = canvasHasInk(ctx, canvas.width, Math.min(canvas.height, 400));
    } catch (_) {
      ink = true;
    }
    if (!ink) throw new Error('blank-raster');
    // One PDF page = the whole card. Lossless Flate RGB (not JPEG) so type
    // stays sharp; scale 3 ≈ 288 dpi on the A4-width MediaBox.
    const ptW = page.ptW;
    const ptH = ptW * (canvas.height / canvas.width);
    try {
      const rgb = canvasRgb(ctx, canvas.width, canvas.height);
      const bytes = await deflateZlib(rgb);
      return imagePagesToPdf(
        [{ bytes, w: canvas.width, h: canvas.height, filter: 'FlateDecode' }],
        ptW,
        ptH,
      );
    } catch (_) {
      const jpeg = dataUrlToBytes(canvas.toDataURL('image/jpeg', 0.95));
      return imagePagesToPdf(
        [{ bytes: jpeg, w: canvas.width, h: canvas.height, filter: 'DCTDecode' }],
        ptW,
        ptH,
      );
    }
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
      @media (pointer: coarse){
        [data-omelette-chrome="export"] button{min-width:44px;min-height:44px}
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
