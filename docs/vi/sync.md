# Repo ↔ môi trường authoring — round-trip fidelity & đồng bộ hai chiều

Repo GitHub (`cyberskill-official/design`) là **nguồn chân lý**. Session compiler (ví dụ Claude Design) là filesystem project tạm — tài liệu này nói cách chúng giữ sync mà không mất việc. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Repo có khôi phục nguyên hệ thống không?

**Trong session compiler DC-capable — có.** Mọi thứ định nghĩa hệ thống là file text/asset thuần và round-trip lossless:
- `styles.css` + `tokens/` + `base/` (mọi CSS + `tokens.json`/`tokens.js`)
- `components/**` (`.jsx` + `.d.ts` + `.prompt.md` + `*.card.html`)
- `templates/**/*.dc.html` (+ `ds-base.js`, `support.js`)
- `guidelines/`, `ui_kits/`, `fonts/` (woff2), `assets/`, `docs/`, `_audit/*.html`

- **`_esm/react.mjs`** — entry React bundler-native (export package mặc định; React peer). Regenerated qua `npm run build:react-entry`.
- **`_esm/cs.mjs`** — entry ESM browser / no-build legacy (`@cyberskill/design/legacy`). Tiền tố underscore **không** nghĩa là build artifact hay gitignored ở đây (chỉ `uploads/`, `scraps/`, `_audit/exports/` là — xem Hygiene bên dưới); `_esm/` là source, cùng tầng với `templates/` hoặc `docs/`. Một lần port trước đã bỏ nó đúng vì giả định đó và làm gãy ESM smoke gate — nếu bạn port/copy cây này bằng tay, **explicit include mọi thư mục top-level danh sách này đặt tên**, đừng suy từ tiền tố `_`.

- `README.md`, `CONTRIBUTING.md`, `SKILL.md`, `docs/doctrine.md`, shim host (`CLAUDE.md`), `VERSION`, `DESIGN.md` (open-spec surface generate — commit, chỉ regen qua `npm run build:design-md`, khóa bởi gate `design-md-parity`)

Kéo chúng vào project mới (xem bên dưới) và compiler nhận lại như design system — nó khóa vào `styles.css`, cặp `.d.ts`/`.jsx`, HTML `@dsCard`, và `templates/`. Artifact compile đã commit (`_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`, `dist/styles.min.css`, `DESIGN.md`) là một phần hợp đồng consumer — giữ trong cây và regenerate bằng npm script đã ghi, đừng coi chúng là disposable.

**Ở agent khác (Google Stitch, LLM tool generic) — một phần.** Chúng tiêu thụ được lớp **portable** — `tokens/tokens.json` + `tokens.js`, raw CSS, component `.jsx`, fonts, và Markdown docs — nhưng **không** hiểu format Design-Component `.dc.html` hay compiler điều khiển nó. Vậy agent không-compiler nhận tokens, styles, và source component như file, không phải hành vi DC/tweak/compile live. Hướng những tool đó vào root **`DESIGN.md`** trước (open-spec kiểu Stitch generate: doctrine + mọi giá trị token + inventory, regen từ DTCG qua `npm run build:design-md` và khóa bởi gate `design-md-parity`), rồi `tokens.json` / `tokens.dtcg.json` và CSS cho hợp đồng máy; coi `.dc.html` + compiler là native DC.

## Đồng bộ hai chiều (repo = nguồn chân lý)

Session compiler có thể **đọc/copy từ** GitHub nhưng thường **không push tới** nó. Vậy sync là *pull tự động, push thủ công*:
**Bắt đầu session — pull (tin cậy, tự động):** bảo agent load repo. Nó copy cây vào project mới (đường `github_copy_files`), compiler validate, và bạn tiếp từ chân lý đã commit — không bao giờ từ project state cũ. Luôn bắt đầu đây; đừng resume từ project nửa nhớ.

**Kết thúc session — push (thủ công, review):** tải project, rồi từ clone:
```
git checkout -b session/<date-or-topic>

# copy file đã tải lên working tree (giữ .git/, .github/, LICENSE)
git add -A && git commit -m "DS <VERSION> — <summary>"
git push -u origin session/<date-or-topic>   # branch, không bao giờ --force, không bao giờ thẳng main

# mở PR, review diff, merge
```
Diff PR là lưới an toàn — nó hiện đúng những gì đổi kể từ chân lý commit lần trước.

## Hygiene giữ round-trip sạch
- **`.gitignore`** transient (`uploads/`, `scraps/`, `_audit/exports/`); commit mọi thứ khác, **kể cả `_esm/`** (xem trên — nó là source, không phải build artifact, dù có tiền tố `_`). Compiled `_ds_bundle.js`/manifest được commit cho consumer không có bước build, nhưng kỳ vọng churn — hoặc ignore và để mỗi session regenerate.

- **`VERSION` đã LAUNCH ở 1.1.0; pin theo `VERSION`** — auto-bump khi push lên `main` (`.github/workflows/version.yml` → tag `v*` → `npm-publish.yml`); owner vẫn có thể force bump. Không maintain file changelog. Continuity là git history; việc maintainer đang mở nằm ở `docs/decisions.md`.

- **Một nguồn chân lý tại một thời điểm.** Đừng sửa repo và project Claude Design song song rồi push cả hai — pull, làm việc, push, theo thứ tự đó, để repo luôn là điểm merge.

- **Commit nhỏ, thường xuyên** hơn một dump khổng lồ cuối project — diff nhỏ an toàn hơn để review và ít khả năng lặng lẽ bỏ file.

## TL;DR
Push project này → repo là archive trung thành, khôi phục được **cho Claude Design** (pull lúc bắt đầu, compiler rebuild file derived). Agent khác nhận lớp token/style/JSX portable, không runtime DC. Làm hai chiều bằng **pull từ repo đầu mọi session và commit lại qua PR cuối** — repo giữ nguồn chân lý và không mất việc giữa session tạm.
