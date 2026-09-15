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

- Chiều rộng 320 px và zoom 400% (WCAG 1.4.10)
- `prefers-reduced-motion: reduce`
- Forced colors / `forced-colors: active`
- In
- RTL (`dir="rtl"`)
- Pseudo-locale `en-XA` / `lang="pseudo"` cho QA giãn chuỗi

CI: `_audit/ci/inclusive-matrix.mjs` cộng harness overflow / zoom / 320 sẵn có. Job `inclusive-matrix` cài Chromium, Firefox, và WebKit. Smoke PR là Chromium; nightly chạy các trình duyệt đã nêu.

## Công nghệ hỗ trợ

AT thủ công vẫn do người review (NVDA, JAWS, VoiceOver, TalkBack, IME). Slot trống không phải pass. Protocol: dialog, menu, combobox, grid, Sortable, Editor, Carousel, và điều khiển ngày/giờ.

WCAG 2.2 AA là baseline tuân thủ bên ngoài. Chữ body nội bộ vẫn dùng APCA Lc ≥ 75.

## Liên quan

- Quality gates: `docs/quality-gates.md`
- Quản trị: `docs/governance.md`
