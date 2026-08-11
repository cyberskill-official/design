# Consumer grant — `@cyberskill/design`

**Status: in force** (Jul 2026). Policy text — not a secret. License on the package remains **UNLICENSED**; this grant is the approval layer for use in named products. Published on Storybook **Docs** at `design.cyberskill.world`.

## Grant

CyberSkill grants **CyberSkill** (the company and its product engineering teams under `cyberskill-official`) a **non-exclusive** right to install and use **`@cyberskill/design`** in the products listed in the locked registry `docs/products.md`:

| Product |
|---|
| Lumi — wish assistant |
| Status Hub — client portfolio portal |
| CyberOS Agent Spine — agent infra, memory, gates |
| CyberSkill Design System — this library |
| cyberskill.world — the studio site |
| Client delivery suite — kickoff · QBR · runbooks |
| Board / investor collateral |
| HR / employment instruments |

The package remains **UNLICENSED**. Installing from the npm registry does **not** by itself grant redistribution rights. Redistribution outside the products above — including publishing a fork, re-licensing, or shipping the package as a dependency of an unrelated third-party product — needs a **further written grant** recorded in this file (or a superseding instrument).

**Third-party carve-out:** OFL fonts under `fonts/`, MIT-vendored runtimes under `_vendor/`, and other assets listed in root `THIRD-PARTY-NOTICES.md` keep their **upstream** licenses. The UNLICENSED assertion and this grant do **not** supersede those terms; redistributors must comply with `fonts/OFL.txt` and the notices file.

## Scope notes

- **Clone / subtree / static link** of this repo for the same products is covered the same way as an npm install.
- **Host-only tooling** (Storybook, `_audit/`) is not part of the npm tarball and is not redistributable under this grant.
- **Third-party notices:** see root `THIRD-PARTY-NOTICES.md` and `fonts/OFL.txt`.
- Adding a new CyberSkill product: update `docs/products.md` (+ VI) via a maintainer decision, then add the product row here in the same change.
- Approving an **external** team or client: append a dated grant stanza below (team/org, named products, contact). Do not invent product → element mappings here — that stays in `docs/products.md`.

## Additional grantees

*(None yet. Append dated entries here.)*

## Related

- Adopt / install: `docs/consuming.md`
- Decision record: `docs/decisions.md` §7
- Product → element registry: `docs/products.md`
