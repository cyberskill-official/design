# Kiểm chứng repository

Cài dependency Node/npm đã khóa bằng `npm ci`. Kiểm chứng browser đầy đủ cần `npx playwright install --with-deps chromium firefox webkit`. Python 3 cần cho font audit và serve local dùng Python; sinh font còn dùng dependency fontTools đã pin được mô tả trong [conventions](conventions.md). Các điều kiện này không cung cấp công cụ authoring bên ngoài hay chấp nhận của con người.

## Lệnh và báo cáo

- `npm run verify` kiểm tra artifact publish mà không ghi lại, rồi chạy `npm run test:unit`.
- `npm run test:unit` đọc registry lệnh `_audit/ci/unit-suites.json`. Runner tiếp tục sau lỗi độc lập và trả nonzero nếu suite được chọn có lỗi. Kết quả tại `test-results/unit/unit-results.json` và `unit-results.xml` (JUnit). Đặt `CS_UNIT_REPORT_DIR` để chọn thư mục báo cáo khác.
- `CS_UNIT_SHARD=1/4 npm run test:unit` chọn một shard ổn định của registry; báo cáo mặc định tại `test-results/unit-1-4/`. Shard pass chỉ phủ suite đã chọn.
- `npm run verify:browser` mở server loopback tạm, tạo điều kiện Pixel CI trước rồi chạy fast board cứng. Exit code giữ lỗi của cả hai bước; bảng HTML vẫn là authority gate hiện có.
- `npm run tokens:generate` sinh lại output token; `npm run tokens:check` kiểm tra toàn chuỗi khai báo. Dùng sau khi đổi CSS và base inventory authored.

Pixel baseline đã commit được tạo trên Linux Chromium. Chạy đường pixel trong môi trường khớp; khác biệt macOS là bằng chứng cần xem xét, không phải quyền thay baseline Linux hoặc bỏ hard gate. Test local pass không cho phép cập nhật baseline, push, merge hay deploy.

## Ranh giới bằng chứng

Có tên trong registry không chứng minh phủ mọi tương tác. Ghi lệnh, định danh source, platform, ngôn ngữ/theme/state và đường output cùng verdict. Kết quả công nghệ hỗ trợ thủ công nằm trong [ma trận thủ công](manual-at-matrix.md); hàng chưa thực hiện vẫn pending. Visual review sản phẩm, review file export, duyệt quyền và cho phép của operator là kết quả riêng.

Luồng `npm run build`: khởi tạo manifest còn thiếu từ `scripts/catalog-source.json`, đồng bộ font từ `tokens/fonts.css`, chạy toàn bộ chuỗi token/export, rồi cập nhật danh mục template, chỉ mục CSS và dữ kiện source component. Metadata catalog, `tokens/base-inventory.json` và `tokens/export-metadata.json` là đầu vào có chủ đích; các file sinh vẫn được lưu để consumer dùng trực tiếp. `npm run build:check` kiểm tra mà không ghi lại đầu ra. `npm run test:css-lint` kiểm tra cú pháp, thuộc tính không biết và mã hex sai; `npm run test:distribution-budgets` kiểm soát tăng trưởng bundle, stylesheet và asset.

Trình xem tài liệu cần HTTP server; `file://` không tải được Markdown qua fetch. Dùng `npm run verify:serve` và mở viewer bằng URL loopback. Với kiểm tra font, tạo môi trường Python riêng rồi cài `python -m pip install --require-hashes --only-binary=:all: --no-deps -r scripts/requirements-fonts.txt`; chạy audit bằng Python trong môi trường đó.

Ngân sách phân phối cũng bao phủ entry CSS chỉ chứa biến (90.000 byte), cây ESM đã biên dịch (1.800.000 byte / 500 tệp) và cây mode độc lập (12.000.000 byte / 257 tệp). Giới hạn bundle trình duyệt, stylesheet đã gộp và từng asset hiện có không thay đổi. Đây là chốt kiểm soát tăng trưởng, không phải nghiệm thu tốc độ tải, Lighthouse hoặc thiết bị. Chạy `npm run test:distribution-budgets`; kiểm tra danh sách đầu ra và độ mới vẫn là yêu cầu bổ sung.

Bộ kiểm tra lỗi CSS dùng PostCSS, CSS-tree kèm bản vá dữ liệu đặc tả CSS và postcss-value-parser đã pin. Nó giữ hai rule trước đây (`property-no-unknown`, `color-no-invalid-hex`) cùng lỗi cú pháp, không dùng thư viện glob hay quy tắc định dạng. Kết quả chuyển đổi khớp Stylelint17.16.0 trên toàn bộ27 nguồn CSS và42 fixture hợp lệ/không hợp lệ (`test-results/css-lint-oracle.json`); fixture CI còn kiểm tra khai báo lồng nhau, hex trong custom property, fragment URL và chuỗi ký tự. Chuỗi glob braces chưa có bản vá của Stylelint đã được loại bỏ, thay vì bỏ qua cảnh báo hoặc hạ phiên bản. Bộ kiểm tra dành cho CSS thuần; không hỗ trợ nội suy preprocessor. Kết quả audit phụ thuộc chỉ đúng tại thời điểm chạy, không phải nghiệm thu malware, giấy phép hay sức khỏe package.

Chính sách audit phụ thuộc: `npm run security:audit` chặn advisory mức high và critical trên phụ thuộc runtime, development, optional và peer, không có ngoại lệ advisory. Danh mục được duyệt trong `scripts/dependency-audit-projects.json` bao gồm lockfile gốc, ví dụ Vite và fixture tương thích React 18; mỗi dự án giữ báo cáo đầy đủ và hash nguồn riêng. Tất cả dự án phải đạt. Lệnh chạy trong job CI `fast-gates` hiện có; JSON đầy đủ và bản tóm tắt được tải lên kể cả khi bước audit thất bại. Báo cáo thiếu, sai định dạng, không nhất quán hoặc lỗi dịch vụ đều bị từ chối. Mỗi kết quả kèm hash lockfile nguồn và phiên bản Node. Mức nhẹ hơn vẫn được giữ trong báo cáo; kết quả sạch chỉ đúng tại thời điểm chạy. Chính sách đã được chuẩn bị cục bộ; thực thi trên host cần push được cho phép và một lượt CI thành công.

Job `storybook-build` còn chạy `node _audit/ci/lib/run-browsers.mjs _audit/ci/test-storybook-runtime-browser.mjs` trên index đã build. Lệnh kiểm tra trạng thái render mặc định của mọi story component trong Chromium, Firefox và WebKit ở 1280×900. Vùng sản phẩm và portal overlay/floating có quyền sở hữu rõ ràng dùng chính sách lỗi WCAG 2 A/AA serious/critical hiện có. Node sản phẩm ngoài vùng chưa đăng ký và lỗi render đều làm thất bại. Kết quả axe đầy đủ của sản phẩm và iframe, gồm mức độ khác và kiểm tra chưa kết luận, được giữ khi đạt hoặc thất bại. Đây là kiểm tra tự động trạng thái mặc định có giới hạn; hồi quy tương tác, mọi tổ hợp toolbar, công nghệ hỗ trợ thủ công và chấp nhận hình ảnh vẫn riêng biệt.

Công cụ font và PDF dùng cho kiểm thử được audit riêng bằng `npm run security:audit-python`, truy vấn đúng phiên bản PyPI có hash cố định trong `scripts/requirements-fonts.txt` và `_audit/ci/requirements-pdf.txt`. Job `fast-gates` hiện có giữ phản hồi OSV và bản tóm tắt cùng bằng chứng npm. Advisory do nhà cung cấp phân loại high/critical bị chặn; thiếu phân loại, báo cáo sai định dạng và lỗi dịch vụ đều thất bại. Vector CVSS không được tự tính điểm. Không có advisory không chứng minh sức khỏe gói, không có mã độc hay việc chấp nhận giấy phép.

Với toàn bộ bộ kiểm thử cục bộ, dùng phiên bản Node đã khai báo và môi trường Python riêng. Ví dụ dưới đây khớp cách cài có kiểm tra hash trong CI; `CS_PDF_PYTHON` phải là đường dẫn executable tuyệt đối.

```sh
python3 -m venv /tmp/cs-design-tests
/tmp/cs-design-tests/bin/python -m pip install --require-hashes --only-binary=:all: --no-deps -r scripts/requirements-fonts.txt -r _audit/ci/requirements-pdf.txt
PATH="/tmp/cs-design-tests/bin:$PATH" CS_PDF_PYTHON="/tmp/cs-design-tests/bin/python" npm run test:unit
```

Toolchain được duy trì yêu cầu Node 22.12.0 trở lên vì Vite 8 và công cụ native khai báo mức tối thiểu này. `.nvmrc` và CI chọn bản vá Node 22 mới nhất hiện có làm luồng kiểm tra chính; khai báo engine tối thiểu không có nghĩa mọi bản Node mới hơn đều được kiểm thử.

Kiểm thử văn bản và bố cục PDF chuyển byte PDF thật cho parser `pypdf` đã pin qua tệp tạm riêng, thay vì pipe đầu vào. Helper ghi PDF với quyền `0600`, chạy executable Python riêng do `CS_PDF_PYTHON` chọn và kiểm tra tên/phiên bản parser, số trang cùng kết quả văn bản. Thời hạn tiến trình mặc định là 30 giây, đầu ra thu thập bị giới hạn ở 32 MiB. Thư mục tạm được xóa cả khi thành công lẫn thất bại. Thiếu công cụ, lỗi tiến trình, hết thời gian, vượt giới hạn đầu ra, phản hồi sai định dạng hoặc metadata parser không hợp lệ đều làm kiểm thử thất bại; không được bỏ qua vì thiếu parser. Đây là giới hạn của bộ kiểm thử, không phải giới hạn xuất của sản phẩm hay nghiệm thu độ trung thực trong Office đích.

## Phiên bản Vite tối thiểu về bảo mật

Kho mã yêu cầu Vite `^8.1.6`; ví dụ Vite được duy trì ghim `8.1.6`, và cả hai lockfile chọn bản vá đó trên dòng 8.1 hiện có. Nguồn upstream xác định đây là bản sửa [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) và [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw), liên quan đến công cụ mở trình soạn thảo và xử lý lệnh trên Windows.

Chạy `npm run security:audit` để có bằng chứng hiện tại. Chính sách hiện có vẫn kiểm toán mọi lockfile được duy trì và mọi nhóm dependency, gồm công cụ phát triển; phát hiện mức high và critical gây chặn, và bằng chứng kiểm toán thiếu hoặc không hợp lệ khiến cổng từ chối. Bản vá dependency này không thêm ngoại lệ, không đổi ngưỡng mức độ nghiêm trọng, không tạo phiên bản phát hành mới hay ngày công bố thông báo.
