# Chính sách bảo mật

## Phạm vi

Kho mã này là một **hệ thống thiết kế tĩnh** (token, CSS, thành phần React, mẫu HTML, Storybook). Trong cây mã không có backend khi chạy, cơ sở dữ liệu hay API có xác thực.

## Báo cáo lỗ hổng

Vui lòng báo cáo riêng tư qua **GitHub Security Advisories** của [`cyberskill-official/design`](https://github.com/cyberskill-official/design/security/advisories/new). Không mở issue công khai cho báo cáo nhạy cảm.

<!-- BEGIN GENERATED SECURITY SUPPORT -->
## Dòng phát hành được hỗ trợ và mục tiêu phản hồi

| Dòng phát hành | Bảo trì bảo mật |
|---|---|
| Bản minor ổn định được xuất bản gần nhất, hiện là **1.7.x** | Việc phân loại và sửa lỗi bảo mật hướng đến dòng này. |
| Các dòng minor/major ổn định trước đó | Hướng dẫn nâng cấp; không cam kết chuyển ngược bản sửa lỗi. |
| Cây làm việc chưa phát hành và bản phát hành thử | Bằng chứng phát triển; không phải bản đã xuất bản được hỗ trợ. |

Ảnh chụp bản đã xuất bản gần nhất là **1.7.2**, được ghi nhận lúc
`2026-10-20T10:16:52.889912+00:00` từ npm registry chính thức. SHA-256 của ảnh chụp:
`6d840cde271d6422f89c0e1139919ba83c848881d869ae32ea07a5d461ebe91e`. Đây là danh tính xuất bản đã được ghi nhận, không phải truy vấn registry trực tiếp.
Cập nhật ảnh chụp và khối được sinh này sau một lần xuất bản được cho phép riêng;
thay đổi VERSION cục bộ không xác lập việc xuất bản hay hỗ trợ.

Chúng tôi đặt mục tiêu xác nhận đã nhận báo cáo riêng tư trong **10 ngày làm việc**,
theo cơ sở **nỗ lực tối đa trong khả năng**. Đây là mục tiêu xác nhận đã nhận, không
phải SLA hay thời hạn phân loại, khắc phục, phát hành hoặc công bố. Báo cáo có thể
cần điều tra thêm; chúng tôi phối hợp công bố với người báo cáo sau khi đánh giá
vấn đề và bản sửa có thể cung cấp. Mục tiêu này áp dụng cho việc báo cáo và phối hợp
liên quan đến gói hệ thống thiết kế này, không áp dụng cho ứng dụng của bên dùng
hoặc dịch vụ thượng nguồn.
<!-- END GENERATED SECURITY SUPPORT -->

Lockfile phát triển phân giải Vite **8.1.6**, phiên bản 8.1.x đã vá
[GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm).
Giữ kết quả audit toàn bộ dependency tách biệt với cập nhật cụ thể này; chỉ một mức
phiên bản tối thiểu không xác lập rằng các lần phân giải dependency trong tương lai đều an toàn.

Lockfile phát triển dùng Vite **8.1.6**, phiên bản 8.1.x đã sửa
[GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm).
Giữ kết quả audit toàn bộ dependency riêng với cập nhật cụ thể này; mức phiên bản
tối thiểu không chứng minh mọi lần phân giải dependency về sau đều an toàn.

## Bề mặt công khai

Trang được lưu trữ chủ động cung cấp công cụ cổng `_audit/` — Storybook Status nhúng `_audit/run.html` tràn khung. Hãy coi các bộ kiểm thử audit là tài liệu công khai, không phải mặt phẳng điều khiển riêng tư.

## Ngoài phạm vi

Ứng dụng bên dùng của bên thứ ba, sự cố chiếm quyền tài khoản Vercel/npm và lỗ hổng chỉ ảnh hưởng đến các nhánh fork không còn được bảo trì nằm ngoài cam kết khắc phục của chính sách này.
