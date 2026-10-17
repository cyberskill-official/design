// A requested visual-test state is a prerequisite, never an advisory fallback.
export async function applyTheme(page, theme, { timeout = 15000 } = {}) {
  if (!theme) return;
  await page.waitForFunction(
    () => typeof window.__dcSetProps === 'function' && typeof window.__dcRootName === 'function',
    null,
    { timeout }
  );
  const rootName = await page.evaluate(theme => {
    const name = window.__dcRootName();
    if (typeof name !== 'string' || !name.trim()) throw Error('Pixel theme: missing template root');
    window.__dcSetProps(name, { theme });
    return name;
  }, theme);
  await page.waitForFunction(({ rootName, theme }) => {
    const root = [...document.querySelectorAll('[data-sc-name]')]
      .find(node => node.getAttribute('data-sc-name') === rootName);
    const surface = root?.matches('[data-theme]') ? root : root?.querySelector(':scope > [data-theme]');
    const actual = surface?.getAttribute('data-theme');
    // DC templates such as Dashboard explicitly render an empty attribute for light.
    return actual === theme || (theme === 'light' && actual === '');
  }, { rootName, theme }, { timeout });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
