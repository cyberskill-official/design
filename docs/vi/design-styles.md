# Phong cách thiết kế

Các trục styling sống là **Theme × Element × Language × Style**. Trục Style có hai pack vật liệu bề mặt: **liquid-glass** (mặc định; khi không có attribute style, pack này được dùng) và **matte-paper** (bề mặt giấy mờ đặc sắc nét, không làm mờ nền). Phần tử con không có attribute kế thừa phạm vi theme và element gần nhất; root trung tính mặc định sáng với các màu neo thương hiệu studio. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

| Trục | Cách đặt | Thay đổi gì |
|---|---|---|
| **Theme** | `data-theme="light"`, `"dark"` hoặc `"system"`; khi không có attribute, kế thừa phạm vi gần nhất (root trung tính mặc định sáng) | màu semantic sáng/tối (trục UI sản phẩm). Light tường minh đặt lại phạm vi dưới tổ tiên dark. System theo tuỳ chọn sáng/tối của OS qua `prefers-color-scheme`; Storybook toolbar và Atomic View có cả ba giá trị |
| **Element** | `data-cs-element` + tùy chọn `data-cs-variant` | bản sắc sản phẩm Ngũ Hành (**15 pack** = 5 element × soft/middle/deep) |
| **Language** | `lang` / Language tweak | nội dung dựng sẵn EN · VI (`vi` mặc định trên các bề mặt UI); `ja` chỉ là thử nghiệm i18n nội bộ cho Pagination, không phải tùy chọn trên thanh công cụ UI |
| **Style** | `data-cs-style` (tuỳ chọn; vắng ≡ `liquid-glass`) | Pack vật liệu bề mặt: **liquid-glass** (kính mờ quang học mặc định) · **matte-paper** (bề mặt giấy mờ đặc sắc nét, `tokens/styles.css` + `base/glass.css`) |

## Hợp đồng màu Element

Nguồn sự thật: [`tokens/element-seeds.json`](../../tokens/element-seeds.json) → `npm run tokens:generate` → [`tokens/elements.css`](../../tokens/elements.css) (+ JSON / JS / DTCG / native). **Không sửa hex pack bằng tay.**

| Rule | Chi tiết |
|---|---|
| **Mặc định** | Root không có attribute dùng bảng màu studio trung tính với ochre logo `#F4BA17`. `data-cs-element="tho"` tường minh chọn Thổ **middle** (studio), có bảng màu đầy đủ khác trung tính. Phần tử con không có attribute kế thừa phạm vi element gần nhất |
| **Thang cường độ** | Mỗi element có **soft · middle · deep** với mục tiêu L OKLCH dùng chung (C scale theo element). Middle là mặc định (không `data-cs-variant`) |
| **Giữ tên** | Variant công khai vẫn `sand/clay`, `plasma/lava`, `mist/ocean`, `bamboo/forest`, `titanium/steel` — map lên thang (xem cột Slot trong [`docs/vi/products.md`](products.md)) |
| **Offset tính cách** | `dh`/`dc` nhỏ, tường minh trong seed (ví dụ Hỏa·plasma, Kim·steel) — không drift tay |
| **Light ↔ dark** | Cùng họ hue (Δh khóa); remap role + giải APCA — 15 × 2 = **30 bộ màu** |
| **Rule chữ** | Dùng nền `-bright` hoặc `-tint`, hoặc nền `-strong` đi cặp với `--cs-accent-on-strong` cho chữ thân; không dùng mid-tone `-accent` phía sau chữ |
| **Không bao giờ remap** | Chỉ báo focus tổ hợp (viền text-primary + hào quang ochre) · màu semantic status |
| **Gate hình học** | [`_audit/element-geometry.html`](../../_audit/element-geometry.html) — sync cường độ · tách variant · khóa hue |

## Các pack Style — liquid-glass & matte-paper

- **liquid-glass** (`cs-surface-*`, mặc định khi vắng `data-cs-style`) là ngôn ngữ bề mặt kính mờ quang học.
- **matte-paper** (`data-cs-style="matte-paper"`) tắt làm mờ nền, chuyển `.cs-surface-*` và `.cs-card` / `.cs-dialog` / `.cs-drawer` / `.cs-popover__panel` / `.cs-menu__list` sang nền đặc `--cs-color-surface-panel` / `--cs-color-surface-raised` với viền liền `1px` `--cs-color-border-default` và độ nổi phẳng (`--cs-shadow-xs`), phù hợp cho trình soạn thảo pháp lý/biên tập, bảng ERP dày dữ liệu và War-Room; phạm vi con `[data-cs-style="liquid-glass"]` khôi phục hiệu ứng kính mờ.
- Radius, shadow và token kính đến từ `tokens/elevation.css` + `base/glass.css`; hợp đồng trục Style nằm ở [`tokens/styles.css`](../../tokens/styles.css).
- Gate: [`_audit/style-contract.html`](../../_audit/style-contract.html) — allowlist `liquid-glass` và `matte-paper`.
- Từ chối theo doctrine: hue neon/cyberpunk lạnh, memphis vui nhộn, skeuomorphism đầy đủ, emoji trong chrome UI.
- Họ chữ cố định và có tên token: Be Vietnam Pro (UI) · Space Grotesk (`--cs-font-family-display`, mặt chữ tiêu đề opt-in) · JetBrains Mono (code). Mặt chữ display là **role một scope có thể chọn dùng** qua `.cs-display-face`, không phải trục sản phẩm.

## Thêm một look mới

Ưu tiên:
1. Tweak cường độ **Element** (offset seed) khi dịch chuyển là hue/bản sắc trong Ngũ Hành.
2. Composition cục bộ với token/class sẵn có khi dịch chuyển là layout một lần.
3. Pattern đã ghi trong `docs/conventions.md` + specimen card khi pattern cần tái sử dụng.
4. Pack **`data-cs-style`** mới chỉ sau Expansion Rule — xem checklist trong [`docs/vi/benchmark-rubric.md`](benchmark-rubric.md). Style tiêu thụ cùng 10 role accent (gồm `on-strong`); không invent pack Element song song.

Không invent trục sản phẩm thứ năm, và không thêm Style pack chưa rà soát khi chưa đủ checklist Expansion Rule.

## Công tắc theme nội bộ

Bộ phân giải theme chuẩn được `scripts/generate-element-packs.mjs` sinh vào `tokens/elements.css`. Hai custom property riêng tư `--_cs-light` và `--_cs-dark` chọn một nhánh trong khai báo như `color: var(--_cs-light, var(--cs-color-brand-umber))var(--_cs-dark, var(--cs-color-brand-ochre));`. Hai phép thế được nối liền, không có khoảng trắng trong stylesheet: khoảng trắng còn lại khi kênh không dùng là rỗng và khiến `background` cùng `border-color` giữ màu đã dùng trước đó. Công tắc có giá trị `initial` làm `var()` dùng fallback; công tắc rỗng không đóng góp giá trị. Theme sáng đặt công tắc sáng thành `initial` và công tắc tối rỗng; theme tối đảo ngược. `data-theme="system"` khai báo tường minh theo `prefers-color-scheme`.

Consumer chọn `data-theme="light|dark|system"` và dùng token công khai `--cs-*`. Không đặt trực tiếp công tắc riêng tư, sao chép khối phân giải được sinh, hoặc đăng ký các công tắc này bằng `@property`: hành vi giá trị rỗng/không hợp lệ là một phần của bộ phân giải nội bộ. Binding được lặp tại ranh giới scope để thay đổi element và theme lồng nhau tính lại giá trị, thay vì kế thừa giá trị đã chọn của cha. Hậu duệ không đánh dấu kế thừa scope bao quanh.

Bảo trì generator nguồn rồi chạy `npm run tokens:generate` và `npm run tokens:check`; không sửa riêng CSS đã sinh. Các kiểm tra scope theme của component và token mode trên ba engine hiện có kiểm tra theme lồng nhau cùng hai tùy chọn hệ điều hành. Công tắc này là chi tiết triển khai, không phải trục hay token công khai bổ sung.


## Mật độ và vai trò khoảng cách công khai

`data-cs-density="compact"` thu gọn Button, chỉ số `.cs-field__control` dùng chung (TextField, Textarea, Select, NativeSelect, Mentions), và nhịp điệu khung chứa của `.cs-card`, `.cs-table`, `.cs-dialog`, `.cs-field`, `.cs-review-gate`, `.cs-alert`, `.cs-toast`, `.cs-tag`, `.cs-tab`, `.cs-menu`, `.cs-stat` và `.cs-divider` (có đặt lại cho `[data-cs-density="comfortable"]` lồng bên trong). Mức tối thiểu `>= 44px` của vùng bấm cho con trỏ thô vẫn được giữ nghiêm ngặt. `data-cs-contrast="high"` (và `prefers-contrast: more`) tăng cường tương phản cho token chữ/viền cùng các ô nhập biểu mẫu, viền tấm kính và đường kẻ ô bảng/datagrid.

Chỉ thay giá trị trực tiếp bằng token khoảng cách khi chúng biểu đạt cùng một vai trò bố cục. Các sửa đổi hiện tại xác minh hình học không đổi và tác động thực tế khi thay token cho control và bố cục collection. Độ dày viền, cỡ chữ, hình học cố định và vùng bấm không tự động là ứng viên cho token khoảng cách. Vì vậy, thống kê `px` đo số giá trị, không đo số lỗi.

Các utility công khai, gồm alias kebab bổ sung và tên cũ được giữ lại, tiếp tục được hỗ trợ kể cả khi stylesheet dùng chung không tham chiếu trực tiếp. Đồ thị tham chiếu trong kho không xác định được cách sản phẩm bên ngoài sử dụng chúng. Thống kê này không đánh dấu ngừng dùng hay xóa token nào; việc xóa phải tuân thủ chính sách thông báo. Bố cục compact rộng hơn cần chỉ số vai trò rõ ràng và xác minh viewport/vùng bấm tương ứng trước khi áp dụng.
