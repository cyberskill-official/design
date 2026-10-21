# Dữ liệu mode native có kiểu và lựa chọn tường minh

`CSModes.swift`, `CSModes.kt` và `cs_modes.dart` bổ sung API dữ liệu bên cạnh hằng `CSTokens` phẳng hiện có. Không thay tên, kiểu, giá trị hay tệp cũ. Chạy `node scripts/generate-native-mode-packs.mjs` sau khi mode độc lập chuẩn đã cập nhật; dùng `--check` để kiểm tra chỉ đọc.

Người gọi phải chọn mọi trục: theme, color scheme, element, variant, density, contrast và style liquid-glass hiện có. Element null chọn bảng màu mặc định một cách tường minh; variant null chọn biến thể giữa. Theme light/dark phải khớp color scheme. Theme system cần chỉ định nhánh light/dark. Tổ hợp element/variant không hợp lệ bị từ chối. Không tự phát hiện hệ điều hành, mặc định trục bị thiếu hoặc suy đoán giá trị dự phòng.

Ví dụ Swift:

```swift
let pack = try CSModes.resolve(
  theme: .system, colorScheme: .dark,
  element: .hoa, variant: .plasma,
  density: .compact, contrast: .high, style: .liquidGlass)
let surface: CSColorValue = pack.colorSurfacePanel
let height: CSDimension = pack.componentButtonMdMinHeightAlias
```

Kotlin dùng cùng đối số bắt buộc với `CSTheme.SYSTEM`, `CSColorScheme.DARK`, `CSElement.HOA`, `CSVariant.PLASMA`, `CSDensity.COMPACT`, `CSContrast.HIGH`, `CSStyle.LIQUID_GLASS`. Dart dùng đối số có tên bắt buộc và tên enum camelCase như Swift. Lựa chọn không hợp lệ ném `CSModeError.invalidSelection` ở Swift, `IllegalArgumentException` ở Kotlin hoặc `ArgumentError` ở Dart. Mã Dart cần null safety (Dart từ 2.12); đây là yêu cầu ngôn ngữ, không phải xác nhận mọi phiên bản Flutter.

Mỗi pack có 194 getter có kiểu và 12 bản ghi loại trừ từ tài liệu chuẩn tương ứng. Số này khác 197 thành viên root portable: ba thành viên dùng em bị loại, và chín khai báo material/identifier được phân loại riêng cũng là loại trừ tường minh. Mỗi bản ghi giữ tên, lý do và CSS đã phân giải. Bí danh kebab mới có tên native hậu tố `Alias`, cùng giá trị với tên cũ.

Màu giữ kênh sRGB hoặc OKLAB, kể cả giá trị ngoài sRGB. Kích thước giữ px/rem, thời gian giữ ms/s, font giữ danh sách theo thứ tự và đường cong giữ đủ bốn tọa độ. Shadow giữ lớp có kiểu với màu, độ lệch, blur, spread; một lớp được chuẩn hóa thành danh sách một mục. Font dạng chuỗi đơn cũng thành danh sách một mục. Không tự quy đổi rem, px sang point/dp, cắt gamut, ánh xạ font động hay dựng shadow trên widget. Shadow chuẩn hiện không có inset; trường bổ sung/inset gây lỗi trước khi ghi thay vì bị bỏ. Adapter UI nền tảng và chấp nhận giao diện là công việc riêng.

Chia sẻ cấu trúc lưu 389 giá trị có kiểu và 128 hàng cho 256 lựa chọn. Ba tệp độc lập khoảng 645 KB; `mode-provenance.json` ghi dung lượng và hash chính xác. Không cần đọc JSON hoặc tài nguyên bên ngoài khi chạy.

`test-native-mode-packs.mjs` kiểm tra nguồn chuẩn, giữ tệp cũ, đọc dữ liệu literal/vị trí getter từ mã Kotlin/Dart thực và so sánh mọi giá trị, loại trừ, mutation và bảo toàn đầu ra khi lỗi. Đây là kiểm tra mã nguồn. `test-native-mode-swift.mjs` bắt buộc compiler Swift thật, thực thi 49.664 getter, 1.584 tổ hợp trục và mutation đã biên dịch; số Double được so sánh chính xác theo bit. Biên dịch/thực thi Kotlin/Compose và Dart/Flutter chưa được xác minh khi thiếu toolchain; kiểm tra nguồn không thay thế việc chấp nhận đó. Bằng chứng Swift xác nhận dữ liệu trên compiler/SDK đã thử, không xác nhận UI native, thiết bị hay tiếp cận thủ công.

Hàng chỉ số Kotlin dùng literal CSV số nguyên được kiểm tra rồi giải mã thành danh sách, tránh đặt hàng chục nghìn literal chỉ số vào một initializer JVM. Lựa chọn sinh mã có giới hạn này dựa trên [giới hạn độ dài mã phương thức JVM](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.7.3), không thay thế biên dịch Kotlin thật.
