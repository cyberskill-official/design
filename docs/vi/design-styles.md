# Phong cách thiết kế

Các trục styling sống là **Theme × Element × Language × Style**. Pack Style duy nhất hiện tại là **liquid-glass**; khi không có attribute style, pack này được dùng. Phần tử con không có attribute kế thừa phạm vi theme và element gần nhất; root trung tính mặc định sáng với các màu neo thương hiệu studio. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

| Trục | Cách đặt | Thay đổi gì |
|---|---|---|
| **Theme** | `data-theme="light"`, `"dark"` hoặc `"system"`; khi không có attribute, kế thừa phạm vi gần nhất (root trung tính mặc định sáng) | màu semantic sáng/tối (trục UI sản phẩm). Light tường minh đặt lại phạm vi dưới tổ tiên dark. System theo tuỳ chọn sáng/tối của OS; Storybook toolbar và Atomic View có cả ba giá trị |
| **Element** | `data-cs-element` + tùy chọn `data-cs-variant` | bản sắc sản phẩm Ngũ Hành (**15 pack** = 5 element × soft/middle/deep) |
| **Language** | `lang` / Language tweak | nội dung dựng sẵn EN · VI, mặc định tiếng Việt; `ja` tuỳ chọn chỉ là thử nghiệm Pagination có giới hạn, không phải bao phủ tiếng Nhật đầy đủ |
| **Style** | `data-cs-style` (tuỳ chọn; vắng ≡ `liquid-glass`) | Pack vật liệu bề mặt. Sole pack hôm nay: **liquid-glass** (`tokens/styles.css` + `base/glass.css`) |

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

## Pack Style — liquid-glass

- Vật liệu liquid-glass (`cs-surface-*`) là ngôn ngữ bề mặt mặc định.
- Radius, shadow và token kính đến từ `tokens/elevation.css` + `base/glass.css`; hợp đồng trục Style nằm ở [`tokens/styles.css`](../../tokens/styles.css).
- Gate: [`_audit/style-contract.html`](../../_audit/style-contract.html) — allowlist chỉ `liquid-glass`.
- Từ chối theo doctrine: hue neon/cyberpunk lạnh, memphis vui nhộn, skeuomorphism đầy đủ, emoji trong chrome UI.
- Họ chữ cố định và có tên token: Be Vietnam Pro (UI) · Space Grotesk (`--cs-font-family-display`, mặt chữ tiêu đề opt-in) · JetBrains Mono (code). Mặt chữ display là **role một scope có thể chọn dùng** qua `.cs-display-face`, không phải trục sản phẩm.

## Thêm một look mới

Ưu tiên:
1. Tweak cường độ **Element** (offset seed) khi dịch chuyển là hue/bản sắc trong Ngũ Hành.
2. Composition cục bộ với token/class sẵn có khi dịch chuyển là layout một lần.
3. Pattern đã ghi trong `docs/conventions.md` + specimen card khi pattern cần tái sử dụng.
4. Pack **`data-cs-style`** mới chỉ sau Expansion Rule — xem checklist trong [`docs/vi/benchmark-rubric.md`](benchmark-rubric.md). Style tiêu thụ cùng 10 role accent (gồm `on-strong`); không invent pack Element song song.

Không invent trục sản phẩm thứ năm, và không thêm Style pack thứ hai khi chưa đủ checklist Expansion Rule.
