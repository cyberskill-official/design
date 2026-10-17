import assert from 'node:assert/strict';
import {inflateRawSync} from 'node:zlib';
export function unzipEntries(buf) {
  // Minimal ZIP local-file walker (deflate or store).
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const entries = {};
  let i = 0;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  while (i + 30 <= u8.length) {
    const sig = dv.getUint32(i, true);
    if (sig !== 0x04034b50) break;
    const method = dv.getUint16(i + 8, true);
    const comp = dv.getUint32(i + 18, true);
    const uncomp = dv.getUint32(i + 22, true);
    const nameLen = dv.getUint16(i + 26, true);
    const extraLen = dv.getUint16(i + 28, true);
    const name = new TextDecoder().decode(u8.subarray(i + 30, i + 30 + nameLen));
    const start = i + 30 + nameLen + extraLen;
    const data = u8.subarray(start, start + comp);
    let raw;
    if (method === 0) raw = data;
    else if (method === 8) raw = inflateRawSync(data);
    else throw new Error(`unsupported zip method ${method} for ${name}`);
    entries[name] = Buffer.from(raw);
    assert(entries[name].length === uncomp || method === 8, `size mismatch ${name}`);
    i = start + comp;
  }
  return entries;
}

