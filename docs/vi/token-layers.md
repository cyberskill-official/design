# Lớp token

Primitive → semantic → component → state. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Mô hình

`tokens/layers.json` là bản đồ máy đọc. CSS custom properties vẫn là nguồn runtime. CSS, TypeScript, native, Figma, và docs sinh ra phải khớp `tokens/tokens.dtcg.json` (các gate provenance sẵn có).

| Lớp | Vai trò |
|---|---|
| Primitive | Giá trị literal (hex, px, ms, stack) |
| Semantic | Alias vai trò ổn định khi theme đổi |
| Component | Alias theo component |
| State | Hover, focus, disabled, invalid |

Đừng coi literal `--cs-*` sâu là API công khai. Ưu tiên vai trò semantic.

## Theme provider

`ThemeProvider` (export từ module overlay và `@cyberskill/themes`) gắn `data-theme` (`light` | `dark` | `system`) và `data-cs-contrast` (`normal` | `high`). Gọi `getThemeInitScript()` trong `<head>` để SSR không flash.

High contrast là chuyển theme/contrast — không phải trục sản phẩm thứ năm. Density vẫn nghỉ (`axis-guard`).

## Liên quan

- File lớp: `tokens/layers.json`
- High contrast: `base/high-contrast.css`
- Root scoped: `base/scope.css` và `styles.scoped.css`
