import SwiftUI
#if os(macOS)
import AppKit
#elseif os(iOS)
import UIKit
#endif

public struct CSProgressMeasurement: Equatable {
  public let clamped: Double
  public let percent: Double
  public let max: Double
}

public enum CSProgress {
  public static let labelDefault = "Progress"
  public static func barName(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Tiến độ"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func measure(value: Double, max: Double) -> CSProgressMeasurement {
    let safeMax = max.isFinite && max > 0 ? max : 100
    let numeric = value.isFinite ? value : 0
    let clamped = min(safeMax, Swift.max(0, numeric))
    let percent = min(100, Swift.max(0, (clamped / safeMax) * 100))
    return CSProgressMeasurement(clamped: clamped, percent: percent, max: safeMax)
  }

  public static func variant(_ name: String?) -> String {
    switch name {
    case "umber", "success": return name ?? "ochre"
    default: return "ochre"
    }
  }
}

public enum CSPersonName {
  public static func initials(_ name: String) -> String {
    let parts = name.split(whereSeparator: \.isWhitespace).prefix(2)
    return parts.compactMap { $0.first }.map(String.init).joined().uppercased()
  }
}

public enum CSAvatarModel {
  public static func hasImage(_ src: String?) -> Bool {
    guard let src else { return false }
    return !src.isEmpty
  }

  public static func spoken(src: String?, name: String) -> String? {
    if hasImage(src) { return name }
    return name.isEmpty ? nil : name
  }

  public static func title(_ name: String) -> String? { name.isEmpty ? nil : name }
}

public enum CSAvatarSize {
  case sm
  case md
  case lg

  public var points: CGFloat {
    switch self {
    case .sm: return 28
    case .md: return 40
    case .lg: return 56
    }
  }
}

public enum CSAlertVariant {
  case info
  case success
  case warning
  case danger
}

public enum CSAlertTone {
  public static func text(_ variant: CSAlertVariant, pack: CSTokenModePack) -> CSColorValue {
    switch variant {
    case .info: return pack.colorSemanticInfoText
    case .success: return pack.colorSemanticSuccessText
    case .warning: return pack.colorSemanticWarningText
    case .danger: return pack.colorSemanticDangerText
    }
  }
}

public enum CSStatTrend {
  case up
  case down
  case flat

  public var mark: String {
    switch self {
    case .up: return "↑"
    case .down: return "↓"
    case .flat: return "–"
    }
  }

  public func arrowPath() -> String {
    switch self {
    case .up: return "M12 5v14M6 11l6-6 6 6"
    case .down: return "M12 5v14M6 13l6 6 6-6"
    case .flat: return "M5 12h14"
    }
  }

  public static func resolve(_ name: String) -> CSStatTrend {
    switch name {
    case "up": return .up
    case "down": return .down
    default: return .flat
    }
  }

  public static func showsDelta(_ delta: String?) -> Bool { delta != nil }
}

public enum CSCheckboxModel {
  public static func showsText(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func labelId(_ id: String, label: String?) -> String? {
    showsText(label) ? id + "-label" : nil
  }
  public static func descriptionId(_ id: String, description: String?) -> String? {
    showsText(description) ? id + "-description" : nil
  }
  public static func labelledBy(explicit: String?, hasAriaLabel: Bool, labelId: String?) -> String? {
    if let explicit { return explicit }
    return hasAriaLabel ? nil : labelId
  }
  public static func describedBy(explicit: String?, descriptionId: String?) -> String? {
    var parts: [String] = []
    for value in [explicit, descriptionId] {
      guard let value else { continue }
      for token in value.split(whereSeparator: \.isWhitespace) {
        let word = String(token)
        if !word.isEmpty && !parts.contains(word) { parts.append(word) }
      }
    }
    return parts.isEmpty ? nil : parts.joined(separator: " ")
  }
}

public struct CSCheckbox: View {
  public let label: String
  public let description: String?
  public let disabled: Bool
  @Binding var isOn: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool

  public init(label: String, description: String? = nil, disabled: Bool = false, isOn: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.description = description
    self.disabled = disabled
    _isOn = isOn
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 2) {
      Toggle(isOn: Binding(get: { isOn }, set: { next in
        if disabled { return }
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        isOn = next
      })) {
        if CSCheckboxModel.showsText(label) {
          Text(label).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true)
        }
      }
      .tint(pack.colorBrandOchre.color)
      .focused($focused)
      .onChange(of: focused) { isFocused in
        if isFocused && !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      }
      .accessibilityLabel(CSCheckboxModel.showsText(label) ? label : "")
      .accessibilityHint(CSCheckboxModel.showsText(description) ? (description ?? "") : "")
      .disabled(disabled)
      if CSCheckboxModel.showsText(description), let description {
        Text(description).foregroundStyle(pack.mutedColor).accessibilityHidden(true)
      }
    }
    .frame(minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
  }
}

public enum CSRadioModel {
  public static func showsText(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func groupName(_ name: String?, generated: String) -> String { name ?? generated }
  public static func isChecked(value: String?, option: String) -> Bool { value == option }
  public static func select(_ option: String, hasHandler: Bool) -> String? { hasHandler ? option : nil }
}

public struct CSRadioOption: Hashable {
  public let value: String
  public let label: String
  public let description: String?
  public let disabled: Bool

  public init(value: String, label: String, description: String? = nil, disabled: Bool = false) {
    self.value = value
    self.label = label
    self.description = description
    self.disabled = disabled
  }
}

public struct CSRadioGroup: View {
  public let label: String?
  public let options: [CSRadioOption]
  @Binding var selection: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var focusId = UUID().uuidString
  @FocusState private var focusedValue: String?

  public init(label: String? = nil, options: [CSRadioOption], selection: Binding<String>, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.options = options
    _selection = selection
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 4) {
      if CSRadioModel.showsText(label), let label {
        Text(label).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true)
      }
      ForEach(options, id: \.value) { option in
        VStack(alignment: .leading, spacing: 2) {
          Button {
            if option.disabled { return }
            CSFocusRegistry.shared.claim(id: "\(focusId)-\(option.value)", restore: { focusedValue = option.value })
            if let next = CSRadioModel.select(option.value, hasHandler: true) { selection = next }
          } label: {
            HStack(spacing: 8) {
              Image(systemName: CSRadioModel.isChecked(value: selection, option: option.value) ? "largecircle.fill.circle" : "circle")
              if CSRadioModel.showsText(option.label) {
                Text(option.label).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true)
              }
              Spacer(minLength: 0)
            }
            .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
          }
          .buttonStyle(.plain)
          .focused($focusedValue, equals: option.value)
          .disabled(option.disabled)
          .accessibilityLabel(CSRadioModel.showsText(option.label) ? option.label : "")
          .accessibilityHint(CSRadioModel.showsText(option.description) ? (option.description ?? "") : "")
          .accessibilityAddTraits(CSRadioModel.isChecked(value: selection, option: option.value) ? .isSelected : [])
          if CSRadioModel.showsText(option.description), let description = option.description {
            Text(description).foregroundStyle(pack.mutedColor).accessibilityHidden(true)
          }
        }
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSRadioModel.showsText(label) ? (label ?? "") : "")
    .environment(\.csFormAncestor, true)
    .onChange(of: focusedValue) { value in
      if let value { CSFocusRegistry.shared.claim(id: "\(focusId)-\(value)", restore: { focusedValue = value }) }
    }
  }
}

public struct CSProgressBar: View {
  public let value: Double
  public let maximum: Double
  public let label: String?
  public let measurement: CSProgressMeasurement
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public let variant: String
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(value: Double, maximum: Double = 100, label: String? = nil, variant: String = "ochre", dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.value = value
    self.maximum = maximum
    self.label = label
    self.variant = variant
    measurement = CSProgress.measure(value: value, max: maximum)
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let tone = CSProgress.variant(variant)
    let tint = tone == "umber" ? pack.colorBrandUmber.color : tone == "success" ? pack.colorSemanticSuccess.color : pack.colorBrandOchre.color
    ProgressView(value: measurement.clamped, total: measurement.max)
      .tint(tint)
      .accessibilityLabel(CSProgress.barName(label, fallback: CSProgress.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))))
  }
}

public struct CSAvatar: View {
  public let name: String
  public let size: CSAvatarSize
  public let square: Bool
  public let initials: String
  public let source: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(name: String, size: CSAvatarSize = .md, square: Bool = false, source: String? = nil, dark: Bool, highContrast: Bool, compact: Bool) {
    self.name = name
    self.size = size
    self.square = square
    self.source = source
    initials = CSPersonName.initials(name)
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSAvatarModel.spoken(src: source, name: name)
    Text(initials)
      .foregroundStyle(pack.colorSemanticInfoFg.color)
      .frame(width: size.points, height: size.points)
      .background(pack.colorBrandUmber.color)
      .clipShape(RoundedRectangle(cornerRadius: square ? pack.radiusMd.points : size.points / 2))
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(spoken ?? "")
      .accessibilityHidden(spoken == nil)
  }
}

public struct CSAlert: View {
  public let variant: CSAlertVariant
  public let title: String
  public let message: String
  public let dismissLabel: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onDismiss: (() -> Void)?

  public init(variant: CSAlertVariant = .info, title: String, message: String, dismissLabel: String = "", dark: Bool, highContrast: Bool, compact: Bool, onDismiss: (() -> Void)? = nil) {
    self.variant = variant
    self.title = title
    self.message = message
    self.dismissLabel = dismissLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onDismiss = onDismiss
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack(alignment: .top, spacing: 12) {
      VStack(alignment: .leading, spacing: 4) {
        Text(title).font(.system(size: 16, weight: .bold)).foregroundStyle(CSAlertTone.text(variant, pack: pack).color)
        Text(message).foregroundStyle(pack.mutedColor)
      }
      Spacer(minLength: 0)
      if let onDismiss {
        CSTriggerButton("×", action: onDismiss)
          .frame(minWidth: 44, minHeight: 44)
          .accessibilityLabel(dismissLabel)
      }
    }
    .padding(16)
    .background(pack.colorSurfacePanel.color)
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(CSAlertTone.text(variant, pack: pack).color, lineWidth: 1))
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isStaticText)
  }
}

public enum CSSliderModel {
  public static let labelDefault = "Slider"
  public static let defaultStep = 1.0
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Thanh trượt"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func upper(min: Double, max: Double) -> Double { max < min ? min : max }
  public static func snap(value: Double, min: Double, max: Double, step: Double?) -> Double {
    let limit = upper(min: min, max: max)
    let clamped = Swift.min(limit, Swift.max(min, value.isFinite ? value : min))
    guard let step, step > 0, step.isFinite, limit > min else { return clamped }
    let steps = ((clamped - min) / step).rounded(.toNearestOrAwayFromZero)
    let snapped = min + steps * step
    return Swift.min(limit, Swift.max(min, snapped))
  }
}

public struct CSSlider: View {
  public let label: String?
  public let minimum: Double
  public let maximum: Double
  public let step: Double?
  @Binding var value: Double
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let disabled: Bool
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, value: Binding<Double>, minimum: Double = 0, maximum: Double = 100, step: Double? = CSSliderModel.defaultStep, dark: Bool, highContrast: Bool, compact: Bool, disabled: Bool = false, language: String? = nil) {
    self.label = label
    _value = value
    self.minimum = minimum
    self.maximum = maximum
    self.step = step
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.disabled = disabled
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let limit = CSSliderModel.upper(min: minimum, max: maximum)
    let blocked = disabled || limit <= minimum
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let shown = Binding<Double>(
      get: { CSSliderModel.snap(value: value, min: minimum, max: maximum, step: step) },
      set: { next in
        if blocked { return }
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        value = CSSliderModel.snap(value: next, min: minimum, max: maximum, step: step)
      }
    )
    Slider(value: shown, in: limit > minimum ? minimum...limit : minimum...(minimum + 1))
      .focused($focused)
      .onChange(of: focused) { isFocused in
        if isFocused && !blocked { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      }
      .disabled(blocked)
      .tint(dark ? pack.colorBrandOchre.color : pack.colorBrandUmber.color)
      .accessibilityLabel(CSSliderModel.label(label, fallback: CSSliderModel.copy("label", language: spoken)))
  }
}

public enum CSTabsModel {
  public static let listDefault = "Tabs"
  public static func index(values: [String], value: String) -> Int {
    max(0, values.firstIndex(of: value) ?? -1)
  }
  public static func tabStop(index: Int, selected: Int) -> Int { index == selected ? 0 : -1 }
  public static func showsCount(_ count: Int?) -> Bool { count != nil }
  public static func listLabel(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["list": "Tab"],
      "en": ["list": listDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSTabItem: Hashable {
  public let value: String
  public let label: String
  public let count: Int?

  public init(value: String, label: String, count: Int? = nil) {
    self.value = value
    self.label = label
    self.count = count
  }
}

public struct CSTabs: View {
  public let label: String?
  public let tabs: [CSTabItem]
  public let vertical: Bool
  @Binding var selection: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var focusId = UUID().uuidString
  @State private var keysArmed = false
  @FocusState private var focusedValue: String?
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, tabs: [CSTabItem], selection: Binding<String>, vertical: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.tabs = tabs
    self.vertical = vertical
    _selection = selection
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let layout = vertical ? AnyLayout(VStackLayout(spacing: 0)) : AnyLayout(HStackLayout(spacing: 0))
    layout {
      ForEach(tabs, id: \.value) { tab in
        Button {
          CSFocusRegistry.shared.claim(id: "\(focusId)-\(tab.value)", restore: { focusedValue = tab.value })
          selection = tab.value
        } label: {
          HStack(spacing: 6) {
            Text(tab.label)
            if CSTabsModel.showsCount(tab.count), let count = tab.count {
              Text(String(count)).foregroundStyle(pack.mutedColor)
            }
          }
            .foregroundStyle(selection == tab.value ? pack.colorBrandOchre.color : pack.primaryTextColor)
            .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points)
            .overlay(alignment: .bottom) {
              Rectangle()
                .fill(selection == tab.value ? pack.colorBrandOchre.color : Color.clear)
                .frame(height: 2)
            }
        }
        .buttonStyle(.plain)
        .focused($focusedValue, equals: tab.value)
        .accessibilityAddTraits(selection == tab.value ? .isSelected : [])
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSTabsModel.listLabel(label, fallback: CSTabsModel.copy("list", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))))
    .focusable()
    .csRovingKeys { key in moveTabs(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: focusedValue != nil, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveTabs(key)
    })
    .onChange(of: focusedValue) { value in
      if value != nil { keysArmed = true }
      if let value { CSFocusRegistry.shared.claim(id: "\(focusId)-\(value)", restore: { focusedValue = value }) }
    }
  }

  private func moveTabs(_ key: CSRovingKey) -> Bool {
    let index = CSTabsModel.index(values: tabs.map(\.value), value: selection)
    guard tabs.indices.contains(index),
          let next = CSRoving.tabs(current: index, count: tabs.count, key: key, vertical: vertical) else { return false }
    selection = tabs[next].value
    let value = tabs[next].value
    CSFocusRegistry.shared.claim(id: "\(focusId)-\(value)", restore: { focusedValue = value })
    return true
  }
}

public enum CSRovingKey: Equatable {
  case right
  case left
  case up
  case down
  case home
  case end
  case pageUp
  case pageDown
}

public enum CSFocusTrap {
  public static func nextIndex(current: Int, count: Int, shift: Bool, inside: Bool) -> Int? {
    guard count > 0 else { return nil }
    if !inside || current < 0 || current >= count { return shift ? count - 1 : 0 }
    let delta = shift ? -1 : 1
    return (current + delta + count) % count
  }

  public static func initialIndex(preferred: Int?, count: Int) -> Int? {
    guard count > 0 else { return nil }
    if let preferred, preferred >= 0, preferred < count { return preferred }
    return 0
  }
}

public struct CSOverlayLayer: Equatable {
  public var id: String
  public var kind: String
  public var connected: Bool

  public init(id: String, kind: String, connected: Bool) {
    self.id = id
    self.kind = kind
    self.connected = connected
  }
}

public enum CSOverlayStack {
  public static func solo(_ id: String) -> [CSOverlayLayer] {
    [CSOverlayLayer(id: id, kind: "modal", connected: true)]
  }

  public static func freshId(_ kind: String) -> String { "\(kind)-\(UUID().uuidString)" }

  public static func topDismissible(_ layers: [CSOverlayLayer]) -> String? {
    layers.reversed().first { $0.kind != "toast" }?.id
  }

  public static func activeModal(_ layers: [CSOverlayLayer]) -> String? {
    layers.reversed().first { $0.kind == "modal" && $0.connected }?.id
  }

  public static func wasTop(id: String, layers: [CSOverlayLayer]) -> Bool {
    topDismissible(layers) == id
  }

  public static func ownsFocus(id: String, layers: [CSOverlayLayer]) -> Bool {
    activeModal(layers) == id
  }

  public static func resolved(id: String, live: [CSOverlayLayer], fallback: [CSOverlayLayer]) -> [CSOverlayLayer] {
    live.contains { $0.id == id } ? live : fallback
  }
}

public final class CSOverlayRegistry {
  public static let shared = CSOverlayRegistry()
  public private(set) var layers: [CSOverlayLayer] = []

  public func push(id: String, kind: String = "modal", connected: Bool = true) {
    layers.removeAll { $0.id == id }
    layers.append(CSOverlayLayer(id: id, kind: kind, connected: connected))
  }

  public func remove(id: String) {
    layers.removeAll { $0.id == id }
  }

  public func reset() { layers = [] }

  public func resolved(id: String, fallback: [CSOverlayLayer]) -> [CSOverlayLayer] {
    CSOverlayStack.resolved(id: id, live: layers, fallback: fallback)
  }
}

public enum CSModalFocus {
  public static func ownedFocus(active: String, opener: String?, insidePanel: Bool) -> Bool {
    active == "body" || (opener != nil && active == opener) || insidePanel
  }

  public static func shouldRestore(wasTop: Bool, ownedFocus: Bool, openerConnected: Bool, openerHidden: Bool) -> Bool {
    wasTop && ownedFocus && openerConnected && !openerHidden
  }

  public static func restoreOnClose(id: String, layers: [CSOverlayLayer], openerConnected: Bool) -> Bool {
    shouldRestore(
      wasTop: CSOverlayStack.wasTop(id: id, layers: layers),
      ownedFocus: ownedFocus(active: "panel", opener: "opener", insidePanel: true) && CSOverlayStack.ownsFocus(id: id, layers: layers),
      openerConnected: openerConnected,
      openerHidden: false
    )
  }

  public static func pullBack(inside: Bool) -> Bool { !inside }
}

public struct CSFocusClaim {
  public var connected: Bool
  public var hidden: Bool
  public var restore: () -> Void
}

public final class CSFocusRegistry {
  public static let shared = CSFocusRegistry()
  public private(set) var activeId: String? = nil
  private var claims: [String: CSFocusClaim] = [:]

  public func claim(id: String, connected: Bool = true, hidden: Bool = false, restore: @escaping () -> Void) {
    claims[id] = CSFocusClaim(connected: connected, hidden: hidden, restore: restore)
    if connected && !hidden { activeId = id }
  }

  public func disconnect(id: String) {
    let hidden = claims[id]?.hidden ?? false
    claims[id] = CSFocusClaim(connected: false, hidden: hidden, restore: {})
    if activeId == id { activeId = nil }
  }

  public func canRestore(_ id: String?) -> Bool {
    guard let id, let claim = claims[id] else { return false }
    return claim.connected && !claim.hidden
  }

  public func restore(_ id: String?) {
    guard canRestore(id), let id else { return }
    claims[id]?.restore()
  }

  public func reset() {
    activeId = nil
    claims = [:]
  }
}

public enum CSFocusReturn {
  public static func perform(savedId: String?, onRestore: (() -> Void)?, layerId: String, layers: [CSOverlayLayer]) {
    let captured = CSFocusRegistry.shared.canRestore(savedId)
    if CSModalFocus.restoreOnClose(id: layerId, layers: layers, openerConnected: captured || onRestore != nil) {
      if captured { CSFocusRegistry.shared.restore(savedId) }
      onRestore?()
    }
  }
}

public enum CSRoving {
  public static func tabs(current: Int, count: Int, key: CSRovingKey, vertical: Bool = false) -> Int? {
    guard count > 0 else { return nil }
    let index = min(max(current, 0), count - 1)
    if key == (vertical ? .down : .right) { return (index + 1) % count }
    if key == (vertical ? .up : .left) { return (index - 1 + count) % count }
    if key == .home { return 0 }
    if key == .end { return count - 1 }
    return nil
  }
}

private struct CSOwnFocusModifier: ViewModifier {
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool

  func body(content: Content) -> some View {
    content
      .focused($ownerFocused)
      .onChange(of: ownerFocused) { isFocused in
        if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
      }
      .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public struct CSTriggerButton: View {
  let title: String
  let action: () -> Void
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool

  public init(_ title: String, action: @escaping () -> Void) {
    self.title = title
    self.action = action
  }

  public var body: some View {
    let restore = { ownerFocused = true }
    Button(title) {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }
    .focused($ownerFocused)
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

extension View {
  func csOwnFocus() -> some View { modifier(CSOwnFocusModifier()) }

  @ViewBuilder
  func csRovingKeys(_ onKey: @escaping (CSRovingKey) -> Bool) -> some View {
    modifier(CSRovingKeys(onKey: { key, _ in onKey(key) }))
  }

  @ViewBuilder
  func csRovingKeys(_ onKey: @escaping (CSRovingKey, Bool) -> Bool) -> some View {
    modifier(CSRovingKeys(onKey: onKey))
  }

  @ViewBuilder
  func csMenuTypeahead(enabled: Bool, onCharacter: @escaping (String) -> Bool) -> some View {
    modifier(CSMenuTypeaheadKeys(enabled: enabled, onCharacter: onCharacter))
  }

  @ViewBuilder
  func csTabTrap(_ onTab: @escaping (Bool) -> Bool) -> some View {
    modifier(CSTabTrapKeys(onTab: onTab))
  }
}

struct CSMenuTypeaheadKeys: ViewModifier {
  let enabled: Bool
  let onCharacter: (String) -> Bool

  func body(content: Content) -> some View {
    if #available(macOS 14, iOS 17, *) {
      content.onKeyPress { press in
        guard enabled, press.characters.count == 1, let character = press.characters.first, character != " " else { return .ignored }
        return onCharacter(String(character)) ? .handled : .ignored
      }
    } else {
      content
    }
  }
}

struct CSTabTrapKeys: ViewModifier {
  let onTab: (Bool) -> Bool

  func body(content: Content) -> some View {
    if #available(macOS 14, iOS 17, *) {
      content.onKeyPress { press in
        guard press.key == .tab else { return .ignored }
        return onTab(press.modifiers.contains(.shift)) ? .handled : .ignored
      }
    } else {
      content
    }
  }
}

struct CSRovingKeys: ViewModifier {
  let onKey: (CSRovingKey, Bool) -> Bool

  func body(content: Content) -> some View {
    if #available(macOS 14, iOS 17, *) {
      content.onKeyPress { press in
        let key: CSRovingKey?
        switch press.key {
        case .rightArrow: key = .right
        case .leftArrow: key = .left
        case .upArrow: key = .up
        case .downArrow: key = .down
        case .home: key = .home
        case .end: key = .end
        case .pageUp: key = .pageUp
        case .pageDown: key = .pageDown
        default: key = nil
        }
        guard let key, onKey(key, press.modifiers.contains(.shift)) else { return .ignored }
        return .handled
      }
    } else {
      content
    }
  }
}

func csLegacyRovingActive(focused: Bool, armed: Bool) -> Bool {
  #if os(iOS)
  return armed
  #else
  return focused
  #endif
}

struct CSLegacyRovingKeys: View {
  var active: Bool
  var onResign: () -> Void
  var onKey: (CSRovingKey, Bool) -> Bool
  var body: some View {
    #if os(macOS)
    CSLegacyMacRoving(active: active, onKey: onKey)
    #elseif os(iOS)
    CSLegacyPadRoving(active: active, onResign: onResign, onKey: onKey)
    #else
    Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
    #endif
  }
}

#if os(macOS)
private struct CSLegacyMacRoving: NSViewRepresentable {
  var active: Bool
  var onKey: (CSRovingKey, Bool) -> Bool
  func makeCoordinator() -> Coordinator { Coordinator() }
  func makeNSView(context: Context) -> NSView {
    context.coordinator.install(active: active, onKey: onKey)
    return NSView()
  }
  func updateNSView(_ nsView: NSView, context: Context) {
    context.coordinator.install(active: active, onKey: onKey)
  }
  static func dismantleNSView(_ nsView: NSView, coordinator: Coordinator) { coordinator.remove() }
  final class Coordinator {
    var monitor: Any?
    var onKey: ((CSRovingKey, Bool) -> Bool)?
    func install(active: Bool, onKey: @escaping (CSRovingKey, Bool) -> Bool) {
      self.onKey = onKey
      guard active, #unavailable(macOS 14) else { remove(); return }
      guard monitor == nil else { return }
      monitor = NSEvent.addLocalMonitorForEvents(matching: .keyDown) { [weak self] event in
        guard let self, let key = Self.map(event.keyCode), self.onKey?(key, event.modifierFlags.contains(.shift)) == true else { return event }
        return nil
      }
    }
    func remove() {
      if let monitor { NSEvent.removeMonitor(monitor) }
      monitor = nil
    }
    static func map(_ code: UInt16) -> CSRovingKey? {
      switch code {
      case 123: return .left
      case 124: return .right
      case 126: return .up
      case 125: return .down
      case 115: return .home
      case 119: return .end
      case 116: return .pageUp
      case 121: return .pageDown
      default: return nil
      }
    }
  }
}
#elseif os(iOS)
private struct CSLegacyPadRoving: UIViewRepresentable {
  var active: Bool
  var onResign: () -> Void
  var onKey: (CSRovingKey, Bool) -> Bool
  func makeUIView(context: Context) -> CSLegacyPadRovingView {
    let view = CSLegacyPadRovingView()
    view.onKey = onKey
    view.onResign = onResign
    return view
  }
  func updateUIView(_ uiView: CSLegacyPadRovingView, context: Context) {
    uiView.onKey = onKey
    uiView.onResign = onResign
    guard active, #unavailable(iOS 17) else {
      if uiView.isFirstResponder { uiView.resignFirstResponder() }
      return
    }
    if !uiView.isFirstResponder { uiView.becomeFirstResponder() }
  }
}
private final class CSLegacyPadRovingView: UIView {
  var onKey: ((CSRovingKey, Bool) -> Bool)?
  var onResign: (() -> Void)?
  override var canBecomeFirstResponder: Bool { true }
  override var keyCommands: [UIKeyCommand]? {
    if #available(iOS 17, *) { return nil }
    let inputs = [
      UIKeyCommand.inputLeftArrow, UIKeyCommand.inputRightArrow,
      UIKeyCommand.inputUpArrow, UIKeyCommand.inputDownArrow,
      UIKeyCommand.inputHome, UIKeyCommand.inputEnd,
      UIKeyCommand.inputPageUp, UIKeyCommand.inputPageDown,
    ]
    return inputs.flatMap { input in
      [
        UIKeyCommand(input: input, modifierFlags: [], action: #selector(handle(_:))),
        UIKeyCommand(input: input, modifierFlags: .shift, action: #selector(handle(_:))),
      ]
    }
  }
  @objc func handle(_ command: UIKeyCommand) {
    guard let key = Self.map(command.input) else { return }
    _ = onKey?(key, command.modifierFlags.contains(.shift))
  }
  override func resignFirstResponder() -> Bool {
    let resigned = super.resignFirstResponder()
    if resigned { onResign?() }
    return resigned
  }
  static func map(_ input: String?) -> CSRovingKey? {
    switch input {
    case UIKeyCommand.inputLeftArrow: return .left
    case UIKeyCommand.inputRightArrow: return .right
    case UIKeyCommand.inputUpArrow: return .up
    case UIKeyCommand.inputDownArrow: return .down
    case UIKeyCommand.inputHome: return .home
    case UIKeyCommand.inputEnd: return .end
    case UIKeyCommand.inputPageUp: return .pageUp
    case UIKeyCommand.inputPageDown: return .pageDown
    default: return nil
    }
  }
}
#endif

public enum CSSkeletonModel {
  public static func lineCount(_ requested: Double) -> Int { CSRenderCount.whole(requested, fallback: 0) }
  public static func lineWidth(index: Int, count: Int) -> Double { count > 0 && index == count - 1 ? 0.7 : 1 }
  public static func isCircle(variant: String, lines: Int) -> Bool { lines == 0 && variant == "circle" }
  public static func shimmer(reducedMotion: Bool) -> Bool { !reducedMotion }
}

public struct CSSkeleton: View {
  public let lines: Int
  public let circle: Bool
  public let width: CGFloat
  public let height: CGFloat
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var phase = false

  public init(lines: Int = 0, circle: Bool = false, width: CGFloat = 120, height: CGFloat = 12, dark: Bool, highContrast: Bool, compact: Bool) {
    self.lines = lines
    self.circle = circle
    self.width = width
    self.height = height
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let count = CSSkeletonModel.lineCount(Double(lines))
    let round = CSSkeletonModel.isCircle(variant: circle ? "circle" : "block", lines: count)
    Group {
      if count > 0 {
        VStack(alignment: .leading, spacing: 8) {
          ForEach(0..<count, id: \.self) { index in
            RoundedRectangle(cornerRadius: pack.radiusSm.points)
              .fill(pack.borderColor)
              .frame(width: width * CSSkeletonModel.lineWidth(index: index, count: count), height: height)
          }
        }
      } else {
        RoundedRectangle(cornerRadius: round ? width / 2 : pack.radiusSm.points)
          .fill(pack.borderColor)
          .frame(width: width, height: round ? width : height)
      }
    }
    .opacity(CSSkeletonModel.shimmer(reducedMotion: reduceMotion) ? (phase ? 0.55 : 1) : 1)
    .onAppear {
      guard CSSkeletonModel.shimmer(reducedMotion: reduceMotion) else { return }
      withAnimation(.easeInOut(duration: 1.4).repeatForever(autoreverses: true)) { phase = true }
    }
    .accessibilityHidden(true)
  }
}

public enum CSSpinnerModel {
  public static let defaultSize = 20.0
  public static let spinDuration = 0.62
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Đang tải"],
      "en": ["label": "Loading"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func spins(reducedMotion: Bool) -> Bool { !reducedMotion }
  public static func topIsOchre(dark: Bool) -> Bool { dark }
}

public struct CSSpinner: View {
  public let label: String?
  public let fallbackLabel: String?
  public let language: String?
  public let size: CGFloat
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var turn = false
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, fallbackLabel: String? = nil, size: CGFloat = 20, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.fallbackLabel = fallbackLabel
    self.size = size
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSSpinnerModel.label(label, fallback: fallbackLabel ?? CSSpinnerModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    let spins = CSSpinnerModel.spins(reducedMotion: reduceMotion)
    let ochre = CSSpinnerModel.topIsOchre(dark: dark)
    let top = ochre ? pack.colorBrandOchre.color : pack.colorBrandUmber.color
    let track = top.opacity(ochre ? 0.26 : 0.22)
    Circle()
      .stroke(track, lineWidth: 2.5)
      .overlay(Circle().trim(from: 0, to: 0.25).stroke(top, style: StrokeStyle(lineWidth: 2.5, lineCap: .butt)).rotationEffect(.degrees(-90)))
      .rotationEffect(.degrees(spins && turn ? 360 : 0))
      .frame(width: size, height: size)
      .onAppear {
        guard spins else { return }
        withAnimation(.linear(duration: CSSpinnerModel.spinDuration).repeatForever(autoreverses: false)) { turn = true }
      }
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(spoken)
      .accessibilityAddTraits(.updatesFrequently)
  }
}

public enum CSTagModel {
  public static func label(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["remove": "Gỡ"],
      "en": ["remove": "Remove"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSTag: View {
  public let title: String
  public let removeLabel: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onRemove: (() -> Void)?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String, removeLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onRemove: (() -> Void)? = nil) {
    self.title = title
    self.removeLabel = removeLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onRemove = onRemove
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let spoken = CSTagModel.label(removeLabel, fallback: CSTagModel.copy("remove", language: locale))
    HStack(spacing: 4) {
      Text(title).foregroundStyle(pack.primaryTextColor)
      if let onRemove {
        CSTriggerButton("×", action: onRemove)
          .frame(minWidth: 44, minHeight: 44)
          .accessibilityLabel(spoken)
      }
    }
    .padding(.horizontal, 8)
    .background(pack.colorSurfacePanel.color)
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
  }
}

public struct CSStat: View {
  public let label: String
  public let value: String
  public let delta: String?
  public let trend: CSStatTrend
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(label: String, value: String, delta: String? = nil, trend: CSStatTrend = .flat, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.value = value
    self.delta = delta
    self.trend = trend
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 4) {
      Text(label).foregroundStyle(pack.mutedColor)
      Text(value).font(.system(size: 28, weight: .bold)).foregroundStyle(pack.primaryTextColor)
      if CSStatTrend.showsDelta(delta), let delta {
        let ink = trend == .up ? pack.colorSemanticSuccessText : trend == .down ? pack.colorSemanticDangerText : pack.colorTextMuted
        HStack(spacing: 4) {
          CSIconPaths.path(data: trend.arrowPath())
            .stroke(ink.color, style: StrokeStyle(lineWidth: 2.4, lineCap: .round, lineJoin: .round))
            .frame(width: 14, height: 14)
            .accessibilityHidden(true)
          Text(delta)
        }
        .foregroundStyle(ink.color)
      }
    }
  }
}
