#!/usr/bin/env node
/**
 * TASK-IMP-029 — Editor schema allowlist + sanitizeHtml.
 * Uses jsdom-free Node path of sanitizeHtml.
 */
import { sanitizeHtml, EDITOR_SCHEMA } from '../../components/forms/editor-schema.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(Array.isArray(EDITOR_SCHEMA.tags) && EDITOR_SCHEMA.tags.includes('p'), 'schema has p');
assert(EDITOR_SCHEMA.tags.includes('b') && EDITOR_SCHEMA.tags.includes('ul'), 'schema marks/lists');

assert(sanitizeHtml(null) === '', 'null → empty');
assert(sanitizeHtml('') === '', 'empty');
assert(sanitizeHtml('<p>Hi</p>') === '<p>Hi</p>', 'plain p kept');
assert(!/<script/i.test(sanitizeHtml('<p>x</p><script>alert(1)</script>')), 'script stripped');
assert(!/onerror/i.test(sanitizeHtml('<img src=x onerror=alert(1)>')), 'img+handler stripped (img not allowed)');
assert(!/<a\b/i.test(sanitizeHtml('<a href="javascript:alert(1)">x</a>')), 'anchor stripped');
assert(/<b>bold<\/b>/.test(sanitizeHtml('<p><b>bold</b></p>')), 'b kept');
assert(!/\sclass=/.test(sanitizeHtml('<p class="x" onclick="y">z</p>')), 'attrs stripped');
const list = sanitizeHtml('<ul><li>one</li><li>two</li></ul>');
assert(list.includes('<ul>') && list.includes('<li>'), 'list kept: ' + list);

console.log('PASS test-editor-sanitize', { tags: EDITOR_SCHEMA.tags.length });
