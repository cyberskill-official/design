/**
 * Folds text for search: no case, no accents, đ as d, and decomposed (NFD) text the same as composed (NFC), so text typed
 * with Unikey's "Unicode tổ hợp" or pasted from macOS file names matches. Each character folds on its own (to one letter or none).
 */
export const foldText = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd');

/** Whether `text` contains `query` once both are folded: "nguyen" finds "Nguyễn" in either form, "dang" finds "Đặng". */
export const includesFolded = (text: string, query: string) => foldText(text).includes(foldText(query.trim()));
