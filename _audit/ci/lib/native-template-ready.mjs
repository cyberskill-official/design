/** Readiness for explicitly declared static-logo DC documents. */
export async function waitForNativeTemplate(page) {
  await page.waitForFunction(() => {
    const declaration = document.querySelector('meta[name="cs-template-library"]');
    const logos = [...document.querySelectorAll('img[data-cs-official-logo]')];
    return declaration?.content === 'static-logo' &&
      typeof window.__dcRootName === 'function' &&
      document.querySelector('[data-sc-name]') &&
      !document.querySelector('.sc-placeholder, .sc-logic-error') &&
      logos.length > 0 && logos.every(logo => logo.complete && logo.naturalWidth > 0 &&
        logo.currentSrc === new URL('../../assets/logo-mark.svg', location.href).href);
  });
}
