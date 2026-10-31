import SwiftUI

public enum CSMenuModel {
  public static let menuDefault = "Menu"
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["menu": "Trình đơn"],
      "en": ["menu": menuDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func index(current: Int, count: Int, key: CSRovingKey) -> Int? {
    guard count > 0 else { return nil }
    switch key {
    case .down:
      return nonnegative(current + 1, count)
    case .up:
      return nonnegative(current - 1 + count, count)
    case .home:
      return 0
    case .end:
      return count - 1
    default:
      return nil
    }
  }

  static func nonnegative(_ value: Int, _ count: Int) -> Int {
    let remainder = value % count
    return remainder >= 0 ? remainder : remainder + count
  }

  public static func typeaheadNeedle(previous: String, character: String, elapsedMs: Int) -> String {
    let letter = character.lowercased()
    let text = elapsedMs < 500 ? previous.lowercased() + letter : letter
    if text.allSatisfy({ String($0) == letter }) { return letter }
    return text
  }

  public static let gap = 6.0
  public static func placement(_ explicit: String?, align: String) -> String {
    if let explicit { return explicit }
    return align == "end" ? "bottom-end" : "bottom-start"
  }
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String) -> CSMenuPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: placement, gap: gap) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: gap) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSMenuPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }
  public static func typeahead(labels: [String], from: Int, needle: String) -> Int? {
    let count = labels.count
    guard count > 0, !needle.isEmpty else { return nil }
    let lowered = needle.lowercased()
    for step in 0..<count {
      let index = nonnegative(from + 1 + step, count)
      let label = labels[index].trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
      if label.hasPrefix(lowered) { return index }
    }
    return nil
  }
}

public struct CSMenubarState: Equatable {
  public var top: Int
  public var open: Int?
  public var item: Int

  public init(top: Int, open: Int?, item: Int) {
    self.top = top
    self.open = open
    self.item = item
  }
}

public enum CSMenubarModel {
  public static let labelDefault = "Application menu"
  public static let gap = 5.0
  public static func label(ariaLabel: String?, hasLabelledBy: Bool, fallback: String) -> String? {
    if let ariaLabel { return ariaLabel }
    return hasLabelledBy ? nil : fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Trình đơn ứng dụng"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func click(open: Int?, index: Int) -> Int? { open == index ? nil : index }
  public static func hover(open: Int?, index: Int) -> Int? {
    guard let open else { return nil }
    return open == index ? open : index
  }
  public static func isSeparator(_ item: String) -> Bool { item == "-" }
  public static func actionable(_ items: [String]) -> [String] { items.filter { !isSeparator($0) } }
  public static func tabStop(index: Int, focus: Int) -> Int { index == focus ? 0 : -1 }
  public static func tabClose(top: Int) -> CSMenubarState { CSMenubarState(top: top, open: nil, item: 0) }
  public static func bar(top: Int, open: Int?, menuCount: Int, itemCount: Int, key: CSRovingKey) -> CSMenubarState? {
    guard menuCount > 0 else { return nil }
    if key == .down || key == .up {
      let item = key == .up ? max(0, itemCount - 1) : 0
      return CSMenubarState(top: top, open: top, item: item)
    }
    guard let next = CSRoving.tabs(current: top, count: menuCount, key: key) else { return nil }
    return CSMenubarState(top: next, open: open == nil ? nil : next, item: 0)
  }

  public static func item(menu: Int, item: Int, menuCount: Int, itemCount: Int, key: CSRovingKey) -> CSMenubarState? {
    if key == .right || key == .left {
      guard let next = CSRoving.tabs(current: menu, count: menuCount, key: key) else { return nil }
      return CSMenubarState(top: next, open: next, item: 0)
    }
    guard let next = CSMenuModel.index(current: item, count: itemCount, key: key) else { return nil }
    return CSMenubarState(top: menu, open: menu, item: next)
  }
}

public struct CSMenuPlace: Equatable {
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

public struct CSMenu: View {
  public let label: String
  public let items: [String]
  public let align: String
  public let placement: String?
  @Binding var open: Bool
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0
  @State private var focus = -1
  @State private var keysArmed = false
  @FocusState private var menuFocused: Bool
  @State private var typed = ""
  @State private var typedAt = Date.distantPast
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, items: [String], open: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, onSelect: @escaping (String) -> Void = { _ in }, language: String? = nil, align: String = "start", placement: String? = nil) {
    self.label = label
    self.items = items
    self.align = align
    self.placement = placement
    _open = open
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let menuName = CSMenuModel.copy("menu", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))
    VStack(alignment: .leading, spacing: 0) {
      CSTriggerButton(label) {
        open.toggle()
        focus = open ? 0 : -1
      }
      .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSMenuAnchorKey.self, value: geo.frame(in: .global))
      })
      if open {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let place = CSMenuModel.placement(placement, align: align)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSMenuModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: place)
          }
        }
        VStack(alignment: .leading, spacing: 0) {
          ForEach(Array(items.enumerated()), id: \.offset) { index, item in
            CSTriggerButton(item) {
              focus = index
              open = false
              onSelect(item)
            }
            .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
            .foregroundStyle(focus == index ? pack.colorBrandOchre.color : pack.primaryTextColor)
            .accessibilityAddTraits(focus == index ? .isSelected : [])
          }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(menuName)
        .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSMenuPanelKey.self, value: CSMenuMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? 0))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
      }
    }
    .accessibilityElement(children: .contain)
    .focusable()
    .focused($menuFocused)
    .onChange(of: menuFocused) { isFocused in if isFocused { keysArmed = true } }
    .csMenuTypeahead(enabled: open) { character in
      let elapsed = Int(Date().timeIntervalSince(typedAt) * 1000)
      let needle = CSMenuModel.typeaheadNeedle(previous: typed, character: character, elapsedMs: elapsed)
      typed = needle
      typedAt = Date()
      guard let next = CSMenuModel.typeahead(labels: items, from: focus, needle: needle) else { return false }
      focus = next
      return true
    }
    .csRovingKeys { key in moveMenu(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: menuFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveMenu(key)
    })
    .onPreferenceChange(CSMenuAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSMenuPanelKey.self) { measure in
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

  private func moveMenu(_ key: CSRovingKey) -> Bool {
    guard open else {
      if key == .down || key == .up {
        open = true
        focus = key == .up ? max(0, items.count - 1) : 0
        return true
      }
      return false
    }
    guard let next = CSMenuModel.index(current: focus, count: items.count, key: key) else { return false }
    focus = next
    return true
  }
}

private struct CSMenuMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSMenuAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSMenuPanelKey: PreferenceKey {
  static var defaultValue = CSMenuMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSMenuMeasure, nextValue: () -> CSMenuMeasure) { value = nextValue() }
}

public struct CSMenubarMenu: Hashable {
  public let label: String
  public let items: [String]
  public init(label: String, items: [String]) {
    self.label = label
    self.items = items
  }
}

public struct CSMenubar: View {
  public let label: String?
  public let menus: [CSMenubarMenu]
  @State private var state = CSMenubarState(top: 0, open: nil, item: 0)
  @State private var keysArmed = false
  @FocusState private var barFocused: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void
  public let hasLabelledBy: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, menus: [CSMenubarMenu], dark: Bool, highContrast: Bool, compact: Bool, onSelect: @escaping (String) -> Void = { _ in }, hasLabelledBy: Bool = false, language: String? = nil) {
    self.label = label
    self.menus = menus
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
    self.hasLabelledBy = hasLabelledBy
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 0) {
        ForEach(Array(menus.enumerated()), id: \.offset) { index, menu in
          CSTriggerButton(menu.label) {
            state.open = CSMenubarModel.click(open: state.open, index: index)
            state.top = index
          }
          .onHover { inside in
            guard inside else { return }
            state.open = CSMenubarModel.hover(open: state.open, index: index)
          }
          .frame(minHeight: pack.componentButtonMdMinHeight.points)
          .foregroundStyle(state.top == index ? pack.colorBrandOchre.color : pack.primaryTextColor)
          .accessibilityAddTraits(state.open == index ? .isSelected : [])
        }
      }
      if let open = state.open, menus.indices.contains(open) {
        ForEach(Array(menus[open].items.enumerated()), id: \.offset) { index, item in
          if CSMenubarModel.isSeparator(item) {
            Rectangle().fill(pack.borderColor).frame(height: 1).accessibilityHidden(true)
          } else {
            let actionIndex = CSMenubarModel.actionable(Array(menus[open].items.prefix(index + 1))).count - 1
            CSTriggerButton(item) {
              onSelect(item)
              state.open = nil
            }
            .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
            .foregroundStyle(state.item == actionIndex ? pack.colorBrandOchre.color : pack.primaryTextColor)
          }
        }
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSMenubarModel.label(ariaLabel: label, hasLabelledBy: hasLabelledBy, fallback: CSMenubarModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))) ?? "")
    .focusable()
    .focused($barFocused)
    .onChange(of: barFocused) { isFocused in if isFocused { keysArmed = true } }
    .csRovingKeys { key in moveBar(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: barFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveBar(key)
    })
  }

  private func moveBar(_ key: CSRovingKey) -> Bool {
    if state.open == nil {
      let count = menus.indices.contains(state.top) ? CSMenubarModel.actionable(menus[state.top].items).count : 0
      guard let next = CSMenubarModel.bar(top: state.top, open: state.open, menuCount: menus.count, itemCount: count, key: key) else { return false }
      state = next
      return true
    }
    let menu = state.open ?? state.top
    let count = menus.indices.contains(menu) ? CSMenubarModel.actionable(menus[menu].items).count : 0
    guard let next = CSMenubarModel.item(menu: menu, item: state.item, menuCount: menus.count, itemCount: count, key: key) else { return false }
    state = next
    return true
  }
}

public enum CSBackTopModel {
  public static let labelDefault = "Back to top"
  public static let size = 44.0
  public static let icon = 18.0
  public static let inset = 24.0
  public static let bottom = 84.0
  public static let arrow = "M12 19V5M5 12l7-7 7 7"
  public static func visible(offset: Double, threshold: Double = 320) -> Bool {
    offset > threshold
  }
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Về đầu trang"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func behavior(reducedMotion: Bool) -> String { reducedMotion ? "instant" : "smooth" }
}

public struct CSBackTop: View {
  public let label: String?
  public let offset: Double
  public let threshold: Double
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onPress: () -> Void
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, offset: Double, threshold: Double = 320, dark: Bool, highContrast: Bool, compact: Bool, onPress: @escaping () -> Void, language: String? = nil) {
    self.label = label
    self.offset = offset
    self.threshold = threshold
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onPress = onPress
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    if CSBackTopModel.visible(offset: offset, threshold: threshold) {
      Button(action: {
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        onPress()
      }) {
        CSIconPaths.path(data: CSBackTopModel.arrow)
          .stroke(pack.primaryTextColor, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
          .frame(width: CSBackTopModel.icon, height: CSBackTopModel.icon)
          .accessibilityHidden(true)
      }
      .focused($focused)
      .onChange(of: focused) { isFocused in
        if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      }
      .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
      .frame(width: CSBackTopModel.size, height: CSBackTopModel.size)
      .background(pack.colorSurfacePanel.color)
      .clipShape(Circle())
      .overlay(Circle().stroke(pack.borderColor, lineWidth: 1))
      .accessibilityLabel(CSBackTopModel.label(label, fallback: CSBackTopModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))))
    }
  }
}

public enum CSFabModel {
  public static let mainSize = 56.0
  public static let miniSize = 42.0
  public static let inset = 24.0
  public static let gap = 10.0
  public static let dialGap = 8.0
  public static let placementDefault = "top-end"
  public static func label(_ label: String?) -> String? { label }
  public static func toggles(actionCount: Int) -> Bool { actionCount > 0 }
  public static func expanded(actionCount: Int, open: Bool) -> Bool? { actionCount > 0 ? open : nil }
  public static func nextOpen(actionCount: Int, open: Bool) -> Bool? { actionCount > 0 ? !open : nil }
  public static func showDial(open: Bool, actionCount: Int) -> Bool { open && actionCount > 0 }
}

public struct CSFab: View {
  public let label: String
  public let actions: [String]
  public let position: String
  @State private var open = false
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onPress: () -> Void

  public init(label: String, actions: [String] = [], position: String = "fixed", dark: Bool, highContrast: Bool, compact: Bool, onPress: @escaping () -> Void = {}) {
    self.label = label
    self.actions = actions
    self.position = position
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onPress = onPress
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: position == "static" ? .leading : .trailing, spacing: CSFabModel.gap) {
      if CSFabModel.showDial(open: open, actionCount: actions.count) {
        if position == "static" {
          HStack(spacing: CSFabModel.dialGap) { dial(pack: pack) }
        } else {
          VStack(spacing: CSFabModel.dialGap) { dial(pack: pack) }
        }
      }
      CSTriggerButton(label) {
        if let next = CSFabModel.nextOpen(actionCount: actions.count, open: open) { open = next } else { onPress() }
      }
      .frame(width: CSFabModel.mainSize, height: CSFabModel.mainSize)
      .foregroundStyle(pack.colorSemanticInfoFg.color)
      .background(pack.colorBrandUmber.color)
      .clipShape(Circle())
      .accessibilityLabel(CSFabModel.label(label) ?? "")
      .accessibilityValue(CSFabModel.expanded(actionCount: actions.count, open: open).map { $0 ? "true" : "false" } ?? "")
    }
    .onExitCommand { open = false }
  }

  private func dial(pack: CSTokenModePack) -> some View {
    ForEach(Array(actions.enumerated()), id: \.offset) { _, action in
      CSTriggerButton(action) { open = false }
        .frame(width: CSFabModel.miniSize, height: CSFabModel.miniSize)
        .foregroundStyle(pack.primaryTextColor)
        .background(pack.colorSurfacePanel.color)
        .clipShape(Circle())
        .accessibilityLabel(action)
    }
  }
}

public enum CSAIDisclosureModel {
  public static let labelDefault = "AI assisted"
  public static let detailsDefault = "This content was generated or transformed with AI assistance."
  public static let sourcesDefault = "Sources"
  public static let placementDefault = "bottom-start"
  public static let gap = 8
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func details(_ details: String?, fallback: String) -> String { details ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": [
        "label": "Có AI hỗ trợ",
        "details": "Nội dung này được tạo hoặc chuyển đổi với sự hỗ trợ của AI.",
        "sources": "Nguồn",
      ],
      "en": ["label": labelDefault, "details": detailsDefault, "sources": sourcesDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func placement(_ placement: String?, fallback: String) -> String { placement ?? fallback }
  public static func sourceLine(sources: [String?], prefix: String) -> String? {
    let kept = sources.compactMap { item -> String? in
      guard let item, !item.isEmpty else { return nil }
      return item
    }
    guard !kept.isEmpty else { return nil }
    return "\(prefix): \(kept.joined(separator: ", "))"
  }
  public static func controls(open: Bool, id: String) -> String? { open ? id : nil }
  public static func toggle(open: Bool) -> Bool { !open }
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String) -> CSAIDisclosurePlace? {
    let space = Double(gap)
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: placement, gap: space) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: space) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSAIDisclosurePlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }
}

public struct CSAIDisclosurePlace: Equatable {
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

public struct CSAIDisclosure: View {
  public let label: String?
  public let details: String?
  public let sources: [String]
  public let expandedLabel: String
  public let collapsedLabel: String
  @Binding var open: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  public let placement: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0

  public init(label: String? = nil, details: String? = nil, sources: [String], expandedLabel: String, collapsedLabel: String, open: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, placement: String? = nil) {
    self.label = label
    self.details = details
    self.sources = sources
    self.expandedLabel = expandedLabel
    self.collapsedLabel = collapsedLabel
    _open = open
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.placement = placement
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let badge = CSAIDisclosureModel.label(label, fallback: CSAIDisclosureModel.copy("label", language: spoken))
    let explanation = CSAIDisclosureModel.details(details, fallback: CSAIDisclosureModel.copy("details", language: spoken))
    VStack(alignment: .leading, spacing: 8) {
      CSTriggerButton(badge) { open = CSAIDisclosureModel.toggle(open: open) }
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .accessibilityValue(Text(open ? expandedLabel : collapsedLabel))
        .background(GeometryReader { geo in
          Color.clear.preference(key: CSAIDisclosureAnchorKey.self, value: geo.frame(in: .global))
        })
      if open {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let place = CSAIDisclosureModel.placement(placement, fallback: CSAIDisclosureModel.placementDefault)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSAIDisclosureModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: place)
          }
        }
        VStack(alignment: .leading, spacing: 4) {
          Text(explanation).foregroundStyle(pack.primaryTextColor)
          if let line = CSAIDisclosureModel.sourceLine(sources: sources.map { Optional($0) }, prefix: CSAIDisclosureModel.copy("sources", language: spoken)) {
            Text(line).foregroundStyle(pack.mutedColor)
          }
        }
        .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSAIDisclosurePanelKey.self, value: CSAIDisclosureMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? 0))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.updatesFrequently)
      }
    }
    .onExitCommand { open = false }
    .onPreferenceChange(CSAIDisclosureAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSAIDisclosurePanelKey.self) { measure in
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

private struct CSAIDisclosureMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSAIDisclosureAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSAIDisclosurePanelKey: PreferenceKey {
  static var defaultValue = CSAIDisclosureMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSAIDisclosureMeasure, nextValue: () -> CSAIDisclosureMeasure) { value = nextValue() }
}

public enum CSAspectRatioModel {
  public static func height(ratio: String, width: Double) -> Double? {
    let parts = ratio.split(separator: "/").map { $0.trimmingCharacters(in: .whitespaces) }
    if parts.count == 2, let across = Double(parts[0]), let down = Double(parts[1]), across > 0 {
      return width * down / across
    }
    if let number = Double(ratio.trimmingCharacters(in: .whitespaces)), number > 0 {
      return width / number
    }
    return nil
  }
}

public struct CSAspectRatio<Content: View>: View {
  public let ratio: String
  public let width: CGFloat
  let content: () -> Content

  public init(ratio: String = "16 / 9", width: CGFloat, @ViewBuilder content: @escaping () -> Content) {
    self.ratio = ratio
    self.width = width
    self.content = content
  }

  public var body: some View {
    content()
      .frame(width: width, height: CGFloat(CSAspectRatioModel.height(ratio: ratio, width: Double(width)) ?? Double(width)))
  }
}

public enum CSWatermarkModel {
  public static let defaultText = "CyberSkill"
  public static let defaultOpacity = 0.09
  public static let defaultGap = 140.0
  public static let defaultRotate = -22.0

  public static func escape(_ text: String) -> String {
    text.replacingOccurrences(of: "&", with: "&amp;").replacingOccurrences(of: "<", with: "&lt;")
  }

  public static func centers(width: Double, height: Double, gap: Double) -> [(x: Double, y: Double)] {
    guard gap > 0, width > 0, height > 0 else { return [] }
    var points: [(x: Double, y: Double)] = []
    var y = gap / 2
    while y < height {
      var x = gap / 2
      while x < width {
        points.append((x, y))
        x += gap
      }
      y += gap
    }
    return points
  }
}

public struct CSWatermark<Content: View>: View {
  public let text: String
  public let opacity: Double
  public let gap: Double
  public let rotate: Double
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let content: () -> Content

  public init(text: String = CSWatermarkModel.defaultText, opacity: Double = CSWatermarkModel.defaultOpacity, gap: Double = CSWatermarkModel.defaultGap, rotate: Double = CSWatermarkModel.defaultRotate, dark: Bool = false, highContrast: Bool = false, compact: Bool = false, @ViewBuilder content: @escaping () -> Content) {
    self.text = text
    self.opacity = opacity
    self.gap = gap
    self.rotate = rotate
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    content()
      .background {
        Canvas { context, size in
          var attributed = AttributedString(text)
          attributed.foregroundColor = pack.primaryTextColor
          let mark = Text(attributed).font(.system(size: 14, weight: .bold))
          for point in CSWatermarkModel.centers(width: size.width, height: size.height, gap: gap) {
            context.drawLayer { layer in
              layer.translateBy(x: point.x, y: point.y)
              layer.rotate(by: .degrees(rotate))
              layer.opacity = opacity
              layer.draw(mark, at: .zero, anchor: .center)
            }
          }
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
      }
  }
}
