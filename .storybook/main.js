import path from 'node:path';
import { stagePublicFiles, loadPublicPolicy, assertRegularSource } from '../scripts/public-site.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { storybookRootFiles } from '../scripts/storybook-inputs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const publicStage = stagePublicFiles(repoRoot);

/** Serve/copy root portable files so Live/* iframes resolve /styles.css etc. */
function dsRootFilesPlugin() {
  const map = storybookRootFiles;
  const mime = (rel) => {
    if (rel.endsWith('.css')) return 'text/css; charset=utf-8';
    if (rel.endsWith('.js')) return 'application/javascript; charset=utf-8';
    if (rel.endsWith('.json')) return 'application/json; charset=utf-8';
    if (rel.endsWith('.md') || rel.endsWith('.txt')) return 'text/plain; charset=utf-8';
    return 'text/plain; charset=utf-8';
  };
  const attach = (server) => {
    // Keep allowlisted iframe assets live during authoring without publishing new
    // paths implicitly. Changes to the policy/config restart Storybook.
    if (server.watcher) {
      const policy = loadPublicPolicy(repoRoot);
      server.watcher.add([...policy.keys()].map(p => path.join(repoRoot,p)));
      const syncPublicFile = file => {
        const rel = path.relative(repoRoot,file).split(path.sep).join('/');
        if (!policy.has(rel)) return;
        const source = assertRegularSource(repoRoot,rel);
        const dest = path.join(publicStage,rel);
        fs.mkdirSync(path.dirname(dest),{recursive:true});
        fs.copyFileSync(source,dest);
      };
      server.watcher.on('change',syncPublicFile);
      server.watcher.on('add',syncPublicFile);
      server.watcher.on('unlink',file => {
        const rel=path.relative(repoRoot,file).split(path.sep).join('/');
        if (policy.has(rel)) fs.rmSync(path.join(publicStage,rel),{force:true});
      });
    }
    server.middlewares.use((req, res, next) => {
      const raw = req.url || '';
      // Vite module graph uses query strings (?import, ?direct, t=…).
      if (raw.includes('?')) return next();
      const url = raw.split('?')[0];
      const rel = map[url];
      if (!rel) return next();
      // preview.jsx does `import '../styles.css'` → bare `/styles.css` as a *module*.
      // Only short-circuit real stylesheet fetches (Live iframes); let Vite transform the rest.
      const dest = req.headers['sec-fetch-dest'];
      if (rel.endsWith('.css') && dest !== 'style') return next();
      try {
        const data = fs.readFileSync(path.join(repoRoot, rel));
        res.statusCode = 200;
        res.setHeader('Content-Type', mime(rel));
        res.end(data);
      } catch {
        next();
      }
    });
  };
  return {
    name: 'ds-root-files',
    configureServer: attach,
    configurePreviewServer: attach,
    writeBundle(options) {
      const out = options.dir;
      if (!out) return;
      for (const [urlPath, rel] of Object.entries(map)) {
        const dest = path.join(out, urlPath.replace(/^\//, ''));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(path.join(repoRoot, rel), dest);
      }
    },
  };
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [{ from: publicStage, to: '/' }],
  // Allow 127.0.0.1 (Storybook core → Vite server.allowedHosts). Prefer opening
  // http://localhost:6006 — iframe.html treats non-localhost as a hard preview error.
  core: {
    allowedHosts: ['localhost', '127.0.0.1'],
  },
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    if (!config.plugins.some((p) => p && p.name === 'vite:react-babel')) {
      config.plugins.push(react());
    }
    config.plugins.push(dsRootFilesPlugin());
    // Production `/` is Storybook — keep Vite asset base at domain root (not /playground/).
    return mergeConfig(config, {
      base: '/',
      resolve: {
        alias: {
          '@cs': path.join(repoRoot, 'components'),
        },
      },
      server: {
        fs: { allow: [repoRoot] },
      },
    });
  },
};

export default config;
