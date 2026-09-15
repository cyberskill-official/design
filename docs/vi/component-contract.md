# Hợp đồng component

Checklist mọi component Stable phải đạt. Dùng trang này làm template tài liệu Storybook. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Cấu trúc trang Stable

Mọi trang story/docs component Stable gồm:

1. Anatomy
2. Usage / do / don’t
3. States
4. Content
5. Keyboard và hành vi AT
6. Token
7. Responsive / RTL / dark / high-contrast
8. Code
9. SSR
10. Ghi chú migration
11. Trạng thái design / độ chín (từ `docs/export-registry.json`)

## Hợp đồng runtime

- Phần tử host đúng ngữ nghĩa (button, a, input, dialog — không `div` bấm được mà thiếu role)
- `forwardRef` trên mọi export công khai tương tác (bỏ qua provider). Button vẫn là implementation tham chiếu; `_audit/ci/test-component-contracts.mjs` fail cả tập nếu thiếu host.
- Quy tắc controlled / uncontrolled được ghi
- Chính sách slot / children
- Mô hình event và bàn phím
- Khôi phục focus cho overlay (`useOverlayLayer`)
- Khóa localization trong `components/_i18n/strings.js`
- RTL qua `dir` trên `ThemeProvider` hoặc ancestor
- Trạng thái responsive
- SSR: không `document` ở module scope; theme boot qua `getThemeInitScript`
- Metadata deprecation trong export registry
- Tương thích API được test hợp đồng phủ

## Widget rủi ro cao

Editor, Image preview, Sortable, Carousel, và dialog có test thêm trong `_audit/ci/test-component-contracts.mjs` và `_audit/ci/test-trusted-html.mjs`.

## Liên quan

- HTML tin cậy: `docs/trusted-html.md`
- Quản trị: `docs/governance.md`
- Lớp token: `docs/token-layers.md`
