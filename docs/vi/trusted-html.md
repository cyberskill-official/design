# HTML tin cậy và chính sách sanitizer

Hợp đồng enterprise cho `Editor`, `Logo`, và bề mặt rich-text sau này. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Ranh giới tin cậy

`Editor` coi `defaultValue` / `value` là **không tin cậy**. `sanitizeHtml` trong `components/_utils/sanitize-html.js` gỡ script, event handler, ngữ cảnh duyệt nhúng, và URL `javascript:` / `data:` / `blob:`. Scheme được phép: `http`, `https`, `mailto`, `tel`, cộng path tương đối.

Đừng bypass sanitizer bằng `dangerouslySetInnerHTML` trong code sản phẩm.

## Logo

`Logo` inject **path SVG do repo kiểm soát** (`CS_LOGO_MARK_INNER`) cộng title đã escape. Pattern đó là markup tĩnh tin cậy, không phải sink HTML người dùng. Đã ghi trên component.

## Hướng dẫn CSP

Consumer nên giữ `script-src` không có `unsafe-eval`. HTML do người dùng soạn nên render trong CSP cấm chạy script ở subtree đó. Package design system vốn là tĩnh.

## Liên quan

- Test: `_audit/ci/test-trusted-html.mjs`
- Hợp đồng component: `docs/component-contract.md`
- Notices: `THIRD-PARTY-NOTICES.md`
