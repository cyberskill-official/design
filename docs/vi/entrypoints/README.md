# Hệ thống thiết kế toàn cầu CyberSkill

> **Turn Your Will Into Real — Hiện Thực Hoá Ý Chí**

[![Design System Gates](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml)

## Bắt đầu tại đây

Đây là **tài liệu điểm vào** của CyberSkill Design System — VERSION của bản nguồn **<!-- cs-source-version:checkout -->1.7.2<!-- /cs-source-version -->** (xem `VERSION`; không xác nhận phiên bản có trên registry). **Trang sản phẩm** là Storybook tại **`/`** trên `design.cyberskill.world` (chỉ trên host; cục bộ: `npm run storybook`). Tài liệu vận hành được công bố ở thanh bên **Docs** của Storybook (và Thư viện tài liệu tại `/docs/viewer.html`). Đường dẫn cũ `/dashboard`, `/dashboard.html` và `/playground/*` chuyển hướng đến `/`. Hệ thống ấm áp, ưu tiên tiếng Việt, đáp ứng môi trường doanh nghiệp; mọi bề mặt giải quyết bốn trục độc lập — **Theme** (light · dark · system) × **Element** (bản sắc sản phẩm Ngũ Hành: Kim · Mộc · Thủy · Hỏa · Thổ, 15 biến thể) × **Language** (EN · VI) × **Style** (`data-cs-style` — gói duy nhất **liquid-glass**; không khai báo ≡ mặc định).

**Bắt đầu nhanh theo đối tượng**
- **Nhà thiết kế** — mở Storybook (**Foundations / Components / Templates / Pages / Docs**). **Templates** liệt kê toàn bộ <!-- cs-count:templates -->85<!-- /cs-count --> điểm khởi đầu (Gallery → Atomic View, cùng story theo nhóm, gồm bộ 38 tài liệu VN A4 (Employment Suite + khung thương mại) tại **Templates → HR**). Đổi trực tiếp Theme × Element × Language × Style qua thanh công cụ Storybook, Atomic View và mẫu Elements Geometry.

- **Soạn template trình duyệt** (máy chủ HTTP tĩnh) — đọc `SKILL.md` (chọn runtime + ràng buộc thiết kế), rồi hướng dẫn bên dưới; phối hợp `styles.css` + ESM đã biên dịch `@cyberskill/design` (`dist/esm/_esm/react.mjs`; JSX thô qua `@cyberskill/design/source`) / `_esm/cs.mjs` cũ / `_ds_bundle.js` (tìm theo tiền tố). `support.js` được cung cấp thông dịch `*.dc.html` trong trình duyệt; xem `docs/template-grammar.md` về ngữ pháp và ranh giới chỉ ở host. Hợp đồng component nằm cạnh từng component (`.d.ts` + `.prompt.md`).

- **Tĩnh / open-spec** (ví dụ Google Stitch) — bắt đầu từ **`DESIGN.md`** (open-spec được sinh) → `llms.txt` → `tokens/tokens.dtcg.json`. Dựng giao diện **tĩnh** bằng `styles.css` + `.cs-*` / kitchen-sink / `examples/static-hello/`. Dùng `.dc.html` qua trình thông dịch được cung cấp hoặc công cụ hiểu ngữ pháp; công cụ HTML thuần dùng `.cs-*` hoặc ảnh chụp kết quả hiển thị đã kiểm chứng.

- **Người triển khai** — gói npm ổn định đã công bố **`@cyberskill/design@1.7.2`** (xem `docs/consuming.md`; quyền dùng trong `docs/consumer-grant.md` — vẫn UNLICENSED). **Next/SSR:** `import { Button } from "@cyberskill/design"` (peer React). **Demo trình duyệt:** **`examples/npm-hello/`** (Lumi · Hỏa · plasma, `_esm/cs.mjs` cũ). Hoặc liên kết **`styles.css`** từ clone/subtree (một tệp cho toàn bộ), hoặc chép thư mục `templates/<slug>/` và sửa một dòng trong `ds-base.js` (đổi liên kết một dòng, được kiểm định đầu cuối tháng 7/2026). Xác định scope bằng `data-theme` · `data-cs-element` (+`data-cs-variant`) · `lang`. Dấu hiệu bản phát hành: SHA đầu nhánh + `docs/release-notes.md` (VERSION nguồn là **<!-- cs-source-version:release-signal -->1.7.2<!-- /cs-source-version -->**; không có CHANGELOG).

- **Người bảo trì** — `docs/doctrine.md` (mở rộng + kiểm chứng), rồi `CONTRIBUTING.md` và `docs/quality-gates.md`.

**Bản đồ tài liệu — phía sử dụng** (cũng có trên Storybook **Docs**)

| Tài liệu | Nội dung giải đáp |
|---|---|
| `README.md` (tệp này, bên dưới) | Hướng dẫn đầy đủ: màu neo, giọng điệu, nền tảng thị giác, component, template, mục lục |
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

**Bản đồ tài liệu — người bảo trì** (CI, quyết định, cổng kiểm tra — không phải nhập môn phía sử dụng)

| Tài liệu | Nội dung giải đáp |
|---|---|
| `docs/doctrine.md` | Quy tắc mở rộng, độ sâu kiểm chứng, bất biến (tệp host như `CLAUDE.md` là cầu nối) |
| `docs/decisions.md` | Quyết định chủ sở hữu đã ghi nhận + công việc bảo trì còn mở |
| `docs/ci-cd.md` | Tự động hóa CI/CD — workflow GitHub Actions, bộ chạy cổng headless, kiểm tra trước nguồn gốc token, badge |
| `docs/quality-gates.md` | Tham chiếu chuẩn đo — từng cổng chất lượng, assertion, tiêu chí đạt, nơi chạy |
| `docs/sync.md` | Độ trung thực vòng đi-về giữa kho ↔ môi trường soạn thảo và đồng bộ hai chiều |

---

Hệ thống thiết kế ấm áp, phù hợp doanh nghiệp, **ưu tiên tiếng Việt** cho **CyberSkill** — studio phần mềm Sài Gòn (thành lập 2020), biến *điều ước* rõ ràng thành phần mềm hoạt động. Neo ở **Umber** và **Ochre**, được **Lumi**, thần đèn vàng, dẫn dắt. Dự án đóng gói token, component, tài sản thương hiệu và bản tái hiện sản phẩm của CyberSkill để agent có thể thiết kế ấn phẩm đúng thương hiệu và giao diện sản xuất.
Phía sử dụng liên kết một tệp: **`styles.css`**.

## Nguồn

**Kho nguồn này** (`cyberskill-official/design`) là nguồn chuẩn của hệ thống thiết kế: token, component React, tài sản thương hiệu, template và cổng kiểm tra đều ở đây.

Các kho CyberSkill liên quan (không ở cây này — tham khảo độ trung thực sản phẩm/marketing):
- **Trang marketing** (Next.js, song ngữ, thần đèn Lumi, bộ icon nội bộ): https://github.com/cyberskill-official/landing-page
- **Khung audit** (công cụ được tham chiếu): https://github.com/cyberskill-official/design-system-audit-framework

**[`DESIGN.md`](../../../DESIGN.md) trong kho này** là bề mặt open-spec được sinh (kiểu Google Stitch: doctrine thương hiệu, mọi giá trị token sáng + tối, danh mục component/template). Tệp được dựng từ `tokens/tokens.dtcg.json` + `_ds_manifest.json` bằng `npm run build:design-md`. Không bao giờ sửa tay; cổng `design-md-parity` ghim từng byte với nguồn token. Đây không phải tệp doctrine thượng nguồn riêng.

---

## Bất biến nền tảng (không bao giờ thay đổi)

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

## NỀN TẢNG NỘI DUNG

**Giọng điệu là hợp âm bốn trục vang đồng thời:** *ấm áp · trực tiếp · trung thực · tôn trọng.* Không bao giờ “vui nhộn/tinh nghịch/gai góc” — các giọng này được xác định rõ là lệch thương hiệu.

- **Ấm áp, có tính người, ngôi thứ hai.** Gọi người đọc là “bạn”; studio là “chúng tôi”. Lumi xưng “tôi”. Lời văn dịu dàng, khuyến khích, không sáo ngữ doanh nghiệp. Ví dụ *“Rất vui. Tôi nên gọi bạn là gì?”*, *“Chiếc đèn đang nghỉ một chút.”*
- **Trực tiếp và cụ thể.** Câu ngắn, kết quả rõ, không nói tránh. Ví dụ *“Gửi một lời nhắn ngắn. Chúng tôi trả lời trong một ngày làm việc.”*, *“Được xây để bàn giao và bền vững.”*
- **Trung thực về đánh đổi.** Thương hiệu đề cao sự thẳng thắn: *“giàu kinh nghiệm, nhỏ gọn và trung thực về đánh đổi.”* Rủi ro được nói bằng lời, không giấu hay chỉ biểu thị bằng màu.

- **Tôn trọng đồng thuận và riêng tư.** Hỏi trước khi liên hệ; cam kết không chia sẻ. Ví dụ *“Thông tin của bạn đến thẳng đội ngũ. Chúng tôi không bao giờ chia sẻ.”*
- **Ẩn dụ “điều ước” là trục chính.** Sản phẩm là *điều ước*; Lumi (thần đèn vàng) *hiện thực hóa* bằng cách chuyển đến đội ngũ con người thật. Động từ: *ước, hiện thực hóa, định hình, bàn giao, bền vững*. Dùng ấm áp, không làm trò.

**Viết hoa và quy cách:** Viết hoa đầu câu cho tiêu đề và nút (*“Ước một điều”*, *“Kể chúng tôi nghe điều ước của bạn”*). CHỮ HOA + giãn ký tự rộng chỉ cho dòng dẫn nhỏ/nhãn/tiêu đề bảng. Tiêu đề không có dấu câu cuối; nội dung dùng dấu chấm. Số viết bằng chữ số (*“một ngày làm việc”* trong văn xuôi được chấp nhận, nhưng *“3 ngày làm việc”* cho SLA cụ thể). Dùng gạch ngang dài cho ý phụ.

**Song ngữ (ưu tiên tiếng Việt):** Mỗi chuỗi hướng người dùng có bản EN + VN hoặc ghi chú hoãn rõ ràng. Tiếng Việt là thành phần chính, không phải dịch bổ sung sau — giữ dấu ở mọi nơi (*Nguyễn Hoàng Vũ*, *Hiện Thực Hoá Ý Chí*). Line-height an toàn cho tiếng Việt (nội dung 1.5 / tiêu đề 1.35) dành chỗ cho dấu chồng.

**Emoji:** **Không dùng** trong giao diện sản phẩm hay lời văn thương hiệu. Ý nghĩa được truyền bằng chữ và bộ icon nét, không dùng emoji. (Linh vật và glyph “điều ước” sparkle đảm nhận sắc thái cảm xúc.)

---

## NỀN TẢNG THỊ GIÁC

**Bảng màu — đất ấm, không lạnh.** Umber `#45210E` làm nền tảng mọi thứ (chính là màu chữ chính); Ochre `#F4BA17` là accent duy nhất — CTA trên nền tối, vòng tiêu điểm, nhấn sáng, thần đèn. Bề mặt là giấy ấm: page `#FFFDF8`, panel `#FFFFFF`, raised `#FBF4E9`. Mọi màu trung tính ngả về umber — viền `#E7D9C6`, chữ mờ `#3F2D21`. Màu ngữ nghĩa (success `#166534`, danger `#B42318`, warning `#92400E`, info `#1D4ED8`) dùng tiết chế và không bao giờ là tín hiệu duy nhất. **Tối đa một accent trên mỗi bề mặt** — lõi dùng Ochre; *sản phẩm* có thể thay bằng accent Ngũ Hành (xem Bản sắc Ngũ Hành bên dưới), không thêm sắc thứ hai cạnh nó. Không dùng gradient tím xanh.

**Chữ.** UI: **Be Vietnam Pro** (300–800; họ Google ưu tiên tiếng Việt) — mặc định mọi bề mặt, gồm tiêu đề. Display/tiêu đề lớn: **Space Grotesk** (biến thiên 300–700), font **tùy chọn** của `--cs-font-family-display`; không thành phần nào trỏ đến nó trước khi scope chọn `.cs-display-face`, chuyển `--cs-heading-family` và giữ nội dung ở font UI. Mã/dữ liệu: **JetBrains Mono**. Tiêu đề display đậm (800 ở font UI; trong `.cs-display-face`, Space Grotesk tối đa 700 nên 800 bị giới hạn trong họ này), giãn ký tự chặt (−0.02em); nội dung 400/500 ở 1.5. Dòng dẫn chữ hoa giãn 0.08–0.12em. Thang cỡ xs 12 → 5xl 60 trên nền 16px.

**Khoảng cách và bố cục.** Lưới cơ sở 4px; padding section từ 64 đến 96px; max-width nội dung khoảng1200–1320px. Khoảng trắng rộng, bình tĩnh.

**Góc và thẻ.** Bán kính: sm 4, md 8 (mặc định), **lg 14 (thẻ/panel)**, full 999 (pill, input, chip). Thẻ mặc định = panel trắng, viền ấm 1px `#E7D9C6`, bán kính14px, bóng ấm mềm. Không dùng thẻ có viền trái màu.

**Bề mặt — Liquid Glass (cách xử lý mặc định).** Năm vật liệu trên các màu neo: **Whisper** (lớp phủ hero), **Light** (nav/sidebar), **Standard** (thẻ trên hình), **Heavy** (modal/popover), **Solid** (nội dung dày, bảng). Kính = độ trong `color-mix` + blur/saturate `backdrop-filter` + gradient viền thấu kính1px. Đây là cơ chế **tùy chọn và cộng thêm** — áp dụng lớp `cs-surface-*` sau khi kiểm tra APCA với nền sau; nội dung dày giữ Solid. Chuyển sang đặc dưới `prefers-reduced-transparency`, `forced-colors`, khi in và trên trình duyệt không hỗ trợ.

**Bóng** ấm, ngả umber (`rgba(69,33,14,…)`), thang mềm năm mức từ đường mảnh `xs` đến độ nổi hộp thoại `xl`. Không xám, không gắt.

**Chiều sâu** là thang z tường minh gắn với các tầng kính: bg 0 → section 5 → card 10 → nav 50 → dropdown 60 → overlay 80 → modal 100 → toast 200.

**Nền và hình ảnh** phát sáng từ trong: nền umber đậm với **ánh hạt vàng ấm** (`aurora-tho.webp`), không lạnh hay phẳng — mỗi hành có lớp phủ riêng (`assets/aurora-{tho,hoa,thuy,moc,kim}.webp`, qua lớp phủ `.cs-aurora-wash`; Thổ dùng vàng chính thức). Ảnh mang tông ấm. Section umber tràn mép neo hero, dải tuyển dụng và footer; trên umber, khẩu hiệu Ochre và nội dung trắng truyền tải thông điệp. Linh vật **Lumi** là thần đèn vàng bóng trên nền trong suốt.

**Bản sắc sản phẩm Ngũ Hành.** Studio thuộc **Thổ/Earth** (Umber + Ochre — màu vàng đất truyền thống); mỗi *sản phẩm* CyberSkill có thể mang một hành — **Kim** (metal) · **Mộc** (wood) · **Thủy** (water) · **Hỏa** (fire) · **Thổ** (earth) — qua `data-cs-element` (+ `data-cs-variant`, ví dụ Hỏa: ember · lava · plasma). Mỗi gói đặt mười token vai trò **`--cs-accent-*`** (accent / strong / bright / on / on-strong / tint / ink / glow / grad-a / grad-b) trong `tokens/elements.css`; trong scope, hành nhận đầy đủ vai trò accent của Ochre. Không bao giờ theo hành: trạng thái ngữ nghĩa và **chỉ báo tiêu điểm kết hợp** (viền text-primary + quầng ochre) — dấu ấn tiếp cận của studio trên mọi sản phẩm. Phối theo chu kỳ: hành phụ chỉ được xuất hiện ở điểm cuối gradient dọc **Tương sinh** (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc); cặp **Tương khắc** không bao giờ trộn. Ánh xạ sản phẩm→hành nằm trong `docs/products.md`. **Mọi template có tùy chỉnh Element** — phần theo hành sản phẩm phải dùng `--cs-accent-*`, không dùng hex thô. **Lumi giữ màu vàng trong mọi hành** — thần đèn là hằng số của studio; chỉ môi trường đổi sắc.

**Xử lý bề mặt.** Liquid-glass cố định. Bề mặt giải quyết **Theme × Element × Language × Style** độc lập.

**Chuyển động** bình tĩnh và có mục đích: thời lượng ngắn (120–320ms), giảm tốc mềm `cubic-bezier(0.2,0,0,1)`, dịch/co giãn nhỏ và mờ dần (ví dụ linh vật hero nổi nhẹ). Không nảy, không chớp. Với `prefers-reduced-motion`, cơ chế an toàn toàn cục giảm animation và transition xuống0.01ms, tắt cuộn mượt; từng component có thể tắt animation hoàn toàn.

**Trạng thái tương tác.** Hover: sáng thêm khoảng8% (nền tô) hoặc tô `surface-raised` (nhẹ). Nhấn: dịch0.5–1px. Tiêu điểm: giữ **chỉ báo kết hợp** — viền text-primary2px và quầng Ochre theo `docs/doctrine.md`; quy tắc component giữ viền thấy được khi chỉ báo nằm bên trong hoặc do wrapper hiển thị. Nút, range, checkbox và radio native giữ diện mạo trình duyệt và dự phòng quầng Ochre khi box shadow bị tắt. Hiển thị disabled theo hợp đồng từng component. Vùng chạm ≥44px trên con trỏ thô.

**Độ trong và độ mờ** chỉ có trên bề mặt kính và ô nhập điều ước ở hero — có chủ ý, có dự phòng — không dùng làm trang trí.

---

## HỆ BIỂU TƯỢNG

CyberSkill **không kèm thư viện icon bên ngoài**. Hệ thống dùng **bộ icon nét nhỏ trong kho** (từ trang marketing, `TASK-DS-010`): mỗi icon là dữ liệu (viewBox + đường nét nguyên thủy), hiển thị qua một component `<Icon>`. Kiểu: **icon nét, stroke `currentColor`, độ dày1.75, đầu/nối bo tròn, viewBox24×24** — icon theo token chữ xung quanh, đổi màu bằng `color`. Kích thước từ `--cs-icon-sm|md|lg` (16/20/24).
Bộ gồm: `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off`, mở rộng ở v2.0 với `search · sliders · upload · download · calendar · user · plus · trash · external · menu`, và v2.13 với `chevron-down/up/left/right · edit · copy · info · alert-triangle` (cùng ngữ pháp, đánh dấu phần mở rộng). `sparkle` là glyph **“điều ước”** của thương hiệu. **Không emoji**, không icon ký tự unicode trong UI sản phẩm. Ngoại lệ với “icon nét” là **biểu trưng thương hiệu** (`Logo`) và linh vật **Lumi**, vốn là hình tô đặc.
Tài sản sao chép nằm trong `assets/`: `logo-mark.svg` / `logo-mark.png` (bản gốc chính thức, nền Umber + thần đèn Ochre), `favicon.svg`, `aurora-tho.webp` (lớp hero vàng ấm; `aurora-gold.jpg` giữ làm ảnh mẫu), `lumi-poster.webp` (linh vật thần đèn vàng). **Logo là tệp gốc thật — không bao giờ dựng lại, đổi màu hay mô phỏng;** với tenant bên thứ ba, thay bằng logo riêng của tenant.
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

Điểm nổi bật: **Button** — primary Umber; biến thể primary/secondary/tertiary/ghost/danger/danger-ghost; cỡ xs–lg; loading, icon, fullWidth. **TextField / Textarea / Select / NativeSelect** dùng chung khung `.cs-field` (nhãn + mô tả/lỗi; an toàn dấu/IME). **DataTable** — caption, header có scope, render theo cột, nhóm trạng thái idle/loading/error/empty. **Card** — panel ấm + header/body/footer. **Logo** hiển thị đúng biểu trưng chính thức; **Icon** điều khiển bộ icon nét nội bộ. Họ **AI-native** mang doctrine giải trình của thương hiệu — công bố, review của con người, thu nhận điều ước và độ tin cậy, đều diễn đạt bằng lời (không chỉ màu).

**Cài đặt / tên gói.** Tên gói là **`@cyberskill/design`** (VERSION bản nguồn **<!-- cs-source-version:package-source -->1.7.2<!-- /cs-source-version -->**; quyền trong `docs/consumer-grant.md` chi phối *sử dụng* — gói vẫn UNLICENSED). **Không** cài `@cyberskill/react` cho cây này — tên đó thuộc danh mục trang marketing lịch sử, không phải gói này.

**Danh mục nguồn và phần mở rộng.** Bề mặt CyberSkill trước đây có sáu primitive — `Button`, `TextField`, `Dialog`, `DataTable`, `AIDisclosureBadge`, `HumanReviewGate` — cùng `Logo` thương hiệu. Mọi phần khác trong gói **này** là **mở rộng có chủ ý**, dựng bằng vốn token riêng của thương hiệu để phía dùng có bộ công cụ hoàn chỉnh: `Icon` (bộ icon nét nội bộ thực của trang marketing), các primitive Forms / Feedback / Data / Navigation / Overlays chuẩn (tìm kiếm, bước, slider, tải tệp, danh sách, danh sách mô tả, dòng thời gian, accordion, kbd, khối mã, sidebar, steps, command palette, popover, drawer và hơn nữa), phần AI-native thêm vào (`PromptInput`, `ChatMessage`, `ConfidenceMeter`, `PromptSuggestions`, `TypingIndicator`, `CitationList`) chính thức hóa luồng điều ước Lumi, và linh vật `LumiAvatar`. Không phần nào tạo ngôn ngữ thị giác mới — tất cả dùng lại màu neo, bề mặt, chữ và chuyển động đã định nghĩa.

---

## Template

Các điểm khởi đầu có thể sao chép cho dự án sử dụng (bộ chọn **Templates** — thay các “điểm khởi đầu” theo component cũ). Mỗi mẫu nằm trong `templates/<slug>/` dưới dạng Design Component, nạp hệ thống qua `ds-base.js` cùng cấp.

- **Trang marketing** (`templates/marketing-page/`) — landing song ngữ: hero umber có hộp điều ước `PromptInput`, thẻ dịch vụ, dải quy trình, nút mở chat Lumi.

- **Dashboard** (`templates/dashboard/`) — danh mục kiểu Status Hub: KPI `Stat`, góc nhìn board/bảng bằng `Tabs`, thẻ trạng thái có `ProgressBar` + `Badge` và `DataTable`.

- **Bộ slide** (`templates/slide-deck/`) — deck thương hiệu16:9: trang đầu + cuối umber, nhấn ochre, bố cục nội dung sáng.

- **Đăng nhập** (`templates/auth/`) — xác thực chia đôi: panel thương hiệu umber + biểu mẫu (`TextField`, `Switch`, `Button`).

- **Cài đặt** (`templates/settings/`) — `Tabs`, trường biểu mẫu, công tắc và vùng nguy hiểm.

- **Khung ứng dụng** (`templates/app-shell/`) — điều hướng `Sidebar`, thanh trên có `SearchField`, KPI `Stat` và `DataTable`.

- **Bài viết** (`templates/article/`) — bài dài: tiêu đề, metadata tác giả, văn bản, khối nhấn `Alert`, `CodeBlock`.

- **Email** (`templates/email/`) — thông báo căn giữa600px: header umber, CTA ochre, footer.

Mọi template khai báo bộ chọn **Element (Ngũ Hành)** (15 biến thể). Catalog nguồn khai báo <!-- cs-count:templatesWithBooleanControl -->15<!-- /cs-count --> template có ít nhất một control boolean và <!-- cs-count:templatesWithoutBooleanControl -->70<!-- /cs-count --> không có; control hành vi thay đổi theo template. <!-- cs-count:templatesWithThemeControl -->16<!-- /cs-count --> template khai báo control Theme, còn <!-- cs-count:templatesWithoutThemeControl -->69<!-- /cs-count --> không có. Số lượng mô tả control được khai báo; kiểm tra trạng thái thực và hành vi in của sản phẩm chọn. Tài liệu nghiệp vụ in Letter vẫn chỉ sáng theo doctrine in.

### Template ấn phẩm đội ngũ

Tài liệu, email, báo cáo và deck có thương hiệu theo bộ phận — mỗi mẫu là `.dc.html` sao chép được, dùng token hệ thống, markup thương hiệu và component chọn lọc. Nhiều tài liệu chỉ import Logo; markup không tự động được phối từ component React. Các nhóm gồm **Tech, Team, HR, Board, Marketing, Culture, Delivery, Legal, Finance, Sales** — bản đồ vận hành đầy đủ (nghiên cứu phạm vi tháng7/2026). Bản nháp cần luật sư (PIP, nghị quyết hội đồng, hợp đồng lao động VN) có **banner đánh dấu**: bắt buộc review pháp lý/HR trước khi dùng thật.

- **Tech** — `tech-release-notes` (email phát hành), `tech-incident-report` (hậu kiểm không đổ lỗi: dòng thời gian + bảng hành động), `tech-rfc` (tài liệu thiết kế: đề xuất, đánh đổi, triển khai).

- **Team** — `team-meeting-agenda` (mục có thời lượng, người phụ trách, nhật ký quyết định, nguyên tắc chung).

- **HR** — `hr-announcement` (email tin đội ngũ). *(Thư mời làm việc, checklist hội nhập và mô tả công việc nay ở Employment Suite do khách hàng cung cấp bên dưới: `vn-offer-letter`, `vn-onboarding-checklist`, `vn-job-description`.)*
- **Board** — `bod-report` (review quý: KPI, bảng danh mục, rủi ro, công bố hỗ trợ AI), `bod-deck` (deck hội đồng16:9 — slide xếp chồng, kiểu in trình duyệt và chụp PPTX phụ thuộc host), `bod-memo` (bản ghi nhớ điều hành một trang, một yêu cầu).

- **Marketing** — `marketing-campaign-brief` (mục tiêu, đối tượng, kênh, chỉ số), `marketing-newsletter` (email số “The Lamp”), `marketing-launch` (thông báo ra mắt sản phẩm), `marketing-case-study` (hero kết quả, số liệu chứng minh, trích dẫn — sẵn in), `marketing-press-release` (dòng ngày, giới thiệu chuẩn, liên hệ báo chí — sẵn in).

### Template nghiệp vụ, pháp lý và bán hàng

Tài liệu Letter sẵn in và deck khách hàng — giấy tờ studio thực sự gửi đi. Tài liệu pháp lý/tài chính dùng khổ Letter với khối `@page` + `@media print`, nên **File → Print / Save as PDF** phân trang gọn với lề0.6in; trên màn hình là tờ giấy ấm trên bàn.

- **Pháp lý** — `legal-msa` (thỏa thuận dịch vụ tổng thể — khung cho SOW: định nghĩa, IP, phí, trách nhiệm, thời hạn), `legal-sow` (phạm vi công việc: bảng sản phẩm bàn giao/mốc, phí, nghiệm thu, ký duyệt). *(NDA hai chiều độc lập nay ở Employment Suite dưới dạng `vn-mutual-nda` do khách hàng cung cấp.)*
- **Tài chính** — `finance-invoice` (bên thanh toán/phát hành, dòng hàng bằng đồng, VAT, tổng, ngân hàng), `finance-quote` (ước tính theo phạm vi, phần thêm tùy chọn, hạn hiệu lực, CTA chấp nhận).

- **Bán hàng** — `sales-one-pager` (tài liệu để lại: hero umber, dịch vụ, số liệu chứng minh, quy trình điều ước, CTA liên hệ), `sales-proposal-deck` (đề xuất khách hàng8slide16:9 — điều ước, hiểu biết, cách tiếp cận, phạm vi, tiến độ, đội ngũ, đầu tư, bước tiếp).

**Ngôn ngữ template có phạm vi.** Catalog nguồn khai báo <!-- cs-count:templatesWithLanguageControl -->44<!-- /cs-count --> mục có control Language và <!-- cs-count:templatesWithoutLanguageControl -->41<!-- /cs-count --> không có. Tài liệu xếp chồng tĩnh và nội dung đổi ngôn ngữ là hai hợp đồng khác nhau. Tùy chọn ngôn ngữ được khai báo không chứng nhận bản dịch đầy đủ hay chính xác; kiểm tra template chọn, nội dung nguồn và kiểm tra ngôn ngữ áp dụng. Nội dung bên gọi cung cấp vẫn do bên gọi chịu trách nhiệm dịch. Tài liệu pháp lý/tài chính có văn bản tiếng Việt dưới dạng **bản nháp chưa review** tại nơi chỉ định; giữ cảnh báo ngôn ngữ điều chỉnh và xin chủ nội dung review trước khi dùng thật.

### Tài liệu tham chiếu (chi phối MỌI template)

Ba tài liệu tham chiếu toàn bộ xác định và lập danh mục thư viện template — pháp lý, HR, tài chính, bán hàng, giấy tờ khách hàng và truyền thông ưu tiên EN. Chúng ở `templates/doc-*/` và tự in thành tài liệu A4 song ngữ:
- **Documents · Style Guide** (`templates/doc-style-guide/`) — chuẩn trình bày: bảng màu, thang chữ, quy tắc song ngữ Ink/Slate, bảng, chỗ điền, ô đánh dấu, khối ký, vệ sinh dữ liệu, header/footer (Điều1–10 từ nguồn khách hàng đã ghi nhận; đồng nhất toàn văn hiện tại cần so sánh nguồn), cùng **Điều11 — phạm vi và dạng mẫu**, ánh xạ quy tắc A4 sang Letter, email, màn hình sản phẩm, deck và mạng xã hội.

- **Documents · Suite Index & Usage Guide** (`templates/doc-suite-index/`) — Phần I lập danh mục theo nhóm (bộ HR, pháp lý, tài chính, bán hàng, sản phẩm, truyền thông); Phần II hướng dẫn dùng (vòng đời lao động, tài liệu có hiệu lực kỷ luật, tám quy tắc trình bày và quy trình8bước “thêm template mới”).

- **Documents · Templates** (`templates/doc-templates/`) — Phần A là khung A4 song ngữ trống (header, khối tiêu đề, điều khoản mẫu, Bên A điền sẵn / Bên B để trống, khối ký); Phần B là bản đồ dạng mẫu (A4 · Letter · email · màn hình sản phẩm · deck · mạng xã hội) kèm ví dụ từng họ.

### Bộ HR và lao động (khách hàng cung cấp)

Ba mươi tám văn bản A4 song ngữ (**ba mươi bảy** tài liệu Employment Suite do khách hàng cung cấp, cộng khung thương mại **`vn-framework-agreement`**) (dựng trên phiên bản hệ thống trước) đã được **chuyển từng tài liệu thành template và cập nhật giao diện theo hệ thống thiết kế mới nhất**. Danh mục nguồn Word ghi nhận và fixture văn bản chuẩn hóa được giữ mô tả trong `docs/hr-suite-sources.md`; bộ kiểm tra cụm từ hiện tại không xác lập đồng nhất toàn bộ điều khoản hay nguồn Word hiện tại. Chúng thuộc nhóm **HR Suite** (`templates/vn-*/`), theo chuẩn ở ba tài liệu tham chiếu trên: **A4, song ngữ ưu tiên tiếng Việt** (VN Ink `#1A1614` trên cặp EN nghiêng Slate `#26323A`), header quốc hiệu/tiêu ngữ, thanh tiêu đề bảng umber, chỗ điền vàng, vệ sinh dữ liệu PDPL (Bên B luôn trống), khối ký không bị tách. Mỗi mẫu có tùy chỉnh Element (15) như mọi template; không có tùy chỉnh ngôn ngữ (vốn đã song ngữ). Vì là văn bản khách hàng cung cấp (giữ nguyên nội dung; luật sư phải review trước khi dùng thật), **`vn-labor-contract` thay `legal-employment-contract` hư cấu trước đây**, còn `vn-mutual-nda` / `vn-offer-letter` / `vn-onboarding-checklist` / `vn-job-description` thay `legal-nda` / `hr-offer-letter` / `hr-onboarding` / `hr-job-description` hư cấu (đều đã bỏ); template hư cấu còn lại là truyền thông ưu tiên EN (thông báo, newsletter, thông cáo) và giấy tờ bán hàng/tài chính khách hàng — mục đích khác nên giữ.

- **Lương thưởng và phúc lợi** — `vn-total-rewards-appendix`, `vn-phantom-stock`, `vn-salary-scale`, `vn-compensation-regulation`.

- **Chính sách và quy định** — `vn-internal-labor-regulations`, `vn-disciplinary-schedule`, `vn-performance-evaluation-regulation`, `vn-grassroots-democracy`, `vn-code-of-conduct`, `vn-infosec-policy`, `vn-data-protection-policy`, `vn-remote-work-policy`, `vn-travel-expense-policy`.

- **Tuyển dụng và hồ sơ** — `vn-job-description`, `vn-onboarding-checklist`, `vn-receipt-acknowledgement`, `vn-labour-management-book`, `vn-foreign-employee-pack`, `vn-pdpl-consent`.

- **Đánh giá và đề nghị** — `vn-performance-review-form`, `vn-employee-request` (nghỉ phép · đồng ý làm thêm · khác).

- **Quan hệ bên ngoài** — `vn-internship-agreement`, `vn-contractor-agreement`, `vn-sow-appendix`, `vn-mutual-nda`.

- **Khung thương mại / khách hàng (giao diện VN A4, không phải lao động)** — `vn-framework-agreement` (Hợp đồng nguyên tắc — dịch vụ phần mềm và cấp tài khoản; mẫu Ban QLDA Bình Quới; cần luật sư review).

- **Kỷ luật và chấm dứt** — `vn-disciplinary-case-file` (4phần A→D), `vn-resignation-letter`, `vn-certificate-of-employment` (cố ý trung tính), `vn-training-commitment`.

Các văn bản này có nguồn gốc do khách hàng cung cấp đã ghi nhận. Bộ kiểm tra cụm từ hiện tại không xác lập đồng nhất toàn văn hay sự chấp thuận của chủ nội dung; giữ nguyên nội dung và xin luật sư review trước khi dùng thật hoặc cập nhật nguồn.

### Bản đồ phạm vi component

Cách template sử dụng thư viện component — mỗi nhóm được ít nhất một điểm khởi đầu bao phủ:
| Nhóm component | Template sử dụng |
|---|---|
| **Lõi** (Button, Dialog) | marketing-page · auth · settings · sales-one-pager · finance-quote |
| **Biểu mẫu** (TextField, Select, Switch, SearchField…) | auth · settings · app-shell |
| **Dữ liệu và bố cục** (Stat, DataTable, Card, Avatar, Divider) | dashboard · app-shell · bod-report · sales-proposal-deck · hr-announcement |
| **Phản hồi và trạng thái** (Badge, Alert, ProgressBar) | dashboard · bod-report · bod-memo |
| **Điều hướng** (Tabs, Sidebar, NavItem) | dashboard · app-shell · settings |
| **AI-native** (AIDisclosureBadge, PromptInput) | marketing-page · bod-report |
| **Thương hiệu** (Logo, Icon, LumiAvatar) | mọi template |

Markup thô (điều khoản đánh số, bảng hóa đơn, dòng mốc) trong tài liệu pháp lý/tài chính/bộ HR được phối từ token + tiện ích chữ `.cs-*`, có chủ ý, thay vì component — đây là tài liệu, không phải UI ứng dụng. Khung của chúng do ba tài liệu tham chiếu (Style Guide · Suite Index & Usage Guide · Templates) xác định, không phải thư viện component.

### Bản đồ phạm vi dạng mẫu

Mỗi template thuộc một trong sáu dạng mẫu, được đóng khung bởi `templates/doc-templates`:
| Dạng mẫu | Khung | Template |
|---|---|---|
| **Văn bản A4 song ngữ** | Header quốc hiệu/tiêu ngữ · Điều khoản · bảng Bên A/B · khối ký; đủ Style-Guide1–10 | 38văn bản A4 `vn-*` |
| **Tài liệu in Letter** | Letter, lề0.6in, bàn + giấy, Print/PDF gọn | `finance-invoice` · `finance-quote` · `finance-expense-report` · `legal-msa` · `legal-sow` · `sales-one-pager` · tài liệu `bod-*` |
| **Email (600px)** | Nội dung căn giữa, header/CTA hệ thống, không tiêu ngữ/khối ký; song ngữ qua tùy chỉnh Language | `email` · `hr-announcement` · `marketing-newsletter` · `tech-release-notes` · `delivery-status-email` · `finance-dunning-email` |
| **Màn hình sản phẩm** | Component + token; Theme × Element × Language × Style; không hình học in | `marketing-page` · `dashboard` · `app-shell` · `auth` · `settings` · `article` |
| **Deck (16:9)** | Slide16:9 xếp chồng, bìa umber, accent Ngũ Hành, song ngữ qua Language, in trình duyệt / PPTX phụ thuộc host | `slide-deck` · `bod-deck` · `sales-proposal-deck` · `delivery-qbr-deck` |
| **Ảnh mạng xã hội** | Cỡ cố định theo kênh (1080² · 1200×630 · 1080×1920) | `marketing-social-kit` |

---

## Mục lục / manifest

```
styles.css                 ← single entry point (@import manifest only) · checkout version: see VERSION
tokens/                    fonts · colors · typography · spacing · elevation · motion · component-tokens · elements (Ngũ Hành packs)
base/                      reset · typography · components · forms · feedback · data · navigation · ai · controls · collections · shell · glass · interaction · a11y · responsive
components/                button · textfield · dialog · datatable · forms · feedback · data · navigation · overlays · ai · logo · icon · brand
                           (each Name: Name.jsx + Name.d.ts + Name.prompt.md; one *.card.html per group)
guidelines/                specimen cards (Colors · Type · Spacing · Surfaces · Brand · Motion · Elements · Responsive & Bilingual) · atomic-view.html
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

Danh mục nguồn VN A4 có <!-- cs-count:vietnameseInstrumentTemplates -->38<!-- /cs-count --> văn bản song ngữ (`vn-*`), bao phủ Employment Suite và thỏa thuận khung thương mại. Xin luật sư review trước khi dùng thật.

**UI kit** (bản tái hiện sản phẩm, phối token + lớp `.cs-*`): **Status Hub** (dashboard danh mục — KPI, góc nhìn board/bảng/bản phát hành, drawer — cùng **đăng nhập**, **cài đặt**, **chi tiết dự án**). Demo trục trực tiếp: thanh công cụ Storybook · Atomic View · mẫu Elements Geometry, **cyberskill.world** (trang marketing song ngữ với chat Lumi — cùng **Work**, **Careers** và **trợ lý Lumi** toàn trang), **deck thương hiệu** (16:9, `deck-stage`, in trình duyệt và hook chụp của host). Xem `README.md` từng kit.

**Storybook** hiển thị mọi card: Components (<!-- cs-count:publicExports -->125<!-- /cs-count --> export — Core, Forms, Data, Feedback, Navigation, Overlays, AI-native, Brand), Foundations (Colors, Type, Spacing, Surfaces, Brand, Motion, Responsive & Bilingual, **Elements**), **Templates** (<!-- cs-count:templates -->85<!-- /cs-count --> điểm khởi đầu từ manifest, gồm HR Suite / VN A4), **Pages** (Status Hub, Website, Deck), cùng bản phản chiếu Maintainer cho cổng kiểm tra.

---

## Thay thế và lưu ý

- **Font:** Be Vietnam Pro (300–800 + nghiêng), Space Grotesk (biến thiên300–700) và JetBrains Mono **tự lưu trữ** trong `fonts/` dạng woff2 chia subset (latin · latin-ext · vietnamese) — không phụ thuộc CDN. Các họ khai báo khớp bản tái hiện sản phẩm ghi nhận. `_audit/font-face-integrity.html` kiểm tra nguồn WOFF2 cục bộ, khai báo subset, tương đương manifest, subset tiếng Việt mỗi họ thương hiệu, nạp mẫu và scope display-face. Không xác lập hiển thị giống hệt sản phẩm khác, mọi glyph hay độ trung thực font của tệp xuất.

- **Font display là tùy chọn, không phải mặc định thứ hai.** `--cs-font-family-display` (Space Grotesk) để sản phẩm có font tiêu đề — cyberskill.world / Lumi — dùng token DS thay vì tự tạo `@font-face`. Không phần nào của DS trỏ đến nó: chọn cho cây con bằng `.cs-display-face`. Ánh xạ sản phẩm → hành không ảnh hưởng (`docs/products.md` vẫn khóa).

- **Thang cỡ chữ và token chuyển động** là quy ước cục bộ xây trên doctrine, được cung cấp trong `tokens/typography.css` và `tokens/motion.css`. Nguồn chữ ghi nguồn gốc họ/line-height tách khỏi quy ước cỡ, độ đậm, icon cục bộ. Thang cũng có alias vai trò ngữ nghĩa (`--cs-text-h1`…) và tiện ích `.cs-h1` / `.cs-body` / … trong `base/typography.css`.

- **UI kit là bản tái hiện diện mạo** — dữ liệu hư cấu, tương tác nông, lớp3D/thần đèn sản xuất của trang marketing không được tái tạo (nền HTML-first được tái tạo).

*Chào mừng. Hiện Thực Hoá Ý Chí.*

Số lượng khai báo và vai trò tài liệu công khai hiện tại được sinh trong [catalog tham chiếu](../../../docs/reference-catalog.json). Chúng mô tả danh mục và thẩm quyền nguồn, không phải nghiệm thu của con người hay năng lực runtime.

Cổng fixture tiếp cận (`_audit/a11y-harness.html`) kiểm tra tên tiếp cận thực tế bằng axe cục bộ được ghim và danh mục20control tường minh. `npm run test:a11y-harness` thử tên lỗi, tham chiếu, fixture và lỗi engine audit trên Chromium, Firefox, WebKit. Các kiểm tra bao phủ tên fixture và quy tắc CSS khai báo; lời đọc của trình đọc màn hình và nghiệm thu con người vẫn riêng biệt.

Trạng thái ngữ nghĩa cung cấp vai trò nền, chữ ghép cặp (`-fg`) và chữ trên bề mặt (`-text`) riêng. Dùng vai trò chữ cho thông điệp/nhãn trên page/panel/raised. Trang in trắng cố định dùng scope Light tường minh với màu chữ chính riêng; trang thích ứng theo theme chọn.

`--cs-accent-on-strong` là chữ ghép cặp cho nền nhấn mạnh, đạt APCA75 nội dung và WCAG4.5 ở cả hai chế độ. Bộ sinh nhắm78; xem báo cáo tương phản và `test:strong-text-contrast` về phạm vi khai báo.

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh này cài fixture npm11.21.1 đã audit, ghim bằng lockfile, với lifecycle scripts bị tắt; chạy được từ npm đi kèm Node và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc chạy `node scripts/npm.mjs ci` và dùng `node scripts/npm.mjs` thay `npm` cho các lệnh sau. `devEngines` của nguồn từ chối phiên bản npm khác. Người dùng gói đã phát hành giữ package manager riêng; ràng buộc này không phải hook vòng đời cài đặt. Xem [hướng dẫn kiểm tra và toolchain](../../../docs/validation.md).

Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh cài fixture npm11.21.1 có lockfile đã audit, tắt lifecycle scripts và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc dùng `node scripts/npm.mjs ci`; các lệnh sau dùng `node scripts/npm.mjs` thay cho `npm`. `devEngines` chỉ ràng buộc dự án nguồn; người dùng gói đã phát hành giữ package manager của họ. [Hướng dẫn kiểm tra và toolchain](../../../docs/vi/validation.md).
<!-- END PINNED TOOLCHAIN BOOTSTRAP -->
