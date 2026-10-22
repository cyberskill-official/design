# Hỗ trợ trình duyệt

Mục tiêu web được hỗ trợ là hai bản ổn định mới nhất của Chrome, Firefox, Safari và iOS Safari. Chủ sở hữu chọn chính sách cuốn chiếu này ngày 2026-10-20. `package.json` ghi bốn truy vấn Browserslist; dữ liệu caniuse đã cài chỉ cho snapshot tái lập, không phải dịch vụ phiên bản trực tiếp.

## Khả năng cần có

Hệ thống dùng `color-mix(in oklab, ...)`, container query inline-size, `:has()`, `text-wrap: balance` và `inert` gốc. Các tính năng này có trước mốc hỗ trợ đã chọn trong [dữ liệu tương thích MDN được ghim](https://github.com/mdn/browser-compat-data/tree/12bc0268c7fe89a4b23fab5c54702c1fb9c34f7a). Bản ghi nguồn ở `_audit/remediation/browser-compatibility-source.json`. Không cam kết fallback trình duyệt cũ hay polyfill `inert`.

Với mốc hai bản ổn định mới nhất đã chọn, `inert` gốc có sẵn và không cần polyfill `inert`. Tính năng được bổ sung từ Chrome 102 ([ghi chú phát hành Chrome](https://developer.chrome.com/blog/new-in-chrome-102)), Firefox 112 ([ghi chú phát hành dành cho nhà phát triển Mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/112)) và Safari 15.5 trên macOS, iOS và iPadOS ([ghi chú phát hành WebKit](https://webkit.org/blog/12669/new-webkit-features-in-safari-15-5/)); [Tiêu chuẩn HTML](https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute) quy định hành vi gốc. Đây là kết luận về khả năng có sẵn của tính năng trong mốc đã công bố, không phải chứng nhận từng bản trình duyệt thuộc mốc đó, hành vi focus trên thiết bị thật hay hành vi với công nghệ hỗ trợ. Mục tiêu cũ hơn nằm ngoài cam kết này và cần fallback được kiểm chứng riêng.

`_audit/lib/browser-capabilities.mjs` cung cấp kiểm tra khả năng và guard báo lỗi rõ ràng. Đây là chẩn đoán tùy chọn; import CSS/component không tự cài polyfill hay giấu nội dung. Consumer nhắm engine cũ phải xác định và kiểm chứng fallback riêng.

## Kiểm chứng và giới hạn

`npm run test:browser-capabilities` kiểm tra chính sách, nhánh lỗi và hành vi màu/container/selector/ngắt dòng/focus trong Chromium, Firefox và WebKit Playwright đã cài. Kết quả ghi phiên bản engine và truy vấn Browserslist đã giải. WebKit không phải lần chạy trên Safari hoặc thiết bị iOS thật. Bản ổn định trước, thiết bị thật, tương phản cao của OS, công nghệ hỗ trợ, chấp nhận thị giác và ứng dụng native cần bằng chứng riêng. Suite tự động không chứng nhận mọi phiên bản lịch sử mà chính sách bao hàm.

Rà soát dữ liệu và runtime trình duyệt khi cập nhật dependency. Chính sách hỗ trợ là mục tiêu kỹ thuật; probe qua chỉ là bằng chứng khả năng trong phạm vi đã đo.
