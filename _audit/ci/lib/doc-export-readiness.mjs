/** Capture actual rendered document content; never fall back to export chrome. */
export async function readLiveDocExport(page, { timeout = 90000 } = {}) {
  const snapshot = await page.waitForFunction(() => {
    const sheet = document.querySelector('.cs-sheet');
    const bar = document.querySelector('[data-omelette-chrome="export"]');
    const rootName = typeof window.__dcRootName === 'function' ? window.__dcRootName() : null;
    const committedRoot = sheet?.closest('[data-sc-name]');
    if (!sheet || !bar || !rootName || committedRoot?.getAttribute('data-sc-name') !== rootName ||
        typeof window.__csDocExport?.buildDocxBlob !== 'function') return false;
    const text = sheet.innerText || '';
    if (text.trim().length <= 40 || text.includes('{{')) return false;
    const trigger = bar.querySelector('[data-cs-export="trigger"]');
    const menu = bar.querySelector('[data-cs-export="menu"]');
    const topButtons = [...bar.querySelectorAll(':scope > button')];
    return {
      toolbar: true,
      trigger: !!(trigger && /Tải|Download/i.test(trigger.textContent || '')),
      menuPdf: !!(menu && menu.querySelector('[data-cs-export="pdf"]')),
      menuDocx: !!(menu && menu.querySelector('[data-cs-export="docx"]')),
      dualTopButtons: topButtons.length === 2,
      counselBanner: /Counsel review required before real use — commercial framework/.test(text),
      hasVn: /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text),
      hasEn: /the|and|agreement|party|cyberSkill|CyberSkill/i.test(text),
      sample: text.replace(/\s+/g, ' ').trim().slice(0, 240),
    };
  }, null, { timeout });
  try { return await snapshot.jsonValue(); }
  finally { await snapshot.dispose(); }
}
