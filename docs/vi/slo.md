# SLO tiếp cận và hiệu năng

Mức dịch vụ chặn release cho package Stable. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Tiếp cận

- Baseline ngoài: WCAG 2.2 AA
- Chữ body nội bộ: APCA Lc ≥ 75
- Không vi phạm axe critical trên story Stable trong CI
- Không regression bàn phím hoặc landmark critical trên inclusive matrix
- Giao thức AT thủ công (`docs/at-protocol.md`) được ghi trước khi nâng Stable

## Hiệu năng

Ngân sách nằm ở `docs/package-budgets.json` và làm fail CI khi vượt.

- Mục tiêu p95 tương tác: dưới 100 ms cho Button / TextField / Dialog open, đo trên `@cyberskill/react` đã compile (`_audit/high-risk-at.html` và product hosts)
- React entry (`_esm/react.mjs`) và `dist/styles.min.css` dưới trần byte đã công bố
- Tarball workspace gầy loại templates, `_audit/`, và JSX thô

## Adoption

Council theo dõi uptake production ngoài repo. Bằng chứng trong repo: `docs/adoption-ledger.json` cùng `apps/product-fixtures/render.mjs` (`@cyberskill/react` / `@cyberskill/tokens` đã compile) và `docs/governance-review.json` (token-drift = 0, tỉ lệ migration deprecation). Hook telemetry vẫn là `reportAdoption` từ `@cyberskill/primitives` (opt-in `globalThis.CS_TELEMETRY`). Mục tiêu: ≥80% sản phẩm đã đăng ký dùng package Stable trong hai quý. Không invent traffic live ngoài repo.

## Liên quan

- Telemetry: `docs/telemetry.md`
- Ma trận hỗ trợ: `docs/support-matrix.md`
- Topology package: `docs/package-topology.md`
