import assert from 'node:assert/strict';
import {parseReleaseVersion as parseCore,compareReleaseVersions as compareCore,ReleaseVersionError} from './release-version-core.mjs';
/** Browser/Node share one canonical grammar; preserve Node assertion failures. */
export function parseReleaseVersion(value,options) {
  assert.equal(typeof value,'string');
  try {return parseCore(value,options);} catch(error) {if(error instanceof ReleaseVersionError)assert.fail(error.message);throw error;}
}
export function compareReleaseVersions(left,right) {
  parseReleaseVersion(left);parseReleaseVersion(right);
  return compareCore(left,right);
}
