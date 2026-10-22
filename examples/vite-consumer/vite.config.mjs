import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'cyberskill-compiled-consumer-proof',
    generateBundle() {
      const marker = '/node_modules/@cyberskill/design/';
      const originalIds = [...this.getModuleIds()].filter(id => id.includes(marker));
      const modules = originalIds
        .map(id => id.slice(id.indexOf(marker) + marker.length)).sort();
      const javascript = modules.filter(id => /\.(?:mjs|jsx|js)$/.test(id));
      if (!javascript.length || javascript.some(id => !id.startsWith('dist/esm/') || !id.endsWith('.mjs'))) {
        throw new Error('This example must consume the package compiled ESM surface.');
      }
      this.emitFile({ type: 'asset', fileName: 'consumer-build-inputs.json', source: JSON.stringify({
        javascript,
        associationChunks: originalIds.filter(id => id.endsWith('.mjs')).filter(id => {
          try { return JSON.parse(readFileSync(id + '.map', 'utf8')).sources.some(source => source.endsWith('/field-association.js')); }
          catch { return false; }
        }).map(id => id.slice(id.indexOf(marker) + marker.length)),
      }, null, 2) + '\n' });
    },
  }],
});
