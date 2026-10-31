# Ngữ pháp API component hiện tại

## Tương thích, phiên bản và ngừng hỗ trợ

Bản phát hành tuân theo Semantic Versioning: sửa lỗi giữ nguyên hợp đồng được hỗ trợ dùng bản vá, API công khai bổ sung yêu cầu bản minor, thay đổi không tương thích yêu cầu bản major. Quy tắc áp dụng cho điểm vào gói, các major của peer dependency được hỗ trợ, phần tử native nhận ref, hành vi bàn phím/focus và hợp đồng DOM/vị trí đã công bố, bên cạnh tên và kiểu prop. Phân loại theo tác động thực tế đến bên sử dụng; giữ nguyên tên export không làm thay đổi hành vi trở thành tương thích.

Việc loại bỏ hợp đồng công khai yêu cầu bản major **và đồng thời** ít nhất hai bản minor riêng biệt đã được phát hành cùng 90 ngày thông báo ngừng hỗ trợ được ghi nhận. Ngày tính theo lịch UTC. Nhiều bản vá trong cùng nhánh minor hoặc chỉ các bản major không được tính thành hai bản minor. Phải có hướng dẫn chuyển đổi và bằng chứng gắn với nguồn của các bản đã phát hành. Alias không có ngày, văn bản lịch sử hoặc thông báo chưa công bố không bắt đầu thời gian chờ; chính sách này không tự đánh dấu bất kỳ prop hiện có nào là deprecated.

Tệp nguồn `components/release-compatibility.json` ghi phiên bản cơ sở trước ứng viên, phân loại thay đổi đang chờ đã được rà soát, thông báo có ngày và bằng chứng phát hành. Các bước lập kế hoạch, xác minh ứng viên và xác minh tag thực thi quy tắc này cùng cổng duyệt hỗ trợ và định danh nguồn chính xác hiện có. Các thay đổi đã được chấp thuận về điểm vào mặc định đã biên dịch, bàn phím Menu theo APG và vị trí mặc định của floating panel được phân loại là breaking cho bản sửa đổi chưa phát hành; chuẩn bị bản vá/minor bị chặn. Điều này không gán định danh phát hành mới, duyệt bằng chứng hỗ trợ, tạo tag hay cho phép công bố. Trước chu kỳ sau, đối chiếu phiên bản cơ sở và các mục đang chờ với lần công bố thực tế đã được chấp nhận; không tự xóa lịch sử thông báo.

SegmentedControl giữ các alias ngữ nghĩa đã deprecated `role="tablist"` và `role="radiogroup"`. Khi bỏ qua `mode`, alias chọn phần tử con tab hoặc radio tương ứng; `mode` tường minh được ưu tiên và mặc định vẫn là radio. Giá trị role khác bị từ chối thay vì tạo ngữ nghĩa ARIA mâu thuẫn. Ưu tiên `mode="tabs"` hoặc `mode="radio"`. Đề xuất loại bỏ trước đây được lưu trong `_audit/remediation/segmented-role-removal-proposal-history.json`; đây không còn là thay đổi loại bỏ hiện tại. Việc từ chối role tùy ý vẫn được phân loại là breaking. Các trường thông báo tiếp tục bằng null: hướng dẫn cục bộ này không xác lập rằng đã công bố thông báo, ngày hay phiên bản. Mọi lần loại bỏ trong tương lai vẫn cần bản major sau hai bản minor riêng biệt đã được phát hành và 90 ngày thông báo được ghi nhận, cùng tất cả cổng phát hành khác.

Các dòng React được khai báo hỗ trợ hiện tại là 18.x và 19.x; fixture tiêu thụ gói và hydration kiểm tra các phiên bản đã ghim. Đây là phạm vi hỗ trợ theo major, không chứng minh mọi bản vá lịch sử hoặc cam kết cho major React chưa phát hành. Loại bỏ một dòng đã khai báo tuân theo cùng chính sách major và thời gian ngừng hỗ trợ. Major React mới phải được kiểm tra tương thích trước khi mở rộng peer range. Trình duyệt tiếp tục theo chính sách hai bản ổn định mới nhất trong hướng dẫn hỗ trợ trình duyệt; bằng chứng engine và thiết bị thực được báo cáo riêng.

Hợp đồng công khai cho export được chọn là bộ ba `.d.ts`, `.jsx`, `.prompt.md` cạnh nhau. `components/api-index.json` định vị khai báo và prop definition kế thừa; không chứng minh default, passthrough, hành vi hay chấp nhận của con người. Co-export công khai được ghi trong file component cha. Xác nhận source và browser test liên quan trước khi mở rộng hợp đồng.

## Quyền quản lý state và callback

Với component khai báo `value`, `defaultValue`, `onChange`, `value` là state controlled, `defaultValue` khởi tạo state local, `onChange` báo thay đổi. Đối số callback theo khai báo từng component: có thể là scalar, collection hoặc event. Không thay DOM event native cho callback khai báo trả giá trị. Không chuyển quyền quản lý controlled/local trong một lần mount. [Consuming](consuming.md) mô tả ngoại lệ hiện tại và tích hợp form.

Callback open-state dùng chung `onOpenChange(open)`. Dialog, Drawer, Tour, CommandPalette, Toast và Alert nhận callback này. `onClose` vẫn là alias không tham số được hỗ trợ và vẫn chạy sau `onOpenChange(false)`. `onDismiss` của Alert vẫn là handler click được hỗ trợ và vẫn chạy sau hai callback kia. Callback form được await chấp nhận kiểu trả về bất đồng bộ đã khai báo. Dùng khai báo của export được chọn thay vì giả định mọi component hỗ trợ bộ ba ownership.

## Composition, ref và attribute native

`children`, slot có tên, `label`, render callback có kiểu riêng từng component. Export chấp nhận `className` không tự động forward `id`, `style`, `data-*`, `aria-*`, handler native hoặc rest prop tùy ý. Xác nhận khai báo rõ ràng và runtime forward tới đúng DOM node trước khi phụ thuộc. Text lỗi hiển thị trong FormField không tự thiết lập quan hệ described-by cho composite input.

Export có phần tử native chuyển tiếp `ref` tới đích được mô tả; control riêng do component quản lý có `controlRef`. Provider chỉ có context không có ref DOM. Xem [ref native](native-refs.md) về đích, trạng thái null và callback React 18/19. Panel theo phần tử neo có [hợp đồng portal và vị trí tránh va chạm](floating-panels.md), cùng tùy chọn inline. Overlay manager hiện tại điều phối một stack toàn document; xem [quyết định overlay](../decisions/overlay-manager-design.md) trước khi dùng nhiều bundle hoặc root document độc lập.

## Tên, enum và accessibility

Từ vựng enum và size hiện tại khác nhau theo export. `danger`, `destructive`, `error` không phải alias thay thế tùy ý; `empty`/`emptyState` và `tone`/`variant` cũng vậy. Khi có alias, source xác định ưu tiên. Không đổi tên hay chuẩn hóa prop công khai thiếu quyết định tương thích/deprecation và contract test có mục tiêu.

Mỗi prop mới hoặc đổi cần source, declaration, prompt, ví dụ và kiểm tra hành vi khớp nhau. Giữ tên truy cập, role, keyboard và quyền focus qua thay đổi state. Tóm tắt keyboard trong prompt là bằng chứng mô tả; kiểm chứng với implementation và test. Lifecycle record và API inventory không thay kiểm tra accessibility trạng thái render hoặc [chấp nhận AT thủ công](manual-at-matrix.md).

[Hợp đồng source component](../../components/contracts.json) được sinh tách prop authored/kế thừa, giữ biểu thức default literal, khai báo keyboard từ prompt và định vị CSS hook cùng hash source. Sinh bằng `npm run build:component-contracts`; kiểm bằng `npm run test:component-contracts`. Đây là sự kiện source quan sát được, không phải anatomy authored đầy đủ, ngữ nghĩa ARIA hay hợp đồng accessibility đã kiểm chứng.

## Đích attribute tường minh và liên kết trường

Component có khai báo `rootProps` áp dụng bag vào phần tử hiện có, không thêm wrapper. Khai báo và prompt cạnh component nêu đúng đích và thuộc tính được bảo vệ. Drawer dùng dialog `div`; Popover và Tooltip dùng `span` ngoài; DataGrid dùng `div` cuộn; CommandPalette dùng dialog, không dùng lớp nền đóng. Attribute cấp cao hiện có giữ nguyên đích. OverlayProvider chỉ cung cấp context nên không có đích DOM.

`rootProps` ghép class/style và phối hợp handler: handler nội bộ chạy trước. Role, trạng thái, hành vi bàn phím và hình học do component quản lý được bảo vệ. Kiểu loại các khóa đó; runtime cũng chặn children, HTML injection, ref và khóa prototype khi caller bỏ qua kiểm tra kiểu. Dùng hợp đồng `ref`/`controlRef` tường minh của component; bag chỉ chứa thuộc tính.

Các trường tham gia khai báo thêm `controlProps`:

| Component | `rootProps` | `controlProps` |
|---|---|---|
| Combobox | Wrapper | Input combobox nhập liệu |
| DatePicker | Wrapper | Nút mở bộ chọn ngày |
| NumberField | Wrapper trường | Input số; passthrough native cũ vẫn vào input |
| Cascader, TreeSelect | Wrapper | Nút mở popup |
| TagInput | Wrapper | Input nhập văn bản |
| ColorPicker | Wrapper | Nút mở màu, không phải editor riêng |
| Rating | Radiogroup hiện có | Cùng radiogroup logic |
| InputOTP | Group hiện có | Cùng group; không sao chép một bag vào mọi ô số |

Tên tường minh được ưu tiên hơn tên dự phòng. FormField cung cấp tham chiếu label, hint và error cho các control tham gia; label trống giữ tên dự phòng theo ngôn ngữ. Mỗi control sinh ID riêng, kể cả nhiều control dưới một trường. Tham chiếu mô tả của caller được ghép và loại trùng với hint/error của trường và nội dung cục bộ. Số `0` là nội dung label/hint/error hợp lệ. Khi lỗi biến mất, liên kết lỗi được bỏ nhưng không xoá trạng thái invalid tường minh của caller.

```jsx
<FormField label="Dự án" hint="Chọn một dự án" error={error}>
  <Combobox
    options={projects}
    value={project}
    onChange={setProject}
    rootProps={{ 'data-analytics': 'project-field' }}
    controlProps={{ id: 'project-control', 'aria-describedby': 'project-policy' }}
  />
</FormField>
```

Các trường tham gia dùng độc lập nhận `description`, `error`, `required`. NumberField giữ `name`, FormData và kiểm tra required native. Nút không nhận `aria-required` hay khả năng constraint validation native; group InputOTP dùng chỉ dẫn required được liên kết. Rating biểu thị required trên radiogroup. Dùng rule của Form để kiểm tra giá trị trong controller. Không có giao thức ngầm gửi object đã chọn, ngày hay bộ chữ số bằng input ẩn. ID và tên từng ô InputOTP vẫn riêng biệt, có vị trí; hint/error của group được liên kết tới các ô.

Input/select/textarea native trong FormField nhận liên kết label và mô tả thật. Với custom control khác, FormField nhận hàm render cung cấp các attribute liên kết; áp dụng chúng vào control semantic. Cách này cung cấp liên kết, không tạo giao thức mới cho giá trị Form hay serialization.

Kiểm tra bằng `test-field-associations-browser.mjs`, `test-composite-field-targets-browser.mjs`, `test-native-root-targets-browser.mjs` và fixture kiểu/packed tương ứng. Kiểm tra tự động về liên kết và bàn phím không thay thế nghiệm thu thủ công với công nghệ hỗ trợ.

## Thông điệp theo scope và tham chiếu DOM

Dùng [thông điệp UI theo scope](locale-messages.md) để ghi đè nội dung và thêm namespace; fallback định dạng ngày/số và hướng chữ vẫn là hợp đồng riêng. [Tham chiếu HTML đã render](static-html-reference.md) ghi DOM fixture gắn với nguồn, gồm context và snapshot portal được mô tả; đây không phải widget tương tác độc lập hay đặc tả đầy đủ mọi trạng thái/khả năng tiếp cận.

## Bằng chứng sinh tự động và giới hạn phạm vi

`components/prompt-api.json` và mục Declared API có fence trong prompt tham chiếu prop/default từ inventory khai báo và runtime chuẩn. `components/specifications.json` tách quan sát JSX chính xác, ngữ nghĩa đã review có giới hạn và assertion được ánh xạ khỏi phần chưa xác minh. Slot ứng viên, chuỗi phím quan sát và fixture chạy thành công không chứng minh đặc tả hành vi hay trợ năng đầy đủ. Sau khi rebuild API/contracts, chạy `npm run build:prompt-api` rồi `npm run build:component-specifications`. Chạy `npm run test:component-behavior-evidence` riêng để thu và xác minh bằng chứng runtime; quyết định trong repo `docs/decisions/component-specification-evidence.md` ghi rõ giới hạn.

## Bản chiếu khám phá gọn

Bắt đầu khám phá bằng `components/api-discovery.json`: mọi export công khai, toàn bộ định nghĩa prop tự khai báo, đường dẫn/hash nguồn và declaration, nhãn lifecycle và trạng thái review hỗ trợ hiện tại. Bản chiếu giữ số prop kế thừa nhưng không chép định nghĩa kế thừa, signature dài hay lịch sử hỗ trợ; theo tham chiếu SHA-256 chính xác đến `components/api-index.json` và đọc declaration để có kiểu đầy đủ. Chạy `npm run build:api-discovery` sau khi tạo API index; `node scripts/generate-compact-api.mjs --check` từ chối đầu ra lỗi thời. Bản chiếu giảm chi phí đọc, không thay thế kiểm tra đầy đủ hay bằng chứng chấp nhận.

AlertDialog dùng tên chuẩn `tone` và giữ `variant` như alias tương thích. `tone` tường minh được ưu tiên; khi thiếu mới dùng `variant`. `destructive` chọn màu hành động nguy hiểm và focus ban đầu vào Cancel. `tone="default"` ưu tiên hơn `variant="destructive"`. Button `danger`, validation `error` và tên size riêng từng component vẫn là các miền giá trị khác nhau; dùng control Storybook sinh từ declaration, không tự đổi giá trị theo suy đoán. Không lên lịch bỏ alias nếu chưa tuân chính sách thông báo phía trên.
