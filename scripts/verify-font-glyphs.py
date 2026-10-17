"""Bounded local cmap + CSS range evidence; no font rendering or rights approval."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unicodedata
import fontTools
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent

def ranges(value):
    result = set()
    for part in value.split(','):
        match = re.fullmatch(r'\s*U\+([0-9A-Fa-f]{1,6})(?:-([0-9A-Fa-f]{1,6}))?\s*', part)
        if not match:
            raise ValueError('Unsupported unicode-range: ' + part)
        first, last = int(match[1], 16), int(match[2] or match[1], 16)
        if first > last or last > 0x10FFFF:
            raise ValueError('Invalid unicode-range: ' + part)
        result.update(range(first, last + 1))
    return result

def covered(cmap, css_range):
    return {point for point, glyph in cmap.items() if glyph != '.notdef'} & ranges(css_range)

# Reject false coverage: a glyph outside the CSS range cannot supply that face.
assert covered({0x41: 'A', 0x110: 'Dcroat'}, 'U+0041') == {0x41}
assert covered({0x41: 'A'}, 'U+0110') == set()
assert covered({0x41: '.notdef'}, 'U+0041') == set()
for invalid in ['U+100-0FF', 'U+110000', 'all']:
    try:
        ranges(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid range accepted: ' + invalid)

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true', help='Verify font glyph coverage')
args = parser.parse_args()
subprocess.run(['node', 'scripts/sync-font-manifest.mjs', '--check'], cwd=ROOT, check=True)
required = set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 Đđ₫')
for vowel in 'aăâeêioôơuưyAĂÂEÊIOÔƠUƯY':
    for tone in ['', '\u0300', '\u0301', '\u0303', '\u0309', '\u0323']:
        required.update(unicodedata.normalize('NFC', vowel + tone))
codepoints = sorted(map(ord, required))
assert len(codepoints) == 198, 'Repertoire changes require explicit review'
manifest = json.loads((ROOT / '_ds_manifest.json').read_text())
groups, hashes = {}, {}
for face in manifest['fonts']:
    key = (face['family'], face['style'], face['weight'])
    group = groups.setdefault(key, {'files': [], 'covered': set()})
    for rel_path in face['files']:
        path = ROOT / rel_path
        hashes[rel_path] = hashlib.sha256(path.read_bytes()).hexdigest()
        with TTFont(path) as font:
            cmap = font.getBestCmap()
            if cmap is None:
                raise ValueError('No Unicode cmap: ' + rel_path)
            group['files'].append(rel_path)
            group['covered'].update(covered(cmap, face['unicodeRange']))
if not groups:
    raise ValueError('No declared font groups')
records = []
for (family, style, weight), group in sorted(groups.items()):
    missing = sorted(set(codepoints) - group['covered'])
    records.append({'family': family, 'style': style, 'weight': weight, 'files': sorted(group['files']), 'missingCodepoints': missing})
failures = [r for r in records if r['missingCodepoints']]
if failures:
    raise ValueError('Missing required glyphs: ' + json.dumps(failures))
print(f'PASS bounded glyph coverage: {len(hashes)} files, {len(groups)} groups, {len(codepoints)} required codepoints; rendering and rights unverified')
