import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

/** Parse actual PDF bytes through a private file: no stdin pipe, bounded child lifetime/output. */
export function extractPdfText(bytes, {python=process.env.CS_PDF_PYTHON||'python3', helperPath=fileURLToPath(new URL('./pdf-text.py',import.meta.url)), timeoutMs=30000, temporaryRoot=tmpdir()}={}) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('PDF extraction requires actual PDF bytes');
  if (!Number.isSafeInteger(timeoutMs)||timeoutMs<=0) throw new TypeError('PDF extraction deadline must be a positive integer');
  const directory=mkdtempSync(join(temporaryRoot,'cs-pdf-text-'));
  try {
    const path=join(directory,'document.pdf');
    writeFileSync(path,bytes,{mode:0o600});
    const result=spawnSync(python,[helperPath,path],{stdio:['ignore','pipe','pipe'],encoding:'utf8',timeout:timeoutMs,killSignal:'SIGKILL',maxBuffer:32*1024*1024});
    if(result.error||result.status!==0) {
      const reason=result.error?.code||result.signal||String(result.status);
      throw new Error('PDF text extraction failed ('+reason+'): '+(result.error?.message||result.stderr||'parser returned nonzero status'),{cause:result.error});
    }
    let parsed;
    try { parsed=JSON.parse(result.stdout); } catch(error) { throw new Error('PDF text extraction returned malformed JSON',{cause:error}); }
    if(parsed?.parser!=='pypdf'||parsed.version!=='6.21.4'||!Number.isSafeInteger(parsed.pages)||parsed.pages<1||typeof parsed.text!=='string') throw new Error('PDF text extraction returned invalid parser metadata or page/text results');
    return parsed;
  } finally { rmSync(directory,{recursive:true,force:true}); }
}
