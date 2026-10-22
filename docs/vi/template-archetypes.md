# Khung mẫu dùng chung

Phép chiếu có phạm vi hiện tại sở hữu tiêu đề loại tài liệu tài chính trong Invoice và Quote: một vai trò kiểu dáng sẵn có cùng tiêu đề tiếng Anh và tiếng Việt riêng. Nguồn chuẩn là `scripts/template-archetypes-source.json`; `scripts/generate-template-archetypes.mjs` chiếu nguồn vào từng thư mục độc lập. HTML mặc định hiện có giữ nguyên từng byte. Không thêm phụ thuộc runtime.

## Biên soạn và kiểm tra

Sửa kiểu dáng/nội dung chuẩn, sau đó chạy:

```sh
node scripts/generate-template-archetypes.mjs
node scripts/generate-template-archetypes.mjs --check
```

Bộ sinh chỉ sở hữu thuộc tính style và văn bản thuần của tiêu đề loại tài liệu đầu tiên trong mỗi nhánh ngôn ngữ đã khai báo. Bộ sinh kiểm tra cấu trúc tiêu đề/phần bao hiện có, từ chối metadata lạ, markup lồng, biểu thức, đường dẫn không an toàn và symlink ở đầu ra/thư mục cha, đồng thời kiểm tra toàn bộ đầu ra trước khi ghi bất kỳ tệp nào. Thay đổi kiểu dáng đến cả hai chủ thể ngôn ngữ trong cả hai tài liệu. Mọi byte nguồn khác vẫn được biên soạn tại chỗ.

## Ranh giới ngôn ngữ

Kiểm kê đầy đủ ghi nhận 24 mẫu và 39 cặp nhánh. Bảy cặp có thẻ và thuộc tính khớp nhau sau khi tính đến phần bao tiếng Việt và vạch phân cách song ngữ hiện có. Hai mươi mốt cặp chỉ khác chiều cao dòng; ba cặp còn dịch thuộc tính khả năng tiếp cận; tám cặp có khác biệt cấu trúc/kiểu dáng khác đã được biên soạn. Chúng gồm việc căn nội dung tiếng Việt, nhóm in, ghi chú pháp lý/tài chính và bố cục bảng. Hai nhánh nói về chủ đề tương tự không khiến chúng trở thành các mẫu thay thế lẫn nhau.

Invoice và Quote khai báo giao diện tiếng Anh và tiếng Việt; không khai báo chế độ Both. Nội dung nghiệp vụ, giá trị tài chính, văn bản pháp lý và bố cục riêng theo ngôn ngữ nằm ngoài khung này. Thư mục ngoại tuyến giữ HTML đã sinh và trình thông dịch DC hiện tại. Registry thông điệp giao diện thành phần không thay thế văn bản nghiệp vụ/pháp lý của mẫu.

## Giới hạn bằng chứng

Kiểm tra tập trung bao phủ sự đồng nhất toàn bộ HTML gốc, pixel màn hình/in, ảnh chụp cây khả năng tiếp cận, XML/media DOCX và việc truyền thay đổi từ nguồn trong ba engine. So sánh văn bản PDF thực sự được tạo dùng Chromium và parser đã ghim phiên bản. Các kiểm tra này không cấp phê duyệt bản dịch kế toán/pháp lý hay chấp nhận Office thủ công.
