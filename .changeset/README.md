# Changesets

Package-level semver for the CyberSkill design-system workspaces.

1. `npx changeset` after a user-facing change.
2. CI / release binding still requires `VERSION` === `package.json` === `v*` tag plus tarball digest (`scripts/release-bind.mjs`).
3. Prerelease / canary: `npx changeset pre enter canary` then publish canary tags separately from `latest`.
4. The `@cyberskill/design` facade stays linked to the runtime workspace packages during the migration window.
