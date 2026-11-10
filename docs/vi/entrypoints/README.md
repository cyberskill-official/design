# Hệ thống thiết kế toàn cầu CyberSkill

> **Turn Your Will Into Real — Hiện Thực Hoá Ý Chí**

[![Design System Gates](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml)

Hệ thống thiết kế ấm áp, chuẩn doanh nghiệp, **ưu tiên tiếng Việt** cho **CyberSkill** — studio phần mềm Sài Gòn (thành lập 2020) biến *điều ước* rõ ràng thành phần mềm hoạt động. Neo trên **Umber** và **Ochre**, dẫn dắt bởi thần đèn vàng **Lumi**, mọi bề mặt giải quyết bốn trục độc lập: **Theme** (light · dark · system) × **Element** (bản sắc sản phẩm Ngũ Hành: Kim · Mộc · Thủy · Hỏa · Thổ, 15 biến thể) × **Language** (EN · VI) × **Style** (`data-cs-style` — gói duy nhất **liquid-glass**; không khai báo ≡ mặc định). Phía sử dụng chỉ cần liên kết một tệp: **`styles.css`** (`dist/styles.css` là cùng closure được làm phẳng thành một tệp cho các môi trường không theo chuỗi `@import` như bộ hiển thị thẻ và một số sandbox; sinh lại bằng `npm run build:css` sau khi sửa `tokens/` hoặc `base/`).

---

## Bắt đầu tại đây

Đây là **tài liệu điểm vào** của CyberSkill Design System — VERSION của bản nguồn **<!-- cs-source-version:checkout -->2.8.0<!-- /cs-source-version -->** (xem `VERSION`; không xác nhận phiên bản có trên registry). **Trang sản phẩm** là Storybook tại **`/`** trên `design.cyberskill.world` (chỉ trên host; cục bộ: `npm run storybook`). Tài liệu vận hành được công bố ở thanh bên **Docs** của Storybook và Thư viện tài liệu tại `/docs/viewer.html` (các đường dẫn cũ `/dashboard`, `/dashboard.html` và `/playground/*` chuyển hướng về `/`).

### Bắt đầu nhanh theo đối tượng

- **Nhà thiết kế** — mở Storybook (**Foundations / Components / Templates / Pages / Docs**). **Templates** liệt kê toàn bộ <!-- cs-count:templates -->85<!-- /cs-count --> điểm khởi đầu (Gallery → Atomic View, cùng story theo nhóm, gồm bộ 38 tài liệu VN A4 (Employment Suite + khung thương mại) tại **Templates → HR**). Đổi trực tiếp Theme × Element × Language × Style qua thanh công cụ Storybook, Atomic View và mẫu Elements Geometry.
- **Soạn template trình duyệt** (máy chủ HTTP tĩnh) — đọc `SKILL.md` (chọn runtime + ràng buộc thiết kế), rồi hướng dẫn bên dưới; phối hợp `styles.css` + ESM đã biên dịch `@cyberskill/design` (`dist/esm/_esm/react.mjs`; JSX thô qua `@cyberskill/design/source`) / `_esm/cs.mjs` cũ / `_ds_bundle.js` (tìm theo tiền tố). `support.js` được cung cấp thông dịch `*.dc.html` trong trình duyệt; xem `docs/template-grammar.md` về ngữ pháp và ranh giới chỉ ở host. Hợp đồng component nằm cạnh từng component (`.d.ts` + `.prompt.md`).
- **Tĩnh / open-spec** (ví dụ Google Stitch) — bắt đầu từ **`DESIGN.md`** (open-spec được sinh) → `llms.txt` → `tokens/tokens.dtcg.json`. Dựng giao diện **tĩnh** bằng `styles.css` + `.cs-*` / kitchen-sink / `examples/static-hello/`. Dùng `.dc.html` qua trình thông dịch được cung cấp hoặc công cụ hiểu ngữ pháp; công cụ HTML thuần dùng `.cs-*` hoặc ảnh chụp kết quả hiển thị đã kiểm chứng.
- **Người triển khai** — gói npm ổn định đã công bố **`@cyberskill/design@2.8.0`** (xem `docs/consuming.md`; quyền dùng trong `docs/consumer-grant.md` — vẫn UNLICENSED). **Next/SSR:** `import { Button } from "@cyberskill/design"` (peer React). **Demo trình duyệt:** **`examples/npm-hello/`** (Lumi · Hỏa · plasma, `_esm/cs.mjs` cũ). Hoặc liên kết **`styles.css`** từ clone/subtree (một tệp cho toàn bộ), hoặc chép thư mục `templates/<slug>/` và sửa một dòng trong `ds-base.js` (đổi liên kết một dòng, được kiểm định đầu cuối tháng 7/2026). Xác định scope bằng `data-theme` · `data-cs-element` (+`data-cs-variant`) · `lang`. Dấu hiệu bản phát hành: SHA đầu nhánh + `docs/release-notes.md` (VERSION nguồn là **<!-- cs-source-version:release-signal -->2.8.0<!-- /cs-source-version -->**; không có CHANGELOG).
- **Người bảo trì** — `docs/doctrine.md` (mở rộng + kiểm chứng), rồi `CONTRIBUTING.md` và `docs/quality-gates.md`.

### Bản đồ tài liệu — phía sử dụng

| Tài liệu | Nội dung giải đáp |
|---|---|
| `README.md` (tệp này) | Hướng dẫn đầy đủ: màu neo, giọng điệu, nền tảng thị giác, component, template, mục lục kho nguồn |
| `DESIGN.md` | Bề mặt open-spec được sinh của **kho này** (kiểu Stitch) — doctrine + mọi giá trị token + danh mục, từ DTCG; sinh lại bằng `npm run build:design-md`. Không sửa tay. |
| `SKILL.md` | Điểm vào agent — lựa chọn runtime + ràng buộc thiết kế |
| `docs/consuming.md` | Tiếp nhận và nâng cấp — hai đường DC/tĩnh, tên gói npm, các trục, nâng cấp + mở rộng |
| `docs/consumer-grant.md` | Văn bản cấp quyền sử dụng gói npm (danh mục CyberSkill; UNLICENSED + sản phẩm được nêu tên) |
| `docs/conventions.md` | Cách mở rộng hệ thống (ngữ pháp đặt tên, danh sách kiểm tra, bốn trục) |
| `docs/release-notes.md` | Điểm nổi bật sản phẩm được biên tập (không phải changelog) |
| `docs/design-styles.md` | Các trục kiểu trực tiếp (Theme × Element × Language × Style) và cách xử lý liquid-glass cố định |
| `docs/products.md` | Registry sản phẩm → hành (**đã khóa** — không tự đặt phân bổ) |
| `docs/contrast-report.md` | Quét APCA Ngũ Hành được sinh — 0 lỗi tại ngưỡng nhãn UI Lc ≥ 60. Người soạn nội dung theo ngưỡng chặt hơn Lc ≥ 75 (xem Bất biến nền tảng); dòng Lc ≥ 60 của phép quét là cặp accent/nhãn, không phải văn bản nội dung. |
| `docs/template-schema-v2.md` | Đặc tả slot nội dung có kiểu cho template — tùy chọn áp dụng, máy có thể kiểm tra |
| `docs/deploy.md` | Triển khai trang trực tiếp — Vercel (không cấu hình) · VPS/nginx tổng quát · kiểm tra sau triển khai |
| `docs/live-hub.md` | Storybook tại `/` là bề mặt sản phẩm; bản đồ bề mặt |
| `docs/storybook.md` | Host bề mặt sản phẩm Storybook tại `/` — thanh bên Docs là bề mặt đọc công bố |
| `docs/figma.md` | Cách import Figma / Tokens Studio cho phía sử dụng và bảo trì |
| `docs/vi/*.md` | Bản tiếng Việt của mọi `docs/*.md` dành cho vận hành (đổi EN\|VI trong `docs/viewer.html`; bản dịch điểm vào theo cặp nằm trong `docs/vi/entrypoints/`) |

### Bản đồ tài liệu — người bảo trì

| Tài liệu | Nội dung giải đáp |
|---|---|
| `docs/doctrine.md` | Quy tắc mở rộng, độ sâu kiểm chứng, bất biến (tệp host như `CLAUDE.md` là cầu nối) |
| `docs/decisions.md` | Quyết định chủ sở hữu đã ghi nhận + công việc bảo trì còn mở |
| `docs/ci-cd.md` | Tự động hóa CI/CD — workflow GitHub Actions, bộ chạy cổng headless, kiểm tra trước nguồn gốc token, badge |
| `docs/quality-gates.md` | Tham chiếu chuẩn đo — từng cổng chất lượng, assertion, tiêu chí đạt, nơi chạy |
| `docs/sync.md` | Độ trung thực vòng đi-về giữa kho ↔ môi trường soạn thảo và đồng bộ hai chiều |

### Nguồn chuẩn & các kho liên quan

- **Nguồn chuẩn:** `cyberskill-official/design` lưu trữ toàn bộ token, component React, tài sản thương hiệu, template và cổng kiểm tra.
- **Open-spec được sinh:** [`DESIGN.md`](../../../DESIGN.md) được dựng từ `tokens/tokens.dtcg.json` + `_ds_manifest.json` bằng `npm run build:design-md` (cổng `design-md-parity` ghim từng byte với nguồn).
- **Kho CyberSkill liên quan:** Trang marketing (`https://github.com/cyberskill-official/landing-page`) và Khung audit (`https://github.com/cyberskill-official/design-system-audit-framework`).

---

## Bất biến nền tảng

<!-- BEGIN DOCTRINE IMMUTABLES -->
| Bất biến | Giá trị |
|---|---|
| Khẩu hiệu | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| Màu thương hiệu chính | Umber `#45210E` |
| Màu nhấn chính | Ochre `#F4BA17` |
| Giọng điệu | ấm áp · trực tiếp · trung thực · tôn trọng (đồng thời cả bốn) |
| Ngôn ngữ | Ưu tiên tiếng Việt; mỗi chuỗi giao diện có cặp EN + VN |
| Ngưỡng tiếp cận tối thiểu | APCA Lc ≥ 75 cho văn bản nội dung; không bao giờ bỏ vòng tiêu điểm; vùng chạm ≥ 44px |
| Các trục | Theme × Element × Language × Style (độc lập) |
| Gói phong cách | liquid-glass (gói duy nhất; không khai báo ≡ mặc định) |
<!-- END DOCTRINE IMMUTABLES -->

---

## Nền tảng nội dung & giọng điệu

**Giọng điệu là hợp âm bốn trục vang đồng thời:** *ấm áp · trực tiếp · trung thực · tôn trọng.* Không bao giờ “vui nhộn/tinh nghịch/gai góc” — các giọng này lệch chuẩn thương hiệu.

- **Ấm áp, gần gũi, ngôi thứ hai.** Gọi người đọc là “bạn”; studio là “chúng tôi”. Lumi xưng “tôi”. Lời văn dịu dàng, khích lệ, không sáo ngữ doanh nghiệp (ví dụ *“Rất vui. Tôi nên gọi bạn là gì?”*, *“Chiếc đèn đang nghỉ một chút.”*).
- **Trực tiếp và cụ thể.** Câu ngắn, kết quả rõ, không vòng vo (ví dụ *“Gửi một lời nhắn ngắn. Chúng tôi trả lời trong một ngày làm việc.”*, *“Được xây để bàn giao và bền vững.”*).
- **Trung thực về đánh đổi.** Thương hiệu đề cao sự thẳng thắn: *“giàu kinh nghiệm, nhỏ gọn và trung thực về đánh đổi.”* Rủi ro được nêu bằng lời, không giấu hay chỉ biểu thị bằng màu.
- **Tôn trọng đồng thuận và riêng tư.** Hỏi trước khi liên hệ; cam kết không chia sẻ (ví dụ *“Thông tin của bạn đến thẳng đội ngũ. Chúng tôi không bao giờ chia sẻ.”*).
- **Ẩn dụ “điều ước” là trục chính.** Sản phẩm là *điều ước*; Lumi (thần đèn vàng) *hiện thực hóa* bằng cách chuyển đến đội ngũ con người thật. Động từ: *ước, hiện thực hóa, định hình, bàn giao, bền vững*. Dùng ấm áp, không phô trương.

**Viết hoa và quy cách:** Viết hoa đầu câu cho tiêu đề và nút (*“Ước một điều”*, *“Kể chúng tôi nghe điều ước của bạn”*). CHỮ HOA + giãn ký tự rộng chỉ dùng cho dòng dẫn nhỏ/nhãn/tiêu đề bảng. Tiêu đề không có dấu câu cuối; nội dung dùng dấu chấm. Số viết bằng chữ số (*“một ngày làm việc”* trong văn xuôi được chấp nhận, nhưng *“3 ngày làm việc”* cho SLA cụ thể). Dùng gạch ngang dài cho ý phụ.

**Song ngữ (ưu tiên tiếng Việt):** Mỗi chuỗi hướng người dùng có bản EN + VN hoặc ghi chú hoãn rõ ràng. Tiếng Việt là thành phần hạng nhất, không phải bản dịch bổ sung — giữ nguyên dấu ở mọi nơi (*Nguyễn Hoàng Vũ*, *Hiện Thực Hoá Ý Chí*). Line-height an toàn cho tiếng Việt (nội dung 1.5 / tiêu đề 1.35) dành đủ khoảng trống cho dấu chồng.

**Emoji:** **Không dùng** trong giao diện sản phẩm hay lời văn thương hiệu. Ý nghĩa được truyền tải bằng từ ngữ và bộ icon nét, không dùng emoji.

---

## Nền tảng thị giác

- **Bảng màu — đất ấm, không lạnh.** Umber `#45210E` làm nền tảng mọi thứ (chính là màu chữ chính); Ochre `#F4BA17` là accent duy nhất — CTA trên nền tối, vòng tiêu điểm, điểm nhấn, thần đèn. Bề mặt là giấy ấm: page `#FFFDF8`, panel `#FFFFFF`, raised `#FBF4E9`. Mọi màu trung tính ngả về umber — viền `#E7D9C6`, chữ mờ `#3F2D21`. Màu ngữ nghĩa (success `#166534`, danger `#B42318`, warning `#92400E`, info `#1D4ED8`) dùng tiết chế và không bao giờ là tín hiệu duy nhất. **Tối đa một accent trên mỗi bề mặt** — bề mặt lõi dùng Ochre; *sản phẩm* có thể thay bằng accent Ngũ Hành, không thêm sắc thứ hai cạnh nó. Không dùng gradient tím xanh.
- **Chữ.** UI: **Be Vietnam Pro** (300–800; họ chữ ưu tiên tiếng Việt) — mặc định trên mọi bề mặt, gồm cả tiêu đề. Display/tiêu đề lớn: **Space Grotesk** (biến thiên 300–700), font **tùy chọn** của `--cs-font-family-display`; không thành phần nào trỏ đến nó trước khi scope chọn `.cs-display-face`, chuyển `--cs-heading-family` và giữ văn bản nội dung ở font UI. Mã/dữ liệu: **JetBrains Mono**. Tiêu đề display đậm (800 ở font UI; trong `.cs-display-face`, Space Grotesk tối đa 700), giãn ký tự chặt (−0.02em); nội dung 400/500 ở 1.5. Dòng dẫn chữ hoa giãn 0.08–0.12em. Thang cỡ chạy từ xs 12 → 5xl 60 trên nền 16px.
- **Khoảng cách và bố cục.** Lưới cơ sở 4px; padding section từ 64 đến 96px; max-width nội dung khoảng 1200–1320px. Khoảng trắng rộng rãi, tĩnh tại.
- **Bo góc và thẻ.** Bán kính: sm 4, md 8 (mặc định), **lg 14 (thẻ/panel)**, full 999 (pill, input, chip). Thẻ mặc định = panel trắng, viền ấm 1px `#E7D9C6`, bán kính 14px, bóng ấm mềm. Không dùng thẻ có viền trái tô màu.
- **Bề mặt — Liquid Glass (cách xử lý mặc định).** Năm vật liệu trên các màu neo: **Whisper** (lớp phủ hero), **Light** (nav/sidebar), **Standard** (thẻ trên hình), **Heavy** (modal/popover), **Solid** (nội dung dày, bảng). Kính = độ trong `color-mix` + blur/saturate `backdrop-filter` + gradient viền thấu kính 1px. Đây là cơ chế **tùy chọn và cộng thêm** — áp dụng lớp `cs-surface-*` sau khi kiểm tra APCA với nền sau; nội dung dày giữ Solid. Tự động chuyển sang đặc dưới `prefers-reduced-transparency`, `forced-colors`, khi in và trên trình duyệt không hỗ trợ. Bề mặt giải quyết **Theme × Element × Language × Style** độc lập.
- **Bóng đổ và chiều sâu.** Bóng ấm ngả umber (`rgba(69,33,14,…)`), thang mềm năm mức từ đường mảnh `xs` đến độ nổi hộp thoại `xl`. Chiều sâu là thang z tường minh gắn với các tầng kính: bg 0 → section 5 → card 10 → nav 50 → dropdown 60 → overlay 80 → modal 100 → toast 200.
- **Nền và hình ảnh.** Nền umber đậm phát sáng với **ánh hạt vàng ấm** (`aurora-tho.webp`), mỗi hành có lớp phủ riêng (`assets/aurora-{tho,hoa,thuy,moc,kim}.webp`, áp dụng qua lớp `.cs-aurora-wash`; Thổ dùng vàng chính thức). Section umber tràn mép neo hero, dải tuyển dụng và footer. Linh vật **Lumi** là thần đèn vàng bóng trên nền trong suốt.
- **Bản sắc sản phẩm Ngũ Hành.** Studio thuộc **Thổ/Earth** (Umber + Ochre); mỗi *sản phẩm* CyberSkill có thể mang một hành — **Kim** (metal) · **Mộc** (wood) · **Thủy** (water) · **Hỏa** (fire) · **Thổ** (earth) — qua `data-cs-element` (+ `data-cs-variant`, ví dụ Hỏa: ember · lava · plasma). Mỗi gói đặt mười token vai trò **`--cs-accent-*`** (accent / strong / bright / on / on-strong / tint / ink / glow / grad-a / grad-b) trong `tokens/elements.css`; trong scope, hành nhận đầy đủ vai trò accent của Ochre. Không bao giờ đổi theo hành: trạng thái ngữ nghĩa và **chỉ báo tiêu điểm kết hợp** (viền text-primary + quầng ochre). Phối màu theo chu kỳ: hành phụ chỉ xuất hiện ở điểm cuối gradient dọc **Tương sinh** (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc); cặp **Tương khắc** không bao giờ trộn. Ánh xạ sản phẩm→hành nằm trong `docs/products.md`. Mọi template đều dùng `--cs-accent-*`, không dùng hex thô. **Lumi giữ màu vàng trong mọi hành.**
- **Chuyển động và trạng thái tương tác.** Thời lượng ngắn (120–320ms) với đường cong giảm tốc mềm `cubic-bezier(0.2,0,0,1)`; `prefers-reduced-motion` giảm thời lượng animation/transition xuống 0.01ms và tắt cuộn mượt. Hover sáng thêm ~8% (nền tô) hoặc tô `surface-raised` (nhẹ); nhấn dịch 0.5–1px; tiêu điểm giữ **chỉ báo kết hợp** (viền text-primary 2px + quầng Ochre) theo `docs/doctrine.md`. Vùng chạm ≥ 44px trên con trỏ thô. Độ trong và độ mờ chỉ xuất hiện trên bề mặt kính và ô nhập điều ước ở hero.

---

## Hệ biểu tượng & tài sản thương hiệu

CyberSkill **không kèm thư viện icon bên ngoài**. Hệ thống dùng **bộ icon nét nội bộ** (`TASK-DS-010`): mỗi icon là dữ liệu (viewBox + đường nét nguyên thủy) hiển thị qua một component `<Icon>`.

- **Kiểu dáng:** icon nét, stroke `currentColor`, độ dày 1.75, đầu/nối bo tròn, viewBox 24×24 — kích thước lấy từ `--cs-icon-sm|md|lg` (16/20/24).
- **Danh mục icon:** `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off`, mở rộng ở v2.0 với `search · sliders · upload · download · calendar · user · plus · trash · external · menu`, và ở v2.13 với `chevron-down/up/left/right · edit · copy · info · alert-triangle`. `sparkle` là glyph **“điều ước”** của thương hiệu. **Không dùng emoji** hay ký tự unicode thay icon trong UI sản phẩm.
- **Tài sản thương hiệu gốc:** `assets/` chứa `logo-mark.svg` / `logo-mark.png` (biểu trưng gốc chính thức, nền Umber + thần đèn Ochre), `favicon.svg`, `aurora-tho.webp` (`aurora-gold.jpg` giữ làm ảnh mẫu) và `lumi-poster.webp`. **Không bao giờ dựng lại, đổi màu hay mô phỏng biểu trưng gốc;** với tenant bên thứ ba, thay bằng logo riêng của tenant.

---

## Component

<!-- BEGIN CATALOG COMPONENT INVENTORY -->
Được sinh từ catalog nguồn công khai và AST Atomic story thực tế. **125 export trong 9 nhóm import**; gồm component, hằng số và hook. Có trong danh mục không đồng nghĩa nghiệm thu ngữ nghĩa hay con người.

- **AI-native** — `AIDisclosureBadge`, `ChatMessage`, `CitationList`, `ConfidenceMeter`, `HumanReviewGate`, `PromptInput`, `PromptSuggestions`, `TypingIndicator`

- **Dữ liệu và bố cục** — `Accordion`, `AspectRatio`, `Avatar`, `AvatarGroup`, `Card`, `CardBody`, `CardFooter`, `CardHeader`, `Carousel`, `Chart`, `CodeBlock`, `Collapsible`, `Comment`, `DataGrid`, `DataTable`, `DescriptionList`, `Divider`, `Image`, `Item`, `Kbd`, `List`, `ListItem`, `Masonry`, `QRCode`, `ScrollArea`, `Sortable`, `Splitter`, `Stat`, `Terminal`, `Timeline`, `Tooltip`, `Tree`, `TreeTable`, `Watermark`

- **Phản hồi và trạng thái** — `Alert`, `Badge`, `EmptyState`, `ProgressBar`, `Result`, `Skeleton`, `Spinner`, `StatusIndicator`, `Tag`, `Toast`, `ToastStack`

- **Lớp phủ** — `AlertDialog`, `ContextMenu`, `Drawer`, `HoverCard`, `OverlayProvider`, `Popconfirm`, `Popover`, `Tour`

- **Điều hướng** — `Anchor`, `BackTop`, `Breadcrumb`, `CommandPalette`, `Dock`, `HotKeys`, `Link`, `Menu`, `MenuItem`, `Menubar`, `NavItem`, `NavigationMenu`, `Pagination`, `Sidebar`, `Steps`, `Tab`, `Tabs`, `Toolbar`

- **Lõi** — `Button`, `ButtonGroup`, `Dialog`, `FloatingActionButton`

- **Thương hiệu** — `CS_ICONS` (hằng số), `CS_LOGO_MARK_INNER` (hằng số), `CS_LOGO_VIEWBOX` (hằng số), `Icon`, `Logo`, `LumiAvatar`

- **Biểu mẫu** — `Calendar`, `Cascader`, `Checkbox`, `ColorPicker`, `Combobox`, `DatePicker`, `EDITOR_SCHEMA` (hằng số), `Editor`, `FileUpload`, `Form`, `FormField`, `FormFieldArray`, `FormWizard`, `InlineEdit`, `InputGroup`, `InputOTP`, `Mentions`, `NativeSelect`, `NumberField`, `Radio`, `RadioGroup`, `Rating`, `SearchField`, `SegmentedControl`, `Select`, `Slider`, `Switch`, `TagInput`, `TextField`, `Textarea`, `TimePicker`, `Toggle`, `Transfer`, `TreeSelect`

- **Bản địa hóa** — `LocaleProvider`, `useMessages` (hook)

**Các phối hợp Atomic quan sát được** — danh sách dẫn xuất từ đích render JSX thực tế trong các story cấp bậc được soạn, gồm thành phần con dùng lại. Một đích có thể xuất hiện ở nhiều cấp. Provider chỉ cung cấp context, hằng số và hook không hàm ý có mẫu thị giác độc lập.

- **Nguyên tử (Atom)** — `AspectRatio`, `Avatar`, `AvatarGroup`, `Badge`, `Button`, `Divider`, `Icon`, `Item`, `Kbd`, `Link`, `Logo`, `LumiAvatar`, `ProgressBar`, `Skeleton`, `Spinner`, `StatusIndicator`, `Switch`, `Tag`, `Toggle`

- **Phân tử (Molecule)** — `AIDisclosureBadge`, `Alert`, `Anchor`, `Avatar`, `AvatarGroup`, `BackTop`, `Badge`, `Breadcrumb`, `Button`, `ButtonGroup`, `Card`, `CardBody`, `CardFooter`, `CardHeader`, `ChatMessage`, `Checkbox`, `CitationList`, `CodeBlock`, `Collapsible`, `ColorPicker`, `Combobox`, `ConfidenceMeter`, `ContextMenu`, `DescriptionList`, `FileUpload`, `FloatingActionButton`, `HoverCard`, `Icon`, `Image`, `InlineEdit`, `InputGroup`, `InputOTP`, `List`, `ListItem`, `Mentions`, `Menu`, `MenuItem`, `NativeSelect`, `NumberField`, `Pagination`, `Popconfirm`, `PromptSuggestions`, `QRCode`, `RadioGroup`, `Rating`, `ScrollArea`, `SearchField`, `SegmentedControl`, `Select`, `Slider`, `Stat`, `Steps`, `Switch`, `Tabs`, `TagInput`, `TextField`, `Textarea`, `Toast`, `ToastStack`, `Toolbar`, `Tooltip`, `TypingIndicator`, `Watermark`

- **Tổ chức (Organism)** — `Accordion`, `AlertDialog`, `Avatar`, `Badge`, `Button`, `Calendar`, `Carousel`, `Cascader`, `Chart`, `ChatMessage`, `CommandPalette`, `Comment`, `DataGrid`, `DataTable`, `DatePicker`, `Dialog`, `Dock`, `Drawer`, `Editor`, `EmptyState`, `Form`, `FormField`, `FormFieldArray`, `FormWizard`, `HotKeys`, `HumanReviewGate`, `Icon`, `Kbd`, `LocaleProvider`, `Masonry`, `Menubar`, `NavItem`, `NavigationMenu`, `OverlayProvider`, `Pagination`, `Popover`, `PromptInput`, `RadioGroup`, `Result`, `Sidebar`, `Sortable`, `Splitter`, `Terminal`, `TextField`, `TimePicker`, `Timeline`, `Tour`, `Transfer`, `Tree`, `TreeSelect`, `TreeTable`
<!-- END CATALOG COMPONENT INVENTORY -->

- **Điểm nổi bật:** **Button** — primary Umber; biến thể primary/secondary/tertiary/ghost/danger/danger-ghost; cỡ xs–lg; loading, icon, fullWidth. **TextField / Textarea / Select / NativeSelect** dùng chung khung `.cs-field` (nhãn + mô tả/lỗi; an toàn dấu/IME). **DataTable** — caption, header có scope, render theo cột, bộ trạng thái idle/loading/error/empty. **Card** — panel ấm + header/body/footer. **Logo** hiển thị đúng biểu trưng chính thức; **Icon** điều khiển bộ icon nét nội bộ. Họ **AI-native** mang doctrine giải trình của thương hiệu — công bố, review của con người, thu nhận điều ước và độ tin cậy, đều diễn đạt bằng lời (không chỉ bằng màu).
- **Cài đặt / tên gói:** Tên gói là **`@cyberskill/design`** (VERSION bản nguồn **<!-- cs-source-version:package-source -->2.8.0<!-- /cs-source-version -->**; quyền trong `docs/consumer-grant.md` chi phối *sử dụng* — gói vẫn UNLICENSED). **Không** cài `@cyberskill/react` cho cây này — tên đó thuộc danh mục trang marketing lịch sử, không phải gói này.
- **Danh mục nguồn và phần mở rộng:** Bề mặt CyberSkill trước đây có sáu primitive — `Button`, `TextField`, `Dialog`, `DataTable`, `AIDisclosureBadge`, `HumanReviewGate` — cùng `Logo` thương hiệu. Mọi thành phần khác trong gói **này** là **mở rộng có chủ ý**, dựng bằng vốn token riêng của thương hiệu: `Icon`, các primitive Forms / Feedback / Data / Navigation / Overlays chuẩn, nhóm AI-native (`PromptInput`, `ChatMessage`, `ConfidenceMeter`, `PromptSuggestions`, `TypingIndicator`, `CitationList`) chính thức hóa luồng điều ước Lumi, và linh vật `LumiAvatar`.

---

## Template

Các điểm khởi đầu có thể sao chép cho dự án sử dụng (`templates/<slug>/`, mỗi mẫu nạp hệ thống qua `ds-base.js` cùng cấp):

- **Trang marketing** (`templates/marketing-page/`) — landing song ngữ: hero umber có hộp điều ước `PromptInput`, thẻ dịch vụ, dải quy trình, nút mở chat Lumi.
- **Dashboard** (`templates/dashboard/`) — danh mục kiểu Status Hub: KPI `Stat`, góc nhìn board/bảng bằng `Tabs`, thẻ trạng thái có `ProgressBar` + `Badge` và `DataTable`.
- **Bộ slide** (`templates/slide-deck/`) — deck thương hiệu 16:9: trang đầu + cuối umber, nhấn ochre, bố cục nội dung sáng.
- **Đăng nhập** (`templates/auth/`) — xác thực chia đôi: panel thương hiệu umber + biểu mẫu (`TextField`, `Switch`, `Button`).
- **Cài đặt** (`templates/settings/`) — `Tabs`, trường biểu mẫu, công tắc và vùng nguy hiểm.
- **Khung ứng dụng** (`templates/app-shell/`) — điều hướng `Sidebar`, thanh trên có `SearchField`, KPI `Stat` và `DataTable`.
- **Bài viết** (`templates/article/`) — bài dài: tiêu đề, metadata tác giả, văn bản, khối nhấn `Alert`, `CodeBlock`.
- **Email** (`templates/email/`) — thông báo căn giữa 600px: header umber, CTA ochre, footer.

Mọi template khai báo bộ chọn **Element (Ngũ Hành)** (15 biến thể). Catalog nguồn khai báo <!-- cs-count:templatesWithBooleanControl -->15<!-- /cs-count --> template có ít nhất một control boolean và <!-- cs-count:templatesWithoutBooleanControl -->70<!-- /cs-count --> không có; <!-- cs-count:templatesWithThemeControl -->16<!-- /cs-count --> template khai báo control Theme, còn <!-- cs-count:templatesWithoutThemeControl -->69<!-- /cs-count --> không có. Tài liệu nghiệp vụ in Letter giữ chế độ sáng theo doctrine in.

### Template ấn phẩm đội ngũ

Tài liệu, email, báo cáo và deck `.dc.html` theo bộ phận **Tech, Team, HR, Board, Marketing, Culture, Delivery, Legal, Finance, Sales** (bản nháp cần luật sư có banner đánh dấu):

- **Tech** — `tech-release-notes` (email phát hành), `tech-incident-report` (hậu kiểm sự cố), `tech-rfc` (tài liệu thiết kế).
- **Team** — `team-meeting-agenda` (mục có thời lượng, người phụ trách, nhật ký quyết định, nguyên tắc chung).
- **HR** — `hr-announcement` (email tin đội ngũ; thư mời làm việc, checklist hội nhập và mô tả công việc nằm trong Employment Suite: `vn-offer-letter`, `vn-onboarding-checklist`, `vn-job-description`).
- **Board** — `bod-report` (review quý), `bod-deck` (deck hội đồng 16:9), `bod-memo` (bản ghi nhớ điều hành một trang).
- **Marketing** — `marketing-campaign-brief`, `marketing-newsletter`, `marketing-launch`, `marketing-case-study`, `marketing-press-release`.

### Template nghiệp vụ, pháp lý và bán hàng

Tài liệu Letter sẵn in (`@page` + `@media print`, lề 0.6in) và deck khách hàng:

- **Pháp lý** — `legal-msa` (thỏa thuận dịch vụ tổng thể), `legal-sow` (phạm vi công việc; NDA hai chiều độc lập nằm trong Employment Suite dưới dạng `vn-mutual-nda`).
- **Tài chính** — `finance-invoice` (dòng hàng bằng đồng, VAT, tổng, ngân hàng), `finance-quote` (báo giá theo phạm vi kèm CTA chấp nhận).
- **Bán hàng** — `sales-one-pager` (tài liệu giới thiệu), `sales-proposal-deck` (đề xuất khách hàng 8 slide 16:9).

**Ngôn ngữ template có phạm vi.** Catalog nguồn khai báo <!-- cs-count:templatesWithLanguageControl -->44<!-- /cs-count --> mục có control Language và <!-- cs-count:templatesWithoutLanguageControl -->41<!-- /cs-count --> không có. Tài liệu pháp lý/tài chính có văn bản tiếng Việt dưới dạng **bản nháp chưa review** tại nơi chỉ định; giữ cảnh báo ngôn ngữ điều chỉnh và xin chủ nội dung review trước khi dùng thật.

### Tài liệu tham chiếu (chi phối mọi template)

- **Documents · Style Guide** (`templates/doc-style-guide/`) — chuẩn trình bày (Điều 1–10) cùng **Điều 11 — phạm vi và dạng mẫu**.
- **Documents · Suite Index & Usage Guide** (`templates/doc-suite-index/`) — Phần I lập danh mục theo nhóm; Phần II hướng dẫn vòng đời lao động, quy tắc trình bày và quy trình 8 bước thêm template.
- **Documents · Templates** (`templates/doc-templates/`) — Phần A khung A4 song ngữ trống; Phần B bản đồ dạng mẫu.

### Bộ HR và lao động (khách hàng cung cấp)

Ba mươi tám văn bản A4 song ngữ (**ba mươi bảy** tài liệu Employment Suite cùng khung thương mại **`vn-framework-agreement`**) nằm tại `templates/vn-*/` (xem `docs/hr-suite-sources.md`). Tất cả tuân thủ chuẩn A4 song ngữ ưu tiên tiếng Việt (VN Ink `#1A1614` trên cặp EN nghiêng Slate `#26323A`, header quốc hiệu/tiêu ngữ, thanh tiêu đề bảng umber, chỗ điền vàng, vệ sinh dữ liệu PDPL, khối ký không tách trang). **`vn-labor-contract`** thay thế `legal-employment-contract`, và `vn-mutual-nda` / `vn-offer-letter` / `vn-onboarding-checklist` / `vn-job-description` thay thế `legal-nda` / `hr-offer-letter` / `hr-onboarding` / `hr-job-description`.

- **Lương thưởng và phúc lợi** — `vn-total-rewards-appendix`, `vn-phantom-stock`, `vn-salary-scale`, `vn-compensation-regulation`.
- **Chính sách và quy định** — `vn-internal-labor-regulations`, `vn-disciplinary-schedule`, `vn-performance-evaluation-regulation`, `vn-grassroots-democracy`, `vn-code-of-conduct`, `vn-infosec-policy`, `vn-data-protection-policy`, `vn-remote-work-policy`, `vn-travel-expense-policy`.
- **Tuyển dụng và hồ sơ** — `vn-job-description`, `vn-onboarding-checklist`, `vn-receipt-acknowledgement`, `vn-labour-management-book`, `vn-foreign-employee-pack`, `vn-pdpl-consent`.
- **Đánh giá và đề nghị** — `vn-performance-review-form`, `vn-employee-request`.
- **Quan hệ bên ngoài** — `vn-internship-agreement`, `vn-contractor-agreement`, `vn-sow-appendix`, `vn-mutual-nda`.
- **Khung thương mại / khách hàng** — `vn-framework-agreement` (cần luật sư review).
- **Kỷ luật và chấm dứt** — `vn-disciplinary-case-file`, `vn-resignation-letter`, `vn-certificate-of-employment`, `vn-training-commitment`.

### Bản đồ phạm vi component & dạng mẫu

| Nhóm component | Template sử dụng |
|---|---|
| **Lõi** (Button, Dialog) | marketing-page · auth · settings · sales-one-pager · finance-quote |
| **Biểu mẫu** (TextField, Select, Switch, SearchField…) | auth · settings · app-shell |
| **Dữ liệu và bố cục** (Stat, DataTable, Card, Avatar, Divider) | dashboard · app-shell · bod-report · sales-proposal-deck · hr-announcement |
| **Phản hồi và trạng thái** (Badge, Alert, ProgressBar) | dashboard · bod-report · bod-memo |
| **Điều hướng** (Tabs, Sidebar, NavItem) | dashboard · app-shell · settings |
| **AI-native** (AIDisclosureBadge, PromptInput) | marketing-page · bod-report |
| **Thương hiệu** (Logo, Icon, LumiAvatar) | mọi template |

| Dạng mẫu (`templates/doc-templates`) | Khung | Template |
|---|---|---|
| **Văn bản A4 song ngữ** | Header quốc hiệu/tiêu ngữ · Điều khoản · bảng Bên A/B · khối ký; đủ Style-Guide 1–10 | 38 văn bản A4 `vn-*` |
| **Tài liệu in Letter** | Letter, lề 0.6in, bàn + giấy, Print/PDF gọn | `finance-invoice` · `finance-quote` · `finance-expense-report` · `legal-msa` · `legal-sow` · `sales-one-pager` · tài liệu `bod-*` |
| **Email (600px)** | Nội dung căn giữa, header/CTA hệ thống, không tiêu ngữ/khối ký; song ngữ qua tùy chỉnh Language | `email` · `hr-announcement` · `marketing-newsletter` · `tech-release-notes` · `delivery-status-email` · `finance-dunning-email` |
| **Màn hình sản phẩm** | Component + token; Theme × Element × Language × Style; không hình học in | `marketing-page` · `dashboard` · `app-shell` · `auth` · `settings` · `article` |
| **Deck (16:9)** | Slide 16:9 xếp chồng, bìa umber, accent Ngũ Hành, song ngữ qua Language, in trình duyệt / PPTX phụ thuộc host | `slide-deck` · `bod-deck` · `sales-proposal-deck` · `delivery-qbr-deck` |
| **Ảnh mạng xã hội** | Cỡ cố định theo kênh (1080² · 1200×630 · 1080×1920) | `marketing-social-kit` |

---

## Cấu trúc kho nguồn & UI kit

```
styles.css                 ← single entry point (@import manifest only) · checkout version: see VERSION
tokens/                    fonts · colors · typography · spacing · elevation · motion · component-tokens · elements (Ngũ Hành packs)
base/                      reset · typography · components · forms · feedback · data · navigation · ai · controls · collections · shell · glass · interaction · a11y · responsive
components/                button · textfield · dialog · datatable · forms · feedback · data · navigation · overlays · ai · logo · icon · brand
                           (each Name: Name.jsx + Name.d.ts + Name.prompt.md; one *.card.html per group)
guidelines/                specimen cards (Colors · Type · Spacing · Surfaces · Brand · Motion · Elements · Responsive & Bilingual; default to English, `?language=vi` for Vietnamese) · atomic-view.html
templates/                 marketing-page · dashboard · slide-deck · auth · settings · app-shell · article · email (copyable .dc.html)
                           + team artifacts — tech (release/incident/rfc) · team (meeting-agenda) · hr (announcement) · board (report/deck/memo) · marketing (brief/newsletter/launch/case-study/press-release)
                           + business — legal (vn-mutual-nda / msa / sow; fictional legal-nda retired) · finance (invoice/quote) · sales (one-pager/proposal-deck) — letter print docs + client deck
                           + Documents (reference, govern all templates) — doc-style-guide · doc-suite-index (index & usage) · doc-templates (archetypes)
                           + VN A4 suite — bilingual Employment Suite + commercial framework agreement (`vn-framework-agreement`); counsel review before real use
ui_kits/status-hub/        Status Hub recreation (index · login · settings · project + status.css · data.js · StatusHub.jsx)
ui_kits/website/           cyberskill.world recreation (index · work · careers · chat + site.css · copy.js · Website.jsx)
ui_kits/deck/              brand deck on deck-stage (index.html; deck-stage runtime lives in templates/_vendor/, outside the compiled bundle; browser print; PPTX requires a compatible host exporter)
assets/                    logo-mark.svg/png · favicon.svg · aurora-{tho,hoa,thuy,moc,kim}.webp (+ sample aurora-gold.jpg) · lumi-poster.webp
docs/                      the full doc set (see Document map above) + viewer.html reader (EN|VI)
docs/vi/                   Vietnamese translations of every operator-facing docs/*.md
fonts/                     self-hosted Be Vietnam Pro + Space Grotesk + JetBrains Mono woff2 (latin · latin-ext · vietnamese)
thumbnail.html             project tile
SKILL.md                   Agent-Skills-compatible entry
```

- **Danh mục nguồn VN A4:** có <!-- cs-count:vietnameseInstrumentTemplates -->38<!-- /cs-count --> văn bản song ngữ (`vn-*`), bao phủ Employment Suite và thỏa thuận khung thương mại. Xin luật sư review trước khi dùng thật.
- **UI kit:** **Status Hub** (dashboard danh mục, đăng nhập, cài đặt, chi tiết dự án), **cyberskill.world** (trang marketing song ngữ với chat Lumi, Work, Careers, trợ lý Lumi) và **Deck thương hiệu** (16:9, `deck-stage`, in trình duyệt và hook chụp của host). Xem `README.md` từng kit.
- **Storybook:** hiển thị Components (<!-- cs-count:publicExports -->125<!-- /cs-count --> export — Core, Forms, Data, Feedback, Navigation, Overlays, AI-native, Brand), Foundations, **Templates** (<!-- cs-count:templates -->85<!-- /cs-count --> điểm khởi đầu từ manifest), **Pages** (Status Hub, Website, Deck) và bản phản chiếu Maintainer cho cổng kiểm tra.

---

## Thay thế, kiểm chứng & toolchain

- **Font tự lưu trữ:** Be Vietnam Pro (300–800 + nghiêng), Space Grotesk (biến thiên 300–700) và JetBrains Mono được tự lưu trữ trong `fonts/` dạng WOFF2 chia subset (latin · latin-ext · vietnamese) — không phụ thuộc CDN. `_audit/font-face-integrity.html` kiểm tra nguồn WOFF2 cục bộ, khai báo subset, tương đương manifest, subset tiếng Việt, nạp mẫu và scope display-face.
- **Font display tùy chọn:** `--cs-font-family-display` (Space Grotesk) chỉ kích hoạt khi cây con chọn `.cs-display-face` (`docs/products.md` vẫn khóa).
- **Thang chữ, chuyển động & vai trò tương phản:** `tokens/typography.css` và `tokens/motion.css` cung cấp alias vai trò ngữ nghĩa (`--cs-text-h1`…) và tiện ích `.cs-h1` / `.cs-body` trong `base/typography.css`. Trạng thái ngữ nghĩa cung cấp vai trò nền, chữ ghép cặp (`-fg`) và chữ trên bề mặt (`-text`) riêng. `--cs-accent-on-strong` là chữ ghép cặp cho nền nhấn mạnh (APCA ≥ 75 cho văn bản nội dung và WCAG ≥ 4.5 ở cả hai chế độ; bộ sinh nhắm 78, kiểm chứng bởi `test:strong-text-contrast`).
- **UI kit & catalog tham chiếu:** UI kit là bản tái hiện diện mạo HTML-first với dữ liệu hư cấu. Số lượng khai báo và vai trò tài liệu công khai được sinh trong [catalog tham chiếu](../../../docs/reference-catalog.json).
- **Kiểm chứng tiếp cận:** `_audit/a11y-harness.html` và `npm run test:a11y-harness` kiểm tra tên tiếp cận bằng axe cục bộ được ghim trên Chromium, Firefox và WebKit.
- **Cổng benchmark trình duyệt trực tiếp & chống thoái lui:** `npm run test:audit-regression` (`_audit/ci/verify-audit-benchmarks-browser.mjs`) chấm **129/129** phép kiểm tra trên 20 chiều (`D1`–`D20`) đạt **10.0 / 10**, **64/64** phép kiểm tra cơ sở cốt lõi đạt **10.0 / 10**, **192/192** ô (`≥ 3.0:1`) trong ma trận tương phản phi văn bản 32×6, và **3/3** màn hình phức hợp Generation-2 với **0 watch**. Mực nền nhuộm phạm vi mặc định tối đạt **8.42:1–10.54:1** (`.cs-result__icon` đạt **8.42:1**, `.cs-item.is-selected` đạt **10.54:1** — cả hai đều vượt chuẩn WCAG AAA `7:1`).

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Trước khi chạy các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh này cài fixture npm 11.21.1 đã audit, ghim bằng lockfile, với lifecycle scripts bị tắt. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc chạy `node scripts/npm.mjs ci` và dùng `node scripts/npm.mjs` thay cho `npm` ở các lệnh tiếp theo (`devEngines` từ chối phiên bản npm khác trong kho nguồn; người dùng gói đã phát hành giữ package manager riêng). Xem [hướng dẫn kiểm tra và toolchain](../../../docs/validation.md).
<!-- END PINNED TOOLCHAIN BOOTSTRAP -->

*Chào mừng. Hiện Thực Hoá Ý Chí.*
