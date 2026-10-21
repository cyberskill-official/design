import assert from 'node:assert/strict';
import {parseReleaseVersion} from './release-version.mjs';
export function validateLegacyExportSection(section) {
 const lines=section.split('\n').filter(Boolean);
 const version=/^export const VERSION = "([^"\n]+)";$/.exec(lines.shift()||'');
 assert(version,'Missing or malformed legacy VERSION export');parseReleaseVersion(version[1]);
 for(const line of lines)assert(/^export const [A-Za-z][A-Za-z0-9_]* = CS\.[A-Za-z][A-Za-z0-9_]*;$/.test(line),'Unexpected code in generated legacy export section');
 return version[1];
}
export function stampLegacyVersionComment(prefix,version) {
 parseReleaseVersion(version);
 return prefix.replace(/at v([0-9A-Za-z.+-]+)/g,(_,old)=>{parseReleaseVersion(old);return `at v${version}`;});
}
