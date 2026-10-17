# Figma / Tokens Studio notes


Published on Storybook **Docs** at `design.cyberskill.world`.
## What ships in-repo
- Design tokens in CSS + DTCG (`tokens/tokens.dtcg.json`) with native Swift/Kotlin/Flutter mirrors.
- UI kits under `ui_kits/` are HTML recreations that stay pixel-faithful to the brand doctrine (Thổ-first kits; axis demos in Storybook / Atomic View).

## Tokens Studio import recipe (hand-sync)

This recipe remains unverified with the current plugin version. The export targets DTCG 2025.10; confirm import/export round trips before adoption. Relative em metadata and CSS-valued scope overrides need a CyberSkill adapter. Local tests verify all 42 base color roles, including alpha, in the REST payload helper; they do not prove live import or account access. Source authority remains **code → design**.

1. Open the target Figma file (same file as `FIGMA_FILE_KEY` when you have secrets).
2. Install / open **[Tokens Studio](https://tokens.studio/)** (Figma plugin).
3. **Import** → choose **W3C DTCG / JSON** → select repo file `tokens/tokens.dtcg.json` (or paste its contents).
4. Map token sets to a collection (e.g. **CyberSkill Tokens**). Prefer keeping CSS-var keys / slash groups close to `_audit/ci/push-figma-variables.mjs` `toFigmaName` (`color/brand/umber`, …) so a later Enterprise REST push does not rename everything.
5. Apply tokens to local variables / styles in Figma. Re-import after token PRs — do **not** round-trip design edits back into DTCG unless you intentionally own that change in code.
6. Optional: verify version-specific Style Dictionary / other DTCG consumers with the same file; native mirrors stay generated via `node _audit/ci/generate-native-tokens.mjs`.

**Scope note:** REST auto-push (below) covers **colour** leaves only. Spacing/type/shadow and scope/extension handling require an import/export verification.

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
| `FIGMA_TOKEN` | Figma personal access token with **Variables** scopes |
| `FIGMA_FILE_KEY` | File key from `https://www.figma.com/design/<KEY>/...` |

Must be **repository secrets** under the Actions tab (exact names, case-sensitive). Not Environment secrets (those only inject when a job sets `environment:`), not Variables, and not org secrets that exclude this repo. CI log for a missing secret shows `FIGMA_TOKEN:` / `FIGMA_FILE_KEY:` with empty values.

**Required scopes for the Variables push** (from [Figma scopes](https://developers.figma.com/docs/rest-api/scopes/) + [Variables API](https://developers.figma.com/docs/rest-api/variables/)):

| Scope | Why | Availability |
|---|---|---|
| `file_variables:read` | `GET /v1/files/:key/variables/local` | **Enterprise only** |
| `file_variables:write` | create/update collection + colour variables | **Enterprise only** |
| `file_content:read` | full-file preflight `GET /v1/files/:key?depth=1` | all plans, with file access |

The preflight uses the [full-file endpoint](https://developers.figma.com/docs/rest-api/file-endpoints/), not `/files/:key/meta`; `file_metadata:read` alone cannot authorize it. Token scopes do not override file permissions. Follow the current [Variables API account and file requirements](https://developers.figma.com/docs/rest-api/variables/): its endpoint table requires view access for reads and a Full seat or admin plus edit access for writes; guests cannot use this API. Enterprise and the two Variables scopes alone do not establish access.

If you hover a PAT and only see scopes like `file_content:read`, `file_comments:*`, `webhooks:*`, `library_*` — that is expected on **Professional / Organization** seats. Figma **does not list** `file_variables:*` unless the account is on **Enterprise**. Regenerating a PAT on a non-Enterprise plan cannot unlock the Variables REST API.

**What CI does today:** missing `FIGMA_TOKEN` / `FIGMA_FILE_KEY` makes the workflow record an explicit soft-skip without attempting a push. With credentials, the helper performs the full-file preflight first. A file-preflight scope failure is a hard failure. HTTP 403 from the local Variables read, or a Variables write response identifying `file_variables:*` scopes or the Enterprise API restriction, records `variables_api_access`; other write-permission failures remain hard failures. HTTP 404/429/503 records API unavailability. Those responses do not prove an Enterprise-plan restriction or a successful sync. Invalid local token data and other non-API failures remain hard failures; `--dry-run` makes no API calls. Check account, seat, scopes and file permissions before a live operation. Soft-skip is separate from sync and publication.

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

## Hand-sync / Tokens Studio (owner decision A — non-Enterprise)

Recommended path until the design org is on Enterprise:

1. Treat `tokens/tokens.dtcg.json` as the colour/type/spacing interchange source.
2. **Tokens Studio** (or similar): follow the import recipe above; re-export only when you intentionally change design-side values (prefer code → design direction).
3. Hand-sync map: DTCG path → Figma variable name via the same slash naming as `_audit/ci/push-figma-variables.mjs` (`toFigmaName`).
4. When the org moves to Enterprise, re-enable full REST push (remove soft-skip need) with `file_variables:read` + `file_variables:write` on the PAT.

## Scope limits (honest)

Variables job pushes the 42 base **colour** leaves only, converting the current object-valued DTCG sRGB colors (including alpha) to Figma RGBA. Legacy hex inputs are supported by the helper but are not the current export format. Spacing, type, and multi-mode light/dark packs are not auto-synced yet — use Tokens Studio for those until a later sync expands the REST job.

The DTCG export currently emits <!-- cs-count:typedBaseTokens -->175<!-- /cs-count --> typed base tokens. Counts come from [the reference catalog](reference-catalog.json).
