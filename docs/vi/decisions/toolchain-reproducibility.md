# Toolchain bảo trì có thể tái lập

Kho mã hỗ trợ Node >=22.12.0 và ghim npm11.21.1. CLI npm chính xác nằm trong fixture riêng được bảo trì ở `_audit/ci/fixtures/npm-cli`; lockfile của nó chứa bundle npm chính thức. CI chỉ dùng npm đi kèm setup-node để chạy `npm ci --prefix _audit/ci/fixtures/npm-cli --ignore-scripts --no-audit --no-fund`. Composite action cục bộ kiểm tra phiên bản CLI đã cài và công bố thư mục executable bằng cách xử lý đường dẫn/xuống dòng gốc của Node. `devEngines.packageManager` của dự án nguồn từ chối phiên bản npm khác khi install/ci/run; chỉ gợi ý `packageManager` không đủ thực thi.

Trên máy cục bộ, trước tiên chạy trực tiếp `node scripts/bootstrap-toolchain.mjs` (không qua npm run vì guard nguồn có thể từ chối), rồi thêm thư mục `node_modules/.bin` của fixture vào PATH hoặc gọi `node scripts/npm.mjs ci` (wrapper cũng ghim PATH cho lệnh npm lồng nhau). Không cần cài npm toàn cục. Guard chỉ dành cho nguồn này không phải lifecycle hook khi cài package, và không áp đặt phiên bản npm chính xác lên bên tiêu thụ package. Lockfile fixture npm và Style Dictionary được bảo trì nằm trong danh mục audit mọi nhóm phụ thuộc hiện có. Audit giữ advisory moderate và nhẹ hơn, thất bại khi có high/critical hoặc kết quả thiếu/lỗi dịch vụ. Đây là bằng chứng lỗ hổng, không phải chứng nhận malware, giấy phép hay sức khỏe package. Công cụ Endor đánh giá rủi ro package bổ sung không khả dụng trong môi trường khắc phục.

`npm run sbom` dùng bộ sinh CycloneDX1.5 tích hợp trong npm đã ghim trên lockfile gốc, gồm nhóm development, optional và peer. Wrapper chỉ loại `serialNumber` và `metadata.timestamp` tùy chọn, giữ mọi trường component, dependency và metadata còn lại. Nó tạo artifact `bom.cdx.json` hiện có theo cách tái lập mà không tải CLI CycloneDX riêng. SBOM vẫn chỉ là đồ thị npm gốc, không khẳng định một tài liệu chứa mọi lockfile fixture lồng nhau.

Style Dictionary giữ đúng5.5.5 trong fixture riêng. CI cài bằng `npm ci --ignore-scripts` trước các kiểm tra trao đổi thật hiện có. Bước always-upload cuối chạy sau các kiểm tra này để giữ biên nhận mode.

Cài đặt Vercel chạy bootstrap trực tiếp rồi `node scripts/npm.mjs ci`; build chạy `node scripts/npm.mjs run build:site`. Những lệnh này cấu hình build hiện có, không cho phép triển khai.

CI tĩnh dùng máy chủ kiểm chứng sẵn có qua `scripts/serve-verification.mjs`; kiểm tra sẵn sàng dùng phép thử HEAD loopback, thất bại khi hết thời gian hoặc phản hồi không phải 2xx. Không thêm phụ thuộc serve/wait-on và vẫn giữ điều kiện pixel, lệnh board cùng ngưỡng hiện có. URL kiểm chứng cục bộ kết thúc bằng `.html` vẫn được hỗ trợ.

## Tiếng Việt

Kho mã giữ Node >=22.12.0 và ghim npm11.21.1 trong fixture riêng có lockfile. CI dùng npm đi kèm setup-node chỉ để cài fixture bằng `npm ci --ignore-scripts`; sau đó kiểm tra phiên bản và đưa thư mục lệnh npm đã ghim vào PATH theo định dạng gốc của hệ điều hành. `devEngines.packageManager` của dự án nguồn từ chối npm khác phiên bản. Máy cục bộ có thể dùng trực tiếp tệp npm-cli.js trong fixture, không cần cài npm toàn cục.

Các lockfile npm CLI và Style Dictionary đều nằm trong danh mục audit mọi nhóm phụ thuộc. High/critical và kết quả thiếu/lỗi dịch vụ làm bước kiểm tra thất bại; không che cảnh báo. Đây không phải chứng nhận malware, giấy phép hay sức khỏe gói; công cụ Endor bổ sung không khả dụng.

SBOM dùng chức năng CycloneDX1.5 tích hợp của npm đã ghim. Chỉ bỏ hai trường tùy chọn thay đổi theo lần chạy (`serialNumber`, `metadata.timestamp`); giữ nguyên dữ liệu thành phần, quan hệ phụ thuộc và metadata còn lại. Tệp vẫn là `bom.cdx.json` và phạm vi là lockfile gốc. Style Dictionary5.5.5 dùng fixture có lockfile riêng, giữ các kiểm tra trao đổi hiện có; bước tải bằng chứng chạy sau bộ sinh biên nhận.

Máy chủ kiểm chứng hiện có và phép thử HEAD loopback thay thế tải CLI serve/wait-on ngoài lockfile. Không đổi điều kiện pixel, lệnh board hay ngưỡng kiểm tra.
