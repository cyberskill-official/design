import SwiftUI
#if os(macOS)
import AppKit
#else
import UIKit
#endif

public enum CSColorModel {
  public static let labelDefault = "Color"
  public static let hexDefault = "Hex value"
  public static func commit(_ value: String) -> String? {
    guard value.count == 7, value.first == "#" else { return nil }
    let hex = value.dropFirst()
    guard hex.allSatisfy(\.isHexDigit) else { return nil }
    return value
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Màu", "hex": "Giá trị hex"],
      "en": ["label": labelDefault, "hex": hexDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func fieldName(label: String?, labelledBy: String?, value: String, fallback: String) -> String? {
    if let labelledBy, !labelledBy.isEmpty { return nil }
    let name = (label?.isEmpty == false) ? label! : fallback
    return name + ": " + value
  }

  public static func dialogName(label: String?, labelledBy: String?, fallback: String) -> String? {
    if let labelledBy, !labelledBy.isEmpty { return nil }
    if let label, !label.isEmpty { return label }
    return fallback
  }

  public static func selected(_ swatch: String, value: String) -> Bool {
    swatch.lowercased() == value.lowercased()
  }

  public static func submits(composing: Bool, keyCode: Int) -> Bool {
    !composing && keyCode != 229
  }
  public static func dismissOutside(open: Bool, inside: Bool) -> Bool { open && !inside }
}

public enum CSSplitterModel {
  public static let labelDefault = "Resize panes"
  public static func clamp(_ value: Double, min lower: Double = 20, max upper: Double = 80) -> Double {
    min(upper, Swift.max(lower, value))
  }

  public static func nudge(_ value: Double, right: Bool, rtl: Bool, min lower: Double = 20, max upper: Double = 80) -> Double {
    let delta = (right ? 2.0 : -2.0) * (rtl ? -1 : 1)
    return clamp(clamp(value, min: lower, max: upper) + delta, min: lower, max: upper)
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Đổi kích thước khung"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func name(_ label: String?, fallback: String) -> String { label ?? fallback }
}

public enum CSDateField {
  public static let placeholderDefault = "Select a date"
  public static let placementDefault = "bottom-start"
  public static let gap = 6.0
  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Chọn ngày"],
      "en": ["placeholder": placeholderDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func face(hasValue: Bool, formatted: String, placeholder: String) -> String { hasValue ? formatted : placeholder }
  public static func dialogLabel(label: String?, placeholder: String?, fallback: String) -> String {
    let name = label?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    if !name.isEmpty { return name }
    let hint = placeholder?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    return hint.isEmpty ? fallback : hint
  }
  public static func dialogName(label: String?, labelledBy: String?, dialog: String) -> String? {
    let name = label?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    if !name.isEmpty { return dialog }
    if let labelledBy, !labelledBy.isEmpty { return nil }
    return dialog
  }
  public static func open(requested: Bool, disabled: Bool) -> Bool {
    requested && !disabled
  }

  public static func format(_ date: CSCalendarDate, language: String) -> String {
    if language == "vi" || language.isEmpty {
      return String(format: "%02d/%02d/%04d", date.day, date.month + 1, date.year)
    }
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return String(format: "%02d %@ %04d", date.day, months[date.month], date.year)
  }
}

public enum CSChatRole {
  public static let youDefault = "You"
  public static let lumiDefault = "Lumi"
  public static func isUser(_ role: String) -> Bool { role == "user" }
  public static func speaker(_ name: String?, role: String, you: String, lumi: String) -> String {
    if let name { return name }
    return isUser(role) ? you : lumi
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["you": "Bạn"],
      "en": ["you": youDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public enum CSIconModel {
  public static func points(_ size: String) -> CGFloat {
    switch size {
    case "sm": return 16
    case "lg": return 24
    default: return 20
    }
  }

  public static var names: [String] { CSIconPaths.glyphs.keys.sorted() }

  public static func known(_ name: String) -> Bool { CSIconPaths.glyphs[name] != nil }

  public static func resolved(_ name: String) -> String { CSIconPaths.resolved(name) }
}

public enum CSAnchorModel {
  public static func active(_ orderedVisibleIds: [String]) -> String? {
    orderedVisibleIds.first
  }
}

private struct CSOptionalDialogLabel: ViewModifier {
  var name: String?
  func body(content: Content) -> some View {
    if let name {
      content.accessibilityLabel(name)
    } else {
      content
    }
  }
}

public struct CSColorPicker: View {
  public let label: String?
  public let labelledBy: String?
  public let value: String
  public let swatches: [String]
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (String) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var open = false
  @State private var hex: String
  @FocusState private var hexFocused: Bool

  public init(label: String? = nil, labelledBy: String? = nil, value: String = "#F4BA17", swatches: [String] = ["#F4BA17", "#45210E"], dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping (String) -> Void) {
    self.label = label
    self.labelledBy = labelledBy
    self.value = value
    self.swatches = swatches
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    _hex = State(initialValue: value)
  }

  private func commitDraft() {
    if let next = CSColorModel.commit(hex) { onChange(next) }
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let fallback = CSColorModel.copy("label", language: locale)
    let name = CSColorModel.fieldName(label: label, labelledBy: labelledBy, value: value, fallback: fallback)
    let dialog = CSColorModel.dialogName(label: label, labelledBy: labelledBy, fallback: fallback)
    VStack(alignment: .leading) {
      Group {
        if let name {
          Button { open.toggle() } label: { Text(value).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true) }
            .accessibilityLabel(name)
        } else {
          Button { open.toggle() } label: { Text(value).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true) }
        }
      }
      .accessibilityValue(open ? "true" : "false")
      if open {
        VStack(alignment: .leading) {
          HStack {
            ForEach(swatches, id: \.self) { swatch in
              CSTriggerButton(swatch) {
                if let next = CSColorModel.commit(swatch) {
                  onChange(next)
                  open = false
                }
              }
              .accessibilityValue(CSColorModel.selected(swatch, value: value) ? "true" : "false")
              .frame(minWidth: 44, minHeight: 44)
            }
          }
          TextField("", text: $hex)
            .focused($hexFocused)
            .accessibilityLabel(CSColorModel.copy("hex", language: locale))
            .onSubmit {
              #if os(macOS)
              let composing = (NSApp.keyWindow?.firstResponder as? NSTextView)?.hasMarkedText() ?? false
              #else
              let composing = false
              #endif
              guard CSColorModel.submits(composing: composing, keyCode: 0) else { return }
              commitDraft()
              open = false
            }
            .onChange(of: hexFocused) { focused in
              if !focused { commitDraft() }
            }
        }
        .accessibilityElement(children: .contain)
        .modifier(CSOptionalDialogLabel(name: dialog))
        .onExitCommand { open = false }
      }
    }
    .background(GeometryReader { _ in
      CSInlineOutside(active: open) {
        if CSColorModel.dismissOutside(open: true, inside: false) { open = false }
      }
    })
    .onChange(of: value) { next in hex = next }
  }
}

public struct CSSplitter: View {
  public let start: String
  public let end: String
  public let percent: Double
  public let label: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: (Double) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @Environment(\.layoutDirection) private var layoutDirection
  @FocusState private var focused: Bool
  @State private var keysArmed = false
  @State private var focusId = UUID().uuidString

  public init(start: String, end: String, percent: Double, label: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping (Double) -> Void) {
    self.start = start
    self.end = end
    self.percent = CSSplitterModel.clamp(percent)
    self.label = label
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
  }

  private func move(_ key: CSRovingKey, rtl: Bool) -> Bool {
    switch key {
    case .right:
      onChange(CSSplitterModel.nudge(percent, right: true, rtl: rtl))
      return true
    case .left:
      onChange(CSSplitterModel.nudge(percent, right: false, rtl: rtl))
      return true
    case .up, .down, .home, .end, .pageUp, .pageDown:
      return false
    }
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let rtl = layoutDirection == .rightToLeft
    let spoken = CSSplitterModel.name(label, fallback: CSSplitterModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    HStack(spacing: 0) {
      Text(start).frame(maxWidth: .infinity).foregroundStyle(pack.primaryTextColor)
      Button {
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        onChange(CSSplitterModel.nudge(percent, right: true, rtl: rtl))
      } label: {
        Text(spoken).frame(minWidth: 44, minHeight: 44)
      }
      .focused($focused)
      .accessibilityValue(Text(String(Int(percent.rounded()))))
      .csRovingKeys { key in move(key, rtl: rtl) }
      .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: focused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
        move(key, rtl: rtl)
      })
      .onChange(of: focused) { isFocused in
        if isFocused { keysArmed = true }
      }
      Text(end).frame(maxWidth: .infinity).foregroundStyle(pack.primaryTextColor)
    }
    .accessibilityElement(children: .contain)
  }
}

public struct CSDatePicker: View {
  public let label: String
  public let text: String
  public let placeholder: String?
  public let open: Bool
  public let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onOpenChange: (Bool) -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, text: String, placeholder: String? = nil, requestedOpen: Bool, disabled: Bool, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onOpenChange: @escaping (Bool) -> Void) {
    self.label = label
    self.text = text
    self.placeholder = placeholder
    open = CSDateField.open(requested: requestedOpen, disabled: disabled)
    self.disabled = disabled
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onOpenChange = onOpenChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSDateField.placeholder(placeholder, fallback: CSDateField.copy("placeholder", language: locale))
    let face = CSDateField.face(hasValue: !text.isEmpty, formatted: text, placeholder: hint)
    VStack(alignment: .leading) {
      CSTriggerButton(face) { onOpenChange(!open) }
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .disabled(disabled)
        .accessibilityLabel(label.isEmpty ? face : label)
      if open {
        Text(text).foregroundStyle(pack.primaryTextColor)
      }
    }
  }
}

public struct CSChatMessage: View {
  public let role: String
  public let name: String?
  public let bodyText: String
  public let avatar: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(role: String = "lumi", name: String? = nil, avatar: String? = nil, body bodyText: String, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.role = role
    self.name = name
    self.avatar = avatar
    self.bodyText = bodyText
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let user = CSChatRole.isUser(role)
    let you = CSChatRole.copy("you", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))
    let speaker = CSChatRole.speaker(name, role: role, you: you, lumi: CSChatRole.lumiDefault)
    VStack(alignment: user ? .trailing : .leading) {
      if let avatar {
        Text(avatar).accessibilityHidden(true)
      } else if user {
        Text(you).accessibilityHidden(true)
      } else {
        CSIcon(name: "sparkle", label: "", dark: dark, highContrast: highContrast, compact: compact)
      }
      Text(speaker).foregroundStyle(pack.mutedColor)
      Text(bodyText).foregroundStyle(user ? pack.colorSemanticInfoFg.color : pack.primaryTextColor)
        .padding(8)
        .background(user ? pack.colorBrandUmber.color : pack.colorSurfacePanel.color)
    }
    .frame(maxWidth: .infinity, alignment: user ? .trailing : .leading)
  }
}

public struct CSIcon: View {
  public let name: String
  public let size: String
  public let label: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(name: String, size: String = "md", label: String = "", dark: Bool, highContrast: Bool, compact: Bool) {
    self.name = name
    self.size = size
    self.label = label
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let points = CSIconModel.points(size)
    CSIconShape(name: name)
      .stroke(pack.primaryTextColor, style: StrokeStyle(lineWidth: 1.75 * points / 24, lineCap: .round, lineJoin: .round))
      .frame(width: points, height: points)
      .accessibilityLabel(label)
      .accessibilityHidden(label.isEmpty)
  }
}

public struct CSAnchor: View {
  public let title: String
  public let items: [(id: String, label: String)]
  public let active: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(title: String, items: [(id: String, label: String)], visibleIds: [String], dark: Bool, highContrast: Bool, compact: Bool) {
    self.title = title
    self.items = items
    active = CSAnchorModel.active(visibleIds)
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading) {
      Text(title).foregroundStyle(pack.primaryTextColor)
      ForEach(Array(items.enumerated()), id: \.offset) { _, item in
        Text(item.label).foregroundStyle(item.id == active ? pack.colorBrandOchre.color : pack.mutedColor)
          .frame(minHeight: 44, alignment: .leading)
      }
    }
  }
}

public struct CSCitation: Equatable {
  public let title: String
  public let source: String?
  public let href: String?
  public init(title: String, source: String? = nil, href: String? = nil) {
    self.title = title
    self.source = source
    self.href = href
  }
}

public enum CSCitationModel {
  public static let labelDefault = "Sources"
  public static let linkTarget = "_blank"
  public static let linkRel = "noreferrer"
  public static func heading(label: String?, omitted: Bool, fallback: String) -> String? {
    if omitted { return fallback }
    guard let label, !label.isEmpty else { return nil }
    return label
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["sources": "Nguồn"],
      "en": ["sources": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func sourceSuffix(_ source: String?) -> String? {
    guard let source, !source.isEmpty else { return nil }
    return " · \(source)"
  }
  public static func href(_ href: String?) -> String? {
    guard let href, !href.isEmpty else { return nil }
    return href
  }
  public static func number(index: Int) -> Int { index + 1 }
  public static func line(index: Int, title: String, source: String?) -> String {
    "\(number(index: index)) \(title)\(sourceSuffix(source) ?? "")"
  }
}

public struct CSCitationList: View {
  public let label: String?
  public let items: [CSCitation]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, items: [CSCitation], dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.items = items
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading) {
      if let heading = CSCitationModel.heading(label: label, omitted: label == nil, fallback: CSCitationModel.copy("sources", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))) {
        Text(heading).foregroundStyle(pack.primaryTextColor)
      }
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        let line = CSCitationModel.line(index: index, title: item.title, source: item.source)
        if let href = CSCitationModel.href(item.href), let url = URL(string: href) {
          Link(line, destination: url)
            .frame(minHeight: 44, alignment: .leading)
        } else {
          Text(line)
            .foregroundStyle(pack.primaryTextColor)
            .frame(minHeight: 44, alignment: .leading)
        }
      }
    }
  }
}

public struct CSScrollArea<Content: View>: View {
  public let maxHeight: CGFloat
  let content: () -> Content

  public init(maxHeight: CGFloat, @ViewBuilder content: @escaping () -> Content) {
    self.maxHeight = maxHeight
    self.content = content
  }

  public var body: some View {
    ScrollView { content() }.frame(maxHeight: maxHeight)
  }
}

public enum CSImageModel {
  public static let previewDefault = "Preview image"
  public static let closeDefault = "Close"
  public static let fallbackMark = "M21 15l-5-5-9 9"
  public static func loadState(currentSrc: String?, nextSrc: String?, current: String) -> String {
    currentSrc == nextSrc ? current : "loading"
  }
  public static func loaded(complete: Bool, hasSrc: Bool, naturalWidth: Int) -> String? {
    complete && hasSrc && naturalWidth > 0 ? "ok" : nil
  }
  public static func canPreview(preview: Bool, state: String) -> Bool { preview && state == "ok" }
  public static func previewOpen(zoom: Bool, preview: Bool, state: String) -> Bool { zoom && canPreview(preview: preview, state: state) }
  public static func previewName(alt: String, fallback: String) -> String { alt.isEmpty ? fallback : "\(fallback): \(alt)" }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["preview": "Xem ảnh", "close": "Đóng"],
      "en": ["preview": previewDefault, "close": closeDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func dialogName(alt: String, fallback: String) -> String { alt.isEmpty ? fallback : alt }
  public static func showsFallback(_ fallback: String?) -> Bool {
    guard let fallback else { return false }
    return !fallback.isEmpty
  }
}

public struct CSImage: View {
  public let alt: String
  public let ratio: String
  public let preview: Bool
  public let state: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(alt: String = "", ratio: String = "16 / 9", preview: Bool = false, state: String = "loading", dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.alt = alt
    self.ratio = ratio
    self.preview = preview
    self.state = state
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let height = CSAspectRatioModel.height(ratio: ratio, width: 160) ?? 90
    let previewWord = CSImageModel.copy("preview", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))
    RoundedRectangle(cornerRadius: pack.radiusMd.points)
      .fill(pack.borderColor)
      .frame(width: 160, height: height)
      .accessibilityLabel(CSImageModel.canPreview(preview: preview, state: state) ? CSImageModel.previewName(alt: alt, fallback: previewWord) : alt)
  }
}

public struct CSLogo: View {
  public let title: String
  public let decorative: Bool
  public let size: CGFloat
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(title: String = "CyberSkill", decorative: Bool = false, size: CGFloat = 32, dark: Bool, highContrast: Bool, compact: Bool) {
    self.title = title
    self.decorative = decorative
    self.size = size
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Text(title)
      .foregroundStyle(pack.colorBrandOchre.color)
      .frame(width: size, height: size)
      .accessibilityHidden(decorative)
      .accessibilityLabel(decorative ? "" : title)
  }
}

public struct CSFloatingRect: Equatable {
  public var left: Double
  public var top: Double
  public var right: Double
  public var bottom: Double
  public var width: Double
  public var height: Double
  public init(left: Double, top: Double, right: Double, bottom: Double, width: Double, height: Double) {
    self.left = left
    self.top = top
    self.right = right
    self.bottom = bottom
    self.width = width
    self.height = height
  }
}

public struct CSFloatingResult: Equatable {
  public var left: Double
  public var top: Double
  public var maxWidth: Double
  public var maxHeight: Double
  public var placement: String
  public init(left: Double, top: Double, maxWidth: Double, maxHeight: Double, placement: String) {
    self.left = left
    self.top = top
    self.maxWidth = maxWidth
    self.maxHeight = maxHeight
    self.placement = placement
  }
}

public enum CSFloatingModel {
  public static let placements = ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]

  public static func position(anchor: CSFloatingRect, panelWidth: Double, panelHeight: Double, viewport: CSFloatingRect, placement: String = "bottom-start", gap: Double = 8, direction: String = "ltr") -> CSFloatingResult? {
    guard placements.contains(placement) else { return nil }
    let parts = placement.split(separator: "-", maxSplits: 1).map(String.init)
    let preferred = parts[0]
    let alignment = parts.count > 1 ? parts[1] : nil
    let opposite = ["top": "bottom", "bottom": "top", "left": "right", "right": "left"]
    let available = [
      "top": anchor.top - viewport.top - gap,
      "bottom": viewport.bottom - anchor.bottom - gap,
      "left": anchor.left - viewport.left - gap,
      "right": viewport.right - anchor.right - gap,
    ]
    let dimension = preferred == "top" || preferred == "bottom" ? panelHeight : panelWidth
    let preferredSpace = available[preferred] ?? 0
    let oppositeSpace = available[opposite[preferred] ?? ""] ?? 0
    let side = dimension > preferredSpace && oppositeSpace > preferredSpace ? (opposite[preferred] ?? preferred) : preferred
    let vertical = side == "top" || side == "bottom"
    let align: String? = vertical && direction == "rtl"
      ? (alignment == "start" ? "end" : alignment == "end" ? "start" : nil)
      : alignment
    var left = vertical
      ? (align == "start" ? anchor.left : align == "end" ? anchor.right - panelWidth : anchor.left + (anchor.width - panelWidth) / 2)
      : (side == "left" ? anchor.left - gap - panelWidth : anchor.right + gap)
    var top = vertical
      ? (side == "top" ? anchor.top - gap - panelHeight : anchor.bottom + gap)
      : (align == "start" ? anchor.top : align == "end" ? anchor.bottom - panelHeight : anchor.top + (anchor.height - panelHeight) / 2)
    left = clamped(left, viewport.left, viewport.right - panelWidth)
    top = clamped(top, viewport.top, viewport.bottom - panelHeight)
    return CSFloatingResult(
      left: left,
      top: top,
      maxWidth: max(0, vertical ? viewport.right - viewport.left : (available[side] ?? 0)),
      maxHeight: max(0, vertical ? (available[side] ?? 0) : viewport.bottom - viewport.top),
      placement: side + (alignment.map { "-\($0)" } ?? "")
    )
  }

  static func clamped(_ value: Double, _ start: Double, _ end: Double) -> Double {
    max(start, min(value, max(start, end)))
  }
}

public struct CSContextPoint: Equatable {
  public var x: Double
  public var y: Double
  public init(x: Double, y: Double) {
    self.x = x
    self.y = y
  }
}

public enum CSContextMenuModel {
  public static let menuDefault = "Context menu"
  public static let gap = 0.0
  public static func isSeparator(_ item: String) -> Bool { item == "-" }
  public static func firstItem(_ items: [String]) -> Int? { items.firstIndex { !isSeparator($0) } }
  public static func point(clientX: Double, clientY: Double, left: Double, top: Double) -> CSContextPoint {
    CSContextPoint(x: clientX - left, y: clientY - top)
  }
  public static func keyboardPoint(height: Double) -> CSContextPoint { CSContextPoint(x: 0, y: height) }
  public static func placeMenu(x: Double, y: Double, panelWidth: Double, panelHeight: Double, viewportWidth: Double, viewportHeight: Double) -> CSContextPoint {
    let inset = 8.0
    let viewport = CSFloatingRect(left: inset, top: inset, right: max(inset, viewportWidth - inset), bottom: max(inset, viewportHeight - inset), width: 0, height: 0)
    let anchor = CSFloatingRect(left: x, top: y, right: x, bottom: y, width: 0, height: 0)
    let placed = CSFloatingModel.position(anchor: anchor, panelWidth: panelWidth, panelHeight: panelHeight, viewport: viewport, placement: "bottom-start", gap: 0, direction: "ltr")
    return CSContextPoint(x: placed?.left ?? x, y: placed?.top ?? y)
  }
  public static func screenSize() -> (width: Double, height: Double) {
    #if os(macOS)
    let size = NSScreen.main?.frame.size ?? CGSize(width: 1280, height: 800)
    #else
    let size = UIScreen.main.bounds.size
    #endif
    return (width: Double(size.width), height: Double(size.height))
  }
  public static func open(items: [String], defaultPrevented: Bool) -> Int? {
    if defaultPrevented { return nil }
    return firstItem(items)
  }
  public static func move(index: Int, count: Int, key: String) -> Int? {
    guard count > 0 else { return nil }
    switch key {
    case "down": return min(count - 1, index + 1)
    case "up": return index < 0 ? count - 1 : max(0, index - 1)
    case "home": return 0
    case "end": return count - 1
    default: return nil
    }
  }
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["menu": "Trình đơn ngữ cảnh"],
      "en": ["menu": menuDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSContextMenu: View {
  public let label: String?
  public let items: [String]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var anchor: CSContextPoint? = nil
  @State private var zoneHeight = 44.0
  @State private var zoneFrame = CGRect.zero
  @State private var zoneScale = CGSize(width: 1, height: 1)
  @State private var naturalSize: CGSize? = nil
  @State private var fittedSize: CGSize? = nil
  @State private var measurePass = 0

  public init(label: String? = nil, items: [String], dark: Bool, highContrast: Bool, compact: Bool, onSelect: @escaping (String) -> Void, language: String? = nil) {
    self.label = label
    self.items = items
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSContextMenuModel.label(label, fallback: CSContextMenuModel.copy("menu", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    ZStack(alignment: .topLeading) {
      CSContextPointer(onPoint: { point in
        anchor = CSContextMenuModel.point(clientX: point.x, clientY: point.y, left: 0, top: 0)
        naturalSize = nil
        fittedSize = nil
        measurePass = 0
      }, onMenu: { height in
        anchor = CSContextMenuModel.keyboardPoint(height: height)
        naturalSize = nil
        fittedSize = nil
        measurePass = 0
      }, zoneHeight: zoneHeight)
      .frame(maxWidth: .infinity, minHeight: 44)
      .background(GeometryReader { geo in
        let frame = geo.frame(in: .global)
        let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
        let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
        Color.clear
          .preference(key: CSContextFrameKey.self, value: frame)
          .preference(key: CSContextScaleKey.self, value: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY))
      })
      if let anchor {
        let initial = naturalSize.map { localPlace(anchor, panel: $0, placement: "bottom-start") }
        let placed = fittedSize.flatMap { size in initial.map { localPlace(anchor, panel: size, placement: $0.placement) } }
        VStack(alignment: .leading, spacing: CSContextMenuModel.gap) {
          if CSContextMenuModel.firstItem(items) != nil {
            ForEach(Array(items.enumerated()), id: \.offset) { _, item in
              if CSContextMenuModel.isSeparator(item) {
                Rectangle().fill(pack.borderColor).frame(height: 1).accessibilityHidden(true)
              } else {
                CSTriggerButton(item) {
                  onSelect(item)
                  self.anchor = nil
                  self.naturalSize = nil
                  self.fittedSize = nil
                  self.measurePass = 0
                }
                .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
              }
            }
          }
        }
        .frame(maxWidth: initial.map { CGFloat($0.maxWidth) }, maxHeight: initial.map { CGFloat($0.maxHeight) }, alignment: .topLeading)
        .offset(x: (placed?.left ?? anchor.x) / (zoneScale.width == 0 ? 1 : zoneScale.width), y: (placed?.top ?? anchor.y) / (zoneScale.height == 0 ? 1 : zoneScale.height))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
        .allowsHitTesting(placed != nil)
        .background(GeometryReader { geo in
          Color.clear.preference(key: CSContextPanelKey.self, value: CSPanelMeasure(size: geo.size, pass: measurePass))
        })
        .accessibilityElement(children: .contain)
        .accessibilityLabel(spoken)
      }
    }
    .focusable()
    .onPreferenceChange(CSContextFrameKey.self) { frame in
      zoneFrame = frame
      if frame.height > 0 { zoneHeight = frame.height }
    }
    .onPreferenceChange(CSContextScaleKey.self) { zoneScale = $0 }
    .onPreferenceChange(CSContextPanelKey.self) { measure in
      guard measure.size.width > 0, measure.size.height > 0 else { return }
      if naturalSize == nil {
        naturalSize = measure.size
        measurePass = 1
      } else if measure.pass >= 1 {
        fittedSize = measure.size
      }
    }
  }

  private func localPlace(_ local: CSContextPoint, panel: CGSize, placement: String) -> CSFloatingResult {
    let screen = CSContextMenuModel.screenSize()
    let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
    let anchor = CSFloatingRect(left: zoneFrame.minX + local.x, top: zoneFrame.minY + local.y, right: zoneFrame.minX + local.x, bottom: zoneFrame.minY + local.y, width: 0, height: 0)
    let global = CSFloatingModel.position(anchor: anchor, panelWidth: panel.width, panelHeight: panel.height, viewport: viewport, placement: placement, gap: 0, direction: "ltr")
    return CSFloatingResult(left: (global?.left ?? local.x) - zoneFrame.minX, top: (global?.top ?? local.y) - zoneFrame.minY, maxWidth: global?.maxWidth ?? screen.width, maxHeight: global?.maxHeight ?? screen.height, placement: global?.placement ?? placement)
  }
}

private struct CSContextScaleKey: PreferenceKey {
  static var defaultValue = CGSize(width: 1, height: 1)
  static func reduce(value: inout CGSize, nextValue: () -> CGSize) { value = nextValue() }
}

private struct CSContextFrameKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSPanelMeasure: Equatable {
  var size: CGSize
  var pass: Int
}

private struct CSContextPanelKey: PreferenceKey {
  static var defaultValue = CSPanelMeasure(size: .zero, pass: 0)
  static func reduce(value: inout CSPanelMeasure, nextValue: () -> CSPanelMeasure) { value = nextValue() }
}

private struct CSContextPointer: View {
  var onPoint: (CGPoint) -> Void
  var onMenu: (Double) -> Void
  var zoneHeight: Double
  var body: some View {
    #if os(macOS)
    CSMacContextClick(onPoint: onPoint, onMenu: { onMenu(zoneHeight) })
    #else
    CSTouchContextClick(onPoint: onPoint, onMenu: { onMenu(zoneHeight) })
    #endif
  }
}

#if os(macOS)
private struct CSMacContextClick: NSViewRepresentable {
  var onPoint: (CGPoint) -> Void
  var onMenu: () -> Void
  func makeNSView(context: Context) -> NSView {
    let view = CSMacContextClickView()
    view.onPoint = onPoint
    view.onMenu = onMenu
    return view
  }
  func updateNSView(_ nsView: NSView, context: Context) {
    guard let view = nsView as? CSMacContextClickView else { return }
    view.onPoint = onPoint
    view.onMenu = onMenu
  }
}

private final class CSMacContextClickView: NSView {
  var onPoint: ((CGPoint) -> Void)?
  var onMenu: (() -> Void)?
  override var acceptsFirstResponder: Bool { true }
  override func mouseDown(with event: NSEvent) {
    window?.makeFirstResponder(self)
    super.mouseDown(with: event)
  }
  override func rightMouseDown(with event: NSEvent) {
    window?.makeFirstResponder(self)
    let local = convert(event.locationInWindow, from: nil)
    onPoint?(CGPoint(x: local.x, y: bounds.height - local.y))
  }
  override func keyDown(with event: NSEvent) {
    if event.keyCode == 109 && event.modifierFlags.contains(.shift) {
      onMenu?()
      return
    }
    super.keyDown(with: event)
  }
}
#else
private struct CSTouchContextClick: UIViewRepresentable {
  var onPoint: (CGPoint) -> Void
  var onMenu: () -> Void
  func makeUIView(context: Context) -> UIView {
    let view = CSTouchContextClickView()
    view.onMenu = onMenu
    view.addGestureRecognizer(UILongPressGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.press(_:))))
    return view
  }
  func updateUIView(_ uiView: UIView, context: Context) {
    context.coordinator.onPoint = onPoint
    (uiView as? CSTouchContextClickView)?.onMenu = onMenu
  }
  func makeCoordinator() -> Coordinator { Coordinator(onPoint: onPoint) }
  final class Coordinator: NSObject {
    var onPoint: (CGPoint) -> Void
    init(onPoint: @escaping (CGPoint) -> Void) { self.onPoint = onPoint }
    @objc func press(_ gesture: UILongPressGestureRecognizer) {
      guard gesture.state == .began, let view = gesture.view else { return }
      onPoint(gesture.location(in: view))
    }
  }
}

private final class CSTouchContextClickView: UIView {
  var onMenu: (() -> Void)?
  override var canBecomeFirstResponder: Bool { true }
  override var keyCommands: [UIKeyCommand]? {
    [UIKeyCommand(input: UIKeyCommand.f10, modifierFlags: .shift, action: #selector(openMenu))]
  }
  @objc func openMenu() { onMenu?() }
}
#endif

public struct CSNavMenuItem: Equatable, Hashable {
  public var label: String
  public var href: String?
  public var panel: [String]
  public init(label: String, href: String? = nil, panel: [String] = []) {
    self.label = label
    self.href = href
    self.panel = panel
  }
  public var opensPanel: Bool { !panel.isEmpty }
}

public enum CSNavigationMenuModel {
  public static let gap = 8.0
  public static func href(_ href: String?) -> String {
    guard let href, !href.isEmpty else { return "#" }
    return href
  }
  public static func showsDescription(_ description: String?) -> Bool {
    guard let description else { return false }
    return !description.isEmpty
  }
  public static func click(open: Int?, index: Int) -> Int? { open == index ? nil : index }
  public static func hover(open: Int?, index: Int) -> Int? {
    guard let open else { return nil }
    return open == index ? open : index
  }
  public static func placement(_ placement: String?) -> String { placement ?? "bottom-start" }
}

public struct CSNavigationMenu: View {
  public let items: [CSNavMenuItem]
  public let placement: String?
  @State private var open: Int?
  @State private var menuFocusId = UUID().uuidString
  @FocusState private var menuItem: Int?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(items: [CSNavMenuItem], placement: String? = nil, dark: Bool, highContrast: Bool, compact: Bool) {
    self.items = items
    self.placement = placement
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let place = CSNavigationMenuModel.placement(placement)
    VStack(alignment: place.hasSuffix("end") ? .trailing : .leading, spacing: CSNavigationMenuModel.gap) {
      HStack {
        ForEach(Array(items.enumerated()), id: \.offset) { index, item in
          if item.opensPanel {
            Button(action: {
              CSFocusRegistry.shared.claim(id: "\(menuFocusId)-\(index)", restore: { menuItem = index })
              open = CSNavigationMenuModel.click(open: open, index: index)
            }) {
              HStack(spacing: 4) {
                Text(item.label)
                Text("▾").accessibilityHidden(true)
              }
            }
            .frame(minHeight: pack.componentButtonMdMinHeight.points)
            .focused($menuItem, equals: index)
            .onHover { inside in
              guard inside else { return }
              open = CSNavigationMenuModel.hover(open: open, index: index)
            }
            .accessibilityValue(Text(open == index ? "expanded" : "collapsed"))
          } else if let url = URL(string: CSNavigationMenuModel.href(item.href)) {
            Link(item.label, destination: url)
              .frame(minHeight: pack.componentButtonMdMinHeight.points)
              .csOwnFocus()
          }
        }
      }
      .onChange(of: menuItem) { index in
        if let index { CSFocusRegistry.shared.claim(id: "\(menuFocusId)-\(index)", restore: { menuItem = index }) }
      }
      if let open, items.indices.contains(open), items[open].opensPanel {
        ForEach(Array(items[open].panel.enumerated()), id: \.offset) { _, card in
          if CSNavigationMenuModel.showsDescription(card) {
            Text(card).foregroundStyle(pack.primaryTextColor)
          }
        }
      }
    }
  }
}

public struct CSCardHeader: View {
  public let title: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public init(title: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.title = title
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Text(title).font(.headline).foregroundStyle(pack.primaryTextColor).frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
  }
}

public struct CSCardBody: View {
  public let text: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public init(text: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.text = text
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Text(text).foregroundStyle(pack.primaryTextColor)
  }
}

public struct CSCardFooter: View {
  public let text: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public init(text: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.text = text
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Text(text).foregroundStyle(pack.mutedColor)
  }
}

public struct CSToastStack<Content: View>: View {
  public let label: String?
  public let language: String?
  let content: () -> Content
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String? = nil, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.language = language
    self.content = content
  }
  public var body: some View {
    let name = label ?? CSToastModel.copy("notifications", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))
    VStack(alignment: .trailing, spacing: CSToastModel.stackGap) { content() }
      .accessibilityElement(children: .contain)
      .accessibilityLabel(name)
  }
}
