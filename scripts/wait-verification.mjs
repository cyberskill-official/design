import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export async function waitVerification(url, {timeout=30000, interval=100} = {}) {
  const target = new URL(url);
  assert(target.protocol === 'http:' && ['127.0.0.1','localhost','[::1]'].includes(target.hostname), 'Readiness target must use loopback HTTP');
  assert(Number.isFinite(timeout) && timeout > 0 && Number.isFinite(interval) && interval > 0, 'Readiness timing must be positive');
  const start = Date.now(); let last='unavailable';
  while (Date.now()-start < timeout) {
    try { const response=await fetch(target,{method:'HEAD',signal:AbortSignal.timeout(Math.max(1,Math.min(1000,timeout-(Date.now()-start))))});if(response.ok)return;last='HTTP '+response.status; } catch(error){last=error.message;}
    await new Promise(done=>setTimeout(done, Math.min(interval,Math.max(0,timeout-(Date.now()-start)))));
  }
  throw Error('Verification server readiness timed out: '+target+' ('+last+')');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await waitVerification(process.argv[2] || 'http://127.0.0.1:8080/dashboard.html');
  console.log('PASS verification server ready');
}
