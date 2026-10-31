import SwiftUI

public enum CSPageToken: Equatable {
  case page(Int)
  case ellipsis
}

public enum CSPaginationModel {
  public static func tokens(page: Int, count: Int) -> [CSPageToken] {
    if count <= 7 {
      return (0..<max(0, count)).map { .page($0 + 1) }
    }
    var out: [CSPageToken] = [.page(1)]
    let lo = max(2, page - 1)
    let hi = min(count - 1, page + 1)
    if lo > 2 { out.append(.ellipsis) }
    if lo <= hi {
      for number in lo...hi { out.append(.page(number)) }
    }
    if hi < count - 1 { out.append(.ellipsis) }
    out.append(.page(count))
    return out
  }
  public static let labelDefault = "Pagination"
  public static let previousDefault = "Previous page"
  public static let nextDefault = "Next page"
  public static func destination(page: Int, target: Int, count: Int, hasHandler: Bool) -> Int? {
    guard hasHandler, target >= 1, target <= count, target != page else { return nil }
    return target
  }
  public static func isCurrent(number: Int, page: Int) -> Bool { number == page }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Phân trang", "prev": "Trang trước", "next": "Trang sau"],
      "en": ["label": labelDefault, "prev": previousDefault, "next": nextDefault],
      "ja": ["label": "ページネーション", "prev": "前のページ", "next": "次のページ"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public enum CSNumberValue {
  public static func clamp(_ value: Double, min lower: Double?, max upper: Double?) -> Double {
    var number = value
    if let lower { number = Swift.max(lower, number) }
    if let upper { number = Swift.min(upper, number) }
    return number
  }
}

public enum CSRenderCount {
  public static func whole(_ value: Double, fallback: Int, minimum: Int = 0) -> Int {
    if !value.isFinite || value >= 4_294_967_296 { return fallback }
    return max(minimum, Int(value.rounded(.towardZero)))
  }
}

public enum CSRatingValue {
  public static let labelDefault = "Rating"
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func value(controlled: Int?, inner: Int) -> Int { controlled ?? inner }
  public static func groupName(label: String?, value: Int, max: Int, explicit: String?, hasLabelledBy: Bool, word: String = labelDefault) -> String? {
    if let explicit { return explicit }
    if hasLabelledBy { return nil }
    if let label, !label.isEmpty { return "\(label): \(value) / \(max)" }
    if label == nil { return "\(word): \(value) / \(max)" }
    return ": \(value) / \(max)"
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Đánh giá"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func starLabel(index: Int, max: Int) -> String { "\(index) / \(max)" }
  public static func focusIndex(value: Int, max: Int) -> Int { value > 0 ? Swift.min(max, Swift.max(0, value)) - 1 : 0 }
  public static func tabStop(index: Int, focus: Int, readOnly: Bool) -> Int { readOnly ? -1 : (index == focus ? 0 : -1) }
  public static func commit(current: Int, tapped: Int) -> Int {
    tapped == current ? 0 : tapped
  }

  public static func move(from: Int, delta: Int, max: Int) -> Int {
    guard max > 0 else { return 0 }
    let next = min(max - 1, Swift.max(0, from + delta))
    return next + 1
  }
}

public enum CSStepState: Equatable {
  case done
  case active
  case todo

  public static func resolve(index: Int, current: Int) -> CSStepState {
    if index < current { return .done }
    if index == current { return .active }
    return .todo
  }

  public static func marker(state: CSStepState, index: Int, number: Int?) -> String {
    if state == .done { return "✓" }
    if let number { return String(number) }
    return String(index + 1)
  }

  public static func isCurrent(_ state: CSStepState) -> Bool { state == .active }
  public static let labelDefault = "Steps"
  public static func listName(explicit: String?, fallback: String) -> String { fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Các bước"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func currentValue(_ state: CSStepState) -> String? { state == .active ? "step" : nil }
  public static func showsBody(_ body: String?) -> Bool { body != nil }
}

public enum CSAccordionModel {
  public static func initial(defaultOpen: Int?) -> [Int] {
    guard let defaultOpen, defaultOpen >= 0 else { return [] }
    return [defaultOpen]
  }
  public static func panelOpen(open: [Int], index: Int, allowMultiple: Bool) -> Bool {
    allowMultiple ? open.contains(index) : open.first == index
  }
  public static func collapse(_ open: [Int], allowMultiple: Bool) -> [Int] {
    if allowMultiple || open.count <= 1 { return open }
    return Array(open.prefix(1))
  }
  public static func toggle(open: [Int], index: Int, allowMultiple: Bool) -> [Int] {
    if allowMultiple {
      return open.contains(index) ? open.filter { $0 != index } : open + [index]
    }
    return open.first == index ? [] : [index]
  }
}

public enum CSTextareaModel {
  public static let defaultRows = 4
  public static let minHeight = 96.0
  public static func shows(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func isAlert(_ error: String?) -> Bool { shows(error) }
  public static func describedBy(_ parts: [String?]) -> String? {
    var seen = Set<String>()
    var tokens: [String] = []
    for part in parts {
      guard let part else { continue }
      for token in part.split(whereSeparator: \.isWhitespace).map(String.init) where !token.isEmpty {
        if seen.insert(token).inserted { tokens.append(token) }
      }
    }
    return tokens.isEmpty ? nil : tokens.joined(separator: " ")
  }
}

public struct CSTextarea: View {
  public let label: String?
  public let descriptionText: String?
  public let error: String?
  public let rows: Int
  public let disabled: Bool
  @Binding var text: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool

  public init(label: String? = nil, text: Binding<String>, description: String? = nil, error: String? = nil, rows: Int = CSTextareaModel.defaultRows, disabled: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.descriptionText = description
    self.error = error
    self.rows = rows
    self.disabled = disabled
    _text = text
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let described = CSTextareaModel.describedBy([descriptionText, error])
    VStack(alignment: .leading, spacing: 4) {
      if let label, CSTextareaModel.shows(label) {
        Text(label).foregroundStyle(pack.primaryTextColor)
      }
      TextField("", text: Binding(get: { text }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        text = next
      }), axis: .vertical)
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
        .lineLimit(rows...rows)
        .foregroundStyle(pack.primaryTextColor)
        .padding(8)
        .frame(minHeight: CSTextareaModel.minHeight, alignment: .topLeading)
        .background(pack.colorSurfacePanel.color)
        .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
        .accessibilityLabel(CSTextareaModel.shows(label) ? (label ?? "") : "")
        .accessibilityHint(described ?? "")
        .disabled(disabled)
      if let error, CSTextareaModel.isAlert(error) {
        Text(error).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
  }
}

public enum CSSearchModel {
  public static let placeholderDefault = "Search…"
  public static let clearDefault = "Clear search"
  public static let iconRadius = 7.0
  public static let iconLine = "M21 21l-4.3-4.3"
  public static func text(value: String?, inner: String) -> String { value ?? inner }
  public static func initial(_ defaultValue: String?) -> String { defaultValue ?? "" }
  public static func placeholder(_ placeholder: String?, fallback: String) -> String { placeholder ?? fallback }
  public static func clear(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Tìm kiếm…", "clear": "Xóa tìm kiếm"],
      "en": ["placeholder": placeholderDefault, "clear": clearDefault],
      "ja": ["placeholder": "検索…", "clear": "検索をクリア"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func showsClear(_ value: String) -> Bool { !value.isEmpty }
  public static func canEdit(disabled: Bool, readOnly: Bool) -> Bool { !disabled && !readOnly }
  public static func commit(current: String, next: String, disabled: Bool, readOnly: Bool) -> String? {
    canEdit(disabled: disabled, readOnly: readOnly) ? next : nil
  }
  public static func spokenLabel(ariaLabel: String?, hasLabelledBy: Bool, placeholder: String) -> String? {
    if let ariaLabel, !ariaLabel.isEmpty { return ariaLabel }
    return hasLabelledBy ? nil : placeholder
  }
}

public struct CSSearchField: View {
  public let clearLabel: String?
  public let language: String?
  public let placeholder: String?
  public let ariaLabel: String?
  public let hasLabelledBy: Bool
  public let disabled: Bool
  public let readOnly: Bool
  @Binding var text: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onClear: () -> Void
  @State private var clearFocusId = UUID().uuidString
  @State private var queryFocusId = UUID().uuidString
  @FocusState private var clearFocused: Bool
  @FocusState private var queryFocused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(text: Binding<String>, placeholder: String? = nil, clearLabel: String? = nil, ariaLabel: String? = nil, hasLabelledBy: Bool = false, disabled: Bool = false, readOnly: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onClear: @escaping () -> Void = {}) {
    _text = text
    self.placeholder = placeholder
    self.clearLabel = clearLabel
    self.ariaLabel = ariaLabel
    self.hasLabelledBy = hasLabelledBy
    self.disabled = disabled
    self.readOnly = readOnly
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onClear = onClear
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSSearchModel.placeholder(placeholder, fallback: CSSearchModel.copy("placeholder", language: locale))
    let clearName = CSSearchModel.clear(clearLabel, fallback: CSSearchModel.copy("clear", language: locale))
    let spoken = CSSearchModel.spokenLabel(ariaLabel: ariaLabel, hasLabelledBy: hasLabelledBy, placeholder: hint)
    let editable = Binding<String>(
      get: { text },
      set: { next in
        CSFocusRegistry.shared.claim(id: queryFocusId, restore: { queryFocused = true })
        guard CSSearchModel.commit(current: text, next: next, disabled: disabled, readOnly: readOnly) != nil else { return }
        text = next
      }
    )
    HStack {
      Canvas { context, size in
        let scale = min(size.width, size.height) / 24
        let radius = CSSearchModel.iconRadius * scale
        let center = CGPoint(x: 11 * scale, y: 11 * scale)
        var mark = Path(ellipseIn: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2))
        mark.addPath(CSIconPaths.path(data: CSSearchModel.iconLine).applying(CGAffineTransform(scaleX: scale, y: scale)))
        context.stroke(mark, with: .color(pack.mutedColor), lineWidth: 2 * scale)
      }
      .frame(width: 18, height: 18)
      .accessibilityHidden(true)
      TextField(hint, text: editable)
        .foregroundStyle(pack.primaryTextColor)
        .focused($queryFocused)
        .onChange(of: queryFocused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: queryFocusId, restore: { queryFocused = true }) }
        }
        .disabled(disabled)
        .accessibilityLabel(spoken ?? "")
      if CSSearchModel.showsClear(text) {
        Button(action: {
          CSFocusRegistry.shared.claim(id: clearFocusId, restore: { clearFocused = true })
          guard CSSearchModel.commit(current: text, next: "", disabled: disabled, readOnly: readOnly) != nil else { return }
          text = ""
          onClear()
        }) {
          CSIcon(name: "close", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .frame(minWidth: 44, minHeight: 44)
        }
        .focused($clearFocused)
        .disabled(!CSSearchModel.canEdit(disabled: disabled, readOnly: readOnly))
        .accessibilityLabel(clearName)
        .onChange(of: clearFocused) { focused in
          if focused { CSFocusRegistry.shared.claim(id: clearFocusId, restore: { clearFocused = true }) }
        }
      }
    }
    .accessibilityElement(children: .contain)
  }
}

public enum CSNumberFieldModel {
  public static let decreaseLabel = "Decrease"
  public static let increaseLabel = "Increase"
  public static let valueLabel = "Value"
  public static func showsLabel(_ label: String?) -> Bool {
    guard let label else { return false }
    return !label.isEmpty
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["decrease": "Giảm", "increase": "Tăng", "value": "Giá trị"],
      "en": ["decrease": decreaseLabel, "increase": increaseLabel, "value": valueLabel],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func canDecrease(disabled: Bool, value: String, min: Double?) -> Bool {
    if disabled { return false }
    guard value != "", let min, let number = Double(value) else { return true }
    return number > min
  }
  public static func canIncrease(disabled: Bool, value: String, max: Double?) -> Bool {
    if disabled { return false }
    guard value != "", let max, let number = Double(value) else { return true }
    return number < max
  }
  public static func commit(_ raw: String) -> Double? {
    if raw == "" { return nil }
    guard let number = Double(raw), number.isFinite else { return nil }
    return number
  }
  public static func blurEmpty(uncontrolled: Bool, empty: Bool, min: Double?, max: Double?) -> Double? {
    guard uncontrolled, empty else { return nil }
    return CSNumberValue.clamp(0, min: min, max: max)
  }
}

public struct CSNumberField: View {
  public let label: String?
  public let value: Double
  public let minimum: Double?
  public let maximum: Double?
  public let step: Double
  public let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Double) -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, value: Double, minimum: Double? = nil, maximum: Double? = nil, step: Double = 1, disabled: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping (Double) -> Void) {
    self.label = label
    self.value = value
    self.minimum = minimum
    self.maximum = maximum
    self.step = step
    self.disabled = disabled
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let shown = String(value)
    let down = CSNumberFieldModel.canDecrease(disabled: disabled, value: shown, min: minimum)
    let up = CSNumberFieldModel.canIncrease(disabled: disabled, value: shown, max: maximum)
    HStack {
      CSTriggerButton("−") {
        guard down else { return }
        onChange(CSNumberValue.clamp(value - step, min: minimum, max: maximum))
      }
      .disabled(!down)
      .frame(minWidth: 44, minHeight: 44)
      .accessibilityLabel(CSNumberFieldModel.copy("decrease", language: locale))
      if let label, CSNumberFieldModel.showsLabel(label) {
        Text(label).foregroundStyle(pack.primaryTextColor)
      }
      Text(shown).foregroundStyle(pack.primaryTextColor)
      CSTriggerButton("+") {
        guard up else { return }
        onChange(CSNumberValue.clamp(value + step, min: minimum, max: maximum))
      }
      .disabled(!up)
      .frame(minWidth: 44, minHeight: 44)
      .accessibilityLabel(CSNumberFieldModel.copy("increase", language: locale))
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSNumberFieldModel.showsLabel(label) ? (label ?? "") : CSNumberFieldModel.copy("value", language: locale))
    .accessibilityValue(Text(shown))
  }
}

public enum CSKbdModel {
  public static let size = 12.0
  public static let padX = 7.0
  public static let padY = 3.0
  public static let radius = 6.0
  public static let border = 1.0
  public static let borderBottom = 2.0
  public static let shadowY = 1.0
  public static let shadowBlur = 2.0
  public static func keyFace(_ text: String) -> String { text }
}

public struct CSKbd: View {
  public let keys: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(_ keys: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.keys = keys
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Text(CSKbdModel.keyFace(keys))
      .font(.system(size: CSKbdModel.size, design: .monospaced))
      .foregroundStyle(pack.primaryTextColor)
      .padding(.horizontal, CSKbdModel.padX)
      .padding(.vertical, CSKbdModel.padY)
      .background(pack.colorSurfacePanel.color)
      .overlay(RoundedRectangle(cornerRadius: CSKbdModel.radius).stroke(pack.borderColor, lineWidth: CSKbdModel.border))
      .overlay(alignment: .bottom) { Rectangle().fill(pack.borderColor).frame(height: CSKbdModel.borderBottom - CSKbdModel.border) }
      .shadow(color: (dark ? Color.black : pack.colorBrandUmber.color).opacity(dark ? 0.40 : 0.06), radius: CSKbdModel.shadowBlur, y: CSKbdModel.shadowY)
  }
}

public enum CSEmptyStateModel {
  public static let tray = "M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6"
  public static func title(_ title: String?, fallback: String) -> String { title ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["title": "Chưa có gì ở đây", "action": "Tạo mục đầu tiên"],
      "en": ["title": "Nothing here yet", "action": "Create your first item"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func shows(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func usesDefaultIcon(_ icon: String?) -> Bool { icon == nil }
}

public struct CSEmptyState: View {
  public let title: String?
  public let message: String?
  public let action: String?
  public let fallbackTitle: String?
  public let language: String?
  public let icon: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String? = nil, message: String? = nil, action: String? = nil, icon: String? = nil, fallbackTitle: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.title = title
    self.message = message
    self.action = action
    self.icon = icon
    self.fallbackTitle = fallbackTitle
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let heading = CSEmptyStateModel.title(title, fallback: fallbackTitle ?? CSEmptyStateModel.copy("title", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    VStack(spacing: 8) {
      if CSEmptyStateModel.usesDefaultIcon(icon) {
        Canvas { context, size in
          let source = CSIconPaths.path(data: CSEmptyStateModel.tray)
          let scale = min(size.width, size.height) / 24
          context.stroke(source.applying(CGAffineTransform(scaleX: scale, y: scale)), with: .color(pack.mutedColor), lineWidth: 1.8)
        }
        .frame(width: 26, height: 26)
        .accessibilityHidden(true)
      } else if let icon {
        CSIcon(name: icon, label: "", dark: dark, highContrast: highContrast, compact: compact)
      }
      Text(heading).font(.headline).foregroundStyle(pack.primaryTextColor)
      if CSEmptyStateModel.shows(message), let message { Text(message).foregroundStyle(pack.mutedColor) }
      if CSEmptyStateModel.shows(action), let action { Text(action).foregroundStyle(pack.colorBrandOchre.color) }
    }
    .frame(maxWidth: .infinity)
    .padding(16)
  }
}

public enum CSBreadcrumbModel {
  public static let labelDefault = "Breadcrumb"
  public static func href(_ href: String?) -> String {
    guard let href, !href.isEmpty else { return "#" }
    return href
  }
  public static func isCurrent(index: Int, count: Int) -> Bool { count > 0 && index == count - 1 }
  public static func showsSeparator(index: Int, count: Int) -> Bool { count > 1 && index < count - 1 }
  public static func navLabel(explicit: String?, hasExplicit: Bool, fallback: String) -> String {
    hasExplicit ? (explicit ?? "") : fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Đường dẫn"],
      "en": ["label": labelDefault],
      "ja": ["label": "パンくずリスト"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSBreadcrumbItem: Hashable {
  public let label: String
  public let href: String
  public init(label: String, href: String = "") {
    self.label = label
    self.href = href
  }
}

public struct CSBreadcrumb: View {
  public let label: String?
  public let items: [CSBreadcrumbItem]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, items: [CSBreadcrumbItem], dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.items = items
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack(spacing: 4) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        if CSBreadcrumbModel.isCurrent(index: index, count: items.count) {
          Text(item.label).foregroundStyle(pack.primaryTextColor).accessibilityValue(Text("page"))
        } else if let url = URL(string: CSBreadcrumbModel.href(item.href)) {
          Link(item.label, destination: url).foregroundStyle(pack.colorBrandOchre.color)
          if CSBreadcrumbModel.showsSeparator(index: index, count: items.count) {
            Text("/").foregroundStyle(pack.mutedColor).accessibilityHidden(true)
          }
        }
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSBreadcrumbModel.navLabel(explicit: label, hasExplicit: label != nil, fallback: CSBreadcrumbModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))))
  }
}

public struct CSPagination: View {
  public let page: Int
  public let pageCount: Int
  public let label: String?
  public let previousLabel: String?
  public let nextLabel: String?
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  public let tokens: [CSPageToken]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Int) -> Void

  public init(page: Int, pageCount: Int, label: String? = nil, previousLabel: String? = nil, nextLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onChange: @escaping (Int) -> Void, language: String? = nil) {
    self.page = page
    self.pageCount = pageCount
    self.label = label
    self.previousLabel = previousLabel
    self.nextLabel = nextLabel
    self.language = language
    tokens = CSPaginationModel.tokens(page: page, count: pageCount)
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let navName = label ?? CSPaginationModel.copy("label", language: spoken)
    let previousName = previousLabel ?? CSPaginationModel.copy("prev", language: spoken)
    let nextName = nextLabel ?? CSPaginationModel.copy("next", language: spoken)
    HStack(spacing: 4) {
      CSTriggerButton(previousName) {
        if let next = CSPaginationModel.destination(page: page, target: page - 1, count: pageCount, hasHandler: true) { onChange(next) }
      }
        .disabled(page <= 1)
        .frame(minWidth: 44, minHeight: 44)
      ForEach(Array(tokens.enumerated()), id: \.offset) { _, token in
        switch token {
        case .ellipsis:
          Text("…").foregroundStyle(pack.mutedColor).accessibilityHidden(true)
        case .page(let number):
          CSTriggerButton(String(number)) {
            if let next = CSPaginationModel.destination(page: page, target: number, count: pageCount, hasHandler: true) { onChange(next) }
          }
            .foregroundStyle(number == page ? pack.colorBrandOchre.color : pack.primaryTextColor)
            .frame(minWidth: 44, minHeight: 44)
            .accessibilityValue(Text(CSPaginationModel.isCurrent(number: number, page: page) ? "page" : ""))
        }
      }
      CSTriggerButton(nextName) {
        if let next = CSPaginationModel.destination(page: page, target: page + 1, count: pageCount, hasHandler: true) { onChange(next) }
      }
        .disabled(page >= pageCount)
        .frame(minWidth: 44, minHeight: 44)
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(navName)
  }
}

public struct CSStepItem: Hashable {
  public let title: String
  public let number: Int?
  public let body: String?
  public init(title: String, number: Int? = nil, body: String? = nil) {
    self.title = title
    self.number = number
    self.body = body
  }
}

public struct CSSteps: View {
  public let label: String
  public let steps: [CSStepItem]
  public let current: Int
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, steps: [CSStepItem], current: Int, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.steps = steps
    self.current = current
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack(alignment: .top, spacing: 12) {
      ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
        let state = CSStepState.resolve(index: index, current: current)
        VStack {
          Text(CSStepState.marker(state: state, index: index, number: step.number))
            .foregroundStyle(state == .todo ? pack.mutedColor : pack.colorBrandOchre.color)
          Text(step.title).foregroundStyle(pack.primaryTextColor)
          if CSStepState.showsBody(step.body), let body = step.body { Text(body).foregroundStyle(pack.mutedColor) }
        }
        .accessibilityElement(children: .combine)
        .accessibilityValue(CSStepState.currentValue(state) ?? "")
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSStepState.listName(explicit: label, fallback: CSStepState.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))))
  }
}

public enum CSStatusModel {
  public static let dotSize = 9.0
  public static let gap = 7.0
  public static func statusKind(_ name: String) -> CSStatusKind {
    switch name {
    case "online": return .online
    case "busy": return .busy
    case "error": return .error
    default: return .offline
    }
  }
  public static func toneClass(_ name: String) -> String { name }
  public static func pulses(pulse: Bool, reducedMotion: Bool) -> Bool { pulse && !reducedMotion }
}

public enum CSStatusKind {
  case online
  case busy
  case offline
  case error
}

public struct CSStatusIndicator: View {
  public let status: CSStatusKind
  public let title: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(status: CSStatusKind = .offline, title: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.status = status
    self.title = title
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let color: Color = switch status {
    case .online: pack.colorSemanticSuccess.color
    case .busy: pack.colorBrandOchre.color
    case .offline: pack.mutedColor
    case .error: pack.colorSemanticDanger.color
    }
    HStack(spacing: CSStatusModel.gap) {
      Circle().fill(color).frame(width: CSStatusModel.dotSize, height: CSStatusModel.dotSize).accessibilityHidden(true)
      Text(title).foregroundStyle(pack.primaryTextColor)
    }
  }
}

public struct CSRating: View {
  public let label: String?
  public let value: Int
  public let max: Int
  public let readOnly: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Int) -> Void
  public let language: String?
  @State private var keysArmed = false
  @FocusState private var ratingFocused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, value: Int, max requestedMax: Double = 5, readOnly: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, onChange: @escaping (Int) -> Void = { _ in }, language: String? = nil) {
    self.label = label
    self.value = value
    max = CSRenderCount.whole(requestedMax, fallback: 5)
    self.readOnly = readOnly
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack(spacing: 0) {
      ForEach(max > 0 ? Array(1...max) : [Int](), id: \.self) { star in
        CSTriggerButton(star <= value ? "★" : "☆") {
          if !readOnly { onChange(CSRatingValue.commit(current: value, tapped: star)) }
        }
        .disabled(readOnly)
        .foregroundStyle(pack.colorBrandOchre.color)
        .frame(minWidth: 44, minHeight: 44)
        .accessibilityLabel(CSRatingValue.starLabel(index: star, max: max))
        .accessibilityAddTraits(star == value ? .isSelected : [])
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSRatingValue.groupName(label: label, value: value, max: max, explicit: nil, hasLabelledBy: false, word: CSRatingValue.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))) ?? "")
    .accessibilityValue(Text(String(value) + " / " + String(max)))
    .focusable()
    .focused($ratingFocused)
    .onChange(of: ratingFocused) { isFocused in if isFocused { keysArmed = true } }
    .csRovingKeys { key in moveRating(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: ratingFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveRating(key)
    })
  }

  private func moveRating(_ key: CSRovingKey) -> Bool {
    guard !readOnly, max > 0 else { return false }
    let from = value > 0 ? min(max - 1, value - 1) : 0
    switch key {
    case .right, .up:
      onChange(CSRatingValue.move(from: from, delta: 1, max: max))
    case .left, .down:
      onChange(CSRatingValue.move(from: from, delta: -1, max: max))
    case .home:
      onChange(CSRatingValue.move(from: from, delta: -from, max: max))
    case .end:
      onChange(CSRatingValue.move(from: from, delta: max - 1 - from, max: max))
    case .pageUp, .pageDown:
      return false
    }
    return true
  }
}

public struct CSSegmentedControl: View {
  public let label: String
  public let options: [CSTabItem]
  @Binding var selection: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var keysArmed = false
  @FocusState private var segmentFocused: Bool

  public init(label: String, options: [CSTabItem], selection: Binding<String>, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.options = options
    _selection = selection
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack(spacing: 0) {
      ForEach(options, id: \.value) { option in
        CSTriggerButton(option.label) { selection = option.value }
          .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points)
          .foregroundStyle(selection == option.value ? pack.colorSurfacePage.color : pack.primaryTextColor)
          .background(selection == option.value ? pack.colorBrandUmber.color : Color.clear)
          .accessibilityAddTraits(selection == option.value ? .isSelected : [])
      }
    }
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(pack.borderColor, lineWidth: 1))
    .accessibilityElement(children: .contain)
    .accessibilityLabel(label)
    .focusable()
    .focused($segmentFocused)
    .onChange(of: segmentFocused) { isFocused in if isFocused { keysArmed = true } }
    .csRovingKeys { key in moveSegment(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: segmentFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveSegment(key)
    })
  }

  private func moveSegment(_ key: CSRovingKey) -> Bool {
    guard let index = options.firstIndex(where: { $0.value == selection }),
          let next = CSRoving.tabs(current: index, count: options.count, key: key) else { return false }
    selection = options[next].value
    return true
  }
}

public enum CSDescriptionModel {
  public static let columnMin = 160.0
  public static let columnGap = 24.0
  public static let rowGap = 14.0
  public static let termSize = 12.0
  public static let valueSize = 14.0
  public static let termTracking = 0.08
  public static func spoken(_ term: String) -> String { term }
}

public struct CSDescriptionItem: Hashable {
  public let term: String
  public let value: String
  public init(term: String, value: String) {
    self.term = term
    self.value = value
  }
}

public struct CSDescriptionList: View {
  public let items: [CSDescriptionItem]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(items: [CSDescriptionItem], dark: Bool, highContrast: Bool, compact: Bool) {
    self.items = items
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    LazyVGrid(columns: [GridItem(.adaptive(minimum: CSDescriptionModel.columnMin), spacing: CSDescriptionModel.columnGap)], spacing: CSDescriptionModel.rowGap) {
      ForEach(Array(items.enumerated()), id: \.offset) { _, item in
        VStack(alignment: .leading, spacing: 2) {
          Text(item.term)
            .font(.system(size: CSDescriptionModel.termSize))
            .textCase(.uppercase)
            .tracking(CSDescriptionModel.termSize * CSDescriptionModel.termTracking)
            .foregroundStyle(pack.mutedColor)
            .accessibilityLabel(CSDescriptionModel.spoken(item.term))
          Text(item.value)
            .font(.system(size: CSDescriptionModel.valueSize))
            .foregroundStyle(pack.primaryTextColor)
        }
      }
    }
  }
}

public enum CSButtonGroupModel {
  public static let overlap = -1.0
  public static let radius = 8.0
  public static func groupLabel(_ label: String?) -> String? { label }
}

public struct CSButtonGroup<Content: View>: View {
  public let label: String?
  let content: () -> Content

  public init(label: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.content = content
  }

  public var body: some View {
    let group = HStack(spacing: CSButtonGroupModel.overlap) { content() }
      .accessibilityElement(children: .contain)
    if let label = CSButtonGroupModel.groupLabel(label) {
      group.accessibilityLabel(label)
    } else {
      group
    }
  }
}

public enum CSAvatarGroupModel {
  public static let overlap = 10.0
  public static let ring = 2.0
}

public struct CSAvatarGroup: View {
  public let names: [String]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(names: [String], dark: Bool, highContrast: Bool, compact: Bool) {
    self.names = names
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack(spacing: -CSAvatarGroupModel.overlap) {
      ForEach(Array(names.enumerated()), id: \.offset) { _, name in
        CSAvatar(name: name, size: .sm, dark: dark, highContrast: highContrast, compact: compact)
          .overlay(Circle().stroke(pack.colorSurfacePanel.color, lineWidth: CSAvatarGroupModel.ring))
      }
    }
    .accessibilityElement(children: .contain)
  }
}

public enum CSResultStatus {
  case info
  case success
  case warning
  case error
}

public enum CSResultModel {
  public static func title(_ title: String?, status: String, language: String? = nil) -> String {
    title ?? copy(status, language: language)
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["success": "Hoàn tất", "error": "Chúng tôi chưa hoàn tất được", "warning": "Vui lòng kiểm tra", "info": "Đây là điều đã xảy ra"],
      "en": ["success": "Done", "error": "We couldn't complete that", "warning": "Please check", "info": "Here's what happened"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func fallback(_ status: String) -> String { copy(status, language: "en") }
  public static func icon(_ status: String) -> String {
    switch status {
    case "success", "error", "warning", "info": return status
    default: return "info"
    }
  }
  public static func shows(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func mark(_ status: String) -> String {
    switch icon(status) {
    case "success": return "M4 12.5l5 5 11-11"
    case "error": return "M6 6l12 12M18 6L6 18"
    case "warning": return "M12 3l10 18H2zM12 10v5M12 18.2v.1"
    default: return "M12 11v6M12 7.2v.1"
    }
  }
}

public struct CSResult: View {
  public let status: String
  public let title: String?
  public let message: String?
  public let action: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(status: String = "info", title: String? = nil, message: String? = nil, action: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.status = status
    self.title = title
    self.message = message
    self.action = action
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let kind = CSResultModel.icon(status)
    let ink: Color = switch kind {
    case "success": pack.colorSemanticSuccessText.color
    case "error": pack.colorSemanticDangerText.color
    case "warning": pack.colorSemanticWarningText.color
    default: pack.colorSemanticInfoText.color
    }
    let wash: Color = kind == "info" ? pack.accentTint.color : ink.opacity(kind == "error" ? 0.12 : 0.14)
    VStack(spacing: 10) {
      ZStack {
        Circle().fill(wash)
        if kind == "info" {
          Circle().stroke(ink, lineWidth: 2.2).frame(width: 22, height: 22)
        }
        Canvas { context, size in
          let source = CSIconPaths.path(data: CSResultModel.mark(status))
          let scale = 28.0 / 24.0
          let shift = (min(size.width, size.height) - 24 * scale) / 2
          context.stroke(source.applying(CGAffineTransform(scaleX: scale, y: scale).translatedBy(x: shift / scale, y: shift / scale)), with: .color(ink), lineWidth: 2.2)
        }
      }
      .frame(width: 64, height: 64)
      .accessibilityHidden(true)
      Text(CSResultModel.title(title, status: status, language: locale)).font(.system(size: 22, weight: .heavy)).foregroundStyle(pack.primaryTextColor)
      if let message, CSResultModel.shows(message) {
        Text(message).foregroundStyle(pack.mutedColor).multilineTextAlignment(.center)
      }
      if let action, CSResultModel.shows(action) {
        Text(action).foregroundStyle(pack.primaryTextColor)
      }
    }
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(.updatesFrequently)
  }
}

public enum CSLinkModel {
  public static let newContext = "noopener noreferrer"
  public static func href(_ href: String?) -> String { href ?? "#" }
  public static func opensNew(_ external: Bool) -> Bool { external }
  public static func suffix(external: Bool, variant: String) -> String {
    if external { return " ↗" }
    if variant == "standalone" { return " →" }
    return ""
  }
  public static func tone(_ variant: String) -> String { variant == "muted" ? "muted" : "link" }
  public static func weight(_ variant: String) -> String { variant == "standalone" ? "bold" : "regular" }
  public static func minTarget(coarse: Bool) -> Double { coarse ? 44 : 0 }
}

public struct CSLink: View {
  public let title: String
  public let href: String?
  public let variant: String
  public let external: Bool
  public let coarse: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(title: String, href: String? = nil, variant: String = "default", external: Bool = false, coarse: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.title = title
    self.href = href
    self.variant = variant
    self.external = external
    self.coarse = coarse
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let destination = CSLinkModel.href(href)
    let extra = CSLinkModel.suffix(external: external, variant: variant)
    let ink = CSLinkModel.tone(variant) == "muted" ? pack.colorTextMuted.color : pack.colorLink.color
    let heavy = CSLinkModel.weight(variant) == "bold"
    let target = CSLinkModel.minTarget(coarse: coarse)
    HStack(spacing: 0) {
      if let url = URL(string: destination) {
        Link(title, destination: url)
      } else {
        Text(title)
      }
      if !extra.isEmpty {
        Text(extra).accessibilityHidden(true)
      }
    }
    .fontWeight(heavy ? .bold : .regular)
    .foregroundStyle(ink)
    .frame(minWidth: target, minHeight: target, alignment: .leading)
    .csOwnFocus()
  }
}

public struct CSTooltipState: Equatable {
  public var hovered: Bool
  public var focused: Bool
  public var dismissed: Bool
  public var open: Bool { (hovered || focused) && !dismissed }
  public init(hovered: Bool, focused: Bool, dismissed: Bool) {
    self.hovered = hovered
    self.focused = focused
    self.dismissed = dismissed
  }
}

public enum CSTooltipModel {
  public static let labelDefault = "Tooltip"
  public static let gap = 8.0
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Chú thích"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func enter(_ state: CSTooltipState) -> CSTooltipState {
    CSTooltipState(hovered: true, focused: state.focused, dismissed: false)
  }
  public static func leave(_ state: CSTooltipState) -> CSTooltipState {
    CSTooltipState(hovered: false, focused: state.focused, dismissed: state.dismissed)
  }
  public static func focus(_ state: CSTooltipState) -> CSTooltipState {
    CSTooltipState(hovered: state.hovered, focused: true, dismissed: false)
  }
  public static func blur(_ state: CSTooltipState, inside: Bool) -> CSTooltipState {
    CSTooltipState(hovered: state.hovered, focused: inside ? state.focused : false, dismissed: state.dismissed)
  }
  public static func escape(_ state: CSTooltipState) -> CSTooltipState {
    CSTooltipState(hovered: state.hovered, focused: state.focused, dismissed: true)
  }
}

public struct CSTooltip<Content: View>: View {
  public let label: String?
  public let fallbackLabel: String?
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let content: () -> Content
  @State private var state = CSTooltipState(hovered: false, focused: false, dismissed: false)
  @State private var trigger: CGRect? = nil
  @State private var naturalSize: CGSize? = nil
  @State private var fittedSize: CGSize? = nil
  @State private var panelOrigin: CGPoint? = nil
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0
  @FocusState private var triggerFocused: Bool

  public init(label: String? = nil, fallbackLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.fallbackLabel = fallbackLabel
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSTooltipModel.label(label, fallback: fallbackLabel ?? CSTooltipModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    content()
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSTooltipTriggerKey.self, value: geo.frame(in: .global))
      })
      .focusable()
      .focused($triggerFocused)
      .onHover { inside in state = inside ? CSTooltipModel.enter(state) : CSTooltipModel.leave(state) }
      .onChange(of: triggerFocused) { isFocused in
        state = isFocused ? CSTooltipModel.focus(state) : CSTooltipModel.blur(state, inside: false)
      }
      .onExitCommand { state = CSTooltipModel.escape(state) }
      .overlay(alignment: .top) {
        if state.open, let trigger {
          let screen = CSContextMenuModel.screenSize()
          let anchor = CSFloatingRect(left: trigger.minX, top: trigger.minY, right: trigger.maxX, bottom: trigger.maxY, width: trigger.width, height: trigger.height)
          let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
          let initial = naturalSize.flatMap { size in CSFloatingModel.position(anchor: anchor, panelWidth: size.width, panelHeight: size.height, viewport: viewport, placement: "top", gap: CSTooltipModel.gap) }
          let placed = fittedSize.flatMap { size in initial.flatMap { first in CSFloatingModel.position(anchor: anchor, panelWidth: size.width, panelHeight: size.height, viewport: viewport, placement: first.placement, gap: CSTooltipModel.gap) } }
          let limit = min(240.0, initial?.maxWidth ?? placed?.maxWidth ?? 240)
          let scaleX = Double(panelScale.width == 0 ? 1 : panelScale.width)
          let scaleY = Double(panelScale.height == 0 ? 1 : panelScale.height)
          let originX = Double(panelOrigin?.x ?? trigger.minX)
          let originY = Double(panelOrigin?.y ?? trigger.minY)
          let shiftX = CGFloat(placed.map { ($0.left - originX) / scaleX } ?? 0)
          let shiftY = CGFloat(placed.map { ($0.top - originY) / scaleY } ?? 0)
          Text(spoken)
            .lineLimit(1)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .frame(maxWidth: CGFloat(limit), maxHeight: initial.map { CGFloat($0.maxHeight) })
            .background(GeometryReader { geo in
              let frame = geo.frame(in: .global)
              let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
              let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
              Color.clear.preference(key: CSTooltipPanelKey.self, value: CSTooltipMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
            })
            .offset(x: shiftX, y: shiftY)
            .opacity(placed == nil ? 0 : 1)
            .foregroundStyle(Color.white)
            .background(pack.colorBrandUmber.color)
            .accessibilityHidden(true)
        }
      }
      .accessibilityHint(state.open ? spoken : "")
      .onPreferenceChange(CSTooltipTriggerKey.self) { frame in
        if frame.width > 0, frame.height > 0 { trigger = frame }
      }
      .onChange(of: state.open) { isOpen in
        if !isOpen {
          naturalSize = nil
          fittedSize = nil
          panelOrigin = nil
          panelScale = CGSize(width: 1, height: 1)
          measurePass = 0
        }
      }
      .onPreferenceChange(CSTooltipPanelKey.self) { measure in
        guard state.open, measure.size.width > 0, measure.size.height > 0 else { return }
        panelOrigin = measure.origin
        panelScale = measure.scale
        if naturalSize == nil {
          naturalSize = measure.size
          measurePass = 1
        } else if measure.pass >= 1 {
          fittedSize = measure.size
        }
      }
  }
}

private struct CSTooltipTriggerKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSTooltipMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSTooltipPanelKey: PreferenceKey {
  static var defaultValue = CSTooltipMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSTooltipMeasure, nextValue: () -> CSTooltipMeasure) { value = nextValue() }
}

public enum CSToastVariant {
  case standard
  case success
  case danger
}

public enum CSToastModel {
  public static let stackGap = 10.0
  public static let stackLabel = "Notifications"
  public static let dismissFallback = "Close"
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["notifications": "Thông báo", "dismiss": "Đóng"],
      "en": ["notifications": stackLabel, "dismiss": dismissFallback],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func icon(_ name: String?) -> String {
    switch name {
    case "success", "danger", "default": return name ?? "default"
    default: return "default"
    }
  }
  public static func border(_ name: String?) -> String {
    switch name {
    case "success": return "success"
    case "danger": return "danger"
    case "default", nil: return "info"
    default: return "none"
    }
  }
  public static func mark(_ name: String?) -> String {
    switch icon(name) {
    case "success": return "M4 12.5l5 5 11-11"
    case "danger": return "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
    default: return "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
    }
  }
  public static func shows(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func showsClose(hasOpenChange: Bool, hasClose: Bool) -> Bool { hasOpenChange || hasClose }
  public static func notify(hasOpenChange: Bool, hasClose: Bool) -> [String] {
    var events: [String] = []
    if hasOpenChange { events.append("open-false") }
    if hasClose { events.append("close") }
    return events
  }
}

public struct CSToast: View {
  public let variant: String
  public let title: String?
  public let message: String?
  public let dismissLabel: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onOpenChange: ((Bool) -> Void)?
  let onClose: (() -> Void)?
  @State private var closeFocusId = UUID().uuidString
  @FocusState private var closeFocused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(variant: String = "default", title: String? = nil, message: String? = nil, dismissLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onOpenChange: ((Bool) -> Void)? = nil, onClose: (() -> Void)? = nil, language: String? = nil) {
    self.variant = variant
    self.title = title
    self.message = message
    self.dismissLabel = dismissLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onOpenChange = onOpenChange
    self.onClose = onClose
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let closeName = dismissLabel ?? CSToastModel.copy("dismiss", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))
    let edge = CSToastModel.border(variant)
    let ink: Color = switch edge {
    case "success": pack.colorSemanticSuccessText.color
    case "danger": pack.colorSemanticDangerText.color
    case "info": pack.colorSemanticInfoText.color
    default: pack.colorTextAccent.color
    }
    HStack(alignment: .top, spacing: 12) {
      Canvas { context, size in
        let source = CSIconPaths.path(data: CSToastModel.mark(variant))
        let scale = min(size.width, size.height) / 24
        context.stroke(source.applying(CGAffineTransform(scaleX: scale, y: scale)), with: .color(ink), lineWidth: 2)
      }
      .frame(width: 18, height: 18)
      .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 2) {
        if let title, CSToastModel.shows(title) {
          Text(title).font(.system(size: 14, weight: .bold)).foregroundStyle(pack.primaryTextColor)
        }
        if let message, CSToastModel.shows(message) {
          Text(message).foregroundStyle(pack.mutedColor)
        }
      }
      Spacer(minLength: 0)
      if CSToastModel.showsClose(hasOpenChange: onOpenChange != nil, hasClose: onClose != nil) {
        Button(action: {
          CSFocusRegistry.shared.claim(id: closeFocusId, restore: { closeFocused = true })
          onOpenChange?(false)
          onClose?()
        }) {
          CSIcon(name: "close", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .frame(minWidth: 44, minHeight: 44)
        }
        .focused($closeFocused)
        .onChange(of: closeFocused) { focused in
          if focused { CSFocusRegistry.shared.claim(id: closeFocusId, restore: { closeFocused = true }) }
        }
        .onDisappear { CSFocusRegistry.shared.disconnect(id: closeFocusId) }
        .accessibilityLabel(closeName)
      }
    }
    .padding(.horizontal, 14)
    .padding(.vertical, 12)
    .background(pack.colorSurfacePanel.color)
    .overlay(alignment: .leading) {
      if edge != "none" { Rectangle().fill(ink).frame(width: 4) }
    }
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.updatesFrequently)
  }
}

public struct CSAccordionItem: Hashable {
  public let title: String
  public let content: String
  public init(title: String, content: String) {
    self.title = title
    self.content = content
  }
}

public struct CSAccordion: View {
  public let items: [CSAccordionItem]
  public let allowMultiple: Bool
  @State private var open: [Int]
  @State private var headerFocusId = UUID().uuidString
  @FocusState private var headerIndex: Int?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(items: [CSAccordionItem], defaultOpen: Int? = 0, allowMultiple: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.items = items
    self.allowMultiple = allowMultiple
    _open = State(initialValue: CSAccordionModel.initial(defaultOpen: defaultOpen))
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 0) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        let opened = CSAccordionModel.panelOpen(open: open, index: index, allowMultiple: allowMultiple)
        Button(action: {
          CSFocusRegistry.shared.claim(id: "\(headerFocusId)-\(index)", restore: { headerIndex = index })
          open = CSAccordionModel.toggle(open: open, index: index, allowMultiple: allowMultiple)
        }) {
          HStack {
            Text(item.title)
            Spacer()
            CSIcon(name: "chevron-down", label: "", dark: dark, highContrast: highContrast, compact: compact)
              .rotationEffect(.degrees(opened ? 180 : 0))
              .accessibilityHidden(true)
          }
        }
        .focused($headerIndex, equals: index)
        .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
        .foregroundStyle(pack.primaryTextColor)
        .accessibilityValue(Text(opened ? "expanded" : "collapsed"))
        if opened {
          Text(item.content).foregroundStyle(pack.mutedColor).padding(.bottom, 8)
        }
      }
    }
    .onChange(of: headerIndex) { index in
      if let index { CSFocusRegistry.shared.claim(id: "\(headerFocusId)-\(index)", restore: { headerIndex = index }) }
    }
    .onChange(of: allowMultiple) { multiple in
      open = CSAccordionModel.collapse(open, allowMultiple: multiple)
    }
  }
}
