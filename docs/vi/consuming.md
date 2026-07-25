# Tiêu thụ & nâng cấp CyberSkill Design System

Cách mọi project — do người hoặc agent điều khiển — áp dụng design system HTML-first này, và cách nhận update an toàn.

**Tên package:** `@cyberskill/design` (xem `package.json`). Không coi `@cyberskill/react` lịch sử là đường cài cho monolith này.

## Claude Code vs Google Stitch

| Consumer | Bắt đầu tại | Hoạt động hôm nay | Không làm |
|---|---|---|---|
| **Claude Code** | `SKILL.md` → `README.md` → `styles.css` + bundler `@cyberskill/design` / legacy `_esm/cs.mjs` / `_ds_bundle.js` (resolve theo prefix) | Mạnh — rules, components, prompts; gates qua full clone | Hardcode hậu tố bundle; coi Storybook host là hợp đồng portable; import `_esm/cs.mjs` hoặc `@cyberskill/design/legacy` vào bundler Next/SSR |
| **Google Stitch** | `DESIGN.md` → `llms.txt` → `tokens/tokens.dtcg.json` | Mạnh cho doctrine + tokens + HTML tĩnh `.cs-*` | Coi `templates/**/*.dc.html` là SoT — không có tweaks / `__dcSetProps` / DC compiler |
| **Claude Design** | Full repo + DC compiler | Full fidelity (tweaks, `x-import`, template bilingual) | Bỏ qua vòng sync trong `docs/sync.md` |
| **npm** | `@cyberskill/design` | **1.0.0** trên registry; CI Trusted Publishing; grant tại `docs/consumer-grant.md` | Coi cài từ registry như license công khai (vẫn UNLICENSED) |

**Quy tắc DC cho Stitch:** Stitch (và mọi tool non-DC) **không** được tiêu thụ `*.dc.html` như nguồn chân lý. Dùng pattern export tĩnh, `templates/kitchen-sink.html`, `examples/static-hello/`, và class `.cs-*` từ `styles.css`.

**Tín hiệu release:** VERSION giữ **1.0.0** (không CHANGELOG). Coi **git tip SHA** là chân lý kỹ thuật; đọc điểm nổi bật sản phẩm curated trong `docs/release-notes.md`.

## Đường nhanh cho AI agent (Claude Code, hoặc điều khiển một agent)

**Bạn nhận:** `styles.css` (400+ token + class `.cs-*` + bề mặt Liquid Glass, `@import` `tokens/` + `base/`) · `_ds_bundle.js` (React component đã compile, không cần build) · `_esm/react.mjs` (entry React bundler-native — React là peerDependency; mặc định `exports["."]`) · `_esm/cs.mjs` (browser / no-build legacy qua `exports["./legacy"]`) · `_ds_manifest.json` (inventory máy đọc được) · mỗi component `Name.d.ts` (API) + `Name.prompt.md` (brief dùng) · `tokens/tokens.dtcg.json` (W3C DTCG) + `tokens.json`/`tokens.js`.

**Checkout repo** — clone hoặc copy cả cây; mọi thứ là static đường dẫn tương đối. Điểm vào: Storybook trên host site (`/` / `npm run storybook`) · `guidelines/atomic-view.html` (mọi component live, portable) · `templates/<slug>/` (điểm bắt đầu copy được — DC cho Claude Design; kitchen-sink / `.cs-*` cho Stitch). Đọc `SKILL.md` trước khi author bất kỳ thứ gì on-brand; reader Stitch bắt đầu tại `DESIGN.md`. Bản đồ sâu hơn ở `llms.txt` (inventory) và file này (hướng dẫn adopt + upgrade đầy đủ bên dưới).

**Sau import — chứng minh health.** Mở `_audit/run.html`, để bảng gate chạy xong (mọi fast gate). Tất cả xanh = bản copy nhất quán nội bộ (contrast, docs, portability, tokens, consumer path, behavior, a11y, stories, bilingual parity). Chỉ full-clone — `_audit/` không nằm trong tarball npm.

**Quy tắc giữ transfer lossless:**
- Không bao giờ hardcode hậu tố namespace bundle (xem "Resolve by prefix" bên dưới — gate enforce).

- Không bao giờ tạo lại/đổi màu logo — dùng `assets/logo-mark.svg` / component `Logo`.

- Mọi chuỗi UI ship EN + VN qua registry; không inline chuỗi một ngôn ngữ trong component.

- Anchors (Umber/Ochre), tên class `.cs-*`, tên token `--cs-*` là hợp đồng ổn định.

- Mở rộng hệ thống? Theo `CONTRIBUTING.md` (Expansion Rule: lan tới mọi deliverable trong một change; verify qua `_audit/`).

## Adopt qua npm (tùy chọn)

Package có thể publish (`private: false`, phiên bản cố định **1.0.0**). License vẫn **UNLICENSED** — cài từ registry **không** tự cấp quyền redistribution. **`@cyberskill/design@1.0.0` đã publish.** CI republish qua **npm Trusted Publishing (OIDC)** trên workflow `npm-publish.yml` (không token publish dài hạn; Publishing access package **disallow tokens**). Dùng đã duyệt ghi tại **`docs/consumer-grant.md`** (sản phẩm portfolio CyberSkill từ `docs/products.md`). Xem `docs/decisions.md` và `docs/ci-cd.md`.

**Grant consumer (chính sách owner — không phải secret).** Đã viết và có hiệu lực tại `docs/consumer-grant.md` (+ `docs/vi/consumer-grant.md`). Team bên ngoài cần stanza có ngày thêm vào đó; redistribution ngoài sản phẩm đã grant cần grant viết thêm.

```bash
npm install @cyberskill/design@1.0.0
```

Rồi link styles và import component. **App Next.js / Vite / SSR** dùng entry mặc định (bundler-native):

```ts
import { Button, TextField } from "@cyberskill/design";
// tương đương: import { Button } from "@cyberskill/design/react";
import "@cyberskill/design/styles.css";
```

Thêm `transpilePackages: ["@cyberskill/design"]` trong Next.js (JSX ship dạng source). React và react-dom là **peerDependencies** — app của bạn cung cấp. Types publish dùng `export type *` (**TypeScript 5.0+**). **Không** import `_esm/cs.mjs` (hay `@cyberskill/design/legacy`) vào bundler SSR; đường đó self-ensure React qua CDN và side-load `_ds_bundle.js` chỉ cho browser.

**Browser / no-build:** import `@cyberskill/design/legacy` (`_esm/cs.mjs`) hoặc tiếp tục dùng đường cây tĩnh bên dưới. Tarball đã publish là **cả cây portable** (styles, tokens, components, templates, guidelines, docs, UI kits) — không phải subset “chỉ lib” tối thiểu. Tooling chỉ-host (Storybook, `_audit/`) không nằm trong `files[]`.

**Cài thật đầu tiên (Lumi).** Consumer **browser** copy-paste: `examples/npm-hello/` — cài `@cyberskill/design@1.0.0` từ registry, link `styles.css`, mount `Button` qua entry **legacy** (`_esm/cs.mjs`), scope **Lumi** với `data-cs-element="hoa" data-cs-variant="plasma"` (hàng đã khóa trong `docs/products.md`). Trong thư mục đó: `npm install && npm run smoke && npm start` → mở `http://127.0.0.1:8766/`. Team Status Hub dùng cùng install và đổi sang `data-cs-element="thuy"` — không invent ánh xạ. Cho app Next/SSR (ví dụ Lumi landing), dùng `import { Button } from "@cyberskill/design"` như trên — không dùng import map của npm-hello.

**Đường publish (maintainer):** `prepublishOnly` chạy `build:bundle` + `build:design-md --check`. Workflow `.github/workflows/npm-publish.yml` trên `workflow_dispatch` / tag `v*` dùng **Trusted Publishing** (`permissions.id-token: write`; không đặt `NODE_AUTH_TOKEN` trên bước publish). `node _audit/ci/npm-publish.mjs --dry-run` luôn liệt kê tarball. Xem `docs/ci-cd.md` và `docs/decisions.md`.

## Adopt (hai đường, cộng shortcut module)

**1. Static / prototype / mock — link stylesheet.** Copy `styles.css` (+ `tokens/`, `base/`, `fonts/` mà nó `@import`, hoặc serve cả cây) và link; bạn có mọi token `--cs-*`, class component `.cs-*`, và bề mặt Liquid Glass. Compose bằng class (xem `templates/kitchen-sink.html`). Copy mọi asset bạn tham chiếu từ `assets/`.

**2. React production — nạp compiled bundle.** Link `styles.css` và `<script src="_ds_bundle.js">`, rồi đọc component từ namespace. **Resolve theo prefix, không hardcode:** bundle expose `window.CyberSkillDesignSystem_<projectId>`, và hậu tố 6-hex đó do compiler gán và **đổi khi import vào project khác**:
```html
<link rel="stylesheet" href="<path>/styles.css">
<script src="<path>/_ds_bundle.js"></script>
<script>
 const CS = window[Object.keys(window).find(k => /^CyberSkillDesignSystem_/.test(k))];
 const { Button, TextField, DataGrid } = CS;
</script>
```
Đây đúng là những gì `_audit/consumer-smoke-test.html` chạy (và assert xanh) — và `ds-base.js` của templates làm tương tự, publish alias ổn định `window.CyberSkillDS`.
**2b. React bundler-native (Next / Vite / SSR) — entry package mặc định.** `import { Button, TextField } from "@cyberskill/design"` resolve tới `_esm/react.mjs` (cũng export như `@cyberskill/design/react`). Re-export mọi component từ JSX source với **React là peer external** — không CDN, không side-load `_ds_bundle.js`. Bundler của bạn phải transpile package (Next: `transpilePackages: ["@cyberskill/design"]`). Vẫn tự link `styles.css`. Regenerated bằng `npm run build:react-entry`; parity được gate bởi `package-exports-integrity` + `test:react-entry`.

**2c. ESM browser legacy — một import, không build.** `import { Button, TextField } from "@cyberskill/design/legacy"` (hoặc `"<path>/_esm/cs.mjs"`) — module tự ensure React (pinned; bỏ qua khi đã có `window.React`), side-load `_ds_bundle.js` một lần, resolve namespace theo prefix, và re-export mọi component (`_audit/esm-smoke-test.html` giữ danh sách export khóa với manifest). Vẫn tự link `styles.css`. **Không dùng cho Next/SSR.**

**Templates.** Mỗi `templates/<slug>/` là Design Component seed từ `ds-base.js` (một dòng `base` để rebind đường dẫn tới nơi hệ thống này nằm tương đối với trang tiêu thụ). Copy thư mục và sửa copy/tweaks.

**Token máy đọc được.** `tokens/tokens.json` + `tokens/tokens.js` (ESM) + `tokens/tokens.dtcg.json` (W3C DTCG, cho Tokens Studio/Style Dictionary) expose mọi token nhóm theo category + map theme/element — cho pipeline native/mobile/design-tool. **Native build ship sẵn** trong `tokens/native/` (SwiftUI `CSTokens.swift` · Compose `CSTokens.kt` · Flutter `cs_tokens.dart`) kèm `tokens/provenance.json` (release, source sha-256, quy tắc chuyển đổi, sha-256 từng target); gate `token-pipeline` giữ chúng khóa với nguồn DTCG.

**HTML tĩnh / không React / không build tooling.** Link `styles.css` và compose bằng class `.cs-*` — catalog đầy đủ trong `templates/kitchen-sink.html`.

**Font, kể cả mặt chữ display.** Cả ba họ chữ brand đều self-host trong `fonts/` và khai báo ở `tokens/fonts.css` (được `styles.css` `@import`): **Be Vietnam Pro** (`--cs-font-family-ui`), **JetBrains Mono** (`--cs-font-family-mono`), và **Space Grotesk** (`--cs-font-family-display`, variable 300–700, có subset tiếng Việt). Mặt chữ display là **opt-in** — không thứ gì trong DS trỏ vào nó. Sản phẩm muốn mặt chữ tiêu đề thêm `class="cs-display-face"` (hoặc đặt `--cs-heading-family: var(--cs-font-family-display)`) trên scope; các utility heading theo sau, body copy vẫn ở mặt chữ UI.

Consumer bỏ qua `styles.css` để tự kiểm soát font loading (`cyberskill.world` / Lumi import riêng các sheet token + base và giữ chiến lược `font-display: optional` của mình) có thể chuyển từ `brand-fonts.css` tự chế sang package: hoặc `@import "@cyberskill/design/tokens/fonts.css"` để lấy face đóng gói, hoặc giữ block `@font-face` cục bộ và trỏ `--cs-heading-family` vào `var(--cs-font-family-display)` để **role** đến từ DS ngay cả khi **byte** vẫn phục vụ cục bộ. Cách nào thì mặt chữ display cũng thôi là ngoại lệ riêng của một sản phẩm. Space Grotesk không có weight 800, nên `--cs-heading-weight-strong` (800) dưới `.cs-display-face` clamp về 700 trong Space Grotesk — CSS không nhảy sang Be Vietnam Pro vì thiếu weight.

## Ba trục

Đặt Theme (`data-theme`), Element (`data-cs-element` + `data-cs-variant`), và Language (`lang` / Language tweak trên template) trên một container; mọi thứ bên trong re-skin không cần đổi code (xem `templates/playground.html`). Mặc định: `light · tho · en`. Xử lý bề mặt là liquid-glass (cố định). Bilingual: component resolve chuỗi từ `lang` (`lang="vi"` trên mọi container → tiếng Việt đầy đủ).

## Nâng cấp

- **Phiên bản cố định.** `VERSION` và `package.json` giữ **1.0.0**. Không có file changelog design-system — coi **git tip SHA** là chân lý kỹ thuật, và đọc **Release Notes** curated (Storybook + `docs/release-notes.md`) cho điểm nổi bật hướng sản phẩm.

- Anchors (Umber/Ochre), tên class `.cs-*`, và tên token `--cs-*` là hợp đồng ổn định — an toàn để phụ thuộc. Đổi tên phá vỡ những hợp đồng đó phải hiếm và được gọi ra trong PR/docs khi xảy ra.

- **Chạy lại smoke test sau nâng cấp.** Mở `_audit/consumer-smoke-test.html` và bảng Health đầy đủ (`_audit/run.html`) trên tip mới — runner chứng minh đường packaged vẫn resolve.

## Host Storybook (tùy chọn)

Site live phục vụ Storybook tại `/` như **bề mặt sản phẩm** cho operator (Theme × Element × Language + ma trận điều khiển). Đó là **tooling chỉ-host** — đừng phụ thuộc Storybook trong product app. Atomic View portable vẫn ở `guidelines/atomic-view.html`. Xem `docs/storybook.md` và `docs/live-hub.md`.

## Spike consumer năm phút

**Đường registry (ưu tiên cho product app):**

```bash
cd examples/npm-hello
npm install
npm run smoke
npm start
# mở http://127.0.0.1:8766/
```

**Đường clone / tĩnh (không npm):**

```bash
# từ monorepo root
python3 -m http.server 8765 --bind 127.0.0.1
# mở http://127.0.0.1:8765/examples/static-hello/
# rồi http://127.0.0.1:8765/_audit/consumer-smoke-test.html
```

Sửa `examples/static-hello/index.html`: flip `data-theme="dark"` hoặc `data-cs-element="thuy"` trên `<body>`. Không install, không Storybook.

## Native sample hosts (tùy chọn)

Sample đa màn hình (Sign in · Home · Settings) nằm dưới `examples/native/swiftui`, `compose`, và `flutter`. Chúng sync token generate qua `node examples/native/sync-tokens.mjs`. Compose mở bằng **Android Studio** (không commit `gradlew` — CLI cần JDK 17+ + SDK; xem `examples/native/README.md`). Không bắt buộc cho web consumer.

## Mở rộng

Nếu bạn đang đổi chính hệ thống (không chỉ tiêu thụ), theo `CONTRIBUTING.md` — Expansion Rule (lan tới mọi deliverable trong một change) và doctrine verification (deep check qua `_audit/`).
