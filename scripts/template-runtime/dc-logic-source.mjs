/** One pure source serializer shared by the browser-runtime projection and CSP builder.
 * It emits an executable script body, not a nonce or evidence of review. */
export function dcLogicScriptSource(code, token) {
  if (typeof code !== 'string' || typeof token !== 'string' || !/^Component(?:[1-9]\d*)?$/.test(token)) throw new Error('Invalid DC logic source or root token');
  return '(() => { const DCLogic = window.__csDcLogic;\n' + code + '\nwindow.__csDcConstructors[' + JSON.stringify(token) + '] = Component;\n})();';
}
