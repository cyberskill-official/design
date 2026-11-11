import type { Preview } from '@storybook/react-vite';
import '../dist/tokens.css';
import '../src/css/base.css';
import './preview.css';

import.meta.glob('../src/css/components/*.css', { eager: true });

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
            <div data-theme="light" className="sb-stage"><Story /></div>
            <div data-theme="dark" className="sb-stage"><Story /></div>
          </div>
        );
      }
      return <div data-theme={theme} className="sb-stage"><Story /></div>;
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
