# Ngữ pháp template trong browser

File `.dc.html` là source được diễn giải trong browser. Serve repository qua HTTP rồi mở trực tiếp entry template. `support.js` nạp React peer local, phân tích khai báo, mount template và cung cấp hàm đặt runtime prop. Đường này không cần compiler độc quyền. Source runtime tại `scripts/template-runtime/primitives/support.js`; `templates/_vendor/support.js` và bản sao mỗi template là output sinh. Chạy `node scripts/build-template-primitives.mjs` và `node scripts/sync-support-runtime.mjs` sau khi đổi source.

## Cấu trúc và binding

- `<x-dc>` chứa markup cần render. `<!-- @template name="…" description="…" -->` cung cấp metadata authoring.
- `<helmet>` chứa style tài liệu và script phụ thuộc, gồm `./ds-base.js`. URL vẫn tương đối; copy cây stylesheet, font, ảnh và runtime cần thiết cùng template.
- `<script type="text/x-dc" data-dc-script data-props="…">` khai báo `class Component extends DCLogic` có `renderVals()`. `data-props` là object JSON được escape cho HTML, mô tả control; enum hiện có `editor`, `options`, `default`, `tsType`, `section`. Control boolean dùng default boolean. Đây là lựa chọn hỗ trợ, không phải binding nội dung tùy ý.
- `renderVals()` trả scope binding. `this.props` giữ default ban đầu trộn với prop cung cấp. Binding toàn phần `{{ name }}` giữ kiểu giá trị; binding nằm trong chuỗi chuyển thành text. Hỗ trợ đường dẫn thuộc tính có dấu chấm; không hỗ trợ biểu thức tùy ý. Không chèn JavaScript không tin cậy vào logic template.
- `<sc-if value="{{ flag }}">` render con có điều kiện. `<sc-for list="{{ rows }}" as="row">` cần array và tạo alias cục bộ. Với control quanh hàng bảng, dùng `<template data-cs-dc-control="if|for" …>` inert để tránh parser HTML di chuyển node không hợp lệ trong bảng.
- `<x-import component-from-global-scope="CyberSkillDS.Logo">` resolve component từ global runtime. Prop, style và binding event được chuyển sang React prop. `hint-*` và `data-dc-*` là metadata authoring, không phải DOM prop.

Helper `ds-base.js` nạp stylesheet và bundle component sau khi cả hai React global sẵn sàng, cung cấp `window.CyberSkillDS`, thiết lập main landmark và đồng bộ ngôn ngữ tài liệu từ scope nội dung đã render. Đặt `lang="{{ langAttr }}"` ở wrapper nội dung ngoài cùng; trích dẫn lồng nhau có thể giữ ngôn ngữ riêng.

## Thay đổi runtime

Sau khi mount, dùng `window.__dcSetProps(window.__dcRootName(), {language: 'Tiếng Việt'})` nếu template khai báo lựa chọn đó. Kiểm tra `data-props` trước: nhiều template không có control ngôn ngữ. Giá trị tính bởi `renderVals()` có thể ghi đè prop cùng tên. `content-schema.json` mô tả lỗ nội dung trong source; không phải API nội dung tự động. Xem [schema nội dung](template-schema-v2.md).

Inventory từ source nằm tại `docs/template-inventory.json`. Sinh bằng `node scripts/generate-template-inventory.mjs`; kiểm tra freshness bằng `node scripts/generate-template-inventory.mjs --check`. Trường capability nêu đường triển khai và lệnh test, không khẳng định test đã pass hay được con người chấp nhận. Hash source và coverage khai báo làm drift hiện rõ.

## Ranh giới export và chấp nhận

Template tài liệu có `meta[name="omelette-owns-print"]` nạp toolbar Download trong repository: DOCX chỉnh sửa được và PDF raster snapshot. In browser là đường riêng cho trang phân trang có lớp text. CLI render portable được mô tả bên dưới khi có. Ghi PPTX (`gen_pptx`), tweak panel của host, `super_inline_html` và `check_design_system` cần công cụ ngoài. Lưu image-slot còn cần `window.omelette.writeFile`; preview static không cung cấp bridge đó.

Chạy `node _audit/ci/test-template-bootstrap-browser.mjs` cho mọi template trong manifest; thêm `--browser=firefox` hoặc `--browser=webkit` cho engine tương ứng. Test kiểm tra thứ tự bootstrap local, render và đồng bộ ngôn ngữ. Fidelity DOCX/PDF, nội dung tùy ý, visual review và chấp nhận accessibility thủ công vẫn riêng. `file://` không phải đường consume được hỗ trợ: dùng HTTP server để fetch, font và dependency tương đối hoạt động nhất quán.

## Render CLI

```sh
node scripts/render-template.mjs finance-invoice --output /tmp/cs-invoice-preview --props /tmp/invoice-props.json --format html
node scripts/render-template.mjs finance-invoice --output /tmp/cs-invoice-print --format pdf
```

File prop là object JSON chứa control runtime đã khai báo, ví dụ `{"language":"Tiếng Việt"}`. Output phải là thư mục mới ngoài repository; không ghi đè file có sẵn. HTML là snapshot trạng thái render đóng băng cùng bản sao resource, không phải export tương tác hoặc một file duy nhất. `--browser firefox|webkit` hỗ trợ snapshot HTML; PDF dùng Chromium print vì Playwright không có PDF writer cho hai engine kia. `receipt.json` ghi hash source, prop, engine và phạm vi. Dùng `--content /tmp/invoice-content.json` cho slot schema được adopt rõ ràng, ví dụ `{"clientName":"Công ty Ánh Dương","invoiceReference":"INV-CUSTOM"}`. Runtime từ chối slot source-only, control và kiểu sai; xem [content binding](template-schema-v2.md). Resource envelope cố ý rộng; đóng gói nhỏ hơn là quyết định riêng.

Serializer snapshot HTML hiện từ chối template `image-slot` vì nội dung shadow cần serializer riêng; dùng PDF hoặc preview browser live. Ranh giới fail-closed này tránh mất ảnh âm thầm.

Binding event DOM native với CSP hash tĩnh dùng `data-cs-on-click="{{ action }}"` hoặc `data-cs-on-keydown="{{ handleKey }}"`. Runtime chuyển thuộc tính inert này thành React event listener, không thực thi chuỗi handler HTML. Binding component không-native như `on-change` vẫn được hỗ trợ. Nguồn native `onclick`/`onkeydown` cũ vẫn có thể được diễn giải ở consumer tương thích, nhưng site build strict từ chối native handler attribute. Serializer DC dùng chung quản lý wrapper thực thi chính xác; `text/x-dc` là dữ liệu inert, không hash như code chạy trực tiếp.

Binding nội dung đã kiểm tra được mô tả trong [nội dung mẫu](template-content.md). Kênh nội dung giữ chuỗi giống số hoặc boolean dưới dạng chuỗi; ép kiểu prop điều khiển legacy vẫn tách biệt. Slot danh sách/bảng cần mô hình dữ liệu riêng.

Literal lặp lại có nguồn biên soạn chung tại `scripts/template-literals-source.json`: bản đồ 15 element cho mọi mẫu DC và 30 cặp câu EN/VI dùng chung khớp chính xác. `npm run templates:literals` chỉ cập nhật vùng literal AST có fence; `npm run test:template-literals` kiểm tra cả 85 mẫu, quyền sở hữu và độ lệch. Mẫu giữ giá trị inline và vẫn tự chứa. Nội dung riêng, mô hình locale và markup vẫn được biên soạn độc lập.
