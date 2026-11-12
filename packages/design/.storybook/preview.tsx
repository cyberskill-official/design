import type { Preview } from '@storybook/react-vite';
// The stylesheet exactly as apps get it (tokens, then base and components in cascade layers, then reduced motion),
// so stories, their tests and the benchmark measure what ships. `npm run storybook` rebuilds it on every CSS edit.
import '../dist/styles.css';
import './preview.css';
import { ThemeScope } from '../src/react/ThemeScope';

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
    // Base UI's focus guards are aria-hidden and focusable on purpose (they pass focus on); axe reports them on some runs
    // while a popover is open, which made the NestedThemes story fail about one run in three.
    a11y: { test: 'error', context: { exclude: ['[data-base-ui-focus-guard]'] } },
  },
};

export default preview;
