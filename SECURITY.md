# Security policy

## Scope

This repository is a **static design system** (tokens, CSS, React components, HTML templates, Storybook). There is no runtime backend, database, or authenticated API in-tree.

## Reporting a vulnerability

Please disclose privately via **GitHub Security Advisories** for [`cyberskill-official/design`](https://github.com/cyberskill-official/design/security/advisories/new). Do not open a public issue for sensitive reports.

We will acknowledge private reports and coordinate a fix before any public disclosure.

## Public surfaces

The hosted site ships `_audit/` gate tooling intentionally — Storybook Status embeds `_audit/run.html` full-bleed. Treat audit harnesses as public documentation, not a private control plane.

## Out of scope

Third-party consumer apps, Vercel/npm account compromise, and vulnerabilities that only affect unmaintained forks are outside this policy’s remediation commitment.
