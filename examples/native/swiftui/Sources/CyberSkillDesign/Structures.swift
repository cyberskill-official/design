import SwiftUI

public enum CSCommandFilter {
  public static let placeholderDefault = "Type a command or search…"
  public static func filter(groups: [(title: String, items: [String])], query: String) -> [(title: String, items: [String])] {
    let needle = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    return groups.map { group in
      (group.title, group.items.filter { needle.isEmpty || $0.lowercased().contains(needle) })
    }
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Nhập lệnh hoặc tìm kiếm…", "empty": "Không có kết quả", "oneResult": "{count} kết quả", "results": "{count} kết quả", "aria": "Bảng lệnh", "esc": "Esc"],
      "en": ["placeholder": placeholderDefault, "empty": "No results", "oneResult": "{count} result", "results": "{count} results", "aria": "Command palette", "esc": "Esc"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }

  public static func format(_ count: Int, language: String?) -> String {
    let primary = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let identifier = primary == "vi" ? "vi_VN" : primary == "ja" ? "ja_JP" : "en_US"
    let formatter = NumberFormatter()
    formatter.numberStyle = .decimal
    formatter.locale = Locale(identifier: identifier)
    return formatter.string(from: NSNumber(value: count)) ?? String(count)
  }

  public static func status(count: Int, language: String?) -> String {
    if count == 0 { return copy("empty", language: language) }
    let template = copy(count == 1 ? "oneResult" : "results", language: language)
    return template.replacingOccurrences(of: "{count}", with: format(count, language: language))
  }
  public static func closesOnBackdrop() -> Bool { true }
  public static func stops(resultCount: Int) -> Int { 1 + max(0, resultCount) }
  public static let scrimRed = 31
  public static let scrimGreen = 19
  public static let scrimBlue = 11
  public static let scrimAlpha = 0.42
  public static let topOffsetRatio = 0.12
  public static let viewportWidthRatio = 0.92
  public static func maxWidth() -> Double { 560 }
  public static func borderWidth() -> Double { 1 }
  public static func searchGap() -> Double { 10 }
  public static func searchPaddingY() -> Double { 14 }
  public static func searchPaddingX() -> Double { 18 }
  public static func searchIconSize() -> Double { 18 }
  public static func searchOutlineWidth() -> Double { 2 }
  public static func searchOutlineOffset() -> Double { -2 }
  public static func showsSearchOutline(focused: Bool) -> Bool { focused }
  public static func listMaxHeight() -> Double { 340 }
  public static func listPadding() -> Double { 8 }
  public static func listGap() -> Double { 2 }
  public static func statusPaddingY() -> Double { 8 }
  public static func statusPaddingX() -> Double { 10 }
  public static func labelPaddingTop() -> Double { 8 }
  public static func labelPaddingX() -> Double { 10 }
  public static func labelPaddingBottom() -> Double { 2 }
  public static func labelTracking() -> Double { 0.08 }
  public static func showsGroupLabel(_ title: String?) -> Bool {
    guard let title else { return false }
    return !title.isEmpty
  }
  public static func groupLabelText(_ title: String) -> String { title.uppercased() }
  public static func itemGap() -> Double { 11 }
  public static func itemPaddingY() -> Double { 10 }
  public static func itemPaddingX() -> Double { 12 }
  public static func itemShowsRaisedFill(hovered: Bool, selected: Bool) -> Bool { hovered || selected }
}

public enum CSTransferModel {
  public static func toggle(checked: [String], key: String) -> [String] {
    checked.contains(key) ? checked.filter { $0 != key } : checked + [key]
  }

  public static func prune(checked: [String], items: [String]) -> [String] {
    checked.filter { items.contains($0) }
  }

  public static func move(value: [String], checked: [String], items: [String], toTarget: Bool) -> (value: [String], checked: [String]) {
    let moving = checked.filter { items.contains($0) && value.contains($0) != toTarget }
    if moving.isEmpty { return (value, checked) }
    let next = toTarget ? value + moving : value.filter { !moving.contains($0) }
    return (next, [])
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["source": "Có sẵn", "target": "Đã chọn", "toTarget": "Chuyển sang đã chọn", "toSource": "Chuyển về có sẵn"],
      "en": ["source": "Available", "target": "Selected", "toTarget": "Move to selected", "toSource": "Move to available"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func title(_ text: String?, fallback: String) -> String { text ?? fallback }
}

public enum CSOneTimeCode {
  public static let labelDefault = "One-time code"
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Mã dùng một lần"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func digits(_ raw: String, length requested: Double = 6) -> String {
    let length = CSRenderCount.whole(requested, fallback: 6)
    let numbers = raw.filter { $0.isASCII && $0.isNumber }
    return String(numbers.prefix(length))
  }

  public static func text(controlled: String?, inner: String, length: Double = 6) -> String {
    digits(controlled ?? inner, length: length)
  }

  public static func commit(raw: String, length: Double = 6, disabled: Bool) -> String? {
    guard !disabled else { return nil }
    return digits(raw, length: length)
  }

  public static func finished(_ value: String, length: Double = 6) -> String? {
    complete(value, length: length) ? value : nil
  }

  public static func box(value: String, index: Int) -> String {
    guard index >= 0, index < value.count else { return "" }
    return String(value[value.index(value.startIndex, offsetBy: index)])
  }

  public static func replace(value: String, index: Int, next: String, length: Double = 6) -> String? {
    let current = digits(value, length: length)
    if next.isEmpty {
      let head = String(current.prefix(max(0, index)))
      let tail = index >= 0 ? String(current.dropFirst(index + 1)) : current
      return head + tail
    }
    let typed = next.filter { $0.isASCII && $0.isNumber }
    if typed.isEmpty { return nil }
    let head = String(current.prefix(max(0, index)))
    let tail = index >= 0 ? String(current.dropFirst(index + 1)) : current
    return digits(head + typed + tail, length: length)
  }

  public static func backspace(value: String, index: Int, length: Double = 6) -> String {
    var chars = Array(digits(value, length: length))
    if index >= 0 && index < chars.count { chars.remove(at: index) }
    else if index > 0 && index - 1 < chars.count { chars.remove(at: index - 1) }
    return String(chars)
  }

  public static func paste(text: String, length: Double = 6, disabled: Bool) -> String? {
    guard !disabled else { return nil }
    return digits(text, length: length)
  }

  public static func digitName(label: String, index: Int, length: Int) -> String { "\(label) \(index + 1)/\(length)" }
  public static func advance(index: Int, length: Int) -> Int { length > 0 ? min(length - 1, max(0, index + 1)) : 0 }
  public static func retreat(index: Int) -> Int { max(0, index - 1) }
  public static func pastedFocus(count: Int, length: Int) -> Int { length > 0 ? min(length - 1, max(0, count)) : 0 }

  public static func complete(_ value: String, length requested: Double = 6) -> Bool {
    let length = CSRenderCount.whole(requested, fallback: 6)
    return length > 0 && value.count == length
  }
}

public enum CSCarouselModel {
  public static let roleDescription = "carousel"
  public static let slideDescription = "slide"
  public static let previousDefault = "Previous slide"
  public static let nextDefault = "Next slide"
  public static let slideDefault = "Slide"
  public static func groupLabel(_ label: String?) -> String? { label }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["prev": "Ảnh trước", "next": "Ảnh sau", "slide": "Ảnh"],
      "en": ["prev": previousDefault, "next": nextDefault, "slide": slideDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func slideLabel(index: Int, count: Int, word: String) -> String { "\(word) \(index + 1)/\(count)" }
  public static func status(index: Int, count: Int, word: String) -> String { count > 0 ? slideLabel(index: index, count: count, word: word) : "" }
  public static func hidden(index: Int, active: Int) -> Bool { index != active }
  public static func currentDot(index: Int, active: Int) -> Bool { index == active }
  public static func canMove(count: Int) -> Bool { count >= 2 }
  public static func clamp(index: Int, count: Int) -> Int {
    guard count > 0 else { return 0 }
    return min(count - 1, max(0, index))
  }

  public static func go(index: Int, delta: Int, count: Int) -> Int {
    guard count > 0 else { return 0 }
    let shifted = index + delta
    let remainder = shifted % count
    return remainder >= 0 ? remainder : remainder + count
  }
}

public struct CSTreeNode: Equatable {
  public let key: String
  public let label: String
  public let children: [CSTreeNode]

  public init(key: String, label: String, children: [CSTreeNode] = []) {
    self.key = key
    self.label = label
    self.children = children
  }
}

public enum CSTreeParent: Equatable {
  case missing
  case root
  case node(CSTreeNode)
}

public enum CSTreeMove: Equatable {
  case focus(String)
  case toggle(String)
  case openSiblings([String])
}

public enum CSTreeModel {
  public static func visible(nodes: [CSTreeNode], open: [String: Bool]) -> [CSTreeNode] {
    var out: [CSTreeNode] = []
    func walk(_ list: [CSTreeNode]) {
      for node in list {
        out.append(node)
        if !node.children.isEmpty && open[node.key] == true { walk(node.children) }
      }
    }
    walk(nodes)
    return out
  }

  public static func parent(nodes: [CSTreeNode], key: String, parentNode: CSTreeNode? = nil) -> CSTreeParent {
    for node in nodes {
      if node.key == key { return parentNode == nil ? .root : .node(parentNode!) }
      if !node.children.isEmpty {
        let found = parent(nodes: node.children, key: key, parentNode: node)
        if found != .missing { return found }
      }
    }
    return .missing
  }

  public static func move(nodes: [CSTreeNode], open: [String: Bool], key: String, arrow: CSRovingKey) -> CSTreeMove? {
    let shown = visible(nodes: nodes, open: open)
    guard let index = shown.firstIndex(where: { $0.key == key }) else { return nil }
    let node = shown[index]
    switch arrow {
    case .down:
      guard index < shown.count - 1 else { return nil }
      return .focus(shown[index + 1].key)
    case .up:
      guard index > 0 else { return nil }
      return .focus(shown[index - 1].key)
    case .home:
      return shown.isEmpty ? nil : .focus(shown[0].key)
    case .end:
      return shown.isEmpty ? nil : .focus(shown[shown.count - 1].key)
    case .right:
      if !node.children.isEmpty && open[key] != true { return .toggle(key) }
      if !node.children.isEmpty { return .focus(node.children[0].key) }
      return nil
    case .left:
      if !node.children.isEmpty && open[key] == true { return .toggle(key) }
      if case .node(let parentNode) = parent(nodes: nodes, key: key) { return .focus(parentNode.key) }
      return nil
    case .pageUp, .pageDown:
      return nil
    }
  }

  public static func openSiblings(nodes: [CSTreeNode], key: String) -> [String] {
    let siblings: [CSTreeNode]
    switch parent(nodes: nodes, key: key) {
    case .node(let parentNode):
      siblings = parentNode.children
    case .root:
      siblings = nodes
    case .missing:
      return []
    }
    return siblings.filter { !$0.children.isEmpty }.map(\.key)
  }
}

public enum CSFilePick {
  public static let titleDefault = "Drop files here or browse"
  public static let hintDefault = "PNG, JPG, or PDF up to 10MB"
  public static let icon = "M12 16V4M7 9l5-5 5 5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
  public static func names(_ files: [String], multiple: Bool) -> [String] {
    guard let first = files.first else { return [] }
    return multiple ? files : [first]
  }
  public static func notify(_ files: [String], multiple: Bool) -> [String]? {
    let picked = names(files, multiple: multiple)
    return picked.isEmpty ? nil : picked
  }
  public static func title(_ title: String?, fallback: String) -> String { title ?? fallback }
  public static func hint(_ hint: String?, fallback: String) -> String { hint ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["title": "Kéo tệp vào đây hoặc chọn", "hint": "PNG, JPG hoặc PDF, tối đa 10MB"],
      "en": ["title": titleDefault, "hint": hintDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func dragging(_ phase: String) -> Bool { phase == "over" }
}

public struct CSCommandPalette: View {
  public let placeholder: String?
  public let groups: [(title: String, items: [String])]
  public let query: String
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onQuery: (String) -> Void
  let onSelect: (String) -> Void
  let onClose: () -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var focusId = UUID().uuidString
  @State private var hoveredItem: String? = nil
  @FocusState private var trap: Int?

  public init(placeholder: String? = nil, groups: [(title: String, items: [String])], query: String, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onQuery: @escaping (String) -> Void, onSelect: @escaping (String) -> Void, onClose: @escaping () -> Void) {
    self.placeholder = placeholder
    self.groups = groups
    self.query = query
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onQuery = onQuery
    self.onSelect = onSelect
    self.onClose = onClose
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSCommandFilter.placeholder(placeholder, fallback: CSCommandFilter.copy("placeholder", language: locale))
    let filtered = CSCommandFilter.filter(groups: groups, query: query)
    let resultCount = filtered.reduce(0) { $0 + $1.items.count }
    let stops = CSCommandFilter.stops(resultCount: resultCount)
    let scrimBase = Color(.sRGB, red: Double(CSCommandFilter.scrimRed) / 255.0, green: Double(CSCommandFilter.scrimGreen) / 255.0, blue: Double(CSCommandFilter.scrimBlue) / 255.0, opacity: 1.0)
    let shape = RoundedRectangle(cornerRadius: pack.radiusLg.points)
    ZStack(alignment: .top) {
      if CSCommandFilter.closesOnBackdrop() {
        scrimBase.opacity(CSCommandFilter.scrimAlpha)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
          .contentShape(Rectangle())
          .onTapGesture {
            onQuery("")
            onClose()
          }
          .zIndex(pack.depthModal)
          .accessibilityHidden(true)
      }
      VStack(alignment: .leading, spacing: 0) {
        searchRow(pack: pack, locale: locale, hint: hint)
        resultsList(pack: pack, locale: locale, filtered: filtered, resultCount: resultCount)
      }
      .onAppear { trap = CSFocusTrap.initialIndex(preferred: 0, count: stops) }
      .csTabTrap { shift in
        let next = CSFocusTrap.nextIndex(current: trap ?? -1, count: stops, shift: shift, inside: trap != nil)
        trap = CSModalFocus.pullBack(inside: next != nil) ? CSFocusTrap.initialIndex(preferred: 0, count: stops) : next
        return stops > 0
      }
      .frame(maxWidth: CGFloat(CSCommandFilter.maxWidth()), alignment: .leading)
      .background(pack.colorSurfacePanel.color, in: shape)
      .clipShape(shape)
      .overlay(shape.stroke(pack.colorBorderDefault.color, lineWidth: CGFloat(CSCommandFilter.borderWidth())))
      .shadow(color: Color.black.opacity(0.24), radius: 24, x: 0, y: 12)
      .zIndex(pack.depthModal + 1)
      .accessibilityElement(children: .contain)
      .accessibilityLabel(CSCommandFilter.copy("aria", language: locale))
      .accessibilityAddTraits(.isModal)
      .onExitCommand {
        onQuery("")
        onClose()
      }
    }
  }

  private func searchRow(pack: CSTokenModePack, locale: String?, hint: String) -> some View {
    HStack(alignment: .center, spacing: CGFloat(CSCommandFilter.searchGap())) {
      CSIcon(name: "search", label: "", dark: dark, highContrast: highContrast, compact: compact)
        .frame(width: CGFloat(CSCommandFilter.searchIconSize()), height: CGFloat(CSCommandFilter.searchIconSize()))
        .foregroundStyle(pack.mutedColor)
      TextField(hint, text: Binding(get: { query }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { trap = 0 })
        onQuery(next)
      }))
        .textFieldStyle(.plain)
        .font(.system(size: pack.fontSizeMd.points))
        .foregroundStyle(pack.primaryTextColor)
        .focused($trap, equals: 0)
        .onChange(of: trap) { index in
          if index == 0 { CSFocusRegistry.shared.claim(id: focusId, restore: { trap = 0 }) }
        }
      CSKbd(CSCommandFilter.copy("esc", language: locale), dark: dark, highContrast: highContrast, compact: compact)
    }
    .padding(.vertical, CGFloat(CSCommandFilter.searchPaddingY()))
    .padding(.horizontal, CGFloat(CSCommandFilter.searchPaddingX()))
    .overlay {
      if CSCommandFilter.showsSearchOutline(focused: trap == 0) {
        ZStack {
          Rectangle()
            .stroke(pack.colorAccentOchre.color, lineWidth: CGFloat(CSInteractionModel.cmdkSearchInsetHaloWidth(focused: trap == 0)))
          Rectangle()
            .stroke(pack.primaryTextColor, lineWidth: CGFloat(CSCommandFilter.searchOutlineWidth()))
            .padding(CGFloat(-CSCommandFilter.searchOutlineOffset()))
          Rectangle()
            .stroke(pack.colorAccentOchre.color, lineWidth: CGFloat(CSInteractionModel.cmdkSearchOuterHaloWidth(focused: trap == 0)))
        }
      }
    }
    .overlay(alignment: .bottom) {
      Rectangle()
        .fill(pack.colorBorderDefault.color)
        .frame(height: CGFloat(CSCommandFilter.borderWidth()))
    }
  }

  private func resultsList(pack: CSTokenModePack, locale: String?, filtered: [(title: String, items: [String])], resultCount: Int) -> some View {
    ScrollView {
      VStack(alignment: .leading, spacing: CGFloat(CSCommandFilter.listGap())) {
        Text(CSCommandFilter.status(count: resultCount, language: locale))
          .font(.system(size: pack.fontSizeSm.points))
          .foregroundStyle(pack.primaryTextColor)
          .padding(.vertical, CGFloat(CSCommandFilter.statusPaddingY()))
          .padding(.horizontal, CGFloat(CSCommandFilter.statusPaddingX()))
          .accessibilityAddTraits(.updatesFrequently)
        ForEach(Array(filtered.enumerated()), id: \.offset) { groupIndex, group in
          if !group.items.isEmpty {
            let before = filtered.prefix(groupIndex).reduce(0) { $0 + $1.items.count }
            if CSCommandFilter.showsGroupLabel(group.title) {
              Text(CSCommandFilter.groupLabelText(group.title))
                .font(.system(size: pack.fontSizeXs.points))
                .tracking(CGFloat(CSCommandFilter.labelTracking() * pack.fontSizeXs.points))
                .foregroundStyle(pack.mutedColor)
                .padding(.top, CGFloat(CSCommandFilter.labelPaddingTop()))
                .padding(.horizontal, CGFloat(CSCommandFilter.labelPaddingX()))
                .padding(.bottom, CGFloat(CSCommandFilter.labelPaddingBottom()))
            }
            ForEach(Array(group.items.enumerated()), id: \.offset) { itemIndex, item in
              let stopIndex = before + itemIndex + 1
              let itemKey = "\(groupIndex)-\(itemIndex)"
              let raised = CSCommandFilter.itemShowsRaisedFill(hovered: hoveredItem == itemKey, selected: trap == stopIndex)
              CSTriggerButton(item) {
                onSelect(item)
                onQuery("")
                onClose()
              }
                .font(.system(size: pack.fontSizeSm.points))
                .foregroundStyle(pack.primaryTextColor)
                .padding(.vertical, CGFloat(CSCommandFilter.itemPaddingY()))
                .padding(.horizontal, CGFloat(CSCommandFilter.itemPaddingX()))
                .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
                .background(raised ? pack.colorSurfaceRaised.color : Color.clear, in: RoundedRectangle(cornerRadius: pack.radiusMd.points))
                .onHover { isHovered in
                  if isHovered { hoveredItem = itemKey }
                  else if hoveredItem == itemKey { hoveredItem = nil }
                }
                .focused($trap, equals: stopIndex)
            }
          }
        }
      }
      .padding(CGFloat(CSCommandFilter.listPadding()))
      .frame(maxWidth: .infinity, alignment: .leading)
    }
    .frame(maxHeight: CGFloat(CSCommandFilter.listMaxHeight()))
  }
}

public struct CSTransfer: View {
  public let items: [(key: String, label: String)]
  public let value: [String]
  public let checked: [String]
  public let sourceTitle: String?
  public let targetTitle: String?
  public let toTargetLabel: String?
  public let toSourceLabel: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: ([String], [String]) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(items: [(key: String, label: String)], value: [String], checked: [String], sourceTitle: String? = nil, targetTitle: String? = nil, toTargetLabel: String? = nil, toSourceLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping ([String], [String]) -> Void) {
    self.items = items
    self.value = value
    self.checked = checked
    self.sourceTitle = sourceTitle
    self.targetTitle = targetTitle
    self.toTargetLabel = toTargetLabel
    self.toSourceLabel = toSourceLabel
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let keys = items.map(\.key)
    let source = CSTransferModel.title(sourceTitle, fallback: CSTransferModel.copy("source", language: locale))
    let target = CSTransferModel.title(targetTitle, fallback: CSTransferModel.copy("target", language: locale))
    let toward = CSTransferModel.title(toTargetLabel, fallback: CSTransferModel.copy("toTarget", language: locale))
    let back = CSTransferModel.title(toSourceLabel, fallback: CSTransferModel.copy("toSource", language: locale))
    HStack(alignment: .top, spacing: CGFloat(CSControlsBatchStyleModel.transferGap())) {
      list(title: source, target: false, pack: pack)
      VStack(spacing: CGFloat(CSControlsBatchStyleModel.transferGap())) {
        Button {
          let next = CSTransferModel.move(value: value, checked: checked, items: keys, toTarget: true)
          onChange(next.value, next.checked)
        } label: {
          Text("›").frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
        }
        .accessibilityLabel(toward)
        Button {
          let next = CSTransferModel.move(value: value, checked: checked, items: keys, toTarget: false)
          onChange(next.value, next.checked)
        } label: {
          Text("‹").frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
        }
        .accessibilityLabel(back)
      }
      list(title: target, target: true, pack: pack)
    }
  }

  private func list(title: String, target: Bool, pack: CSTokenModePack) -> some View {
    VStack(alignment: .leading) {
      Text(title).foregroundStyle(pack.primaryTextColor)
      ForEach(items.filter { value.contains($0.key) == target }, id: \.key) { item in
        CSCheckbox(label: item.label, isOn: Binding(get: { checked.contains(item.key) }, set: { next in
          if next == checked.contains(item.key) { return }
          onChange(value, CSTransferModel.toggle(checked: checked, key: item.key))
        }), dark: dark, highContrast: highContrast, compact: compact)
      }
    }
    .frame(maxHeight: CGFloat(CSControlsBatchStyleModel.transferListMaxHeight()))
  }
}

public struct CSInputOTP: View {
  public let label: String?
  public let value: String
  public let length: Int
  public let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (String) -> Void
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, value: String, length: Double = 6, disabled: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping (String) -> Void) {
    self.label = label
    self.value = CSOneTimeCode.digits(value, length: length)
    self.length = CSRenderCount.whole(length, fallback: 6)
    self.disabled = disabled
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let name = CSOneTimeCode.label(label, fallback: CSOneTimeCode.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    HStack(spacing: CGFloat(CSControlsWaveStyleModel.otpGap())) {
      ForEach(0..<max(length, 0), id: \.self) { index in
        let digit = CSOneTimeCode.box(value: value, index: index)
        Text(digit.isEmpty ? "·" : digit)
          .font(.system(size: CGFloat(CSControlsWaveStyleModel.otpFontSize()), weight: .bold))
          .accessibilityLabel(CSOneTimeCode.digitName(label: name, index: index, length: max(length, 0)))
          .frame(width: CGFloat(CSControlsWaveStyleModel.otpCellWidth()), height: CGFloat(CSControlsWaveStyleModel.otpCellHeight()))
          .foregroundStyle(pack.primaryTextColor)
          .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(pack.borderColor, lineWidth: 1))
      }
    }
    .opacity(disabled ? CSControlsWaveStyleModel.otpDisabledOpacity : 1.0)
    TextField(name, text: Binding(get: { value }, set: { next in
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
      if let committed = CSOneTimeCode.commit(raw: next, length: Double(length), disabled: disabled) { onChange(committed) }
    }))
    .focused($focused)
    .onChange(of: focused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
    }
    .disabled(disabled)
    .opacity(disabled ? CSControlsWaveStyleModel.otpDisabledOpacity : 1.0)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(name)
    .accessibilityValue(Text(value))
  }
}

public struct CSCarousel: View {
  public let slides: [String]
  public let index: Int
  public let label: String?
  public let previousLabel: String?
  public let nextLabel: String?
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Int) -> Void

  public init(slides: [String], index: Int, label: String? = nil, previousLabel: String? = nil, nextLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onChange: @escaping (Int) -> Void, language: String? = nil) {
    self.slides = slides
    self.index = CSCarouselModel.clamp(index: index, count: slides.count)
    self.label = label
    self.previousLabel = previousLabel
    self.nextLabel = nextLabel
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let previousName = previousLabel ?? CSCarouselModel.copy("prev", language: spoken)
    let nextName = nextLabel ?? CSCarouselModel.copy("next", language: spoken)
    let slideWord = CSCarouselModel.copy("slide", language: spoken)
    let navSize = CGFloat(CSControlsBatchStyleModel.carouselNavSize())
    let dotTarget = CGFloat(CSControlsBatchStyleModel.carouselDotTargetSize())
    VStack(spacing: CGFloat(CSControlsBatchStyleModel.carouselGap())) {
      if slides.indices.contains(index) {
        Text(slides[index]).foregroundStyle(pack.primaryTextColor)
      }
      HStack(spacing: CGFloat(CSControlsBatchStyleModel.carouselGap())) {
        CSTriggerButton(previousName) { onChange(CSCarouselModel.go(index: index, delta: -1, count: slides.count)) }
          .disabled(!CSCarouselModel.canMove(count: slides.count))
          .frame(minWidth: navSize, minHeight: navSize)
        CSTriggerButton(nextName) { onChange(CSCarouselModel.go(index: index, delta: 1, count: slides.count)) }
          .disabled(!CSCarouselModel.canMove(count: slides.count))
          .frame(minWidth: navSize, minHeight: navSize)
      }
      HStack(spacing: CGFloat(CSControlsBatchStyleModel.carouselGap())) {
        ForEach(slides.indices, id: \.self) { dot in
          CSTriggerButton(CSCarouselModel.slideLabel(index: dot, count: slides.count, word: slideWord)) { onChange(dot) }
            .frame(minWidth: dotTarget, minHeight: dotTarget)
            .accessibilityValue(CSCarouselModel.currentDot(index: dot, active: index) ? "true" : "")
        }
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityValue(CSCarouselModel.status(index: index, count: slides.count, word: slideWord))
    .accessibilityLabel(CSCarouselModel.groupLabel(label) ?? "")
  }
}

public struct CSTree: View {
  public let label: String
  public let nodes: [CSTreeNode]
  public let open: [String: Bool]
  public let selected: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onOpen: ([String: Bool]) -> Void
  let onSelect: (String) -> Void
  @State private var keysArmed = false
  @FocusState private var treeFocused: Bool

  public init(label: String, nodes: [CSTreeNode], open: [String: Bool], selected: String?, dark: Bool, highContrast: Bool, compact: Bool, onOpen: @escaping ([String: Bool]) -> Void, onSelect: @escaping (String) -> Void) {
    self.label = label
    self.nodes = nodes
    self.open = open
    self.selected = selected
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onOpen = onOpen
    self.onSelect = onSelect
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let shown = CSTreeModel.visible(nodes: nodes, open: open)
    VStack(alignment: .leading, spacing: CGFloat(CSControlsBatchStyleModel.treeRowGap())) {
      ForEach(shown, id: \.key) { node in
        CSTriggerButton(node.label) {
          onSelect(node.key)
          if !node.children.isEmpty {
            var next = open
            next[node.key] = !(open[node.key] == true)
            onOpen(next)
          }
        }
        .frame(minWidth: CGFloat(CSControlsBatchStyleModel.treeTwistWidth()), maxWidth: .infinity, minHeight: max(pack.componentButtonMdMinHeight.points, CGFloat(CSControlsBatchStyleModel.treeTwistHeight())), alignment: .leading)
        .foregroundStyle(selected == node.key ? pack.colorBrandOchre.color : pack.primaryTextColor)
        .accessibilityAddTraits(selected == node.key ? .isSelected : [])
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(label)
    .focusable()
    .focused($treeFocused)
    .onChange(of: treeFocused) { isFocused in if isFocused { keysArmed = true } }
    .csRovingKeys { key in moveTree(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: treeFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveTree(key)
    })
  }

  private func moveTree(_ key: CSRovingKey) -> Bool {
    let shown = CSTreeModel.visible(nodes: nodes, open: open)
    guard let current = selected ?? shown.first?.key,
          let move = CSTreeModel.move(nodes: nodes, open: open, key: current, arrow: key) else { return false }
    switch move {
    case .focus(let key):
      onSelect(key)
    case .toggle(let key):
      var next = open
      next[key] = !(open[key] == true)
      onOpen(next)
    case .openSiblings:
      break
    }
    return true
  }
}

public struct CSFileUpload: View {
  public let title: String?
  public let hint: String?
  public let multiple: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onFiles: ([String]) -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String? = nil, hint: String? = nil, multiple: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onFiles: @escaping ([String]) -> Void) {
    self.title = title
    self.hint = hint
    self.multiple = multiple
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onFiles = onFiles
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let shownTitle = CSFilePick.title(title, fallback: CSFilePick.copy("title", language: spoken))
    let shownHint = CSFilePick.hint(hint, fallback: CSFilePick.copy("hint", language: spoken))
    VStack(alignment: .leading, spacing: CGFloat(CSControlsWaveStyleModel.dropzoneGap())) {
      Canvas { context, size in
        let source = CSIconPaths.path(data: CSFilePick.icon)
        let scale = min(size.width, size.height) / 24
        context.stroke(source.applying(CGAffineTransform(scaleX: scale, y: scale)), with: .color(pack.mutedColor), lineWidth: 1.8)
      }
      .frame(width: 28, height: 28)
      .accessibilityHidden(true)
      Text(shownTitle).foregroundStyle(pack.primaryTextColor)
      Text(shownHint).foregroundStyle(pack.mutedColor)
    }
    .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
    .padding(.horizontal, CGFloat(CSControlsWaveStyleModel.dropzonePaddingX()))
    .padding(.vertical, CGFloat(CSControlsWaveStyleModel.dropzonePaddingY()))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(pack.borderColor, lineWidth: CGFloat(CSControlsWaveStyleModel.dropzoneBorderWidth())))
    .accessibilityElement(children: .combine)
    .accessibilityLabel(shownTitle)
    .accessibilityHint(shownHint)
  }

  public func receive(_ files: [String]) {
    guard let picked = CSFilePick.notify(files, multiple: multiple) else { return }
    onFiles(picked)
  }
}

public enum CSDrawerModel {
  public static let closeLabel = "Close"
  public static let panelLabel = "Side panel"
  public static let width = 480.0
  public static let scrimRed = 31
  public static let scrimGreen = 19
  public static let scrimBlue = 11
  public static let scrimAlpha = 0.42
  public static let shadowAlpha = 0.22
  public static func borderWidth() -> Double { 1 }
  public static func shadowOffsetX(_ side: String?) -> Double { CSDrawerModel.side(side) == "left" ? 18 : -18 }
  public static func shadowBlur() -> Double { 48 }
  public static func scrimDepth(_ modalDepth: Double) -> Double { modalDepth }
  public static func panelDepth(_ modalDepth: Double) -> Double { modalDepth + 1 }
  public static func animates(reducedMotion: Bool) -> Bool { !reducedMotion }
  public static func headerGap() -> Double { 12 }
  public static func headerPaddingY() -> Double { 16 }
  public static func headerPaddingX() -> Double { 20 }
  public static func titleFontWeight() -> Int { 700 }
  public static func closePadding() -> Double { 4 }
  public static func closeIconSize() -> Double { 20 }
  public static func closeHovered(hovered: Bool) -> Bool { hovered }
  public static func bodyPadding() -> Double { 20 }
  public static func footerPaddingY() -> Double { 14 }
  public static func footerPaddingX() -> Double { 20 }
  public static func footerGap() -> Double { 10 }
  public static func side(_ side: String?) -> String { side == "left" ? "left" : "right" }
  public static func showsTitle(_ title: String?) -> Bool {
    guard let title else { return false }
    return !title.isEmpty
  }
  public static func label(title: String?, fallback: String) -> String {
    showsTitle(title) ? (title ?? "") : fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["close": "Đóng", "panel": "Bảng bên"],
      "en": ["close": closeLabel, "panel": panelLabel],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func showsActions(_ actions: String?) -> Bool {
    guard let actions else { return false }
    return !actions.isEmpty
  }
  public static func notify(hasOpenChange: Bool, hasClose: Bool) -> [String] {
    var events: [String] = []
    if hasOpenChange { events.append("open-false") }
    if hasClose { events.append("close") }
    return events
  }
  public static func bodyFocusable(scrollHeight: Double, clientHeight: Double, scrollWidth: Double, clientWidth: Double) -> Bool {
    scrollHeight > clientHeight + 1 || scrollWidth > clientWidth + 1
  }
}

public struct CSDrawer: View {
  public let title: String?
  public let message: String
  public let actions: String?
  public let side: String
  public let closeLabel: String?
  public let language: String?
  @Binding var open: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onOpenChange: ((Bool) -> Void)?
  let onClose: (() -> Void)?
  let onRestore: (() -> Void)?
  let layerId: String
  let layers: [CSOverlayLayer]
  @State private var restoreId: String? = nil
  @State private var closeFocusId = UUID().uuidString
  @State private var closeHovered = false
  @FocusState private var trap: Int?
  @Environment(\.csLanguage) private var ancestorLanguage
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(title: String? = nil, message: String, actions: String? = nil, side: String = "right", closeLabel: String? = nil, open: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, onOpenChange: ((Bool) -> Void)? = nil, onClose: (() -> Void)? = nil, onRestore: (() -> Void)? = nil, layerId: String? = nil, layers: [CSOverlayLayer]? = nil, language: String? = nil) {
    self.title = title
    self.message = message
    self.actions = actions
    self.side = side
    self.closeLabel = closeLabel
    self.language = language
    _open = open
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onOpenChange = onOpenChange
    self.onClose = onClose
    self.onRestore = onRestore
    let id = layerId ?? CSOverlayStack.freshId("drawer")
    self.layerId = id
    self.layers = layers ?? CSOverlayStack.solo(id)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let edge = CSDrawerModel.side(side)
    let languageName = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let spoken = CSDrawerModel.label(title: title, fallback: CSDrawerModel.copy("panel", language: languageName))
    let closeName = closeLabel ?? CSDrawerModel.copy("close", language: languageName)
    if open {
      let scrimBase = Color(.sRGB, red: Double(CSDrawerModel.scrimRed) / 255.0, green: Double(CSDrawerModel.scrimGreen) / 255.0, blue: Double(CSDrawerModel.scrimBlue) / 255.0, opacity: 1.0)
      ZStack(alignment: edge == "left" ? .leading : .trailing) {
        scrimBase.opacity(CSDrawerModel.scrimAlpha)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
          .contentShape(Rectangle())
          .onTapGesture(perform: close)
          .zIndex(CSDrawerModel.scrimDepth(pack.depthModal))
          .accessibilityHidden(true)
        VStack(alignment: .leading, spacing: 0) {
          HStack(alignment: .center, spacing: CGFloat(CSDrawerModel.headerGap())) {
            if let title, CSDrawerModel.showsTitle(title) {
              Text(title)
                .font(.system(size: pack.textH4.points, weight: .bold))
                .foregroundStyle(pack.primaryTextColor)
            }
            Spacer(minLength: 0)
            Button(action: {
              CSFocusRegistry.shared.claim(id: closeFocusId, restore: { trap = 0 })
              close()
            }) {
              CSIcon(name: "close", label: "", dark: dark, highContrast: highContrast, compact: compact)
                .frame(width: CGFloat(CSDrawerModel.closeIconSize()), height: CGFloat(CSDrawerModel.closeIconSize()))
                .foregroundStyle(CSDrawerModel.closeHovered(hovered: closeHovered) ? pack.colorSemanticDangerText.color : pack.mutedColor)
                .padding(CGFloat(CSDrawerModel.closePadding()))
                .frame(minWidth: 44, minHeight: 44)
            }
            .buttonStyle(.plain)
            .onHover { closeHovered = $0 }
            .accessibilityLabel(closeName)
            .focused($trap, equals: 0)
          }
          .padding(.vertical, CGFloat(CSDrawerModel.headerPaddingY()))
          .padding(.horizontal, CGFloat(CSDrawerModel.headerPaddingX()))
          .background(pack.colorSurfacePanel.color)
          .overlay(alignment: .bottom) {
            Rectangle()
              .fill(pack.colorBorderDefault.color)
              .frame(height: CGFloat(CSDrawerModel.borderWidth()))
          }
          ScrollView {
            Text(message)
              .foregroundStyle(pack.mutedColor)
              .frame(maxWidth: .infinity, alignment: .leading)
              .padding(CGFloat(CSDrawerModel.bodyPadding()))
          }
          .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
          if let actions, CSDrawerModel.showsActions(actions) {
            HStack(spacing: CGFloat(CSDrawerModel.footerGap())) {
              Spacer(minLength: 0)
              Text(actions).foregroundStyle(pack.primaryTextColor)
            }
            .padding(.vertical, CGFloat(CSDrawerModel.footerPaddingY()))
            .padding(.horizontal, CGFloat(CSDrawerModel.footerPaddingX()))
            .overlay(alignment: .top) {
              Rectangle()
                .fill(pack.colorBorderDefault.color)
                .frame(height: CGFloat(CSDrawerModel.borderWidth()))
            }
          }
        }
        .frame(maxWidth: CSDrawerModel.width, maxHeight: .infinity, alignment: .topLeading)
        .background(pack.colorSurfacePage.color)
        .overlay(alignment: edge == "left" ? .trailing : .leading) {
          Rectangle()
            .fill(pack.colorBorderDefault.color)
            .frame(width: CGFloat(CSDrawerModel.borderWidth()))
        }
        .shadow(
          color: scrimBase.opacity(CSDrawerModel.shadowAlpha),
          radius: CGFloat(CSDrawerModel.shadowBlur()),
          x: CGFloat(CSDrawerModel.shadowOffsetX(edge)),
          y: 0
        )
        .zIndex(CSDrawerModel.panelDepth(pack.depthModal))
        .animation(CSDrawerModel.animates(reducedMotion: reduceMotion) ? .easeInOut(duration: pack.durationBase.value / 1000.0) : nil, value: open)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(spoken)
        .onAppear {
          restoreId = CSFocusRegistry.shared.activeId
          CSOverlayRegistry.shared.push(id: layerId)
          trap = CSFocusTrap.initialIndex(preferred: nil, count: 1)
        }
        .onChange(of: trap) { index in
          if index == 0 { CSFocusRegistry.shared.claim(id: closeFocusId, restore: { trap = 0 }) }
        }
        .onDisappear { CSOverlayRegistry.shared.remove(id: layerId) }
        .csTabTrap { shift in
          let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
          guard CSOverlayStack.ownsFocus(id: layerId, layers: stack) else { return false }
          let next = CSFocusTrap.nextIndex(current: trap ?? -1, count: 1, shift: shift, inside: trap != nil)
          trap = CSModalFocus.pullBack(inside: next != nil) ? CSFocusTrap.initialIndex(preferred: nil, count: 1) : next
          return true
        }
      }
    }
  }

  private func close() {
    let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
    open = false
    onOpenChange?(false)
    onClose?()
    CSFocusReturn.perform(savedId: restoreId, onRestore: onRestore, layerId: layerId, layers: stack)
    CSOverlayRegistry.shared.remove(id: layerId)
  }
}

public enum CSResponsiveModel {
  public static let phoneBreakpoint: Double = 360
  public static let smBreakpoint: Double = 640
  public static let mdBreakpoint: Double = 768
  public static let xlBreakpoint: Double = 1280
  public static let canvasTrackMinWidth: Double = 960
  public static let touchFloor: Double = 44

  public static func mediaMaxWidthRatio() -> Double { 1.0 }
  public static func mediaAutoHeight() -> Bool { true }

  public static func cqContainerType() -> String { "inline-size" }
  public static func cqContainerName() -> String { "cs" }
  public static func cqColumns(columns: Int, containerWidth: Double) -> Int {
    if (columns == 2 || columns == 3 || columns == 4) && containerWidth <= mdBreakpoint { return 1 }
    return max(columns, 1)
  }
  public static func cqHideNarrow(containerWidth: Double) -> Bool { containerWidth <= mdBreakpoint }
  public static func cqStackColumn(containerWidth: Double) -> Bool { containerWidth <= smBreakpoint }
  public static func cqStackChildMinInlineSize() -> Double { 0 }
  public static func cqStackChildMaxInlineRatio() -> Double { 1.0 }

  public static func deskPaddingY(viewportWidth: Double) -> Double {
    viewportWidth <= smBreakpoint ? 12 : 24
  }
  public static func deskPaddingX(viewportWidth: Double) -> Double {
    viewportWidth <= smBreakpoint ? 6 : 10
  }
  public static func sheetPaddingY(viewportWidth: Double) -> Double {
    if viewportWidth <= phoneBreakpoint { return 20 }
    if viewportWidth <= smBreakpoint { return 26 }
    return 40
  }
  public static func sheetPaddingX(viewportWidth: Double) -> Double {
    if viewportWidth <= phoneBreakpoint { return 15 }
    if viewportWidth <= smBreakpoint { return 20 }
    return 40
  }
  public static func sheetRadius(viewportWidth: Double, defaultRadius: Double = 12) -> Double {
    viewportWidth <= smBreakpoint ? 8 : defaultRadius
  }
  public static func deskSheetOverflowWrapAnywhere(viewportWidth: Double) -> Bool {
    viewportWidth <= mdBreakpoint
  }
  public static func tableScrollsHorizontally(viewportWidth: Double) -> Bool {
    viewportWidth <= mdBreakpoint
  }

  public static func sidebarStacked(viewportWidth: Double) -> Bool { viewportWidth <= mdBreakpoint }
  public static func sidebarRowGap(viewportWidth: Double) -> Double { viewportWidth <= mdBreakpoint ? 4 : 2 }
  public static func sidebarColumnGap(viewportWidth: Double) -> Double { viewportWidth <= mdBreakpoint ? 10 : 0 }
  public static func sidebarBorderInlineEnd(viewportWidth: Double) -> Double { viewportWidth <= mdBreakpoint ? 0 : 1 }
  public static func sidebarBorderBlockEnd(viewportWidth: Double) -> Double { viewportWidth <= mdBreakpoint ? 1 : 0 }
  public static func sidebarLabelFullWidth(viewportWidth: Double) -> Bool { viewportWidth <= mdBreakpoint }
  public static func appShellColumns(viewportWidth: Double) -> Int { viewportWidth <= mdBreakpoint ? 1 : 2 }
  public static func appShellMainMinWidth() -> Double { 0 }

  public static func canvasDeskScrollsHorizontally() -> Bool { true }
  public static func canvasDeskTrackMinWidth(viewportWidth: Double) -> Double {
    viewportWidth <= xlBreakpoint ? canvasTrackMinWidth : 0
  }

  public static func sectionInlinePadding(authoredPadding: Double, viewportWidth: Double) -> Double {
    if viewportWidth <= smBreakpoint && (authoredPadding == 84 || authoredPadding == 80 || authoredPadding == 72) {
      return 22
    }
    return authoredPadding
  }

  public static func gridColumns(authoredColumns: Int, viewportWidth: Double, insideCanvasDesk: Bool = false) -> Int {
    let cols = max(authoredColumns, 1)
    if insideCanvasDesk { return cols }
    if viewportWidth <= smBreakpoint && cols >= 2 && cols <= 6 { return 1 }
    if viewportWidth <= mdBreakpoint && cols >= 3 && cols <= 6 { return 2 }
    return cols
  }

  public static func collapsesTwoColumnSpec(_ spec: String, viewportWidth: Double, insideCanvasDesk: Bool = false) -> Bool {
    if insideCanvasDesk { return false }
    if viewportWidth <= phoneBreakpoint && spec.contains("minmax(320px") { return true }
    guard viewportWidth <= smBreakpoint else { return false }
    let normalized = spec.replacingOccurrences(of: " ", with: "").lowercased()
    return normalized.contains("1fr1fr")
      || normalized.contains("1.15fr1fr")
      || normalized.contains("1fr1.15fr")
      || normalized.contains("2fr1fr")
      || normalized.contains("1fr2fr")
      || normalized.contains("auto1fr")
      || normalized.contains("248px1fr")
  }

  public static func navItemMinHeight(viewportWidth: Double, baseHeight: Double = 39) -> Double {
    viewportWidth <= mdBreakpoint ? max(baseHeight, touchFloor) : baseHeight
  }
  public static func searchMinHeight(viewportWidth: Double, baseHeight: Double = 26) -> Double {
    viewportWidth <= mdBreakpoint ? max(baseHeight, touchFloor) : baseHeight
  }

  public static func tabsScrollHorizontally(viewportWidth: Double) -> Bool { viewportWidth <= phoneBreakpoint }
  public static func tabsScrollbarWidth(viewportWidth: Double, coarsePointer: Bool) -> String {
    if coarsePointer { return "none" }
    if viewportWidth <= phoneBreakpoint { return "thin" }
    return "auto"
  }
  public static func paginationWraps(viewportWidth: Double) -> Bool { viewportWidth <= phoneBreakpoint }
  public static func otpWraps(viewportWidth: Double) -> Bool { viewportWidth <= phoneBreakpoint }
  public static func otpGap(viewportWidth: Double, defaultGap: Double = 8) -> Double {
    viewportWidth <= phoneBreakpoint ? 4 : defaultGap
  }
  public static func otpInputWidth(viewportWidth: Double, coarsePointer: Bool, defaultWidth: Double = 44) -> Double {
    (viewportWidth <= phoneBreakpoint && !coarsePointer) ? 36 : defaultWidth
  }
  public static func otpInputHeight(viewportWidth: Double, coarsePointer: Bool, defaultHeight: Double = 44) -> Double {
    (viewportWidth <= phoneBreakpoint && !coarsePointer) ? 40 : defaultHeight
  }
  public static func dlColumns(viewportWidth: Double, defaultColumns: Int = 2) -> Int {
    viewportWidth <= phoneBreakpoint ? 1 : defaultColumns
  }
  public static func fieldMinInlineSize() -> Double { 0 }
}
