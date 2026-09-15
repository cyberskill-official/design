# Ma trận hỗ trợ

Trình duyệt, engine, công nghệ hỗ trợ, và nhịp refresh. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Engine

`package.json` `engines.node` là `>=20`. Consumer nên ở hai dòng Node LTS Active/Maintenance mới nhất. CI host dùng Node 22; npm publish dùng Node 24.

## Browserslist

`browserslist` đã publish:

- 2 phiên bản Chrome mới nhất
- 2 phiên bản Edge mới nhất
- 2 phiên bản Firefox mới nhất
- 2 phiên bản Safari mới nhất
- iOS >= 16
- Android >= 13

Không hỗ trợ: Internet Explorer, Opera Mini, Edge pre-Chromium, và trình duyệt không có CSS custom properties.

Refresh danh sách này mỗi quý (hội đồng review). Review gần nhất: **2026-09-15**. Review kế **2026-12-15**. Ghi ngày trong `docs/decisions.md` khi ma trận đổi.

## Môi trường nghiệm thu

Coi những case sau là nghiệm thu, không phải demo tùy chọn:

- Chiều rộng 320 px, zoom 200%, và zoom 400% (WCAG 1.4.10)
- `prefers-reduced-motion: reduce`
- Forced colors / `forced-colors: active`
- In
- RTL (`dir="rtl"`)
- Pseudo-locale `en-XA` / `lang="pseudo"` cho QA giãn chuỗi

CI: `_audit/ci/inclusive-matrix.mjs` chạy 320 px, zoom 200% và 400%, viewport mobile 390 px, forced-colors, reduced-motion, RTL, và `en-XA`, cộng harness overflow / zoom / 320 sẵn có. Job `inclusive-matrix` cài Chromium, Firefox, và WebKit. Smoke PR là Chromium; nightly chạy các trình duyệt đã nêu. Gallery Action-9 (`test-high-risk-at.mjs`) lặp 200% và 400% trên `#ax-gallery`.

## Công nghệ hỗ trợ

AT thủ công vẫn do người review (NVDA, JAWS, VoiceOver, TalkBack, IME). Slot trống không phải pass. Protocol: dialog, menu, combobox, grid, Sortable, Editor, Carousel, và điều khiển ngày/giờ.

WCAG 2.2 AA là baseline tuân thủ bên ngoài. Chữ body nội bộ vẫn dùng APCA Lc ≥ 75.

## Ánh xạ WCAG 2.2 AA

Mỗi tiêu chí gắn một gate máy. Ô AT-RUN trống không phải pass trình đọc màn hình.

| Tiêu chí | Gate |
|---|---|
| 1.4.3 / 1.4.6 Contrast | `_audit/contrast-guard.html`, `scripts/generate-contrast-report.mjs`, doctrine APCA Lc ≥75 |
| 1.4.11 Non-text contrast | contrast-guard, `@cyberskill/themes/high-contrast`, forced-colors trong `inclusive-matrix.mjs` |
| 2.4.7 / 2.4.11 Focus appearance | `base/a11y.css` `:focus-visible`, `_audit/a11y-gate.html` |
| 2.5.5 / 2.5.8 Target size | `base/a11y.css` sàn 44px |
| 1.4.10 Reflow | 320 px + 200% + 400% trong `inclusive-matrix.mjs` và `test-high-risk-at.mjs`; `_audit/zoom-text-spacing.html` |
| 1.4.12 Text spacing | `_audit/zoom-text-spacing.html` |
| 2.1.1 Keyboard / 2.4.3 Focus order | `_audit/a11y-gate.html`, `_audit/high-risk-at.html` |

## Khả năng CSS

Trình duyệt ngoài ma trận này không được hỗ trợ. Feature cần prefix hoặc fallback nằm ở đây; `_audit/ci/test-inclusive-matrix.mjs` và `inclusive-matrix.mjs` khóa nguồn và probe runtime `CSS.supports`.

| Feature | Chính sách | Fallback |
|---|---|---|
| Custom properties | Bắt buộc. Trình duyệt không có `--cs-*` nằm ngoài ma trận. | Không — fail closed. |
| `@layer` | `packages/tokens/dist/tokens.css` xếp `primitive, semantic, component, state`. | Last-wins không layer không phải runtime được hỗ trợ. |
| `color-mix()` | Wash tiến bộ (aurora / overlay). | `background-color` đặc / `--cs-color-*` vẫn còn. |
| `backdrop-filter` | Bề mặt glass trong `base/glass.css`. | `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` dùng `--cs-color-surface-panel`. |
| `-webkit-backdrop-filter` | Đi cặp với property chuẩn cho Safari. | Cùng fallback `@supports`. |
| Container queries | Reflow host ở 320 px / zoom 200% / 400%. | Layout khối; không clip ngang (inclusive-matrix). |

## Liên quan

- Quality gates: `docs/quality-gates.md`
- Quản trị: `docs/governance.md`
