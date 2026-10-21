# Kiến trúc locale ngoài EN·VI (G2 / CDS-I18N-001)

Trạng thái: **đã chấp nhận** (2026-08-25) — quyết định của người vận hành **B** (thử nghiệm locale thứ ba).  
Chủ sở hữu: người bảo trì design system.  
Tác vụ: `TASK-IMP-026`

## Quyết định

Giữ **Language** làm trục sản phẩm. Giá trị locale là **subtag ngôn ngữ chính theo BCP-47** (`en`, `vi`, `ja`, …), không phải trục thứ năm lồng nhau hay enum EN|VI cố định.

| Phương án | Kết luận |
|--------|---------|
| A — Mở rộng trục Language bằng các mã ngôn ngữ | **Được chọn** (giá trị subtag chính) |
| B — Lồng `locale` dưới Language | Bị từ chối — tạo thêm trục con mà bên sử dụng phải học |
| C — Dùng đầy đủ tag BCP-47 làm trục (`vi-VN`, `en-US`) | Hoãn — biến thể vùng sẽ được xem xét sau |

### Hợp đồng registry / `makeT`

1. `components/_i18n/strings.js` tiếp tục là registry trung tâm. Cấu trúc cho từng component:
   ```js
   { en: { key: "…" }, vi: { key: "…" }, ja?: { key: "…" } }
   ```
2. **Bắt buộc:** mỗi component đã đăng ký giữ `en` + `vi` với tập khóa giống nhau (doctrine ưu tiên tiếng Việt; `bilingual-parity` giữ nguyên mức tối thiểu).
3. **Locale thử nghiệm tùy chọn** (hiện tại: `ja`) có thể thêm bảng thứ ba. Khi có, các khóa phải khớp `en` và giá trị không được rỗng.
4. `resolveLang` chuẩn hóa giá trị ngôn ngữ về subtag chính và phân giải theo prop tường minh → scope DOM `[lang]` gần nhất → ngôn ngữ tài liệu → **`vi`**. Prop rỗng hoặc chỉ có khoảng trắng được xem là không có, nên vẫn quan sát được thay đổi ngôn ngữ kế thừa. Các subtag chính khác nhau vẫn phân biệt: `jam`, `vif` và `ena` không được phân giải thành `ja`, `vi` hay `en`; bảng dịch thiếu đi theo thứ tự dự phòng đã công bố. Nhãn hiển thị (`Tiếng Việt`, `English`) vẫn được phân giải. Root component xuất hiện muộn được phân giải khi mount; portal kế thừa scope DOM tại nơi đến.
5. Thứ tự tra cứu của `tr` / `makeT`: locale yêu cầu → `en` → `vi` → chuỗi khóa. Thiếu nội dung thử nghiệm không làm hỏng bên gọi EN·VI.
6. Dạng thông điệp số nhiều / ICU và biến thể vùng (`vi-VN` so với `vi-US` của marketing) **ngoài phạm vi** thử nghiệm này; mở lại bằng ADR tiếp theo khi cần.

### Thử nghiệm locale thứ ba

- Locale thử nghiệm: **tiếng Nhật (`ja`)** — hệ chữ khác, ít xung đột với khóa EN/VI.
- Bằng chứng: `Pagination` (+ một nhóm fixture nhỏ) có chuỗi `ja`; `_audit/ci/test-locale-ja-spike.mjs` kiểm tra phân giải + tra cứu; thanh Language của Atomic View / Storybook có `ja` như lựa chọn thử nghiệm.

## Kế hoạch gate

| Gate | Sau thay đổi này |
|------|-------------------|
| `bilingual-parity` | Vẫn yêu cầu tập khóa `en`+`vi` bằng nhau; **đồng thời** thất bại nếu bảng locale tùy chọn (ví dụ `ja`) lệch khóa `en` hoặc chứa giá trị rỗng |
| `docs-lang-parity` | Không đổi — tài liệu vận hành giữ cặp EN·`docs/vi/`; không phải locale UI sản phẩm |
| `template-lang-parity` | Không đổi — giao diện điều chỉnh template giữ EN·VI trong đợt này |
| `test-i18n-builtins` | Không đổi quy tắc nối dây; namespace thử nghiệm vẫn nối qua `makeT` |
| `test-locale-ja-spike` | Gate unit **mới** — `resolveLang('ja'|'ja-JP')`, chuỗi ja của `makeT`, mặc định vẫn là `vi` |

## Ngoài mục tiêu

- Không thêm trục nhận diện sản phẩm thứ tư.
- Không phá mặc định ưu tiên tiếng Việt (`lang` không đặt → `vi`).
- i18n của TipTap / Editor nằm ngoài phạm vi.
