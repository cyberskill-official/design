import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: node _audit/ci/lib/run-browsers.mjs <script> [...args]');
  process.exit(1);
}

const browsers = ['chromium', 'firefox', 'webkit'];
const results = await Promise.all(
  browsers.map(
    (browser) =>
      new Promise((resolve) => {
        const child = spawn(process.execPath, args, {
          env: { ...process.env, CS_BROWSER: browser, CS_TEST_BROWSER: browser },
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        const out = [];
        const err = [];
        child.stdout.on('data', (chunk) => out.push(chunk));
        child.stderr.on('data', (chunk) => err.push(chunk));
        child.on('close', (code, signal) => {
          resolve({
            browser,
            code: code ?? 1,
            signal,
            stdout: Buffer.concat(out),
            stderr: Buffer.concat(err),
          });
        });
      }),
  ),
);

let failed = false;
for (const r of results) {
  if (r.stdout.length) process.stdout.write(r.stdout);
  if (r.stderr.length) process.stderr.write(r.stderr);
  if (r.code !== 0 || r.signal) {
    console.error(`FAIL ${r.browser} (${args.join(' ')}): exit=${r.code} signal=${r.signal || 'none'}`);
    failed = true;
  }
}
if (failed) process.exit(1);
