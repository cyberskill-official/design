import '../styles.css';

const DEFAULT_GLOBALS = {
  theme: 'light',
  element: 'tho|',
  language: 'vi',
  density: 'comfortable',
  contrast: 'standard',
  style: 'liquid-glass',
};

const STORY_DEMO_VI = {
  'Make a wish': 'Gửi điều ước',
  'Your wish is in review.': 'Điều ước của bạn đang được xem xét.',
  'Turn your will into real.': 'Hiện thực hoá ý chí.',
  Confidence: 'Độ tin cậy',
  'No wishes yet': 'Chưa có điều ước nào',
  'Capture the first one.': 'Hãy ghi lại điều ước đầu tiên.',
  Attachments: 'Tệp đính kèm',
  'PDF or PNG': 'PDF hoặc PNG',
  'Human approval required.': 'Cần người phụ trách phê duyệt.',
  'Build progress': 'Tiến độ dựng bản phát hành',
  'Describe your wish…': 'Mô tả điều ước của bạn…',
  'Wish shipped': 'Đã phát hành điều ước',
  'All gates green.': 'Tất cả cổng kiểm định đều đạt.',
  Element: 'Ngũ Hành',
  Opacity: 'Độ mờ',
  'Dark mode': 'Chế độ tối',
  Notifications: 'Thông báo',
  Team: 'Đội ngũ',
};

function ensureSbdocsStyles() {
  if (typeof document === 'undefined' || !document.head) return;
  if (document.getElementById('cs-sbdocs-layout')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'cs-sbdocs-layout';
  styleEl.textContent = `
    .sbdocs.sbdocs-wrapper {
      background: var(--cs-color-surface-page) !important;
      color: var(--cs-color-text-primary) !important;
      font-family: var(--cs-font-family-ui) !important;
      padding: clamp(24px, 3vw, 40px) clamp(20px, 4vw, 48px) !important;
    }
    .sbdocs.sbdocs-content {
      max-width: min(1180px, 100%) !important;
      width: 100% !important;
      color: var(--cs-color-text-primary) !important;
    }
    .sbdocs.sbdocs-wrapper:has(iframe[data-cs-fullbleed="true"]) {
      padding: 0 !important;
      min-height: 100vh !important;
    }
    .sbdocs.sbdocs-wrapper:has(iframe[data-cs-fullbleed="true"]) .sbdocs.sbdocs-content {
      max-width: none !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    [data-cs-story-canvas] > div[style*="max-width"] {
      max-width: min(1160px, 100%) !important;
      margin-inline: auto;
    }
  `;
  document.head.appendChild(styleEl);
}

function applyGlobalsToDom(rawGlobals = {}) {
  const globals = { ...DEFAULT_GLOBALS, ...rawGlobals };
  const theme = globals.theme || 'light';
  const [element, variant] = String(globals.element || 'tho|').split(/[|-]/);
  const language = globals.language || 'vi';
  const style = globals.style || 'liquid-glass';
  const density = globals.density || 'comfortable';
  const contrast = globals.contrast || 'standard';
  if (typeof document !== 'undefined' && document.documentElement) {
    ensureSbdocsStyles();
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (element) root.setAttribute('data-cs-element', element);
    else root.removeAttribute('data-cs-element');
    if (variant) root.setAttribute('data-cs-variant', variant);
    else root.removeAttribute('data-cs-variant');
    root.setAttribute('data-cs-style', style);
    root.setAttribute('data-cs-density', density);
    root.setAttribute('data-cs-contrast', contrast);
    root.setAttribute('lang', language);
    for (const node of document.querySelectorAll('.sbdocs-content')) {
      if (node.getAttribute('lang') !== language) {
        node.setAttribute('lang', language);
      }
    }
  }
  return { theme, element, variant, language, style, density, contrast };
}

function parseUrlGlobals() {
  if (typeof window === 'undefined' || !window.location) return {};
  try {
    const raw = new URLSearchParams(window.location.search).get('globals');
    if (!raw) return {};
    const out = {};
    for (const part of raw.split(';')) {
      const idx = part.indexOf(':');
      if (idx > 0) {
        const k = part.slice(0, idx).trim();
        const v = decodeURIComponent(part.slice(idx + 1).trim());
        if (k) out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

let activeGlobals = { ...DEFAULT_GLOBALS, ...parseUrlGlobals() };

function installChannelGlobalsSync() {
  if (typeof window === 'undefined') return;
  applyGlobalsToDom(activeGlobals);

  let hookedChannel = null;
  const syncFromStoreOrEvent = (payload) => {
    const storeGlobals = window.__STORYBOOK_PREVIEW__?.storyStoreValue?.userGlobals?.globals;
    const eventGlobals = payload?.globals || payload?.userGlobals;
    if (storeGlobals || eventGlobals) {
      activeGlobals = { ...activeGlobals, ...(storeGlobals || {}), ...(eventGlobals || {}) };
    }
    applyGlobalsToDom(activeGlobals);
  };

  const tryHookChannel = () => {
    const ch = window.__STORYBOOK_ADDONS_CHANNEL__;
    if (ch && ch !== hookedChannel && typeof ch.on === 'function') {
      hookedChannel = ch;
      for (const evt of ['globalsUpdated', 'setGlobals', 'updateGlobals', 'docsRendered', 'storyRendered']) {
        ch.on(evt, syncFromStoreOrEvent);
      }
      syncFromStoreOrEvent();
    }
  };

  tryHookChannel();
  if (!hookedChannel) {
    let retries = 0;
    const timer = setInterval(() => {
      tryHookChannel();
      retries += 1;
      if (hookedChannel || retries > 40) clearInterval(timer);
    }, 50);
  }

  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    const observeDocsRoot = () => {
      const docsRoot = document.getElementById('storybook-docs');
      if (!docsRoot) return;
      new MutationObserver(() => {
        const lang = document.documentElement.getAttribute('lang') || activeGlobals.language || 'vi';
        for (const node of docsRoot.querySelectorAll('.sbdocs-content')) {
          if (node.getAttribute('lang') !== lang) node.setAttribute('lang', lang);
        }
      }).observe(docsRoot, { childList: true, subtree: true });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeDocsRoot, { once: true });
    } else {
      observeDocsRoot();
    }
  }
}

installChannelGlobalsSync();

function localizeStoryArgs(args, language) {
  if (!args || typeof args !== 'object') return args;
  const next = { ...args };
  if ('lang' in next) {
    next.lang = language;
  }
  if (next.children === 'Human approval required.' && next.summary === undefined) {
    next.summary = next.children;
  }
  if (language === 'vi') {
    for (const key of ['children', 'summary', 'label', 'title', 'placeholder', 'hint', 'caption', 'aria-label']) {
      if (typeof next[key] === 'string' && STORY_DEMO_VI[next[key]]) {
        next[key] = STORY_DEMO_VI[next[key]];
      }
    }
  }
  return next;
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          'Docs',
          // cs-doc-sort:start
          [
  "Start",
  [
    "Introduction",
    "The Four Axes",
    "Voice & Language",
    "Library",
    "README",
    "SKILL",
    "llms.txt",
    "Contributing",
    "DESIGN"
  ],
  "Guides",
  [
    "Consuming",
    "Consumer grant",
    "Deploy",
    "Schema",
    "Conventions",
    "Storybook",
    "Live hub",
    "HR Suite sources",
    "Design styles",
    "Benchmark rubric",
    "Products",
    "Contrast",
    "Figma",
    "Template grammar",
    "Component API",
    "Runtime API",
    "Browser support",
    "Static HTML reference",
    "UI messages",
    "Component semantics",
    "Native refs",
    "Template content",
    "Floating panels",
    "Layered CSS",
    "Component CSS",
    "Guideline language",
    "Component state scenarios",
    "Template archetypes",
    "Component semantic contracts",
    "Shared template layouts"
  ],
  "Maintainers",
  [
    "Doctrine",
    "Decisions",
    "CI",
    [
      "CD"
    ],
    "Quality gates",
    "Sync",
    "Manual AT matrix",
    "Validation",
    "Releasing",
    "Upstream patches"
  ]
],
          // cs-doc-sort:end
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Elevation', 'Motion', 'Elements'],
          'Components',
          'Templates',
          [
            'Gallery',
            'Product',
            'Board',
            'Marketing',
            'Sales',
            'Delivery',
            'Tech',
            'Team',
            'Culture',
            'Finance',
            'Legal',
            'HR',
            'Documents',
            'Other',
          ],
          'Pages',
          'A11y',
          ['Focus ring', 'Touch targets', 'Reduced motion', 'Contrast (APCA)'],
          'I18n',
          'Release Notes',
          'Status',
          'Maintainer',
          ['Surfaces'],
          '*',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'data-theme — light (default) · dark · system (OS prefers-color-scheme)',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
    element: {
      name: 'Element',
      description:
        'Ngũ Hành product identity — all 15 element×variant packs (data-cs-element + optional data-cs-variant)',
      defaultValue: 'tho|',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'tho|', title: 'Thổ · studio (middle)' },
          { value: 'tho|sand', title: 'Thổ · sand (soft)' },
          { value: 'tho|clay', title: 'Thổ · clay (deep)' },
          { value: 'hoa|', title: 'Hỏa · ember (middle)' },
          { value: 'hoa|plasma', title: 'Hỏa · plasma (soft)' },
          { value: 'hoa|lava', title: 'Hỏa · lava (deep)' },
          { value: 'thuy|', title: 'Thủy · river (middle)' },
          { value: 'thuy|mist', title: 'Thủy · mist (soft)' },
          { value: 'thuy|ocean', title: 'Thủy · ocean (deep)' },
          { value: 'moc|', title: 'Mộc · leaf (middle)' },
          { value: 'moc|bamboo', title: 'Mộc · bamboo (soft)' },
          { value: 'moc|forest', title: 'Mộc · forest (deep)' },
          { value: 'kim|', title: 'Kim · champagne (middle)' },
          { value: 'kim|titanium', title: 'Kim · titanium (soft)' },
          { value: 'kim|steel', title: 'Kim · steel (deep)' },
        ],
        dynamicTitle: true,
      },
    },
    language: {
      name: 'Language',
      description:
        'lang attribute — BCP-47 primary subtags (vi · en)',
      defaultValue: 'vi',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'vi', title: 'Tiếng Việt' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      name: 'Density',
      description: 'data-cs-density Theme attribute (comfortable · compact) — TASK-IMP-027',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'collapse',
        items: [
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
        ],
        dynamicTitle: true,
      },
    },
    contrast: {
      name: 'Contrast',
      description: 'data-cs-contrast Theme attribute (standard · high) — TASK-IMP-027',
      defaultValue: 'standard',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'standard', title: 'Standard' },
          { value: 'high', title: 'High' },
        ],
        dynamicTitle: true,
      },
    },
    style: {
      name: 'Style',
      description: 'data-cs-style surface pack (liquid-glass default · matte-paper)',
      defaultValue: 'liquid-glass',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'liquid-glass', title: 'Liquid glass' },
          { value: 'matte-paper', title: 'Matte paper' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      activeGlobals = { ...activeGlobals, ...(context?.globals || {}) };
      const { theme, element, variant, language, style, density, contrast } = applyGlobalsToDom(
        context?.globals || activeGlobals,
      );
      const fullscreen = context?.parameters?.layout === 'fullscreen';
      const hasArgs = context && context.args && typeof context.args === 'object';
      const nextArgs = hasArgs ? localizeStoryArgs(context.args, language) : undefined;
      return (
        <div
          data-cs-story-canvas=""
          data-theme={theme}
          data-cs-element={element || undefined}
          data-cs-variant={variant || undefined}
          data-cs-style={style}
          data-cs-density={density}
          data-cs-contrast={contrast}
          lang={language}
          style={{
            minHeight: '100%',
            padding: fullscreen ? 0 : '20px clamp(16px, 3vw, 36px)',
            background: 'var(--cs-color-surface-page)',
            color: 'var(--cs-color-text-primary)',
            fontFamily: 'var(--cs-font-family-ui)',
          }}
        >
          {nextArgs ? <Story args={nextArgs} /> : <Story />}
        </div>
      );
    },
  ],
};

export default preview;
