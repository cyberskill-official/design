# Thông điệp giao diện theo phạm vi

`LocaleProvider` cung cấp nội dung giao diện cho các phần tử con và không tạo phần tử DOM. Import provider và `useMessages` từ `@cyberskill/design` (hoặc entry biên soạn tường minh `@cyberskill/design/source`). Prop `lang` và cơ chế kế thừa ngôn ngữ DOM của component vẫn chọn ngôn ngữ. Provider mang từ điển, không chọn ngôn ngữ.

```jsx
import {LocaleProvider, Pagination, useMessages} from '@cyberskill/design';

const messages = {
  Pagination: {en: {next: 'Continue'}, vi: {next: 'Tiếp tục'}},
  Checkout: {fr: {pay: 'Payer'}, en: {pay: 'Pay now'}},
};
function CheckoutCopy() {
  const t = useMessages('Checkout', 'fr-FR');
  return <p>{t('pay')}</p>;
}
function App() {
  return <LocaleProvider messages={messages}>
    <Pagination lang="en" pageCount={10}/>
    <CheckoutCopy/>
  </LocaleProvider>;
}
```

Tên namespace và khóa có sẵn nằm trong [registry tích hợp](../../components/_i18n/strings.js). Namespace ứng dụng có thể thêm khóa độc lập; `useMessages(namespace, lang)` yêu cầu ngôn ngữ tường minh. Đây là React hook: gọi vô điều kiện ở phạm vi component. Hàm tra cứu trả về có thể gọi có điều kiện. Nhãn và nội dung truyền trực tiếp vào component giữ thứ tự ưu tiên hiện có; từ điển thay đổi thông điệp tích hợp, không thay prop bất kỳ.

Với từng khóa, tra cứu lần lượt ngôn ngữ chính được yêu cầu, tiếng Anh rồi tiếng Việt. Trong mỗi ngôn ngữ, hệ thống kiểm tra provider gần nhất, các provider cha rồi bảng tích hợp. Vì vậy giá trị đúng ngôn ngữ ở cha được ưu tiên hơn bản tiếng Anh dự phòng ở con. Khóa thiếu trả lại chính tên khóa; chuỗi rỗng vẫn rỗng. Các provider ngang hàng độc lập; unmount provider sẽ gỡ nội dung ghi đè. Phạm vi lồng nhau có thể chủ ý ghi đè cùng namespace/khóa.

Thẻ ngôn ngữ dùng quy tắc chuẩn hóa hiện có: `fr-FR` và `fr-CA` cùng chọn `fr`; bí danh hiện có như `English` cũng được chuẩn hóa. Hai bí danh trùng ngôn ngữ chính trong cùng namespace gây lỗi, kể cả khi khác khóa. Khi cần nội dung theo vùng, hãy tách namespace ứng dụng; API này không thương lượng ngôn ngữ theo vùng.

`messages` phải là record thuần (prototype thông thường hoặc null), chứa record namespace, record ngôn ngữ và giá trị chuỗi. Tên rỗng, symbol, `__proto__`, `prototype`, `constructor`, thuộc tính accessor, giá trị không phải chuỗi và record không thuần đều bị từ chối. Kiểm tra dùng descriptor và không gọi getter của từ điển. Nội dung được render thành văn bản React thông thường; không có nội suy HTML hoặc hàm thông điệp thực thi.

Provider sao chép và đóng băng dữ liệu hợp lệ mà không sửa đối tượng của bên gọi hay registry tích hợp bất biến. Truyền **tham chiếu đối tượng `messages` mới** để cập nhật nội dung. Sửa đối tượng đã truyền không cập nhật snapshot. Dữ liệu sai gây lỗi trước khi tạo registry hợp lệ; ứng dụng có thể hiển thị React error boundary thông thường. Registry nằm trong context của provider, nên các React root và yêu cầu máy chủ độc lập không cài ghi đè toàn cục.

Đây là phần mở rộng thông điệp giao diện. API không mở rộng định dạng ngày/số, đổi quy tắc dự phòng của formatter, đặt `dir` hay thêm hỗ trợ bố cục RTL. Từ điển `fr` bổ sung có thể dịch thông điệp giao diện tích hợp trong khi formatter vẫn dùng cách dự phòng hiện có cho ngôn ngữ chưa hỗ trợ. Tên truy cập xuất phát từ thông điệp tích hợp thay đổi theo nội dung; vai trò, bàn phím và trạng thái vẫn do component quản lý. `LocaleProvider` không có DOM root, `rootProps`, đích ref hay thao tác bàn phím riêng.

Khai báo nằm tại [LocaleProvider.d.ts](../../components/i18n/LocaleProvider.d.ts). [Tham chiếu HTML tĩnh](static-html-reference.md) ghi rõ ranh giới chỉ cung cấp context; sao chép markup không mang theo hành vi provider.
