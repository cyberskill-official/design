import SwiftUI

public enum CSTimeModel {
  public static let labelDefault = "Time"
  public static let valueDefault = "09:00"
  public static let defaultStep = 30.0
  public static let minStep = 1
  public static let maxStep = 1440
  public static let clockGlyph = "🕒"
  public static func showsClockIcon() -> Bool { true }
  public static func clockIconSize() -> Double { 16 }
  public static func clockIconStrokeWidth() -> Double { 1.8 }
  public static func safeStep(_ step: Double) -> Int {
    let whole = step.rounded(.towardZero)
    return step.isFinite && step == whole && whole >= Double(minStep) && whole <= Double(maxStep) ? Int(whole) : Int(defaultStep)
  }
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
    let safe = safeStep(step)
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
  public static let placementDefault = "bottom-start"
  public static let defaultRows = 3
  public static let maxHits = 6
  public static func resolvedPlacement(_ placement: String?) -> String { placement ?? placementDefault }
  public static func resolvedRows(_ rows: Int) -> Int { max(1, rows) }
  public static func resolvedValue(value: String?, defaultValue: String = "") -> String { value ?? defaultValue }
  public static func optionId(_ listId: String, index: Int) -> String { "\(listId)-opt-\(index)" }
  public static func activeDescendantId(_ listId: String, open: Bool, activeIndex: Int, hitCount: Int) -> String? {
    guard open, activeIndex >= 0, activeIndex < hitCount else { return nil }
    return optionId(listId, index: activeIndex)
  }
  public static func optionClass(active: Bool) -> String { active ? "hl" : "" }
  public static func acceptsKey(composing: Bool, keyCode: Int) -> Bool { !composing && keyCode != 229 }
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
    return Array(users.filter { $0.lowercased().contains(query) }.prefix(maxHits))
  }
  public static func dismissOutside(open: Bool, inside: Bool) -> Bool { open && !inside }
  public static func clearOnBlur(relatedInside: Bool) -> Bool { !relatedInside }
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String = placementDefault) -> CSMentionPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: placement, gap: 0) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: 0) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSMentionPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
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
  public static let gripGlyph = "⠿"
  public static let upGlyph = "↑"
  public static let downGlyph = "↓"
  public static func itemClass(dragging: Bool, over: Bool) -> String {
    ["cs-sortable__item", dragging ? "is-dragging" : nil, over ? "is-over" : nil].compactMap { $0 }.joined(separator: " ")
  }
  public static func startsDrag(fromOps: Bool, key: String) -> String? { fromOps ? nil : key }
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
  public static func listGap() -> Double { 6 }
  public static func maxWidth() -> Double { 380 }
  public static func itemGap() -> Double { 10 }
  public static func itemPaddingY() -> Double { 10 }
  public static func itemPaddingX() -> Double { 12 }
  public static func itemOpacity(dragging: Bool) -> Double { dragging ? 0.5 : 1 }
  public static func itemBorderWidth(over: Bool) -> Double { over ? 2 : 1 }
  public static func itemBorderColor(over: Bool, accent: CSColorValue, border: CSColorValue) -> CSColorValue { over ? accent : border }
  public static func opsGap() -> Double { 4 }
  public static func buttonOpacity(enabled: Bool) -> Double { enabled ? 1 : 0.4 }
  public static func rowAt(originY: Double, rowHeight: Double, count: Int, pointY: Double) -> Int? {
    guard count > 0, rowHeight > 0 else { return nil }
    let index = Int(((pointY - originY) / rowHeight).rounded(.down))
    if index < 0 || index >= count { return nil }
    return index
  }
  public static func drop(_ items: [String], from: Int?, to: Int?) -> [String]? {
    guard let from, let to else { return nil }
    let next = reorder(items, from: from, to: to)
    return next == items ? nil : next
  }
  public static func fallbackButtonAfterMove(to: Int, count: Int) -> String? {
    if to == 0 { return "down" }
    if count > 0, to == count - 1 { return "up" }
    return nil
  }
}

public enum CSTourModel {
  public static let dialogRole = "dialog"
  public static let skipButtonVariant = "ghost"
  public static let backButtonVariant = "secondary"
  public static let primaryButtonVariant = "primary"
  public static let buttonSize = "xs"
  public static func titleId(_ baseId: String) -> String { "\(baseId)-title" }
  public static func resetIndexOnOpen(open: Bool, current: Int) -> Int { open ? 0 : current }
  public static func primaryActionLabel(isLast: Bool, next: String, done: String) -> String { isLast ? done : next }
  public static func clamp(index: Int, count: Int) -> Int {
    guard count > 0 else { return 0 }
    return min(count - 1, max(0, index))
  }
  public static func notifyClose(onOpenChange: ((Bool) -> Void)?, onClose: (() -> Void)?) {
    onOpenChange?(false)
    onClose?()
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
  public static func shows(open: Bool, count: Int) -> Bool { open && count > 0 }
  public static func closesOnBackdrop() -> Bool { true }
  public static func stops(hasBack: Bool) -> Int { hasBack ? 3 : 2 }
  public static func showsBody(_ body: String?) -> Bool {
    guard let body else { return false }
    return !body.isEmpty
  }
  public static func hole(_ target: CSTourTarget?) -> CSTourHole? {
    guard let target else { return nil }
    return CSTourHole(x: target.left - 6, y: target.top - 6, w: target.width + 12, h: target.height + 12)
  }
  public static func pop(hole: CSTourHole?, viewWidth: Double, viewHeight: Double) -> CSTourPop {
    guard let hole else { return CSTourPop(top: 80, left: 40) }
    return CSTourPop(top: min(viewHeight - 170, hole.y + hole.h + 12), left: max(12, min(viewWidth - 292, hole.x)))
  }
}

public struct CSTourTarget: Equatable {
  public var left: Double
  public var top: Double
  public var width: Double
  public var height: Double
  public init(left: Double, top: Double, width: Double, height: Double) {
    self.left = left
    self.top = top
    self.width = width
    self.height = height
  }
}

public struct CSTourHole: Equatable {
  public var x: Double
  public var y: Double
  public var w: Double
  public var h: Double
  public init(x: Double, y: Double, w: Double, h: Double) {
    self.x = x
    self.y = y
    self.w = w
    self.h = h
  }
}

public struct CSTourPop: Equatable {
  public var top: Double
  public var left: Double
  public init(top: Double, left: Double) {
    self.top = top
    self.left = left
  }
}

public enum CSTableModel {
  public static let defaultRowKey = "id"
  public static let defaultState = "idle"
  public static func isBusy(_ state: String) -> Bool { state == "loading" }
  public static func wrapClass(_ state: String) -> String {
    state == "error" ? "cs-table-wrap cs-table-wrap--status" : "cs-table-wrap"
  }
  public static func role(_ state: String) -> String? {
    state == "error" ? "alert" : nil
  }
  public static func showsCustomLoading(_ loadingState: String?) -> Bool {
    loadingState != nil
  }
  public static func showsCustomError(_ errorState: String?) -> Bool {
    errorState != nil
  }
  public static func loadingRows(_ requested: Double) -> Int {
    CSRenderCount.whole(requested, fallback: 5, minimum: 1)
  }
  public static func columnCount(_ columns: [String]) -> Int {
    max(1, columns.count)
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
  public static func isAlert(_ state: String) -> Bool { state == "error" }
}

private struct CSOptionalTimeLabel: ViewModifier {
  var name: String?
  func body(content: Content) -> some View {
    if let name {
      content.accessibilityLabel(name)
    } else {
      content
    }
  }
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
    let gap = CGFloat(CSControlsWaveStyleModel.timePickerGap())
    let padX = CGFloat(CSControlsWaveStyleModel.timePickerPaddingX())
    let timeName = CSTimeModel.timeName(label: label, labelledBy: labelledBy, fallback: CSTimeModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    Menu {
      ForEach(CSTimeModel.slots(step: step), id: \.self) { slot in
        CSTriggerButton(slot) { onChange(slot) }
      }
    } label: {
      HStack(spacing: gap) {
        if CSTimeModel.showsClockIcon() {
          Text(CSTimeModel.clockGlyph)
            .foregroundStyle(pack.mutedColor)
            .accessibilityHidden(true)
        }
        Text(value)
          .foregroundStyle(pack.primaryTextColor)
          .padding(.horizontal, padX)
          .frame(minHeight: pack.componentButtonMdMinHeight.points)
      }
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
    .modifier(CSOptionalTimeLabel(name: timeName))
  }
}

public struct CSMentionPlace: Equatable {
  public var x: Double
  public var y: Double
  public var maxWidth: Double
  public var maxHeight: Double
  public var placement: String
  public init(x: Double, y: Double, maxWidth: Double, maxHeight: Double, placement: String) {
    self.x = x
    self.y = y
    self.maxWidth = maxWidth
    self.maxHeight = maxHeight
    self.placement = placement
  }
}

private enum CSMentionFocus: Hashable {
  case field
  case option(Int)
}

public struct CSMentions: View {
  public let ariaLabel: String?
  public let placeholder: String?
  public let text: String?
  public let defaultValue: String
  public let users: [String]
  public let rows: Int
  public let portal: Bool
  public let placement: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (String) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var focusId = UUID().uuidString
  @FocusState private var mentionFocus: CSMentionFocus?
  @State private var innerText: String
  @State private var active = 0
  @State private var dismissed = false
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0

  public init(ariaLabel: String? = nil, placeholder: String? = nil, text: String? = nil, defaultValue: String = "", users: [String] = [], rows: Int = CSMentionModel.defaultRows, portal: Bool = true, placement: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping (String) -> Void = { _ in }) {
    self.ariaLabel = ariaLabel
    self.placeholder = placeholder
    self.text = text
    self.defaultValue = defaultValue
    self.users = users
    self.rows = CSMentionModel.resolvedRows(rows)
    self.portal = portal
    self.placement = placement
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    _innerText = State(initialValue: defaultValue)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSMentionModel.placeholder(placeholder, fallback: CSMentionModel.copy("placeholder", language: locale))
    let spoken = CSMentionModel.name(ariaLabel: ariaLabel, placeholder: hint)
    let currentText = CSMentionModel.resolvedValue(value: text, defaultValue: innerText)
    let query = CSMentionModel.query(text: currentText, caret: currentText.count)
    let found = dismissed ? [] : CSMentionModel.hits(users: users, query: query)
    let current = CSMentionModel.active(active, count: found.count)
    let maxW = CGFloat(CSControlsBatchStyleModel.mentionsMaxWidth())
    let popupInlineStart = CGFloat(CSControlsBatchStyleModel.mentionsPopupInlineStart())
    let popupBlockOffset = CGFloat(CSControlsBatchStyleModel.mentionsPopupBlockOffset())
    let placeName = CSMentionModel.resolvedPlacement(placement)
    VStack(alignment: .leading) {
      TextField("", text: Binding(get: { currentText }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { mentionFocus = .field })
        dismissed = false
        active = 0
        if text == nil { innerText = next }
        onChange(next)
      }), prompt: Text(hint), axis: .vertical)
        .lineLimit(rows...rows)
        .frame(maxWidth: maxW)
        .focused($mentionFocus, equals: .field)
        .accessibilityLabel(spoken)
        .onSubmit {
          guard CSMentionModel.acceptsKey(composing: false, keyCode: 0), current < found.count else { return }
          let picked = CSMentionModel.pick(text: currentText, caret: currentText.count, user: found[current])
          if text == nil { innerText = picked }
          onChange(picked)
          dismissed = true
        }
        .onChange(of: mentionFocus) { next in
          if next == .field { CSFocusRegistry.shared.claim(id: focusId, restore: { mentionFocus = .field }) }
          if CSMentionModel.clearOnBlur(relatedInside: next != nil) { dismissed = true }
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
        .background(GeometryReader { geo in
          Color.clear.preference(key: CSMentionAnchorKey.self, value: geo.frame(in: .global))
        })
      if !found.isEmpty {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSMentionModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: placeName)
          }
        }
        VStack(alignment: .leading, spacing: 0) {
          ForEach(Array(found.enumerated()), id: \.offset) { index, user in
            let optId = CSMentionModel.optionId(focusId, index: index)
            CSTriggerButton(CSMentionModel.option(user)) {
              let picked = CSMentionModel.pick(text: currentText, caret: currentText.count, user: user)
              if text == nil { innerText = picked }
              onChange(picked)
              dismissed = true
            }
            .id(optId)
            .focused($mentionFocus, equals: .option(index))
            .frame(minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
            .accessibilityAddTraits(index == current ? .isSelected : [])
          }
        }
        .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSMentionPanelKey.self, value: CSMentionMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: CGFloat(placed?.x ?? Double(popupInlineStart)), y: CGFloat(placed?.y ?? Double(popupBlockOffset)))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
      }
    }
    .background(GeometryReader { _ in
      CSInlineOutside(active: !found.isEmpty) {
        if CSMentionModel.dismissOutside(open: true, inside: false) { dismissed = true }
      }
    })
    .onPreferenceChange(CSMentionAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSMentionPanelKey.self) { measure in
      guard !found.isEmpty, measure.size.width > 0, measure.size.height > 0 else { return }
      panelOrigin = measure.origin
      panelScale = measure.scale
      if naturalSize == nil {
        naturalSize = measure.size
        measurePass = 1
      } else if measure.pass >= 1 {
        fittedSize = measure.size
      }
    }
    .onChange(of: found.count) { count in
      if count == 0 {
        naturalSize = nil
        fittedSize = nil
        panelOrigin = nil
        panelScale = CGSize(width: 1, height: 1)
        measurePass = 0
      }
    }
  }
}

private struct CSMentionMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSMentionAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSMentionPanelKey: PreferenceKey {
  static var defaultValue = CSMentionMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSMentionMeasure, nextValue: () -> CSMentionMeasure) { value = nextValue() }
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
  @FocusState private var sortFocus: String?
  @State private var originY = 0.0
  @State private var rowHeight = 0.0
  @State private var dragFrom: Int?
  @State private var dragOver: Int?

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
    VStack(alignment: .leading, spacing: CGFloat(CSSortModel.listGap())) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        let isOver = dragFrom != nil && dragOver == index
        HStack(alignment: .center, spacing: CGFloat(CSSortModel.itemGap())) {
          HStack {
            Text(CSSortModel.gripGlyph).accessibilityHidden(true).foregroundStyle(pack.mutedColor)
            Text(item).font(.system(size: pack.fontSizeSm.points)).foregroundStyle(pack.primaryTextColor).frame(maxWidth: .infinity, alignment: .leading)
          }
          .gesture(DragGesture(minimumDistance: 4, coordinateSpace: .global).onChanged { value in
            if dragFrom == nil { dragFrom = index }
            dragOver = CSSortModel.rowAt(originY: originY, rowHeight: rowHeight, count: items.count, pointY: value.location.y)
          }.onEnded { value in
            let to = CSSortModel.rowAt(originY: originY, rowHeight: rowHeight, count: items.count, pointY: value.location.y)
            if let next = CSSortModel.drop(items, from: dragFrom, to: to) { onChange(next) }
            dragFrom = nil
            dragOver = nil
          })
          HStack(spacing: CGFloat(CSSortModel.opsGap())) {
            Button {
              if CSSortModel.canMoveUp(index) {
                let to = index - 1
                onChange(CSSortModel.reorder(items, from: index, to: to))
                if let fallback = CSSortModel.fallbackButtonAfterMove(to: to, count: items.count) {
                  sortFocus = "\(to)-\(fallback)"
                }
              }
            } label: {
              Text(CSSortModel.upGlyph).frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
            }
            .focused($sortFocus, equals: "\(index)-up")
            .disabled(!CSSortModel.canMoveUp(index))
            .opacity(CSSortModel.buttonOpacity(enabled: CSSortModel.canMoveUp(index)))
            .accessibilityLabel(up)
            Button {
              if CSSortModel.canMoveDown(index, count: items.count) {
                let to = index + 1
                onChange(CSSortModel.reorder(items, from: index, to: to))
                if let fallback = CSSortModel.fallbackButtonAfterMove(to: to, count: items.count) {
                  sortFocus = "\(to)-\(fallback)"
                }
              }
            } label: {
              Text(CSSortModel.downGlyph).frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
            }
            .focused($sortFocus, equals: "\(index)-down")
            .disabled(!CSSortModel.canMoveDown(index, count: items.count))
            .opacity(CSSortModel.buttonOpacity(enabled: CSSortModel.canMoveDown(index, count: items.count)))
            .accessibilityLabel(down)
          }
        }
        .padding(.horizontal, CGFloat(CSSortModel.itemPaddingX()))
        .padding(.vertical, CGFloat(CSSortModel.itemPaddingY()))
        .background(pack.colorSurfacePanel.color)
        .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
        .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(CSSortModel.itemBorderColor(over: isOver, accent: pack.accent, border: pack.colorBorderDefault).color, lineWidth: CGFloat(CSSortModel.itemBorderWidth(over: isOver))))
        .opacity(CSSortModel.itemOpacity(dragging: dragFrom == index))
        .background(GeometryReader { geo in
          Color.clear.preference(key: CSSortRowKey.self, value: geo.frame(in: .global))
        })
      }
    }
    .frame(maxWidth: CGFloat(CSSortModel.maxWidth()), alignment: .leading)
    .background(GeometryReader { geo in
      Color.clear.preference(key: CSSortListKey.self, value: geo.frame(in: .global).minY)
    })
    .onPreferenceChange(CSSortListKey.self) { y in
      originY = y
    }
    .onPreferenceChange(CSSortRowKey.self) { frame in
      if frame.height > 0 { rowHeight = frame.height }
    }
  }
}

private struct CSSortListKey: PreferenceKey {
  static var defaultValue = 0.0
  static func reduce(value: inout Double, nextValue: () -> Double) { value = nextValue() }
}

private struct CSSortRowKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) {
    let next = nextValue()
    if next.height > 0 { value = next }
  }
}

public struct CSTour: View {
  public let steps: [String]
  public let bodies: [String?]
  public let targets: [CSTourTarget?]
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
  let onClose: (() -> Void)?
  @Environment(\.csLanguage) private var ancestorLanguage
  @FocusState private var trap: Int?

  public init(steps: [String], index: Int, bodies: [String?] = [], targets: [CSTourTarget?] = [], backLabel: String? = nil, nextLabel: String? = nil, doneLabel: String? = nil, skipLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, open: Bool = true, language: String? = nil, onIndex: @escaping (Int) -> Void, onOpenChange: @escaping (Bool) -> Void, onClose: (() -> Void)? = nil) {
    self.steps = steps
    self.bodies = bodies
    self.targets = targets
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
    self.onClose = onClose
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let skip = CSTourModel.label(skipLabel, fallback: CSTourModel.copy("skip", language: locale))
    let back = CSTourModel.label(backLabel, fallback: CSTourModel.copy("back", language: locale))
    let next = CSTourModel.label(nextLabel, fallback: CSTourModel.copy("next", language: locale))
    let done = CSTourModel.label(doneLabel, fallback: CSTourModel.copy("done", language: locale))
    let last = CSTourModel.isLast(index: index, count: steps.count)
    let close = { CSTourModel.notifyClose(onOpenChange: onOpenChange, onClose: onClose) }
    Group {
      if !CSTourModel.shows(open: open, count: steps.count) {
        EmptyView()
      } else {
        let hasBack = index > 0
        let stops = CSTourModel.stops(hasBack: hasBack)
        let screen = CSContextMenuModel.screenSize()
        let target = targets.indices.contains(index) ? targets[index] : nil
        let hole = CSTourModel.hole(target)
        let pop = CSTourModel.pop(hole: hole, viewWidth: screen.width, viewHeight: screen.height)
        let body = bodies.indices.contains(index) ? bodies[index] : nil
        let holeDepth = CSControlsBatchStyleModel.tourHoleDepth(pack)
        let popDepth = CSControlsBatchStyleModel.tourPopDepth(pack)
        let popWidth = CGFloat(CSControlsBatchStyleModel.tourPopWidth())
        ZStack(alignment: .topLeading) {
          if CSTourModel.closesOnBackdrop() {
            Color.black.opacity(0.42)
              .frame(maxWidth: .infinity, maxHeight: .infinity)
              .contentShape(Rectangle())
              .onTapGesture { close() }
              .accessibilityHidden(true)
          }
          if let hole {
            RoundedRectangle(cornerRadius: pack.radiusMd.points)
              .stroke(pack.colorBrandOchre.color, lineWidth: 3)
              .frame(width: CGFloat(hole.w), height: CGFloat(hole.h))
              .position(x: CGFloat(hole.x + hole.w / 2), y: CGFloat(hole.y + hole.h / 2))
              .zIndex(holeDepth)
              .allowsHitTesting(false)
              .accessibilityHidden(true)
          }
          VStack(alignment: .leading, spacing: 8) {
            Text(steps[index]).foregroundStyle(pack.primaryTextColor)
            if CSTourModel.showsBody(body), let body { Text(body).foregroundStyle(pack.primaryTextColor) }
            Text(CSTourModel.countText(index: index, count: steps.count)).foregroundStyle(pack.mutedColor)
            HStack {
              CSTriggerButton(skip) { close() }
                .frame(minHeight: 44)
                .focused($trap, equals: 0)
              if hasBack {
                CSTriggerButton(back) { onIndex(index - 1) }
                  .frame(minHeight: 44)
                  .focused($trap, equals: 1)
              }
              CSTriggerButton(CSTourModel.primaryActionLabel(isLast: last, next: next, done: done)) {
                if last { close() } else { onIndex(index + 1) }
              }
              .frame(minHeight: 44)
              .focused($trap, equals: hasBack ? 2 : 1)
            }
          }
          .padding(16)
          .frame(maxWidth: popWidth, alignment: .leading)
          .background(pack.colorSurfacePanel.color)
          .zIndex(popDepth)
          .accessibilityElement(children: .contain)
          .accessibilityLabel(steps[index])
          .accessibilityAddTraits(.isModal)
          .onExitCommand { close() }
          .onAppear { trap = CSFocusTrap.initialIndex(preferred: nil, count: stops) }
          .csTabTrap { shift in
            let next = CSFocusTrap.nextIndex(current: trap ?? -1, count: stops, shift: shift, inside: trap != nil)
            trap = CSModalFocus.pullBack(inside: next != nil) ? CSFocusTrap.initialIndex(preferred: nil, count: stops) : next
            return stops > 0
          }
          .offset(x: CGFloat(pop.left), y: CGFloat(pop.top))
        }
      }
    }
    .onAppear { if open { onIndex(CSTourModel.resetIndexOnOpen(open: true, current: index)) } }
    .onChange(of: open) { isOpen in
      if isOpen { onIndex(CSTourModel.resetIndexOnOpen(open: true, current: index)) }
    }
  }
}

public struct CSDataTable: View {
  public let caption: String?
  public let columns: [String]
  public let rows: [[String]]
  public let rowKey: String
  public let state: String
  public let emptyLabel: String?
  public let errorLabel: String?
  public let loadingLabel: String?
  public let loadingRows: Int
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(caption: String? = nil, columns: [String], rows: [[String]], rowKey: String = CSTableModel.defaultRowKey, state: String = CSTableModel.defaultState, emptyLabel: String? = nil, errorLabel: String? = nil, loadingLabel: String? = nil, loadingRows requested: Double = 5, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.caption = caption
    self.columns = columns
    self.rows = rows
    self.rowKey = rowKey
    self.state = state
    self.emptyLabel = emptyLabel
    self.errorLabel = errorLabel
    self.loadingLabel = loadingLabel
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
    let captionMargin = CGFloat(CSTableStyleModel.captionMarginBottom())
    let statusPadY = CGFloat(CSTableStyleModel.statusPaddingY(pack))
    let cellPadX = CGFloat(CSTableStyleModel.cellPaddingX())
    let cellPadY = CGFloat(CSTableStyleModel.cellPaddingY())
    VStack(alignment: .leading, spacing: 4) {
      if CSTableModel.showsCaption(caption), let caption {
        Text(caption).foregroundStyle(pack.primaryTextColor).padding(.bottom, captionMargin)
      }
      if CSTableModel.isBusy(state) {
        VStack(alignment: .leading, spacing: 4) {
          if CSTableModel.showsCustomLoading(loadingLabel), let loadingLabel {
            Text(loadingLabel).foregroundStyle(pack.mutedColor)
          } else {
            if !columns.isEmpty {
              Text(columns.joined(separator: " "))
                .fontWeight(.bold)
                .foregroundStyle(pack.mutedColor)
                .padding(.horizontal, cellPadX)
                .padding(.vertical, cellPadY)
            }
            ForEach(0..<loadingRows, id: \.self) { _ in
              RoundedRectangle(cornerRadius: 4).fill(pack.borderColor).frame(height: 12)
            }
          }
        }
        .padding(.vertical, statusPadY)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(CSTableModel.copy("loading", language: locale))
        .accessibilityValue("true")
      } else if CSTableModel.isAlert(state) {
        Group {
          if CSTableModel.showsCustomError(errorLabel), let errorLabel {
            Text(errorLabel).foregroundStyle(pack.colorSemanticDangerText.color)
          } else {
            VStack(alignment: .leading) {
              Text(CSTableModel.copy("error", language: locale)).fontWeight(.bold).foregroundStyle(pack.colorSemanticDangerText.color)
              Text(CSTableModel.copy("errorHint", language: locale)).foregroundStyle(pack.mutedColor)
            }
          }
        }
        .padding(.vertical, statusPadY)
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.updatesFrequently)
      } else {
        if !columns.isEmpty {
          Text(columns.joined(separator: " "))
            .fontWeight(.bold)
            .foregroundStyle(pack.mutedColor)
            .padding(.horizontal, cellPadX)
            .padding(.vertical, cellPadY)
        }
        if rows.isEmpty {
          Text(empty).foregroundStyle(pack.mutedColor).padding(.vertical, statusPadY)
        } else {
          ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
            Text(row.joined(separator: " "))
              .foregroundStyle(pack.primaryTextColor)
              .padding(.horizontal, cellPadX)
              .padding(.vertical, cellPadY)
          }
        }
      }
    }
  }
}

public enum CSPopconfirmModel {
  public static let confirmDefault = "Confirm"
  public static let cancelDefault = "Cancel"
  public static let placementDefault = "bottom-start"
  public static let panelRole = "alertdialog"
  public static let triggerHasPopup = "dialog"
  public static let cancelButtonVariant = "ghost"
  public static let okButtonVariant = "primary"
  public static let buttonSize = "xs"
  public static let gap = 8.0
  public static func titleId(_ baseId: String) -> String { "\(baseId)-title" }
  public static func escapeClose() -> Bool { false }
  public static func okText(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func cancelText(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func triggerText(_ trigger: String?, title: String) -> String { trigger ?? title }
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
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String) -> CSPopconfirmPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: placement, gap: gap) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: gap) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSPopconfirmPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }
  public static func toggle(open: Bool, defaultPrevented: Bool) -> Bool? { defaultPrevented ? nil : !open }
  public static func confirmSteps() -> [String] { ["close", "confirm"] }
  public static func cancelSteps() -> [String] { ["close", "cancel"] }
}

public struct CSPopconfirmPlace: Equatable {
  public var x: Double
  public var y: Double
  public var maxWidth: Double
  public var maxHeight: Double
  public var placement: String
  public init(x: Double, y: Double, maxWidth: Double, maxHeight: Double, placement: String) {
    self.x = x
    self.y = y
    self.maxWidth = maxWidth
    self.maxHeight = maxHeight
    self.placement = placement
  }
}

public struct CSPopconfirm: View {
  public let title: String
  public let trigger: String?
  public let portal: Bool
  public let placement: String?
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
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0

  public init(title: String, trigger: String? = nil, portal: Bool = true, confirmLabel: String? = nil, cancelLabel: String? = nil, open: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void, onCancel: @escaping () -> Void = {}, language: String? = nil, placement: String? = nil) {
    self.title = title
    self.trigger = trigger
    self.portal = portal
    self.placement = placement
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
    let triggerFace = CSPopconfirmModel.triggerText(trigger, title: title)
    VStack(alignment: .leading) {
      CSTriggerButton(triggerFace) { if let next = CSPopconfirmModel.toggle(open: open, defaultPrevented: false) { open = next } }
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .accessibilityValue(open ? "true" : "false")
        .background(GeometryReader { geo in
          Color.clear.preference(key: CSPopconfirmAnchorKey.self, value: geo.frame(in: .global))
        })
      if open {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let place = CSPopconfirmModel.placement(placement, fallback: CSPopconfirmModel.placementDefault)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSPopconfirmModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: place)
          }
        }
        let minW = CGFloat(CSControlsWaveStyleModel.popconfirmMinWidth())
        let padY = CGFloat(CSControlsWaveStyleModel.popconfirmPaddingY())
        let padX = CGFloat(CSControlsWaveStyleModel.popconfirmPaddingX())
        let titleMargin = CGFloat(CSControlsWaveStyleModel.popconfirmTitleMarginBottom())
        let actionsGap = CGFloat(CSControlsWaveStyleModel.popconfirmActionsGap())
        VStack(alignment: .leading, spacing: titleMargin) {
          Text(title).foregroundStyle(pack.primaryTextColor)
          HStack(spacing: actionsGap) {
            CSTriggerButton(CSPopconfirmModel.cancelText(cancelLabel, fallback: CSPopconfirmModel.copy("cancel", language: spoken))) { open = false; onCancel() }.frame(minHeight: 44)
            CSTriggerButton(CSPopconfirmModel.okText(confirmLabel, fallback: CSPopconfirmModel.copy("ok", language: spoken))) { open = false; onConfirm() }.frame(minHeight: 44)
          }
        }
        .padding(.vertical, padY)
        .padding(.horizontal, padX)
        .frame(minWidth: minW, maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSPopconfirmPanelKey.self, value: CSPopconfirmMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? CSControlsWaveStyleModel.popconfirmOffset()))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
      }
    }
    .background(GeometryReader { _ in
      CSInlineOutside(active: open) { open = false }
    })
    .onExitCommand { open = CSPopconfirmModel.escapeClose() }
    .onPreferenceChange(CSPopconfirmAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSPopconfirmPanelKey.self) { measure in
      guard open, measure.size.width > 0, measure.size.height > 0 else { return }
      panelOrigin = measure.origin
      panelScale = measure.scale
      if naturalSize == nil {
        naturalSize = measure.size
        measurePass = 1
      } else if measure.pass >= 1 {
        fittedSize = measure.size
      }
    }
    .onChange(of: open) { isOpen in
      if !isOpen {
        naturalSize = nil
        fittedSize = nil
        panelOrigin = nil
        panelScale = CGSize(width: 1, height: 1)
        measurePass = 0
      }
    }
  }
}

private struct CSPopconfirmMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSPopconfirmAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSPopconfirmPanelKey: PreferenceKey {
  static var defaultValue = CSPopconfirmMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSPopconfirmMeasure, nextValue: () -> CSPopconfirmMeasure) { value = nextValue() }
}

public enum CSToggleModel {
  public static let labelDefault = "Toggle"
  public static func iconGap() -> Double { 6 }
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
  public let icon: String?
  public let pressed: Bool?
  public let defaultPressed: Bool
  public let disabled: Bool
  public let ariaLabel: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Bool) -> Void
  public let language: String?
  @State private var innerPressed: Bool
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String = "", icon: String? = nil, pressed: Bool? = nil, defaultPressed: Bool = false, disabled: Bool = false, ariaLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onChange: @escaping (Bool) -> Void = { _ in }, language: String? = nil) {
    self.label = label
    self.icon = icon
    self.pressed = pressed
    self.defaultPressed = defaultPressed
    self.disabled = disabled
    self.ariaLabel = ariaLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    self.language = language
    _innerPressed = State(initialValue: defaultPressed)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let isPressed = CSToggleModel.value(pressed: pressed, inner: innerPressed)
    let hasIcon = CSToggleModel.showsIcon(icon)
    let content = CSToggleModel.hasContent(text: label, hasNode: hasIcon)
    let name = CSToggleModel.toggleName(ariaLabel: ariaLabel, hasContent: content, fallback: CSToggleModel.copy("label", language: spoken))
    let padY = CGFloat(CSControlsWaveStyleModel.togglePaddingY())
    let padX = CGFloat(CSControlsWaveStyleModel.togglePaddingX())
    let minH = max(pack.componentButtonMdMinHeight.points, CGFloat(CSControlsWaveStyleModel.toggleMinHeight()))
    let disabledAlpha = CSControlsWaveStyleModel.toggleDisabledOpacity
    Button {
      if let next = CSToggleModel.flip(on: isPressed, disabled: disabled, defaultPrevented: false) {
        CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true })
        if pressed == nil { innerPressed = next }
        onChange(next)
      }
    } label: {
      if content {
        HStack(spacing: CGFloat(CSToggleModel.iconGap())) {
          if hasIcon, let icon {
            Text(icon).accessibilityHidden(true)
          }
          if !label.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            Text(label).accessibilityHidden(true)
          }
        }
        .padding(.vertical, padY)
        .padding(.horizontal, padX)
      }
    }
      .disabled(disabled)
      .opacity(disabled ? disabledAlpha : 1.0)
      .frame(minHeight: minH)
      .foregroundStyle(isPressed ? pack.colorBrandOchre.color : pack.primaryTextColor)
      .focused($ownerFocused)
      .accessibilityLabel(name ?? label)
      .accessibilityAddTraits(isPressed ? .isSelected : [])
      .onChange(of: ownerFocused) { isFocused in
        if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
      }
      .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}
