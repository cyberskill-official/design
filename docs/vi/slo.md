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

- Mục tiêu p95 tương tác: dưới 100 ms cho Button / TextField / Dialog open trên canary
- React entry (`_esm/react.mjs`) và `dist/styles.min.css` dưới trần byte đã công bố
- Tarball workspace gầy loại templates, `_audit/`, và JSX thô

## Adoption

Council theo dõi uptake sản phẩm ngoài repo. Hook trong repo: `reportAdoption` từ `@cyberskill/primitives` (opt-in `globalThis.CS_TELEMETRY`). Mục tiêu: ≥80% sản phẩm CyberSkill dùng package Stable trong hai quý. Repo này không invent inventory đó; nó xuất bản sink và SLO.

## Liên quan

- Telemetry: `docs/telemetry.md`
- Ma trận hỗ trợ: `docs/support-matrix.md`
- Topology package: `docs/package-topology.md`
