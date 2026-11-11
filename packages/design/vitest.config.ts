import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'node:url';

// A fresh object per project: Vitest names each browser instance after its project.
const browser = () => ({ enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' as const }] });

// Two projects, both in real Chromium: component tests, and every Storybook story as a test (with a11y checks).
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['src/**/*.test.{ts,tsx}'], setupFiles: ['./src/test/setup.ts'], browser: browser() } },
      {
        extends: true,
        plugins: [storybookTest({ configDir: fileURLToPath(new URL('./.storybook', import.meta.url)) })],
        test: { name: 'stories', browser: browser() },
      },
    ],
  },
});
