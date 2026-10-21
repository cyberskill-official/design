// Runs the existing pixel prerequisite before the unchanged hard gate board.
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {createVerificationServer} from './lib/verification-server.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=await createVerificationServer(root);
await new Promise((done, reject) => {server.once('error', reject); server.listen(0, '127.0.0.1', done);});
const base = `http://127.0.0.1:${server.address().port}`;
async function run(script, argument) {
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, [script, argument], {cwd:root, stdio:'inherit'});
    child.once('error', reject);
    child.once('exit', (code, signal) => done(signal ? 1 : code ?? 1));
  });
}
try {
  const pixel = await run('_audit/ci/pixel-diff.mjs', base);
  const board = await run('_audit/ci/run-gates.mjs', base + '/_audit/run.html');
  process.exitCode = pixel || board;
} finally {await new Promise(done => server.close(done));}
