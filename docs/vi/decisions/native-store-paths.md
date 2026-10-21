# Phạm vi đầu vào workflow native-store

Workflow `native-store` dùng cùng tám mẫu đường dẫn nguồn native đã khai báo cho pull request và push lên `main`; chạy thủ công vẫn được giữ lại. Thay đổi tài liệu, template hoặc component không liên quan không cần khởi chạy đóng gói mẫu native. Các đầu vào mẫu native/token, công thức font, dry-run/verdict/kiểm thử, workflow và package gốc vẫn thuộc bộ lọc.

Thay đổi chỉ thêm `pull_request.paths`; job, cơ chế soft-skip khi thiếu bí mật ký, quyền chỉ đọc và tải báo cáo không đổi. Workflow kiểm tra đóng gói mẫu, không gửi ứng dụng lên store. Không đặt workflow có bộ lọc đường dẫn làm kiểm tra bắt buộc vô điều kiện cho thay đổi không liên quan: GitHub có thể giữ trạng thái chờ khi workflow bị bỏ qua.

Chạy `node _audit/ci/test-native-store-paths.mjs` để kiểm tra bộ lọc PR/push trùng khớp và các ca âm tính cho đường dẫn thiếu/quá rộng/bị lệch hay kiểm tra native bị vô hiệu hóa/cho phép thất bại. Đây là bằng chứng hợp đồng nguồn, không phải lần chạy Actions thực tế hay nghiệm thu store.
