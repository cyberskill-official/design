import React, { useEffect, useRef } from 'react';

const DC_ELEMENT_LABELS = {
  'tho|': 'Thổ · studio',
  'tho|sand': 'Thổ · sand',
  'tho|clay': 'Thổ · clay',
  'hoa|': 'Hỏa · ember',
  'hoa|plasma': 'Hỏa · plasma',
  'hoa|lava': 'Hỏa · lava',
  'thuy|': 'Thủy · river',
  'thuy|mist': 'Thủy · mist',
  'thuy|ocean': 'Thủy · ocean',
  'moc|': 'Mộc · leaf',
  'moc|bamboo': 'Mộc · bamboo',
  'moc|forest': 'Mộc · forest',
  'kim|': 'Kim · champagne',
  'kim|titanium': 'Kim · titanium',
  'kim|steel': 'Kim · steel',
};

/**
 * Forward the Storybook preview's 4-axis + Theme-attribute DOM state
 * (`data-theme`, `data-cs-element`, `data-cs-variant`, `data-cs-style`,
 * `data-cs-density`, `data-cs-contrast`, `lang`) into a same-origin iframe,
 * and call `__dcSetProps` / surface hooks when the frame exposes them.
 * Returns `false` if an async child runtime (DC compiler or Babel UI kit)
 * is still booting and needs a short follow-up frame sync.
 */
function applyToFrame(iframe) {
  if (!iframe) return true;
  try {
    const doc = iframe.contentDocument;
    const w = iframe.contentWindow;
    if (!doc || !doc.documentElement || !w) return true;
    const host = document.documentElement;
    const theme = host.getAttribute('data-theme') || 'light';
    const element = host.getAttribute('data-cs-element');
    const variant = host.getAttribute('data-cs-variant');
    const style = host.getAttribute('data-cs-style') || 'liquid-glass';
    const density = host.getAttribute('data-cs-density') || 'comfortable';
    const contrast = host.getAttribute('data-cs-contrast') || 'standard';
    const lang = host.getAttribute('lang') || 'vi';
    const uiLang = lang === 'en' ? 'en' : 'vi';
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    const root = doc.documentElement;
    root.setAttribute('data-theme', theme);
    if (element) root.setAttribute('data-cs-element', element);
    else root.removeAttribute('data-cs-element');
    if (variant) root.setAttribute('data-cs-variant', variant);
    else root.removeAttribute('data-cs-variant');
    root.setAttribute('data-cs-style', style);
    root.setAttribute('data-cs-density', density);
    root.setAttribute('data-cs-contrast', contrast);
    root.setAttribute('lang', lang);

    if (doc.body && doc.body.getAttribute('data-chrome') !== 'rtl-preview') {
      if (doc.body.hasAttribute('data-cs-element')) {
        if (element) doc.body.setAttribute('data-cs-element', element);
        else doc.body.removeAttribute('data-cs-element');
        if (variant) doc.body.setAttribute('data-cs-variant', variant);
        else doc.body.removeAttribute('data-cs-variant');
      }
      if (doc.body.hasAttribute('data-cs-style')) {
        doc.body.setAttribute('data-cs-style', style);
      }
    }

    // 1. Documentation reader (`docs/viewer.html`)
    if (typeof w.__csSetDocLang === 'function') {
      w.__csSetDocLang(uiLang);
    }

    // 2. Guideline surfaces (`guidelines/*.html`, including `atomic-view.html`)
    if (w.CS_GuidelinesLanguage && typeof w.CS_GuidelinesLanguage.setLanguage === 'function') {
      w.CS_GuidelinesLanguage.setLanguage(uiLang);
    }
    const atomicCanvas = doc.getElementById('canvas');
    if (atomicCanvas) {
      atomicCanvas.setAttribute('data-theme', theme);
      if (element) atomicCanvas.setAttribute('data-cs-element', element);
      else atomicCanvas.removeAttribute('data-cs-element');
      if (variant) atomicCanvas.setAttribute('data-cs-variant', variant);
      else atomicCanvas.removeAttribute('data-cs-variant');
      atomicCanvas.setAttribute('data-cs-style', style);
      atomicCanvas.setAttribute('data-cs-density', density);
      atomicCanvas.setAttribute('data-cs-contrast', contrast);
      atomicCanvas.setAttribute('lang', uiLang);
      const ctlMap = [
        ['ctl-theme', theme],
        ['ctl-element', `${element || 'tho'}|${variant || ''}`],
        ['ctl-style', style],
        ['ctl-density', density],
        ['ctl-contrast', contrast],
        ['ctl-lang', uiLang],
      ];
      for (const [id, val] of ctlMap) {
        const sel = doc.getElementById(id);
        if (sel && sel.value !== val) {
          sel.value = val;
          sel.dispatchEvent(new w.Event('change', { bubbles: true }));
        }
      }
    }

    // 3. `.dc.html` templates (`support.js`)
    const hasDcScript = !!doc.querySelector('script[type="text/x-dc"]');
    const r = w.__dcRootName && w.__dcRootName();
    if (r && w.__dcSetProps) {
      const dcKey = `${element || 'tho'}|${variant || ''}`;
      const dcElement = DC_ELEMENT_LABELS[dcKey] || 'Thổ · studio';
      w.__dcSetProps(r, { theme: resolvedTheme, element: dcElement, language: uiLang });
      const dcMount = doc.querySelector('#root > *');
      if (dcMount) {
        dcMount.setAttribute('data-cs-density', density);
        dcMount.setAttribute('data-cs-contrast', contrast);
        dcMount.setAttribute('data-cs-style', style);
      }
    } else if (hasDcScript && !w.__dcError) {
      return false;
    }

    // 4. Status Hub UI kit (`ui_kits/status-hub/index.html`)
    if (doc.querySelector('script[src="StatusHub.jsx"]')) {
      const app = doc.querySelector('.sh-app');
      if (!app) return false;
      const langBtns = doc.querySelectorAll('.sh-seg button');
      for (const btn of langBtns) {
        if (btn.textContent.trim().toLowerCase() === uiLang && btn.getAttribute('aria-pressed') !== 'true') {
          btn.click();
        }
      }
      const themeBtn = doc.querySelector('.sh-top__actions > .sh-icon-btn');
      if (themeBtn) {
        const label = (themeBtn.getAttribute('aria-label') || '').toLowerCase();
        const isCurrentlyDark = label.includes('light') || label.includes('sáng');
        if (isCurrentlyDark !== (resolvedTheme === 'dark')) {
          themeBtn.click();
        }
      }
      root.setAttribute('data-theme', theme);
    }

    // 5. Marketing Website UI kit (`ui_kits/website/index.html`)
    if (doc.querySelector('script[src="Website.jsx"]')) {
      const nav = doc.querySelector('.ws-nav');
      if (!nav) return false;
      const langBtns = doc.querySelectorAll('.ws-lang button');
      for (const btn of langBtns) {
        if (btn.textContent.trim().toLowerCase() === uiLang && btn.getAttribute('aria-pressed') !== 'true') {
          btn.click();
        }
      }
      const themeBtn = doc.querySelector('button[aria-label="Toggle dark theme"]');
      if (themeBtn) {
        const isCurrentlyDark = (themeBtn.textContent || '').includes('☀');
        if (isCurrentlyDark !== (resolvedTheme === 'dark')) {
          themeBtn.click();
        }
      }
      root.setAttribute('data-theme', theme);
    }

    // 6. Slide Deck UI kit (`ui_kits/deck/index.html`)
    if (typeof w.setLang === 'function') {
      w.setLang(uiLang);
    }

    // 7. Template Playground (`templates/playground.html`)
    const pgStage = doc.getElementById('stage');
    if (pgStage) {
      pgStage.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : '');
      pgStage.setAttribute('data-cs-element', element || 'tho');
      pgStage.setAttribute('data-cs-variant', variant || '');
      if (style) pgStage.setAttribute('data-cs-style', style);
      else pgStage.removeAttribute('data-cs-style');
      pgStage.setAttribute('data-cs-density', density);
      pgStage.setAttribute('data-cs-contrast', contrast);
      pgStage.setAttribute('lang', uiLang);
      const elSel = doc.getElementById('el');
      if (elSel && elSel.value !== (element || 'tho')) {
        elSel.value = element || 'tho';
        elSel.dispatchEvent(new w.Event('change', { bubbles: true }));
      }
      const vaSel = doc.getElementById('va');
      if (vaSel && vaSel.value !== (variant || '')) {
        vaSel.value = variant || '';
        vaSel.dispatchEvent(new w.Event('change', { bubbles: true }));
      }
      const thBtn = doc.getElementById('th');
      if (thBtn) {
        thBtn.setAttribute('aria-pressed', String(resolvedTheme === 'dark'));
        thBtn.textContent = resolvedTheme === 'dark' ? 'Dark' : 'Light';
      }
      const lgBtn = doc.getElementById('lg');
      if (lgBtn) {
        lgBtn.setAttribute('aria-pressed', String(uiLang === 'vi'));
        lgBtn.textContent = uiLang.toUpperCase();
      }
    }

    // 8. AI Cluster (`templates/ai-cluster-demo.html`) & message-listening frames
    if (doc.getElementById('cluster') || doc.querySelector('script[src*="_ds_bundle.js"]')) {
      w.postMessage(
        {
          type: '__cs_axes',
          theme,
          element: element || 'tho',
          variant: variant || '',
          style,
          density,
          contrast,
          lang: uiLang,
        },
        '*',
      );
    }
    return true;
  } catch {
    /* cross-origin or mid-navigation — ignore */
    return true;
  }
}

export function IframeSurface({ src, title, height = 'calc(100vh - 32px)', fullBleed = false }) {
  const ref = useRef(null);

  useEffect(() => {
    let retryTimer = null;
    let attempts = 0;

    const syncWithRetry = () => {
      if (retryTimer) clearTimeout(retryTimer);
      const done = applyToFrame(ref.current);
      if (!done && attempts < 50) {
        attempts += 1;
        retryTimer = setTimeout(syncWithRetry, 40);
      }
    };

    attempts = 0;
    syncWithRetry();

    const obs = new MutationObserver(() => {
      attempts = 0;
      syncWithRetry();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        'data-theme',
        'data-cs-element',
        'data-cs-variant',
        'data-cs-style',
        'data-cs-density',
        'data-cs-contrast',
        'lang',
      ],
    });
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const onScheme = () => {
      attempts = 0;
      syncWithRetry();
    };
    if (mq && mq.addEventListener) mq.addEventListener('change', onScheme);
    return () => {
      obs.disconnect();
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onScheme);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [src]);

  const handleLoad = () => {
    let attempts = 0;
    const tick = () => {
      const done = applyToFrame(ref.current);
      if (!done && attempts < 50) {
        attempts += 1;
        setTimeout(tick, 40);
      }
    };
    tick();
  };

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      onLoad={handleLoad}
      data-cs-fullbleed={fullBleed ? 'true' : undefined}
      style={{
        width: '100%',
        height: fullBleed ? '100vh' : height,
        border: fullBleed ? 'none' : '1px solid var(--cs-color-border-default)',
        borderRadius: fullBleed ? 0 : 'var(--cs-radius-lg)',
        background: 'var(--cs-color-surface-page)',
        display: 'block',
      }}
    />
  );
}
