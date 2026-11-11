import type { Preview } from '@storybook/react-vite';
import '../dist/tokens.css';
import '../src/css/base.css';
import './preview.css';
import { ThemeScope } from '../src/react/ThemeScope';

import.meta.glob('../src/css/components/*.css', { eager: true });
import '../src/css/motion.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Ink & Gold theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }, { value: 'side-by-side', title: 'Side by side' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string;
      if (theme === 'side-by-side') {
        return (
          <div className="sb-split">
            <ThemeScope theme="light" className="sb-stage"><Story /></ThemeScope>
            <ThemeScope theme="dark" className="sb-stage"><Story /></ThemeScope>
          </div>
        );
      }
      // ThemeScope (not a bare data-theme div) so menus, selects and dialogs portalled to <body> get the theme too.
      return <ThemeScope theme={theme === 'dark' ? 'dark' : 'light'} className="sb-stage"><Story /></ThemeScope>;
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    // Accessibility violations fail the story test, not just warn.
    a11y: { test: 'error' },
  },
};

export default preview;
