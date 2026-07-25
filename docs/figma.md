# Figma / Tokens Studio notes

## What ships in-repo
- Design tokens in CSS + DTCG (`tokens/tokens.dtcg.json`) with native Swift/Kotlin/Flutter mirrors.
- UI kits under `ui_kits/` are HTML recreations that stay pixel-faithful to the brand doctrine (Thổ-first Identity Lab).
- **Code Connect** mappings for all **99** public primaries (`components/**/*.figma.tsx` + `figma.config.json` + `code-connect/node-map.json`).

## Tokens Studio import recipe (hand-sync)

Recommended colour/type/spacing interchange until the design org is on Figma Enterprise (Variables REST). Source of truth stays **code → design**.

1. Open the target Figma file (same file as `FIGMA_FILE_KEY` when you have secrets).
2. Install / open **[Tokens Studio](https://tokens.studio/)** (Figma plugin).
3. **Import** → choose **W3C DTCG / JSON** → select repo file `tokens/tokens.dtcg.json` (or paste its contents).
4. Map token sets to a collection (e.g. **CyberSkill Tokens**). Prefer keeping CSS-var keys / slash groups close to `_audit/ci/push-figma-variables.mjs` `toFigmaName` (`color/brand/umber`, …) so a later Enterprise REST push does not rename everything.
5. Apply tokens to local variables / styles in Figma. Re-import after token PRs — do **not** round-trip design edits back into DTCG unless you intentionally own that change in code.
6. Optional: Style Dictionary / other DTCG consumers can read the same file; native mirrors stay generated via `node _audit/ci/generate-native-tokens.mjs`.

**Scope note:** REST auto-push (below) covers **colour** leaves only. Tokens Studio can carry spacing/type/shadow from the same DTCG file by hand.

## Automated colour variable push

CI job **`figma-variables-push`** (in `.github/workflows/design-system-gates.yml`) reads `tokens/tokens.dtcg.json` and creates/updates a Figma local variable collection **CyberSkill Tokens** with colour variables.

| Trigger | Behaviour |
|---|---|
| Push to `main` | Runs push (needs secrets) |
| `workflow_dispatch` | Manual run from Actions tab |
| PR | Does not push (avoids noise); dry helpers still available locally |

### Secrets (repo → Settings → Secrets and variables → Actions)

| Name | Value |
|---|---|
| `FIGMA_TOKEN` | Figma personal access token with **Variables** scopes (and Code Connect scopes when publishing mappings) |
| `FIGMA_FILE_KEY` | File key from `https://www.figma.com/design/<KEY>/...` |

Must be **repository secrets** under the Actions tab (exact names, case-sensitive). Not Environment secrets (those only inject when a job sets `environment:`), not Variables, and not org secrets that exclude this repo. CI log for a missing secret shows `FIGMA_TOKEN:` / `FIGMA_FILE_KEY:` with empty values.

**Required scopes for the Variables push** (from [Figma scopes](https://developers.figma.com/docs/rest-api/scopes/) + [Variables API](https://developers.figma.com/docs/rest-api/variables/)):

| Scope | Why | Availability |
|---|---|---|
| `file_variables:read` | `GET /v1/files/:key/variables/local` | **Enterprise only** |
| `file_variables:write` | create/update collection + colour variables | **Enterprise only** |
| `file_content:read` / `file_metadata:read` | confirm file access before push | all plans |

If you hover a PAT and only see scopes like `file_content:read`, `file_comments:*`, `webhooks:*`, `library_*` — that is expected on **Professional / Organization** seats. Figma **does not list** `file_variables:*` unless the account is on **Enterprise**. Regenerating a PAT on a non-Enterprise plan cannot unlock the Variables REST API.

**What CI does today:** the `figma-variables-push` job **soft-skips (exit 0 + report) if `FIGMA_TOKEN` / `FIGMA_FILE_KEY` are empty** — same honesty as Code Connect (missing secrets are not a red main). With secrets present, file open works on any plan; the Variables write also soft-skips with a report when Figma returns **403** / invalid scopes for `file_variables`. Soft-skip ≠ live Variables sync. Full auto-push needs Enterprise + those two scopes on the PAT.

**Non-Enterprise alternatives:** hand-sync colour styles from `tokens/tokens.dtcg.json`, or use [Tokens Studio](https://tokens.studio/) / the Plugin API inside the desktop app (plugin path does not use this REST job) — see the import recipe above.

### Local

```bash
# no secrets — print plan only
node _audit/ci/push-figma-variables.mjs --dry-run

# with secrets in env (never commit them)
export FIGMA_TOKEN=...
export FIGMA_FILE_KEY=...
node _audit/ci/push-figma-variables.mjs --check   # file access + list collections
node _audit/ci/push-figma-variables.mjs           # create/update colours
```

After a successful push, open the file in Figma → **Local variables** → collection **CyberSkill Tokens**.

### Where to get a Figma token

1. Log into [figma.com](https://www.figma.com).
2. **Settings → Security → Personal access tokens** → generate.
3. File key: open the target file; URL segment after `/design/` or `/file/`.

## Figma Code Connect (live + soft-skip)

**Decision 1C:** the publish path is wired; CI **soft-skips** (exit 0 + `code-connect-report.json`) when `FIGMA_TOKEN` / `FIGMA_FILE_KEY` are missing or the API returns **403 / 404 / 429** (plan, unpublished nodes, rate limit).

| Piece | Path |
|---|---|
| Config | `figma.config.json` (React parser, `components/**/*.figma.tsx`) |
| Node registry | `code-connect/node-map.json` (per-primary `nodeId` + `published` flag) |
| Mappings | `components/**/<Name>.figma.tsx` — **99** primaries; Button / TextField / Dialog / Card / Alert have prop maps; others are stubs |
| Generator | `npm run code-connect:generate` → `_audit/ci/generate-code-connect.mjs` |
| CI job | `code-connect` in `design-system-gates.yml` (PR + `main` + manual) |
| Local dry-run | `npm run code-connect:dry-run` (no secrets; asserts config + ≥105 files) |

Document URLs use placeholder file key **`CS_FIGMA_FILE_KEY`**. Publish substitutes `FIGMA_FILE_KEY` via `documentUrlSubstitutions`.

### Operator checklist (first real publish)

1. Publish each Figma component to the **team library** (Code Connect requires published components; Org/Enterprise plan).
2. Set `nodes.<Name>.nodeId` in `code-connect/node-map.json` (colon or hyphen form) and `published: true`.
3. `npm run code-connect:generate` to rewrite `.figma.tsx` URLs.
4. With secrets: `node _audit/ci/code-connect-publish.mjs` (or let the CI job run on `main`).

Until real node IDs exist, synthetic `9999:*` stubs remain; publish reports and exits cleanly on 404. Remaining blockers: `docs/decisions.md` §6.

```bash
npm run code-connect:dry-run
# with secrets
export FIGMA_TOKEN=...
export FIGMA_FILE_KEY=...
node _audit/ci/code-connect-publish.mjs
```

## Hand-sync / Tokens Studio (owner decision A — non-Enterprise)

Recommended path until the design org is on Enterprise:

1. Treat `tokens/tokens.dtcg.json` as the colour/type/spacing interchange source.
2. **Tokens Studio** (or similar): follow the import recipe above; re-export only when you intentionally change design-side values (prefer code → design direction).
3. Hand-sync map: DTCG path → Figma variable name via the same slash naming as `_audit/ci/push-figma-variables.mjs` (`toFigmaName`).
4. Code Connect is live-wired with soft-skip (this file) — fill `node-map.json` when library components exist.
5. When the org moves to Enterprise, re-enable full REST push (remove soft-skip need) with `file_variables:read` + `file_variables:write` on the PAT.

## Scope limits (honest)

Variables job pushes **colour** variables only (hex leaves from DTCG). Spacing, type, and multi-mode light/dark packs are not auto-synced yet — use Tokens Studio for those until a later sync expands the REST job.
