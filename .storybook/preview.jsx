import '../styles.css';

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
    "Releasing"
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
          { value: 'hoa|plasma', title: 'Hỏa · plasma (deep)' },
          { value: 'hoa|lava', title: 'Hỏa · lava (soft)' },
          { value: 'thuy|', title: 'Thủy · river (middle)' },
          { value: 'thuy|mist', title: 'Thủy · mist (soft)' },
          { value: 'thuy|ocean', title: 'Thủy · ocean (deep)' },
          { value: 'moc|', title: 'Mộc · leaf (middle)' },
          { value: 'moc|bamboo', title: 'Mộc · bamboo (soft)' },
          { value: 'moc|forest', title: 'Mộc · forest (deep)' },
          { value: 'kim|', title: 'Kim · champagne (middle)' },
          { value: 'kim|titanium', title: 'Kim · titanium (deep)' },
          { value: 'kim|steel', title: 'Kim · steel (soft)' },
        ],
        dynamicTitle: true,
      },
    },
    language: {
      name: 'Language',
      description:
        'lang attribute — BCP-47 primary subtags (en · vi required; ja = TASK-IMP-026 spike)',
      defaultValue: 'vi',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'vi', title: 'Tiếng Việt' },
          { value: 'ja', title: '日本語 (spike)' },
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
      description: 'data-cs-style surface pack (sole pack today: liquid-glass)',
      defaultValue: 'liquid-glass',
      toolbar: {
        icon: 'mirror',
        items: [{ value: 'liquid-glass', title: 'Liquid glass' }],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      const [element, variant] = String(context.globals.element || 'tho|').split('|');
      const language = context.globals.language || 'vi';
      const style = context.globals.style || 'liquid-glass';
      const density = context.globals.density || 'comfortable';
      const contrast = context.globals.contrast || 'standard';
      const fullscreen = context.parameters.layout === 'fullscreen';
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-cs-style', style);
        root.setAttribute('data-cs-density', density);
        root.setAttribute('data-cs-contrast', contrast);
      }
      return (
        <div
          data-theme={theme}
          data-cs-element={element || undefined}
          data-cs-variant={variant || undefined}
          data-cs-style={style}
          data-cs-density={density}
          data-cs-contrast={contrast}
          lang={language}
          style={{
            minHeight: '100%',
            padding: fullscreen ? 0 : 16,
            background: 'var(--cs-color-surface-page)',
            color: 'var(--cs-color-text-primary)',
            fontFamily: 'var(--cs-font-family-ui)',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
