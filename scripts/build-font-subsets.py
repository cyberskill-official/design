#!/usr/bin/env python3
"""Rebuild pinned Latin/Vietnamese subsets; source cache is supplied explicitly.

Requires fontTools 4.62.1 with Brotli. Downloads are opt-in (--download).
--check compares deterministic output without modifying repository files.
"""
import argparse
import hashlib
import json
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
import fontTools
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-dir', type=Path, required=True)
parser.add_argument('--download', action='store_true')
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
recipe = json.loads((root / 'fonts/subset-recipe.json').read_text())
if fontTools.__version__ != recipe['fontToolsVersion']:
    raise SystemExit('Use pinned fontTools ' + recipe['fontToolsVersion'])
sha = lambda data: hashlib.sha256(data).hexdigest()
for entry in recipe['upstream']['files']:
    source = args.source_dir / entry['path']
    if not source.exists() and args.download:
        source.parent.mkdir(parents=True, exist_ok=True)
        with urlopen(entry['url'], timeout=30) as response:
            data = response.read()
        if sha(data) != entry['sha256']:
            raise SystemExit('Upstream digest mismatch: ' + entry['path'])
        source.write_bytes(data)
    if not source.exists() or sha(source.read_bytes()) != entry['sha256']:
        raise SystemExit('Missing or altered source: ' + str(source))
for entry in recipe['subsets']:
    font = TTFont(args.source_dir / entry['source'], recalcTimestamp=False)
    options = subset.Options()
    options.flavor = 'woff2'
    options.hinting = False
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    builder = subset.Subsetter(options=options)
    builder.populate(unicodes=entry['codepoints'])
    builder.subset(font)
    if set(font.getBestCmap()) != set(entry['codepoints']):
        raise SystemExit('Unexpected encoded coverage: ' + entry['path'])
    font.flavor = 'woff2'
    output = BytesIO()
    font.save(output)
    target = root / 'fonts' / entry['path']
    if args.check:
        if target.read_bytes() != output.getvalue():
            raise SystemExit('Stale font subset: ' + entry['path'])
    else:
        target.write_bytes(output.getvalue())
print(('PASS reproducible' if args.check else 'Generated') + ' font subsets: ' + str(len(recipe['subsets'])))
