import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

/** Current top-level guides plus authored decision records are source pairs.
 * Entrance pairs and component prompts have separate source-bound language guards.
 * Archive/task/audit trees and vendor payload do not gain translation requirements
 * or browser publication through this directory recursion.
 */
export function listMarkdownFiles(directory, {recursive = false} = {}) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (entry.isSymbolicLink()) {
      throw Error('Documentation parity does not follow symlinks: ' + join(directory, entry.name));
    }
    if (entry.isDirectory() && recursive) {
      for (const path of listMarkdownFiles(join(directory, entry.name), {recursive: true})) {
        files.push(entry.name + '/' + path);
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entry.name);
    }
  }
  return files.sort();
}

export function documentationParityScope(root) {
  const enDir = join(root, 'docs');
  const viDir = join(enDir, 'vi');
  const guides = listMarkdownFiles(enDir);
  const decisions = listMarkdownFiles(join(enDir, 'decisions'), {recursive: true})
    .map(path => 'decisions/' + path);
  const vietnamese = [
    ...listMarkdownFiles(viDir),
    ...listMarkdownFiles(join(viDir, 'decisions'), {recursive: true})
      .map(path => 'decisions/' + path),
  ].sort();
  return {guides, decisions, source: [...guides, ...decisions].sort(), vietnamese};
}

export function pairProblems(en, vi, {label = 'mirror'} = {}) {
  if (vi == null) return [label + ': missing Vietnamese mirror'];
  const problems = [];
  const minimumLength = Math.max(80, Math.floor(en.trim().length * 0.4));
  if (vi.trim().length < minimumLength) {
    problems.push(label + ': stub/too short (' + vi.trim().length + '; need ≥' + minimumLength + ')');
  }
  const stub = /translate\s+me|stub\s+only|chưa\s+dịch|pending\s+translation|^\s*#?\s*TODO\b[\s:]*$/im;
  if (stub.test(vi)) problems.push(label + ': stub placeholder phrase');
  const headings = text => (text.match(/^#{1,6}\s+\S/gm) || []).length;
  if (headings(en) !== headings(vi)) {
    problems.push(label + ': heading-count drift EN=' + headings(en) + ' VI=' + headings(vi));
  }
  return problems;
}

export function readDocumentationPairs(root) {
  const scope = documentationParityScope(root);
  return {
    ...scope,
    pairs: scope.source.map(path => ({
      path,
      en: readFileSync(join(root, 'docs', path), 'utf8'),
      vi: existsSync(join(root, 'docs/vi', path))
        ? readFileSync(join(root, 'docs/vi', path), 'utf8')
        : null,
    })),
  };
}
