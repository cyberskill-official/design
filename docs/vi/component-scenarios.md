# Kịch bản trạng thái component

`components/scenarios.json` là danh mục kiểm tra trạng thái có gắn nguồn. Danh mục lấy thành viên từ API công khai, dùng fixture tham chiếu HTML đã viết và suy ra miền hữu hạn từ declaration. `scripts/fixtures/component-scenarios.json` chứa kỳ vọng runtime cùng hash JSX/declaration làm bằng chứng. Thay đổi component không tự cập nhật bằng chứng này.

Phạm vi gồm fixture mặc định cho mọi component công khai; mọi giá trị khai báo của `variant`, `size`, `tone`, `status`, `state`, `mode`; tích variant × size được hỗ trợ của Button; mọi prop `disabled`, `error`, `errors` đã khai báo; và tám hợp đồng collection rỗng được viết rõ. Miền hữu hạn hoặc prop disabled/error mới khiến bước sinh thất bại cho đến khi có kỳ vọng. Hành vi rỗng ngoài tám collection vẫn chưa phân loại, không tự được tính là đã xác minh hay không áp dụng.

Với component có miền hữu hạn, cảnh mặc định bỏ các prop đó và kiểm tra default đã review, gồm ProgressBar không có variant và fallback alias của AlertDialog. Các mặc định khác giữ trạng thái fixture tham chiếu đã tài liệu hóa. Kỳ vọng kiểm tra thay đổi class/trạng thái thực, kích thước SVG, disabled/focus native, alert lỗi và liên kết mô tả, hoặc collection không còn dữ liệu. Cascader và TreeSelect chỉ cam kết mở popup rỗng, không tự tạo yêu cầu về thông báo rỗng. FormField dùng composition TextField đã tài liệu hóa. Mỗi cảnh được mount riêng bằng tiếng Anh và tiếng Việt; cleanup phải xóa floating host cũ trước khi cảnh mới nhận host của mình.

Chạy bằng toolchain Node/npm được khóa của repository:

```sh
node scripts/generate-component-scenarios.mjs
node scripts/generate-component-scenario-stories.mjs
node _audit/ci/test-component-scenarios.mjs
CS_TEST_BROWSER=chromium node _audit/ci/test-component-scenarios-browser.mjs
CS_TEST_BROWSER=firefox node _audit/ci/test-component-scenarios-browser.mjs
CS_TEST_BROWSER=webkit node _audit/ci/test-component-scenarios-browser.mjs
```

Generator hỗ trợ `--check` để kiểm tra freshness mà không ghi. Kiểm tra cấu trúc từ chối thiếu component/trạng thái, prop lạ, dữ liệu fixture không an toàn, bằng chứng nguồn cũ, symlink, đầu ra sai schema và fence story hỏng. Kiểm tra trình duyệt biên dịch nguồn thực và dùng axe 4.10.0 với toàn bộ rule cấu hình WCAG 2 A/AA, 2.1 A/AA, 2.2 AA. Ngưỡng thất bại serious/critical được giữ nguyên; báo cáo giữ mọi violation, incomplete và bằng chứng khả năng áp dụng. Sáu mutation trên nguồn component thực chứng minh default bị bỏ qua, variant bị bỏ qua, disabled bị bỏ qua, lỗi bị ẩn, collection rỗng bị bỏ qua và Button mất tên truy cập đều bị phát hiện.

Báo cáo gắn hash của mã nguồn đã biên dịch, runtime React, input compiler, đồ thị CSS/font, axe, helper và legacy bundle đã tải. Input đổi trong lúc chạy khiến kiểm tra thất bại. Receipt chỉ xác lập snapshot đã kiểm tra, không phê duyệt thay đổi hay thay thế lifecycle review.

Các trường hợp Error/Empty được hỗ trợ còn có CSF story có tên và `play` assertion riêng. Fence sinh tự động giữ chương trình CSF hiện có. Story popup Empty dùng `portal={false}` để assertion thuộc canvas; fixture audit kiểm tra riêng chế độ portal mặc định. Sau build Storybook, chạy `node _audit/ci/test-component-scenario-stories-browser.mjs [artifact-directory]` cho từng engine. Kiểm tra yêu cầu export thực trong index, play assertion hoàn tất và bằng chứng accessibility trên output đã đóng băng. Kết quả chỉ từ nguồn không chứng minh artifact Storybook đã đạt.

Đây là phạm vi trạng thái hữu hạn, không phải mọi tích Descartes của prop API. Nó bổ sung source facts và bằng chứng behavior/keyboard chính xác trong `components/specifications.json`, không biến các điều khoản role, focus, announcement hay keyboard chưa xác minh thành “không áp dụng”. Fixture tương tác thực, kiểm tra công nghệ hỗ trợ thủ công, review hình ảnh sản phẩm và chấp nhận của operator vẫn là bằng chứng riêng.
