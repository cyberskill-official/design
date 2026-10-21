# Đóng góp

Hướng dẫn nhập môn một trang để mở rộng CyberSkill Design System. Quy tắc quy phạm nằm trong [`docs/doctrine.md`](../../../docs/doctrine.md) (mở rộng, kiểm chứng, bất biến). Ngữ pháp soạn thảo nằm trong [`docs/conventions.md`](../../../docs/conventions.md). Định hướng phía sử dụng nằm trong [`SKILL.md`](../../../SKILL.md). Bề mặt đọc đã công bố: Storybook **Docs** tại `design.cyberskill.world`.

## Khi nào sử dụng

Bạn đang thêm component, token, template, chuỗi ngôn ngữ hoặc trang tài liệu. Theo doctrine trước, rồi đến các công thức bên dưới.

## Ngoài mục tiêu

Tệp này không thay thế doctrine, registry sản phẩm hay hướng dẫn sử dụng.

## Các yêu cầu không thương lượng

- **Các màu neo tuân theo bảng doctrine suy ra từ nguồn bên dưới.** Mỗi bề mặt chỉ một accent (Ochre ở lõi; accent Ngũ Hành của sản phẩm trong scope `data-cs-element`). Mọi màu trung tính ngả ấm về umber — không dùng xám lạnh.
- **Ưu tiên tiếng Việt và song ngữ** — cung cấp EN + VN, giữ dấu, dùng line-height phù hợp tiếng Việt. Mọi template song ngữ có `lang` ở gốc (xem quy ước → Ngôn ngữ trình đọc màn hình).
- **Ngưỡng tiếp cận tối thiểu** — giữ chỉ báo tiêu điểm kết hợp (viền text-primary và quầng Ochre); vùng chạm ≥44px trên con trỏ thô; văn bản nội dung APCA Lc ≥ 75; tôn trọng `prefers-reduced-motion`/`prefers-contrast`. Kiểu tiêu điểm nằm trong `base/reset.css` và CSS component; `base/a11y.css` bao phủ kích thước con trỏ thô và cơ chế dự phòng tùy chọn. Kiểm chứng trạng thái tiêu điểm hiển thị sau thay đổi.
- **Ngữ pháp** — Theme × Element × Language × Style là các trục độc lập. Gói phong cách là liquid-glass (gói duy nhất; không khai báo ≡ mặc định).
- **Giọng điệu** — ấm áp / trực tiếp / trung thực / tôn trọng. Sản phẩm là “điều ước” mà Lumi giúp hiện thực hóa. Lumi luôn màu vàng trong mọi hành.

## Mở rộng và kiểm chứng

Quy tắc mở rộng và yêu cầu độ sâu kiểm chứng nằm trong **[`docs/doctrine.md`](../../../docs/doctrine.md)**. Khi bất kỳ phần nào tăng lên, cập nhật mọi sản phẩm bàn giao trong cùng thay đổi; kiểm chứng toàn bộ tập, không lấy mẫu. Cổng kiểm tra: `_audit/run.html` xanh + `npm run test:unit` (phiên có trình biên dịch ngoài chạy thêm `check_design_system`; đây không phải lệnh kho nguồn).

## Thêm nội dung — công thức nhanh

- **Component** — `components/<group>/<Name>.{jsx,d.ts,prompt.md}` + khối kiểu `.cs-*` trong `base/*.css` tương ứng + thêm vào `*.card.html` của nhóm. Component phần tử rỗng (`<input>`/`<hr>`) phải tách `children` khỏi `...props` (quy tắc React #137). Vai trò/nhãn ARIA phải đúng.
- **Token** — thêm vào đúng `tokens/*.css`; nếu là token ngữ nghĩa/bề mặt, thêm ghi đè `[data-theme="dark"]` (+ system) và kiểm chứng tương phản trên `#221710`. Sinh lại `tokens/tokens.json`/`.js`. Hành/biến thể mới đặt đủ 10 vai trò `--cs-accent-*` (`_audit/token-contract.html` kiểm tra việc này).
- **Template** — `templates/<slug>/<Slug>.dc.html` (DC) có `<!-- @template … -->` đầu tiên + `ds-base.js`. Song ngữ với tùy chỉnh Language + `lang` gốc. Tài liệu có `@page{size}` + `<meta name="omelette-owns-print">`. Tùy chỉnh Element ×15. Tệp DC hiển thị qua trình thông dịch trình duyệt được cung cấp (`support.js`); xem `docs/template-grammar.md`. Bảng tinh chỉnh của host và xuất PPTX cần công cụ bên ngoài riêng. Phía dùng tĩnh thuần có thể dùng `styles.css` + `.cs-*`.
- **Card / guideline** — `.html` với dòng đầu `<!-- @dsCard group="…" … -->`.
- **Tài liệu** — EN + VI cho mọi `docs/*.md`; thêm trang vào thanh bên Storybook Docs (catalog + story) và `docs/viewer.html`. `docs-storybook-coverage` thất bại nếu trang chỉ tồn tại trong git.

Danh tính người bảo trì và đường đóng góp được ghi trong [MAINTAINERS.md](../../../MAINTAINERS.md). `.github/CODEOWNERS` chuyển yêu cầu review đến chủ sở hữu đã được bổ nhiệm; nó không bật quy tắc phê duyệt từ xa hay cấp quyền phát hành.

## Quy trình agent

`.mcp.json` được theo dõi không có máy chủ bắt buộc. Theo `AGENTS.md` và hợp đồng có tính di động được sinh bên dưới để biết quy trình hiện tại, điều phối đã ngừng và ranh giới nghiệm thu. Hồ sơ tác vụ lịch sử giữ ngữ cảnh gốc.

## Ranh giới phạm vi đã ghi nhận (không phải thiếu sót)

Trang UI-kit vẫn là bản tái hiện trung thành với Thổ; song ngữ EN·VN bao phủ email + tài liệu đội ngũ/pháp lý/tài chính (ấn phẩm khách hàng/truyền thông ưu tiên EN); không đặt chữ trên `-accent` trung độ; biến thể gửi email an toàn là ví dụ trong `templates/email-safe/` (các bản khác chuyển đổi theo yêu cầu).

Đối với thay đổi token, sửa nguồn CSS và metadata thành viên/kiểu được soạn trong `tokens/base-inventory.json`, rồi chạy `npm run tokens:generate`, sau đó `npm run tokens:check`. Các lệnh này sinh lại và kiểm chứng đầu ra dẫn xuất; không sửa riêng từng bản sao được sinh.

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh này cài fixture npm11.21.1 đã audit, ghim bằng lockfile, với lifecycle scripts bị tắt; chạy được từ npm đi kèm Node và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc chạy `node scripts/npm.mjs ci` và dùng `node scripts/npm.mjs` thay `npm` cho các lệnh sau. `devEngines` của nguồn từ chối phiên bản npm khác. Người dùng gói đã phát hành giữ package manager riêng; ràng buộc này không phải hook vòng đời cài đặt. Xem [hướng dẫn kiểm tra và toolchain](../../../docs/validation.md).

Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh cài fixture npm11.21.1 có lockfile đã audit, tắt lifecycle scripts và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc dùng `node scripts/npm.mjs ci`; các lệnh sau dùng `node scripts/npm.mjs` thay cho `npm`. `devEngines` chỉ ràng buộc dự án nguồn; người dùng gói đã phát hành giữ package manager của họ. [Hướng dẫn kiểm tra và toolchain](../../../docs/vi/validation.md).
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
