import { defineConfig } from 'tsdown';

// One ESM build per entry point. Optional peers (recharts, TanStack, react-hook-form) stay external
// and only load from their own entry, so `@cyberskill/design` never pulls them in.
export default defineConfig({
  entry: {
    index: 'src/react/index.ts',
    charts: 'src/charts/index.ts',
    table: 'src/table/index.ts',
    forms: 'src/forms/index.ts',
  },
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  dts: true,
  clean: false, // dist/ also holds tokens and CSS from the other build steps
  sourcemap: true,
  // Components are interactive client components; keep the directive for React Server Components apps.
  banner: { js: "'use client';" },
  deps: { neverBundle: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react/, /^@phosphor-icons\/react/, /^recharts/, /^@tanstack\//, /^react-hook-form/, 'clsx'] },
});
