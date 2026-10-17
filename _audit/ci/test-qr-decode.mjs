import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { qrMatrix } from '../../components/data/qr-encode.js';
const decoder={};
vm.runInNewContext(readFileSync(new URL('../vendor/jsqr/jsQR.js',import.meta.url),'utf8'),decoder);
function decode(matrix,damage=false){
 const scale=6, size=(matrix.length+8)*scale;
 const pixels=new Uint8ClampedArray(size*size*4).fill(255);
 for(let y=0;y<matrix.length;y++)for(let x=0;x<matrix.length;x++){
   const dark=matrix[y][x] ^ (damage && x===matrix.length-1 && y===matrix.length-1 ? 1 : 0);
   if(!dark)continue;
   for(let j=0;j<scale;j++)for(let i=0;i<scale;i++){
     const at=(((y+4)*scale+j)*size+(x+4)*scale+i)*4;
     pixels[at]=pixels[at+1]=pixels[at+2]=0;
   }
 }
 return decoder.jsQR(pixels,size,size);
}
const cases=Array.from({length:79},(_,n)=>Array.from({length:n},(_,i)=>String.fromCharCode(33+(i*37+n)%90)).join(''));
cases.push('Hiện Thực Hoá Ý Chí — CyberSkill','日本語と tiếng Việt','é'.repeat(39));
for(const text of cases){
 const matrix=qrMatrix(text), bytes=new TextEncoder().encode(text);
 const version=bytes.length<=17?1:bytes.length<=32?2:bytes.length<=53?3:4;
 assert.equal(matrix.length,17+version*4);
 for(const damage of [false,true]){
   const result=decode(matrix,damage);
   assert(result,`Cannot decode ${bytes.length} bytes (damage=${damage})`);
   assert.deepEqual([...result.binaryData],[...bytes]);
 }
}
assert.throws(()=>qrMatrix('x'.repeat(79)),/too long/);
assert.throws(()=>qrMatrix('é'.repeat(40)),/too long/);
console.log(`PASS QR decoder: ${cases.length} payloads spanning every capacity 0–78 bytes, four versions and UTF-8; clean and damaged matrices decode; oversized inputs rejected`);
