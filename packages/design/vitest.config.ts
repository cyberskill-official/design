import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// Pre-bundle every exported Base UI part so the first run never re-optimizes mid-test ("Invalid hook call").
// resolved, not a hard-coded ../../node_modules path, so it works wherever npm hoists the package
const baseUiPkg = JSON.parse(readFileSync(createRequire(import.meta.url).resolve('@base-ui/react/package.json'), 'utf8')) as { exports: Record<string, unknown> };
const baseUiParts = Object.keys(baseUiPkg.exports)
  .filter(k => /^\.\/[a-z-]+$/.test(k) && !['./types', './utils', './package.json'].includes(k))
  .map(k => `@base-ui/react/${k.slice(2)}`);

// A fresh object per project (Vitest names each browser instance after its project).
// Reduced motion: overlays finish their fade-in before axe measures contrast.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
  instances: [{ browser: 'chromium' as const }],
});

// Two projects, both in real Chromium: component tests, and every Storybook story as a test (with a11y checks).
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: [...baseUiParts, '@phosphor-icons/react', 'recharts', '@tanstack/react-table', '@tanstack/react-virtual', 'react-day-picker', 'date-fns', 'react-hook-form'] },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['src/**/*.test.{ts,tsx}'], setupFiles: ['./src/test/setup.ts'], browser: browser(), sequence: { groupOrder: 0 } } },
      {
        extends: true,
        plugins: [storybookTest({ configDir: fileURLToPath(new URL('./.storybook', import.meta.url)) })],
        // Interaction tests drive real popups; one file at a time keeps their timing deterministic.
        test: { name: 'stories', browser: browser(), fileParallelism: false, sequence: { groupOrder: 1 } }, // after the unit project, not alongside it
      },
    ],
  },
});
