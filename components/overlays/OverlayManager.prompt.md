<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**OverlayProvider / trình quản lý lớp phủ** — ngăn xếp document chung cho Escape của modal/không modal đã đăng ký, đếm tham chiếu khóa cuộn và khôi phục tiêu điểm. Bao khung sản phẩm khi lồng lớp phủ; Dialog / AlertDialog / Drawer / CommandPalette đã đăng ký qua singleton module khi không có provider được mount.

```jsx
<OverlayProvider>
  <App />
</OverlayProvider>
```

Xem `docs/decisions/overlay-manager-design.md`.

Provider dùng chung trình quản lý document. Bẫy Tab theo modal hoạt động linh động; đóng modal lồng kích hoạt lại bẫy cha. Trigger bị ngắt khỏi DOM không được focus, và không cướp focus đã chuyển nơi khác. Widget mở bằng focus có thể đặt `restoreFocus: false`. Ghi chú thiết kế ghi các họ đã chuyển đổi và kiểm tra hỗ trợ thủ công/trình duyệt còn lại.

Scope focus modal gồm hậu duệ qua portal đã đăng ký, kể cả trigger đang đóng của chúng. Quyền sở hữu React đi qua portal; phía dùng vẫn chịu trách nhiệm vị trí portal và xếp lớp theo token. Nhánh nền thành inert, kể cả node mới chèn; giá trị inert và overflow trước đó được khôi phục sau khi modal cuối đóng. Ref backdrop tường minh chỉ giữ backdrop modal hiện tại tương tác được. Popup select native giữ hành vi do trình duyệt quản lý.

Bàn phím: OverlayProvider cung cấp trình quản lý document dùng chung và host portal rỗng; không đưa children của nó qua portal. Các lớp đã đăng ký chuyển Escape đến lớp trên cùng không phải toast, còn modal hoạt động giữ Tab trong các scope thuộc quyền đã đăng ký. Provider dùng chung singleton. 17 panel neo đã ghi nhận mặc định dùng helper body-portal/va chạm chung với tùy chọn inline; portal do phía dùng tự tạo và vị trí modal vẫn do bên gọi quản lý, cần đăng ký quyền sở hữu để tích hợp trình quản lý.

Bản địa hóa: Bản thân provider không hiển thị nội dung cho người dùng và không có prop lang. Component lớp phủ và bên gọi sở hữu tên, nội dung đã dịch.

Bằng chứng nguồn: `OverlayManager.jsx` và `OverlayManager.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Mỗi provider mount một marker `[data-cs-overlay-root]` có định danh duy nhất. Nhiều provider vẫn dùng trình quản lý chung hiện có; marker này không tạo ngăn xếp độc lập hay portal tự động.

Các bản biên dịch độc lập tương thích dùng chung registry document và cùng context quyền sở hữu với cùng React peer. Giao thức riêng báo lỗi rõ khi phiên bản không tương thích hoặc thiếu năng lực; không gộp trình quản lý cũ không có phiên bản. Dựng lại/đồng bộ mọi bản được nạp. Provider có ID marker client-layout duy nhất, tránh ID document hiện có; SSR và render hydration đầu tiên bỏ các ID đó. Marker không phải đích portal công khai. Import/render máy chủ không đụng DOM hay lưu ngăn xếp toàn cục xuyên yêu cầu. Xem `docs/decisions/document-overlay-coordination.md` về phạm vi đã kiểm thử và giới hạn.

## English
<!-- END GENERATED VI PROMPT v1 -->
**OverlayProvider / overlay manager** — shared document stack for registered modal and nonmodal Escape, scroll-lock
refcount, and focus restore. Wrap product shells when nesting overlays; Dialog /
AlertDialog / Drawer / CommandPalette already register via the module singleton
when no provider is mounted.

```jsx
<OverlayProvider>
  <App />
</OverlayProvider>
```

See `docs/decisions/overlay-manager-design.md`.

Providers share the same document manager. Tab trapping follows the active modal dynamically; closing a nested modal reactivates its parent trap. Disconnected triggers are not focused, and focus already moved elsewhere is not stolen. Focus-opened widgets can set `restoreFocus: false`. The design note records migrated families and remaining manual/browser support checks.

Modal focus scopes include registered portalled descendants, including their closed triggers. React ownership travels across portals; consumers remain responsible for portal positioning and token-based stacking. Background branches become inert, including newly inserted nodes; prior inert and overflow values are restored after the last modal closes. Explicit backdrop refs keep only the current modal backdrop interactive. Native select popups retain browser-owned behavior.

Keyboard: OverlayProvider provides a shared document manager and an empty portal host; it does not portal its children. Registered layers route Escape to the top non-toast layer, while the active modal contains Tab across registered owned scopes. Providers share the singleton. The 17 documented anchored panels use the shared body-portal/collision helper by default with an inline opt-out; custom consumer-created portals and modal placement remain caller-owned and require registered ownership for manager integration.

Localization: The provider itself renders no user-facing copy and has no lang prop. Overlay components and their callers own translated names and content.

Source evidence: `OverlayManager.jsx` and `OverlayManager.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Each provider mounts a uniquely identified `[data-cs-overlay-root]` marker. Multiple providers retain the existing shared manager; this marker does not establish independent stacks or automatic portals.

Compatible independently compiled copies share one document registry and the same ownership contexts for the same React peer. The private protocol fails clearly on incompatible versions or missing capabilities; it does not merge unversioned older managers. Rebuild/align every loaded copy. Providers have unique client-layout marker IDs, avoiding existing document IDs; SSR and the first hydration render omit those IDs. The marker is not a public portal destination. Server imports/rendering do not touch the DOM or store a cross-request global stack. See `docs/decisions/document-overlay-coordination.md` for the tested scope and limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### OverlayProvider

[Khai báo / Declaration](OverlayManager.d.ts) · [Nguồn / Source](OverlayManager.jsx) · phân tích mặc định / default analysis: `direct-export-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 0 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `OverlayProvider.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 0 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `OverlayProvider.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
