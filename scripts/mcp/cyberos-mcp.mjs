#!/usr/bin/env node
/**
 * Tracked CyberOS MCP entry (FIND-024 / TASK-IMP-008).
 *
 * `.cyberos/` is gitignored and only present after `cyberos install`. Fresh clones
 * must not point `.mcp.json` at a missing vendored path. This stub:
 *   - forwards to `.cyberos/mcp/cyberos-mcp.mjs` when installed
 *   - otherwise exits 0 with a clear stderr note (no Module-not-found crash)
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const target = join(root, '.cyberos/mcp/cyberos-mcp.mjs');

if (!existsSync(target)) {
  console.error(
    '[cyberos-mcp] CyberOS MCP runtime not installed (`.cyberos/` is gitignored). ' +
      'Fresh clone: leave the server disconnected, or run `cyberos install` and restart the agent host. ' +
      'See `.mcp.json.example` and CONTRIBUTING.md.',
  );
  process.exit(0);
}

const child = spawn(process.execPath, [target, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on('error', (err) => {
  console.error('[cyberos-mcp] failed to start CyberOS MCP:', err.message);
  process.exit(1);
});
