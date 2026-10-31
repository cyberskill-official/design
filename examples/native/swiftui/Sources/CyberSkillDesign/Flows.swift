import SwiftUI

public enum CSTimeModel {
  public static let labelDefault = "Time"
  public static let valueDefault = "09:00"
  public static func timeName(label: String?, labelledBy: String?, fallback: String) -> String? {
    if let label { return label }
    if let labelledBy, !labelledBy.isEmpty { return nil }
    return fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Giờ"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func slots(step: Double) -> [String] {
    let whole = step.rounded(.towardZero)
    let safe = step.isFinite && step == whole && whole >= 1 && whole <= 1440 ? Int(whole) : 30
    var out: [String] = []
    var minute = 0
    while minute < 24 * 60 {
      out.append(String(format: "%02d:%02d", minute / 60, minute % 60))
      minute += safe
    }
    return out
  }
}

public enum CSMentionModel {
  public static func query(text: String, caret: Int) -> String? {
    let end = min(max(caret, 0), text.count)
    let head = String(text.prefix(end))
    guard let at = head.lastIndex(of: "@") else { return nil }
    if at != head.startIndex {
      let before = head[head.index(before: at)]
      if !before.isWhitespace { return nil }
    }
    let after = head[head.index(after: at)...]
    let word = after.allSatisfy { $0.isASCII && ($0.isLetter || $0.isNumber || $0 == "_") }
    if !word { return nil }
    return String(after).lowercased()
  }

  public static func hits(users: [String], query: String?) -> [String] {
    guard let query else { return [] }
    return Array(users.filter { $0.lowercased().contains(query) }.prefix(6))
  }

  public static func pick(text: String, caret: Int, user: String) -> String {
    let end = min(max(caret, 0), text.count)
    let head = String(text.prefix(end))
    let tail = String(text.dropFirst(end))
    guard let at = head.lastIndex(of: "@") else { return text }
    let prefix = String(head[..<at])
    return prefix + "@" + user + " " + tail
  }

  public static let placeholderDefault = "Add a note — @ to mention"
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Thêm ghi chú — gõ @ để nhắc tên"],
      "en": ["placeholder": placeholderDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func name(ariaLabel: String?, placeholder: String) -> String {
    if let ariaLabel, !ariaLabel.isEmpty { return ariaLabel }
    return placeholder
  }
  public static func option(_ user: String) -> String { "@" + user }
  public static func active(_ index: Int, count: Int) -> Int {
    guard count > 0 else { return 0 }
    return min(max(0, index), count - 1)
  }
  public static func nextIndex(current: Int, count: Int, down: Bool) -> Int {
    guard count > 0 else { return 0 }
    if down { return min(count - 1, current + 1) }
    return max(0, current - 1)
  }
}

public enum CSSortModel {
  public static func reorder(_ items: [String], from: Int, to: Int) -> [String] {
    guard from >= 0, to >= 0, from < items.count, to < items.count, from != to else { return items }
    var next = items
    let moved = next.remove(at: from)
    next.insert(moved, at: to)
    return next
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["moveUp": "Di chuyển lên", "moveDown": "Di chuyển xuống"],
      "en": ["moveUp": "Move up", "moveDown": "Move down"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func label(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func canMoveUp(_ index: Int) -> Bool { index > 0 }
  public static func canMoveDown(_ index: Int, count: Int) -> Bool { index >= 0 && index < count - 1 }
}

public enum CSTourModel {
  public static func clamp(index: Int, count: Int) -> Int {
    guard count > 0 else { return 0 }
    return min(count - 1, max(0, index))
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["skip": "Bỏ qua", "back": "Quay lại", "next": "Tiếp", "done": "Xong"],
      "en": ["skip": "Skip", "back": "Back", "next": "Next", "done": "Done"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func label(_ text: String?, fallback: String) -> String { text ?? fallback }

  public static func isLast(index: Int, count: Int) -> Bool { count > 0 && index == count - 1 }

  public static func countText(index: Int, count: Int) -> String { "\(index + 1) / \(count)" }
}

public enum CSTableModel {
  public static func loadingRows(_ requested: Double) -> Int {
    CSRenderCount.whole(requested, fallback: 5, minimum: 1)
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["empty": "Không có kết quả", "loading": "Đang tải bảng", "error": "Không tải được bảng này", "errorHint": "Kiểm tra kết nối, rồi thử lại."],
      "en": ["empty": "No results", "loading": "Loading table", "error": "We couldn't load this table", "errorHint": "Check your connection, then try again."],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func text(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func showsCaption(_ caption: String?) -> Bool { caption?.isEmpty == false }
}

public struct CSTimePicker: View {
  public let label: String?
  public let labelledBy: String?
  public let value: String
  public let step: Double
  public let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (String) -> Void
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, labelledBy: String? = nil, value: String = CSTimeModel.valueDefault, step: Double = 30, disabled: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, onChange: @escaping (String) -> Void, language: String? = nil) {
    self.label = label
    self.labelledBy = labelledBy
    self.value = value
    self.step = step
    self.disabled = disabled
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Menu {
      ForEach(CSTimeModel.slots(step: step), id: \.self) { slot in
        CSTriggerButton(slot) { onChange(slot) }
      }
    } label: {
      Text(value).foregroundStyle(pack.primaryTextColor).frame(minHeight: pack.componentButtonMdMinHeight.points)
    }
    .disabled(disabled)
    .focused($focused)
    .onChange(of: focused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
    }
    .simultaneousGesture(TapGesture().onEnded {
      guard !disabled else { return }
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
    })
    .accessibilityLabel(CSTimeModel.timeName(label: label, labelledBy: labelledBy, fallback: CSTimeModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))) ?? "")
  }
}

public struct CSMentions: View {
  public let ariaLabel: String?
  public let placeholder: String?
  public let text: String
  public let users: [String]
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (String) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @State private var active = 0
  @State private var dismissed = false

  public init(ariaLabel: String? = nil, placeholder: String? = nil, text: String, users: [String], dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping (String) -> Void) {
    self.ariaLabel = ariaLabel
    self.placeholder = placeholder
    self.text = text
    self.users = users
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSMentionModel.placeholder(placeholder, fallback: CSMentionModel.copy("placeholder", language: locale))
    let spoken = CSMentionModel.name(ariaLabel: ariaLabel, placeholder: hint)
    let query = CSMentionModel.query(text: text, caret: text.count)
    let found = dismissed ? [] : CSMentionModel.hits(users: users, query: query)
    let current = CSMentionModel.active(active, count: found.count)
    VStack(alignment: .leading) {
      TextField("", text: Binding(get: { text }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        dismissed = false
        active = 0
        onChange(next)
      }), prompt: Text(hint), axis: .vertical)
        .lineLimit(3...3)
        .focused($focused)
        .accessibilityLabel(spoken)
        .onSubmit {
          guard current < found.count else { return }
          onChange(CSMentionModel.pick(text: text, caret: text.count, user: found[current]))
          dismissed = true
        }
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
        .csRovingKeys { key in
          guard !found.isEmpty else { return false }
          switch key {
          case .down:
            active = CSMentionModel.nextIndex(current: current, count: found.count, down: true)
            return true
          case .up:
            active = CSMentionModel.nextIndex(current: current, count: found.count, down: false)
            return true
          case .left, .right, .home, .end, .pageUp, .pageDown:
            return false
          }
        }
        .onExitCommand { dismissed = true }
      ForEach(Array(found.enumerated()), id: \.offset) { index, user in
        CSTriggerButton(CSMentionModel.option(user)) {
          onChange(CSMentionModel.pick(text: text, caret: text.count, user: user))
          dismissed = true
        }
        .frame(minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
        .accessibilityAddTraits(index == current ? .isSelected : [])
      }
    }
  }
}

public struct CSSortable: View {
  public let items: [String]
  public let upLabel: String?
  public let downLabel: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: ([String]) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(items: [String], upLabel: String? = nil, downLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping ([String]) -> Void) {
    self.items = items
    self.upLabel = upLabel
    self.downLabel = downLabel
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let up = CSSortModel.label(upLabel, fallback: CSSortModel.copy("moveUp", language: locale))
    let down = CSSortModel.label(downLabel, fallback: CSSortModel.copy("moveDown", language: locale))
    VStack(alignment: .leading) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        HStack {
          Text("⠿").accessibilityHidden(true).foregroundStyle(pack.mutedColor)
          Text(item).foregroundStyle(pack.primaryTextColor)
          Button {
            if CSSortModel.canMoveUp(index) { onChange(CSSortModel.reorder(items, from: index, to: index - 1)) }
          } label: {
            Text("↑").frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
          }
          .disabled(!CSSortModel.canMoveUp(index))
          .accessibilityLabel(up)
          Button {
            if CSSortModel.canMoveDown(index, count: items.count) { onChange(CSSortModel.reorder(items, from: index, to: index + 1)) }
          } label: {
            Text("↓").frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
          }
          .disabled(!CSSortModel.canMoveDown(index, count: items.count))
          .accessibilityLabel(down)
        }
      }
    }
  }
}

public struct CSTour: View {
  public let steps: [String]
  public let index: Int
  public let backLabel: String?
  public let nextLabel: String?
  public let doneLabel: String?
  public let skipLabel: String?
  public let open: Bool
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onIndex: (Int) -> Void
  let onOpenChange: (Bool) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(steps: [String], index: Int, backLabel: String? = nil, nextLabel: String? = nil, doneLabel: String? = nil, skipLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, open: Bool = true, language: String? = nil, onIndex: @escaping (Int) -> Void, onOpenChange: @escaping (Bool) -> Void) {
    self.steps = steps
    self.index = CSTourModel.clamp(index: index, count: steps.count)
    self.backLabel = backLabel
    self.nextLabel = nextLabel
    self.doneLabel = doneLabel
    self.skipLabel = skipLabel
    self.open = open
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onIndex = onIndex
    self.onOpenChange = onOpenChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let skip = CSTourModel.label(skipLabel, fallback: CSTourModel.copy("skip", language: locale))
    let back = CSTourModel.label(backLabel, fallback: CSTourModel.copy("back", language: locale))
    let next = CSTourModel.label(nextLabel, fallback: CSTourModel.copy("next", language: locale))
    let done = CSTourModel.label(doneLabel, fallback: CSTourModel.copy("done", language: locale))
    let last = CSTourModel.isLast(index: index, count: steps.count)
    Group {
      if !open || steps.isEmpty {
        EmptyView()
      } else {
        VStack(alignment: .leading, spacing: 8) {
          Text(steps[index]).foregroundStyle(pack.primaryTextColor)
          Text(CSTourModel.countText(index: index, count: steps.count)).foregroundStyle(pack.mutedColor)
          HStack {
            CSTriggerButton(skip) { onOpenChange(false) }.frame(minHeight: 44)
            if index > 0 {
              CSTriggerButton(back) { onIndex(index - 1) }.frame(minHeight: 44)
            }
            CSTriggerButton(last ? done : next) {
              if last { onOpenChange(false) } else { onIndex(index + 1) }
            }
            .frame(minHeight: 44)
          }
        }
        .padding(16)
        .background(pack.colorSurfacePanel.color)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(steps[index])
        .accessibilityAddTraits(.isModal)
        .onExitCommand { onOpenChange(false) }
      }
    }
    .onAppear { if open { onIndex(0) } }
    .onChange(of: open) { isOpen in
      if isOpen { onIndex(0) }
    }
  }
}

public struct CSDataTable: View {
  public let caption: String?
  public let columns: [String]
  public let rows: [[String]]
  public let state: String
  public let emptyLabel: String?
  public let errorLabel: String?
  public let loadingRows: Int
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(caption: String? = nil, columns: [String], rows: [[String]], state: String = "idle", emptyLabel: String? = nil, errorLabel: String? = nil, loadingRows requested: Double = 5, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.caption = caption
    self.columns = columns
    self.rows = rows
    self.state = state
    self.emptyLabel = emptyLabel
    self.errorLabel = errorLabel
    loadingRows = CSTableModel.loadingRows(requested)
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let empty = CSTableModel.text(emptyLabel, fallback: CSTableModel.copy("empty", language: locale))
    VStack(alignment: .leading, spacing: 4) {
      if CSTableModel.showsCaption(caption), let caption {
        Text(caption).foregroundStyle(pack.primaryTextColor)
      }
      if state == "loading" {
        VStack(alignment: .leading, spacing: 4) {
          ForEach(0..<loadingRows, id: \.self) { _ in
            RoundedRectangle(cornerRadius: 4).fill(pack.borderColor).frame(height: 12)
          }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(CSTableModel.copy("loading", language: locale))
        .accessibilityValue("true")
      } else if state == "error" {
        if let errorLabel {
          Text(errorLabel).foregroundStyle(pack.colorSemanticDangerText.color)
        } else {
          VStack(alignment: .leading) {
            Text(CSTableModel.copy("error", language: locale)).fontWeight(.bold).foregroundStyle(pack.colorSemanticDangerText.color)
            Text(CSTableModel.copy("errorHint", language: locale)).foregroundStyle(pack.mutedColor)
          }
        }
      } else if rows.isEmpty {
        Text(empty).foregroundStyle(pack.mutedColor)
      } else {
        ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
          Text(row.joined(separator: " ")).foregroundStyle(pack.primaryTextColor)
        }
      }
    }
  }
}

public enum CSPopconfirmModel {
  public static let confirmDefault = "Confirm"
  public static let cancelDefault = "Cancel"
  public static let placementDefault = "bottom-start"
  public static let gap = 8.0
  public static func okText(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func cancelText(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["ok": "Xác nhận", "cancel": "Hủy"],
      "en": ["ok": confirmDefault, "cancel": cancelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func placement(_ placement: String?, fallback: String) -> String { placement ?? fallback }
  public static func toggle(open: Bool, defaultPrevented: Bool) -> Bool? { defaultPrevented ? nil : !open }
  public static func confirmSteps() -> [String] { ["close", "confirm"] }
  public static func cancelSteps() -> [String] { ["close", "cancel"] }
}

public struct CSPopconfirm: View {
  public let title: String
  public let confirmLabel: String?
  public let cancelLabel: String?
  @Binding var open: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onConfirm: () -> Void
  let onCancel: () -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String, confirmLabel: String? = nil, cancelLabel: String? = nil, open: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void, onCancel: @escaping () -> Void, language: String? = nil) {
    self.title = title
    self.confirmLabel = confirmLabel
    self.cancelLabel = cancelLabel
    _open = open
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onConfirm = onConfirm
    self.onCancel = onCancel
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    VStack(alignment: .leading) {
      CSTriggerButton(title) { if let next = CSPopconfirmModel.toggle(open: open, defaultPrevented: false) { open = next } }
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .accessibilityValue(open ? "true" : "false")
      if open {
        Text(title).foregroundStyle(pack.primaryTextColor)
        HStack {
          CSTriggerButton(CSPopconfirmModel.cancelText(cancelLabel, fallback: CSPopconfirmModel.copy("cancel", language: spoken))) { open = false; onCancel() }.frame(minHeight: 44)
          CSTriggerButton(CSPopconfirmModel.okText(confirmLabel, fallback: CSPopconfirmModel.copy("ok", language: spoken))) { open = false; onConfirm() }.frame(minHeight: 44)
        }
      }
    }
    .onExitCommand { open = false }
  }
}

public enum CSToggleModel {
  public static let labelDefault = "Toggle"
  public static func value(pressed: Bool?, inner: Bool) -> Bool { pressed ?? inner }
  public static func hasContent(text: String?, hasNode: Bool = false) -> Bool {
    if hasNode { return true }
    guard let text else { return false }
    return !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
  }
  public static func toggleName(ariaLabel: String?, hasContent: Bool, fallback: String) -> String? {
    if let ariaLabel { return ariaLabel }
    return hasContent ? nil : fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Nút bật tắt"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func showsIcon(_ icon: String?) -> Bool {
    guard let icon else { return false }
    return !icon.isEmpty
  }
  public static func flip(on: Bool, disabled: Bool, defaultPrevented: Bool) -> Bool? {
    if disabled || defaultPrevented { return nil }
    return !on
  }
}

public struct CSToggle: View {
  public let label: String
  public let pressed: Bool
  public let disabled: Bool
  public let ariaLabel: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Bool) -> Void
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, pressed: Bool, disabled: Bool = false, ariaLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onChange: @escaping (Bool) -> Void, language: String? = nil) {
    self.label = label
    self.pressed = pressed
    self.disabled = disabled
    self.ariaLabel = ariaLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let content = CSToggleModel.hasContent(text: label)
    let name = CSToggleModel.toggleName(ariaLabel: ariaLabel, hasContent: content, fallback: CSToggleModel.copy("label", language: spoken))
    Button {
      if let next = CSToggleModel.flip(on: pressed, disabled: disabled, defaultPrevented: false) {
        CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true })
        onChange(next)
      }
    } label: {
      if content { Text(label).accessibilityHidden(true) }
    }
      .disabled(disabled)
      .frame(minHeight: pack.componentButtonMdMinHeight.points)
      .foregroundStyle(pressed ? pack.colorBrandOchre.color : pack.primaryTextColor)
      .focused($ownerFocused)
      .accessibilityLabel(name ?? label)
      .accessibilityAddTraits(pressed ? .isSelected : [])
      .onChange(of: ownerFocused) { isFocused in
        if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
      }
      .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}
