---
name: cyberskill-design
description: Build and maintain CyberSkill interfaces and branded artifacts using this repository's components, tokens, assets and templates. Use for CyberSkill design-system consumption or revision across static HTML, React and supported document workflows.
---

# Thiết kế CyberSkill

Đọc [README.md](../../../README.md) để hiểu thương hiệu và hệ thống, rồi chỉ nạp các tài liệu liên quan đến công việc được yêu cầu. Tệp này là điểm vào hệ thống thiết kế dùng chung cho các agent host; [docs/doctrine.md](../../../docs/doctrine.md) quy định việc mở rộng, kiểm chứng và bất biến. [docs/consuming.md](../../../docs/consuming.md) định nghĩa cách thiết lập phía sử dụng. Nguồn component, khai báo và tệp `.prompt.md` liền kề xác lập chi tiết triển khai; kiểm tra cả ba khi đổi hợp đồng công khai.

Khi bảo trì kho nguồn, theo [CONTRIBUTING.md](../../../CONTRIBUTING.md), AGENTS.md chỉ dành cho kho và các kiểm tra npm/trình duyệt đã được ghi nhận. Hợp đồng có tính di động được sinh bên dưới mang các ranh giới về ngừng hoạt động, kiểm định và phê duyệt của người vận hành.

## Chọn đường sử dụng được hỗ trợ

Tệp gốc này là bộ định tuyến dùng chung của kho. Các skill theo tác vụ có thể tìm thấy trong `.agents/skills/` và `.cursor/skills/`, rồi dẫn về đây. Khi bảo trì skill, chạy `npm run test:repository-skills` để kiểm tra metadata YAML, tài nguyên cục bộ được liên kết và tính tương đương của adapter. Các kiểm tra này không chứng minh việc nạp hay hành vi thành công trên mọi agent host.

| Tác vụ | Nguồn và runtime |
|---|---|
| HTML tĩnh, gồm Stitch | [DESIGN.md](../../../DESIGN.md), [styles.css](../../../styles.css), lớp `.cs-*` và [kitchen-sink](../../../templates/kitchen-sink.html). HTML thuần dùng `.cs-*`; `.dc.html` còn dùng trình thông dịch trình duyệt được cung cấp, mô tả trong [ngữ pháp template](../../../docs/template-grammar.md). |
| React có bundler, gồm Next/Vite/SSR | `@cyberskill/design` trỏ đến ESM đã biên dịch tại `dist/esm/_esm/react.mjs`, với peer React và source map được liên kết. `@cyberskill/design/source` tường minh giữ JSX thô cho bundler hiểu nguồn. Theo [thiết lập phía sử dụng](../../../docs/consuming.md) và nạp CSS. |
| Trình duyệt cũ, không build | [_esm/cs.mjs](../../../_esm/cs.mjs) nạp [_ds_bundle.js](../../../_ds_bundle.js). Tìm `window.CyberSkillDesignSystem_*` theo tiền tố, không bao giờ dùng hậu tố trình biên dịch cố định. Entry này chỉ dành cho trình duyệt, không phải SSR. |
| Template trình duyệt và xuất tệp | Phục vụ `templates/<slug>/<Name>.dc.html` với tài nguyên tương đối: `support.js` được cung cấp thông dịch ngữ pháp, `__dcSetProps` đổi controls đã khai báo và template tài liệu cung cấp PDF/DOCX trong trình duyệt. Xem [ngữ pháp template](../../../docs/template-grammar.md) và [quy ước xuất](../../../docs/conventions.md). Bảng tinh chỉnh của host, PPTX và `super_inline_html` cần công cụ bên ngoài. |
| Sửa đổi hệ thống | [Doctrine](../../../docs/doctrine.md), [quy ước](../../../docs/conventions.md), [hướng dẫn audit](../../../_audit/README.md) và phạm vi tác vụ của người dùng. Giữ quan hệ giữa nguồn và sản phẩm được sinh. |

[DESIGN.md](../../../DESIGN.md) được sinh lại bằng `npm run build:design-md`; không sửa tay. Token CSS nằm trong [tokens](../../../tokens/); các bản xuất máy đọc gồm `tokens.json`, `tokens.js` và `tokens.dtcg.json`. Việc có các tệp này không chứng minh tuân thủ hoàn toàn định dạng hay hỗ trợ nền tảng native: kiểm chứng kiểu giá trị, trục và toolchain phía sử dụng cần thiết. Dùng [VERSION](../../../VERSION) và [ghi chú phát hành](../../../docs/release-notes.md) để xác định bản phát hành, thay vì chép khẳng định phiên bản/số lượng vào hướng dẫn.

## Ràng buộc thiết kế

- Bảng doctrine được sinh bên dưới xác định bất biến về thương hiệu, khẩu hiệu, giọng điệu, tiếp cận, trục và phong cách. Giữ tài sản logo chính thức và Lumi màu vàng.
- Theme × Element × Language × Style được thiết kế là các trục độc lập; mặc định `light · tho · vi · liquid-glass`. Kiểm thử việc phối hợp scope thực tế cho nhu cầu được yêu cầu. Dùng gói 10 vai trò `--cs-accent-*`, gồm `on-strong`; phân bổ sản phẩm nằm trong [docs/products.md](../../../docs/products.md). Trạng thái ngữ nghĩa và chỉ báo tiêu điểm kết hợp (viền text-primary + quầng ochre) không bao giờ theo Ngũ Hành.
- Liquid-glass là gói phong cách duy nhất. Dùng lại component và token hiện có trước khi thêm ngôn ngữ thị giác hay framework mới. Skill tổng quát kèm trong `.cursor/skills` không ghi đè hợp đồng này hay cho phép cài framework.
- Giữ dấu tiếng Việt. Kiểm tra phạm vi ngôn ngữ được ghi nhận của template nghiệp vụ trước khi khẳng định hỗ trợ song ngữ.
- Dùng token font-family cho Be Vietnam Pro, JetBrains Mono và font display tùy chọn; dùng tài sản chính thức thay vì dựng lại. Chép tài nguyên cần thiết cùng sản phẩm độc lập và kiểm tra đường dẫn tương đối khi offline.
- Theo ngưỡng tiếp cận suy ra từ nguồn bên dưới và giữ tùy chọn giảm chuyển động, tương phản. Kiểm chứng tương phản trên bề mặt và trạng thái tương tác thực tế. Tên theme hay ma trận token đạt không chứng minh mọi cặp hiển thị đều đạt.

## Kiểm chứng phạm vi bàn giao

Với thay đổi kho nguồn, chạy hồi quy có mục tiêu liên quan và `npm run test:unit`; theo _audit/README.md chỉ dành cho kho để biết cổng trình duyệt và điều kiện kiểm tra pixel. Áp dụng kiểm tra toàn bộ tập theo doctrine khi hợp đồng dùng chung thay đổi. Nêu rõ nguồn/runtime, trạng thái, ngôn ngữ, theme và viewport đã kiểm tra, cùng công cụ không có sẵn hoặc kiểm tra thủ công.

Với sản phẩm phía sử dụng, thực thi các import, tài sản tham chiếu, tương tác và đường xuất thực tế. Kiểm định đầu ra xuất tách biệt với bản xem nguồn. Công cụ chỉ có ở host như `gen_pptx`, `super_inline_html` và `check_design_system` là năng lực có điều kiện, không phải lệnh kho nguồn. Cổng kho có tính di động gồm `npm run test:unit` và bảng audit nhanh; kiểm tra trình biên dịch ngoài là bổ sung khi có sẵn. Không suy ra PPTX/DOCX có thể chỉnh sửa, HTML offline, native, Figma hay hỗ trợ đã triển khai từ scaffold hoặc phần mở rộng tệp.

Phân biệt lỗi đã xác nhận, cải tiến đề xuất, kiểm thử cục bộ đạt và nghiệm thu của con người. Audit lịch sử và tài liệu tổng quát đi kèm là bằng chứng hỗ trợ, không phải chỉ dẫn quy phạm hiện tại.

## Tra cứu API đã khai báo

`components/api-index.json` được sinh từ khai báo TypeScript công khai. Tìm export theo tên, rồi tra từng `props[].definition` qua `propDefinitions` để biết kiểu, tính tùy chọn và tài liệu đã khai báo, gồm prop native kế thừa. Đường dẫn nguồn/khai báo và hash xác định hợp đồng có thẩm quyền. Chuỗi hiển thị kiểu có thể giữ alias hoặc rút gọn kiểu phức tạp. Nhãn vòng đời được chép từ khai báo, không chứng minh hỗ trợ, phân công sở hữu hay nghiệm thu. Sinh lại bằng `npm run build:api-index`; kiểm tra bằng `npm run test:api-index`.

`components/prompt-api.json` và các phần Declared API trong khối mã của prompt component chiếu tham chiếu prop/default được soạn từ khai báo chuẩn và danh mục runtime. `components/specifications.json` tách quan sát JSX chính xác, ngữ nghĩa được review trong phạm vi giới hạn và assertion kiểm thử đã ánh xạ khỏi phạm vi chưa kiểm chứng. Slot ứng viên, key literal quan sát được và tham chiếu fixture đạt không xác lập đặc tả hành vi hay tiếp cận đầy đủ. Chạy `npm run build:prompt-api`, rồi `npm run build:component-specifications` sau khi dựng lại API/hợp đồng chuẩn; bằng chứng runtime được ghi và kiểm chứng riêng bằng `npm run test:component-behavior-evidence`. Quyết định `docs/decisions/component-specification-evidence.md` ghi các giới hạn này.

Về nội dung template, đọc `docs/template-schema-v2.md`: slot sidecar mô tả lỗ trong nguồn, không tự động là prop runtime ghi được. Kiểm tra `data-props` và `renderVals()` trước khi dùng `__dcSetProps`; giá trị tính toán có thể ghi đè prop được truyền. Sửa nội dung nguồn đã được cho phép và kiểm chứng xem trước/xuất tệp, trừ khi có binding runtime được khai báo và kiểm thử tường minh. Slot văn bản thuần đã tiếp nhận dùng `__dcSetContent`, tách khỏi prop controls; xem hướng dẫn schema về kiểm định và phạm vi triển khai.

Khi bảo trì token, chạy `npm run tokens:coverage` cùng đồ thị khai báo: thành viên kiểu cơ sở, màu literal theo scope, biểu thức chưa giải được và metadata phong cách có ranh giới di động khác nhau. Giữ selector/điều kiện; không bao giờ nâng giá trị theo scope thành mặc định gốc chỉ để đủ số token. Xem `docs/conventions.md` về sinh lại và kiểm tra.

Dùng [catalog tham chiếu được sinh](../../../docs/reference-catalog.json) để biết số lượng khai báo và vai trò tài liệu công khai. Catalog nhận diện thẩm quyền định tuyến, hướng dẫn và bằng chứng, không coi danh mục hay báo cáo lịch sử là nghiệm thu năng lực hiện tại.

Nền trạng thái ngữ nghĩa dùng `--cs-color-semantic-{role}` với `-fg` tương ứng; văn bản trên page/panel/raised dùng `--cs-color-semantic-{role}-text`. Chữ mờ và liên kết nội dung thông thường phải đạt ngưỡng văn bản trên từng bề mặt thực tế. Trang in trắng cố định mở scope Light tường minh và khai báo màu chữ chính riêng; trang thích ứng theo theme.

Khối nhấn mạnh ghép `--cs-accent-strong` với `--cs-accent-on-strong`; cả hai gói chế độ đạt APCA75 cho nội dung (mục tiêu bộ sinh78) và WCAG4.5. Nút chính tối dùng `on-strong`. Giữ hai màu neo thương hiệu và tám vai trò accent còn lại. Đánh dấu rõ các dấu phân cách thuần trang trí là ẩn khỏi cây tiếp cận, đồng thời giữ glyph hiển thị.

Đối với thay đổi token, sửa nguồn CSS và metadata thành viên/kiểu được soạn trong `tokens/base-inventory.json`, rồi chạy `npm run tokens:generate`, sau đó `npm run tokens:check`. Các lệnh này sinh lại và kiểm chứng đầu ra dẫn xuất; không sửa riêng từng bản sao được sinh.

Hướng dẫn điểm vào do dự án sở hữu có đường dẫn ưu tiên tiếng Việt tới bản dịch cặp trong `docs/vi/entrypoints/`; mọi prompt component trình bày tiếng Việt trước phần tiếng Anh được giữ nguyên. Hướng dẫn vận hành và quyết định bảo trì chỉ ở kho nguồn giữ các bản cặp đã khai báo trong `docs/vi/`. Định danh kỹ thuật, ví dụ mã chính xác và tài liệu bên thứ ba nguyên văn giữ ngôn ngữ gốc. Bộ kiểm tra gắn với nguồn xác nhận cặp, phạm vi và độ mới; không xác nhận nghiệm thu ngôn ngữ của con người hay công khai tài liệu riêng.

Đọc [ngữ pháp API component hiện tại](../../../docs/component-api.md) trước khi mở rộng quyền sở hữu prop, callback, enum, ref hoặc forwarding. [Hợp đồng nguồn component được sinh](../../../components/contracts.json) tách prop được soạn/kế thừa và định vị biểu thức mặc định, CSS hook, văn bản bàn phím đã khai báo; dựng/kiểm tra bằng `npm run build:component-contracts` và `npm run test:component-contracts`. Sự kiện trong nguồn không hàm ý hợp đồng ngữ nghĩa hay tiếp cận đầy đủ.

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
