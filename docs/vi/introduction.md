# Hệ thống thiết kế CyberSkill

Storybook là **giao diện sản phẩm** tại `design.cyberskill.world` (`/`). Thanh bên dẫn tới Docs, Foundations, Components, **Templates**, **Pages**, Release Notes và Status. Các trục trên thanh công cụ khớp với môi trường sản phẩm: **Theme × Element × Language × Style**.

## Dành cho ai

Người vận hành và người bảo trì khám phá hệ thống trực tiếp. **Ứng dụng sản phẩm không phụ thuộc vào Storybook** — ứng dụng dùng `styles.css` cùng `_ds_bundle.js`, entry ESM mặc định đã biên dịch của gói (có entry mã nguồn riêng), hoặc `_esm/cs.mjs` cũ. Atomic View di động nằm tại `guidelines/atomic-view.html` (công khai trong **Templates → Gallery**; cũng có trong **Maintainer** để chạy các cổng kiểm tra).

## Thanh bên

| Nhóm | Nội dung |
|---|---|
| **Docs** | Hướng dẫn công khai — sử dụng, triển khai, quy ước, kiểu dáng, sản phẩm, schema, Figma, tương phản, giọng văn và các trục |
| **Foundations** | Màu sắc, chữ, khoảng cách, độ nổi, chuyển động và nguyên tố |
| **Components** | Thư viện CSF đầy đủ với Default và các ma trận điều khiển |
| **Templates** | Tất cả mẫu khởi đầu trong [danh mục mẫu hiện hành](../reference-catalog.json) (Atomic gallery và các nhóm, gồm HR Suite `vn-*`) |
| **Pages** | UI kit — Status Hub, Marketing site, Slide deck |
| **Release Notes** | Nội dung sản phẩm được biên tập (không phải bản chép git; **không có CHANGELOG.md**) |
| **Status** | Bảng cổng kiểm tra (`_audit/run.html`) nhúng toàn khung |
| **A11y / I18n** | Mẫu kiểm tra khả năng tiếp cận và các cặp song ngữ |
| **Maintainer** | Các giao diện HTML di động cho cổng kiểm tra và bản trình diễn |

## Bắt đầu

1. **Docs → Consuming** — tích hợp qua stylesheet, bundle hoặc ESM
2. **Foundations → Elements** — các bộ nhận diện Ngũ Hành
3. **Components** — chọn thành phần chính và mở ma trận của nó
4. **Templates → Gallery** — tầng Templates của Atomic View (hoặc **Templates → HR** cho bộ tài liệu lao động)
5. **Status** — chạy bảng cổng kiểm tra nhanh (tự chạy khi tải lần đầu; dùng **Re-run** khi cần)

Phiên bản hiện hành được ghi tại [VERSION](../../VERSION). Chuẩn bị phát hành là thao tác thủ công rõ ràng; xuất bản cần được cho phép riêng. Tính liên tục dựa trên lịch sử git cùng Release Notes đã biên tập — không dùng tệp `CHANGELOG.md`.
