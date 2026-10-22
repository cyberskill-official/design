# Bốn trục

Hệ thống thiết kế cung cấp bốn trục **độc lập** — cùng các điều khiển trên thanh công cụ Storybook (**Theme** · **Element** với tất cả bộ đã khai báo · **Language** · **Style**):

1. **Theme** — `data-theme` — light (mặc định) · dark · **system** (`prefers-color-scheme` của hệ điều hành)
2. **Element** — `data-cs-element` (+ `data-cs-variant` tùy chọn) — nhận diện sản phẩm Ngũ Hành: Kim · Mộc · Thủy · Hỏa · Thổ, các bộ khai báo trong [danh mục hiện hành](../reference-catalog.json) nằm trên thanh Element (cùng tập hợp với **Foundations/Elements**, Atomic View và các ánh xạ EL của mẫu)
3. **Language** — `lang` — `en` · `vi` (xem **I18n**)
4. **Style** — `data-cs-style` — hiện có duy nhất `liquid-glass` (không khai báo ≡ liquid-glass)

Đặt các trục trên phần tử chứa cho những thành phần sử dụng phạm vi này. Mức hỗ trợ của từng mẫu được khai báo trong `docs/reference-catalog.json` (số lượng công bố); tài liệu in tĩnh, UI kit và tài liệu có ngôn ngữ cố định có ranh giới được ghi rõ. Đổi ngôn ngữ cũng cần nội dung đã dịch và trình dựng chọn nội dung đó:

```html
<body data-theme="dark" data-cs-element="thuy" data-cs-variant="ocean" data-cs-style="liquid-glass" lang="vi">
  <!-- scoped components; provide content in the selected language -->
</body>
```

Mặc định của Storybook: `light · tho · vi · liquid-glass`.

## Nên làm

- Đặt phạm vi trục trên **phần tử chứa** và để cơ chế cascade hoạt động
- Dùng `--cs-accent-*` cho nội dung phụ thuộc nguyên tố
- Dùng registry EN·VI cho giao diện thành phần; cung cấp nội dung tiêu dùng đã dịch
- Kiểm tra những tổ hợp có ý nghĩa — các trục nhân độc lập
- Giữ các ghi đè giao diện tối trong hệ token
- Giữ các bộ Style trong danh sách cho phép (`_audit/style-contract.html`)

## Không nên làm

- Không viết cứng mã hex của nguyên tố
- Không dùng chữ/viền brand-umber trên bề mặt đổi theme mà thiếu ghi đè tối
- Không đổi màu trạng thái ngữ nghĩa hoặc quầng focus Ochre theo nguyên tố
- Không trộn hai màu nhấn nguyên tố làm chính + phụ (chỉ dùng lớp chuyển màu theo Tương sinh)
- Không viết giao diện thành phần cố định một ngôn ngữ
- Không tạo bộ Style thứ hai khi chưa theo checklist Expansion Rule
