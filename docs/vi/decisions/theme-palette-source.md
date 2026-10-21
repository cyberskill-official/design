# Một nguồn biên soạn cho các bản sao bảng màu tối

`tokens/theme-palette-source.json` sở hữu 31 khai báo: 23 mục của tệp màu (kể cả `color-scheme`), ba màu component và năm shadow. Có 30 custom property. Phạm vi dark tường minh và dark theo hệ điều hành giữ 62 khai báo bản sao trong `tokens/colors.css`, `tokens/component-tokens.css` và `tokens/elevation.css`.

Sửa giá trị JSON rồi chạy `node scripts/generate-theme-palettes.mjs` trước bộ sinh element/theme. Lệnh kiểm tra là `node scripts/generate-theme-palettes.mjs --check`. Phép chiếu AST chỉ thay phần byte giá trị của khai báo thuộc quyền sở hữu. Selector, media condition, thứ tự, khoảng trắng và chú thích giữ nguyên. Lúc chuyển nguồn, cả ba tệp CSS giống từng byte; đây là hợp nhất nguồn, không đổi bảng màu. Không thêm import, thuộc tính hay fetch khi chạy.

Chỉ ba đường dẫn và hai ngữ cảnh bản sao được phép. Khai báo thiếu, đổi thứ tự, thêm hoặc mơ hồ gây lỗi. Đường dẫn lạ, traversal, symlink, giá trị sai kiểu và CSS chèn thêm bị từ chối trước khi ghi bất kỳ bản sao nào. Bộ phân giải element, bộ xuất theme và bộ chụp mode từ chối bản sao cũ. JSON nguồn và danh tính bộ sinh tham gia hash nguồn của mode độc lập. Snapshot CSS và `test-theme-palette-projection.mjs` chứng minh byte giống nhau, giữ tệp khi lỗi, khôi phục hash nguồn và truyền giá trị nguồn thực qua kênh resolver, hai phạm vi JSON và hằng dark của cả ba nền tảng native. Bằng chứng này xác nhận phép chiếu nguồn tất định, không bổ sung chấp nhận hình ảnh thủ công hay nền tảng native.

`VERSION` tiếp tục là nguồn duy nhất của stamp phát hành. Nguồn bảng màu chỉ có phiên bản schema, không sao chép ngày hoặc phiên bản phát hành. Trường phiên bản công khai của seed vẫn được giữ dưới dạng phép chiếu được sinh.
