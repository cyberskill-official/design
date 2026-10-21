# Template content-schema v2 — content slot có kiểu

Metadata thuần additive, opt-in: sidecar `templates/<slug>/content-schema.json` cạnh `.dc.html` của template, khai báo **kiểu** của mỗi `{{ hole }}` đã có trong template — để agent nhận diện hole và metadata trước khi sửa mã nguồn template. Metadata mặc định không bind; slot chuỗi thuần và mô hình hiển thị có cấu trúc, giới hạn rõ ràng được adopt dùng API nội dung có validation bên dưới. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Thêm metadata không cần đổi markup template.** `id` của slot là tên hole đã dùng trong `.dc.html` (ví dụ `{{ heroH }}`) và đã bind trong `renderVals()` của logic class — schema chỉ mô tả nó.

## Hình dạng

```json
{
  "$schemaVersion": "2.0",
  "template": "marketing-page",
  "slots": [
    { "id": "heroH", "type": "text", "label": "Hero headline", "maxLength": 70, "required": true },
    { "id": "heroP", "type": "richtext", "label": "Hero paragraph" },
    { "id": "svcKicker", "type": "text", "label": "Services eyebrow", "maxLength": 40 }
  ]
}
```

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| `$schemaVersion` | có | `"2.0"` cho spec này |
| `template` | có | khớp tên thư mục `templates/<slug>/` |
| `slots[].id` | có | phải bằng một hole `{{ id }}` thật trong `.dc.html` sibling |
| `slots[].type` | có | một trong: `text`, `richtext`, `image`, `link`, `list`, `table`, `date`, `number` |
| `slots[].label` | có | đọc được bởi người, cho UI điền nội dung |
| `slots[].maxLength` | không | metadata text/richtext; giới hạn Unicode code point cứng với text runtime đã adopt |
| `slots[].required` | không | mặc định `false` |
| `slots[].runtimeBinding` | không | `"text"` adopt chuỗi thuần; `"number"` chỉ adopt hợp đồng chiều rộng phần trăm hữu hạn; `"structured"` adopt mô hình list/table giới hạn chính xác. Mỗi loại cần metadata giới hạn/mô hình/đích tương ứng |
| `slots[].i18n` | không | `{"en": "...", "vi": "..."}` — cho template ship biến thể EN·VI |

Hình dạng máy kiểm được chính thức nằm ở `templates/schema/content-schema.schema.json` (JSON Schema draft-07). `_audit/template-schema-test.html` validate mọi sidecar tồn tại — hai chiều với content hole đủ điều kiện: mọi slot id khai báo phải là content hole trong `.dc.html`, và mọi content hole phải xuất hiện thành slot — **và ép độ phủ**.

## Hole nào đủ điều kiện có schema

Một `{{ hole }}` là **content hole** (đủ điều kiện schema) trừ khi nó là:

- hole **trục / control-flow** — `rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `dirAttr`, `true`, `false`, bất kỳ tên nào khớp `is<ChữHoa>` (`isEN`, `isVN`, `isBoth`, `isTable`, …), hoặc một số nguyên trần;
- hole **tweak boolean** — bất kỳ tên nào khớp `show|hide|has|enable|with` + `<ChữHoa>` (`showLogo`, `showSignatures`, `showQuote`, …);
- hole **runtime-control** — wiring chọn UI / handler: tên đúng `tabs`, `tab`, `lens`, `chatOpen`, `closeChat`, `dangerOpen`, `closeDanger`, hoặc bất kỳ tên nào khớp `set|open` + `<ChữHoa>` (`setTab`, `setLens`, `openChat`, …).

Chúng là trục runtime, không phải content slot có kiểu, nên nằm ngoài schema. Hằng chính xác `__csDisplayLiteralEmpty` cũng thuộc runtime: nó giữ dấu cách phân tách quanh binding cũ, luôn là chuỗi rỗng, không được khai báo hay ghi đè như content. Không loại trừ toàn bộ tiền tố để che các trường nghiệp vụ khác.

## Rollout — đã đủ cho template đủ điều kiện, và đã có gate

Ban đầu ship **cố ý chưa đầy đủ**: ba exemplar (một mỗi archetype lớn) chứng minh pattern end-to-end — `marketing-page` (product), `bod-report` (document), `slide-deck` (deck) — rồi quét qua các template hole-driven.

Danh mục nguồn hiện có **84 mẫu có content hole đã adopt và 84 sidecar**. **Một mẫu còn lại, `doc-style-guide`, là tài liệu hướng dẫn hệ thống cố định**, không có content hole cho người dùng điền. `_audit/template-schema-test.html` fail nếu content hole đủ điều kiện thiếu sidecar hoặc slot khai báo thiếu đích trong nguồn. Thêm một `{{ hole }}` cho người dùng điền phải kèm sidecar trong cùng thay đổi.

Gate dùng validator draft-07 được Ajv ghim phiên bản biên dịch khi bảo trì, không biên dịch trong trình duyệt. Thuộc tính không được phép, nhãn dịch sai kiểu và slot id trùng đều bị từ chối. Sau khi sửa schema, chạy `npm run build:content-schema-validator`; dùng `npm run test:content-schema` để kiểm tra toàn bộ sidecar, CSP và các trường hợp lỗi. Metadata hợp lệ không chứng minh chất lượng export hay việc phê duyệt nội dung nghiệp vụ.

## Slot mã nguồn và nội dung runtime

84 sidecar mô tả **832 slot nguồn đã adopt**: **806 slot văn bản thuần có validation**, **một số phần trăm hữu hạn**, và **25 mô hình hiển thị cấu trúc giới hạn**. Phần văn bản gồm 64 đích thuộc tính/prop chính xác; các trường khác bind vào nội dung native đã quan sát. Ngày, ô dòng cố định và tổng tường minh trong invoice/quote được truyền độc lập, không tự tính toán. Văn bản nguồn cố định ngoài slot khai báo không tự thành nội dung chỉnh sửa được. Xem [nội dung mẫu có kiểm tra](template-content.md) về biện pháp bảo vệ và giới hạn xuất tài liệu.

Script logic của template adopt khai báo `data-content-schema="./content-schema.json"`. Slot adopt văn bản có `runtimeBinding: "text"`, `type: "text"` hoặc `"richtext"`, và `maxLength` dương. Runtime tải schema cạnh template và chỉ nhận hole văn bản trực tiếp hoặc đích vô hướng chính xác trong `runtimeTargets` cùng danh sách cho phép đã rà soát. Đích tên/nhãn còn cần `minLength: 1` và `semanticReason`. Control, trục và giá trị computed thực sự là hàm/mô hình được bảo vệ; chỉ chuỗi computed hiện có được thay. Richtext được chiếu thành chuỗi thuần nguyên văn. Không cung cấp parse HTML, chèn URL, thực thi rich-text hay trộn thuộc tính tùy ý.

Sau mount, gọi `window.__dcSetContent(window.__dcRootName(), {clientName: 'Công ty Ánh Dương'})`. Object content riêng được kiểm tra trước khi lưu: tên lạ, khóa prototype, giá trị ngoài mô hình vô hướng hoặc có cấu trúc đã khai báo, giá trị quá dài và text required rỗng bị từ chối đồng bộ, giữ nguyên content trước đó. Độ dài đếm Unicode code point. Content hợp lệ ghi đè giá trị hiển thị đã khai báo sau `renderVals()`; khóa bỏ qua giữ default theo ngôn ngữ. Mỗi lần gọi thay toàn bộ object content trước; `{}` reset mọi override. Override giữ nguyên qua thay đổi ngôn ngữ; consumer phải gửi nội dung dịch phù hợp nếu cần, không truyền object đa ngôn ngữ. Control ngôn ngữ/theme vẫn qua `__dcSetProps`; truyền hole content như control prop không adopt nó.

CLI nhận `--content /path/content.json` với cùng validation runtime. Receipt thành công ghi nội dung cung cấp, hash nguồn và phạm vi browser; xử lý receipt theo độ nhạy của nội dung. Ngày, trường dòng native cố định và số tiền tường minh trong invoice/quote nay có binding hiển thị được khai báo. Cấu trúc dòng, phép tính tài chính và chính sách pháp lý/thương mại vẫn thuộc nguồn; runtime không suy ra tổng, thuế, chuyển đổi ngày hay dòng mới.

Chạy `node _audit/ci/lib/run-browsers.mjs _audit/ci/test-template-content-browser.mjs` để kiểm tra tùy chỉnh EN/VI, escape, giữ state khi input sai, reset, slot chưa adopt và từ chối schema độc hại trên mọi engine. Sinh lại primitive copy và inventory sau thay đổi. Validation metadata, payload runtime và fidelity DOCX/PDF bàn giao vẫn là bằng chứng riêng.

Text runtime cũng từ chối control/ký tự bị XML 1.0 cấm và UTF-16 không hợp lệ để giữ nguyên nội dung được chấp nhận trong DOCX chỉnh sửa được. Từ chối giữ state cũ; không âm thầm xóa hay thay ký tự. Ký tự Unicode bổ sung hợp lệ, tab và xuống dòng vẫn được phép.


## Bản ghi hiển thị có cấu trúc

Cả 25 slot list/table trước đây chỉ có trong nguồn đã khai báo `runtimeBinding: "structured"`: cùng các trường hiển thị được adopt rõ ràng bên dưới, tổng cộng 832 slot sidecar hiện tại được nhận rõ ràng (806 scalar và 25 structured). `scripts/template-content-models.json` sở hữu chính xác hình dạng và đích nhận của từng template; `node scripts/generate-template-content-models.mjs --check` phát hiện sai lệch. Đây là binding dữ liệu hiển thị, không phải API truyền prop tuỳ ý cho component.

Mỗi slot structured có `runtimeModel`, `runtimeProjection` và `runtimeTargets` chính xác. Model chỉ nhận mảng đặc có giới hạn, record thuần đúng các trường, chuỗi không rỗng an toàn cho XML và số hữu hạn ở những trường đã có trong nguồn. Các trường lạ/thiếu, hàm, accessor, prototype kế thừa/tuỳ biến, mảng thưa, UTF-16/XML không hợp lệ và giá trị ngoài enum đều bị từ chối. Mỗi cấp mảng có tối đa 100 phần tử; độ sâu có giới hạn, với ngân sách chung 2.048 node / 262.144 code point cho dữ liệu structured. Giới hạn từng trường nằm trong sidecar. Danh sách bắt buộc không được rỗng. Nội dung không bị sửa âm thầm và không được diễn giải thành HTML.

```js
__dcSetContent(__dcRootName(), {
  rows: [{ key: "DEMO", name: "Customer project", squad: "Platform", pct: 72, status: "In progress" }]
});
```

Ví dụ dùng model dòng hiện có của App shell/Dashboard. Bốn slot tiêu đề bảng dùng `runtimeProjection: "column-headers"`: cung cấp đầy đủ các record `{key, header}` theo đúng thứ tự hiện tại. Template vẫn sở hữu key/thứ tự cột và callback render; hàm do caller đưa vào hoặc cột mới đều bị từ chối. Danh tính dòng (`key`, `id` hoặc `name` theo khai báo) và giá trị option phải duy nhất. Option ngôn ngữ Settings giữ nguyên giá trị EN/VI; không bổ sung formatter hay locale.

Setter chụp bản sao bất biến và từ chối toàn bộ cập nhật trước khi đổi nội dung cũ. Sửa mảng của caller sau đó không có tác dụng. Mỗi lần gọi thay cả content bag; slot bị bỏ qua trở lại mặc định trong nguồn, còn `{}` đặt lại toàn bộ. Nội dung caller vẫn là văn bản nguyên nghĩa khi đổi theme/ngôn ngữ; caller cung cấp bản dịch. Ô tiền tệ là chuỗi hiển thị sẵn có: không suy diễn phép tính, làm tròn, tỷ giá, bảng lương hay tính hợp lệ pháp lý. Giữ yêu cầu rà soát của chủ nội dung/luật sư ở những nơi đã quy định.

Kiểm tra trình duyệt so sánh dữ liệu mặc định được truyền vào với HTML và DOCX có thể sửa nguyên bản; sau đó kiểm tra dữ liệu caller, trạng thái UI thật, escaping và print media bằng ba engine. Đọc text PDF dùng Chromium. Danh sách nguồn AI trong Board report là disclosure tương tác nằm ngoài vùng xuất tài liệu; việc không đưa nó vào bản xuất giữ nguyên phạm vi hiện có. Bố cục Office thực tế và nghiệm thu accessibility thủ công vẫn là yêu cầu riêng.

## Copy template có chủ sở hữu và artwork tĩnh

`scripts/template-literals-source.json` sở hữu bảng element 15 mục, các cụm song ngữ dùng chung chính xác và từ điển chuỗi EN/VI tĩnh của từng template. `node scripts/generate-template-literals.mjs --check` kiểm tra các bản literal dùng offline; adoption giữ nguyên mọi DC script AST và cách viết literal gốc, gồm ngoại lệ lexical được khai báo. Không gộp logic render hay model mặc định có cấu trúc. Giá trị nghiệp vụ riêng của template vẫn được sở hữu độc lập dù tình cờ giống nhau.

71 template chỉ dùng Logo chính thức với kích thước cố định. Ảnh native tham chiếu nguyên trạng `assets/logo-mark.svg` qua dòng rebind `base` hiện có trong `ds-base.js`; marker static-logo rõ ràng cho phép bỏ bundle component không dùng. React, DC interpreter và các bản runtime portable vẫn được giữ. 14 template có component khác tiếp tục tải bundle. Exporter chỉ nhận đường dẫn ảnh chính thức cùng origin này bên cạnh SVG hiện có, giữ hình Logo trong DOCX và raster PDF. So sánh pixel screen/print, hình học, accessible name và DOCX chính xác bảo vệ thay đổi; không thay component tuỳ ý hay tuyên bố bỏ React.

## Trường điền có tên trong giấy tờ native

Contract chỉ có trong bản checkout của kho nguồn là `scripts/template-native-paper-fields.json`; đầu vào của trình sinh không được phát hành trong webroot. Nó khai báo mười một trường chuỗi thuần có tên trong ba giấy tờ song ngữ hiện có: xác nhận quá trình công tác (`employeeName`, `citizenId`, `position`, `department`), đề nghị của người lao động (`employeeName`, `positionDepartment`, `lineManager`, `workHandoverRecipient`) và đơn nghỉ việc (`employeeName`, `departmentPosition`, `laborContractReference`). Mỗi trường ánh xạ tới ô điền riêng có nhãn hiện hữu. Giá trị mặc định đúng ba mươi dấu chấm, điều khoản tiếng Việt/Anh xung quanh, bố cục, danh tính công ty phát hành và khối chữ ký được giữ nguyên.

Truyền các trường qua cùng API `__dcSetContent` hoặc CLI `--content`. Trường khi được cung cấp phải có nội dung và nhận tối đa 256 Unicode code point; khóa bỏ qua giữ placeholder. Giá trị chỉ là chuỗi hiển thị. Không suy ra xác minh danh tính, hiệu lực pháp lý, phân tích ngày, tính thời hạn báo trước, số dư phép, tính toán tài chính hay chữ ký. Caller chịu trách nhiệm với dữ liệu định danh riêng tư, kể cả file xuất và receipt.

Chạy `node scripts/generate-template-native-paper-fields.mjs`, sau đó thêm `--check` để kiểm tra freshness chỉ đọc. Producer kiểm tra anchor nhãn song ngữ/ô điền duy nhất và khôi phục toàn bộ nguồn gốc theo hash đã rà soát trước khi ghi bất kỳ file nào. Mutation Node từ chối sai lệch mà không ghi dở; test trình duyệt so sánh toàn bộ markup mặc định/gốc, pixel và XML/media DOCX, chuỗi tùy chỉnh nguyên văn, reset và đầu vào không an toàn. Kiểm chứng văn bản PDF qua browser-print chỉ dùng Chromium. Census nguồn ban đầu ghi 43 template không có schema. Các đợt adopt hiện tại bao phủ 84 template có dữ liệu; tài liệu hướng dẫn kiểu còn lại không có contract dữ liệu caller. Có sidecar không chứng minh mọi dữ liệu nghiệp vụ đều cấu hình được; dữ liệu hiển thị còn viết cứng tiếp tục được ghi mở trong sổ remediation.


### Mở rộng các ô điền trong giấy tờ bản địa

`template-native-paper-fields.json` giữ nguyên 11 trường ban đầu và bổ sung 22 trường hiển thị thông tin định danh/liên hệ trong năm mẫu hợp đồng lao động, thử việc, thực tập, nhà thầu và NDA song phương. Mỗi mục ghi `anchorLabel` song ngữ chính xác sau khi chuẩn hóa khoảng trắng, `rowLabel` để hiển thị và `default` đúng nguyên bản (15, 30, 31 hoặc 60 dấu chấm). Trình sinh chỉ nhận ô giá trị có đúng một span điền thuần văn bản; nhãn, mặc định hoặc toàn bộ nguồn gốc lệch hash đều bị từ chối trước khi ghi bất kỳ đầu ra nào. Đường dẫn nguồn/đầu ra symlink cũng bị từ chối.

Giới hạn vẫn là 256 code point Unicode cho mỗi trường. Đây chỉ là chuỗi hiển thị: không xác minh danh tính, suy diễn tính hợp pháp, phân tích ngày, tính tiền hay ký thay người dùng. Các điều khoản, mặc định, bố cục và chữ ký nguyên bản được giữ nguyên; kiểm thử so sánh HTML, pixel, DOCX cùng nội dung tùy chỉnh trong ba engine. Kiểm chứng văn bản PDF thực tế chỉ áp dụng Chromium.

## Hồ sơ nghiệp vụ và giá trị phần trăm hữu hạn

Phép chiếu dữ liệu hiển thị đã kiểm tra bao phủ 36 mẫu với 282 trường: 281 trường văn bản thuần và một trường phần trăm hữu hạn. Toàn bộ 84 sidecar có 832 slot đã áp dụng: 806 slot văn bản thuần, 25 mô hình cấu trúc giới hạn và một slot số. Đây là số liệu từ nguồn, không phải cam kết mọi đoạn văn nghiệp vụ đều chỉnh sửa được hay kết quả giống hoàn toàn Office.

Các dòng hóa đơn, báo giá, chi phí và SOW giữ nguyên cấu trúc bảng native đã biên soạn. Ngày, mô tả, số lượng, đơn giá, số tiền và tổng được truyền độc lập dưới dạng chuỗi hiển thị; runtime không tính toán tài chính, chuyển đổi định dạng ngôn ngữ, xác thực ngày hay diễn giải pháp lý. Các vị trí tên gọi HR dùng chung một trường; ngày và tiêu đề bản địa hóa vẫn là các chuỗi tường minh. Slot hóa đơn/khách hàng và ràng buộc cũ được giữ nguyên khi thêm trường. Ngữ cảnh văn bản thô quanh binding thuộc mẫu; tái sinh phải khôi phục đúng hash toàn bộ mẫu gốc.

Mẫu trạng thái giao hàng áp dụng `completionPercent` là số từ 0 đến 100, kể cả hai đầu (mặc định 72). Ví dụ:

```js
__dcSetContent(__dcRootName(), { completionPercent: 37.5 });
```

Slot `number` bắt buộc có `minimum: 0`, `maximum: 100`, `runtimeBinding: "number"`, `runtimeProjection: "percent-width"` và đúng các đích span native `data-dc-percent-width`. Thuộc tính DSL nội bộ này bị loại khỏi DOM hiển thị. Chỉ span thanh tiến độ rỗng, không tương tác và nằm trong track cắt nội dung đã kiểm tra được nhận số dưới dạng chiều rộng phần trăm. Nhãn và chiều rộng dùng cùng giá trị hữu hạn; chuỗi (kể cả chuỗi số), NaN, vô cực, số ngoài miền, accessor và payload prototype bị từ chối nguyên tử. Hợp đồng này không cho phép chèn style tổng quát, URL, sự kiện, thuộc tính hay biểu thức tùy ý.

Điều khoản pháp lý/thương mại mẫu, danh tính tổ chức, chỗ trống hướng dẫn và văn bản ví dụ dài vẫn thuộc nguồn mẫu. Thay các điều khoản đó là sửa nội dung có tác giả và cần được rà soát phù hợp; giao diện dữ liệu hiển thị không xác nhận tính đúng đắn pháp lý, thuế, kế toán hay chính sách. Số dòng cố định vẫn cố định; thêm/xóa dòng cần hợp đồng mô hình cấu trúc riêng tường minh. Kiểm tra tập trung so sánh DOM, pixel và DOCX mặc định với nguồn gốc, kiểm tra từng vị trí dữ liệu tùy chỉnh ở các chế độ ngôn ngữ hỗ trợ và đọc văn bản PDF thực tế trên Chromium. Các engine khác kiểm tra DOM, DOCX và bố cục in. Site cuối, thiết bị thật, kiểm tra tiếp cận thủ công và chấp thuận của con người vẫn là các bước riêng.
