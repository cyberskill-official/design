import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createVerificationServer} from './lib/verification-server.mjs';
export async function serveVerification({root = fileURLToPath(new URL('../', import.meta.url)), port = 8080} = {}) {
  assert(Number.isInteger(port) && port >= 0 && port <= 65535, 'Invalid verification port');
  const server = await createVerificationServer(root);
  await new Promise((done,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',done)});
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await serveVerification({port:process.argv[2] === undefined ? 8080 : Number(process.argv[2])});
  console.log('Verification server: http://127.0.0.1:' + server.address().port);
  const close=()=>server.close(error=>{process.exitCode=error?1:0});
  process.once('SIGTERM',close);process.once('SIGINT',close);
}
