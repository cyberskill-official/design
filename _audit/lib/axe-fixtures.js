/**
 * Shared axe-smoke fixtures — every public primary mounts with labelled,
 * bilingual-safe props. Loaded as a classic script before axe-smoke.html runs.
 * Inventory lock: _audit/ci/test-axe-coverage.mjs === listPublicComponents().
 */
(function (global) {
  'use strict';

  var NAMES = [
  "AIDisclosureBadge",
  "Accordion",
  "Alert",
  "AlertDialog",
  "Anchor",
  "AspectRatio",
  "Avatar",
  "BackTop",
  "Badge",
  "Breadcrumb",
  "Button",
  "ButtonGroup",
  "Calendar",
  "Card",
  "Carousel",
  "Cascader",
  "Chart",
  "ChatMessage",
  "Checkbox",
  "CitationList",
  "CodeBlock",
  "Collapsible",
  "ColorPicker",
  "Combobox",
  "CommandPalette",
  "Comment",
  "ConfidenceMeter",
  "ContextMenu",
  "DataGrid",
  "DataTable",
  "DatePicker",
  "DescriptionList",
  "Dialog",
  "Divider",
  "Dock",
  "Drawer",
  "Editor",
  "EmptyState",
  "FileUpload",
  "FloatingActionButton",
  "Form",
  "HotKeys",
  "HoverCard",
  "HumanReviewGate",
  "Icon",
  "Image",
  "InlineEdit",
  "InputGroup",
  "InputOTP",
  "Item",
  "Kbd",
  "Link",
  "List",
  "Logo",
  "LumiAvatar",
  "Masonry",
  "Mentions",
  "Menu",
  "Menubar",
  "NativeSelect",
  "NavigationMenu",
  "NumberField",
  "OverlayProvider",
  "Pagination",
  "Popconfirm",
  "Popover",
  "ProgressBar",
  "PromptInput",
  "PromptSuggestions",
  "QRCode",
  "RadioGroup",
  "Rating",
  "Result",
  "ScrollArea",
  "SearchField",
  "SegmentedControl",
  "Select",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Sortable",
  "Spinner",
  "Splitter",
  "Stat",
  "StatusIndicator",
  "Steps",
  "Switch",
  "Tabs",
  "Tag",
  "TagInput",
  "Terminal",
  "TextField",
  "Textarea",
  "TimePicker",
  "Timeline",
  "Toast",
  "Toggle",
  "Toolbar",
  "Tooltip",
  "Tour",
  "Transfer",
  "Tree",
  "TreeSelect",
  "TreeTable",
  "TypingIndicator",
  "Watermark"
];

  var CASCADE = [
    { key: 'hcm', label: 'Hồ Chí Minh', children: [{ key: 'd1', label: 'District 1' }, { key: 'd3', label: 'District 3' }] },
    { key: 'hn', label: 'Hà Nội', children: [{ key: 'bd', label: 'Ba Đình' }] },
  ];
  var TREE = [
    { key: 'eng', label: 'Engineering', children: [{ key: 'ds', label: 'Design System' }, { key: 'plat', label: 'Platform' }] },
  ];
  var OPTS = [
    { value: 'a', label: 'Admin' },
    { value: 'b', label: 'Member' },
  ];
  var LONG =
    'Dense panel copy for axe scroll and drawer regions. '.repeat(12);

  function C(NS, name, missing) {
    if (!NS[name]) {
      missing.push(name);
      return 'div';
    }
    return NS[name];
  }

  /** Build one EN (or VI) node per primary. */
  function buildCluster(h, NS, opts) {
    opts = opts || {};
    var lang = opts.lang || 'en';
    var vi = lang === 'vi';
    var missing = [];
    var c = function (n) { return C(NS, n, missing); };
    var L = function (en, vn) { return vi ? vn : en; };
    var stop = function (e) { if (e && e.preventDefault) e.preventDefault(); };

    var nodes = [
      h(c('Accordion'), { items: [{ title: L('Details', 'Chi tiết'), content: L('Body copy for axe.', 'Nội dung axe.') }], defaultOpen: 0 }),
      h(c('AIDisclosureBadge'), { label: L('AI assisted', 'Có hỗ trợ AI') }),
      h(c('Alert'), { variant: 'info', children: L('Axe cluster', 'Cụm axe') }),
      h(c('AlertDialog'), {
        open: true,
        title: L('Delete workspace?', 'Xoá không gian?'),
        description: L('Removes every project. This cannot be undone.', 'Xoá mọi dự án. Không thể hoàn tác.'),
        tone: 'destructive',
        onOpenChange: function () {},
        onConfirm: function () {},
      }),
      h(c('Anchor'), { title: L('On this page', 'Trên trang này'), items: [{ id: 'a', label: L('Intro', 'Mở đầu') }, { id: 'b', label: L('API', 'API') }] }),
      h(c('AspectRatio'), { ratio: '16 / 9', children: h('img', { src: '../assets/aurora-gold.jpg', alt: L('Aurora sample', 'Mẫu aurora') }) }),
      h(c('Avatar'), { name: 'An Le' }),
      h(c('BackTop'), { threshold: 10, label: L('Back to top', 'Lên đầu trang') }),
      h(c('Badge'), { variant: 'ochre', children: L('Now', 'Ngay') }),
      h(c('Breadcrumb'), { items: [{ label: L('Home', 'Trang chủ'), href: '#' }, { label: L('Projects', 'Dự án'), href: '#' }, { label: L('Design System', 'Design System') }] }),
      h(c('Button'), { children: L('Save', 'Lưu') }),
      h(c('ButtonGroup'), { label: L('View', 'Xem') }, h(c('Button'), { size: 'sm', variant: 'secondary', children: L('Board', 'Bảng') }), h(c('Button'), { size: 'sm', variant: 'secondary', children: L('List', 'Danh sách') })),
      h(c('Calendar'), { value: new Date(2026, 6, 18), onChange: function () {} }),
      h(c('Card'), null, h(c('CardHeader'), { title: L('Card', 'Thẻ'), subtitle: L('Axe sample', 'Mẫu axe') }), h(c('CardBody'), null, L('Panel body', 'Nội dung panel'))),
      h(c('Carousel'), { label: L('Highlights', 'Điểm nổi bật') }, h('div', null, L('Slide A', 'Trang A')), h('div', null, L('Slide B', 'Trang B'))),
      h(c('Cascader'), { label: L('Region', 'Khu vực'), nodes: CASCADE, lang: lang }),
      h(c('Chart'), { type: 'bar', height: 120, data: [{ label: 'A', value: 12 }, { label: 'B', value: 20 }], 'aria-label': L('Sample chart', 'Biểu đồ mẫu') }),
      h(c('ChatMessage'), { role: 'lumi', name: 'Lumi', children: L('Wish received.', 'Đã nhận ước.') }),
      h(c('Checkbox'), { label: L('Agree', 'Đồng ý'), lang: lang }),
      h(c('CitationList'), { label: L('Sources', 'Nguồn'), items: [{ title: 'Doctrine', href: '#' }] }),
      h(c('CodeBlock'), { language: 'js', children: 'const x = 1;' }),
      h(c('Collapsible'), { title: L('Advanced', 'Nâng cao'), defaultOpen: false, children: L('Collapsible body for axe.', 'Nội dung thu gọn cho axe.') }),
      h(c('ColorPicker'), { label: L('Brand', 'Thương hiệu'), value: '#F4BA17', onChange: function () {}, lang: lang }),
      h(c('Combobox'), { label: L('Element', 'Nguyên tố'), options: [{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }], lang: lang }),
      h(c('CommandPalette'), {
        open: true,
        onClose: function () {},
        groups: [{ heading: L('Navigate', 'Điều hướng'), items: [{ id: '1', label: L('Tokens', 'Token'), onSelect: function () {} }] }],
        lang: lang,
      }),
      h(c('Comment'), { author: 'An Le', meta: L('2h ago', '2 giờ trước'), children: L('Looks solid.', 'Ổn.') }),
      h(c('ConfidenceMeter'), { value: 0.82, label: L('Confidence', 'Độ tin cậy') }),
      h(c('ContextMenu'), { items: [{ label: L('Copy', 'Sao chép'), onSelect: function () {} }, { label: L('Paste', 'Dán'), onSelect: function () {} }] }, h('button', { type: 'button' }, L('Right-click zone', 'Vùng chuột phải'))),
      h(c('DataGrid'), {
        caption: L('Projects', 'Dự án'),
        columns: [{ key: 'name', header: L('Name', 'Tên') }, { key: 'pct', header: L('Progress', 'Tiến độ') }],
        rows: [{ id: '1', name: 'Design System', pct: '72%' }],
        rowKey: 'id',
        height: 160,
        lang: lang,
      }),
      h(c('DataTable'), {
        caption: L('Projects', 'Dự án'),
        columns: [{ key: 'name', header: L('Name', 'Tên') }, { key: 'pct', header: L('Progress', 'Tiến độ') }],
        rows: [{ id: '1', name: 'Design System', pct: '72%' }],
        rowKey: 'id',
      }),
      h(c('DatePicker'), { label: L('Due date', 'Hạn'), lang: lang }),
      h(c('DescriptionList'), { items: [{ term: L('Owner', 'Phụ trách'), value: 'An Le' }, { term: L('Squad', 'Nhóm'), value: 'Platform' }] }),
      h(c('Dialog'), {
        open: true,
        title: L('Confirm', 'Xác nhận'),
        onClose: function () {},
        children: L('Dialog body for axe.', 'Nội dung hộp thoại cho axe.'),
        actions: h(c('Button'), { children: 'OK' }),
      }),
      h(c('Divider'), { label: L('Or', 'Hoặc') }),
      h(c('Dock'), { label: L('Quick apps', 'Ứng dụng nhanh'), items: [{ label: L('Home', 'Trang chủ'), href: '#' }, { label: L('Search', 'Tìm'), href: '#' }] }),
      h(c('Drawer'), {
        open: true,
        onClose: function () {},
        title: L('Panel', 'Bảng bên'),
        children: h('p', null, LONG),
        actions: h(c('Button'), { size: 'sm', children: L('Open', 'Mở') }),
        lang: lang,
      }),
      h(c('Editor'), { defaultValue: L('Draft note', 'Ghi chú nháp'), lang: lang, 'aria-label': L('Editor', 'Trình soạn') }),
      h(c('EmptyState'), { title: L('Nothing here', 'Chưa có gì'), children: L('Try another filter.', 'Thử bộ lọc khác.') }),
      h(c('FileUpload'), { lang: lang }),
      h(c('FloatingActionButton'), { position: 'static', label: L('Make a wish', 'Ước một điều'), icon: h(c('Icon'), { name: 'sparkle' }) }),
      h(c('Form'), { onSubmit: function (e) { stop(e); } }, h(c('TextField'), { label: L('Name', 'Tên'), name: 'name', lang: lang })),
      h(c('HotKeys'), { bindings: [{ keys: '⌘K', description: L('Open palette', 'Mở bảng lệnh') }], lang: lang }, h('span', null, L('Hotkey host', 'Vùng phím tắt'))),
      h(c('HoverCard'), { openDelay: 0, closeDelay: 99999, trigger: h('button', { type: 'button' }, '@anle'), children: h('div', null, h('b', null, 'An Le'), h('br'), L('Platform lead', 'Trưởng nhóm Nền tảng')) }),
      h(c('HumanReviewGate'), {
        risk: 'high',
        summary: L('Outbound email needs review.', 'Email gửi đi cần duyệt.'),
        reviewer: 'An Le',
        onApprove: function () {},
        onReject: function () {},
        lang: lang,
      }),
      h(c('Icon'), { name: 'sparkle', label: L('Sparkle', 'Tia lửa') }),
      h(c('Image'), { src: '../assets/aurora-gold.jpg', alt: L('Aurora', 'Aurora'), ratio: '16 / 9' }),
      h(c('InlineEdit'), { label: L('Title', 'Tiêu đề'), defaultValue: 'CyberSkill', lang: lang }),
      h(c('InputGroup'), { label: L('Host', 'Máy chủ'), prefix: 'https://', suffix: '.world', defaultValue: 'cyberskill', clearable: true, lang: lang }),
      h(c('InputOTP'), { length: 4, label: L('One-time code', 'Mã OTP'), lang: lang }),
      h(c('Item'), { title: L('Release notes', 'Ghi chú phát hành'), description: L('Bilingual digest', 'Tóm tắt song ngữ'), trailing: h(c('Switch'), { 'aria-label': L('Release notes', 'Ghi chú phát hành'), defaultChecked: true }) }),
      h(c('Kbd'), null, '⌘K'),
      h(c('Link'), { href: '#', onClick: stop, children: L('Privacy', 'Riêng tư') }),
      h(c('List'), null, h(c('ListItem'), null, L('First item', 'Mục một')), h(c('ListItem'), null, L('Second item', 'Mục hai'))),
      h(c('Logo'), { size: 32, title: 'CyberSkill' }),
      h(c('LumiAvatar'), { size: 'md' }),
      h(c('Masonry'), { columns: 2, gap: 8 }, h('div', null, 'A'), h('div', null, 'B'), h('div', null, 'C')),
      h(c('Mentions'), { label: L('Mentions', 'Nhắc đến'), placeholder: L('Type @…', 'Gõ @…'), users: [{ id: '1', label: 'An Le' }], lang: lang, 'aria-label': L('Mentions', 'Nhắc đến') }),
      h(c('Menu'), { open: true, onOpenChange: function () {}, trigger: h(c('Button'), { size: 'sm', children: L('Open menu', 'Mở menu') }) }, h(c('MenuItem'), null, L('Profile', 'Hồ sơ')), h(c('MenuItem'), null, L('Sign out', 'Đăng xuất'))),
      h(c('Menubar'), {
        menus: [
          { label: L('File', 'Tệp'), items: [{ label: L('New', 'Mới') }] },
          { label: L('Edit', 'Sửa'), items: [{ label: L('Undo', 'Hoàn tác') }] },
        ],
      }),
      h(c('NativeSelect'), { label: L('Locale', 'Ngôn ngữ'), size: 'sm', options: [{ value: 'en', label: 'English' }, { value: 'vi', label: 'Tiếng Việt' }], defaultValue: 'en' }),
      h(c('NavigationMenu'), { items: [{ label: L('Product', 'Sản phẩm'), href: '#' }, { label: L('Docs', 'Tài liệu'), href: '#' }] }),
      h(c('NumberField'), { label: L('Quantity', 'Số lượng'), value: 1, min: 0, onChange: function () {}, lang: lang }),
      h(c('OverlayProvider'), null, h('span', null, L('Overlay root host', 'Vùng gốc overlay'))),
      h(c('Pagination'), { page: 2, pageCount: 5, onChange: function () {} }),
      h(c('Popconfirm'), { title: L('Delete this draft?', 'Xóa bản nháp này?'), onConfirm: function () {}, trigger: h(c('Button'), { variant: 'danger-ghost', size: 'sm', children: L('Delete', 'Xóa') }) }),
      h(c('Popover'), { trigger: h('button', { type: 'button' }, L('Open panel', 'Mở panel')), children: h('div', null, L('Popover content', 'Nội dung popover')) }),
      h(c('ProgressBar'), { value: 72, label: L('v1.0 progress', 'Tiến độ v1.0') }),
      h(c('PromptInput'), { placeholder: L('Describe your wish…', 'Mô tả ước của bạn…'), 'aria-label': L('Prompt', 'Lời nhắc'), lang: lang }),
      h(c('PromptSuggestions'), { suggestions: [L('Ship tokens', 'Xuất token'), L('Audit contrast', 'Kiểm tra tương phản')], onSelect: function () {} }),
      h(c('QRCode'), { value: 'https://design.cyberskill.world', size: 96, 'aria-label': L('QR code', 'Mã QR') }),
      h(c('RadioGroup'), { legend: L('Plan', 'Gói'), name: 'axe-plan-' + lang, options: [{ value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }], value: 'pro', onChange: function () {} }),
      h(c('Rating'), { defaultValue: 3, label: L('Satisfaction', 'Hài lòng'), lang: lang }),
      h(c('Result'), { status: 'success', title: L('Wish granted', 'Ước đã thành'), children: L('You can close this.', 'Bạn có thể đóng.') }),
      h(c('ScrollArea'), { maxHeight: 80, 'aria-label': L('Scroll sample', 'Vùng cuộn mẫu'), children: h('p', null, LONG) }),
      h(c('SearchField'), { 'aria-label': L('Search', 'Tìm kiếm'), placeholder: L('Search', 'Tìm kiếm') }),
      h(c('SegmentedControl'), { value: 'en', onChange: function () {}, options: [{ value: 'en', label: 'EN' }, { value: 'vi', label: 'VI' }], 'aria-label': L('Language', 'Ngôn ngữ') }),
      h(c('Select'), { label: L('Role', 'Vai trò'), options: OPTS }),
      h(c('Sidebar'), { label: L('App', 'Ứng dụng') }, h(c('NavItem'), { active: true }, L('Overview', 'Tổng quan')), h(c('NavItem'), null, L('Health', 'Sức khỏe'))),
      h(c('Skeleton'), { variant: 'block', width: 160, height: 12 }),
      h(c('Slider'), { min: 0, max: 100, defaultValue: 40, 'aria-label': L('Progress', 'Tiến độ') }),
      h(c('Sortable'), { items: [{ key: 'a', label: L('One', 'Một') }, { key: 'b', label: L('Two', 'Hai') }], onChange: function () {} }),
      h(c('Spinner'), { label: L('Loading', 'Đang tải') }),
      h(c('Splitter'), { height: 120, start: h('div', { style: { padding: 8 } }, L('Left', 'Trái')), end: h('div', { style: { padding: 8 } }, L('Right', 'Phải')), lang: lang }),
      h(c('Stat'), { label: L('Ships', 'Phát hành'), value: '128', delta: '+12%', trend: 'up' }),
      h(c('StatusIndicator'), { status: 'online', children: L('Online', 'Trực tuyến') }),
      h(c('Steps'), { current: 1, steps: [{ title: L('Wish', 'Ước') }, { title: L('Shape', 'Định hình') }, { title: L('Ship', 'Phát hành') }] }),
      h(c('Switch'), { label: L('Notify', 'Thông báo'), lang: lang }),
      h(c('Tabs'), { tabs: [{ value: 'a', label: L('Overview', 'Tổng quan') }, { value: 'b', label: L('Activity', 'Hoạt động') }], value: 'a', onChange: function () {} }),
      h(c('Tag'), { children: L('Design', 'Thiết kế') }),
      h(c('TagInput'), { label: L('Tags', 'Thẻ'), defaultValue: [L('design', 'thiết kế'), 'vn'], lang: lang }),
      h(c('Terminal'), { title: 'cyberskill — zsh', welcome: [L('Ready.', 'Sẵn sàng.')], lang: lang }),
      h(c('Textarea'), { label: L('Notes', 'Ghi chú'), lang: lang }),
      h(c('TextField'), { label: L('Name', 'Tên'), lang: lang }),
      h(c('Timeline'), { items: [{ title: L('Opened', 'Mở'), meta: 'Mon' }, { title: L('Shipped', 'Phát hành'), meta: 'Tue' }] }),
      h(c('TimePicker'), { label: L('Start time', 'Giờ bắt đầu'), lang: lang }),
      h(c('ToastStack'), null, h(c('Toast'), { title: L('Wish accepted', 'Ước đã nhận'), children: L('Lumi is on it.', 'Lumi đang xử lý.') })),
      h(c('Toggle'), { children: L('Notifications', 'Thông báo'), defaultPressed: true }),
      h(c('Toolbar'), { label: L('Editor tools', 'Công cụ soạn'), items: [{ label: L('Bold', 'Đậm'), onClick: function () {} }, { label: L('Italic', 'Nghiêng'), onClick: function () {} }] }),
      h(c('Tooltip'), { label: L('Regenerates native tokens', 'Tạo lại token native'), children: h('button', { type: 'button' }, L('Tokens', 'Token')) }),
      h('div', { id: 'axe-tour-anchor-' + lang }, L('Tour anchor', 'Neo hướng dẫn')),
      h(c('Tour'), {
        open: true,
        onClose: function () {},
        steps: [{ target: '#axe-tour-anchor-' + lang, title: L('Gate board', 'Bảng cổng'), body: L('Every hard gate reports here.', 'Mọi cổng cứng báo cáo tại đây.') }],
      }),
      h(c('Transfer'), {
        items: [{ key: 'a', label: L('Alpha', 'Alpha') }, { key: 'b', label: L('Beta', 'Beta') }],
        value: ['a'],
        onChange: function () {},
        titles: [L('Available', 'Có sẵn'), L('Selected', 'Đã chọn')],
        lang: lang,
      }),
      h(c('Tree'), {
        nodes: [{ key: 'root', label: L('Root', 'Gốc'), children: [{ key: 'child', label: L('Child', 'Con') }] }],
        defaultOpen: true,
        onSelect: function () {},
      }),
      h(c('TreeSelect'), { label: L('Team', 'Nhóm'), nodes: TREE, lang: lang }),
      h(c('TreeTable'), {
        caption: L('Folders', 'Thư mục'),
        columns: [{ key: 'name', header: L('Name', 'Tên') }],
        nodes: [{ key: '1', name: L('Root', 'Gốc'), children: [{ key: '1a', name: L('Child', 'Con') }] }],
        defaultExpanded: ['1'],
        lang: lang,
      }),
      h(c('TypingIndicator'), { label: L('Lumi is typing', 'Lumi đang gõ') }),
      h(c('Watermark'), { text: 'CyberSkill' }, h('div', { style: { minHeight: 48, padding: 12 } }, L('Content under watermark', 'Nội dung dưới watermark'))),
    ];

    return { nodes: nodes, missing: missing, names: NAMES.slice() };
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  /** Expand interactive surfaces so popup ARIA is in the tree before axe. */
  async function expandForScan(stage) {
    var detail = [];
    var ok = true;

    // Hierarchy pickers — click closed fields only, then wait for React paint
    var openers = stage.querySelectorAll('.cs-cascader > button.cs-treeselect__field, .cs-treeselect > button.cs-treeselect__field');
    openers.forEach(function (b) {
      if (b.getAttribute('aria-expanded') !== 'true') b.click();
    });
    await wait(150);
    var popups = stage.querySelectorAll('.cs-cascader__pop, .cs-treeselect__pop').length;
    var hierOk = openers.length > 0 && popups === openers.length;
    detail.push('hierarchy popups ' + popups + '/' + openers.length);
    if (!hierOk) ok = false;

    // Menubar — click first top item (keyboard synthetic events do not hit React onKeyDown reliably)
    var tops = stage.querySelectorAll('.cs-menubar__top');
    if (tops[0]) {
      if (tops[0].getAttribute('aria-expanded') !== 'true') tops[0].click();
      await wait(80);
      var menuOpen = !!stage.querySelector('.cs-menubar [role="menu"]');
      detail.push('menubar menu ' + (menuOpen ? 'open' : 'closed'));
      if (!menuOpen) ok = false;
    }

    // Combobox expand
    var cbs = stage.querySelectorAll('input[role="combobox"]');
    cbs.forEach(function (inp) {
      inp.focus();
      inp.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    });
    await wait(80);
    detail.push('combobox focused ' + cbs.length);

    // DatePicker / ColorPicker fields
    stage.querySelectorAll('.cs-datepicker__field, .cs-colorpicker__field').forEach(function (b) { b.click(); });
    await wait(80);
    detail.push('picker fields clicked');

    // Tooltip — force bubbles open for axe (inline style survives later focus moves to HoverCard)
    var tips = stage.querySelectorAll('.cs-tooltip');
    tips.forEach(function (tip) {
      var bubble = tip.querySelector('[role="tooltip"]');
      if (bubble) {
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateX(-50%) translateY(0)';
        bubble.setAttribute('data-axe-forced-open', '1');
      }
      var t = tip.querySelector('button, a, [tabindex], input, summary') || tip;
      if (t && t.focus) t.focus();
    });
    await wait(80);
    var tipVisible = 0;
    tips.forEach(function (tip) {
      var bubble = tip.querySelector('[role="tooltip"][data-axe-forced-open="1"]');
      if (bubble && Number(getComputedStyle(bubble).opacity) > 0.5) tipVisible++;
    });
    detail.push('tooltip visible ' + tipVisible + '/' + tips.length);
    if (tips.length && tipVisible !== tips.length) ok = false;

    // Context menu zone — open on the zone (React listens there); assert menu in tree
    var zones = stage.querySelectorAll('.cs-ctxmenu-zone');
    zones.forEach(function (z) {
      z.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 20, clientY: 20 }));
    });
    await wait(80);
    var ctxMenus = stage.querySelectorAll('.cs-ctxmenu-zone [role="menu"]').length;
    detail.push('context menus ' + ctxMenus + '/' + zones.length);
    if (zones.length && ctxMenus !== zones.length) ok = false;

    // HoverCard — open via mouseover on each wrapper (React onMouseEnter). Do not
    // rely on focus: EN·VI twins would blur each other and race closeDelay.
    var cards = stage.querySelectorAll('.cs-hovercard');
    for (var ci = 0; ci < cards.length; ci++) {
      var card = cards[ci];
      card.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, relatedTarget: document.body }));
      await wait(40);
    }
    await wait(100);
    var panels = stage.querySelectorAll('.cs-hovercard__panel').length;
    detail.push('hovercard panels ' + panels + '/' + cards.length);
    if (cards.length && panels !== cards.length) ok = false;

    return { ok: ok, detail: detail.join(' · ') };
  }

  global.__axeFixtures = {
    version: 1,
    names: NAMES,
    buildCluster: buildCluster,
    expandForScan: expandForScan,
  };
})(typeof window !== 'undefined' ? window : globalThis);
