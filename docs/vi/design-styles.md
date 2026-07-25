# Phong cách thiết kế

Xử lý bề mặt hiện tại là **liquid-glass** (cố định). Các trục styling sống là **Theme × Element × Language** thôi.
| Trục | Cách đặt | Thay đổi gì |
|---|---|---|
| **Theme** | light = không có attribute; `data-theme="dark"` | màu semantic sáng/tối (trục UI sản phẩm). Ở tầng token, `data-theme="system"` theo OS (`prefers-color-scheme`) và mirror dark — không phải giá trị enum UI sản phẩm / Identity Lab / template |
| **Element** | `data-cs-element` + tùy chọn `data-cs-variant` | bản sắc sản phẩm Ngũ Hành (15 pack) |
| **Language** | `lang` / Language tweak | bản sao EN · VI |

## Xử lý cố định

- Vật liệu liquid-glass (`cs-surface-*`) là ngôn ngữ bề mặt mặc định.

- Radius, shadow và token kính đến từ hệ base — không phải trục "style pack" song song.

- Từ chối theo doctrine: hue neon/cyberpunk lạnh, memphis vui nhộn, skeuomorphism đầy đủ, emoji trong chrome UI.

- Họ chữ cố định và có tên token: Be Vietnam Pro (UI) · Space Grotesk (`--cs-font-family-display`, mặt chữ tiêu đề opt-in) · JetBrains Mono (code). Mặt chữ display là **role một scope có thể chọn dùng** qua `.cs-display-face`, không phải trục thứ tư — mặc định nó không đổi gì và không mapping sản phẩm nào phụ thuộc vào nó.

## Thêm một look mới

Ưu tiên:
1. **Element** hoặc **variant** mới khi dịch chuyển là hue/bản sắc.
2. Composition cục bộ với token/class sẵn có khi dịch chuyển là layout một lần.
3. Pattern đã ghi trong `docs/conventions.md` + specimen card khi pattern cần tái sử dụng.

Không invent trục sản phẩm thứ tư nếu chưa Expansion Rule qua tokens, Storybook Live, templates, docs và gates.
