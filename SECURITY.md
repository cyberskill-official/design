<!-- BEGIN GENERATED ENTRY LANGUAGE ROUTE v1 -->
**Tiếng Việt:** [Đọc hướng dẫn đầy đủ](docs/vi/entrypoints/SECURITY.md) · **English:** full original guidance follows below.
<!-- END GENERATED ENTRY LANGUAGE ROUTE v1 -->

# Security policy

## Scope

This repository is a **static design system** (tokens, CSS, React components, HTML templates, Storybook). There is no runtime backend, database, or authenticated API in-tree.

## Reporting a vulnerability

Please disclose privately via **GitHub Security Advisories** for [`cyberskill-official/design`](https://github.com/cyberskill-official/design/security/advisories/new). Do not open a public issue for sensitive reports.

<!-- BEGIN GENERATED SECURITY SUPPORT -->
## Supported releases and response target

| Release line | Security maintenance |
|---|---|
| Latest published stable minor, currently **2.0.x** | Security triage and fixes target this line. |
| Earlier stable minor/major lines | Upgrade guidance; no backport commitment. |
| Unreleased working tree and prereleases | Development evidence; not a supported published release. |

The latest-published snapshot is **2.0.0**, observed at
`2026-10-30T16:59:22.000Z` from the official npm registry. Snapshot SHA-256:
`091130f87f852a11a513a03a839d21e7da11ba140134e04ee5d83925d34bcd80`. This is a recorded publication identity, not a live registry query.
Refresh the snapshot and this generated block after a separately authorized
publication; a local VERSION change does not establish publication or support.

We aim to acknowledge private reports within **10 business days**, on a
**best-effort** basis. This is an acknowledgement target, not an SLA or a deadline
for triage, remediation, release or public disclosure. Reports can require more
investigation; we coordinate disclosure with the reporter after assessing the
issue and the available fix. The target covers reporting and coordination for
this design-system package, not consumer applications or upstream services.
<!-- END GENERATED SECURITY SUPPORT -->

The development lockfile resolves Vite **8.1.6**, the patched 8.1.x version for
[GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm).
Keep the complete dependency audit separate from this specific update; a version
floor alone does not establish that future dependency resolutions are safe.

Lockfile phát triển dùng Vite **8.1.6**, phiên bản 8.1.x đã sửa
[GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm).
Giữ kết quả audit toàn bộ dependency riêng với cập nhật cụ thể này; mức phiên bản
tối thiểu không chứng minh mọi lần phân giải dependency về sau đều an toàn.

## Public surfaces

The hosted site ships `_audit/` gate tooling intentionally — Storybook Status embeds `_audit/run.html` full-bleed. Treat audit harnesses as public documentation, not a private control plane.

## Out of scope

Third-party consumer apps, Vercel/npm account compromise, and vulnerabilities that only affect unmaintained forks are outside this policy’s remediation commitment.
