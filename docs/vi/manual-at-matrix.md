# Ma trận công nghệ hỗ trợ thủ công

Bản ghi source là [manual-at-matrix.json](../manual-at-matrix.json). Mọi hàng AT-01 đến AT-16 bắt đầu **pending**: chưa khôi phục được quan sát lịch sử của con người, và automated pass không phải manual pass. Bảy phạm vi lịch sử đã biết lấy từ audit board và kit probe. Kế hoạch hiện tại đã được chủ sở hữu duyệt xác định đủ 16 phạm vi thực thi; trường `historicalScope` của từng hàng giữ lại chín phạm vi trước đây còn null, không suy đoán lại kế hoạch chưa ghi chép.

## Kế hoạch phạm vi hiện tại đã duyệt

`currentScopePlan` trong cùng tệp JSON ghi kế hoạch hiện tại đã được chủ sở hữu duyệt cho đủ 16 hàng, gồm tên, thao tác và kết quả mong đợi bằng tiếng Việt và tiếng Anh. Kế hoạch giữ nguyên bảy tên phạm vi lịch sử đã biết và chỉ rõ chín phạm vi mới được đề xuất. Phạm vi thực thi hiện tuân theo kế hoạch đã duyệt. Mọi trường kết quả vẫn pending; phạm vi lịch sử đã biết/null được giữ lại riêng.

Đề xuất bao gồm tên/lỗi của trường nhập; điều khiển lựa chọn; lớp phủ lồng nhau; tiêu điểm hộp thoại; bộ chọn; CommandPalette; menu; chế độ tabs/radio; bảng; điều khiển số; phản hồi trực tiếp; và năm bề mặt sản phẩm đã được nêu trước đó. Chủ sở hữu duyệt kế hoạch ngày 2026-10-21, chỉ xác định nội dung cần kiểm tra. Việc đó không phê duyệt component, không tạo quan sát về lời đọc/tiêu điểm và không xác nhận kết quả trên trình duyệt hoặc công nghệ hỗ trợ nào. Ghi môi trường và các trục cụ thể cho mỗi lượt chạy thực tế; không suy kết quả từ môi trường này sang môi trường khác.

Kiểm tra tính toàn vẹn từ chối hàng thiếu/trùng, bản dịch trống, danh sách thao tác/kết quả bị thiếu và thay đổi tên phạm vi lịch sử đã biết. Không bước sinh dữ liệu nào điền kết quả kiểm tra thủ công.

## Ghi kết quả

Reviewer ghi commit source chính xác, người kiểm tra, ngày, phiên bản OS, browser và công nghệ hỗ trợ, ngôn ngữ/theme/state, chuỗi thao tác, hành vi speech/focus quan sát được và tham chiếu bằng chứng. Chỉ dùng `passed` sau lượt chạy thủ công đó, `failed` khi quan sát lỗi, `blocked` khi thiếu môi trường hoặc scope chưa rõ. Giữ quan sát và bằng chứng lỗi; lượt kiểm lại là attestation mới. Trường trống vẫn pending.

Chạy `node _audit/ci/test-manual-at-matrix.mjs` để kiểm tra hình dạng record và từ chối hàng hoàn tất thiếu bằng chứng. Đây là kiểm tra tính toàn vẹn, không phải test screen reader hay chấp nhận AT. `_audit/a11y-gate.html` và `_audit/at-kit-probe.html` vẫn là proxy lập trình có verdict riêng.

Xuất bản chạy `node scripts/require-manual-at-publication.mjs`. Bản phát hành bị từ chối khi còn hàng AT-01–AT-16 chưa `passed` kèm bằng chứng. Hàng pending, failed và blocked không được xuất bản. Kiểm tra này không tạo ra quan sát thủ công.
