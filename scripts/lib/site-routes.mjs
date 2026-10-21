import assert from 'node:assert/strict';
import { designCsp, loadSitePolicy } from './site-csp.mjs';
const escaped = path => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Only static, exact-path routes are produced; no request-time script trust. */
export function buildSiteRoutes(cspManifest, {
  policy = loadSitePolicy(),
  generatedDirectoryIndexes = []
} = {}) {
  const routes = [...policy.legacyRedirects.map(({
    src,
    dest,
    status
  }) => ({
    src,
    status,
    headers: {
      ...policy.headers,
      'Content-Security-Policy': designCsp('', {
        policy
      }).value,
      Location: dest
    }
  }))];
  for (const path of generatedDirectoryIndexes) {
    assert(path.endsWith('/index.html'));
    const directory = '/' + path.slice(0, -11);
    routes.push({
      src: '^' + escaped(directory) + '$',
      status: 308,
      headers: {
        ...policy.headers,
        'Content-Security-Policy': designCsp('', {
          policy
        }).value,
        Location: directory + '/'
      }
    });
  }
  for (const page of cspManifest.pages) {
    const path = '/' + page.path,
      aliases = [path];
    if (page.path === 'index.html') aliases.push('/');else if (page.path.endsWith('/index.html')) aliases.push(path.slice(0, -10));
    routes.push({
      src: '^(?:' + aliases.map(escaped).join('|') + ')$',
      dest: path,
      headers: {
        ...policy.headers,
        'Content-Security-Policy': page.csp
      }
    });
  }
  // Existing directory index aliases have already matched. Preserve legacy
  // trailing-slash removal for other paths, including HTML files and assets.
  // Excluding either leading slash form prevents protocol-relative redirects.
  routes.push({
    src: String.raw`^/([^/\\].*)/$`,
    status: 308,
    headers: {
      ...policy.headers,
      'Content-Security-Policy': designCsp('', {
        policy
      }).value,
      Location: '/$1'
    }
  });
  routes.push({
    src: '^/.*$',
    headers: {
      ...policy.headers,
      'Content-Security-Policy': designCsp('', {
        policy
      }).value
    },
    continue: true
  }, {
    handle: 'filesystem'
  });
  assert(routes.length <= policy.maxRoutes, 'Static response routing exceeds the authored route budget');
  return {
    version: 3,
    routes
  };
}
/** Local verification of the generated fixed and same-origin $1 Location
 * vocabulary, not a general Vercel router/emulator. Query strings are retained.
 * Vercel's own convertTrailingSlash producer emits this capture substitution:
 * https://github.com/vercel/vercel/blob/main/packages/routing-utils/src/superstatic.ts
 */
export function resolveSiteRequest(config, requestURL) {
  const url = new URL(requestURL, 'http://localhost');
  const headers = {};
  for (const route of config.routes) {
    if (route.handle === 'filesystem') break;
    const match = new RegExp(route.src).exec(url.pathname);
    if (!match) continue;
    Object.assign(headers, route.headers);
    if (route.status) {
      assert(route.headers.Location && !route.dest, 'Redirect must emit the documented Build Output API Location header');
      let target = route.headers.Location;
      if (target.includes('$')) {
        assert(target === '/$1' && match.length === 2, 'Unsupported generated redirect capture');
        target = '/' + match[1];
      }
      assert(target.startsWith('/') && !target.startsWith('//') && !target.includes('\\'), 'Redirect must remain same-origin');
      const location = new URL(target, url);
      location.search = url.search;
      headers.Location = location.pathname + location.search;
      return {
        headers,
        status: route.status,
        location: headers.Location
      };
    }
    if (route.dest) return {
      headers,
      status: 200,
      path: route.dest
    };
    if (!route.continue) throw Error('Unsupported generated route');
  }
  return {
    headers,
    status: 200,
    path: url.pathname
  };
}
