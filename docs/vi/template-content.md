# Nội dung mẫu có kiểm tra

Runtime `.dc.html` hiện tại nhận nội dung chuỗi thuần được kiểm tra theo schema qua `window.__dcSetContent(rootName, content)` hoặc tệp JSON của tùy chọn CLI `--content`. Năm trường hóa đơn/báo giá hiện có được giữ lại. Đợt này thêm 487 liên kết: 376 trường văn bản trực tiếp, 41 trường khai báo rich-text nhưng chiếu thành chuỗi thuần, 6 trường lời kết và 64 trường thuộc tính/prop vô hướng. Tổng cộng có 492 trường được liên kết trong 33 mẫu, thuộc 42 sidecar chứa 517 trường. Đây là phạm vi đã áp dụng, không có nghĩa mọi mẫu đều nhận toàn bộ dữ liệu từ bên ngoài.

```js
window.__dcSetContent(window.__dcRootName(), {
  heroH: 'Sản phẩm đội ngũ của bạn có thể sử dụng',
  heroP: 'Hỗ trợ song ngữ và bàn giao rõ ràng.',
});
// Khôi phục nội dung mặc định theo ngôn ngữ của mẫu.
window.__dcSetContent(window.__dcRootName(), {});
```

Ví dụ dùng `marketing-page`. Chỉ truyền ID có `runtimeBinding: "text"` trong `content-schema.json` cạnh mẫu. Trường `richtext` đã chọn cơ chế này vẫn nhận **chuỗi thuần nguyên văn**: không diễn giải HTML, markdown hay biểu thức thực thi. `closeH` và `closeP` là chuỗi lời kết được tính sẵn, không phải hàm đóng giao diện.

Mỗi giá trị phải là chuỗi không vượt `maxLength` tính bằng mã điểm Unicode; trường bắt buộc không nhận chuỗi trắng. Runtime từ chối trường lạ, trục giao diện, điều khiển, handler, mô hình, hàm, khóa prototype nguy hiểm, accessor, khóa symbol, ký tự không hợp lệ trong XML 1.0 và UTF-16 lỗi trước khi thay nội dung đã chấp nhận. Việc kiểm tra đọc descriptor và không gọi getter. Một trường chỉ thay được chính giá trị chuỗi đã tính của nó, không thay hàm hay trạng thái. Lỗi kiểm tra giữ nguyên nội dung trước đó. Runtime sao chép sang record mới; sửa object phía gọi sau đó không tự cập nhật mẫu.

Nội dung do phía gọi quản lý và được giữ khi đổi ngôn ngữ cho đến khi thay hoặc đặt lại. `language`, `theme`, element và các điều khiển hành vi tiếp tục thuộc API prop đã khai báo. Danh tính tài liệu, tính tiền, quyết định pháp lý và dòng dữ liệu có cấu trúc thuộc mô hình riêng. 25 trường chưa liên kết là mô hình list/table; chúng cần mô hình có cấu trúc rõ ràng thay vì ghép chuỗi.

Trường dùng thuộc tính còn khai báo `runtimeTargets` chính xác. Runtime đối chiếu tag, component và thuộc tính thực tế với metadata và danh sách cho phép đã rà soát. Phạm vi gồm prop văn bản của component, nhãn truy cập native và placeholder của image-slot; URL, sự kiện, hàm, thuộc tính tùy ý và nội suy một phần thuộc tính vẫn bị cấm. Trường cung cấp tên hoặc nhãn điều khiển/phần nội dung có `minLength: 1` và `semanticReason`; chuỗi rỗng hoặc toàn khoảng trắng bị từ chối dù trường nghiệp vụ không bắt buộc. Chuỗi giống số/boolean như `007` hay `false` vẫn là chuỗi. Placeholder ảnh liên kết cả hai thuộc tính ngôn ngữ với giá trị đã bản địa hóa hiện có, giữ mặc định và cho phép ghi đè ở cả hai ngôn ngữ. Văn bản này nằm trong shadow DOM.

Dùng renderer hiện có và thư mục đầu ra mới:

```sh
node scripts/render-template.mjs marketing-page --content copy.json --output /tmp/custom-page --format pdf
```

`--format html` tạo snapshot đã render trong phạm vi serializer hiện hỗ trợ; shadow DOM của image-slot vẫn cần PDF hoặc bản xem trước trong trình duyệt. In PDF qua trình duyệt chỉ được kiểm tra bằng Chromium. Nút xuất tài liệu vẫn tùy từng mẫu; kiểm tra trực tiếp serializer DOCX không thêm menu xuất cho mẫu ứng dụng và không xác nhận độ trung thực trong Microsoft Office.

Kiểm tra bao phủ 428 phép chiếu văn bản trực tiếp bằng tiếng Anh và tiếng Việt, gồm trạng thái lỗi/chat/thông báo/collapsible, chuỗi Unicode giống HTML nguyên văn, XML DOCX hợp lệ và bố cục in. Byte PDF thực tế từ Chromium được phân tích để xác nhận văn bản hiện trong chế độ in; phần điều hướng cố ý ẩn khi in được ghi riêng. Lưới chỉ số của board-deck dùng cột bằng nhau có thể co và ngắt dòng để giá trị runway dài hợp lệ không đẩy chỉ số thứ tư ra khỏi trang in. Hình học với nội dung ngắn mặc định được kiểm tra riêng, cùng mutation tái hiện lỗi bố cục cũ.

Kiểm tra riêng trên ba engine bao phủ cả 64 trường đích vô hướng: prop component thực nhận, thuộc tính native, văn bản shadow, tên truy cập của điều khiển đang hiện, kiểm tra dữ liệu và chuỗi giống số/boolean. Placeholder và nhãn truy cập không trở thành văn bản thân tài liệu; nội dung dialog đang ẩn hoặc giao diện bị loại khi in không được cam kết xuất hiện trong DOCX/PDF.

Để kiểm tra văn bản PDF, dùng Python 3.11+ trong môi trường cô lập với dependency kiểm thử khóa hash:

```sh
python3 -m venv /tmp/cs-pdf-tests
/tmp/cs-pdf-tests/bin/python -m pip install --require-hashes --only-binary=:all: --no-deps -r _audit/ci/requirements-pdf.txt
CS_PDF_PYTHON=/tmp/cs-pdf-tests/bin/python node _audit/ci/test-template-content-adoption-browser.mjs
```

Kiểm tra thất bại nếu thiếu đúng phiên bản parser. Dependency Python chỉ dùng cho kiểm thử có tín hiệu rà soát rủi ro riêng; npm audit thành công không bao phủ nó. Kiểm tra render/xuất tự động không thay thế đánh giá truy cập thủ công, hình ảnh sản phẩm hoặc ứng dụng Office đích.
