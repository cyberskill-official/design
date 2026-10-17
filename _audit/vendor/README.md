# Vendored audit assets

Pinned third-party scripts loaded by `_audit/` gates (no CDN at gate time).

| File | Package | Version | Used by |
|---|---|---|---|
| `jsqr/jsQR.js` | jsqr | 1.4.0 | `_audit/qr-scan-test.html` |
| `axe.min.js` | axe-core | 4.10.0 | `_audit/axe-smoke.html` |

Refresh by downloading the matching release build into this folder and updating the version note in `axe-smoke.html` / `docs/quality-gates.md`.

jsQR is Apache-2.0; its unchanged license and registry tarball integrity/file hashes are in `jsqr/LICENSE` and `jsqr/provenance.json`. Verify a replacement against its exact registry integrity before updating the file and HTML SRI.

The axe 4.10.0 file was matched byte-for-byte to its integrity-verified registry tarball. `axe-provenance.json` records that match; `axe-LICENSE` and `axe-LICENSE-3RD-PARTY.txt` preserve the distribution notices. Offline integrity of both axe and jsQR runtime/license files is checked with `node _audit/ci/check-vendor-provenance.mjs`; this checks recorded hashes, not fresh upstream acquisition or acceptance.
