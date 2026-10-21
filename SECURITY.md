# Security policy

## Scope

This repository is a **static design system** (tokens, CSS, React components, HTML templates, Storybook). There is no runtime backend, database, or authenticated API in-tree.

## Reporting a vulnerability

Please disclose privately via **GitHub Security Advisories** for [`cyberskill-official/design`](https://github.com/cyberskill-official/design/security/advisories/new). Do not open a public issue for sensitive reports.

<!-- BEGIN GENERATED SECURITY SUPPORT -->
## Supported releases and response target

| Release line | Security maintenance |
|---|---|
| Latest published stable minor, currently **1.7.x** | Security triage and fixes target this line. |
| Earlier stable minor/major lines | Upgrade guidance; no backport commitment. |
| Unreleased working tree and prereleases | Development evidence; not a supported published release. |

The latest-published snapshot is **1.7.2**, observed at
`2026-10-20T10:16:52.889912+00:00` from the official npm registry. Snapshot SHA-256:
`6d840cde271d6422f89c0e1139919ba83c848881d869ae32ea07a5d461ebe91e`. This is a recorded publication identity, not a live registry query.
Refresh the snapshot and this generated block after a separately authorized
publication; a local VERSION change does not establish publication or support.

We aim to acknowledge private reports within **10 business days**, on a
**best-effort** basis. This is an acknowledgement target, not an SLA or a deadline
for triage, remediation, release or public disclosure. Reports can require more
investigation; we coordinate disclosure with the reporter after assessing the
issue and the available fix. The target covers reporting and coordination for
this design-system package, not consumer applications or upstream services.
<!-- END GENERATED SECURITY SUPPORT -->

## Public surfaces

The hosted site ships `_audit/` gate tooling intentionally — Storybook Status embeds `_audit/run.html` full-bleed. Treat audit harnesses as public documentation, not a private control plane.

## Out of scope

Third-party consumer apps, Vercel/npm account compromise, and vulnerabilities that only affect unmaintained forks are outside this policy’s remediation commitment.
