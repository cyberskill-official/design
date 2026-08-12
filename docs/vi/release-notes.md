# Ghi chú phát hành

Điểm nổi bật sản phẩm cho operator — **không** phải git log và **không** phải `CHANGELOG.md`. Hệ thống thiết kế không maintain file changelog. VERSION **1.5.1** (auto-bump khi push lên `main` từ Conventional Commits; owner vẫn có thể force bump). Chân lý kỹ thuật là tip repo; chân lý hướng sản phẩm là trang này (đồng bộ Storybook **Release Notes**). Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Release — `@cyberskill/design@1.3.10`

Docs: một VERSION duy nhất trên surface operator (không lead-in “pin” / LAUNCH kép). Các mục Release / Patch / LAUNCH bên dưới giữ làm archive có ngày.

## Release — `@cyberskill/design@1.3.9`

Docs operator xuất bản qua sidebar Storybook **Docs** (doctrine, bộ tracked EN·VI, gate coverage + link docs↔Storybook). Gate HTML trên Status live chỉ kiểm **surface đã publish**; twin Node vẫn chứng minh nguồn CSF/MDX. Story Docs từng trang truyền `?embed=1` để ẩn chrome Documentation Library trong Storybook (`/docs/viewer.html` standalone giữ nguyên).

```bash
npm install @cyberskill/design@1.3.9
```

## Release — `@cyberskill/design@1.3.0`

Assessment remediation Phases 0–5 và đóng gap (TASK-IMP-001…021): contrast, pack-contract, overlay manager, gate zoom/CQ, và polish Storybook / template liên quan.

## Release — `@cyberskill/design@1.2.0`

`VERSION` **auto-bump trên `main`** (Conventional Commits → tag `v*` → `npm-publish.yml` Trusted Publishing). Owner vẫn có thể force bump qua `Release-As:` / `workflow_dispatch`. Continuity curated vẫn ở trang này — vẫn **không** có root `CHANGELOG.md`.

## Patch — `@cyberskill/design@1.1.1`

Republish lockstep sau cut LAUNCH: regen natives / provenance / `_ds_bundle.js` để registry khớp tip, và bỏ `CHANGELOG.md` gốc bị cấm. Cài:

```bash
npm install @cyberskill/design@1.1.1
```

## LAUNCH — `@cyberskill/design@1.1.0`

Cut **LAUNCH** của owner. `VERSION` / `package.json` và mọi version stamp chuyển từ pin pre-LAUNCH **1.0.0** sang **1.1.0**. Publish qua **npm Trusted Publishing (OIDC)** trên tag `v1.1.0` (hoặc `workflow_dispatch`). Publishing access trên npmjs **disallow tokens**. Soft-skip install registry của npm-hello là trung thực cho tới khi **1.1.0** live trên registry — soft-skip ≠ đã publish.

Dùng đã duyệt cho sản phẩm portfolio CyberSkill vẫn tại **`docs/consumer-grant.md`** (+ VI). Package vẫn **UNLICENSED**. Đường consumer browser đầu tiên: `examples/npm-hello/` (Lumi · Hỏa · plasma) — xem `docs/consuming.md`.

```bash
npm install @cyberskill/design@1.1.0
```

## Storybook tại gốc domain

`design.cyberskill.world/` là site sản phẩm Storybook đầy đủ. Docs, Foundations, Components, Release Notes và Status nằm trong một sidebar. Đường legacy `/dashboard` và `/playground` redirect về `/`.

Consumer portable: `styles.css`, `_ds_bundle.js`, bundler-native `_esm/react.mjs` (mặc định `exports["."]`; React peer), và browser legacy `_esm/cs.mjs` (`@cyberskill/design/legacy`). Storybook chỉ là tooling host.

## Quality gate trên Status

Story **Status** nhúng bảng gate nhanh (`_audit/run.html`). Gate cứng fail board khi hỏng; hàng advisory được gắn nhãn rõ và không lật aggregate pass. Mở Status lần đầu sẽ auto-run; dùng **Re-run** khi cần chạy lại.

## Docs và template song ngữ

Docs operator công khai có cặp EN·VI dưới `docs/` / `docs/vi/`. Template giữ bilingual EN·VN với chế độ ngôn ngữ tách hoàn toàn. Chuỗi component resolve từ registry trung tâm.

## Foundations và thư viện CSF

Toolbar Theme × Element × Language × Style mirror template production (Theme gồm **system** cho OS `prefers-color-scheme`). Mọi primary công khai ship Default story cộng control matrix trung thực; FullMatrix cover mọi qualifier ≥1-axis. Axe smoke quét mọi primary công khai. Pack Style duy nhất là **liquid-glass**. Foundations cover màu, typography, spacing, elevation, motion, và 15 pack element Ngũ Hành.

## Token và mirror native

Token CSS, DTCG (`tokens/tokens.dtcg.json`), và mirror SwiftUI / Compose / Flutter pre-generated giữ lockstep qua pipeline token. Text không bao giờ ngồi trên `-accent` mid-tone — doctrine APCA được gate enforce.

## Những gì chúng ta không bao giờ ship

- Root **`CHANGELOG.md`** (cấm bởi doctrine và docs-consistency)
- Storybook như dependency consumer
