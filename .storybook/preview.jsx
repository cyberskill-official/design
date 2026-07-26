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
          [
            'Introduction',
            'Consuming',
            'Deploy',
            'Conventions',
            'Design styles',
            'Products',
            'Schema',
            'Figma',
            'Contrast',
            'Voice & Language',
            'The Three Axes',
          ],
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Elevation', 'Motion', 'Elements'],
          'Components',
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
    docs: {
      description: {
        component:
          'Product Storybook at `/` (host-only). Portable consumers use styles.css + _ds_bundle.js / ESM — never Storybook.',
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'data-theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
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
      description: 'lang attribute (bilingual components)',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'vi', title: 'Tiếng Việt' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      const [element, variant] = String(context.globals.element || 'tho|').split('|');
      const language = context.globals.language || 'en';
      const fullscreen = context.parameters.layout === 'fullscreen';
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (theme === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
      }
      return (
        <div
          data-theme={theme === 'dark' ? 'dark' : undefined}
          data-cs-element={element || undefined}
          data-cs-variant={variant || undefined}
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
