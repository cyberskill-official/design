# Giao thức công nghệ hỗ trợ

Quy trình AT và IME thủ công lặp lại cho widget rủi ro cao. Ô trống không phải pass. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Phạm vi

Chạy giao thức này trước khi đưa component lên Stable và trước mỗi minor release. Fixture axe và bàn phím trên CI là cần, chưa đủ.

Bề mặt bắt buộc: Dialog, AlertDialog, Menu, Combobox, DataGrid, Sortable, Editor, Carousel, DatePicker, TimePicker, Image preview.

## Nền tảng

Ghi pass/fail từng ô. Không đánh pass nếu chưa có ghi chú operator có ngày.

1. NVDA + Firefox (Windows)
2. JAWS + Chrome (Windows)
3. VoiceOver + Safari (macOS)
4. VoiceOver + Safari (iOS)
5. TalkBack + Chrome (Android)
6. Bộ gõ IME (Telex / VNI) trên TextField, Editor, Combobox

## Kiểm tra

Với mỗi bề mặt:

1. Tên, role, và giá trị được đọc khi focus
2. Chỉ bàn phím vẫn tới mọi action
3. Focus vào overlay rồi trả về trigger khi đóng
4. Live region thông báo sort, carousel, và upload
5. Zoom 200% và 400% vẫn lộ cùng control
6. Forced colors vẫn thấy focus và trạng thái chọn

Lưu ghi chú có ngày trong `docs/tasks/` khi một release tuyên bố bằng chứng AT. File này là giao thức, không phải nhật ký đã chạy xong.

## Liên quan

- Ma trận hỗ trợ: `docs/support-matrix.md`
- Hợp đồng component: `docs/component-contract.md`
- SLO: `docs/slo.md`
