export class ReleaseVersionError extends Error {}
function assert(condition,message) {if(!condition)throw new ReleaseVersionError(message);}

// Release identities are canonical SemVer without build metadata: tags and
// package identities must not differ only by metadata ignored by precedence.
const pattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
export function parseReleaseVersion(value, { stableOnly = false } = {}) {
  assert(typeof value === 'string', 'Canonical SemVer release identity requires a string');
  const match = pattern.exec(value);
  assert(match && match[0] === value, 'Canonical SemVer release identity required');
  const prerelease = match[4] ? match[4].split('.') : [];
  for (const id of prerelease) {
    assert(!/^\d+$/.test(id) || id === '0' || !id.startsWith('0'), 'Numeric prerelease identifiers cannot have leading zeroes');
  }
  assert(!stableOnly || !prerelease.length, 'Stable SemVer required');
  return { core: match.slice(1, 4).map(BigInt), prerelease };
}

export function compareReleaseVersions(left, right) {
  const a = parseReleaseVersion(left), b = parseReleaseVersion(right);
  for (let i = 0; i < 3; i++) if (a.core[i] !== b.core[i]) return a.core[i] > b.core[i] ? 1 : -1;
  if (!a.prerelease.length || !b.prerelease.length) return a.prerelease.length === b.prerelease.length ? 0 : a.prerelease.length ? -1 : 1;
  for (let i = 0; i < Math.max(a.prerelease.length, b.prerelease.length); i++) {
    const x = a.prerelease[i], y = b.prerelease[i];
    if (x === undefined || y === undefined) return x === undefined ? -1 : 1;
    if (x === y) continue;
    const xn = /^\d+$/.test(x), yn = /^\d+$/.test(y);
    if (xn && yn) return BigInt(x) > BigInt(y) ? 1 : -1;
    if (xn !== yn) return xn ? -1 : 1;
    return x > y ? 1 : -1;
  }
  return 0;
}
