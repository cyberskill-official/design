# Conventions — authoring CyberSkill DS

Cho người và agent *mở rộng hệ thống này*. (Consumer: đọc `SKILL.md`.) Học thuyết mở rộng và kiểm chứng: `docs/doctrine.md`. Dùng manifest được sinh để tra danh mục hiện tại; quyền sở hữu các trường component và token theo generator được mô tả bên dưới. Số khai báo không phải số token duy nhất hay số component được hỗ trợ. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Quy tắc expansion

**Khi bất kỳ thứ gì lớn lên, mọi thứ cập nhật trong cùng một change.** Element/variant, icon, component, token role, ngôn ngữ, hoặc pattern template mới phải lan tới: tokens/source → specimen cards (guidelines + card nhóm component) **và trang guideline liên quan** → bộ ba hợp đồng component (`.jsx` + `.d.ts` + `.prompt.md`) → **mọi** template (tweak enum và map) → Storybook toolbar / Atomic View → docs (đếm README, SKILL, **và mọi tài liệu liên quan change chạm** — kit README, registry, contrast report regen sau đổi token). **`VERSION` chỉ đổi bằng chỉnh sửa release được cho phép rõ ràng**; hiện không có workflow auto-bump. **Không maintain file changelog** — theo `VERSION`. Continuity là git history cộng **Release Notes** curated (`docs/release-notes.md` / Storybook). Gate mọi expansion bằng check portable trong `docs/doctrine.md` **và tìm enum/list cũ** — không ship nửa lan. Ranh giới phạm vi đã ghi (doctrine, không phải lỗ): trang UI-kit giữ tái tạo Thổ pixel-faithful (trục demo ở Storybook toolbar và Atomic View); song ngữ EN·VN áp dụng cho email và tài liệu team, pháp lý, tài chính; tài liệu client/media ưu tiên tiếng Anh. Khi có hỗ trợ biến thể ngôn ngữ, render **tách hoàn toàn** — xem decision log.

## Bốn trục

Mọi bề mặt render resolve bốn scope trực giao — không bao giờ mã hóa một trục trong trục khác:
| Trục | Attribute | Sở hữu | Pack sống ở |
|---|---|---|---|
| **Theme** | `data-theme="dark\|system"` | light / dark / system (OS) | `tokens/colors.css` |
| **Element** (Ngũ Hành) | `data-cs-element` + `data-cs-variant` | bản sắc hue theo sản phẩm | `tokens/elements.css` |
| **Language** | `lang` / Language tweak | EN · VI bắt buộc; spike `ja` (primary subtag BCP-47) | registry component + props template — xem `docs/decisions/locale-architecture.md` |
| **Style** | `data-cs-style` (tuỳ chọn; vắng ≡ `liquid-glass`) | pack vật liệu bề mặt | `tokens/styles.css` |

Pack Style duy nhất hiện nay là **liquid-glass**. Bất biến dưới mọi trục: anchors Umber/Ochre, voice, họ chữ, màu semantic status, chỉ báo focus ghép (contour text-primary + halo ochre), sàn APCA, target ≥44px.

## Ngữ pháp đặt tên

- Tokens: `--cs-<layer>-<role>[-<state>]` (`--cs-color-text-muted`). Layer role element: `--cs-accent-*` (hợp đồng 10-token gồm `--cs-accent-on-strong` — xem header `tokens/elements.css`).

- Classes: `.cs-<block>[__<part>][--modifier]`. Data attributes: `data-theme`, `data-cs-element`, `data-cs-variant`, `data-cs-style`. Phần tử con cũng giữ cách viết gạch nối cũ đã có. Selector `.is-*` là trạng thái cục bộ; giới hạn trong component sở hữu, không dùng như utility toàn cục.

- Files: `tokens/<concern>.css` · `base/<concern>.css` (tên concern, không tên changelog — "interaction", không "refinements2") · `components/<group>/<Name>.{jsx,d.ts,prompt.md}` · `templates/<dept>-<artifact>/` · `guidelines/<group>-<topic>.html`.

- Tên hiển thị template: `<Group> · <Artifact>` ("Finance · Invoice").

## Checklist

**Component mới** — `Name.jsx` + `Name.d.ts` + `Name.prompt.md` trong `components/<group>/`; thêm vào card html của nhóm (resolve namespace bundle **theo prefix** — `const CS = window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]` — không bao giờ hậu tố `…_<projectId>` hardcode); thêm vào dòng nhóm của readme; **thêm `Name` vào `components/lifecycle.json`** với `status: stable|preview|deprecated` (CDS-COV-001 / TASK-IMP-028 — gate `test-component-lifecycle`). Chỉ consume token; không hex literal trừ trong `tokens/`.

## Trạng thái vòng đời component (CDS-COV-001)

Registry máy đọc được: **`components/lifecycle.json`**. Mọi export trong `_ds_manifest.json` có `status`:

| Status | Ý nghĩa |
|---|---|
| `stable` | Cam kết ổn định API đã khai báo; kiểm tra hồ sơ hỗ trợ cho môi trường và phạm vi sử dụng |
| `preview` | Ship được nhưng có thể đổi; ghi caveat trong `note` |
| `deprecated` | Không adopt việc mới; gỡ bỏ cần task follow-up |

**Surfacing (v1):** Storybook Docs → Conventions (mục này) + registry JSON. Atomic View / CSF chưa render badge — consumer và agent đọc registry (hoặc Conventions). Không invent React props cho lifecycle. Editor là `preview` khi value model HTML đã allowlist schema còn contentEditable còn lại (TASK-IMP-029).

Mỗi export có hồ sơ `support` riêng, được chép nguyên trạng vào `components/api-index.json`: trạng thái review, owner, phạm vi môi trường/trục, bằng chứng có ngày và hash, ngày/người review, giới hạn và hướng dẫn deprecation/migration nếu có. Đọc `components/lifecycle.json` để biết số export và trạng thái review hiện tại. Khi nguồn thay đổi, phê duyệt hiện tại mất hiệu lực; hash, người và ngày phê duyệt ban đầu vẫn được giữ trong `reviewHistory`. Cập nhật hash không tự gia hạn phê duyệt. `unreviewed` yêu cầu review mới có thẩm quyền, kể cả khi test tự động theo phạm vi đã đạt. Nhãn maturity và hồ sơ review lịch sử không chứng minh chấp nhận hiện tại.

`test-component-lifecycle` và generator API index từ chối hồ sơ tuyên bố đã review nếu thiếu owner, người review, ngày, phạm vi môi trường/trục hoặc tệp bằng chứng khớp hash. Chúng cũng từ chối bằng chứng bị thay đổi hoặc trỏ ra ngoài repository; export deprecated phải có hướng dẫn migration. Đây là kiểm tra tính toàn vẹn của hồ sơ, không xác thực danh tính người review hay tự động chấp nhận thay con người. Việc giao owner, duyệt chính sách hỗ trợ và review từng phạm vi vẫn cần con người; riêng nhãn `stable` không phải verdict chất lượng cho mọi nền tảng.

**Chính sách hỗ trợ và bảo trì — Stephen Cheng phê duyệt ngày 14 tháng 10 năm 2026; hồ sơ hỗ trợ theo phạm vi cho từng export được phê duyệt ngày 17 tháng 10 năm 2026.** Stephen là chủ sở hữu chịu trách nhiệm và người bảo trì tạm thời. Agent được ủy quyền có thể triển khai thay đổi và thu thập bằng chứng; Stephen quyết định phạm vi hỗ trợ, chấp nhận hình ảnh sản phẩm, ngoại lệ, phát hành và deprecation. Đánh giá của agent hoặc tự động phải ghi đúng loại, không thay thế bằng chứng sử dụng công nghệ hỗ trợ của con người hoặc người đánh giá độc lập. Đợt review từng export ngày 17 tháng 10 năm 2026 ghi nhận phạm vi môi trường/trục có giới hạn, bằng chứng gắn hash nguồn và giới hạn rõ ràng về công nghệ hỗ trợ thủ công/thiết bị vật lý, đồng thời giữ nguyên nhãn maturity (`Editor` và `EDITOR_SCHEMA` vẫn là `preview`).

Hỗ trợ theo đúng export, môi trường, trục và bằng chứng nguồn/artifact có ngày trong hồ sơ đã review. `stable` khai báo maturity API, không chứng nhận mọi trình duyệt, ngôn ngữ, toolchain native, agent host hoặc công cụ thiết kế. Trường thiếu vẫn là chưa ghi nhận. Giới hạn preview và experimental luôn hiển thị. Thời gian xác nhận báo cáo bảo mật và phạm vi phiên bản đã phát hành được quy định riêng trong `SECURITY.md`, không tạo hạn sửa lỗi hay SLA. Tương thích và thông báo deprecation tuân theo `components/release-compatibility.json` và `docs/vi/component-api.md`.

| Thời điểm | Hành động chịu trách nhiệm | Hồ sơ cần giữ |
|---|---|---|
| Mỗi thay đổi nguồn liên quan | Người bảo trì cập nhật hợp đồng, hướng dẫn song ngữ, đầu ra sinh tự động và chạy kiểm tra được duy trì | Thay đổi cụ thể, định danh nguồn, kết quả kết thúc và phạm vi chưa giải quyết |
| Trước phát hành hoặc triển khai | Stephen đối chiếu bằng chứng candidate, thông báo, chấp nhận và kế hoạch chuyển đổi/khôi phục với release runbook | Ủy quyền rõ ràng, riêng cho hành động cụ thể |
| Hằng tháng | Người bảo trì rà soát cảnh báo phụ thuộc, nguồn gốc/thông báo vendor/font/media, liên kết, sai lệch hồ sơ hỗ trợ và hồi quy tài nguyên pilot | Phát hiện có ngày, cách xử lý và hành động tiếp theo của owner |
| Hằng quý và trước mở rộng hỗ trợ | Stephen rà soát phạm vi, tích hợp experimental, ngoại lệ còn mở và phản hồi sản phẩm sử dụng | Quyết định và bằng chứng có ngày; không tự đổi phân loại |

Trước khi chấp nhận hồ sơ hỗ trợ đã review, giữ định danh nguồn/package, kết quả hợp đồng và runtime phù hợp, giới hạn và bằng chứng owner/thủ công cần thiết. Kết quả thất bại, cũ, không khả dụng và soft-skip vẫn tách biệt. Ngân sách FAQ Practice cục bộ chỉ áp dụng cho phép đo decoded-body của pilot đó. Lịch rà soát này xác lập trách nhiệm, không tạo automation định kỳ, liên hệ bên ngoài hay cho phép triển khai.

Mỗi ngoại lệ ghi đường dẫn/export và hash, phạm vi yêu cầu, lý do, tác động, bằng chứng, owner chịu trách nhiệm, ngày quyết định, ngày rà soát và phương án chuyển đổi/khôi phục. Ngoại lệ chờ Stephen quyết định rõ ràng. Đầu vào thay đổi hoặc qua ngày rà soát cần quyết định mới. Ngoại lệ không tạo ra quyền còn thiếu, bằng chứng con người hay kết quả kiểm tra đạt; phạm vi giới hạn được chấp nhận phải rõ trong hướng dẫn consumer và quyết định phát hành.

Bản sửa hiện tại giữ trạng thái **Unreleased** cho tới khi có chấp nhận phát hành và xuất bản riêng. Ghi chú song ngữ giữ các thất bại có ngày và giới hạn native/thủ công, nguồn gốc, host và owner còn mở. Chính sách hỗ trợ và việc review từng export không duyệt ghi chú phát hành, xuất bản hay đổi VERSION.


HTML của Editor được phân tích bằng cùng một parser đã ghim phiên bản trong Node
và trình duyệt, không đưa nội dung vào DOM đang hoạt động. Đầu ra được tạo lại chỉ
với thẻ cho phép, không có thuộc tính. Dán/kéo thả được lọc trước khi chèn; văn bản
thuần được escape. Thanh công cụ hỗ trợ bàn phím và giữ vùng chọn. `unsafeHtml`
chỉ dành cho nội dung khởi tạo đáng tin cậy. Đầu ra đã lọc chỉ dùng làm nội dung
phần tử HTML, không dùng trong URL, thuộc tính, CSS hay script.

**Responsive** — reflow là global (`base/responsive.css`, load cuối): media không overflow, print docs nới padding, bảng `.cs-sheet` scroll, `.cs-sidebar` thu gọn, lưới cột cố định inline thu (3+→2 tablet, →1 phone), token dài không gãy (dòng write-on `______`, URL/ID dài) nhận `overflow-wrap: anywhere` trên bề mặt doc để không chống cột phone mở, shell grid app-shell thu một cột với `main{min-width:0}`+`.cs-table-wrap` scroll, và canvas export hình học cố định (`class="cs-canvas-desk"`: decks, social) **luôn** `overflow-x:auto` để slide rộng hơn cửa sổ scroll trong desk thay vì đẩy trang rộng. **Các mốc chiều rộng phải khớp thang token** trong `tokens/spacing.css` (`xs` · `phone` 360 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536) — `docs-consistency` báo lỗi mọi chiều rộng `@media`/`@container` lệch thang trong `base/` (FIND-007). Host CQ opt-in (`.cs-cq` hoặc kit `.container` / `.wrap`) cho phép con size theo chiều rộng parent qua `@container cs` — xem `docs/decisions/container-query-migration.md`. Đã verify whole-set ở 390 bởi `_audit/responsive-overflow.html` (cả 85 = 0 document overflow). **Hai gotcha cứng:** (1) DC runtime compile `style="…"` inline thành object React, nên attribute render *có khoảng* — mọi selector responsive `[style*=…]` phải khớp `grid-template-columns: repeat(4, 1fr)` (colon-space, comma-space), không bao giờ dạng không-space lúc author; (2) rule CSS global chỉ override property template đặt **inline** qua selector **attribute** (`[style*="grid-template-columns: 248px 1fr"]`) — selector **class** thua inline style. Ưu tiên sửa overflow trong source template (thêm `min-width:0`, `flex-wrap:wrap` inline) hơn đấu inline từ stylesheet.

**Template mới** — `templates/<slug>/<Slug>.dc.html` với `<!-- @template name description -->` đầu tiên; `ds-base.js` giữ single-entry (`styles.css` thôi — rebind một dòng đã validate end-to-end Th7 2026 từ path sâu hơn; scaffold test đã gỡ) và publish alias độc lập-id `window.CyberSkillDS` lúc bundle load, nên mount DS component qua `component-from-global-scope="CyberSkillDS.…"` — **không bao giờ** hậu tố `CyberSkillDesignSystem_<projectId>` hardcode (đổi khi re-import; enforce bởi `_audit/namespace-portability.html`); chỉ inline styles; 1–3 tweaks (không plain copy/color — in-place editing phủ những cái đó); printable docs thêm khối print `@page` + `.cs-desk`/`.cs-sheet` và **không** mang dark tweak (print chỉ light).

**Element variant mới** — ở trong envelope oklch của element; đặt 10 token hợp đồng `--cs-accent-*` (gồm `--cs-accent-on-strong` ≥4.5:1 và APCA75 cho nội dung thường trên `-strong`) cộng `--cs-color-text-accent`/`--cs-color-link` (APCA-check cả hai); aurora wash kế thừa từ element qua `.cs-aurora-wash` (chỉ override class rule nếu variant thật sự cần ảnh riêng); đối tác gradient (`grad-b`) phải theo Tương sinh.

**Ship check** — theo gate kiểm chứng portable trong `docs/doctrine.md`, rồi chạy `_audit/docs-consistency.html` **và** `_audit/namespace-portability.html` (cả hai phải xanh). VERSION của checkout nguồn **<!-- cs-source-version:checkout -->1.7.2<!-- /cs-source-version -->**.

## Decision log (owner duyệt)

- Element thay thế hoàn toàn Ochre trong scope sản phẩm; cạnh hot-pink của plasma được duyệt (Th7 2026).

- Trục: Theme × Element × Language × Style. Pack Style liquid-glass (sole pack; vắng ≡ mặc định).

- Product registry **đã khóa** (Th7 2026) — tám ánh xạ portfolio trong `docs/products.md`; không invent ánh xạ product → element mới.

- Chữ không bao giờ ngồi trên mid-tone `-accent` — mã hóa sau APCA sweep (xem `docs/contrast-report.md`).

- **Mặt chữ display là một token role, không phải mặc định thứ hai (Th7 2026).** `--cs-font-family-display` ship Space Grotesk (variable 300–700, có subset tiếng Việt) self-host cạnh Be Vietnam Pro và JetBrains Mono, để sản phẩm có mặt chữ tiêu đề — `cyberskill.world` / Lumi — tiêu thụ một role của DS thay vì tự nuôi `@font-face` ngoại lệ riêng. **Không thứ gì trong DS trỏ vào nó**: `--cs-heading-family` vẫn resolve về `--cs-font-family-ui`, mọi template và UI kit không đổi, và một scope chọn dùng qua `.cs-display-face` (`base/typography.css`) — chỉ chuyển `--cs-heading-family`, body copy vẫn ở mặt chữ UI. Space Grotesk không có 800, nên heading weight extrabold clamp về 700 trong family đó (CSS không nhảy sang Be Vietnam Pro vì thiếu weight). Thêm một họ chữ nghĩa là thêm face vào `tokens/fonts.css` **và** file vào `fonts/` **và** entry vào `fonts[]`/`brandFonts[]` của `_ds_manifest.json` — `_audit/font-face-integrity.html` fail nếu một trong ba lệch, và fail nếu family nào thiếu subset tiếng Việt. Điều này không đổi mapping sản phẩm → element nào; `docs/products.md` vẫn khóa.

- Biến thể ngôn ngữ render **tách hoàn toàn**: đổi Language tweak cho artifact một ngôn ngữ đầy đủ — không dịch dở trong heading, label, helper text, footer, hoặc body. Phần bilingual-by-design duy nhất là lockup tên + slogan CyberSkill (`Hiện Thực Hoá Ý Chí · Turn Your Will Into Real`, dạng chuẩn — không bao giờ một nửa lẻ) và khối identity pháp lý A4 (tên pháp lý công ty + khẩu hiệu nhà nước). Mọi thứ khác đổi theo tweak — gồm skip link và eyebrow loại tài liệu (FIND-125). Chuỗi catalog `<title>` / `@template name` giữ tiếng Anh cho chỉ mục template, không phải chrome chế độ ngôn ngữ; `_audit/template-lang-parity.html` che chúng khi quét lexicon rò EN (Th7 2026; follow-up FIND-125).

- **Namespace được resolve, không hardcode** — compiler đặt tên bundle global `window.CyberSkillDesignSystem_<projectId>`, và hậu tố 6-hex dẫn từ project id, nên đổi khi hệ thống import vào project khác. Templates đọc alias ổn định `window.CyberSkillDS` mà `ds-base.js` publish lúc bundle load; cards, trang UI-kit, email standalone, và audit harness resolve theo prefix (`window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]`). `_ds_bundle.js`/`_ds_manifest.json` và snapshot đóng băng `_audit/exports/` hợp pháp mang hậu tố thật (chúng *định nghĩa* nó). Enforce bởi `_audit/namespace-portability.html`, quét mọi source index bởi manifest — giữ re-import **zero-touch** (Th7 2026).

- Verification dùng harness dev `_audit/` (xem `_audit/README.md`): `responsive-harness.html` (Responsive preview hướng user — **mọi** template ở 390/768/1280), `responsive-overflow.html` (gate horizontal-overflow whole-set ở 390 — **dùng fresh iframe mỗi template; tái dùng một cái race `@import` CSS và cho false positive**), và `language-overflow.html` (kiểm tra việc áp dụng ngôn ngữ và cắt chữ theo manifest, báo riêng template có nội dung cố định). Chỉ đặt trạng thái template đã khai báo, từ context của chính frame: `__dcSetProps(__dcRootName(), {language:"Tiếng Việt"})` hoặc `__dcSetProps(__dcRootName(), {theme:"dark"})`; xác nhận ngôn ngữ đã render và root `data-theme` như harness tương ứng. `__dc_theme` đổi nền canvas tùy chọn của môi trường authoring; không đặt prop theme của template. Báo riêng trường hợp chỉ hỗ trợ light và nội dung cố định. `_audit/` cung cấp công cụ chẩn đoán trong repository, không phải card component. Gói npm loại trừ thư mục này; website chỉ công khai công cụ được nêu trong `scripts/public-site-policy.json`. Tài liệu audit không có trong danh sách tiếp tục bị loại trừ; công khai một công cụ chẩn đoán chưa xác lập nghiệm thu sản phẩm. Không bao giờ truyền value cho `TextField` như **children** (crash React #137 lúc re-render — input là void element); dùng `default-value` (Th7 2026).

## Đường export (theo archetype)

Chọn đường export theo loại template và công cụ có sẵn trong host sử dụng. Kiểm tra browser/DOCX của repository và artifact lưu tại `_audit/exports/` chỉ có giá trị trong phạm vi producer, nguồn, nội dung và môi trường đã ghi nhận; không chứng nhận mọi template hay đường export. Kiểm tra chữ tiếng Việt, tài nguyên, khả năng chỉnh sửa, phân trang và phông chữ trong file bàn giao thực tế cùng ứng dụng đích.
| Archetype | Đường | Ghi chú |
|---|---|---|
| Deck (`*-deck`, `slide-deck`) | **PPTX (cần host tương thích)** | Bản clone tĩnh không có trình tạo PPTX. Xác nhận exporter của host và tùy chọn capture trước khi chọn kích thước hoặc hook ngôn ngữ `showJs`. Kiểm tra text run, ảnh, phông chữ và khả năng chỉnh sửa trong file kết quả; hook capture DOM riêng chưa chứng minh những kết quả đó. |
| Document (mọi cái có `@page{size:…}` / `<meta name="omelette-owns-print">`) | **PDF + DOCX chỉnh sửa được** | Một nút **Tải / Download** (`data-omelette-chrome`, ẩn khi in) từ `templates/_vendor/doc-export.js` qua `ds-base.js`, menu PDF \| DOCX. Cả hai format dựng từ `.cs-sheet` sống để file khớp preview HTML. **PDF** = một trang Flate DeviceRGB của sheet đã vẽ, scale 3 (tỉ lệ MediaBox = thẻ — không JPEG mờ, không cắt A4 hay kéo dãn lát cuối); fallback: in bản clone same-origin — không phải URL Storybook. CI vẫn dùng Playwright `page.pdf` cho đường in. **DOCX** = OOXML editable walk từ cùng sheet (flex header thành bảng logo\|số, cỡ/màu chữ đo được, bảng + colspan, ô vàng `--cs-doc-fill`, đoạn bilingual trong ô, heading umber, Unicode VN; header/footer Word để trống để không nhân đôi lockup); ZIP qua `CompressionStream` — không CDN. Deck vẫn PPTX. |
| Email / product page / mọi DC | **Standalone offline HTML** | `support.js` đi kèm cung cấp preview browser. Inline một file cần exporter ngoài; xác nhận host có công cụ đó. `ds-base.js` chờ React/ReactDOM, tải bundle rồi tạo alias `window.CyberSkillDS`; riêng script bundle không giữ thứ tự hay alias đó. Với `super_inline_html`, chuẩn bị bản standalone đã compile, khai báo tài nguyên rõ ràng và bảo đảm peer đã sẵn sàng, giữ alias ổn định; dùng [thứ tự script no-build](consuming.md) làm tham chiếu runtime; inline một file vẫn cần exporter riêng. Kèm runtime hỗ trợ, CSS, phông chữ, ảnh và helper export cần thiết; xử lý dependency động mà inliner không tìm được. Đặt ngôn ngữ đích rồi kiểm tra file bàn giao offline trong host/browser thực tế. Clone di động hay danh sách script tĩnh chưa chứng nhận đường export này. |
| Bất kỳ | **Editor-native + Claude Code handoff** | Cả project sẵn sàng handoff-dev (compiled bundle + `.d.ts` + `prompt.md` mỗi component); generate package theo request qua handoff skill. |

**Độ rộng cột grid trong DOCX.** Độ rộng cột dạng số giữ nguyên tổng độ rộng bảng và không âm; các twip nguyên còn lại được phân cho các phần dư lớn nhất. Các cột grid dạng số đã được trình duyệt tính giữ tỉ lệ độ rộng, kể cả cột trống có độ rộng bằng không. Cú pháp chưa được tính thành số vẫn dùng các cột bằng nhau. Vị trí phần tử, span, khoảng cách và toàn bộ bố cục CSS nằm ngoài phạm vi; cần đối chiếu bản xuất trong ứng dụng văn phòng đích. Giữ nguyên chữ chưa chứng minh bố cục tương đương.

**Hành vi font lúc export.** Font brand self-host (`Be Vietnam Pro` UI, `Space Grotesk` display opt-in, mono). PPTX/DOCX giữ **tên** font brand nhưng không embed file — trên máy không có chúng Word/PowerPoint thay fallback (text Unicode VN được giữ; shape có thể reflow nhẹ). Để hand-off tự chứa đầy đủ, hoặc bảo người nhận cài font, hoặc export với swap web-safe (`fontSwaps:[{from:'Be Vietnam Pro',to:'Arial'}]` — Arial phủ tiếng Việt). Bản HTML offline phải chứa mọi byte phông chữ, ảnh, stylesheet và runtime được tham chiếu. Inline khai báo `@font-face` không tự inline tài nguyên tại URL hay chứng nhận độ trung thực offline. Kiểm tra asset closure và render artifact đã export khi không có kết nối mạng. Phân trang PDF theo trình in của trình duyệt; Word có thể reflow ngắt trang.

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

- **Touch targets** — `base/a11y.css` đặt kích thước tối thiểu 44px trên `@media (pointer: coarse)` (tabs, pagination, menu items, stepper, checkbox/radio và nút segmented). Xác minh vùng kích hoạt và khoảng cách thực tế trong các trạng thái sản phẩm đã mount, kể cả clipping và control chồng lấp; kích thước CSS không tự chứng minh phạm vi kích hoạt. Mật độ chuột desktop được giữ. `pointer: coarse` dùng có chủ đích thay breakpoint chiều rộng — touch laptop ở 1280px vẫn cần 44px. Button mang khối coarse riêng trong `components.css`.

- **Reduced motion** — `base/a11y.css` tôn trọng `prefers-reduced-motion: reduce` global (duration animation/transition gần-zero); rule global `!important` giới hạn Spinner ở một lần lặp gần-zero, còn status pulse bị tắt. Dialog và AlertDialog dùng hiệu ứng mờ dần để control giữ nguyên kích thước và overlay lồng nhau bám theo viewport. Chế độ giảm chuyển động bỏ hiệu ứng xuất hiện của panel. Drawer trượt bằng margin theo hướng logic, không tạo containing block bằng transform. Vật liệu modal có bộ lọc dùng lớp lọc trang trí ngang hàng; nội dung vẫn giữ phạm vi ngôn ngữ và token trong DOM.

- **Ngôn ngữ screen-reader** — danh mục nguồn có <!-- cs-count:vietnameseInstrumentTemplates -->38<!-- /cs-count --> văn bản thuộc bộ tiếng Việt (`vn-*`), với phần tử gốc tài liệu khai báo `lang="vi"`. Riêng <!-- cs-count:templatesWithLanguageControl -->44<!-- /cs-count --> template khai báo điều khiển Language; kiểm tra liên kết `lang` của phần tử gốc và các khối có điều kiện trong template được chọn khi đổi chế độ. Điều khiển được khai báo không chứng minh bản dịch đầy đủ hay hành vi ngôn ngữ khi đọc. Giữ ranh giới ngôn ngữ tường minh trong nội dung song ngữ và xác minh phát âm, thứ tự đọc trong phiên screen-reader có ngày ghi nhận.

- **Hợp đồng ARIA của component** — component cung cấp role và quan hệ semantic (Button `aria-busy`; TextField/Textarea liên kết lỗi/mô tả; Switch `role=switch`; SearchField `role=searchbox`; Menu `aria-haspopup`/`aria-expanded`/`role=menu(item)`; Pagination `nav`+`aria-current`+label prev/next; Dialog/Drawer `aria-modal`; Toast `role=status`/`region`; ConfidenceMeter `role=meter`; Accordion `aria-expanded`; Logo `role=img`/`aria-hidden`). Giữ các thuộc tính này và cung cấp label/nội dung mà từng API yêu cầu. Xác minh accessible name, focus, thông báo và trạng thái động/lồng nhau trong sản phẩm đã compose; sự hiện diện của thuộc tính không chứng minh accessibility đầy đủ.

- **Quy tắc API void-element** — component render void element (`<input>`/`<hr>`: TextField, Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider) destructure `children` khỏi `...props` để child lạc không bao giờ spread lên void element (crash React với #137, bug từng hit `settings`). Nội dung luôn từ props tường minh (`label` / `value` / `defaultValue`), không `children`. Theo khi thêm mọi component dựa input (Th7 2026).

- **Contrast dark-theme** — Kiểm tra token-pair và theme đã render bao phủ các cặp đã khai báo cùng chữ hiển thị được đo; đọc advisory, phần loại trừ và nền material trước khi áp dụng kết quả cho nội dung sản phẩm. Màu semantic có dark override (`success #4ADE80`, `danger #FC9895`, `warning #FBBF24`, `info #B5D4FD`) vì semantic light-theme fail trên bề mặt tối (~2.5:1); verify mọi cặp semantic mới trên `#221710`/`#2b1e14` (toán contrast `_audit/`). Hairline border dark cố ý tinh tế (separator, không biên 3:1) (Th7 2026). **Component tương tác đặt `color`/`border-color: var(--cs-color-brand-umber)` trên bề mặt themeable** (nav-item active, nút secondary/tertiary/ghost, v.v.) PHẢI ship override `[data-theme="dark"]` — umber gần vô hình trên tối; remap sang ochre (nhấn) hoặc `--cs-color-text-primary` (body). Wordmark brand screen-template dùng `--cs-color-text-primary` (không umber hardcode) để flip ở dark; header print-doc giữ umber theo thiết kế. Cột ID/code bảng (ví dụ `R-26-07`) mang `white-space:nowrap` để mã có gạch ngang không word-break trong cột hẹp (Th7 2026, user-reported). Quy tắc umber-trên-bề-mặt-themeable giờ **enforce deterministic** bởi `_audit/contrast-guard.html` (static source lint + ma trận WCAG token-pair ghi điểm light *và* dark) — gate đáng tin mà theme advisory DOM-walk không thể (v2.21.0). Advisory v2.21.1 cho việc dùng `accent-strong` riêng làm màu chữ mô tả bảng màu cũ. Nền strong hiện ghép với `--cs-accent-on-strong` và đạt APCA75 cho chữ thân cùng WCAG4.5; cặp màu đó không biến `accent-strong` thành màu chữ dùng chung.

## Phạm vi RTL và kiểm chứng

Nhiều bố cục trong `base/*.css` dùng CSS logical properties (`inline-start`/`inline-end`, `margin-inline`, `padding-block`, `border-inline-*`, `inset-inline-*`). Điều này không chứng minh mọi bố cục hay tương tác đều đảo hướng theo `dir="rtl"`. Các ngoại lệ vật lý gồm độ lệch `left` của skip link khi ẩn và khi nhận focus trong `base/reset.css`, cách căn giữa đối xứng `left:50%` + `translate: -50% 0` của dialog, và chi tiết đường viền xoay của spinner. Quan sát kitchen-sink tháng 7/2026 là mẫu có ngày ghi nhận, không phải chứng nhận RTL hiện tại cho cả sản phẩm. Dùng thuộc tính logic cho bố cục định hướng mới và kiểm tra vị trí focus, hướng bàn phím, overflow, tương tác lồng nhau trong trạng thái RTL của sản phẩm. Nội dung EN/VI được hỗ trợ không xác lập hợp đồng ngôn ngữ Arabic/Hebrew.

## Ảnh thật (image-slot retrofit)

Templates dùng gradient `.cs-aurora-wash` mặc định. Khi dùng ảnh, load `<script src="../../image-slot.js"></script>` một lần qua helmet (đường dẫn tương đối với template), và đặt `id` riêng cho mỗi `<image-slot>` trong hero `position:relative`. Các lớp wash/scrim trang trí không nhận tương tác; nội dung nằm phía trên. Riêng scrim không chứng minh contrast trên ảnh bất kỳ: phải kiểm tra ảnh, chữ, crop và trạng thái đã render thực tế.

Theo triển khai hiện tại của `marketing-page`, `marketing-case-study`, `marketing-social-kit` và `culture-event-invite` cho chrome authoring: caption `::part(empty)` có nền đục dùng token màu, khoảng trống tách khỏi nội dung, thứ tự lớp giữ vùng kích hoạt, hint theo ngôn ngữ và ẩn khi in. Khi áp dụng, kiểm tra trạng thái trống/đã có ảnh và layout responsive; recipe bốn dòng cũ chưa đủ. Tham chiếu standalone: `templates/image-slots-demo.html`. Sidecar `.image-slots.state.json` có sẵn được đọc cạnh HTML; lưu cần bridge `window.omelette.writeFile` của host. Trình duyệt tĩnh thông thường không cung cấp bridge lưu này. Quan sát host tháng 7/2026 là evidence có ngày; phải kiểm tra persistence và asset closure trong bàn giao thực tế.

Ảnh tải cục bộ yêu cầu Canvas mã hóa WebP sau khi đổi kích thước. Khi trình duyệt không mã hóa được WebP, Canvas trả PNG; slot giữ đúng MIME thực tế và độ trong suốt. Mã hóa WebP native không phải cam kết cho mọi trình duyệt. Kiểm tra byte đã lưu và giới hạn cạnh dài nhất trong host được chọn.

## Typography & locale tiếng Việt

Tiếng Việt là ngôn ngữ chính. Ghi chú typography tháng 7/2026 mô tả chủ đích về line-height và locale; chưa chứng nhận shaping, clipping hiện tại hay mọi trạng thái template:
- **Line-heights an toàn VN** — token body 1.5 / heading 1.35 / tight 1.15 chừa chỗ cho dấu chồng (dấu trên + nặng dưới). `:where(h1–h6)` mặc định 1.35 + `text-wrap: balance`; `:where(p)` nhận `text-wrap: pretty` (cả hai `base/reset.css`). Templates có thể hardcode line-height chặt hơn (≈1.0–1.15) **chỉ** trên heading hero display một dòng; heading VN nhiều dòng giữ ≥1.15.

- **Định dạng locale** — theo hợp đồng nội dung của template về phân nhóm số, ngày và cách hiển thị tiền tệ. Finance Quote, Invoice và Expense giữ số tiền giao dịch VND ở cả hai ngôn ngữ, dùng tiền tố `₫` và phân nhóm chấm/phẩy trong nhánh VI/EN; đổi Language không đổi tiền tệ giao dịch. Giữ ví dụ ngày và số theo locale trong đúng nhánh, rồi kiểm tra đầu ra thực tế. Không suy ra `$`, hậu tố `₫`, chuyển đổi tiền tệ hay chứng nhận hiện tại cho mọi template chỉ từ thiết lập ngôn ngữ.

## Whole-set state audits — language · theme · responsive (mỗi cái một pass riêng, Th7 2026)

Doctrine owner: language, theme, và responsive mỗi cái có pass whole-set RIÊNG; một state sạch không phải bằng chứng cho state khác. Các harness lấy danh mục từ manifest, dùng iframe mới cho mỗi template, giới hạn thời gian chờ bootstrap/style/font và báo lỗi đo rõ ràng. Áp dụng trạng thái đã khai báo qua `__dcSetProps`; báo riêng trường hợp đã kiểm tra, nội dung tĩnh, bỏ qua và không hỗ trợ. Một lượt chạy hoàn tất không chứng minh mọi trạng thái hay nền tảng:
- **Language** — `_audit/language-overflow.html` — ép `Tiếng Việt` trên template có khai báo chuyển ngôn ngữ, kiểm tra nội dung sau chuyển và overflow/clip ở 390px; báo riêng template nội dung tĩnh. Gate không chứng nhận chất lượng dịch hay hỗ trợ song ngữ cho mọi template.

- **Theme** — `_audit/theme-overflow.html` — ép dark; hard gate = dark-applies + 0 dark overflow @390 + 0 fail contrast leaf-text solid-bg mở (không miễn trừ template).

## Theme-overflow contrast là hard gate (Th7 2026)

`theme-overflow.html` không miễn trừ contrast theo toàn bộ template. Gate fail khi có bất kỳ lỗi WCAG AA tái lập được trên chữ đo được, Theme dark đã khai báo không áp dụng, hoặc lỗi tải/bootstrap/stylesheet/đo lường. Gate quét các phần tử HTML có chữ lá đang hiển thị, đối chiếu hai lần đo bằng vị trí DOM và toàn bộ nội dung, đếm tất cả lỗi dù chỉ hiện sáu ví dụ. Nền ảnh/gradient vẫn được ghi nhận là bỏ qua; chữ trộn nhiều phần tử, opacity nhóm và pseudo-element cần kiểm tra trực quan bổ sung. Tài liệu in/pháp lý light-only vẫn n/a. Dùng role màu chữ semantic trên panel và accent-bright trên nền Umber cố định; không dùng accent-strong làm màu chữ chung. Proof token: `contrast-guard.html`, `apca-dark-preview.html`, `docs/contrast-report.md`.

## Token exports (Th7 2026)

Các bản xuất token nằm trong `tokens/`: `tokens.json` (nhóm và phạm vi), `tokens.js` (ESM), và `tokens.dtcg.json` (`$value`/`$type` với tên biến CSS). Việc chuyển đổi DTCG hướng tới báo cáo Community Group [Format 2025.10](https://www.designtokens.org/tr/2025.10/format/) và [Color 2025.10](https://www.designtokens.org/tr/2025.10/color/); đây không phải W3C Recommendation. Các giá trị cơ sở đã dùng cấu trúc có kiểu hoặc bí danh có kiểu và vượt qua kiểm tra của repository. Không mặc định khả năng nhập vào Tokens Studio hay Style Dictionary. Phạm vi ghi đè và siêu dữ liệu CSS trong `$extensions` cần bộ chuyển đổi hiểu CyberSkill. CSS vẫn là nguồn chuẩn; generator base, theme và element dựng lại các phần đã được mô tả, với ngoại lệ theo định dạng được liệt kê bên dưới.

### Hợp đồng focus cho overlay lồng nhau và modal

Các widget tùy chỉnh có thể đóng dùng chung một stack Escape, gồm menu, gợi ý, chế độ chỉnh sửa, xem trước và trợ giúp. Escape đóng lớp con trên cùng trước lớp cha; không xử lý khi IME đang composition. Modal giữ focus trong phạm vi đang hoạt động và các portal con đã đăng ký, đặt nhánh nền thành inert, bảo toàn giá trị inert/scroll có sẵn và kích hoạt lại lớp cha khi đóng. Consumer chịu trách nhiệm vị trí và độ sâu hiển thị của portal. Popup select native do trình duyệt quản lý. Kiểm tra tự động Chromium/React development StrictMode là bằng chứng cục bộ; nghiệm thu với công nghệ hỗ trợ và nhiều trình duyệt vẫn riêng biệt.

### Vùng chạm với con trỏ thô

Với con trỏ thô, liên kết breadcrumb, nút segmented, nút xóa SearchField, AI disclosure và hộp Slider native có vùng chạm ít nhất 44×44 CSS pixel ở cả hai mật độ. Padding của track không mở rộng vùng bấm của nút con. Nhãn checkbox/radio mở rộng vùng chạm, biểu tượng native có thể nhỏ hơn. Test trình duyệt đo hộp thực và chạm gần mép vùng mở rộng. Hình dạng núm slider do trình duyệt quyết định; dải input cao 44px.

Pagination xuống dòng ở 320px và giữ vùng chạm tối thiểu 44px. Fixture trình duyệt di động xác nhận chiều rộng CSS viewport thực; sáu ô OTP native vẫn vừa viewport mà không thu nhỏ vùng chạm.

Token coarse của Button cỡ small và extra-small cũng là 44px. Mỗi ngày trong Calendar dùng cột 44px riêng; lịch trong vùng hẹp cuộn nội bộ để các ngày không chồng lên nhau hoặc làm tràn trang. Chấm Carousel giữ dấu tròn nhỏ bên trong nút 44px riêng; vùng slide đủ cao để chứa nút điều hướng. Toolbar, rating, nút đóng và các lựa chọn màu/giá trị trong panel dùng hộp điều khiển thực thay vì pseudo-element có vùng bấm chồng nhau.

`test:touch-inventory` đo toàn bộ fixture smoke của component chính và các trạng thái mở/chỉnh sửa được phát hiện ở 320, 390 và 1280 CSS pixel, với EN/VI, hai theme và hai mật độ. Kiểm tra ownership yêu cầu hộp và vùng chữ nhật sau clipping ít nhất 44px, rồi tìm các tâm hữu hạn bằng đĩa 42px tại tọa độ nguyên, chừa guard 1px. Kiểm tra loại trừ thao tác native/semantic riêng ở phần tử con; guard, chu vi liên tục/tọa độ lẻ và hiệu chỉnh touch native chưa được chứng minh bằng truy vấn DOM này. `test:touch-region` kiểm tra vật cản chéo, thao tác lồng, vùng clipping, containing block của phần tử positioned, label và vùng lệch tâm hợp lệ trên ba engine. `test:touch-actions` và `test:touch-border` bổ sung chạm native, kể cả nút xóa/hiện mật khẩu liền kề của InputGroup. Các kiểm tra chưa chứng nhận mọi tổ hợp prop/nội dung hoặc template tiêu thụ; vẫn cần rà soát đầy đủ trạng thái và template.

Tabs giữ chiều rộng tự nhiên của nhãn và cuộn trong container khi nhãn rộng hơn container, giữ chữ bên trong từng tab và toàn bộ chiều cao control trong vùng cuộn. Với con trỏ thô, scrollbar dạng overlay được ẩn vì có thể nhận thao tác ở vùng dưới của control ngay sau khi cuộn; cuộn ngang và điều hướng focus bằng bàn phím vẫn dùng được. `test:tabs-touch-clip` kiểm tra Tabs và Tab ghép thủ công, nhãn đơn giản/nhãn rich cần cuộn, chọn bằng touch native và focus bàn phím ở 320/360/390px trên cả ba engine. Nút thao tác InputGroup chừa 1px ở mỗi mép ngang quanh đĩa 44px bắt buộc trên con trỏ thô (chiều rộng tối thiểu 46px), tránh thao tác/addon liền kề nhận hit ở mép tọa độ lẻ; kích thước con trỏ mịn không đổi. Kiểm tra mép native dùng tọa độ nguyên cụ thể bên trong đĩa vì làm tròn xuống tọa độ touch lẻ có thể đưa sự kiện thực ra ngoài vùng này.

Nút đóng tùy chọn của Alert/Toast/Tag, nút đóng xem trước Image, gợi ý mention và các điều khiển chọn/sắp xếp/ghim DataGrid cũng có vùng chạm 44px trên con trỏ thô. DataGrid giữ biểu tượng checkbox native trong nhãn lớn hơn. Bước tính cửa sổ ảo không nhỏ hơn chiều cao tự nhiên của các hàng đã render và được đo lại khi đổi kích thước, style tổ tiên, font hoặc chế độ con trỏ. `rowHeight` vẫn là ước lượng tối thiểu cho hàng đồng đều, không phải bộ nhớ chiều cao của mọi hàng chưa render. `test:datagrid-touch` kiểm tra spacer, cuộn và chọn hàng ở cả hai chế độ con trỏ. `test:touch-optional` kiểm tra chạm mép để đóng/chọn và khôi phục focus bàn phím sau xem trước.

### Kế thừa mật độ và tương phản hệ thống

Mật độ được kế thừa xuống phần tử con. Dùng `data-cs-density="comfortable"` để đặt lại khoảng cách và padding của chế độ compact; bỏ thuộc tính là kế thừa, không phải đặt lại. Comfortable khôi phục mọi giá trị do mật độ điều khiển; scope compact bên trong có thể thu gọn trở lại. Theme system tuân theo cùng tùy chọn tương phản của hệ điều hành như light/dark tường minh. Xem `docs/decisions/theme-density-contrast.md` về bằng chứng và giới hạn scope màu còn lại.

### Xuất token mật độ

CSS trong `tokens/theme-attributes.css` là nguồn chuẩn cho bí danh mật độ và hai phạm vi compact/comfortable. Chạy `npm run tokens:generate` để cập nhật JSON/ESM/DTCG, đồ thị khai báo, manifest, native và tài liệu cùng nhau. Kiểm tra bằng `npm run test:density-exports` và `npm run test:token-declarations`. Trình sinh mật độ quản lý giá trị xuất; trình sinh khai báo quản lý toàn bộ dòng token trong manifest.

Bí danh mật độ gốc được xuất thành kích thước số cho native; các phạm vi dùng hậu tố `Compact` và `Comfortable`. Bí danh native ngoài mật độ giữ nguyên dạng chuỗi để tương thích. Token DTCG giữ tham chiếu và phần mở rộng CSS gốc. Việc nhập trực tiếp vào công cụ thiết kế và tính tương thích đầy đủ của các phạm vi mở rộng vẫn là công việc riêng.

`npm run tokens:generate` tạo lại toàn bộ đầu ra phụ thuộc token (mật độ/phần tử, native, phần manifest liên quan, bundle, styles, DESIGN.md và báo cáo tương phản EN/VI). CI dùng cùng lệnh và kiểm tra sai lệch cho từng đầu ra được sinh.

Tạo lại DTCG: `npm run tokens:generate` cập nhật element/density, chạy `tokens:dtcg`, rồi tạo native và tài liệu tham chiếu. `tokens:dtcg` đọc giá trị CSS từ `tokens.json` và danh mục kiểu ngữ nghĩa hiện có; từ chối mục thiếu/thừa, giá trị sai và vòng lặp bí danh trước khi ghi. Chạy `npm run test:dtcg-profile` để kiểm tra tính mới, đầu vào sai và round-trip trong trình duyệt. Mỗi token giữ CSS gốc trong `com.cyberskill.css`; `relativeUnit: em` giữ khoảng cách chữ tương đối dưới dạng số, `cssScale: 100` biểu diễn tỷ lệ phần trăm, và `nativeFormat` giữ chuỗi CSS hoặc hằng `Em` cũ. Đây không phải các mode DTCG dùng chung. Native vẫn quy đổi rem theo 16px và làm tròn alpha thành một byte ARGB khi cần. Build trên nền tảng đích là bước nghiệm thu riêng.

Thử nghiệm local với Style Dictionary 5.5.5 giữ <!-- cs-count:typedBaseTokens -->197<!-- /cs-count --> giá trị cơ sở gốc và phần mở rộng từng token, nhưng bộ định dạng CSS mặc định xuất `[object Object]` cho bốn duration; dictionary chuẩn hóa cũng bỏ siêu dữ liệu phạm vi ở root. Không dùng bộ định dạng hay dictionary đó làm bản xuất CyberSkill không mất dữ liệu. Bộ chuyển đổi của repository bên dưới khắc phục mất dữ liệu trao đổi này; các thử nghiệm không kết nối Figma.

### Bộ chuyển đổi Style Dictionary (bảo trì repository)

Gọi `createStyleDictionaryAdapter(document)` từ `scripts/lib/style-dictionary-adapter.mjs` với tài liệu DTCG gốc đầy đủ trước khi khởi tạo Style Dictionary. Đăng ký `adapter.formatDtcg` làm bộ định dạng riêng; nó dựng lại tài liệu từ toàn bộ `token.original` do công cụ trả về cùng siêu dữ liệu root/nhóm được giữ riêng. Mục thiếu, trùng hay bị đổi đều bị từ chối; không lấy nguồn gốc để âm thầm bù dữ liệu thiếu. Thay đổi phải đi qua CSS chuẩn và trình sinh, không qua giá trị đã được công cụ biến đổi. Siêu dữ liệu được sao chép độc lập để việc sửa đầu vào/đầu ra sau đó không ảnh hưởng lần xuất tiếp theo.

Phiên bản đã kiểm tra là Style Dictionary 5.5.5. Hai vòng nhập/xuất thực giữ đủ <!-- cs-count:typedBaseTokens -->197<!-- /cs-count --> token cơ sở và 36 map phạm vi đang được xuất, gồm bí danh và phần mở rộng. `adapter.formatBaseCss` giữ biểu thức CSS cơ sở chính xác, gồm duration, nhưng chỉ tạo phần `:root`; dùng `styles.css` chuẩn cho kết hợp phạm vi khi chạy. Giữ đủ các map đã xuất không chứng minh bao phủ mọi quy tắc CSS có điều kiện.

`npm run test:dtcg-profile` bao gồm kiểm tra lỗi của bộ chuyển đổi không cần cài thêm phụ thuộc. Để kiểm tra công cụ thực, cài `style-dictionary@5.5.5` trong thư mục riêng với script bị tắt, rồi chạy `npm run test:dtcg-style-dictionary -- <directory>/node_modules/style-dictionary`. CI chạy kiểm tra ghim phiên bản này riêng. Runtime của hệ thiết kế không thêm Style Dictionary và không truy cập tài khoản Figma.

### Danh mục export công khai

`npm run build:exports` tạo lại bundle, danh mục export trong manifest, ESM legacy, entry React và DESIGN.md. Tên export và đường dẫn nguồn lấy từ mô hình bundle của mã nguồn hiện tại; `components/lifecycle.json` cung cấp loại `component`/`constant` và trạng thái vòng đời rõ ràng. Thiếu loại hoặc sai đường dẫn làm trình sinh thất bại; không trình sinh nào tự nâng export mới lên stable. Trường `components` cũ trong manifest chứa cả hai loại: hiện có <!-- cs-count:components -->120<!-- /cs-count --> export component và <!-- cs-count:constants -->4<!-- /cs-count --> hằng. `EDITOR_SCHEMA` là hằng preview, cùng trạng thái với Editor. Gate ESM so sánh bundle thực với manifest và entry legacy, nên hai danh mục cùng thiếu dữ liệu không thể vượt qua.

Trình sinh khai báo quản lý các dòng token root và theo phạm vi trong manifest, gồm đủ mười vai trò accent root. Trình sinh element và mật độ không còn ghi các phần manifest cạnh tranh nhau.

### Đồ thị khai báo token

`tokens/declarations.json` ghi mọi khai báo custom property có thể đi tới từ `styles.css`, theo thứ tự nguồn import/cascade. Mỗi dòng giữ vị trí nguồn, giá trị gốc, `!important`, phân loại namespace và toàn bộ ngữ cảnh rule/at-rule. Kênh resolver riêng vẫn có trong đồ thị bảo trì nhưng không xuất vào dòng token công khai của manifest. Metadata được sinh tự động ghi số khai báo và tệp nguồn hiện tại; số khai báo không phải số token duy nhất hay API stable.

Chạy `npm run tokens:declarations` sau khi sửa CSS, hoặc chuỗi `tokens:generate` đầy đủ. `npm run test:token-declarations` kiểm tra tính mới và đối chiếu mọi dòng với CSSOM độc lập trong trình duyệt. Bộ phân tích được ghim phiên bản dưới dạng phụ thuộc phát triển trực tiếp. Import vòng lặp, thiếu tệp, từ xa/có điều kiện hoặc ra ngoài repository đều thất bại thay vì làm mất điều kiện. Selector lồng nhau và at-rule được giữ riêng; không coi dòng `:root` có điều kiện là mặc định. `manifest.tokens` nay giữ `conditions`, `selectorPath` khi cần, thứ tự/dòng nguồn và độ ưu tiên. `kind` lấy từ danh mục kiểu cơ sở nếu đã biết; `css-expression` nghĩa là chưa xác lập kiểu đa nền tảng.

Metadata JSON/ESM (`$meta.declarationGraph`) và phần mở rộng gốc DTCG
(`$extensions["com.cyberskill"].declarationGraph`) cùng trỏ đến tệp đi kèm
`declarations.json`, với SHA-256 chính xác, phiên bản schema và số lượng public/private.
Đường dẫn tính từ tài liệu token. Chạy lại trình sinh declaration sau mỗi thay đổi
CSS để cập nhật cả ba tham chiếu. Tệp này giữ đủ mọi tên public, gồm 19 tên chưa có
base typed leaf, cùng declaration của resolver private có nhãn visibility rõ ràng.
Các dòng private không trở thành public API; đồ thị không bị sao chép vào từng
runtime token file.

Khi bàn giao bằng adapter trong repository, truyền nguyên văn tệp qua
`createStyleDictionaryAdapter(document, { declarationsJson })`, rồi gọi
`adapter.exportFiles(dictionary)`. Hai tệp trả về `tokens.dtcg.json` và
`declarations.json` phải đi cùng nhau. Tệp thiếu/cũ, đường dẫn không đúng hoặc số
lượng không khớp đều gây lỗi. `exportDtcg` riêng chỉ giữ tham chiếu, không sao chép
tệp đích; `formatBaseCss` vẫn chỉ xuất giá trị root. Đây là bảo toàn dữ liệu nguồn,
không phải đánh giá CSS cascade, giải biểu thức hay chứng nhận hỗ trợ native.

Đây là đồ thị khai báo, không phải kết quả cascade đã tính hay bộ giải phụ thuộc. Ma trận theme/contrast/density vẫn xác minh hành vi khi chạy. Các bản xuất cơ sở có kiểu và phạm vi hiện có vẫn là đầu ra riêng; không suy ra hỗ trợ đầy đủ mode có điều kiện trên mọi nền tảng.

Khi bảo trì repo, `npm run tokens:coverage` phân biệt tên có entry
DTCG nền với giá trị theo scope của từng token public. Hiện có <!-- cs-count:typedBaseTokens -->197<!-- /cs-count --> tên trong
DTCG nền, thêm 11 tên có màu literal theo scope, bảy tên là biểu thức glass chưa
được resolve và một tên định danh style pack. Metadata màu literal không tạo
token root mới và không chứng minh hỗ trợ native. Chạy `npm run tokens:coverage`
sau khi sửa nguồn hoặc type inventory, rồi `npm run test:token-coverage` để kiểm
tra coverage và giữ nguyên scope. Inventory nội bộ này không được public-site
phát hành và không phải file trao đổi DTCG tổng quát.

Danh mục rà soát component được xác minh qua `npm run components:review` sau khi sửa component hoặc test, và kiểm tra qua `npm run test:component-review`. Hook ở cấp tệp và tham chiếu trực tiếp `CS.Name` chỉ giúp tìm bằng chứng; chúng không chứng minh hành vi đã được chạy, đủ mọi trạng thái hay đã được nghiệm thu. Cần đọc fixture gián tiếp và tệp dùng chung trước khi kết luận thiếu coverage.

### Tạo lại các tập con phông chữ tiếng Việt

Mỗi tập con Latin theo kiểu và độ đậm đã khai báo chứa bộ ký tự tiếng Việt NFC
được kiểm tra cùng các dấu kết hợp NFD. Phạm vi CSS bao gồm cả hai để chữ cái và
dấu dùng cùng một phông khi định hình, không thay đổi văn bản do bên gọi cung cấp.
Các tập con ngôn ngữ khác giữ nguyên dữ liệu và phạm vi ký tự trước đó.

`fonts/subset-recipe.json` ghi commit nguồn, mã băm, giấy phép và bộ ký tự chính xác.
Với Python fontTools 4.62.1 và Brotli, chạy
`python3 scripts/build-font-subsets.py --source-dir /path/to/font-cache --download`
để tải nguồn đã kiểm chứng và tạo lại phông; thêm `--check` để so sánh mà không ghi
phông vào kho mã. Chỉ tải khi có `--download`. Giữ thông báo OFL trong
`fonts/licenses/` và bản tổng hợp `fonts/OFL.txt`.

Sau khi chủ động thay phông, chạy `npm run fonts:manifest` để đồng bộ các bản ghi phông trong manifest, rồi chạy `npm run build:styles`,
`npm run fonts:glyphs` và `node _audit/ci/test-font-rendering-browser.mjs`.
Kiểm thử trình duyệt yêu cầu dùng phông đã đóng gói và chiều rộng NFC/NFD bằng nhau
cho cả 16 trường hợp họ phông, kiểu và độ đậm qua cả `styles.css` và
`dist/styles.min.css` (64 trường hợp chuẩn hóa). Stylesheet tổng hợp cũ sẽ làm
kiểm thử thất bại trước khi chạy trình duyệt. Kiểm tra Chromium có giới hạn này
không chứng minh toàn bộ Unicode, các engine khác, cài đặt phông native hay nghiệm
thu hình ảnh. Sửa lỗi có thể đổi khoảng cách tại nơi các tập con cũ chia cắt quá
trình định hình; đánh giá typography của con người và so sánh pixel theo nền tảng
vẫn là các bước nghiệm thu riêng.

Generator theme export dựng lại density và các override dark/system từ colors.css, component-tokens.css và elevation.css. Scope nguồn bị thiếu hoặc trùng làm generator dừng trước khi ghi các bản xuất. Generator declaration quản lý toàn bộ dòng token trong manifest.

### Phạm vi áp dụng của bản xuất và nguồn sinh dữ liệu

`tokens:base` lấy toàn bộ <!-- cs-count:typedBaseTokens -->197<!-- /cs-count --> giá trị base có kiểu từ khai báo CSS root không điều kiện vào nhóm token hiện có. Generator giữ alias và từ chối tên root bị thiếu, trùng hoặc chưa phân loại; rule `:root` có điều kiện không trở thành mặc định. `tokens:elements` quản lý seed và bảng light/dark của element; `tokens:theme` quản lý theme, density và high-contrast từ CSS. `tokens:generate` chạy các bước này trước DTCG, metadata declaration, native và tài liệu phụ thuộc. Khi nguồn đổi, giá trị phải được truyền sang bản xuất; JSON từng đúng không đủ chứng minh quá trình sinh dữ liệu.

| Định dạng sử dụng | Giá trị và scope được biểu diễn | Quy tắc không áp dụng |
|---|---|---|
| CSS chuẩn / CSS flatten | Mọi khai báo công khai, điều kiện, selector và kênh resolver riêng | Render native và xử lý sự kiện OS nằm ngoài việc dùng CSS. |
| Manifest | Mọi khai báo công khai, gồm thứ tự nguồn, selector, điều kiện và importance | Kênh riêng không thuộc các dòng token công khai. |
| JSON / ESM kèm declaration companion | Toàn bộ base có kiểu; bảng theme, element light, density và high-contrast; các khai báo còn lại qua companion có hash | Consumer phải đọc companion để có đầy đủ điều kiện scope; bảng rút gọn không phải bộ máy CSS cascade. |
| DTCG kèm declaration companion | Toàn bộ base có kiểu; bảng theme, element light/dark, density và high-contrast trong vendor extension; khai báo còn lại trong companion | Vendor mode, biểu thức CSS, selector và metadata style không phải giá trị DTCG có kiểu dùng chung. Importer cần adapter của repo hoặc giữ companion. |
| Swift / Kotlin / Dart | Mọi mục base có kiểu; màu dark và chuỗi shadow; mọi giá trị element light và bảng dark hoàn chỉnh; toàn bộ kích thước compact/comfortable; bốn giá trị role high-contrast | Đây là hằng số, không phải CSS engine native. App chọn trạng thái OS/theme/density/element và áp dụng giá trị. Biểu thức vật liệu CSS, selector, điều kiện reduced-motion/coarse-pointer và font stack cần adapter nền tảng. Chuỗi shadow/alias vẫn là chuỗi, chưa chứng minh render tương đương. |

19 tên namespace công khai chưa có base typed leaf vẫn được giữ đầy đủ trong CSS, manifest và declaration companion. Việc không đưa chúng vào bảng base DTCG và hằng số native được quy định rõ:

- `--cs-style-pack` là định danh style duy nhất: metadata, không phải scalar hay màu native.
- `--cs-glass-whisper-bg`, `--cs-glass-whisper-border`, `--cs-glass-light-bg`, `--cs-glass-light-border`, `--cs-glass-standard-bg`, `--cs-glass-standard-border`, `--cs-glass-heavy-bg`, `--cs-glass-heavy-border` là công thức vật liệu CSS. Border trong suốt của whisper đi cùng công thức đó; không tự chuyển thành API vật liệu portable độc lập.
- `--cs-code-bg`, `--cs-code-border`, `--cs-code-fg`, `--cs-code-muted` chỉ áp dụng cho `.cs-code`; `--cs-term-bar`, `--cs-term-bg`, `--cs-term-border`, `--cs-term-dot`, `--cs-term-fg`, `--cs-term-muted` chỉ áp dụng cho `.cs-terminal`. Màu literal được giữ cùng selector. Mẫu native chưa có contract component CodeBlock/Terminal tương ứng, nên đây không phải mặc định root hay token component native.

Hằng số element native dùng hậu tố `<Scope>Light` và `<Scope>Dark`. Bảng dark ghép override dark với các role light được kế thừa; text/link của element dark dùng đúng bảng màu dark. System theme do app chọn giá trị base/light hoặc dark; hằng số không tự theo dõi OS. Ba màn hình Settings minh hoạ chọn density, nhưng kiểm tra source và so sánh computed CSS không thay thế build native, kiểm tra layout đã render hay human acceptance. `test:native-element-values` so sánh mọi giá trị pack light/dark với computed CSS; gate token pipeline kiểm tra mọi hằng số đã sinh và hash provenance.

## Kiểm tra skill trong repository

`npm run test:repository-skills` dùng YAML để phân tích mọi `SKILL.md` không bị ignore trong danh mục Git, kiểm tra metadata bắt buộc và tài nguyên local được liên kết, đồng thời kiểm tra tính đồng nhất và đường dẫn về nguồn chuẩn giữa adapter `.agents` và `.cursor`. Tên skill phải khớp thư mục discovery; `SKILL.md` ở root là router dùng chung nên không áp dụng ràng buộc tên thư mục discovery. Ví dụ trong fenced code không được kiểm tra liên kết; đường dẫn trong văn xuôi, liên kết remote và đích anchor nằm ngoài phạm vi. Parser chạy thành công không đồng nghĩa với host tải skill hoặc hành vi đã được chấp nhận.

Quyền sở hữu source runtime của template: `scripts/template-runtime/primitives/support.js` là nguồn tương thích do dự án duy trì. `npm run build:template-primitives` sinh `templates/_vendor/support.js`, đầu vào chuẩn để đồng bộ các bản sao template. `scripts/template-runtime/ds-base.js` là loader design system chuẩn. Các thư mục template trong manifest nhận bản sao được sinh giống hệt từng byte của cả hai file qua `npm run sync:template-runtimes`. Không bảo trì riêng từng bản sao trong repository. Dự án sử dụng có thể chỉnh base path của loader theo hướng dẫn trong file, ngoài hợp đồng đồng nhất của repository này.

Chạy `npm run test:template-runtimes` hoặc `node scripts/sync-support-runtime.mjs --check` để phát hiện bản sao thiếu hoặc thay đổi mà không ghi file. Trước khi ghi bất kỳ output nào, generator kiểm tra cú pháp source, chính sách no-eval hiện có của support runtime, đích đã khai báo và ranh giới symlink. Vẫn giữ các bản sao cần thiết cho từng template để bàn giao portable; đồng nhất byte không chứng minh compiler khả dụng, toàn bộ asset đầy đủ hay độ trung thực của file export. JetBrains Mono giữ riêng các khai báo weight 400/500/700 và Unicode range, nhưng dùng chung source giống hệt từng byte qua tên file `jetbrainsmono-400-<subset>.woff2`. Các file source 500/700 trùng lặp đã được bỏ; nơi tham chiếu trực tiếp tên file cũ cần chuyển sang file 400 tương ứng và giữ nguyên CSS weight descriptor.

Chạy `npm run build:site` trước `npm run measure:distributions -- --output /tmp/cs-distribution-costs.json`. Phép đo yêu cầu website đã build khớp source hiện tại; đo working tree không bị ignore (kể cả file đang chờ commit), tarball npm thực tế cùng các file đã giải nén, và website đã phân loại, kể cả manifest. Báo cáo từng thư mục template và chi phí các bản sao runtime bắt buộc. Tổng byte của thư mục không gồm tài nguyên dùng chung và công cụ compiler/export: giữ đường dẫn tương đối và kiểm tra asset closure của bản bàn giao. Tổng byte logic khác dung lượng cấp phát trên đĩa và lượng truyền qua mạng. Toàn bộ cây npm là phạm vi source portable đã đo, không phải tài liệu đã export. Lưu báo cáo ngoài repository được đo để tránh tự tham chiếu. `npm run test:distribution-costs` phát hiện thay đổi thành viên/byte của website và sai lệch bản sao runtime. Các phép đo là baseline; giới hạn dung lượng, budget hiệu năng theo consumer và chấp nhận của owner vẫn là quyết định riêng.

Số lượng và vai trò tài liệu công khai được sinh trong [reference catalog](../reference-catalog.json). `npm run docs:reference` cập nhật catalog và các số có marker; `npm run test:reference-catalog` kiểm tra tính mới. Catalog phân biệt khai báo inventory, source có thẩm quyền, hướng dẫn và evidence; không tự xác nhận capability hay human acceptance.

### Bản xuất high-contrast

`tokens/theme-attributes.css` là nguồn chuẩn của hai role high-contrast: chữ muted và border mặc định. Reader dùng chung kiểm tra scope light, dark và system-dark trước khi ghi dữ liệu. JSON/ESM `contrasts` và DTCG `com.cyberskill.overrides.contrasts` giữ delta `high-light` và `high-dark`. Áp dụng delta contrast sau giá trị theme/element đã chọn; Standard không áp dụng delta contrast. Đây là extension riêng, không phải mode DTCG portable. Hằng số native dùng hậu tố `HighLight` / `HighDark`; hằng số không tự theo dõi OS.

`npm run test:contrast-exports` đổi màu CSS nguồn trong fixture biệt lập, chạy generator element/theme/native thực tế, quan sát cả 15 pack trong ba engine với OS media được khởi tạo trước navigation, rồi kiểm tra ba bản xuất native. Khai báo contrast thiếu hoặc mơ hồ không được ghi đè bất kỳ đầu ra nào. Giả lập browser media trực tiếp và sự kiện OS native là kiểm tra riêng; test này không chứng minh build native, import design tool hay human acceptance.

Dùng `--cs-color-semantic-{role}-text` cho chữ trên bề mặt và ghép mỗi màu nền trạng thái với `-fg` tương ứng. Kiểm tra `test:body-text-contrast` đo nhãn Stat, mô tả TextField và liên kết nội dung và chữ accent đậm cỡ nhỏ trên nền page/panel/raised, cùng chữ accent trên tint của các Element đã khai báo, qua mọi biến thể Ngũ Hành, theme, thiết lập hệ điều hành, mật độ và chế độ tương phản kế thừa hoặc chỉ định trong ba engine. Phạm vi này không chứng nhận mọi trạng thái component hay template. Trang in cố định nền trắng khai báo `data-theme="light"` cùng màu chữ chính riêng; trang thích ứng tiếp tục theo theme.

`test:strong-text-contrast` kiểm tra Button primary thực tế và chữ nội dung thường trên nền strong qua mọi biến thể Ngũ Hành, theme, thiết lập hệ điều hành, mật độ và chế độ tương phản kế thừa hoặc chỉ định trong ba engine. Thiết lập được khởi tạo trước khi tải trang và phải khớp với CSS. Kiểm tra trạng thái cuối tắt transition; lớp chồng bất kỳ, khung hình animation, native/device và nghiệm thu thủ công vẫn tách riêng. Giữ nguyên ký hiệu phân cách hiển thị và nội dung pháp lý/nghiệp vụ; chỉ dùng `aria-hidden="true"` cho trang trí không tương tác.

`test:paper-text-contrast` quét đủ 62 nguồn tài liệu in, mọi ngôn ngữ và biến thể Element đã khai báo, gốc Light/Dark trong ba engine. Kiểm tra chữ trực tiếp đã render với APCA75 cho nội dung; chỉ chữ từ 24px và weight700 trở lên được dùng APCA60; lưu toàn bộ JSONL và báo lỗi khi không đo được nền tổ tiên hoặc ký hiệu trang trí chưa đánh dấu. Slate của tài liệu Light là màu chữ nội dung, phải đạt ngưỡng trên nền trắng, ô điền và bảng Element thực tế. Gradient ở phần tử anh em cần bằng chứng raster riêng. Kết quả không thay thế xuất bản, thiết bị, AT thủ công hay nghiệm thu của người vận hành.


Renderer tương thích do dự án duy trì khôi phục cấu trúc điều khiển bảng từ HTML nguồn khi trình duyệt đã di chuyển vòng lặp hoặc điều kiện ra khỏi các dòng. Bảng DC thô bị mất cấu trúc cần bản xem trước HTTP(S) và tài liệu nguồn còn truy xuất được, khớp với logic đang tải; nguồn thiếu hoặc thay đổi sẽ báo lỗi hiển thị bằng VI/EN. Tài liệu thông thường hoặc đã kết xuất đầy đủ trong môi trường không phải HTTP tiếp tục dùng DOM hiện có. Phạm vi này không chứng nhận đủ tài nguyên HTML ngoại tuyến hay bản xuất từ host DC thực tế. `test:template-control-content` kiểm tra sáu nguồn điều khiển bảng, mọi trục đã khai báo,toàn bộ template khởi tạo trong mỗi engine và các tình huống điều kiện/lỗi giao thức.

Mã lịch sử như FIND, TASK-IMP, UX, CDS và ADOPT là nhãn bằng chứng giữ trong comment/prose. Chúng không chỉ hệ thống ticket ngoài hiện hành hay cho phép thực thi. Tra nghĩa bằng test/source cạnh đó và git history; phạm vi task hiện tại đến từ người dùng. Không coi ticket lịch sử thiếu là điều kiện bắt buộc.

17 panel theo phần tử neo được mô tả quản lý vị trí portal trong body và xử lý va chạm theo mặc định; dùng `portal={false}` để đặt inline. Panel có vị trí chèn ban đầu trong form hoặc fieldset tự động giữ inline, kể cả khi `portal={true}`, để bảo toàn liên kết form và hành vi vô hiệu hóa của fieldset; khả năng bị phần tử cha cắt vẫn còn trong các ngữ cảnh này. Portal tùy chỉnh do consumer tạo và vị trí modal vẫn do bên gọi quản lý; đăng ký scope sở hữu với overlay manager khi tích hợp.

## Kiểm tra mở rộng có thể thực thi

Chạy `node scripts/generate-atomic-story-index.mjs` sau khi sửa story Atomic, rồi chạy `node _audit/ci/test-expansion-coverage.mjs`. Index được sinh ghi nhận JSX mount thật qua helper demo cục bộ, định danh nguồn và playground đã khai báo; comment hay tên import không đủ chứng minh có story. Các export thành phần con giữ ranh giới bao phủ theo nhóm đã công bố. Kiểm tra còn yêu cầu specimen card trong mỗi nhóm nguồn component công khai và assertion được ánh xạ vào board hành vi cho native control hoặc event handler quan sát được. Nó xác minh các nghĩa vụ mở rộng cụ thể, không chứng nhận mọi prop, trạng thái hay hành vi trợ năng.

Chạy `node _audit/ci/lib/run-browsers.mjs _audit/ci/test-expansion-coverage-browser.mjs` để kiểm tra các board được giữ nguyên cùng ca mới cho Alert, FormFieldArray, FormWizard, thao tác bàn phím thật, control Cascader/Combobox và specimen thông điệp theo scope. Gói site công khai phải chứa Atomic index đã kiểm tra và card nhóm component. Yêu cầu toàn bộ unit test, board trình duyệt, tìm kiếm nguồn, duyệt hình ảnh sản phẩm và trợ năng thủ công vẫn giữ hiệu lực.

## Phạm vi tài liệu song ngữ

Kiểm tra tài liệu song ngữ bằng Node bao phủ hướng dẫn vận hành ở cấp đầu cùng bản ghi quyết định Markdown do tác giả viết, đệ quy dưới `docs/decisions/`. Nó báo cáo cặp nguồn riêng với hướng dẫn được trình duyệt theo dõi. `_audit/docs-tracked.json` giữ tập hướng dẫn cấp đầu hiện có; duy trì bản quyết định tiếng Việt không tự công bố tệp hay thêm route fetch cho trình duyệt. Danh mục public-site tường minh vẫn quyết định việc công bố. Tệp đầu vào ở gốc, prompt component, bản ghi lưu trữ/tác vụ/audit và từ điển vendor nằm ngoài phạm vi cặp nguồn này; không khẳng định toàn kho đã dịch. Chạy `node _audit/ci/test-docs-lang-parity.mjs` và `node _audit/ci/test-docs-recursive-parity.mjs`; kiểm tra sau từ chối bản lồng nhau thiếu/mồ côi, bản dịch ngắn/dạng stub, lệch tiêu đề và việc vô tình mở rộng danh sách trình duyệt công khai.

## Chạy đầy đủ bộ unit test

Registry duy trì nằm tại `_audit/ci/unit-suites.json`. `npm run test:unit` chạy toàn bộ registry; test riêng chỉ là bằng chứng theo phạm vi. CI dùng bốn shard với `CS_UNIT_PLAN=_audit/ci/unit-shard-plan.json` và `CS_UNIT_SHARD=1/4` đến `4/4`. Kế hoạch chứa mỗi lệnh đã đăng ký đúng một lần và gắn hash registry có thứ tự; thành viên sai định dạng, trùng, thiếu hoặc lỗi thời bị từ chối trước khi chạy lệnh.

Chạy `npm run build:unit-plan` sau khi đổi registry, rồi `node scripts/generate-unit-shard-plan.mjs --check`. Thời lượng thành công trong `_audit/ci/unit-duration-baseline.json` hướng dẫn cân bằng tải; lệnh thất bại, mới hoặc đã đổi dùng ước lượng dự phòng thận trọng. Thời lượng chỉ là ước lượng, không cam kết thời gian CI và không cho phép bỏ test. Mỗi shard ghi kết quả cuối cùng gồm pass/fail/thời lượng cho từng test; một shard đạt không có nghĩa toàn bộ bộ test đạt.

Dùng `node scripts/npm.mjs …` để chạy npm CLI đã khóa. Wrapper thêm thư mục binary npm đã khóa và thư mục executable Node đang gọi vào đầu PATH con, nên script npm lồng nhau giữ đúng phiên bản Node ngay cả khi shell chọn phiên bản khác. Kiểm tra runtime tối thiểu vẫn phải ghi phiên bản Node thực tế và kết quả cuối cùng.

Khi retry lỗi hạ tầng trình duyệt, log của test giữ record có cấu trúc `CS_BROWSER_RETRY` gồm engine, lần thất bại/lần tiếp theo và nguyên nhân gốc. Giới hạn ba lần không đổi; lỗi assertion không được retry. Retry thành công ghi nhận phục hồi, không chứng minh nguyên nhân crash hay kết luận do thiếu bộ nhớ.

Khi gọi trực tiếp bằng `node scripts/prepare-release.mjs`, bước tái sinh của quy trình chuẩn bị phát hành vẫn dùng trình chạy npm đã khóa. Chạy bootstrap toolchain đã khóa trước; npm khác trong shell không được thay đổi toolchain hay checkout của bản ứng viên. Quy trình giữ nguyên bản ghi phê duyệt và không công bố bản phát hành.

Chuẩn bị bản phát hành chỉ cập nhật tập marker định danh nguồn hữu hạn trong danh sách tài liệu đã rà soát. Marker thiếu, trùng, sai dạng hoặc lỗi thời chặn mọi thao tác ghi phiên bản. Lệnh cài registry, inventory sibling và phần lịch sử phát hành giữ nguyên định danh đã công bố. Checkout chưa công bố hoặc tarball cục bộ đã rà soát không xác nhận phiên bản có trên registry và không cấp quyền công bố.

### Khung trang chiếu cố định và lưới đáp ứng thông thường

Bên trong `.cs-canvas-desk`, lưới có số cột cố định do tác giả khai báo giữ nguyên số cột, kể cả `repeat(4,minmax(0,1fr))`. Vùng nền cho phép cuộn ngang khi cửa sổ hẹp hơn khung cố định; lưới màn hình thông thường nằm ngoài vùng nền vẫn giảm số cột tại các điểm ngắt đáp ứng đã ghi nhận. Giữ nội dung trang chiếu trong giới hạn 16:9 đã khai báo ở cả hai ngôn ngữ, thay vì xếp chồng các cột bên trong ở độ rộng điện thoại.

Chuẩn bị phát hành thu nhận đầu ra Git với bộ đệm giới hạn64MiB để patch nhị phân sinh tự động lớn hơn1MiB được giữ đầy đủ; lỗi subprocess và kiểm tra hash patch chính xác vẫn chặn quy trình.

Kiểm tra export legacy dùng bộ phân tích phiên bản phát hành chuẩn, gồm prerelease nhưng từ chối build metadata. Chỉ export VERSION được chứa chuỗi phiên bản; các export sinh tự động khác vẫn tham chiếu trực tiếp CS. Ghi lại chú thích phiên bản nhiều lần không đổi kết quả; phiên bản sai dạng hoặc mã bổ sung bị từ chối.

Audit token native phân tích nhãn phiên bản mang tính thông tin bằng cùng quy tắc stable/prerelease chuẩn của quy trình chuẩn bị phát hành. Hash nguồn DTCG, hash của mọi đích và toàn bộ phép kiểm tra giá trị native vẫn là căn cứ xác định sai lệch.

Bảng nhãn phiên bản trên trình duyệt và kiểm tra provenance nhanh bằng Node cũng dùng bộ phân tích prerelease chuẩn. Cả chín nhãn phải khớp VERSION; front matter DESIGN sai dạng hoặc lệch phiên bản vẫn làm bảng kiểm tra thất bại.
