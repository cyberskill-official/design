const EC = { 1: 7, 2: 10, 3: 15, 4: 20 };
const TOTAL = { 1: 26, 2: 44, 3: 70, 4: 100 };
const CAP = { 1: 17, 2: 32, 3: 53, 4: 78 };
const ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26] };
const FORMAT = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
const EXP = new Array(512), LOG = new Array(256);
(function() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 285;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
function rs(data, ecLen) {
  let gen = [1];
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= EXP[(LOG[gen[j]] + i) % 255];
      next[j + 1] ^= gen[j];
    }
    gen = next;
  }
  const res = data.concat(new Array(ecLen).fill(0));
  for (let i = 0; i < data.length; i++) {
    const f = res[i];
    if (f === 0) continue;
    for (let j = 0; j < gen.length; j++) res[i + j] ^= EXP[(LOG[gen[j]] + LOG[f]) % 255];
  }
  return res.slice(data.length);
}
function qrMatrix(text) {
  const bytes = Array.from(new TextEncoder().encode(text));
  let v = 0;
  for (const cand of [1, 2, 3, 4]) if (bytes.length <= CAP[cand]) {
    v = cand;
    break;
  }
  if (!v) throw new Error("too long");
  const dataLen = TOTAL[v] - EC[v];
  const bits = [];
  const push = (val, n2) => {
    for (let i = n2 - 1; i >= 0; i--) bits.push(val >> i & 1);
  };
  push(4, 4);
  push(bytes.length, 8);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, dataLen * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const cw = [];
  for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  const pads = [236, 17];
  let p = 0;
  while (cw.length < dataLen) cw.push(pads[p++ % 2]);
  const all = cw.concat(rs(cw, EC[v]));
  const n = 17 + v * 4;
  const M = Array.from({ length: n }, () => new Array(n).fill(null));
  const setF = (x, y, val) => {
    if (y >= 0 && y < n && x >= 0 && x < n) M[y][x] = val;
  };
  const finder = (cx0, cy0) => {
    for (let y = -1; y <= 7; y++) for (let x = -1; x <= 7; x++) {
      const in7 = x >= 0 && x < 7 && y >= 0 && y < 7;
      const on = in7 && (x === 0 || x === 6 || y === 0 || y === 6 || x >= 2 && x <= 4 && y >= 2 && y <= 4);
      setF(cx0 + x, cy0 + y, on ? 1 : 0);
    }
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  for (let i = 8; i < n - 8; i++) {
    const on = i % 2 === 0 ? 1 : 0;
    if (M[6][i] == null) M[6][i] = on;
    if (M[i][6] == null) M[i][6] = on;
  }
  const ap = ALIGN[v];
  for (const ay of ap) for (const ax of ap) {
    if (M[ay][ax] != null) continue;
    for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) setF(ax + x, ay + y, Math.max(Math.abs(x), Math.abs(y)) !== 1 ? 1 : 0);
  }
  M[n - 8][8] = 1;
  const fpos1 = [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]];
  const fpos2 = [[n - 1, 8], [n - 2, 8], [n - 3, 8], [n - 4, 8], [n - 5, 8], [n - 6, 8], [n - 7, 8], [8, n - 8], [8, n - 7], [8, n - 6], [8, n - 5], [8, n - 4], [8, n - 3], [8, n - 2], [8, n - 1]];
  FORMAT.forEach((b, i) => {
    const [x1, y1] = fpos1[i];
    M[y1][x1] = b;
    const [x2, y2] = fpos2[i];
    M[y2][x2] = b;
  });
  let bi = 0;
  const bit = (i) => i < all.length * 8 ? all[i >> 3] >> 7 - (i & 7) & 1 : 0;
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < n; i++) {
      for (let dx = 0; dx < 2; dx++) {
        const x = col - dx;
        const y = (col + 1 & 2) === 0 ? n - 1 - i : i;
        if (M[y][x] != null) continue;
        let b = bit(bi++);
        if ((y + x) % 2 === 0) b ^= 1;
        M[y][x] = b;
      }
    }
  }
  return M;
}
export {
  qrMatrix
};
