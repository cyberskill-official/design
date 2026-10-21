import {designCsp, loadSitePolicy} from '../../../scripts/lib/site-csp.mjs';

/** Use the production policy and exact served HTML; no blanket inline permission. */
export function sourceDocumentHeaders(path, html) {
  const policy = loadSitePolicy();
  return {
    ...policy.headers,
    'Content-Security-Policy': designCsp(html, {policy, path}).value,
  };
}
