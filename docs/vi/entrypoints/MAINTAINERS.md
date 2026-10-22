# Người bảo trì và lộ trình đóng góp

Stephen Cheng là chủ sở hữu chịu trách nhiệm và người bảo trì tạm thời. Sổ đăng ký
danh tính và vai trò là `components/maintainers.json`; `.github/CODEOWNERS` định tuyến
tất cả đường dẫn đến tài khoản GitHub đã được xác minh của anh. Điều này không bổ nhiệm
người rà soát khác, không tạo ra một lượt rà soát độc lập và không bật quy tắc bắt buộc
rà soát trên GitHub.

Người đóng góp có thể báo lỗi tái hiện được, đề xuất thay đổi có phạm vi rõ ràng kèm
bằng chứng về hợp đồng/kiểm thử/tài liệu, rồi duy trì một khu vực đã thống nhất thông qua
các đóng góp được rà soát. Để trở thành người bảo trì hoặc người duyệt hỗ trợ, phải có
quyết định bổ nhiệm tường minh của chủ sở hữu được ghi trong sổ đăng ký; số lần đóng góp
và việc tác tử triển khai không trao quyền đó. Báo cáo bảo mật tuân theo
`SECURITY.md`, còn các bước đóng góp tuân theo `CONTRIBUTING.md`.

Lần kiểm tra quyền truy cập GitHub được ghi nhận là ảnh chụp tại một thời điểm,
không phải cơ chế theo dõi quyền liên tục. Kiểm tra lại điều kiện trước khi đổi
định tuyến hoặc dựa vào quyền này để phát hành. Cấu hình bảo vệ nhánh main được quan sát
bắt buộc có `fast-gates` và `docs-consistency-blocker`; các thiết lập trả về không
bắt buộc rà soát pull request hay phê duyệt của Code Owner. Chính sách bắt buộc rà soát
và việc thay đổi bảo vệ từ xa vẫn là hành động riêng của chủ sở hữu. Các yêu cầu hiện hành
về rà soát trực quan sản phẩm, bằng chứng khả năng tiếp cận thủ công và quyền đẩy mã/
triển khai/hợp nhất tường minh vẫn có hiệu lực.
