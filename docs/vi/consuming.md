# Tiêu thụ & nâng cấp CyberSkill Design System

Cách mọi project — do người hoặc agent điều khiển — áp dụng design system HTML-first này, và cách nhận update an toàn. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Tên package:** `@cyberskill/design` (xem `package.json`). Không coi `@cyberskill/react` lịch sử là đường cài cho monolith này.

## Khi nào dùng

Bạn đang cài, liên kết, hoặc nâng cấp hệ thống trong sản phẩm khác. Maintainer mở rộng hệ thống bắt đầu từ `docs/doctrine.md`.

## Quyền quản lý state của component

Có callback thay đổi không đồng nghĩa component trở thành controlled. Với component hỗ trợ cả hai chế độ, bỏ prop điều khiển để component tự quản lý giá trị; thêm callback chỉ để quan sát, component vẫn cập nhật state nội bộ. Khi truyền prop điều khiển, component cha quản lý giá trị đã chốt. Callback đề xuất thay đổi; giá trị hiển thị đi theo lần render tiếp theo của component cha.

```jsx
<NumberField onChange={recordQuantityChange} />
<NumberField value={quantity} onChange={setQuantity} />
```

Các component hỗ trợ hai chế độ gồm NumberField, SearchField, PromptInput, InputGroup, InputOTP, InlineEdit, TagInput, Mentions và Rating (`value`), Toggle (`pressed`), cùng Menu, Popover, AlertDialog và Collapsible (`open`). Giữ nguyên chế độ sở hữu state trong suốt một lần mount. Bỏ prop điều khiển khi dùng uncontrolled; `null` không phải giá trị được khai báo cho prop này. Nếu API có giá trị mặc định, giá trị đó chỉ khởi tạo lần mount. Thay đổi default không reset nội dung đã sửa; dùng React key mới để remount hoặc cập nhật prop controlled.

Các wrapper native—TextField, Textarea, Checkbox, Radio, Switch, Slider, Select và NativeSelect—giữ cơ chế `value`/`checked`, các prop mặc định và callback sự kiện của React. Đọc `event.target.value` hoặc `event.target.checked`; callback giá trị của component tùy biến nhận trực tiếp giá trị. Reset form native khôi phục các trường native uncontrolled. Thao tác này không tự reset state React tùy biến.

Một số control vẫn yêu cầu component cha quản lý giá trị dù prop giá trị là tùy chọn. Calendar, giá trị được chọn trong picker, RadioGroup, SegmentedControl, Tabs, Pagination, Transfer, lựa chọn trong Tree, thứ tự Sortable và lựa chọn DataGrid tuân theo declaration tương ứng. Nội dung tìm kiếm, trạng thái mở rộng, sắp xếp hoặc popup nội bộ không biến giá trị đã chốt thành uncontrolled. Dialog, Drawer, CommandPalette và Tour cần component cha xử lý yêu cầu đóng rồi cập nhật `open`. Chỉ dùng prop disabled/read-only được API component khai báo.

Form quản lý giá trị các field/array đã đăng ký và khôi phục `initialValues` tại thời điểm mount khi reset native. Payload kết hợp các mục native có tên, kể cả tên dạng dotted path, với giá trị controller ở cấp cao nhất; FormWizard gửi object của controller. Reset FormWizard bằng remount. `defaultValue`/`unsafeHtml` của Editor chỉ khởi tạo HTML khi mount; remount để thay nội dung đã sửa, đồng thời giữ ranh giới tin cậy HTML đã được tài liệu quy định. FileUpload thông báo các file được chọn hoặc thả vào từ trình duyệt; component này không có prop giá trị controlled.

Ngôn ngữ của chuỗi UI có sẵn được xác định theo thứ tự: prop `lang` tường minh, scope DOM `[lang]` gần nhất, ngôn ngữ tài liệu, rồi tiếng Việt. Prop rỗng hoặc chỉ có khoảng trắng kế thừa ngôn ngữ và vẫn phản hồi khi scope thay đổi. Root xuất hiện muộn xác định ngôn ngữ lúc mount; portal kế thừa scope DOM tại nơi hiển thị. Nếu chưa có bảng cho locale yêu cầu, hệ thống fallback sang tiếng Anh, rồi tiếng Việt, rồi tên key. Bên gọi chịu trách nhiệm dịch title, label và nội dung tự truyền vào. Tiếng Nhật vẫn là spike một phần, chưa phải ngôn ngữ sản phẩm được hỗ trợ đầy đủ.

## Capability paths (DC-capable vs static)

| Consumer | Bắt đầu tại | Đường dùng và giới hạn xác minh | Không làm |
|---|---|---|---|
| **Claude Code** | `SKILL.md` → `README.md` → `styles.css` + bundler `@cyberskill/design` / legacy `_esm/cs.mjs` / `_ds_bundle.js` (resolve theo prefix) | Rules, components và prompts của repo; xác minh việc nạp skill và một tác vụ đại diện trong host | Hardcode hậu tố bundle; coi Storybook host là hợp đồng portable; import `_esm/cs.mjs` hoặc `@cyberskill/design/legacy` vào bundler Next/SSR |
| **Google Stitch** | `DESIGN.md` → `llms.txt` → `tokens/tokens.dtcg.json` | Doctrine, tokens và HTML tĩnh `.cs-*`; xác minh riêng đầu ra do tool tạo | Coi `templates/**/*.dc.html` là SoT — không có tweaks / `__dcSetProps` / DC compiler |
| **Claude Design** | Full repo + DC compiler khả dụng | Source authoring DC cho tweaks, `x-import` và điều khiển ngôn ngữ đã khai báo; xác minh compiler khả dụng, preview và từng export cần dùng | Bỏ qua vòng sync trong `docs/sync.md` |
| **npm** | `@cyberskill/design` | Phiên bản repo và việc xuất bản registry là hai trạng thái riêng: auto-bump → tag validation → authorized dispatch → xuất bản đã xác minh; grant tại `docs/consumer-grant.md` | Coi cài từ registry như license công khai (vẫn UNLICENSED) |

**Quy tắc DC cho Stitch:** Stitch (và mọi tool non-DC) **không** được tiêu thụ `*.dc.html` như nguồn chân lý. Dùng pattern export tĩnh, `templates/kitchen-sink.html`, `examples/static-hello/`, và class `.cs-*` từ `styles.css`.

**Tín hiệu release:** **theo `VERSION`** (auto-bump trên `main`; không CHANGELOG). Coi **git tip SHA** là chân lý kỹ thuật; đọc điểm nổi bật sản phẩm curated trong `docs/release-notes.md`.

## Đường nhanh cho AI agent (DC-capable authoring, hoặc điều khiển một agent)

**Bạn nhận:** `styles.css` (token CSS công khai + class `.cs-*` + bề mặt Liquid Glass, `@import` `tokens/` + `base/`) · `_ds_bundle.js` (React component đã compile, không cần build) · `_esm/react.mjs` (entry React bundler-native — React là peerDependency; mặc định `exports["."]`) · `_esm/cs.mjs` (browser / no-build legacy qua `exports["./legacy"]`) · `_ds_manifest.json` (inventory máy đọc được) · mỗi component `Name.d.ts` (API) + `Name.prompt.md` (brief dùng) · `tokens/tokens.dtcg.json` (DTCG 2025.10) + `tokens.json`/`tokens.js`.

**Checkout repo** — clone hoặc copy cả cây; mọi thứ là static đường dẫn tương đối. Điểm vào: Storybook trên host site (`/` / `npm run storybook`) · `guidelines/atomic-view.html` (mọi component live, portable) · `templates/<slug>/` (điểm bắt đầu copy được — DC khi có compiler; kitchen-sink / `.cs-*` cho Stitch / static). Đọc `SKILL.md` trước khi author bất kỳ thứ gì on-brand; reader Stitch bắt đầu tại `DESIGN.md`. Bản đồ sâu hơn ở `llms.txt` (inventory) và file này (hướng dẫn adopt + upgrade đầy đủ bên dưới).

**Sau import — chạy kiểm tra.** Mở `_audit/run.html` và để mọi fast gate chạy xong. Một kết quả pass chỉ bao phủ phạm vi gate đã triển khai cùng source/môi trường được kiểm tra. Đọc kết quả skipped, N/A, advisory và waiver; sau đó chạy các kiểm tra consumer, tương tác và export phù hợp với sản phẩm. Accessibility đầy đủ, chất lượng hình ảnh và hành vi host cần bằng chứng riêng cùng đánh giá của con người. Chỉ full-clone — `_audit/` không nằm trong tarball npm.

**Kiểm tra khi transfer:**
- Không bao giờ hardcode hậu tố namespace bundle (xem "Resolve by prefix" bên dưới — gate enforce).

- Không bao giờ tạo lại/đổi màu logo — dùng `assets/logo-mark.svg` / component `Logo`.

- Mọi chuỗi UI ship EN + VN qua registry; không inline chuỗi một ngôn ngữ trong component.

- Anchors (Umber/Ochre), tên class `.cs-*`, tên token `--cs-*` là hợp đồng ổn định.

- Mở rộng hệ thống? Theo `docs/doctrine.md` và `CONTRIBUTING.md` (Expansion Rule: lan tới mọi deliverable trong một change; verify qua `_audit/`).

## Adopt qua npm (tùy chọn)

Package có thể publish (`private: false`; phiên bản = root `VERSION`). License vẫn **UNLICENSED** — cài từ registry **không** tự cấp quyền redistribution. **Phiên bản package = root `VERSION`**. Dùng đã duyệt ghi tại **`docs/consumer-grant.md`** (sản phẩm portfolio CyberSkill từ `docs/products.md`). Xem `docs/decisions.md` và `docs/ci-cd.md`.

**Grant consumer (chính sách owner — không phải secret).** Đã viết và có hiệu lực tại `docs/consumer-grant.md` (+ `docs/vi/consumer-grant.md`). Team bên ngoài cần stanza có ngày thêm vào đó; redistribution ngoài sản phẩm đã grant cần grant viết thêm.

```bash
npm install @cyberskill/design@<VERSION>
```

Rồi link styles và import component. **App Next.js / Vite / SSR** dùng entry mặc định (bundler-native):

```ts
import { Button, TextField } from "@cyberskill/design";
// tương đương: import { Button } from "@cyberskill/design/react";
import "@cyberskill/design/styles.css";
```

Thêm `transpilePackages: ["@cyberskill/design"]` trong Next.js (JSX ship dạng source). Entry mặc định (`_esm/react.mjs`) là **barrel `"use client"`** — Server Component App Router có thể `import { Button } from "@cyberskill/design"` mà không cần shim client từng import. React và react-dom là **peerDependencies** — app của bạn cung cấp. Types publish dùng `export type *` (**TypeScript 5.0+**). **Không** import `_esm/cs.mjs` (hay `@cyberskill/design/legacy`) vào bundler SSR; đường browser đó nạp global React còn thiếu từ `_vendor/react/` local trước, chỉ fallback sang CDN đã pin khi tải local lỗi, rồi side-load `_ds_bundle.js`.

**Browser / no-build:** import `@cyberskill/design/legacy` (`_esm/cs.mjs`) hoặc tiếp tục dùng đường cây tĩnh bên dưới. Tarball đã publish là **cả cây portable** (styles, tokens, components, templates, guidelines, docs, UI kits) — không phải subset “chỉ lib” tối thiểu. Tooling chỉ-host (Storybook, `_audit/`) không nằm trong `files[]`.

**Cài thật đầu tiên (Lumi).** Consumer **browser** copy-paste: `examples/npm-hello/` — cài `@cyberskill/design` đúng `VERSION` repo từ registry, link `styles.css`, mount `Button` qua entry **legacy** (`_esm/cs.mjs`), scope **Lumi** với `data-cs-element="hoa" data-cs-variant="plasma"` (hàng đã khóa trong `docs/products.md`). Trong thư mục đó: `npm install && npm run smoke && npm start` → mở `http://127.0.0.1:8766/`. Team Status Hub dùng cùng install và đổi sang `data-cs-element="thuy"` — không invent ánh xạ. Cho app Next/SSR (ví dụ Lumi landing), dùng `import { Button } from "@cyberskill/design"` như trên — không dùng import map của npm-hello.

**Kiểm tra nội dung package (maintainer):** `npm run npm:pack-dry-run` liệt kê nội dung package mà không publish. Xem `docs/ci-cd.md`.

## Adopt (hai đường, cộng shortcut module)

**1. Static / prototype / mock — link stylesheet.** Cho **static production**, link bản flatten `dist/styles.min.css` (cũng `@cyberskill/design/styles.min.css`) — một file, không waterfall `@import`. Giữ `styles.css` (+ `tokens/`, `base/`, `fonts/` mà nó `@import`) làm đường source/dev dễ đọc, hoặc serve cả cây. Cách nào cũng có mọi token `--cs-*`, class component `.cs-*`, và bề mặt Liquid Glass. Compose bằng class (xem `templates/kitchen-sink.html` và `examples/static-hello/`). Copy mọi asset bạn tham chiếu từ `assets/`.

**2. React browser dùng script thường — nạp runtime trước bundle.** Bundle component không chứa React hay ReactDOM. Nạp runtime production local được cung cấp trước, rồi `_ds_bundle.js`; không dùng `async` làm đổi thứ tự script. Tự link styles. Resolve namespace theo prefix thay vì sao chép hậu tố manifest/compiler. Thay `<path>` bằng URL cây design-system đã copy. Ví dụ này mount Button và chạy callback của nó:
```html
<link rel="stylesheet" href="<path>/dist/styles.min.css">
<script src="<path>/_vendor/react/react.production.min.js"></script>
<script src="<path>/_vendor/react/react-dom.production.min.js"></script>
<script src="<path>/_ds_bundle.js"></script>
<div id="ds-example"></div>
<script>
 const CS = window[Object.keys(window).find(k => /^CyberSkillDesignSystem_/.test(k))];
 if (!CS || CS.__errors.length) throw new Error('Design-system bundle failed to initialize');
 function Example() {
   const [count, setCount] = React.useState(0);
   return React.createElement(CS.Button, {
     variant: 'primary', onClick: () => setCount(n => n + 1)
   }, 'Điều ước: ' + count);
 }
 ReactDOM.createRoot(document.getElementById('ds-example')).render(React.createElement(Example));
</script>
```
Helper `ds-base.js` của template cũng đợi cả hai global runtime trước khi nạp bundle, rồi expose `window.CyberSkillDS`. Ví dụ script thường là đường browser; consumer bundler dùng entry package ở 2b.

**2b. React bundler-native (Next / Vite / SSR) — entry package mặc định.** `import { Button, TextField } from "@cyberskill/design"` resolve tới `_esm/react.mjs` (cũng export như `@cyberskill/design/react`). File generated bắt đầu bằng `"use client"` để consumer App Router / RSC import component tương tác trực tiếp. Re-export mọi component từ JSX source với **React là peer external** — không CDN, không side-load `_ds_bundle.js`. Bundler của bạn phải transpile package (Next: `transpilePackages: ["@cyberskill/design"]`). Vẫn tự link styles (`styles.min.css` khuyến nghị cho sheet static production). Regenerated bằng `npm run build:react-entry`; parity được gate bởi `package-exports-integrity` + `test:react-entry`.

**2c. ESM browser legacy — một import, không build.** `import { Button, TextField } from "@cyberskill/design/legacy"` (hoặc `"<path>/_esm/cs.mjs"`) — module kiểm tra `window.React` và `window.ReactDOM` riêng, nạp global còn thiếu từ file production local trong `_vendor/react/` trước, và chỉ fallback sang CDN **umd-react@19.2.8** pin SRI khi tải local lỗi, side-load `_ds_bundle.js` một lần, resolve namespace theo prefix, và re-export mọi component (`_audit/esm-smoke-test.html` giữ danh sách export khóa với manifest). Nếu copy subtree, giữ `_vendor/react/` cùng các license được cung cấp, `_esm/`, `_ds_bundle.js`, CSS và các đường token/base/font được tham chiếu; giữ notice áp dụng. Fallback bên ngoài không phải bảo đảm offline. `npm run test:subtree-consume` kiểm tra bản copy đã khai báo và ví dụ script thường EN/VI với mọi request bên ngoài bị chặn. Vẫn tự link `styles.css`. **Không dùng cho Next/SSR.** App bundler vẫn cung cấp peer `react` / `react-dom` (`^18 || ^19`).

**Templates.** Mỗi `templates/<slug>/` là Design Component seed từ `ds-base.js` (một dòng `base` để rebind đường dẫn tới nơi hệ thống này nằm tương đối với trang tiêu thụ). Copy thư mục và sửa copy/tweaks.

Helper của template đợi React và ReactDOM sẵn sàng rồi mới tải bundle component, dùng chung một promise cho mỗi URL bundle đã phân giải, và báo lỗi khởi tạo module trước khi công bố `window.CyberSkillDS`. Cơ chế này tránh chạy bundle quá sớm hoặc lặp lại khi DC runtime gắn phần head của template. Ví dụ script độc lập ở trên yêu cầu tải React và ReactDOM trước.

**Token máy đọc được.** `tokens/tokens.json` + `tokens/tokens.js` (ESM) + `tokens/tokens.dtcg.json` (profile DTCG 2025.10; xem [hợp đồng phần mở rộng](conventions.md)) chứa các nhóm cơ sở đã xuất và map theme/element dạng CSS — cho pipeline native/mobile/design-tool. Việc nhập vào công cụ thực chưa được xác minh. **Mã nguồn native được tạo sẵn** trong `tokens/native/` (SwiftUI `CSTokens.swift` · Compose `CSTokens.kt` · Flutter `cs_tokens.dart`) kèm `tokens/provenance.json` (release, source sha-256, quy tắc chuyển đổi, sha-256 từng target); gate `token-pipeline` giữ chúng khóa với nguồn DTCG.

**HTML tĩnh / không React / không build tooling.** Link `dist/styles.min.css` (production) hoặc `styles.css` (source/dev) và compose bằng class `.cs-*` — catalog đầy đủ trong `templates/kitchen-sink.html`.

**Font, kể cả mặt chữ display.** Cả ba họ chữ brand đều self-host trong `fonts/` và khai báo ở `tokens/fonts.css` (được `styles.css` `@import`): **Be Vietnam Pro** (`--cs-font-family-ui`), **JetBrains Mono** (`--cs-font-family-mono`), và **Space Grotesk** (`--cs-font-family-display`, variable 300–700, có subset tiếng Việt). Mặt chữ display là **opt-in** — không thứ gì trong DS trỏ vào nó. Sản phẩm muốn mặt chữ tiêu đề thêm `class="cs-display-face"` (hoặc đặt `--cs-heading-family: var(--cs-font-family-display)`) trên scope; các utility heading theo sau, body copy vẫn ở mặt chữ UI.

Consumer bỏ qua `styles.css` để tự kiểm soát font loading (`cyberskill.world` / Lumi import riêng các sheet token + base và giữ chiến lược `font-display: optional` của mình) có thể chuyển từ `brand-fonts.css` tự chế sang package: hoặc `@import "@cyberskill/design/tokens/fonts.css"` để lấy face đóng gói, hoặc giữ block `@font-face` cục bộ và trỏ `--cs-heading-family` vào `var(--cs-font-family-display)` để **role** đến từ DS ngay cả khi **byte** vẫn phục vụ cục bộ. Cách nào thì mặt chữ display cũng thôi là ngoại lệ riêng của một sản phẩm. Space Grotesk không có weight 800, nên `--cs-heading-weight-strong` (800) dưới `.cs-display-face` clamp về 700 trong Space Grotesk — CSS không nhảy sang Be Vietnam Pro vì thiếu weight.

## Bốn trục

Mặc định sản phẩm: `light · tho · vi · liquid-glass`. Các mặc định này mô tả cấu hình sản phẩm; scope lồng nhau kế thừa nếu chưa reset tường minh.

Theme (`data-theme="light|dark|system"`), Element (`data-cs-element` cùng `data-cs-variant` tương ứng), Language (`lang`) và Style (`data-cs-style="liquid-glass"`) có thể đặt trên container. Phần tử con không khai báo thuộc tính sẽ kế thừa; bỏ thuộc tính không reset scope cha. Đặt tường minh `light`, `comfortable` hoặc `standard` để reset theme, density hoặc contrast. Theme ở root là light; contrast ở root theo OS nếu chưa đặt standard. System theme theo chế độ màu của OS. Theme, element, contrast và density có thể nằm trên các ancestor riêng theo mọi thứ tự. Ngôn ngữ tuân theo quy tắc resolve component ở trên.

Root trung tính dùng nền Thổ studio; `data-cs-element="tho"` tường minh áp dụng bảng màu element Thổ. Bỏ element không xoá element đã kế thừa. Đặt element và variant tương ứng trên cùng một node. Liquid-glass là style duy nhất được hỗ trợ. Giá trị thuộc tính không xác định, cặp element/variant không khớp và việc chỉ import một phần token CSS không có cam kết fallback hay composition. Dùng `styles.css` hoặc stylesheet đã flatten được sinh tự động.

## Nâng cấp

- **Phiên bản theo `VERSION`.** `package.json` luôn bằng file root `VERSION`. Không có file changelog design-system — coi **git tip SHA** là chân lý kỹ thuật, và đọc **Release Notes** curated (Storybook + `docs/release-notes.md`) cho điểm nổi bật hướng sản phẩm.

- Anchors (Umber/Ochre), tên class `.cs-*`, và tên token `--cs-*` là hợp đồng ổn định — an toàn để phụ thuộc. Đổi tên phá vỡ những hợp đồng đó phải hiếm và được gọi ra trong PR/docs khi xảy ra.

- **Chạy lại smoke test sau nâng cấp.** Mở `_audit/consumer-smoke-test.html` và bảng Health đầy đủ (`_audit/run.html`) trên tip mới — runner chứng minh đường packaged vẫn resolve.

### ADOPT-001 — bump consumer đã biết lên 1.7.x

Sản phẩm portfolio / sibling còn pin `@cyberskill/design` cũ (hoặc subtree vendored) nên bump lên **≥ 1.7.2** ở cửa sổ tích hợp tiếp theo. Làm **trong từng repo consumer** — cây design-system này không sửa checkout sibling.

**Pin quan sát (sibling CyberSkill local, 2026-08-24):**

| Repo consumer | Path manifest | Pin hiện tại | Đề xuất |
|---|---|---|---|
| **SachViet** | `sachviet/app/web/package.json` | `^1.0.0` (lock: **1.0.0**) | `npm install @cyberskill/design@1.7.2` |
| **Strategem** | `strategem/apps/web/package.json` | `1.0.0` (exact) | `"@cyberskill/design": "1.7.2"` rồi install |
| **Finance** | `finance/package.json` | `github:cyberskill-official/design-system` (không pin SHA) | Ưu tiên registry `@cyberskill/design@1.7.2` |
| **Landing** | `landing/package.json` | `github:…/design-system#3edeb135…` | Refresh registry `1.7.2` hoặc tip SHA cây design đã publish |

| Consumer (điển hình) | Ghi chú bump |
|---|---|
| **Finance** | Ưu tiên `dist/styles.min.css`; smoke print/export nếu dùng DC template |
| **SachViet** | Sau bump: Theme × Element + skip-link / scroll-padding từ 1.7.2 |
| **Landing** | Kit website: dùng `.cs-skip` + `--cs-scroll-padding-block-start` |
| **Strategem** | Kit status hub: scroll-padding sticky bar |

Checklist: cài `@cyberskill/design@1.7.2` (hoặc `VERSION` hiện tại) → smoke Tab skip → `#main` → ghi pin trong lockfile consumer.

**One-liner sẵn PR (chỉ sửa trong repo consumer):**

```diff
// sachviet/app/web/package.json
- "@cyberskill/design": "^1.0.0"
+ "@cyberskill/design": "1.7.2"

// strategem/apps/web/package.json
- "@cyberskill/design": "1.0.0"
+ "@cyberskill/design": "1.7.2"
```

Landing / Finance: ưu tiên chuyển từ pin `github:cyberskill-official/design-system#…` sang registry khi grant / Trusted Publishing phủ sản phẩm đó — không force-push remote sibling từ cây này.

## Host Storybook (tùy chọn)

Site live phục vụ Storybook tại `/` như **bề mặt sản phẩm** cho operator (Theme × Element × Language × Style + ma trận điều khiển). Đó là **tooling chỉ-host** — đừng phụ thuộc Storybook trong product app. Atomic View portable vẫn ở `guidelines/atomic-view.html`. Xem `docs/storybook.md` và `docs/live-hub.md`.

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

Sample đa màn hình (Sign in · Home · Settings) nằm dưới `examples/native/swiftui`, `compose`, và `flutter`. Chúng sync token generate qua `node examples/native/sync-tokens.mjs`. Compose mở bằng **Android Studio** (không commit `gradlew` — cấu hình CLI được tài liệu hướng dẫn dùng JDK 17, Gradle 8.2.1 và Android SDK; xem `examples/native/README.md`). Không bắt buộc cho web consumer.

## Mở rộng

Nếu bạn đang đổi chính hệ thống (không chỉ tiêu thụ), theo `CONTRIBUTING.md` — Expansion Rule (lan tới mọi deliverable trong một change) và doctrine verification (deep check qua `_audit/`).

## Các SSR root độc lập

Khi hydrate nhiều root độc lập trên cùng trang, chọn `identifierPrefix` riêng
cho mỗi root và dùng đúng giá trị đó ở cả server lẫn client:

```jsx
// Server, sau khi transpile JSX của package theo hướng dẫn ở trên.
const markup = renderToString(<App />, { identifierPrefix: 'account-' });
// Client dùng cùng cây component và dữ liệu ban đầu.
hydrateRoot(document.getElementById('account'), <App />, {
  identifierPrefix: 'account-',
});
```

Root khác cần prefix khác, ví dụ `billing-`. Prefix tránh trùng ID, không sửa
chênh lệch dữ liệu hoặc ngôn ngữ giữa server và client. Overlay được quản lý ở
cấp document: modal trong một root tạm đặt root còn lại thành inert, rồi khôi
phục khi đóng. Kết quả này áp dụng khi hai root dùng cùng module design-system
đã tải; các bản bundle độc lập chưa được chứng nhận phối hợp với nhau.

`npm run test:packed-ssr` kiểm tra consumer từ tarball riêng với React 18 và 19
được ghim phiên bản: render server nhiều lần, hai root hydrate, tham chiếu ID,
trạng thái nhập/chọn độc lập và modal isolation/cleanup. Test cũng đo JS/CSS
production của fixture. Đây là kiểm tra trong phạm vi xác định, không thay thế
triển khai framework, performance budget hay nghiệm thu của người
dùng. Fixture React 18 cài peer theo lockfile vào thư mục tạm, nên cần truy cập
registry hoặc cache.

### Phạm vi kiểm chứng Suspense dạng stream

Pilot SSR từ gói npm chạy `renderToPipeableStream` trên React 18/19, với phần
khung ngoài và nội dung tải sau trong Suspense. Kiểm tra xác nhận fallback xuất
hiện trước nội dung component, sau đó hydrate kết quả stream đã thu thập và thao
tác trên hai root có prefix riêng. Chạy `npm run test:packed-ssr` để kiểm tra cả
biến thể đồng bộ và kết quả stream.

Bên cạnh fixture thu thập output, pilot có tình huống HTTP trực tiếp: renderer
gửi phần khung rồi chờ lệnh tiếp tục. Trình duyệt phải thấy fallback khi document
còn loading; sau khi server được giải phóng, nội dung hoàn tất, hydrate và chọn
giá trị thành công. Đóng trang khi còn chờ phải kết thúc renderer của fixture.
Kiểm tra này chưa xác nhận framework, React Server Components, proxy buffering
hoặc cấu hình hosting/security production.

Consumer cục bộ cũng kiểm tra CSP chỉ cho phép script ngoài từ cùng nguồn và
script inline hoàn tất stream có nonce mới cho mỗi response. Cả hai phiên bản
React hydrate và hoạt động đúng; bỏ nonce làm script hoàn tất bị chặn và fallback
không được thay thế. Policy vẫn cho phép style inline và ảnh watermark dạng data
URL; kết quả không xác nhận policy cấm style inline. Server thực tế cần đồng bộ
nonce truyền vào React với CSP của response, không dùng lại nonce giữa các HTML
response. Pilot thay nonce trong kết quả stream đã thu thập và kiểm tra nonce
khác nhau giữa các response. Tình huống HTTP trực tiếp truyền nonce response vào
renderer đang chạy. Tích hợp production vẫn thuộc trách nhiệm của consumer.

Một tình huống trực tiếp riêng gọi React stream abort khi boundary còn chờ.
Trình duyệt phải phục hồi bằng client rendering, bỏ fallback, giữ ID duy nhất
giữa các root và cho phép chọn giá trị. Đường đi này chỉ chấp nhận đúng một
recoverable-error diagnostic xác định lần abort có chủ đích; diagnostic khác
vẫn làm test thất bại. Stream hoàn tất bình thường không được có recovery error.
Test không thiết lập chính sách timeout hoặc retry riêng của framework.

### Đo chi phí tài nguyên của consumer

Chạy `npm run measure:consumers -- --output /tmp/cs-consumer-costs.json` để ghi kết quả đo tài nguyên consumer.
Phép đo giải nén tarball npm mới vào thư mục riêng, cung cấp peer React đang cài,
và chạy một màn hình mẫu EN/VI qua CSS nguồn, CSS static tổng hợp, entry trình
duyệt legacy và entry React production được esbuild rút gọn. Hai đường dẫn tương
tác kiểm tra TextField và Button; cả bốn hiển thị ba vai trò phông chữ. Yêu cầu
ra ngoài, tài nguyên thiếu, lỗi trình duyệt hoặc compiler chạy trong trình duyệt
đều làm phép đo thất bại. Đồ thị bundler cũng loại các tệp React development và
bundle legacy.

Báo cáo gắn kết quả với mã băm package, lockfile, script và phiên bản công cụ.
Nó ghi từng response body được yêu cầu, rồi nhóm số lượng và dung lượng theo
loại tài nguyên. `productionOutputs` liệt kê riêng mọi tệp bundler tạo ra, gồm
phông và ảnh màn hình mẫu chưa yêu cầu. Dung lượng tệp xuất và dữ liệu đã tải là
hai phép đo khác nhau. Máy chủ loopback gửi dữ liệu không nén và tắt cache;
`gzipBytes` là ước lượng gzip riêng từng body, không phải lưu lượng mạng đo được.
WOFF2 đã nén có thể lớn hơn khi gzip. Phép đo không bao gồm header, chi phí giao
thức, độ trễ, CPU, bộ nhớ, lượt truy cập lại hay các trạng thái chưa được mở.

Màn hình mẫu bổ sung cho kiểm thử SSR/hydration. Nó không thay thế pilot sản phẩm,
không chứng minh việc áp dụng, không đặt ngân sách hiệu năng và không cho phép
tách package. Cần trace sản phẩm và ngân sách đã thống nhất trước khi đổi các
cam kết đó. Tạo lại báo cáo khi đổi CSS phân phối, phông, runtime hoặc đồ thị
package; giữ thông tin nguồn đã ghi khi trích dẫn kết quả cũ.

Với liên kết HTML trong template, dùng `.cs-touch-target` khi bố cục hiện tại chưa
cung cấp vùng kích hoạt 44 × 44 CSS pixel. Trên thiết bị có con trỏ coarse, tiện
ích này đặt kích thước tối thiểu và căn nội dung bằng inline flex; không đổi
đích đến hay nội dung liên kết. Dùng `.cs-check` cho label bao quanh checkbox để
mở rộng vùng chạm mà không phóng to dấu chọn gốc. Nút xuất tài liệu DC dùng chung
và các mục trong menu đang mở cũng giữ kích thước tối thiểu này.
Phạm vi này là bản xem trước trên trình duyệt; chưa chứng minh khả năng hỗ trợ
CSS của ứng dụng email hay hành vi tương tác trong tài liệu đã xuất.

Chạy `npm run test:template-touch` để đo toàn bộ template trong manifest theo các
lựa chọn language/theme/element và mọi tổ hợp prop boolean/enum đã khai báo, ở
chiều rộng 320, 390 và 1280 CSS
pixel; bao gồm skip link khi nhận focus và menu xuất tài liệu đang mở. Chạy
`npm run test:template-touch-actions` để kiểm tra kích hoạt liên kết/label và đóng
menu bằng thao tác trình duyệt. Cả hai nhận `-- --browser=firefox` hoặc
`-- --browser=webkit`. `npm run test:template-state-actions` kiểm tra thêm việc đổi chế độ dashboard,
switch và mục mở rộng trong Settings, trả focus sau khi đóng modal và các trạng
thái đăng nhập. Phạm vi này chưa bao gồm nội dung tuỳ ý do bên dùng truyền vào
hay mọi chuỗi tương tác; không thay thế bước nghiệm thu giao diện của người dùng.

Nút mở modal từ bên ngoài phải xác lập đích focus trước khi mở. Template Settings
chủ động focus nút kích hoạt trong click handler để thao tác chạm cũng cung cấp
đích trả focus đáng tin cậy cho overlay manager.

Kích thước tối thiểu cho con trỏ coarse cũng áp dụng cho hành động speed-dial,
dòng danh sách tương tác, ảnh xem trước nhỏ, vùng context menu và phần tử kích
hoạt overlay có thể nhận focus ở cấp trực tiếp. `npm run test:touch-supplemental`
và `npm run test:trigger-touch` kiểm tra các bề mặt tuỳ chọn và fallback này theo
hai ngôn ngữ, hai mật độ và hai theme.
