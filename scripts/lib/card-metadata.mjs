import { parse } from 'parse5';

/** The single @dsCard HTML comment is the authored catalog metadata. */
export function readCardMetadata(source, path = 'card') {
  const headers = [];
  const visit = node => {
    if (node.nodeName === '#comment' && /@dsCard\b/.test(node.data)) headers.push(node.data);
    for (const child of node.childNodes || []) visit(child);
    if (node.content) visit(node.content);
  };
  visit(parse(source));
  if (headers.length !== 1) throw Error(`${path}: expected one @dsCard comment`);
  let rest = headers[0].trim();
  if (!rest.startsWith('@dsCard ')) throw Error(`${path}: malformed @dsCard comment`);
  rest = rest.slice(8).trim();
  const fields = {};
  while (rest) {
    const match = /^(group|viewport|name|subtitle)="([^"\r\n]*)"(?:\s+|$)/.exec(rest);
    if (!match || Object.hasOwn(fields, match[1])) throw Error(`${path}: malformed or duplicate @dsCard field`);
    fields[match[1]] = match[2];
    rest = rest.slice(match[0].length);
  }
  for (const field of ['group', 'viewport', 'name', 'subtitle']) {
    if (!fields[field]?.trim()) throw Error(`${path}: missing @dsCard ${field}`);
  }
  if (!/^[1-9]\d*x[1-9]\d*$/.test(fields.viewport) ||
      !fields.viewport.split('x').every(value => Number.isSafeInteger(Number(value)))) {
    throw Error(`${path}: invalid @dsCard viewport`);
  }
  return fields;
}

export function deriveCardMetadata(cards, read) {
  const paths = new Set();
  return cards.map(card => {
    if (typeof card.path !== 'string' || card.path.includes('\\') ||
        card.path.split('/').some(part => ['', '.', '..'].includes(part)) || paths.has(card.path)) {
      throw Error('Invalid or duplicate card source path');
    }
    paths.add(card.path);
    return { ...card, ...readCardMetadata(read(card.path), card.path) };
  });
}
