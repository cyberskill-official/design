# Chuẩn bị phát hành

Phát hành sử dụng bước chuẩn bị thủ công rõ ràng. `VERSION`, manifest gói và lockfile xác định ứng viên trong kho mã; chúng không chứng minh việc công bố hay nghiệm thu. Phiên bản hiện tại của kho mã không đổi cho đến khi người vận hành cho phép chuẩn bị ứng viên mới.

## Công việc của workflow

`.github/workflows/release.yml` chỉ chạy qua `workflow_dispatch`. Cung cấp phiên bản ổn định `major.minor.patch` dự kiến, SHA commit chính xác của ref được chọn và xác nhận rõ rằng bạn đã kiểm tra bằng chứng hỗ trợ gắn với nguồn, đánh giá giao diện và nghiệm thu thủ công cần thiết. Xác nhận này không tạo hồ sơ phê duyệt hỗ trợ và không miễn yêu cầu bằng chứng còn thiếu.

Workflow checkout đúng nguồn đó, không lưu thông tin xác thực, cài Node 22 và các dependency npm từ lockfile, rồi cài Chromium, Firefox và WebKit bằng dependency Playwright đã khóa. Workflow giữ cổng phê duyệt lifecycle hiện có, chuẩn bị phiên bản và các dấu phiên bản sinh tự động trong checkout dùng riêng, chạy `npm run verify`, sau đó chạy `npm run verify:browser` trên Linux. Lệnh trình duyệt so sánh pixel trước bảng cổng kiểm tra không thay đổi. Bước chuẩn bị không cập nhật baseline và không bỏ qua cổng lỗi.

Kết quả tải lên gồm kế hoạch, biên nhận ứng viên, bản vá nhị phân chính xác và báo cáo kiểm tra. Bước cuối so sánh hash bản vá sau kiểm tra với biên nhận đã chuẩn bị. Job thất bại vẫn có thể tải bản vá phục vụ chẩn đoán; có artifact không đồng nghĩa kiểm tra thành công.

Workflow chỉ có quyền `contents: read`. Nó không tạo commit, tag, pull request hoặc GitHub Release, không push nhánh, triển khai hay công bố lên npm. Nó không gọi workflow công bố npm riêng. Chuẩn bị tệp workflow ở máy cục bộ không làm workflow chạy.

## Xem kế hoạch cục bộ

Từ checkout sạch đã được review, xem đề xuất mà không ghi tệp vào kho mã:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "$(git rev-parse HEAD)"
```

Phiên bản trên chỉ là ví dụ. Kế hoạch JSON mặc định báo `readyToPrepare` và các điều kiện đang chặn. Việc xuất được kế hoạch có thể trả mã thành công dù có điều kiện chặn; cần đọc trường này. Phiên bản sai định dạng, các tệp phiên bản không khớp và SHA nguồn không khớp gây lỗi ngay. Hiện chỉ hỗ trợ phiên bản ổn định vì bộ sinh export legacy hiện từ chối hậu tố prerelease.

Kế hoạch kiểm tra `VERSION`, `package.json`, `package-lock.json` và gói gốc trong lockfile cùng phiên bản; phiên bản đề xuất tăng; SHA nguồn bằng HEAD; checkout sạch; tag `v<version>` chưa có trong các ref cục bộ đã fetch; và mọi export khai báo có bằng chứng hỗ trợ mới, đúng người có quyền. Tag chưa có ở máy cục bộ không phải là đặt chỗ toàn cục hay kiểm tra phiên bản trên npm.

## Chuẩn bị tệp để review

Chỉ dùng `--write` trong checkout sạch dành riêng sau khi đã cho phép rõ bước chuẩn bị cục bộ đó:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "$(git rev-parse HEAD)" --write
```

Lệnh cập nhật các tệp phiên bản và dấu phiên bản trong hướng dẫn hiện hành, sau đó chạy chuỗi `tokens:generate` hiện có. Các phần ghi chú về bản đã công bố giữ nguyên phiên bản và tuyên bố lịch sử. Không tự động chuyển ghi chú thành bản phát hành. Script từ chối mọi thay đổi vào `components/lifecycle.json` và kiểm tra lại bằng chứng sau khi sinh tệp. Byte đã được phê duyệt bị thay đổi cần review hỗ trợ mới; script không cập nhật hash phê duyệt hay tự điền người review.

Nếu sinh tệp thất bại, kiểm tra hoặc bỏ checkout dành riêng đó. Lỗi có thể để lại các thay đổi đề xuất cục bộ; bước chuẩn bị không rollback tệp không liên quan và không thay đổi commit nguồn. Biên nhận tệp đã chuẩn bị có `candidateValidated: false` cho đến khi các bước kiểm tra riêng của workflow thành công.

## Kiểm tra đúng ứng viên

Giữ JSON do `--write` xuất ra, chạy mọi lệnh trong danh sách `requiredValidation`, rồi kiểm tra ứng viên chưa thay đổi bằng biên nhận đó:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "$(git rev-parse HEAD)" --check-candidate /absolute/path/release-candidate.json
```

Lệnh từ chối xung đột nguồn, phiên bản, bản vá, bằng chứng hỗ trợ hoặc tag. Nó không suy ra kiểm tra đã thành công từ biên nhận và không cho phép công bố. Giữ cùng nhau kết quả job thực tế, phạm vi công cụ/nền tảng, SHA nguồn, hash bản vá và hồ sơ nghiệm thu của con người. Các hồ sơ hỗ trợ đang chưa review vẫn là điều kiện chặn bắt buộc cho đến khi chủ sở hữu hoàn tất review mới.

## Cho phép phát hành sau đó

Áp dụng bản vá đã review, tạo commit ứng viên, merge, gắn tag, tạo GitHub Release và công bố gói là các thao tác có hệ quả riêng, cần người vận hành cho phép rõ ràng. Workflow công bố npm hiện có vẫn là một bề mặt riêng; bước chuẩn bị không gọi nó. Quyền sử dụng/giấy phép và nghiệm thu sản phẩm/thủ công vẫn là các yêu cầu độc lập.

Sau khi commit ứng viên và tag đã được cho phép riêng và đã tồn tại, có thể dùng kiểm tra danh tính chỉ đọc:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "EXACT_CANDIDATE_COMMIT_SHA" --verify-tag
```

Lệnh yêu cầu checkout sạch, các tệp phiên bản thống nhất, tag `v<version>` trỏ đúng commit đó và bằng chứng hỗ trợ còn mới. Nó chỉ kiểm tra danh tính Git đã fetch; không chứng minh nội dung registry từ xa, provenance công bố, triển khai, nghiệm thu thủ công hay quyền phát hành. Kiểm tra lại đúng commit ứng viên trước mọi lần công bố sau đó.

## Công bố npm gắn với nguồn chính xác

`.github/workflows/npm-publish.yml` chỉ kiểm tra khi nhận sự kiện GitHub Release. Công bố yêu cầu lần gọi thủ công riêng trên đúng tag phiên bản và xác nhận rõ đã kiểm tra bằng chứng hỗ trợ, giao diện và nghiệm thu thủ công gắn với nguồn. Xác nhận không tạo phê duyệt và không miễn yêu cầu lifecycle hay thông báo tương thích.

Job kiểm tra chỉ đọc xác minh commit được gắn tag sạch, các tệp phiên bản thống nhất, hồ sơ hỗ trợ mới đúng người có quyền và tương thích phát hành. Job chạy danh sách lệnh cố định trong `scripts/lib/publication-validation.mjs`: cả hai kiểm toán dependency, build, toàn bộ kiểm tra, pixel/bảng cổng Linux, build site, cả ba engine Storybook và các lượt play riêng cùng kiểm tra khả năng tiếp cận, kiểm tra CSP site đầy đủ ba engine và vệ sinh gói. Các biến `CS_*` kế thừa để chọn một phần bộ kiểm tra hoặc đổi đường dẫn bằng chứng bị xóa; chỉ giữ trình thông dịch `CS_PDF_PYTHON` đã ghim và lựa chọn trình duyệt rõ ràng của từng lệnh. Danh sách lệnh thuộc nguồn, biên nhận không thể cung cấp lệnh thay thế.

Sau khi mọi cổng đạt, job đóng gói một lần, ghi commit/tree, hash hỗ trợ/người duy trì/thông báo, kết quả lệnh và digest tarball chính xác. Job OIDC riêng tải đúng ID artifact bất biến đó, kiểm tra biên nhận theo digest từ job kiểm tra và xác minh lại danh tính nguồn, độ mới phê duyệt, tương thích và byte tarball. Job công bố đúng tarball đã kiểm tra với script bị tắt; không build gói khác hay chạy hook nguồn mới bằng quyền công bố. Chỉ phản hồi registry `E404` thực sự mới chứng minh phiên bản chưa tồn tại; lỗi xác thực, dịch vụ hoặc phản hồi sai định dạng dừng workflow. Phiên bản đã tồn tại được bỏ qua, không ghi đè.

Đây là hợp đồng cưỡng chế trong kho mã. Kiểm thử fixture cục bộ không chứng minh workflow đã chạy trên máy chủ, công bố thành công, nghiệm thu của con người, provenance registry hay người review environment đã được cấu hình. Giữ kết quả chạy và bằng chứng nghiệm thu đúng nguồn trước khi cho phép phát hành.
