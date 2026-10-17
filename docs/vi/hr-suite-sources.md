# Nguồn HR Suite (DOCX ↔ templates)

Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Quyết định

**Instrument sống canonical là Design Component** dưới `templates/vn-*/*.dc.html` (cộng `doc-suite-index`, `doc-style-guide`, `doc-templates`). Google Drive / Word (`.docx` / `.dotx`) là **provenance nguồn**, không phải bề mặt sản phẩm Storybook.

**Không** commit file Word binary lớn vào package design system. Giải nén local tùy chọn để diff:

```bash
# scraps/ đã gitignore
mkdir -p scraps/hr-suite-docx
unzip -O UTF-8 /path/to/Templates.zip -d scraps/hr-suite-docx
```

Giữ bản gốc lâu dài ngoài git. Extractor hiện tại chỉ đọc `scraps/hr-suite-docx/Templates/`; đặt bản input đã review tại đó trước khi chạy. Bản sao ở path khác không được tự tìm. Ghi identity file/archive nguồn và review diff fixture tạo ra.

## Inventory nguồn đã ghi (Templates.zip, Th7 2026)

| Số | Loại |
|---|---|
| 40 | `.docx` instrument / hướng dẫn |
| 1 | `.dotx` shell trình bày |
| **41** | **tổng trong zip** |

Cả **37** thư mục Employment Suite `templates/vn-*` từ zip map 1:1 với một `.docx`. Bốn file “0.” tham chiếu map tới template `doc-*`. Thêm **một** hợp đồng nguyên tắc thương mại (không nằm trong zip) tại `templates/vn-framework-agreement`.

## Mapping

Bảng đầy đủ (tiêu đề EN → path repo) nằm ở bản EN: `docs/hr-suite-sources.md`. Tóm tắt: mọi hợp đồng / chính sách / form Employment Suite trong zip khớp một `templates/vn-*`; index + style guide + usage guide khớp `templates/doc-*`.

### Ngoài Templates.zip (thêm Th8 2026)

| Nguồn | Path repo | Phân loại |
|---|---|---|
| `Hợp đồng Nguyên Tắc - CyberSkill - Ban QLDA Bình Quới.docx` (Downloads) | `templates/vn-framework-agreement` | **Thương mại** — khung cung cấp dịch vụ & tài khoản phần mềm (không phải vòng đời lao động). Cùng skin VN A4 (`vn-*`), hiện dưới **Templates → HR** nhờ tên catalog `HR Suite ·`; mục lục suite đặt ở Legal/client-facing. DOCX đã adapt (gitignore): `scraps/hr-suite-docx/Templates/9. Hợp đồng Nguyên Tắc - Framework Agreement (Software Services).docx` |

## Duyệt trên Storybook

- **Templates → Gallery → Atomic gallery** — tier Templates của Atomic View
- **Templates → HR** — mọi instrument HR Suite / HR ops
- **Templates → Documents** — suite index / style guide / document template

## Sync đã ghi và phạm vi kiểm tra hiện tại

Ngày archive đã ghi là **2026-07-11**; sync **Th8 2026** trước đây là provenance lịch sử, không phải verdict toàn bộ text hiện tại. Fixture text chuẩn hóa đã giữ nằm ở `_audit/fixtures/hr-suite-docx-text/`. `npm run test:docx-source-parity` đối chiếu template hiện tại với fixture mà không mở file Word: chọn tối đa 80 cụm từ đáng kể mỗi fixture, yêu cầu ≥85% khớp, và cho phép fallback từ theo thứ tự với ≥75% từ đủ điều kiện. Text thêm mới và thay đổi trong ngưỡng này vẫn có thể pass. Kết quả pass không chứng minh identity toàn bộ điều khoản/text, fidelity định dạng/export, identity nguồn Word hiện tại hay content-owner acceptance.

Cây `.dc.html` vẫn là instrument sống canonical; file Word không vào git. Khi counsel/ops cho phép cập nhật nguồn, đặt input đã review tại `scraps/hr-suite-docx/Templates/`, sửa thư mục `templates/vn-*/` (hoặc `doc-*`) tương ứng, chạy `node scripts/extract-hr-suite-docx-fixtures.mjs`, và review diff đầy đủ source/template/fixture. Chạy phrase guard cùng kiểm tra render/export áp dụng riêng. Regen CSF Storybook nếu đổi tên (`node scripts/generate-template-stories.mjs`).

Vẫn cần counsel review trước khi dùng thật (instrument do client cung cấp; xem README / SKILL).
