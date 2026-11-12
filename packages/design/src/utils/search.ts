/**
 * Folds text for search: no case, no accents, đ as d, and decomposed (NFD) text the same as composed (NFC), so text typed
 * with Unikey's "Unicode tổ hợp" or pasted from macOS file names matches. Each character folds on its own (to one letter or none).
 */
export const foldText = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd');

// Filters call includesFolded for every option on every keystroke: fold each label and query once.
const folded = new Map<string, string>();
function foldCached(text: string) {
  let result = folded.get(text);
  if (result === undefined) {
    if (folded.size >= 10_000) folded.clear(); // shortcut: crude bound instead of LRU; option lists stay far below it
    result = foldText(text);
    folded.set(text, result);
  }
  return result;
}

/** Whether `text` contains `query` once both are folded: "nguyen" finds "Nguyễn" in either form, "dang" finds "Đặng". */
export const includesFolded = (text: string, query: string) => foldCached(text).includes(foldCached(query.trim()));
