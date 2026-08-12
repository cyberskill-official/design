# Conventions — authoring CyberSkill DS

Cho người và agent *mở rộng hệ thống này*. (Consumer: đọc `SKILL.md`.) Học thuyết mở rộng và kiểm chứng: `docs/doctrine.md`. Compiler là nguồn chân lý cho đếm; prose mô tả hình dạng, không bao giờ số. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Quy tắc expansion

**Khi bất kỳ thứ gì lớn lên, mọi thứ cập nhật trong cùng một change.** Element/variant, icon, component, token role, ngôn ngữ, hoặc pattern template mới phải lan tới: tokens/source → specimen cards (guidelines + card nhóm component) **và trang guideline liên quan** → bộ ba hợp đồng component (`.jsx` + `.d.ts` + `.prompt.md`) → **mọi** template (tweak enum và map) → Storybook toolbar / Atomic View → docs (đếm README, SKILL, **và mọi tài liệu liên quan change chạm** — kit README, registry, contrast report regen sau đổi token). **`VERSION` auto-bump khi push lên `main`** (Conventional Commits); owner vẫn có thể force bump. **Không maintain file changelog** — theo `VERSION` (auto-bump trên `main`). Continuity là git history cộng **Release Notes** curated (`docs/release-notes.md` / Storybook). Gate mọi expansion bằng compiler check **và grep enum/list cũ** — không ship nửa lan. Ranh giới phạm vi đã ghi (doctrine, không phải lỗ): trang UI-kit giữ tái tạo Thổ pixel-faithful (trục demo ở Storybook toolbar và Atomic View); mọi template bilingual EN·VN và mặc định tiếng Anh (collateral client/media giữ English-primary), và biến thể ngôn ngữ render **tách hoàn toàn** — xem decision log.

## Bốn trục

Mọi bề mặt render resolve bốn scope trực giao — không bao giờ mã hóa một trục trong trục khác:
| Trục | Attribute | Sở hữu | Pack sống ở |
|---|---|---|---|
| **Theme** | `data-theme="dark\|system"` | light / dark / system (OS) | `tokens/colors.css` |
| **Element** (Ngũ Hành) | `data-cs-element` + `data-cs-variant` | bản sắc hue theo sản phẩm | `tokens/elements.css` |
| **Language** | `lang` / Language tweak | copy EN · VI | registry component + props template |
| **Style** | `data-cs-style` (tuỳ chọn; vắng ≡ `liquid-glass`) | pack vật liệu bề mặt | `tokens/styles.css` |

Pack Style duy nhất hiện nay là **liquid-glass**. Bất biến dưới mọi trục: anchors Umber/Ochre, voice, họ chữ, màu semantic status, chỉ báo focus ghép (contour text-primary + halo ochre), sàn APCA, target ≥44px.

## Ngữ pháp đặt tên

- Tokens: `--cs-<layer>-<role>[-<state>]` (`--cs-color-text-muted`). Layer role element: `--cs-accent-*` (hợp đồng 10-token gồm `--cs-accent-on-strong` — xem header `tokens/elements.css`).

- Classes: `.cs-<block>[-<part>][--modifier]`. Data attributes: `data-theme`, `data-cs-element`, `data-cs-variant`, `data-cs-style`.

- Files: `tokens/<concern>.css` · `base/<concern>.css` (tên concern, không tên changelog — "interaction", không "refinements2") · `components/<group>/<Name>.{jsx,d.ts,prompt.md}` · `templates/<dept>-<artifact>/` · `guidelines/<group>-<topic>.html`.

- Tên hiển thị template: `<Group> · <Artifact>` ("Finance · Invoice").

## Checklist

**Component mới** — `Name.jsx` + `Name.d.ts` + `Name.prompt.md` trong `components/<group>/`; thêm vào card html của nhóm (resolve namespace bundle **theo prefix** — `const CS = window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]` — không bao giờ hậu tố `…_<projectId>` hardcode); thêm vào dòng nhóm của readme. Chỉ consume token; không hex literal trừ trong `tokens/`.

**Responsive** — reflow là global (`base/responsive.css`, load cuối): media không overflow, print docs nới padding, bảng `.cs-sheet` scroll, `.cs-sidebar` thu gọn, lưới cột cố định inline thu (3+→2 tablet, →1 phone), token dài không gãy (dòng write-on `______`, URL/ID dài) nhận `overflow-wrap: anywhere` trên bề mặt doc để không chống cột phone mở, shell grid app-shell thu một cột với `main{min-width:0}`+`.cs-table-wrap` scroll, và canvas export hình học cố định (`class="cs-canvas-desk"`: decks, social) **luôn** `overflow-x:auto` để slide rộng hơn cửa sổ scroll trong desk thay vì đẩy trang rộng. Đã verify whole-set ở 390 bởi `_audit/responsive-overflow.html` (cả 85 = 0 document overflow). **Hai gotcha cứng:** (1) DC runtime compile `style="…"` inline thành object React, nên attribute render *có khoảng* — mọi selector responsive `[style*=…]` phải khớp `grid-template-columns: repeat(4, 1fr)` (colon-space, comma-space), không bao giờ dạng không-space lúc author; (2) rule CSS global chỉ override property template đặt **inline** qua selector **attribute** (`[style*="grid-template-columns: 248px 1fr"]`) — selector **class** thua inline style. Ưu tiên sửa overflow trong source template (thêm `min-width:0`, `flex-wrap:wrap` inline) hơn đấu inline từ stylesheet.

**Template mới** — `templates/<slug>/<Slug>.dc.html` với `<!-- @template name description -->` đầu tiên; `ds-base.js` giữ single-entry (`styles.css` thôi — rebind một dòng đã validate end-to-end Th7 2026 từ path sâu hơn; scaffold test đã gỡ) và publish alias độc lập-id `window.CyberSkillDS` lúc bundle load, nên mount DS component qua `component-from-global-scope="CyberSkillDS.…"` — **không bao giờ** hậu tố `CyberSkillDesignSystem_<projectId>` hardcode (đổi khi re-import; enforce bởi `_audit/namespace-portability.html`); chỉ inline styles; 1–3 tweaks (không plain copy/color — in-place editing phủ những cái đó); printable docs thêm khối print `@page` + `.cs-desk`/`.cs-sheet` và **không** mang dark tweak (print chỉ light).

**Element variant mới** — ở trong envelope oklch của element; đặt 10 token hợp đồng `--cs-accent-*` (gồm `--cs-accent-on-strong` ≥4.5:1 trên `-strong`) cộng `--cs-color-text-accent`/`--cs-color-link` (APCA-check cả hai); aurora wash kế thừa từ element qua `.cs-aurora-wash` (chỉ override class rule nếu variant thật sự cần ảnh riêng); đối tác gradient (`grad-b`) phải theo Tương sinh.

**Ship check** — chạy compiler check đến sạch, rồi chạy `_audit/docs-consistency.html` **và** `_audit/namespace-portability.html` (cả hai phải xanh). VERSION **1.5.1** (auto-bump trên `main`).

## Decision log (owner duyệt)

- Element thay thế hoàn toàn Ochre trong scope sản phẩm; cạnh hot-pink của plasma được duyệt (Th7 2026).

- Trục: Theme × Element × Language × Style. Pack Style liquid-glass (sole pack; vắng ≡ mặc định).

- Product registry **đã khóa** (Th7 2026) — tám ánh xạ portfolio trong `docs/products.md`; không invent ánh xạ product → element mới.

- Chữ không bao giờ ngồi trên mid-tone `-accent` — mã hóa sau APCA sweep (xem `docs/contrast-report.md`).

- **Mặt chữ display là một token role, không phải mặc định thứ hai (Th7 2026).** `--cs-font-family-display` ship Space Grotesk (variable 300–700, có subset tiếng Việt) self-host cạnh Be Vietnam Pro và JetBrains Mono, để sản phẩm có mặt chữ tiêu đề — `cyberskill.world` / Lumi — tiêu thụ một role của DS thay vì tự nuôi `@font-face` ngoại lệ riêng. **Không thứ gì trong DS trỏ vào nó**: `--cs-heading-family` vẫn resolve về `--cs-font-family-ui`, mọi template và UI kit không đổi, và một scope chọn dùng qua `.cs-display-face` (`base/typography.css`) — chỉ chuyển `--cs-heading-family`, body copy vẫn ở mặt chữ UI. Space Grotesk không có 800, nên heading weight extrabold clamp về 700 trong family đó (CSS không nhảy sang Be Vietnam Pro vì thiếu weight). Thêm một họ chữ nghĩa là thêm face vào `tokens/fonts.css` **và** file vào `fonts/` **và** entry vào `fonts[]`/`brandFonts[]` của `_ds_manifest.json` — `_audit/font-face-integrity.html` fail nếu một trong ba lệch, và fail nếu family nào thiếu subset tiếng Việt. Điều này không đổi mapping sản phẩm → element nào; `docs/products.md` vẫn khóa.

- Biến thể ngôn ngữ render **tách hoàn toàn**: đổi Language tweak cho artifact một ngôn ngữ đầy đủ — không dịch dở trong heading, label, helper text, footer, hoặc body. Phần bilingual-by-design duy nhất là lockup tên + slogan CyberSkill (`Hiện Thực Hoá Ý Chí · Turn Your Will Into Real`, dạng chuẩn — không bao giờ một nửa lẻ) và khối identity pháp lý A4 (tên pháp lý công ty + khẩu hiệu nhà nước). Mọi thứ khác đổi theo tweak — gồm skip link và eyebrow loại tài liệu (FIND-125). Chuỗi catalog `<title>` / `@template name` giữ tiếng Anh cho chỉ mục template, không phải chrome chế độ ngôn ngữ; `_audit/template-lang-parity.html` che chúng khi quét lexicon rò EN (Th7 2026; follow-up FIND-125).

- **Namespace được resolve, không hardcode** — compiler đặt tên bundle global `window.CyberSkillDesignSystem_<projectId>`, và hậu tố 6-hex dẫn từ project id, nên đổi khi hệ thống import vào project khác. Templates đọc alias ổn định `window.CyberSkillDS` mà `ds-base.js` publish lúc bundle load; cards, trang UI-kit, email standalone, và audit harness resolve theo prefix (`window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]`). `_ds_bundle.js`/`_ds_manifest.json` và snapshot đóng băng `_audit/exports/` hợp pháp mang hậu tố thật (chúng *định nghĩa* nó). Enforce bởi `_audit/namespace-portability.html`, quét mọi source index bởi manifest — giữ re-import **zero-touch** (Th7 2026).

- Verification dùng harness dev `_audit/` (xem `_audit/README.md`): `responsive-harness.html` (Responsive preview hướng user — **mọi** template ở 390/768/1280), `responsive-overflow.html` (gate horizontal-overflow whole-set ở 390 — **dùng fresh iframe mỗi template; tái dùng một cái race `@import` CSS và cho false positive**), và `vn-overflow.html` (ép VN trên mọi template, đo clip). Force state từ context của chính frame: `__dcSetProps(__dcRootName(), {language:"Tiếng Việt"})`, theme qua `postMessage({type:"__dc_theme",theme:"dark"})`. `_audit/` chỉ-dev — không compile, không card. Không bao giờ truyền value cho `TextField` như **children** (crash React #137 lúc re-render — input là void element); dùng `default-value` (Th7 2026).

## Đường export (theo archetype)

Mọi template export; đường đúng phụ thuộc archetype. Mọi đường giữ Unicode tiếng Việt (đã verify bằng unzip PPTX slide XML và probe standalone bundle — dấu VN sống như text native, xem `_audit/exports/`).
| Archetype | Đường | Ghi chú |
|---|---|---|
| Deck (`*-deck`, `slide-deck`) | **PPTX (editable)** | `gen_pptx` ở 960×540; ép VN từng slide với `showJs: __dcSetProps(__dcRootName(),{language:'Tiếng Việt'})`. Text export như native runs; chỉ Logo là ảnh. |
| Document (mọi cái có `@page{size:…}`) | **One-click PDF** | Cả 61 doc template mang `<meta name="omelette-owns-print">` trong raw `<head>`, nên engine print trình duyệt paginate chúng ở A4/Letter với chrome-strip `@media print`. Print CSS được scope `@media screen` nơi khác để screen reflow không rò lên giấy. |
| Email / product page / mọi DC | **Standalone offline HTML** | DC load CSS + bundle động qua `ds-base.js`, mà `super_inline_html` không thấy. Để bundle: tạo bản `*-standalone.html` **cùng thư mục** (giữ `./support.js` relative) với `<link rel="stylesheet" href="../../styles.css">` + `<script src="../../_ds_bundle.js">` **static** trong raw `<head>` (cả hai inline được) thay `ds-base.js`, cộng `<template id="__bundler_thumbnail">`. Nướng ngôn ngữ đích vào props default. Rồi `super_inline_html`. |
| Bất kỳ | **Editor-native + Claude Code handoff** | Cả project sẵn sàng handoff-dev (compiled bundle + `.d.ts` + `prompt.md` mỗi component); generate package theo request qua handoff skill. |

**Hành vi font lúc export.** Font brand self-host (`Be Vietnam Pro` UI, `Space Grotesk` display opt-in, mono). PPTX giữ **tên** font brand nhưng không embed file — trên máy không có chúng PowerPoint thay fallback (text Unicode VN được giữ; shape có thể reflow nhẹ). Để hand-off tự chứa đầy đủ, hoặc bảo người nhận cài font, hoặc export với swap web-safe (`fontSwaps:[{from:'Be Vietnam Pro',to:'Arial'}]` — Arial phủ tiếng Việt). Standalone HTML **embed** font (`@font-face` inline từ `styles.css`), nên luôn trung thành offline (Th7 2026).

## Trạng thái dữ liệu bất đồng bộ (FIND-020 — pattern mỏng)

Bề mặt collection sở hữu một fetch phải phân biệt **loading · error · empty · idle-có-dữ-liệu**. Không render thông báo trống trong lúc request đang chạy.

| Trạng thái | Ghép | Ghi chú |
|---|---|---|
| **loading** | `Skeleton` (hàng bảng / dòng) + chuỗi status lịch sự | `aria-busy` trên vùng; giữ header cột khi có thể |
| **error** | `Result status="error"` (hoặc `errorState` tùy chỉnh) | `role="alert"`; host cung cấp thử lại |
| **empty** | `emptyState` / `EmptyState` | Chỉ sau phản hồi idle thành công với zero rows |
| **idle** | Các hàng bình thường | Mặc định — bỏ `state` cho specimen tĩnh |

**API tham chiếu:** `DataTable` nhận `state?: "idle" \| "loading" \| "error"` cùng `loadingState` / `errorState` / `loadingRows` tùy chọn. Các component collection khác (`DataGrid`, `TreeTable`, …) nên theo cùng triad khi có async ownership — không invent API loading song song từng bề mặt. Tác vụ dài không dạng bảng vẫn dùng `Spinner` (`role="status"`) hoặc `ProgressBar` với `aria-label` thật; ghép `Skeleton` trang trí (`aria-hidden`) với chuỗi status live.

## Accessibility (base/a11y.css + component ARIA)

- **Focus rings có hệ thống** — global `:where(:focus-visible)` trong `base/reset.css` là chỉ báo **ghép**: contour 2px `text-primary` (≥3:1 trên light và dark) cộng halo ochre 5px. Control wrapper (`SearchField`, `NumberField`, `PromptInput`, `Terminal`, `CommandPalette`) lặp lại qua `:focus-within`. Không bao giờ đặt `outline: none` trên control focusable mà không có vòng thay thế/wrapper.

- **Touch targets** — `base/a11y.css` đảm bảo 44px trên `@media (pointer: coarse)` (tabs, pagination, menu items, stepper, checkbox/radio; segmented 40px trong track đã pad). Mật độ chuột desktop được giữ. `pointer: coarse` dùng có chủ đích thay breakpoint chiều rộng — touch laptop ở 1280px vẫn cần 44px. Button mang khối coarse riêng trong `components.css`.

- **Reduced motion** — `base/a11y.css` tôn trọng `prefers-reduced-motion: reduce` global (duration animation/transition gần-zero); ngoại lệ cấp component (spinner slow-spin, status pulse tắt) đã có.

- **Ngôn ngữ screen-reader** — mọi template bilingual mang root `lang`: 37 instrument tiếng Việt (`vn-*`) là `lang="vi"` tĩnh; 44 template bilingual có tweak bind `lang="{{ langAttr }}"` với Language tweak (`langAttr = language === "Tiếng Việt" ? "vi" : "en"`, inject vào `renderVals`). Template dual-block thêm bọc mỗi khối `sc-if isVN` trong `<div lang="vi" style="display:contents">` (trung lập layout) để chữ VN được đánh dấu `vi` kể cả chế độ **Both** nơi root là `en` chính. Kết quả: phát âm đúng mọi chế độ ngôn ngữ.

- **Component ARIA đủ** — mọi component tương tác ship role/label đúng (Button `aria-busy`; TextField/Textarea `aria-invalid`+`aria-describedby`+`role=alert`; Switch `role=switch`; SearchField `role=searchbox`; Menu `aria-haspopup`/`aria-expanded`/`role=menu(item)`; Pagination `nav`+`aria-current`+label prev/next; Dialog/Drawer `aria-modal`; Toast `role=status`/`region`; ConfidenceMeter `role=meter`; Accordion `aria-expanded`; Logo `role=img`/`aria-hidden`). Giữ chúng khi compose.

- **Quy tắc API void-element** — component render void element (`<input>`/`<hr>`: TextField, Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider) destructure `children` khỏi `...props` để child lạc không bao giờ spread lên void element (crash React với #137, bug từng hit `settings`). Nội dung luôn từ props tường minh (`label` / `value` / `defaultValue`), không `children`. Theo khi thêm mọi component dựa input (Th7 2026).

- **Contrast dark-theme** — mọi cặp text/surface pass WCAG AA body (9–15:1). Màu semantic có dark override (`success #4ADE80`, `danger #F87171`, `warning #FBBF24`, `info #7CB2FB`) vì semantic light-theme fail trên bề mặt tối (~2.5:1); verify mọi cặp semantic mới trên `#221710`/`#2b1e14` (toán contrast `_audit/`). Hairline border dark cố ý tinh tế (separator, không biên 3:1) (Th7 2026). **Component tương tác đặt `color`/`border-color: var(--cs-color-brand-umber)` trên bề mặt themeable** (nav-item active, nút secondary/tertiary/ghost, v.v.) PHẢI ship override `[data-theme="dark"]` — umber gần vô hình trên tối; remap sang ochre (nhấn) hoặc `--cs-color-text-primary` (body). Wordmark brand screen-template dùng `--cs-color-text-primary` (không umber hardcode) để flip ở dark; header print-doc giữ umber theo thiết kế. Cột ID/code bảng (ví dụ `R-26-07`) mang `white-space:nowrap` để mã có gạch ngang không word-break trong cột hẹp (Th7 2026, user-reported). Quy tắc umber-trên-bề-mặt-themeable giờ **enforce deterministic** bởi `_audit/contrast-guard.html` (static source lint + ma trận WCAG token-pair ghi điểm light *và* dark) — gate đáng tin mà theme advisory DOM-walk không thể (v2.21.0). Ghi chú: `accent-strong` (role "accent text on light") được APCA-validate nhưng WCAG-borderline (~3.2–4.3) cho vài pack element (tho, tho/sand, thuy/mist, moc/bamboo) — dành cho accent text semibold/large; guard liệt kê chúng advisory và chỉ gate egregious <3.0 (v2.21.1).

## RTL readiness (xác nhận Th7 2026)

Hệ thống **sẵn RTL** — `base/*.css` gần như toàn bộ author bằng CSS **logical properties** (`inline-start`/`inline-end`, `margin-inline`, `padding-block`, `border-inline-*`, `inset-inline-*`), nên đặt `dir="rtl"` mirror layout tự động. Đã verify bằng render kitchen-sink ở `dir="rtl"` — nav, nút, label căn phải, và field/error text mirrored đều flip đúng. Physical props còn lại chỉ cố ý bất biến hướng: centering `left:50%`+`translateX(-50%)` của dialog (đối xứng) và `border-right-color` của spinner (chi tiết visual xoay). Giữ CSS mới logical; dành physical `left`/`right` chỉ cho centering thật sự đối xứng. (Tiếng Việt là LTR, nên RTL không ship trong templates — nhưng nền tảng sẵn cho tenant Arabic/Hebrew.)

## Ảnh thật (image-slot retrofit)

Templates dựa gradient `.cs-aurora-wash` mặc định; để nhận photography **thật**, thả `<image-slot>` vào. Load component một lần mỗi template qua helmet (`<script src="../../image-slot.js"></script>` — path relative tới template) và đặt `<image-slot id="…" shape="rect" style="position:absolute;inset:0;z-index:0">` làm con **đầu** của hero `position:relative`, rồi chồng `.cs-aurora-wash` (z-index:1, `pointer-events:none`) và scrim umber ấm (`linear-gradient(90deg,rgba(42,26,13,.86),rgba(42,26,13,.34))`, z-index:1, `pointer-events:none`) phía trên, content ở z-index:2. Scrim giữ drop-tile trống tinh tế và copy đọc được trên mọi ảnh. Đã verify trong `marketing-case-study`; cùng pattern 4-dòng khớp `marketing-page`, `marketing-social-kit`, `culture-event-invite`, và hero `article` (mỗi cái theo request). Tham chiếu standalone: `templates/image-slots-demo.html`. Slot persist qua sidecar sibling (Th7 2026).

## Typography & locale tiếng Việt (đã verify Th7 2026)

Tiếng Việt là ngôn ngữ chính; hệ chữ xây cho nó — đã verify, không cần đổi:
- **Line-heights an toàn VN** — token body 1.5 / heading 1.35 / tight 1.15 chừa chỗ cho dấu chồng (dấu trên + nặng dưới). `:where(h1–h6)` mặc định 1.35 + `text-wrap: balance`; `:where(p)` nhận `text-wrap: pretty` (cả hai `base/reset.css`). Templates có thể hardcode line-height chặt hơn (≈1.0–1.15) **chỉ** trên heading hero display một dòng; heading VN nhiều dòng giữ ≥1.15.

- **Định dạng locale** — mỗi ngôn ngữ render convention riêng: **VN** dùng hậu tố `₫`, `DD/MM/YYYY`, hàng nghìn chấm (`1.000.000`); **EN** dùng tiền tố `$`, `DD Mon YYYY`, hàng nghìn phẩy (`1,000,000`). Ngày format Anh chỉ sống trong nhánh Anh — không bao giờ rò vào nhánh VN. Xác nhận bằng scan mọi template.

## Whole-set state audits — language · theme · responsive (mỗi cái một pass riêng, Th7 2026)

Doctrine owner: language, theme, và responsive mỗi cái có pass whole-set RIÊNG; một state sạch không phải bằng chứng cho state khác. Cả ba giờ race-free, manifest-driven, gate pass/fail **all-85** trên cùng pattern — **fresh single-navigation iframe mỗi template** (tái dùng một iframe qua `src` swap race CSS `@import` và cho kết quả sai), state ép qua `__dcSetProps`, settle, rồi đo:
- **Language** — `_audit/language-overflow.html` — ép `Tiếng Việt`; 0 VN overflow/clip @390; cũng assert VN thật sự áp dụng trên mọi template.

- **Theme** — `_audit/theme-overflow.html` — ép dark; hard gate = dark-applies + 0 dark overflow @390 + 0 fail contrast leaf-text solid-bg mở ngoài `REVIEWED_OK`.

## Theme-overflow contrast là hard gate (Th7 2026)

`theme-overflow.html` fail `window.__theme.pass` trên fail WCAG AA tái lập được cho leaf text trên nền solid đọc được, trừ template trong allowlist `REVIEWED_OK` của trang (hiện: ba canvas deck có eyebrow accent-bright trên accent-strong ~4.22:1 — pack APCA dark vẫn pass; không retune token cho near-miss WCAG body đó). Walker chuyển nền oklab/`color-mix` qua canvas để bề mặt element-pack không bị nhầm với fallback `body` sáng. Gradient / image / wash brand bị skip (không tính được). **CTA đặc trên màn themeable** dùng `background: var(--cs-accent-strong); color: var(--cs-accent-on)` — pack dark đặt `--cs-accent-on` = cream cho `on/strong` (APCA ≥ 75); cream trên `--cs-accent-bright` fail. Print / VN legal light-only vẫn n/a. Proof kèm: `contrast-guard.html`, `apca-dark-preview.html`, `docs/contrast-report.md`.

## Token exports (Th7 2026)

Export token máy đọc được sống trong `tokens/`: `tokens.json` (nhóm theo category + map scope-override), `tokens.js` (ESM), và `tokens.dtcg.json` (**W3C DTCG** — `$value`/`$type`, key CSS-var cho round-trip lossless tới `styles.css`, override dark/system + element + expression dưới `$extensions`; cho Tokens Studio for Figma / Style Dictionary). Cả ba generate từ `tokens/*.css` qua `tokens.json` — regen **cả** sau mọi đổi token (Expansion rule).
