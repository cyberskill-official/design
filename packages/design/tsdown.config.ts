import { defineConfig } from 'tsdown';

// One ESM file per source module (unbundle), so apps load only the components they import.
// Optional peers (recharts, TanStack, react-hook-form, react-day-picker) stay external and only load from their own entry.
//
// 'use client' goes on component modules only, never on the entry barrels or pure helpers. A barrel marked
// 'use client' makes Next.js ship every export to the browser (measured: Button + Badge cost 144 kB gzip that way,
// 6 kB this way), and pure helpers (cx, formatDate…) stay callable in Server Components.
// `imports` lists externals by package id and our own output files by path (`react/Button.js`), hence the .js check.
const CLIENT_LIBS = /^(react|react-dom)(\/|$)|^@base-ui\/|^@phosphor-icons\/react$|^react-day-picker|^recharts|^@tanstack\/react|^react-hook-form/;
// Purely visual components: no hooks, no event handlers, no Base UI, icons from @phosphor-icons/react/ssr. They get no
// 'use client', so a Server Component renders them without shipping or hydrating any JavaScript.
// The benchmark (D20) fails if one of these starts using a hook or loses this status.
export const SERVER_SAFE = ['Kbd', 'Spinner', 'Skeleton', 'EmptyState', 'Badge', 'Stat', 'Stepper', 'Breadcrumbs', 'Prose'];
const serverSafe = (id: string | null) => !!id && SERVER_SAFE.some(n => id.endsWith(`/react/${n}.tsx`));

export default defineConfig({
  entry: {
    index: 'src/react/index.ts',
    charts: 'src/charts/index.ts',
    table: 'src/table/index.ts',
    forms: 'src/forms/index.ts',
    date: 'src/date/index.ts',
    utils: 'src/utils/index.ts',
  },
  unbundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  dts: true,
  clean: false, // dist/ also holds tokens and CSS from the other build steps (the build script empties it first)
  sourcemap: true,
  outputOptions: {
    banner: (chunk: { facadeModuleId: string | null; imports: string[] }) =>
      !serverSafe(chunk.facadeModuleId) && (chunk.facadeModuleId?.endsWith('.tsx') || chunk.imports.some(id => !id.endsWith('.js') && CLIENT_LIBS.test(id))) ? "'use client';" : '',
  },
  deps: { neverBundle: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react/, /^@phosphor-icons\/react/, /^recharts/, /^@tanstack\//, /^react-hook-form/, /^react-day-picker/, /^date-fns/, 'clsx'] },
});
