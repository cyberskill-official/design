/**
 * Test-only. Runs `run` as if the browser's runtime locale were `locale`: an `Intl.NumberFormat` made without a locale uses it.
 * Lets a test prove a component passes a fixed locale (the server's runtime locale is never the visitor's).
 */
export function withRuntimeLocale(locale: string, run: () => void): void {
  const Real = Intl.NumberFormat;
  Intl.NumberFormat = class extends Real {
    constructor(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) {
      super(locales ?? locale, options);
    }
  } as typeof Intl.NumberFormat;
  try {
    run();
  } finally {
    Intl.NumberFormat = Real;
  }
}
