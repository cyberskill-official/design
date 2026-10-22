# Reproducible maintenance toolchain

The repository supports Node >=22.12.0 and pins npm11.21.1. The exact npm CLI is a private maintained fixture at `_audit/ci/fixtures/npm-cli`; its lock includes the official npm bundle. CI uses the npm bundled with setup-node only to run `npm ci --prefix _audit/ci/fixtures/npm-cli --ignore-scripts --no-audit --no-fund`. The local composite action checks the installed CLI version and exposes its executable directory with native Node path/newline handling. Source-project `devEngines.packageManager` rejects a different npm version for install/ci/run; a `packageManager` hint alone is not enforcement.

Locally, first run `node scripts/bootstrap-toolchain.mjs` directly (not via npm run, which the source guard may reject), then then add its `node_modules/.bin` directory to PATH or invoke `node scripts/npm.mjs ci` (the wrapper also pins PATH for nested npm commands). No global npm installation is required. This source-only guard is not a package installation lifecycle hook and does not impose an exact npm version on downstream package consumers. The maintained npm and Style Dictionary fixture locks are included in the existing all-class audit inventory. Audits retain moderate and lower advisories, and fail on high/critical or incomplete/service-error results. This is vulnerability evidence, not malware, license or package-health certification. Additional Endor package-risk tools were unavailable in the remediation environment.

`npm run sbom` uses the pinned npm built-in CycloneDX1.5 generator against the root lock, including development, optional and peer classes. The wrapper removes only optional `serialNumber` and `metadata.timestamp`, preserving every other component, dependency and metadata field. It produces the existing `bom.cdx.json` artifact reproducibly without fetching a separate CycloneDX CLI. The SBOM remains the root npm graph, not a claim that one document includes every nested fixture lock.

Style Dictionary remains exactly5.5.5 in its own fixture. CI installs it with `npm ci --ignore-scripts` before the existing real interchange checks. The final always-upload follows these checks so the mode receipt is retained.

Vercel installation runs the direct bootstrap then `node scripts/npm.mjs ci`; its build runs `node scripts/npm.mjs run build:site`. These commands configure the existing build and do not authorize a deployment.

Static CI uses the existing repository verification server through `scripts/serve-verification.mjs`; readiness uses a loopback HEAD probe that fails on timeout/non-2xx. It adds no serve/wait-on dependencies and preserves the existing pixel prerequisite, board commands and thresholds. Local verification URLs ending in `.html` remain supported.

## Tiếng Việt

Kho mã giữ Node >=22.12.0 và ghim npm11.21.1 trong fixture riêng có lockfile. CI dùng npm đi kèm setup-node chỉ để cài fixture bằng `npm ci --ignore-scripts`; sau đó kiểm tra phiên bản và đưa thư mục lệnh npm đã ghim vào PATH theo định dạng gốc của hệ điều hành. `devEngines.packageManager` của dự án nguồn từ chối npm khác phiên bản. Máy cục bộ có thể dùng trực tiếp tệp npm-cli.js trong fixture, không cần cài npm toàn cục.

Các lockfile npm CLI và Style Dictionary đều nằm trong danh mục audit mọi nhóm phụ thuộc. High/critical và kết quả thiếu/lỗi dịch vụ làm bước kiểm tra thất bại; không che cảnh báo. Đây không phải chứng nhận malware, giấy phép hay sức khỏe gói; công cụ Endor bổ sung không khả dụng.

SBOM dùng chức năng CycloneDX1.5 tích hợp của npm đã ghim. Chỉ bỏ hai trường tùy chọn thay đổi theo lần chạy (`serialNumber`, `metadata.timestamp`); giữ nguyên dữ liệu thành phần, quan hệ phụ thuộc và metadata còn lại. Tệp vẫn là `bom.cdx.json` và phạm vi là lockfile gốc. Style Dictionary5.5.5 dùng fixture có lockfile riêng, giữ các kiểm tra trao đổi hiện có; bước tải bằng chứng chạy sau bộ sinh biên nhận.

Máy chủ kiểm chứng hiện có và phép thử HEAD loopback thay thế tải CLI serve/wait-on ngoài lockfile. Không đổi điều kiện pixel, lệnh board hay ngưỡng kiểm tra.
