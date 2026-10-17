// Inert test payloads: any execution only increments a local marker.
const attack = 'globalThis.__editorAttack = (globalThis.__editorAttack || 0) + 1';
export const editorHtmlFixtures = [
  { name: 'empty', input: '', expected: '' },
  { name: 'formatting', input: '<p>Hello <b>bold</b> <i>italic</i><br><strong>strong</strong><em>em</em></p>', expected: '<p>Hello <b>bold</b> <i>italic</i><br><strong>strong</strong><em>em</em></p>' },
  { name: 'lists', input: '<ul><li>one</li><li>two</li></ul><ol><li>three</li></ol>', expected: '<ul><li>one</li><li>two</li></ul><ol><li>three</li></ol>' },
  { name: 'unicode and entities', input: '<p>Tiếng Việt &amp; 日本語 &lt;img&gt;</p>', expected: '<p>Tiếng Việt &amp; 日本語 &lt;img&gt;</p>' },
  { name: 'attributes', input: `<p id=x class=y style="color:red" onclick="${attack}">safe</p>`, expected: '<p>safe</p>' },
  { name: 'nested unknown wrapper regression', input: `<section><img src=/editor-attack onerror="${attack}"><b>safe</b></section>`, expected: '<b>safe</b>' },
  { name: 'multiple unknown wrappers', input: `<section><article><custom><span onpointerenter="${attack}">safe</span></custom></article></section>`, expected: '<span>safe</span>' },
  { name: 'script content', input: `<section><script>${attack}</script><p>safe</p></section>`, expected: '<p>safe</p>' },
  { name: 'style subtree', input: '<style>body{display:none}</style><b>safe</b>', expected: '<b>safe</b>' },
  { name: 'active resources', input: `<iframe srcdoc='<script>${attack}</script>'></iframe><object data=x></object><embed src=x><link href=x><meta http-equiv=refresh content=0><base href=x><p>safe</p>`, expected: '<p>safe</p>' },
  { name: 'URL and attribute quoting', input: `<a href="javascript:${attack}"><b title='><img src=x onerror="${attack}">'>safe</b></a>`, expected: '<b>safe</b>' },
  { name: 'SVG namespace', input: `<svg onload="${attack}"><foreignObject><p onclick="${attack}">unsafe</p></foreignObject></svg><p>safe</p>`, expected: '<p>safe</p>' },
  { name: 'MathML namespace', input: '<math><mtext><b>foreign</b></mtext></math><p>safe</p>', expected: '<p>safe</p>' },
  { name: 'template subtree', input: `<template><section><img src=x onerror="${attack}"></section></template><p>safe</p>`, expected: '<p>safe</p>' },
  { name: 'raw text', input: `<textarea><img src=x onerror="${attack}"></textarea><p>safe</p>`, expected: '<p>safe</p>' },
  { name: 'solidus raw-text close', input: `<textarea>ignored</textarea/><img src=x onerror="${attack}"><p>safe</p>` },
  { name: 'noscript parsing mode', input: `<noscript><p title="</noscript><img src=x onerror='${attack}'>">` },
  { name: 'foreign mutation payload', input: `<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror='${attack}'>">` },
  { name: 'comments', input: `<!-- <img src=x onerror="${attack}"> --><p>safe</p>`, expected: '<p>safe</p>' },
  { name: 'malformed formatting', input: '<p><b>one<i>two</b>three</i><p>four' },
];
