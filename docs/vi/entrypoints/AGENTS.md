# AGENTS.md

Điểm vào dùng chung của hệ thống thiết kế: [SKILL.md](../../../SKILL.md). Đọc tài liệu này về lựa chọn runtime, thẩm quyền nguồn và giới hạn năng lực trước khi theo hướng dẫn thiết kế cho từng tác vụ.

Doctrine của hệ thống thiết kế: [docs/doctrine.md](../../../docs/doctrine.md). Khi làm việc trong kho nguồn, dùng phạm vi tác vụ của người dùng, hồ sơ kiểm chứng gắn với nguồn và các kiểm tra npm/trình duyệt đã được ghi nhận.

## Hướng dẫn và danh mục được sinh

`docs/doctrine.md` vẫn là quy phạm. Sửa phần chính sách hoặc metadata định tuyến trong `scripts/guidance-source.json`, rồi chạy `node scripts/generate-guidance.mjs`; dùng `--check` để chỉ kiểm tra độ mới. Lệnh cập nhật hợp đồng máy đọc và các khối host do nó quản lý. Phần sửa tay bên ngoài khối được sinh vẫn là nội dung tự soạn. Chạy `node _audit/ci/test-portable-guidance.mjs` để kiểm tra thẩm quyền và các phép thử đột biến làm suy yếu quy tắc.

Nhóm/thành phần phối hợp trong README và liên kết export của Atomic View được dẫn xuất từ `_ds_manifest.json` và các Atomic story thực tế được soạn. Sau thay đổi catalog hoặc story, chạy `node scripts/generate-component-inventory.mjs`, rồi `node scripts/generate-atomic-story-index.mjs`; cả hai có `--check`. Bộ sinh danh mục giữ nguyên renderer và controls được soạn, không tự đặt cấp bậc component.

## Thiết lập kho nguồn có tính di động

Đây là hệ thống thiết kế tĩnh, ưu tiên HTML (Node 22, npm). Không có máy chủ ứng dụng hay cơ sở dữ liệu — “ứng dụng” gồm (a) sân thử **Storybook** và (b) kho nguồn thô **được phục vụ tĩnh**, cùng bảng cổng `_audit/*.html`. Không có npm script `lint`; kiểm tra tĩnh tương đương là bảng audit và các bước kiểm tra độ mới bằng Node bên dưới.

Dịch vụ và cách chạy (lệnh chuẩn nằm trong `package.json` / `.github/workflows/design-system-gates.yml`):

- **Máy chủ phát triển Storybook** — `npm run storybook` (phục vụ tại `http://127.0.0.1:6006`). Đây là bề mặt tương tác chính để duyệt component/template và chỉnh trực tiếp qua bảng Controls.
- **Bảng audit tĩnh** — phục vụ thư mục gốc, ví dụ `node scripts/npm.mjs run verify:serve` (cổng 8765), rồi mở `http://127.0.0.1:8765/_audit/run.html`. Chạy headless bằng `node _audit/ci/run-gates.mjs http://127.0.0.1:8765/_audit/run.html`.
- **Kiểm thử đơn vị/hợp đồng** — `npm run test:unit`.

Các điểm dễ bỏ sót:

- **Cần Playwright Chromium, Firefox và WebKit** cho toàn bộ bộ kiểm thử `npm run test:unit`. Cài bằng `npx playwright install --with-deps chromium firefox webkit`; bảng nhanh và so sánh pixel dùng Chromium. Audit font và máy chủ tĩnh cục bộ cũng dùng Python 3; xem `docs/quality-gates.md`.
- Máy chủ tĩnh được duy trì giữ đường dẫn `.html`; dùng URL bảng tường minh khi kiểm tra cục bộ và CI.
- **Cổng cứng “Pixel CI” thất bại ở checkout mới** cho tới khi chạy `node _audit/ci/pixel-diff.mjs http://127.0.0.1:8765` một lần — lệnh tạo `_audit/ci/pixel-diff-report.json` để bảng đọc. Chạy `pixel-diff.mjs` trước `run-gates.mjs` (đúng thứ tự công việc CI).
- Biến thể Button `ghost`/`secondary` không tô nền, nên có thể trông “vô hình” trên canvas trắng của Storybook — đây là kiểu hiển thị dự kiến, không phải lỗi ứng dụng.

Đối với thay đổi token, sửa nguồn CSS và metadata thành viên/kiểu được soạn trong `tokens/base-inventory.json`, rồi chạy `npm run tokens:generate`, sau đó `npm run tokens:check`. Các lệnh này sinh lại và kiểm chứng đầu ra dẫn xuất; không sửa riêng từng bản sao được sinh.

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh này cài fixture npm11.21.1 đã audit, ghim bằng lockfile, với lifecycle scripts bị tắt; chạy được từ npm đi kèm Node và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc chạy `node scripts/npm.mjs ci` và dùng `node scripts/npm.mjs` thay `npm` cho các lệnh sau. `devEngines` của nguồn từ chối phiên bản npm khác. Người dùng gói đã phát hành giữ package manager riêng; ràng buộc này không phải hook vòng đời cài đặt. Xem [chi tiết toolchain](../../../docs/decisions/toolchain-reproducibility.md).

Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh cài fixture npm11.21.1 có lockfile đã audit, tắt lifecycle scripts và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc dùng `node scripts/npm.mjs ci`; các lệnh sau dùng `node scripts/npm.mjs` thay cho `npm`. `devEngines` chỉ ràng buộc dự án nguồn; người dùng gói đã phát hành giữ package manager của họ. [Chi tiết toolchain](../../../docs/decisions/toolchain-reproducibility.md).
<!-- END PINNED TOOLCHAIN BOOTSTRAP -->

Bảo trì ngôn ngữ chỉ dẫn: soạn bản dịch điểm vào đầy đủ trong `docs/vi/entrypoints/`. Với prompt component, giữ hướng dẫn tiếng Anh và ví dụ mã; xem xét mọi khối văn xuôi thay đổi trong `scripts/prompt-language-source.json`, rồi chạy `node scripts/generate-prompt-languages.mjs`. Sau khi xem xét thay đổi nguồn và bản cặp điểm vào, cập nhật `scripts/entrypoint-language-source.json` và chạy `node scripts/generate-entrypoint-languages.mjs`. Cả hai trình sinh hỗ trợ `--check`; chạy `node _audit/ci/test-prompt-languages.mjs --current` và `node _audit/ci/test-entrypoint-languages.mjs --current`. Hash nguồn gắn với văn bản đã xem xét; không chỉ đổi hash để vượt kiểm tra bản dịch cũ. Cặp điểm vào công khai và bản dịch host chỉ ở kho nguồn giữ phạm vi phát hành riêng.

Cặp `DESIGN.md` và `docs/vi/entrypoints/DESIGN.md` được sinh từ cùng một mô hình: chạy `npm run build:design-md` và `node _audit/ci/test-design-languages.mjs --current`; không chỉnh sửa thủ công hai bản chiếu này.

<!-- BEGIN PORTABLE GUIDANCE CONTRACT -->
<!-- Generated by scripts/generate-guidance.mjs; edit its authored sources, not this block. -->
Đọc [SKILL.md](../../../SKILL.md) để chọn runtime và [docs/doctrine.md](../../../docs/doctrine.md) để biết quy định về mở rộng, độ sâu kiểm chứng và các bất biến. Bản chiếu máy đọc được là [guidance/agent-contract.json](../../../guidance/agent-contract.json); danh mục được sinh và bằng chứng lịch sử không cấp năng lực hay sự chấp thuận.

Việc điều phối CyberOS và hai cổng nghiệm thu của nó đã được ngừng theo quyết định của người vận hành ngày 2026-10-08; không cần cài CyberOS. Đánh giá thị giác sản phẩm và nghiệm thu khả năng tiếp cận thủ công vẫn là các yêu cầu riêng. Không bao giờ push, triển khai hay merge khi chưa có chỉ thị rõ ràng của người vận hành.

Cổng kiểm tra kho nguồn có tính di động gồm `npm run test:unit` và [bảng audit](../../../_audit/run.html) nhanh; tạo biên nhận pixel Linux trước cổng tương ứng trên bảng. Tuân thủ kiểm tra toàn bộ tập và các trạng thái liên quan theo doctrine. Kiểm tra trình biên dịch bên ngoài là bổ sung khi có sẵn, không phải lệnh của kho nguồn. Nêu rõ nguồn/runtime, phạm vi ngôn ngữ/theme/trạng thái/viewport thực tế đã kiểm tra và các kiểm tra thủ công hoặc công cụ không có sẵn.

Các bất biến của doctrine (suy ra từ nguồn):

| Bất biến | Giá trị |
|---|---|
| Khẩu hiệu | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| Màu thương hiệu chính | Umber `#45210E` |
| Màu nhấn chính | Ochre `#F4BA17` |
| Giọng điệu | ấm áp · trực tiếp · trung thực · tôn trọng (đồng thời cả bốn) |
| Ngôn ngữ | Ưu tiên tiếng Việt; mỗi chuỗi giao diện có cặp EN + VN |
| Ngưỡng tiếp cận tối thiểu | APCA Lc ≥ 75 cho văn bản nội dung; không bao giờ bỏ vòng tiêu điểm; vùng chạm ≥ 44px |
| Các trục | Theme × Element × Language × Style (độc lập) |
| Gói phong cách | liquid-glass (gói duy nhất; không khai báo ≡ mặc định) |

- **static-html** — `styles.css`; [hướng dẫn](../../../DESIGN.md). Dùng lớp .cs-*; .dc.html còn cần trình thông dịch được cung cấp hoặc runtime hiểu ngữ pháp đã được kiểm chứng.
- **react** — `@cyberskill/design`; [hướng dẫn](../../../docs/consuming.md). ESM đã biên dịch với peer React; @cyberskill/design/source tường minh là JSX thô. Không cam kết CommonJS.
- **legacy-browser** — `_esm/cs.mjs`; [hướng dẫn](../../../docs/consuming.md). Chỉ dùng trong trình duyệt; tìm biến toàn cục CyberSkillDesignSystem_ bằng tiền tố, không dùng hậu tố cố định. Không phải entry SSR.
- **document-templates** — `templates/_vendor/support.js`; [hướng dẫn](../../../docs/template-grammar.md). Phục vụ tài nguyên tương đối. Bản xem trước trình duyệt, điều khiển/nội dung đã khai báo và PDF/DOCX có kiểm tra theo phạm vi; công cụ soạn thảo của host, PPTX và super_inline_html vẫn thuộc công cụ bên ngoài.
<!-- END PORTABLE GUIDANCE CONTRACT -->
