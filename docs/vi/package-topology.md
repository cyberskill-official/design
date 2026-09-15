# Topology package

Tách workspace và facade tương thích `@cyberskill/design`. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Workspace

```
packages/tokens        @cyberskill/tokens
packages/primitives    @cyberskill/primitives (focus, overlay, sanitizer, collection/roving)
packages/react         @cyberskill/react
packages/themes        @cyberskill/themes
packages/icons         @cyberskill/icons
packages/templates     @cyberskill/templates
packages/eslint        @cyberskill/eslint-plugin
packages/codemods      @cyberskill/codemods
apps/storybook         docs host (không phải install runtime)
apps/consumer-canary   smoke React 18/19 + SSR
```

Root `@cyberskill/design` vẫn là tên cài trong cửa sổ migration sáu tháng. Sản phẩm mới nên import `@cyberskill/react` + `@cyberskill/tokens` (`dist/` đã compile, không JSX thô, không template). ESM từng component nằm trên export kebab như `@cyberskill/react/button` (`dist/` đã compile); deep `@cyberskill/react/components/*` vẫn không có trên export map và phải fail. Consumer facade không transpile JSX thì dùng `@cyberskill/design/stable`. Entry mặc định facade vẫn re-export JSX nguồn cho bundler cũ và ghi chú deprecation trên mô tả package. `@cyberskill/themes` ship pack high-contrast, registry 15 brand pack ngũ hành, và `applyBrandPack`; CSS của các pack đó vẫn nằm ở `@cyberskill/tokens/css`.

## Ngân sách

`docs/package-budgets.json` cộng `_audit/ci/test-package-budgets.mjs` chặn regression size. Snapshot trend thủ công nằm ở `docs/package-budget-trends.json` (không tự ghi mỗi `test:unit`). Package workspace gọn không được ship template, runtime compiler, hoặc fixture `_audit/`. Facade vẫn gồm cây portable cho consumer hiện có.

## Changeset

`.changeset/` ghi semver theo package. Khóa release (`scripts/release-bind.mjs`) từ chối npm publish khi tag, `VERSION`, SHA HEAD, và digest tarball không khớp.

## Liên quan

- Tiêu thụ: `docs/consuming.md`
- Phát hành: `docs/release-runbook.md`
- Quản trị: `docs/governance.md`
