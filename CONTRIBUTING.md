# Contributing

1. Read [AGENTS.md](AGENTS.md): the layout, component rules, CSS rules and test expectations apply to everyone, human or AI.
2. Branch from `main`, keep one change per pull request, and fill in the template (screenshots in light and dark).
3. Before opening the PR:

   ```bash
   npm run build                               # fails on any broken contrast or color rule
   npm run lint:css -w @cyberskill/design
   npm run typecheck
   npm test
   npm run site:build && npm run audit:visual  # forensic visual audit
   npx changeset                               # describe anything that ships in the package
   ```

4. Changing a color? Edit `packages/design/tokens/color.json` only, then run the build. It tells you which contrast or distinctness rule a new value breaks.
5. Changing a component's API? Update its site page (`apps/site/content/docs/components/<name>.mdx`). The AI docs in `packages/design/ai/` are generated from it on build; commit the regenerated files.

Releases: merging the "chore: version packages" PR bumps the version and CHANGELOG. Publishing is a separate, deliberate step: push the matching tag (`git tag v3.0.0-next.1 && git push origin v3.0.0-next.1`) and `npm-publish.yml` runs every CI check, then publishes with provenance. While changesets is in pre mode (`.changeset/pre.json`), versions are `-next.N` and go to the `next` dist-tag; a stable version can only publish from its tag, after `npx changeset pre exit`.
