import SwiftUI
#if os(macOS)
import AppKit
#else
import UIKit
#endif

public struct CSKeyEvent: Equatable {
  public var key: String
  public var ctrl: Bool
  public var meta: Bool
  public var shift: Bool
  public var alt: Bool

  public init(key: String, ctrl: Bool = false, meta: Bool = false, shift: Bool = false, alt: Bool = false) {
    self.key = key
    self.ctrl = ctrl
    self.meta = meta
    self.shift = shift
    self.alt = alt
  }
}

public enum CSHotKeyModel {
  public static func matches(combo: String, event: CSKeyEvent) -> Bool {
    var parts = combo.lowercased().split(separator: "+").map { $0.trimmingCharacters(in: .whitespaces) }
    guard let key = parts.popLast(), !key.isEmpty else { return false }
    let allowed = ["mod", "ctrl", "meta", "shift", "alt"]
    if parts.contains(where: { !allowed.contains($0) }) { return false }
    let has = { (name: String) in parts.contains(name) }
    let control = has("mod")
      ? (event.meta || event.ctrl) && (!has("ctrl") || event.ctrl) && (!has("meta") || event.meta)
      : event.ctrl == has("ctrl") && event.meta == has("meta")
    return control && event.shift == has("shift") && event.alt == has("alt") && event.key.lowercased() == key
  }

  public static let titleDefault = "Keyboard shortcuts"
  public static let toggleDefault = "Toggle this sheet"

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["title": "Phím tắt", "toggle": "Bật/tắt bảng này"],
      "en": ["title": titleDefault, "toggle": toggleDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func ignored(composing: Bool, keyCode: Int, inField: Bool) -> Bool {
    composing || keyCode == 229 || inField
  }

  public static func isHelpKey(_ key: String, ctrl: Bool, meta: Bool, alt: Bool, help: Bool) -> Bool {
    help && key == "?" && !ctrl && !meta && !alt
  }

  public static func nextOpen(open: Bool, helpKey: Bool, otherModal: Bool) -> Bool? {
    guard helpKey else { return nil }
    if !open && otherModal { return nil }
    return !open
  }

  public static func otherModal(_ layers: [CSOverlayLayer], id: String) -> Bool {
    layers.contains { $0.kind == "modal" && $0.connected && $0.id != id }
  }

  public static func dismissBackdrop(open: Bool) -> Bool { open }
  public static let rootClass = "cs-hotkeys"
  public static let sheetClass = "cs-hotkeys__sheet"
  public static let cardClass = "cs-hotkeys__card"
  public static let kbdClass = "cs-kbd"
  public static let dialogRole = "dialog"
  public static let helpShortcut = "?"
  public static func isFieldTag(_ tagName: String) -> Bool {
    ["INPUT", "TEXTAREA", "SELECT"].contains(tagName.uppercased())
  }
}

public struct CSChartBar: Equatable {
  public var x: Double
  public var y: Double
  public var width: Double
  public var height: Double
}

public struct CSChartPoint: Equatable {
  public var x: Double
  public var y: Double
}

public struct CSChartSlice: Equatable {
  public var start: Double
  public var end: Double
  public var large: Bool
  public var full: Bool
}

public enum CSChartModel {
  public static let defaultType = "bar"
  public static let defaultWidth = 320.0
  public static let defaultHeight = 160.0
  public static let rootClass = "cs-chart"
  public static let legendClass = "cs-chart__legend"
  public static let role = "img"
  public static let pieViewBox = "0 0 120 120"
  public static func pieStrokeWidth() -> Double { 1.5 }
  public static func lineStrokeWidth() -> Double { 2.4 }
  public static func linePointRadius() -> Double { 3.4 }
  public static func barCornerRadius() -> Double { 3.0 }
  public static func margin() -> Double { 0 }
  public static func gap() -> Double { 8 }
  public static func maxWidth() -> Double { 420 }
  public static func canvasSize(type: String, height: Double = defaultHeight) -> (width: Double, height: Double) {
    kind(type) == "pie" ? (height, height) : (320, height)
  }

  public static func maxValue(_ values: [Double]) -> Double {
    max(1, values.max() ?? 1)
  }

  public static func kind(_ type: String) -> String {
    switch type {
    case "pie", "line", "spark": return type
    default: return "bar"
    }
  }

  public static func sliceSlot(_ index: Int) -> Int {
    let count = 5
    return ((index % count) + count) % count
  }

  public static func bars(_ values: [Double], height: Double = 160) -> [CSChartBar] {
    let numbers = values.map { $0.isNaN ? 0 : $0 }
    guard !numbers.isEmpty else { return [] }
    let peak = max(1, numbers.max() ?? 1)
    let floor = min(0, numbers.min() ?? 0)
    let span = (peak - floor) == 0 ? 1 : peak - floor
    let band = (320.0 - 8) / Double(numbers.count)
    let zeroY = floor < 0 ? 6 + (peak / span) * (height - 26) : height - 20
    return numbers.enumerated().map { index, value in
      let barHeight: Double
      let y: Double
      if floor < 0 {
        barHeight = abs(value) / span * (height - 26)
        y = value >= 0 ? zeroY - barHeight : zeroY
      } else {
        barHeight = max(0, max(0, value) / peak * (height - 26))
        y = height - 20 - barHeight
      }
      return CSChartBar(x: 4 + Double(index) * band + band * 0.14, y: y, width: band * 0.72, height: barHeight)
    }
  }

  public static func line(_ values: [Double], height: Double = 160) -> [CSChartPoint] {
    let numbers = values.map { $0.isNaN ? 0 : $0 }
    let peak = max(1, numbers.max() ?? 1)
    let step = Double(max(1, numbers.count - 1))
    return numbers.enumerated().map { index, value in
      CSChartPoint(
        x: (Double(index) / step) * (320 - 8) + 4,
        y: height - 6 - (value / peak) * (height - 24)
      )
    }
  }

  public static func pie(_ values: [Double]) -> [CSChartSlice?] {
    let numbers = values.map { $0.isNaN ? 0 : $0 }
    let total = numbers.reduce(0, +)
    let safe = total == 0 ? 1 : total
    var angle = -Double.pi / 2
    return numbers.map { value in
      if value == 0 { return nil }
      if value == total {
        return CSChartSlice(start: angle, end: angle, large: false, full: true)
      }
      let next = angle + (value / safe) * Double.pi * 2
      let slice = CSChartSlice(start: angle, end: next, large: next - angle > .pi, full: false)
      angle = next
      return slice
    }
  }

  public static func legendGapY() -> Double { 6 }
  public static func legendGapX() -> Double { 16 }

  public static func legendValue(index: Int, values: [Double], showValues: Bool) -> String? {
    guard showValues, index >= 0, index < values.count else { return nil }
    return " " + jsNumber(values[index])
  }

  public static func legend(type: String, labels: [String], values: [Double], showValues: Bool) -> [String]? {
    if kind(type) == "spark" { return nil }
    return labels.enumerated().map { index, name in
      if showValues, index < values.count { return name + " " + jsNumber(values[index]) }
      return name
    }
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["empty": "Biểu đồ chưa có dữ liệu"],
      "en": ["empty": "Chart with no data"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func emptyWord(_ text: String, fallback: String) -> String { text.isEmpty ? fallback : text }
  public static func accessibleName(label: String?, points: [(label: String, value: Double)], empty: String) -> String {
    if let label, !label.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { return label }
    if points.isEmpty { return empty }
    return points.map { $0.label + ": " + jsNumber($0.value) }.joined(separator: ", ")
  }

  static func jsNumber(_ value: Double) -> String {
    if value.isNaN { return "NaN" }
    if value.isInfinite { return value > 0 ? "Infinity" : "-Infinity" }
    if value == 0 { return "0" }
    if value.rounded() == value && abs(value) < 1e21 { return String(Int(value)) }
    return String(value)
  }
}

public struct CSTerminalLine: Equatable {
  public var command: String?
  public var output: String?

  public init(command: String? = nil, output: String? = nil) {
    self.command = command
    self.output = output
  }
}

public enum CSTerminalModel {
  public static func hasOutput(_ value: String?) -> Bool {
    if let value, !value.isEmpty { return true }
    return false
  }

  public static func initialHistory(welcome: String? = nil, history: [CSTerminalLine] = []) -> [CSTerminalLine] {
    if !history.isEmpty { return history }
    if let welcome, hasOutput(welcome) { return [CSTerminalLine(output: welcome)] }
    return []
  }

  public static func run(history: [CSTerminalLine], command: String, output: String?) -> [CSTerminalLine]? {
    if command.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { return nil }
    var next = history
    next.append(CSTerminalLine(command: command))
    if hasOutput(output) { next.append(CSTerminalLine(output: output)) }
    return next
  }

  public static let titleDefault = "cyberskill — zsh"
  public static let inputDefault = "Terminal input"

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["input": "Ô nhập lệnh", "title": titleDefault],
      "en": ["input": inputDefault, "title": titleDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func barTitle(_ title: String?, fallback: String) -> String { title ?? fallback }

  public static let borderHex = "#3a2a1c"
  public static let barHex = "#2a1a0d"
  public static let dotHex = "#5b4331"
  public static let bgHex = "#1a1108"
  public static let fgHex = "#f5ead9"
  public static let mutedHex = "#c9b7a3"
  public static let borderColor = CSColorValue(colorSpace: .srgb, components: [58.0 / 255.0, 42.0 / 255.0, 28.0 / 255.0], alpha: 1)
  public static let barColor = CSColorValue(colorSpace: .srgb, components: [42.0 / 255.0, 26.0 / 255.0, 13.0 / 255.0], alpha: 1)
  public static let dotColor = CSColorValue(colorSpace: .srgb, components: [91.0 / 255.0, 67.0 / 255.0, 49.0 / 255.0], alpha: 1)
  public static let bgColor = CSColorValue(colorSpace: .srgb, components: [26.0 / 255.0, 17.0 / 255.0, 8.0 / 255.0], alpha: 1)
  public static let fgColor = CSColorValue(colorSpace: .srgb, components: [245.0 / 255.0, 234.0 / 255.0, 217.0 / 255.0], alpha: 1)
  public static let mutedColor = CSColorValue(colorSpace: .srgb, components: [201.0 / 255.0, 183.0 / 255.0, 163.0 / 255.0], alpha: 1)
  public static func maxWidth() -> Double { 480 }
  public static func borderWidth() -> Double { 1 }
  public static let dotCount = 3
  public static func barGap() -> Double { 6 }
  public static func barFontSize() -> Double { 11 }
  public static func barPaddingY() -> Double { 8 }
  public static func barPaddingX() -> Double { 12 }
  public static func dotSize() -> Double { 10 }
  public static func dotRadius() -> Double { 999 }
  public static func titleMarginStart() -> Double { 8 }
  public static func bodyPaddingY() -> Double { 12 }
  public static func bodyPaddingX() -> Double { 14 }
  public static func bodyFontSize() -> Double { 13 }
  public static func bodyLineHeight() -> Double { 1.7 }
  public static func bodyMinHeight() -> Double { 130 }
  public static func lineGap() -> Double { 8 }
  public static func focusOutlineWidth(focused: Bool) -> Double { focused ? 2 : 0 }
  public static func focusOutlineOffset(focused: Bool) -> Double { focused ? 2 : 0 }
  public static func focusRingWidth(focused: Bool) -> Double { focused ? 5 : 0 }

  public static func submits(composing: Bool, keyCode: Int) -> Bool {
    !composing && keyCode != 229
  }
  public static let defaultPrompt = "➜"
  public static let rootClass = "cs-terminal"
  public static let barClass = "cs-terminal__bar"
  public static let bodyClass = "cs-terminal__body"
  public static let lineClass = "cs-terminal__line"
  public static let outputClass = "cs-terminal__out"
  public static let promptClass = "p"
  public static let spellCheck = false
}

public enum CSInlineEditModel {
  public static let rootClass = "cs-inline-edit"
  public static let viewClass = "cs-inline-edit__view"
  public static func penSize() -> Double { 13 }
  public static func penStrokeWidth() -> Double { 1.9 }
  public static func placeholderClass(_ value: String) -> String? { value.isEmpty ? "ph" : nil }
  public static func commit(draft: String, value: String, cancelling: Bool = false) -> String? {
    if cancelling { return nil }
    return draft == value ? nil : draft
  }

  public static func text(_ value: String, empty: String) -> String {
    value.isEmpty ? empty : value
  }

  public static func controlled(_ value: String?, inner: String) -> String {
    value ?? inner
  }

  public static func enterCommits(composing: Bool, keyCode: Int) -> Bool {
    !composing && keyCode != 229
  }

  public static func editLabel(action: String, label: String) -> String {
    label.isEmpty ? action : action + ": " + label
  }
  public static let pen = "M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z"
  public static func showsPen(_ editing: Bool) -> Bool { !editing }
  public static func fieldName(label: String, edit: String) -> String {
    label.isEmpty ? edit : label
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["edit": "Sửa", "empty": "Thêm nội dung"],
      "en": ["edit": "Edit", "empty": "Add text"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public enum CSFormFieldModel {
  public static let summaryClass = "cs-form__summary"
  public static let labelClass = "cs-formfield__label"
  public static let errorClass = "cs-formfield__error"
  public static let hintClass = "cs-formfield__hint"
  public static let defaultValueProp = "value"
  public static func formRootClass(pending: Bool) -> String { pending ? "cs-form is-pending" : "cs-form" }
  public static func fieldRootClass(hasError: Bool) -> String { hasError ? "cs-formfield has-error" : "cs-formfield" }
  public static func defaultValueForProp(_ valueProp: String) -> String {
    valueProp == "checked" || valueProp == "pressed" ? "false" : ""
  }
  public static func labelTag(isNativeControl: Bool) -> String { isNativeControl ? "label" : "span" }
  public static func labelId(_ id: String, hasLabel: Bool) -> String? { hasLabel ? "\(id)-field-label" : nil }
  public static func descriptionId(_ id: String, hasError: Bool, hasHint: Bool) -> String? {
    !hasError && hasHint ? "\(id)-field-hint" : nil
  }
  public static func errorId(_ id: String, hasError: Bool) -> String? { hasError ? "\(id)-field-error" : nil }
  public static func showsError(_ error: String?) -> Bool {
    if let error { return !error.isEmpty }
    return false
  }
  public static func isAlert(_ error: String?) -> Bool { showsError(error) }
  public static func showsLabel(_ label: String) -> Bool {
    !label.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
  }
  public static func showsHint(_ hint: String?) -> Bool {
    if let hint { return !hint.isEmpty }
    return false
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["required": "bắt buộc"],
      "en": ["required": "required"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSHotKeys: View {
  public let bindings: [(keys: String, description: String)]
  public let help: Bool
  public let language: String?
  let onTrigger: (String) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var shown = false
  @State private var sheetId = "hotkeys-\(UUID().uuidString)"

  public init(bindings: [(keys: String, description: String)] = [], help: Bool = true, language: String? = nil, onTrigger: @escaping (String) -> Void = { _ in }) {
    self.bindings = bindings
    self.help = help
    self.language = language
    self.onTrigger = onTrigger
  }

  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let title = CSHotKeyModel.copy("title", language: locale)
    let toggle = CSHotKeyModel.copy("toggle", language: locale)
    VStack(alignment: .leading) {
      ForEach(Array(bindings.enumerated()), id: \.offset) { _, binding in
        CSTriggerButton(binding.keys + " " + binding.description) { onTrigger(binding.keys) }
          .frame(minHeight: 44, alignment: .leading)
      }
      if shown {
        VStack(alignment: .leading, spacing: CGFloat(CSControlsBatchStyleModel.hotkeysRowGap())) {
          Text(title).font(.headline)
          ForEach(Array(bindings.enumerated()), id: \.offset) { _, binding in
            HStack {
              Text(binding.description)
              Text(binding.keys)
            }
          }
          HStack {
            Text(toggle)
            Text("?")
          }
        }
        .padding(16)
        .frame(minWidth: CGFloat(CSControlsBatchStyleModel.hotkeysCardMinWidth()), alignment: .leading)
        .background(GeometryReader { _ in
          CSInlineOutside(active: shown) {
            if CSHotKeyModel.dismissBackdrop(open: shown) { shown = false }
          }
        })
        .accessibilityElement(children: .contain)
        .accessibilityLabel(title)
        .accessibilityAddTraits(.isModal)
      }
    }
    .background(CSHotKeyMonitor(help: help, open: shown, sheetId: sheetId, bindings: bindings, onOpen: { shown = $0 }, onTrigger: onTrigger))
    .onChange(of: shown) { isShown in
      if isShown { CSOverlayRegistry.shared.push(id: sheetId, kind: "modal") }
      else { CSOverlayRegistry.shared.remove(id: sheetId) }
    }
    .onDisappear { CSOverlayRegistry.shared.remove(id: sheetId) }
  }
}

private struct CSHotKeyMonitor: View {
  var help: Bool
  var open: Bool
  var sheetId: String
  var bindings: [(keys: String, description: String)]
  var onOpen: (Bool) -> Void
  var onTrigger: (String) -> Void

  var body: some View {
    #if os(macOS)
    CSHotKeyMacMonitor(help: help, open: open, sheetId: sheetId, bindings: bindings, onOpen: onOpen, onTrigger: onTrigger)
    #else
    Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
    #endif
  }
}

#if os(macOS)
private struct CSHotKeyMacMonitor: NSViewRepresentable {
  var help: Bool
  var open: Bool
  var sheetId: String
  var bindings: [(keys: String, description: String)]
  var onOpen: (Bool) -> Void
  var onTrigger: (String) -> Void

  func makeCoordinator() -> Coordinator { Coordinator() }

  func makeNSView(context: Context) -> NSView {
    context.coordinator.install(help: help, open: open, sheetId: sheetId, bindings: bindings, onOpen: onOpen, onTrigger: onTrigger)
    return NSView()
  }

  func updateNSView(_ nsView: NSView, context: Context) {
    context.coordinator.install(help: help, open: open, sheetId: sheetId, bindings: bindings, onOpen: onOpen, onTrigger: onTrigger)
  }

  static func dismantleNSView(_ nsView: NSView, coordinator: Coordinator) { coordinator.remove() }

  final class Coordinator {
    var monitor: Any?
    var help = true
    var open = false
    var sheetId = ""
    var bindings: [(keys: String, description: String)] = []
    var onOpen: ((Bool) -> Void)?
    var onTrigger: ((String) -> Void)?

    func install(help: Bool, open: Bool, sheetId: String, bindings: [(keys: String, description: String)], onOpen: @escaping (Bool) -> Void, onTrigger: @escaping (String) -> Void) {
      self.help = help
      self.open = open
      self.sheetId = sheetId
      self.bindings = bindings
      self.onOpen = onOpen
      self.onTrigger = onTrigger
      guard monitor == nil else { return }
      monitor = NSEvent.addLocalMonitorForEvents(matching: .keyDown) { [weak self] event in
        self?.handle(event) ?? event
      }
    }

    func handle(_ event: NSEvent) -> NSEvent? {
      let characters = event.characters ?? ""
      let responder = NSApp.keyWindow?.firstResponder
      let inField = responder is NSText
      let composing = (responder as? NSTextView)?.hasMarkedText() ?? false
      if CSHotKeyModel.ignored(composing: composing, keyCode: Int(event.keyCode), inField: inField) { return event }
      if event.keyCode == 53 || characters == "\u{1b}" {
        if open {
          onOpen?(false)
          return nil
        }
        return event
      }
      let helpKey = CSHotKeyModel.isHelpKey(characters, ctrl: event.modifierFlags.contains(.control), meta: event.modifierFlags.contains(.command), alt: event.modifierFlags.contains(.option), help: help)
      if let next = CSHotKeyModel.nextOpen(open: open, helpKey: helpKey, otherModal: CSHotKeyModel.otherModal(CSOverlayRegistry.shared.layers, id: sheetId)) {
        onOpen?(next)
        return nil
      }
      let keyEvent = CSKeyEvent(key: characters, ctrl: event.modifierFlags.contains(.control), meta: event.modifierFlags.contains(.command), shift: event.modifierFlags.contains(.shift), alt: event.modifierFlags.contains(.option))
      for binding in bindings where CSHotKeyModel.matches(combo: binding.keys, event: keyEvent) {
        onTrigger?(binding.keys)
        return nil
      }
      return event
    }

    func remove() {
      if let monitor { NSEvent.removeMonitor(monitor) }
      monitor = nil
    }
  }
}
#endif

public struct CSChart: View {
  public let label: String
  public let values: [Double]
  public let type: String
  public let height: Double
  public let pointLabels: [String]
  public let showValues: Bool
  public let emptyLabel: String
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String = "", values: [Double] = [], type: String = CSChartModel.defaultType, height: Double = CSChartModel.defaultHeight, pointLabels: [String] = [], showValues: Bool = false, emptyLabel: String = "", dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.values = values
    self.type = type
    self.height = height
    self.pointLabels = pointLabels
    self.showValues = showValues
    self.emptyLabel = emptyLabel
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let kind = CSChartModel.kind(type)
    let canvas = CSChartModel.canvasSize(type: type, height: height)
    let points = pointLabels.enumerated().map { index, name in
      (label: name, value: index < values.count ? values[index] : 0)
    }
    let announced = CSChartModel.accessibleName(label: label, points: points, empty: CSChartModel.emptyWord(emptyLabel, fallback: CSChartModel.copy("empty", language: locale)))
    let rows = CSChartModel.legend(type: type, labels: pointLabels, values: values, showValues: showValues)
    VStack(alignment: .leading, spacing: CGFloat(CSChartModel.gap())) {
    Canvas { context, size in
      let color = pack.accent.color
      if kind == "pie" {
        let scale = size.height / 120
        let center = CGPoint(x: 60 * scale, y: 60 * scale)
        let radius = 50 * scale
        let fills = [pack.accent.color, pack.accentStrong.color, pack.accentGradB.color, pack.colorTextMuted.color, pack.colorBorderDefault.color]
        for (index, slice) in CSChartModel.pie(values).enumerated() {
          guard let slice else { continue }
          let fill = fills[CSChartModel.sliceSlot(index)]
          if slice.full {
            context.fill(Path(ellipseIn: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)), with: .color(fill))
          } else {
            var path = Path()
            path.move(to: center)
            let steps = max(1, Int((slice.end - slice.start) / (Double.pi / 18)))
            for step in 0...steps {
              let angle = slice.start + (slice.end - slice.start) * Double(step) / Double(steps)
              path.addLine(to: CGPoint(x: center.x + CGFloat(Foundation.cos(angle)) * radius, y: center.y + CGFloat(Foundation.sin(angle)) * radius))
            }
            path.closeSubpath()
            context.fill(path, with: .color(fill))
          }
        }
      } else if kind == "line" || kind == "spark" {
        let points = CSChartModel.line(values, height: height)
        var path = Path()
        for (index, point) in points.enumerated() {
          let mark = CGPoint(x: point.x / 320 * size.width, y: point.y / height * size.height)
          if index == 0 { path.move(to: mark) } else { path.addLine(to: mark) }
        }
        context.stroke(path, with: .color(color), lineWidth: 2.4)
        if kind == "line" {
          for point in points {
            let mark = CGPoint(x: point.x / 320 * size.width, y: point.y / height * size.height)
            context.fill(Path(ellipseIn: CGRect(x: mark.x - 3.4, y: mark.y - 3.4, width: 6.8, height: 6.8)), with: .color(color))
          }
        }
      } else {
        let scaleX = size.width / 320
        let scaleY = size.height / height
        for bar in CSChartModel.bars(values, height: height) where bar.height > 0 {
          let rect = CGRect(x: bar.x * scaleX, y: bar.y * scaleY, width: bar.width * scaleX, height: bar.height * scaleY)
          context.fill(Path(roundedRect: rect, cornerRadius: 3), with: .color(color))
        }
      }
    }
    .frame(width: CGFloat(canvas.width), height: CGFloat(canvas.height))
    if rows != nil {
      HStack(spacing: CGFloat(CSChartModel.legendGapX())) {
        ForEach(Array(pointLabels.enumerated()), id: \.offset) { index, name in
          HStack(spacing: 0) {
            Text(name)
              .font(.system(size: pack.fontSizeXs.points))
              .foregroundStyle(pack.mutedColor)
            if let value = CSChartModel.legendValue(index: index, values: values, showValues: showValues) {
              Text(value)
                .font(.system(size: pack.fontSizeXs.points, weight: .bold))
                .foregroundStyle(pack.primaryTextColor)
            }
          }
        }
      }
      .padding(.vertical, CGFloat(CSChartModel.legendGapY() / 2))
    }
    }
    .padding(CGFloat(CSChartModel.margin()))
    .frame(maxWidth: CGFloat(CSChartModel.maxWidth()), alignment: .leading)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(announced)
  }
}

public struct CSTerminal: View {
  public let title: String?
  public let welcome: String?
  public let prompt: String
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onCommand: (String) -> String?
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var lines: [CSTerminalLine]
  @State private var draft = ""
  @FocusState private var focused: Bool
  @State private var focusId = UUID().uuidString

  public init(title: String? = nil, welcome: String? = nil, prompt: String = CSTerminalModel.defaultPrompt, history: [CSTerminalLine] = [], dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onCommand: @escaping (String) -> String? = { _ in nil }) {
    self.title = title
    self.welcome = welcome
    self.prompt = prompt
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onCommand = onCommand
    _lines = State(initialValue: CSTerminalModel.initialHistory(welcome: welcome, history: history))
  }

  private func submit() {
    #if os(macOS)
    let composing = (NSApp.keyWindow?.firstResponder as? NSTextView)?.hasMarkedText() ?? false
    #else
    let composing = false
    #endif
    guard CSTerminalModel.submits(composing: composing, keyCode: 0) else { return }
    let trimmed = draft.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !trimmed.isEmpty else { return }
    guard let next = CSTerminalModel.run(history: lines, command: draft, output: onCommand(trimmed)) else { return }
    lines = next
    draft = ""
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let bar = CSTerminalModel.barTitle(title, fallback: CSTerminalModel.copy("title", language: locale))
    let inputName = CSTerminalModel.copy("input", language: locale)
    let shadow = pack.shadowMd.first
    VStack(alignment: .leading, spacing: 0) {
      HStack(alignment: .center, spacing: CGFloat(CSTerminalModel.barGap())) {
        ForEach(0..<CSTerminalModel.dotCount, id: \.self) { _ in
          RoundedRectangle(cornerRadius: CGFloat(CSTerminalModel.dotRadius()))
            .fill(CSTerminalModel.dotColor.color)
            .frame(width: CGFloat(CSTerminalModel.dotSize()), height: CGFloat(CSTerminalModel.dotSize()))
            .accessibilityHidden(true)
        }
        Text(bar)
          .font(.system(size: CGFloat(CSTerminalModel.barFontSize()), weight: .semibold, design: .monospaced))
          .foregroundStyle(CSTerminalModel.mutedColor.color)
          .padding(.leading, CGFloat(CSTerminalModel.titleMarginStart()))
      }
      .padding(.vertical, CGFloat(CSTerminalModel.barPaddingY()))
      .padding(.horizontal, CGFloat(CSTerminalModel.barPaddingX()))
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(CSTerminalModel.barColor.color)
      VStack(alignment: .leading) {
        ForEach(Array(lines.enumerated()), id: \.offset) { _, line in
          if let command = line.command {
            HStack(alignment: .center, spacing: CGFloat(CSTerminalModel.lineGap())) {
              Text(prompt).foregroundStyle(pack.colorBrandOchre.color)
              Text(command).foregroundStyle(CSTerminalModel.fgColor.color)
            }
          }
          if let output = line.output {
            Text(output)
              .foregroundStyle(CSTerminalModel.mutedColor.color)
              .fixedSize(horizontal: false, vertical: true)
          }
        }
        HStack(alignment: .center, spacing: CGFloat(CSTerminalModel.lineGap())) {
          Text(prompt).foregroundStyle(pack.colorBrandOchre.color)
          TextField("", text: $draft)
            .textFieldStyle(.plain)
            .frame(maxWidth: .infinity)
            .focused($focused)
            .accessibilityLabel(inputName)
            .onSubmit(submit)
            .onChange(of: focused) { isFocused in
              if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
            }
        }
      }
      .font(.system(size: CGFloat(CSTerminalModel.bodyFontSize()), weight: .medium, design: .monospaced))
      .lineSpacing(CGFloat(CSTerminalModel.bodyFontSize() * (CSTerminalModel.bodyLineHeight() - 1)))
      .foregroundStyle(CSTerminalModel.fgColor.color)
      .padding(.vertical, CGFloat(CSTerminalModel.bodyPaddingY()))
      .padding(.horizontal, CGFloat(CSTerminalModel.bodyPaddingX()))
      .frame(maxWidth: .infinity, minHeight: CGFloat(CSTerminalModel.bodyMinHeight()), alignment: .topLeading)
      .background(CSTerminalModel.bgColor.color)
    }
    .frame(maxWidth: CGFloat(CSTerminalModel.maxWidth()), alignment: .leading)
    .background(CSTerminalModel.bgColor.color, in: RoundedRectangle(cornerRadius: pack.radiusLg.points))
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusLg.points))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusLg.points).stroke(CSTerminalModel.borderColor.color, lineWidth: CGFloat(CSTerminalModel.borderWidth())))
    .overlay(
      RoundedRectangle(cornerRadius: pack.radiusLg.points)
        .inset(by: -CGFloat(CSTerminalModel.focusRingWidth(focused: focused)) / 2)
        .stroke(focused ? pack.colorAccentOchre.color : .clear, lineWidth: CGFloat(CSTerminalModel.focusRingWidth(focused: focused)))
    )
    .overlay(
      RoundedRectangle(cornerRadius: pack.radiusLg.points)
        .inset(by: -(CGFloat(CSTerminalModel.focusOutlineOffset(focused: focused)) + CGFloat(CSTerminalModel.focusOutlineWidth(focused: focused)) / 2))
        .stroke(focused ? pack.primaryTextColor : .clear, lineWidth: CGFloat(CSTerminalModel.focusOutlineWidth(focused: focused)))
    )
    .shadow(color: shadow?.color.color ?? .clear, radius: shadow?.blur.points ?? 0, x: shadow?.offsetX.points ?? 0, y: shadow?.offsetY.points ?? 0)
  }
}

public struct CSInlineEdit: View {
  public let label: String
  public let value: String
  public let defaultValue: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let editAction: String
  public let emptyLabel: String
  public let language: String?
  let onChange: (String) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var editing = false
  @State private var draft = ""
  @State private var cancelling = false
  @State private var closed = false
  @State private var editFocusId = UUID().uuidString
  @State private var draftFocusId = UUID().uuidString
  @FocusState private var focused: Bool
  @FocusState private var editFocused: Bool
  public init(label: String = "", value: String = "", defaultValue: String = "", dark: Bool, highContrast: Bool, compact: Bool, editAction: String = "", emptyLabel: String = "", language: String? = nil, onChange: @escaping (String) -> Void = { _ in }) {
    self.label = label
    self.value = value.isEmpty ? defaultValue : value
    self.defaultValue = defaultValue
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.editAction = editAction
    self.emptyLabel = emptyLabel
    self.language = language
    self.onChange = onChange
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let edit = editAction.isEmpty ? CSInlineEditModel.copy("edit", language: locale) : editAction
    let empty = emptyLabel.isEmpty ? CSInlineEditModel.copy("empty", language: locale) : emptyLabel
    let shown = CSInlineEditModel.text(value, empty: empty)
    let button = CSInlineEditModel.editLabel(action: edit, label: label)
    let field = CSInlineEditModel.fieldName(label: label, edit: edit)
    Group {
      if editing {
        TextField("", text: Binding(get: { draft }, set: { next in
          CSFocusRegistry.shared.claim(id: draftFocusId, restore: { focused = true })
          draft = next
        }), onCommit: { finish() })
          .accessibilityLabel(field)
          .focused($focused)
          .onAppear { focused = true }
          .onChange(of: focused) { isFocused in
            if isFocused { CSFocusRegistry.shared.claim(id: draftFocusId, restore: { focused = true }) }
            if !isFocused { finish() }
          }
          .onExitCommand {
            cancelling = true
            draft = value
            finish()
          }
      } else {
        Button {
          claimEdit()
          closed = false
          cancelling = false
          draft = value
          editing = true
        } label: {
          HStack(spacing: CGFloat(CSControlsWaveStyleModel.inlineEditGap())) {
            Text(shown).accessibilityHidden(true)
            if CSInlineEditModel.showsPen(editing) {
              Canvas { context, size in
                let source = CSIconPaths.path(data: CSInlineEditModel.pen)
                let scale = min(size.width, size.height) / 24
                context.stroke(source.applying(CGAffineTransform(scaleX: scale, y: scale)), with: .color(pack.primaryTextColor), style: StrokeStyle(lineWidth: 1.9, lineCap: .round, lineJoin: .round))
              }
              .frame(width: 13, height: 13)
              .accessibilityHidden(true)
            }
          }
          .padding(.vertical, CGFloat(CSControlsWaveStyleModel.inlineEditPaddingY()))
          .padding(.horizontal, CGFloat(CSControlsWaveStyleModel.inlineEditPaddingX()))
        }
        .focused($editFocused)
        .onChange(of: editFocused) { isFocused in if isFocused { claimEdit() } }
        .accessibilityLabel(button)
        .frame(minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
      }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: editFocusId) }
  }

  private func claimEdit() {
    CSFocusRegistry.shared.claim(id: editFocusId, restore: { editFocused = true })
  }

  private func finish() {
    if closed { return }
    claimEdit()
    closed = true
    let next = CSInlineEditModel.commit(draft: draft, value: value, cancelling: cancelling)
    cancelling = false
    editing = false
    if let next { onChange(next) }
  }
}

public struct CSFormField<Content: View>: View {
  public let label: String
  public let name: String?
  public let valueProp: String
  public let hint: String?
  public let error: String?
  public let required: Bool
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let content: () -> Content
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String, name: String? = nil, valueProp: String = CSFormFieldModel.defaultValueProp, hint: String? = nil, error: String? = nil, required: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.name = name
    self.valueProp = valueProp
    self.hint = hint
    self.error = error
    self.required = required
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.content = content
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    VStack(alignment: .leading, spacing: CGFloat(CSControlsBatchStyleModel.formFieldGap())) {
      HStack(spacing: 4) {
        if CSFormFieldModel.showsLabel(label) {
          Text(label)
            .font(.system(size: CGFloat(CSControlsBatchStyleModel.formFieldLabelFontSize()), weight: .bold))
            .foregroundStyle(pack.primaryTextColor)
        }
        if required {
          Text("*").foregroundStyle(pack.primaryTextColor).accessibilityLabel(CSFormFieldModel.copy("required", language: locale))
        }
      }
      content()
      if CSFormFieldModel.isAlert(error), let error {
        Text(error).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      } else if CSFormFieldModel.showsHint(hint), let hint {
        Text(hint).foregroundStyle(pack.mutedColor)
      }
    }
  }
}

public struct CSForm<Content: View>: View {
  let content: () -> Content
  public init(@ViewBuilder content: @escaping () -> Content) { self.content = content }
  public var body: some View { VStack(alignment: .leading, spacing: CGFloat(CSControlsBatchStyleModel.formFieldGap() * 2)) { content() }.environment(\.csFormAncestor, true) }
}

public struct CSFieldset<Content: View>: View {
  public let legend: String?
  public let disabled: Bool
  let content: () -> Content
  public init(legend: String? = nil, disabled: Bool = false, @ViewBuilder content: @escaping () -> Content) {
    self.legend = legend
    self.disabled = disabled
    self.content = content
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: CGFloat(CSFormsStyleModel.radioGroupLegendMarginBottom())) {
      if let legend, !legend.isEmpty { Text(legend).accessibilityAddTraits(.isHeader) }
      content()
    }
    .disabled(disabled)
    .environment(\.csFormAncestor, true)
    .accessibilityElement(children: .contain)
  }
}

public enum CSFormArrayModel {
  public static let defaultMin = 0
  public static let defaultMax = 50
  public static let rootClass = "cs-form-array"
  public static let rowsClass = "cs-form-array__rows"
  public static let rowClass = "cs-form-array__row"
  public static func fieldPath(name: String, index: Int, field: String) -> String {
    "\(name).\(index).\(field)"
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["addRow": "Thêm dòng", "arrayContext": "FormFieldArray phải được đặt bên trong Form"],
      "en": ["addRow": "Add row", "arrayContext": "FormFieldArray must be used inside Form"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func addLabel(_ text: String?, fallback: String) -> String {
    if let text, !text.isEmpty { return text }
    return fallback
  }
  public static func showsLabel(_ label: String?) -> Bool { label?.isEmpty == false }
  public static func canAdd(count: Int, max: Int) -> Bool { count < max }
  public static func canRemove(count: Int, min: Int) -> Bool { count > min }
  public static func showsContext(_ inForm: Bool) -> Bool { !inForm }
  public static func isAlert(_ inForm: Bool) -> Bool { showsContext(inForm) }
}

public struct CSFormFieldArray: View {
  public let name: String
  public let label: String?
  public let rows: [String]
  public let addLabel: String?
  public let removeLabel: String
  public let min: Int
  public let max: Int
  public let language: String?
  let onChange: ([String]) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @Environment(\.csFormAncestor) private var inForm

  public init(name: String = "", label: String? = nil, rows: [String] = [], addLabel: String? = nil, removeLabel: String = "", min: Int = CSFormArrayModel.defaultMin, max: Int = CSFormArrayModel.defaultMax, language: String? = nil, onChange: @escaping ([String]) -> Void = { _ in }) {
    self.name = name
    self.label = label
    self.rows = rows
    self.addLabel = addLabel
    self.removeLabel = removeLabel
    self.min = min
    self.max = max
    self.language = language
    self.onChange = onChange
  }

  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let add = CSFormArrayModel.addLabel(addLabel, fallback: CSFormArrayModel.copy("addRow", language: locale))
    if CSFormArrayModel.isAlert(inForm) {
      Text(CSFormArrayModel.copy("arrayContext", language: locale)).accessibilityAddTraits(.updatesFrequently)
    } else {
      VStack(alignment: .leading, spacing: CGFloat(CSControlsBatchStyleModel.formFieldGap())) {
        if CSFormArrayModel.showsLabel(label), let label { Text(label) }
        ForEach(Array(rows.enumerated()), id: \.offset) { index, row in
          HStack {
            Text(row)
            Button {
              guard CSFormArrayModel.canRemove(count: rows.count, min: min) else { return }
              var next = rows
              next.remove(at: index)
              onChange(next)
            } label: {
              Text(removeLabel).frame(minWidth: 44, minHeight: 44)
            }
            .disabled(!CSFormArrayModel.canRemove(count: rows.count, min: min))
          }
        }
        Button {
          guard CSFormArrayModel.canAdd(count: rows.count, max: max) else { return }
          onChange(rows + [""])
        } label: {
          Text(add).frame(minHeight: 44)
        }
        .disabled(!CSFormArrayModel.canAdd(count: rows.count, max: max))
      }
    }
  }
}

public enum CSFormWizardModel {
  public static let rootClass = "cs-form-wizard"
  public static let stepsClass = "cs-form-wizard__steps"
  public static let bodyClass = "cs-form-wizard__body"
  public static let navClass = "cs-form-wizard__nav"
  public static func stepCurrent(index: Int, active: Int) -> String? { index == active ? "step" : nil }
  public static func isBusy(_ pending: Bool) -> Bool? { pending ? true : nil }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["back": "Quay lại", "next": "Tiếp", "finish": "Hoàn tất", "step": "Bước", "summary": "Vui lòng sửa các mục sau:", "requiredField": "Vui lòng nhập giá trị"],
      "en": ["back": "Back", "next": "Next", "finish": "Finish", "step": "Step", "summary": "Please fix the following:", "requiredField": "Enter a value"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func button(_ text: String?, fallback: String) -> String {
    if let text, !text.isEmpty { return text }
    return fallback
  }
  public static func stepTitle(_ title: String, index: Int, fallback: String) -> String {
    let name = title.isEmpty ? "\(fallback) \(index + 1)" : title
    return "\(index + 1). \(name)"
  }
  public static func canBack(index: Int, pending: Bool) -> Bool { index > 0 && !pending }
  public static func isLast(index: Int, count: Int) -> Bool { count > 0 && index >= count - 1 }
  public static func showsSummary(errors: [String], submission: String?) -> Bool {
    if !errors.isEmpty { return true }
    guard let submission else { return false }
    return !submission.isEmpty
  }
  public static func isAlert(errors: [String], submission: String?) -> Bool { showsSummary(errors: errors, submission: submission) }
  public static func requiredMessage(_ value: String?, fallback: String) -> String? {
    let trimmed = value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    return trimmed.isEmpty ? fallback : nil
  }
  public static func customMessage(_ message: String?) -> String? {
    guard let message, !message.isEmpty else { return nil }
    return message
  }
  public static func advance(index: Int, count: Int, pending: Bool, values: [String: String], required: [String], fallback: String, custom: [(name: String, check: (String?, [String: String]) -> String?)] = []) -> CSWizardAdvance? {
    if pending { return nil }
    var messages: [String] = []
    var failed = Set<String>()
    for name in required {
      if let message = requiredMessage(values[name], fallback: fallback) {
        messages.append(message)
        failed.insert(name)
      }
    }
    for rule in custom where !failed.contains(rule.name) {
      if let message = customMessage(rule.check(values[rule.name], values)) { messages.append(message) }
    }
    if !messages.isEmpty { return CSWizardAdvance(index: index, errors: messages, completed: false) }
    if isLast(index: index, count: count) { return CSWizardAdvance(index: index, errors: [], completed: true) }
    return CSWizardAdvance(index: index + 1, errors: [], completed: false)
  }
}

public struct CSWizardAdvance: Equatable {
  public var index: Int
  public var errors: [String]
  public var completed: Bool
  public init(index: Int, errors: [String], completed: Bool) {
    self.index = index
    self.errors = errors
    self.completed = completed
  }
}

public struct CSFormWizard: View {
  public let steps: [String]
  public let index: Int
  public let backLabel: String?
  public let nextLabel: String?
  public let finishLabel: String?
  public let errors: [String]
  public let values: [String: String]
  public let required: [String]
  public let custom: [(name: String, check: (String?, [String: String]) -> String?)]
  public let submission: String?
  public let pending: Bool
  public let language: String?
  let onIndex: (Int) -> Void
  let onComplete: () -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var ruled: [String]?

  public init(steps: [String] = [], index: Int = 0, backLabel: String? = nil, nextLabel: String? = nil, finishLabel: String? = nil, errors: [String] = [], values: [String: String] = [:], required: [String] = [], custom: [(name: String, check: (String?, [String: String]) -> String?)] = [], submission: String? = nil, pending: Bool = false, language: String? = nil, onIndex: @escaping (Int) -> Void = { _ in }, onComplete: @escaping () -> Void = {}) {
    self.steps = steps
    self.index = steps.isEmpty ? 0 : min(steps.count - 1, max(0, index))
    self.backLabel = backLabel
    self.nextLabel = nextLabel
    self.finishLabel = finishLabel
    self.errors = errors
    self.values = values
    self.required = required
    self.custom = custom
    self.submission = submission
    self.pending = pending
    self.language = language
    self.onIndex = onIndex
    self.onComplete = onComplete
  }

  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let back = CSFormWizardModel.button(backLabel, fallback: CSFormWizardModel.copy("back", language: locale))
    let next = CSFormWizardModel.button(nextLabel, fallback: CSFormWizardModel.copy("next", language: locale))
    let finish = CSFormWizardModel.button(finishLabel, fallback: CSFormWizardModel.copy("finish", language: locale))
    let last = CSFormWizardModel.isLast(index: index, count: steps.count)
    let liveErrors = ruled ?? errors
    VStack(alignment: .leading, spacing: CGFloat(CSControlsBatchStyleModel.formFieldGap())) {
      ForEach(Array(steps.enumerated()), id: \.offset) { offset, title in
        Text(CSFormWizardModel.stepTitle(title, index: offset, fallback: CSFormWizardModel.copy("step", language: locale)))
          .accessibilityAddTraits(offset == index ? .isSelected : [])
          .accessibilityValue(offset == index ? "step" : "")
      }
      if CSFormWizardModel.isAlert(errors: liveErrors, submission: submission) {
        VStack(alignment: .leading) {
          Text(CSFormWizardModel.copy("summary", language: locale)).fontWeight(.bold)
          if let submission, !submission.isEmpty { Text(submission) }
          ForEach(liveErrors, id: \.self) { Text($0) }
        }
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.updatesFrequently)
      }
      if !steps.isEmpty {
        HStack {
          Button {
            guard CSFormWizardModel.canBack(index: index, pending: pending) else { return }
            ruled = []
            onIndex(index - 1)
          } label: {
            Text(back).frame(minHeight: 44)
          }
          .disabled(!CSFormWizardModel.canBack(index: index, pending: pending))
          Button {
            let fallback = CSFormWizardModel.copy("requiredField", language: locale)
            guard let step = CSFormWizardModel.advance(index: index, count: steps.count, pending: pending, values: values, required: required, fallback: fallback, custom: custom) else { return }
            ruled = step.errors
            if !step.errors.isEmpty { return }
            if step.completed { onComplete() } else { onIndex(step.index) }
          } label: {
            Text(last ? finish : next).frame(minHeight: 44)
          }
          .disabled(pending)
        }
      }
    }
    .opacity(pending ? CSControlsBatchStyleModel.formPendingOpacity : 1.0)
    .accessibilityValue(pending ? "true" : "")
  }
}

public struct CSCascaderNode: Equatable {
  public var key: String
  public var label: String
  public var children: [CSCascaderNode]
  public init(key: String, label: String, children: [CSCascaderNode] = []) {
    self.key = key
    self.label = label
    self.children = children
  }
}

public struct CSCascaderPlace: Equatable {
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

public enum CSCascaderModel {
  public static let placementDefault = "bottom-start"
  public static func resolvedPlacement(_ explicit: String?) -> String { explicit ?? placementDefault }
  public static func isOpen(requested: Bool, disabled: Bool) -> Bool { requested && !disabled }
  public static func dismissOutside(open: Bool, inside: Bool) -> Bool { open && !inside }
  public static let panelGap = 6.0
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String = placementDefault) -> CSCascaderPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: resolvedPlacement(placement), gap: panelGap) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: panelGap) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSCascaderPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }

  public static func columns(_ nodes: [CSCascaderNode], path: [String]) -> [[CSCascaderNode]] {
    var level = nodes
    var columns: [[CSCascaderNode]] = []
    var depth = 0
    while !level.isEmpty {
      columns.append(level)
      let key = depth < path.count ? path[depth] : nil
      level = level.first { $0.key == key }?.children ?? []
      depth += 1
    }
    return columns
  }

  public static func labels(_ nodes: [CSCascaderNode], value: [String]) -> [String] {
    var level = nodes
    var labels: [String] = []
    for key in value {
      guard let node = level.first(where: { $0.key == key }) else { break }
      labels.append(node.label)
      level = node.children
    }
    return labels
  }

  public static func select(path: [String], depth: Int, key: String, hasChildren: Bool) -> (path: [String], commit: Bool) {
    (Array(path.prefix(depth)) + [key], !hasChildren)
  }

  public static func move(index: Int, count: Int, key: CSRovingKey) -> Int? {
    guard count > 0 else { return nil }
    if key == .down { return index < 0 ? 0 : min(count - 1, index + 1) }
    if key == .up { return index < 0 ? count - 1 : max(0, index - 1) }
    if key == .home { return 0 }
    if key == .end { return count - 1 }
    return nil
  }

  public static func arrowLeft(path: [String], depth: Int) -> (path: [String], close: Bool) {
    if path.isEmpty { return (path, true) }
    let parentDepth = depth > 0 ? depth - 1 : max(0, path.count - 1)
    return (Array(path.prefix(parentDepth)), false)
  }

  public static func slot(columns: [[CSCascaderNode]], depth: Int, offset: Int) -> Int {
    columns.prefix(depth).reduce(offset) { $0 + $1.count }
  }

  public static func locate(index: Int, columns: [[CSCascaderNode]]) -> (depth: Int, node: CSCascaderNode)? {
    var seen = 0
    for (depth, column) in columns.enumerated() {
      if index >= seen && index < seen + column.count { return (depth, column[index - seen]) }
      seen += column.count
    }
    return nil
  }

  public static func index(columns: [[CSCascaderNode]], depth: Int, key: String) -> Int? {
    guard columns.indices.contains(depth), let offset = columns[depth].firstIndex(where: { $0.key == key }) else { return nil }
    return slot(columns: columns, depth: depth, offset: offset)
  }

  public struct CSCascaderPress: Equatable {
    public var index: Int
    public var path: [String]
    public var commit: Bool
    public var close: Bool
    public init(index: Int, path: [String], commit: Bool, close: Bool) {
      self.index = index
      self.path = path
      self.commit = commit
      self.close = close
    }
  }

  public static func press(key: CSRovingKey, index: Int, columns: [[CSCascaderNode]], path: [String]) -> CSCascaderPress? {
    switch key {
    case .down, .up, .home, .end:
      let total = columns.reduce(0) { $0 + $1.count }
      guard let next = move(index: index, count: total, key: key) else { return nil }
      return CSCascaderPress(index: next, path: path, commit: false, close: false)
    case .right:
      guard let place = locate(index: index, columns: columns) else { return nil }
      let next = select(path: path, depth: place.depth, key: place.node.key, hasChildren: !place.node.children.isEmpty)
      return CSCascaderPress(index: index, path: next.path, commit: next.commit, close: next.commit)
    case .left:
      let depth = locate(index: index, columns: columns)?.depth ?? -1
      let back = arrowLeft(path: path, depth: depth)
      if back.close { return CSCascaderPress(index: index, path: path, commit: false, close: true) }
      let parentDepth = depth > 0 ? depth - 1 : max(0, path.count - 1)
      let parentKey = parentDepth < path.count ? path[parentDepth] : nil
      let nextIndex = parentKey.flatMap { self.index(columns: columns, depth: parentDepth, key: $0) } ?? index
      return CSCascaderPress(index: nextIndex, path: back.path, commit: false, close: false)
    default:
      return nil
    }
  }

  public static func text(label: String, path: [String], nodes: [CSCascaderNode]) -> String {
    let names = labels(nodes, value: path)
    if !names.isEmpty { return names.joined(separator: " / ") }
    if path.isEmpty { return label }
    return path.joined(separator: " / ")
  }

  public static let placeholderDefault = "Select…"
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Chọn…"],
      "en": ["placeholder": placeholderDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func face(labels: [String], placeholder: String) -> String {
    labels.isEmpty ? placeholder : labels.joined(separator: " / ")
  }
  public static func fieldName(label: String?, labelledBy: String?) -> String? {
    if let labelledBy, !labelledBy.isEmpty { return nil }
    return label
  }
  public static let rootClass = "cs-cascader"
  public static let fieldClass = "cs-treeselect__field"
  public static let popClass = "cs-cascader__pop"
  public static let colClass = "cs-cascader__col"
  public static let triggerHasPopup = "listbox"
  public static let listboxRole = "listbox"
  public static let optionRole = "option"
  public static let chevronGlyph = "▾"
  public static let childGlyph = " ›"
  public static func optionClass(selected: Bool) -> String {
    selected ? "cs-cascader__opt on" : "cs-cascader__opt"
  }
  public static func opensFromTriggerKey(_ key: String, open: Bool) -> Bool {
    !open && (key == "ArrowDown" || key == "Enter" || key == " ")
  }
  public static func descriptionId(_ id: String, description: String?) -> String? {
    guard let description, !description.isEmpty else { return nil }
    return "\(id)-description"
  }
  public static func errorId(_ id: String, error: String?) -> String? {
    guard let error, !error.isEmpty else { return nil }
    return "\(id)-error"
  }
  public static func describedBy(explicit: String?, descriptionId: String?, errorId: String?) -> String? {
    let parts = [explicit, descriptionId, errorId].compactMap { $0 }.filter { !$0.isEmpty }
    return parts.isEmpty ? nil : parts.joined(separator: " ")
  }
  public static func invalid(error: String?) -> Bool {
    guard let error else { return false }
    return !error.isEmpty
  }
}

public struct CSCascader: View {
  public let label: String?
  public let labelledBy: String?
  public let description: String?
  public let error: String?
  public let required: Bool
  public let ariaDescribedBy: String?
  public let path: [String]
  public let nodes: [CSCascaderNode]
  public let placeholder: String?
  public let disabled: Bool
  public let portal: Bool
  public let placement: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: ([String]) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var requested = false
  @State private var draft: [String]
  @State private var highlight = -1
  @State private var keysArmed = false
  @FocusState private var fieldFocused: Bool
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0

  public init(label: String? = nil, labelledBy: String? = nil, description: String? = nil, error: String? = nil, required: Bool = false, ariaDescribedBy: String? = nil, path: [String] = [], nodes: [CSCascaderNode] = [], placeholder: String? = nil, disabled: Bool = false, portal: Bool = true, placement: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping ([String]) -> Void = { _ in }) {
    self.label = label
    self.labelledBy = labelledBy
    self.description = description
    self.error = error
    self.required = required
    self.ariaDescribedBy = ariaDescribedBy
    self.path = path
    self.nodes = nodes
    self.placeholder = placeholder
    self.disabled = disabled
    self.portal = portal
    self.placement = placement
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onChange = onChange
    _draft = State(initialValue: path)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSCascaderModel.placeholder(placeholder, fallback: CSCascaderModel.copy("placeholder", language: locale))
    let shown = CSCascaderModel.face(labels: CSCascaderModel.labels(nodes, value: path), placeholder: hint)
    let opened = CSCascaderModel.isOpen(requested: requested, disabled: disabled)
    let name = CSCascaderModel.fieldName(label: label, labelledBy: labelledBy)
    let columns = CSCascaderModel.columns(nodes, path: draft)
    VStack(alignment: .leading) {
      Group {
        if let name {
          Button { if !disabled { requested.toggle() } } label: {
            HStack { Text(shown).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true); Text("▾").accessibilityHidden(true) }
          }
          .accessibilityLabel(name)
        } else {
          Button { if !disabled { requested.toggle() } } label: {
            HStack { Text(shown).foregroundStyle(pack.primaryTextColor); Text("▾").accessibilityHidden(true) }
          }
        }
      }
      .disabled(disabled)
      .frame(minWidth: CGFloat(CSControlsBatchStyleModel.treeSelectMinWidth()), alignment: .leading)
      .accessibilityValue(opened ? "true" : "false")
      .frame(minHeight: 44, alignment: .leading)
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSCascaderAnchorKey.self, value: geo.frame(in: .global))
      })
      if let description, !description.isEmpty {
        Text(description).foregroundStyle(pack.mutedColor)
      }
      if let error, !error.isEmpty {
        Text(error).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
      if opened {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSCascaderModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: CSCascaderModel.resolvedPlacement(placement))
          }
        }
        HStack(alignment: .top, spacing: 12) {
          ForEach(Array(columns.enumerated()), id: \.offset) { depth, column in
            VStack(alignment: .leading, spacing: 0) {
              ForEach(Array(column.enumerated()), id: \.element.key) { offset, node in
                let slot = CSCascaderModel.slot(columns: columns, depth: depth, offset: offset)
                Button {
                  let next = CSCascaderModel.select(path: draft, depth: depth, key: node.key, hasChildren: !node.children.isEmpty)
                  highlight = slot
                  draft = next.path
                  if next.commit {
                    onChange(next.path)
                    requested = false
                    highlight = -1
                  }
                } label: {
                  HStack {
                    Text(node.label).foregroundStyle(slot == highlight ? pack.colorBrandOchre.color : pack.primaryTextColor)
                    if !node.children.isEmpty { Text("›").accessibilityHidden(true) }
                  }
                }
                .frame(minHeight: 44, alignment: .leading)
                .accessibilityAddTraits(depth < draft.count && draft[depth] == node.key ? .isSelected : [])
              }
            }
            .frame(minWidth: CGFloat(CSControlsBatchStyleModel.cascaderColumnMinWidth()), maxHeight: CGFloat(CSControlsBatchStyleModel.cascaderColumnMaxHeight()), alignment: .topLeading)
          }
        }
        .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSCascaderPanelKey.self, value: CSCascaderMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? 0))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
        .onExitCommand { requested = false; highlight = -1 }
      }
    }
    .focusable()
    .focused($fieldFocused)
    .onChange(of: fieldFocused) { isFocused in if isFocused { keysArmed = true } }
    .csRovingKeys { key, _ in onCascaderKey(key) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: fieldFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      onCascaderKey(key)
    })
    .background(GeometryReader { _ in
      CSInlineOutside(active: opened) {
        if CSCascaderModel.dismissOutside(open: true, inside: false) {
          requested = false
          highlight = -1
        }
      }
    })
    .onPreferenceChange(CSCascaderAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSCascaderPanelKey.self) { measure in
      guard opened, measure.size.width > 0, measure.size.height > 0 else { return }
      panelOrigin = measure.origin
      panelScale = measure.scale
      if naturalSize == nil {
        naturalSize = measure.size
        measurePass = 1
      } else if measure.pass >= 1 {
        fittedSize = measure.size
      }
    }
    .onChange(of: requested) { isRequested in
      if !isRequested {
        naturalSize = nil
        fittedSize = nil
        panelOrigin = nil
        panelScale = CGSize(width: 1, height: 1)
        measurePass = 0
      }
    }
    .onChange(of: path) { next in draft = next; highlight = -1 }
    .onChange(of: disabled) { isDisabled in
      if isDisabled { requested = false; highlight = -1 }
    }
  }

  private func onCascaderKey(_ key: CSRovingKey) -> Bool {
    let opened = CSCascaderModel.isOpen(requested: requested, disabled: disabled)
    if !opened {
      guard key == .down, !disabled else { return false }
      requested = true
      highlight = -1
      return true
    }
    let columns = CSCascaderModel.columns(nodes, path: draft)
    guard let next = CSCascaderModel.press(key: key, index: highlight, columns: columns, path: draft) else { return false }
    highlight = next.index
    draft = next.path
    if next.commit { onChange(next.path) }
    if next.close {
      requested = false
      highlight = -1
    }
    return true
  }
}

private struct CSCascaderMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSCascaderAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSCascaderPanelKey: PreferenceKey {
  static var defaultValue = CSCascaderMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSCascaderMeasure, nextValue: () -> CSCascaderMeasure) { value = nextValue() }
}

struct CSInlineOutside: View {
  var active: Bool
  var onOutside: () -> Void
  var body: some View {
    #if os(macOS)
    CSInlineMacOutside(active: active, onOutside: onOutside)
    #elseif os(iOS)
    CSInlinePadOutside(active: active, onOutside: onOutside)
    #else
    Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
    #endif
  }
}

#if os(macOS)
private struct CSInlineMacOutside: NSViewRepresentable {
  var active: Bool
  var onOutside: () -> Void
  func makeCoordinator() -> Coordinator { Coordinator() }
  func makeNSView(context: Context) -> NSView {
    let view = NSView()
    context.coordinator.view = view
    context.coordinator.install(active: active, onOutside: onOutside)
    return view
  }
  func updateNSView(_ nsView: NSView, context: Context) {
    context.coordinator.view = nsView
    context.coordinator.install(active: active, onOutside: onOutside)
  }
  static func dismantleNSView(_ nsView: NSView, coordinator: Coordinator) { coordinator.remove() }
  final class Coordinator {
    weak var view: NSView?
    var monitor: Any?
    var onOutside: (() -> Void)?
    func install(active: Bool, onOutside: @escaping () -> Void) {
      self.onOutside = onOutside
      guard active else { remove(); return }
      guard monitor == nil else { return }
      monitor = NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] event in
        guard let self, let view = self.view, view.bounds.width > 0, view.bounds.height > 0 else { return event }
        let local = view.convert(event.locationInWindow, from: nil)
        if !view.bounds.contains(local) { self.onOutside?() }
        return event
      }
    }
    func remove() {
      if let monitor { NSEvent.removeMonitor(monitor) }
      monitor = nil
    }
  }
}
#elseif os(iOS)
private struct CSInlinePadOutside: UIViewRepresentable {
  var active: Bool
  var onOutside: () -> Void
  func makeUIView(context: Context) -> CSInlinePadOutsideView {
    let view = CSInlinePadOutsideView()
    view.onOutside = onOutside
    view.active = active
    return view
  }
  func updateUIView(_ uiView: CSInlinePadOutsideView, context: Context) {
    uiView.onOutside = onOutside
    uiView.active = active
    uiView.sync()
  }
  static func dismantleUIView(_ uiView: CSInlinePadOutsideView, coordinator: ()) { uiView.uninstall() }
}
private final class CSInlinePadOutsideView: UIView {
  var onOutside: (() -> Void)?
  var active = false
  private var recognizer: UITapGestureRecognizer?
  override func didMoveToWindow() {
    super.didMoveToWindow()
    sync()
  }
  func sync() {
    uninstall()
    guard active, let window else { return }
    let tap = UITapGestureRecognizer(target: self, action: #selector(tapped))
    tap.cancelsTouchesInView = false
    window.addGestureRecognizer(tap)
    recognizer = tap
  }
  func uninstall() {
    if let recognizer { recognizer.view?.removeGestureRecognizer(recognizer) }
    recognizer = nil
  }
  @objc func tapped(_ tap: UITapGestureRecognizer) {
    guard bounds.width > 0, bounds.height > 0 else { return }
    let point = tap.location(in: self)
    if !bounds.contains(point) { onOutside?() }
  }
}
#endif

public enum CSDockModel {
  public static let toolbarRole = "toolbar"
  public static let rootClass = "cs-dock"
  public static func itemClass(active: Bool) -> String { active ? "cs-dock__item on" : "cs-dock__item" }
  public static func isActive(_ item: String, activeItems: Set<String> = []) -> Bool { activeItems.contains(item) }
  public static func scale(index: Int, hover: Int?) -> (scale: Double, lift: Double) {
    let distance = hover == nil ? 3 : abs(index - (hover ?? index))
    if distance == 0 { return (1.35, -6) }
    if distance == 1 { return (1.15, -2) }
    return (1, 0)
  }
}

public struct CSDock: View {
  public let label: String
  public let items: [String]
  public let activeItems: Set<String>
  let onSelect: (String) -> Void
  @State private var hover: Int? = nil
  @State private var dockId = UUID().uuidString
  @FocusState private var focused: Int?
  public init(label: String = "", items: [String] = [], activeItems: Set<String> = [], onSelect: @escaping (String) -> Void = { _ in }) {
    self.label = label
    self.items = items
    self.activeItems = activeItems
    self.onSelect = onSelect
  }
  public var body: some View {
    HStack(spacing: CGFloat(CSControlsBatchStyleModel.dockGap())) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        let mark = CSDockModel.scale(index: index, hover: hover)
        Button(item) {
          CSFocusRegistry.shared.claim(id: "\(dockId)-\(index)", restore: { focused = index })
          onSelect(item)
        }
          .frame(minWidth: CGFloat(CSControlsBatchStyleModel.dockItemSize()), minHeight: CGFloat(CSControlsBatchStyleModel.dockItemSize()))
          .scaleEffect(mark.scale)
          .offset(y: mark.lift)
          .focused($focused, equals: index)
          .onHover { inside in if inside { hover = index } }
          .accessibilityAddTraits(CSDockModel.isActive(item, activeItems: activeItems) ? .isSelected : [])
      }
    }
    .padding(CGFloat(CSControlsBatchStyleModel.dockGap()))
    .clipShape(RoundedRectangle(cornerRadius: CGFloat(CSControlsBatchStyleModel.dockRadius())))
    .onHover { inside in if !inside { hover = nil } }
    .onChange(of: focused) { index in
      hover = index
      if let index { CSFocusRegistry.shared.claim(id: "\(dockId)-\(index)", restore: { focused = index }) }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(label)
  }
}

public enum CSEditorMark: Equatable {
  case off, on, mixed
}

public enum CSEditorModel {
  public static let rootClass = "cs-editor"
  public static let barClass = "cs-editor__bar"
  public static let buttonClass = "cs-toolbar__btn"
  public static let areaClass = "cs-editor__area"
  public static let toolbarRole = "toolbar"
  public static let areaRole = "textbox"
  public static let areaMultiline = true
  public static let defaultMinHeight = 120.0
  public static func initialHtml(defaultValue: String = "", unsafeHtml: String? = nil) -> String {
    if let unsafeHtml { return unsafeHtml }
    return escape(defaultValue)
  }
  public static func borderWidth() -> Double { 1 }
  public static func maxWidth() -> Double { 460 }
  public static func barGap() -> Double { 2 }
  public static func barPadding() -> Double { 6 }
  public static func barBorderWidth() -> Double { 1 }
  public static func areaPaddingY() -> Double { 12 }
  public static func areaPaddingX() -> Double { 14 }
  public static func areaFontSize() -> Double { 14 }
  public static func areaLineHeight() -> Double { 1.6 }
  public static func areaMinHeight(_ value: Double = 120) -> Double { value }
  public static func areaOutlineWidth(focused: Bool) -> Double { focused ? 2 : 0 }
  public static func areaRingWidth(focused: Bool) -> Double { focused ? 5 : 0 }

  public static func escape(_ text: String) -> String {
    text.replacingOccurrences(of: "&", with: "&amp;")
      .replacingOccurrences(of: "<", with: "&lt;")
      .replacingOccurrences(of: ">", with: "&gt;")
  }

  public static func plainInsert(_ text: String) -> String {
    escape(text).replacingOccurrences(of: "\r\n", with: "\n").replacingOccurrences(of: "\n", with: "<br>")
  }

  public static func mark(_ samples: [Bool], fallback: CSEditorMark) -> CSEditorMark {
    if samples.isEmpty { return fallback }
    if samples.allSatisfy({ $0 }) { return .on }
    if samples.contains(true) { return .mixed }
    return .off
  }

  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["toolbar": "Định dạng", "bold": "Đậm", "italic": "Nghiêng", "list": "Danh sách", "area": "Văn bản"],
      "en": ["toolbar": "Formatting", "bold": "Bold", "italic": "Italic", "list": "Bullet list", "area": "Rich text"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }

  public static func name(_ label: String?, fallback: String) -> String { label ?? fallback }

  public static func pressed(_ current: Bool) -> Bool { !current }
  public static func wrapped(_ html: String, open: String, close: String) -> Bool {
    html.hasPrefix(open) && html.hasSuffix(close) && html.count >= open.count + close.count
  }
  public static func span(start: Int, end: Int, length: Int) -> (start: Int, end: Int) {
    let lower = min(max(start, 0), length)
    let upper = min(max(end, lower), length)
    return (lower, upper)
  }
  public static func movedEnd(start: Int, end: Int, before: Int, after: Int) -> Int {
    start + (after - before + (end - start))
  }
  public static func remember(inside: Bool, start: Int, end: Int, previousStart: Int, previousEnd: Int, hadRange: Bool) -> (start: Int, end: Int, hadRange: Bool) {
    if inside { return (start, end, true) }
    return (previousStart, previousEnd, hadRange)
  }
  public static func restore(hadRange: Bool, start: Int, end: Int, contained: Bool, length: Int) -> (start: Int, end: Int) {
    if hadRange && contained { return span(start: start, end: end, length: length) }
    return (length, length)
  }
  public static func apply(_ html: String, command: String, start: Int, end: Int) -> String {
    let lower = min(max(start, 0), html.count)
    let upper = min(max(end, lower), html.count)
    guard upper > lower else { return html }
    let head = html.index(html.startIndex, offsetBy: lower)
    let tail = html.index(html.startIndex, offsetBy: upper)
    let selected = String(html[head..<tail])
    let changed: String
    switch command {
    case "bold":
      changed = toggle(selected, open: "<b>", close: "</b>")
    case "italic":
      changed = toggle(selected, open: "<i>", close: "</i>")
    case "insertUnorderedList":
      changed = list(selected)
    default:
      return html
    }
    return String(html[..<head]) + changed + String(html[tail...])
  }
  public static func toggle(_ text: String, open: String, close: String) -> String {
    guard wrapped(text, open: open, close: close) else { return open + text + close }
    let innerStart = text.index(text.startIndex, offsetBy: open.count)
    let innerEnd = text.index(text.endIndex, offsetBy: -close.count)
    return String(text[innerStart..<innerEnd])
  }
  public static func list(_ text: String) -> String {
    if wrapped(text, open: "<ul>", close: "</ul>") {
      let innerStart = text.index(text.startIndex, offsetBy: 4)
      let innerEnd = text.index(text.endIndex, offsetBy: -5)
      return String(text[innerStart..<innerEnd])
        .replacingOccurrences(of: "</li><li>", with: "<br>")
        .replacingOccurrences(of: "<li>", with: "")
        .replacingOccurrences(of: "</li>", with: "")
    }
    let lines = text.replacingOccurrences(of: "\n", with: "<br>").components(separatedBy: "<br>")
    return "<ul>" + lines.map { "<li>\($0)</li>" }.joined() + "</ul>"
  }
}

public struct CSEditor: View {
  public let label: String?
  public let defaultValue: String
  public let unsafeHtml: String?
  public let language: String?
  public let minHeight: Double
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Binding var text: String
  @Binding var selectionStart: Int
  @Binding var selectionEnd: Int
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @State private var bold = false
  @State private var italic = false
  @State private var list = false
  @State private var hadRange = false

  public init(label: String? = nil, defaultValue: String = "", unsafeHtml: String? = nil, text: Binding<String> = .constant(""), language: String? = nil, minHeight: Double = 120, selectionStart: Binding<Int> = .constant(0), selectionEnd: Binding<Int> = .constant(0), dark: Bool = false, highContrast: Bool = false, compact: Bool = false) {
    self.label = label
    self.defaultValue = defaultValue
    self.unsafeHtml = unsafeHtml
    self.language = language
    self.minHeight = minHeight
    _text = text
    _selectionStart = selectionStart
    _selectionEnd = selectionEnd
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  private func applyFormat(_ command: String) {
    let restored = CSEditorModel.restore(hadRange: hadRange, start: selectionStart, end: selectionEnd, contained: true, length: text.count)
    let span = CSEditorModel.span(start: restored.start, end: restored.end, length: text.count)
    let next = CSEditorModel.apply(text, command: command, start: span.start, end: span.end)
    if next != text {
      selectionStart = span.start
      selectionEnd = CSEditorModel.movedEnd(start: span.start, end: span.end, before: text.count, after: next.count)
    }
    switch command {
    case "bold":
      if next == text { bold = CSEditorModel.pressed(bold) } else { text = next; bold = CSEditorModel.wrapped(next, open: "<b>", close: "</b>") }
    case "italic":
      if next == text { italic = CSEditorModel.pressed(italic) } else { text = next; italic = CSEditorModel.wrapped(next, open: "<i>", close: "</i>") }
    default:
      if next == text { list = CSEditorModel.pressed(list) } else { text = next; list = CSEditorModel.wrapped(next, open: "<ul>", close: "</ul>") }
    }
  }

  private func formatButton(_ glyph: String, name: String, pressed: Bool, action: @escaping () -> Void) -> some View {
    Button(action: action) {
      Text(glyph).frame(minWidth: 44, minHeight: 44).accessibilityHidden(true)
    }
    .accessibilityLabel(name)
    .accessibilityValue(pressed ? "true" : "false")
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let spoken = CSEditorModel.name(label, fallback: CSEditorModel.copy("area", language: locale))
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: CGFloat(CSEditorModel.barGap())) {
        formatButton("B", name: CSEditorModel.copy("bold", language: locale), pressed: bold) { applyFormat("bold") }
        formatButton("I", name: CSEditorModel.copy("italic", language: locale), pressed: italic) { applyFormat("italic") }
        formatButton("≔", name: CSEditorModel.copy("list", language: locale), pressed: list) { applyFormat("insertUnorderedList") }
      }
      .padding(CGFloat(CSEditorModel.barPadding()))
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(pack.colorSurfaceRaised.color)
      .overlay(alignment: .bottom) {
        Rectangle().fill(pack.colorBorderDefault.color).frame(height: CGFloat(CSEditorModel.barBorderWidth()))
      }
      .accessibilityElement(children: .contain)
      .accessibilityLabel(CSEditorModel.copy("toolbar", language: locale))
      TextField(spoken, text: Binding(get: { text }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        text = next
        let remembered = CSEditorModel.remember(inside: focused, start: next.count, end: next.count, previousStart: selectionStart, previousEnd: selectionEnd, hadRange: hadRange)
        selectionStart = remembered.start
        selectionEnd = remembered.end
        hadRange = remembered.hadRange
      }), axis: .vertical)
        .font(.system(size: CGFloat(CSEditorModel.areaFontSize())))
        .foregroundStyle(pack.primaryTextColor)
        .lineSpacing(CGFloat(CSEditorModel.areaFontSize() * (CSEditorModel.areaLineHeight() - 1)))
        .padding(.vertical, CGFloat(CSEditorModel.areaPaddingY()))
        .padding(.horizontal, CGFloat(CSEditorModel.areaPaddingX()))
        .frame(minHeight: CGFloat(CSEditorModel.areaMinHeight(minHeight)), alignment: .topLeading)
        .overlay {
          if focused {
            RoundedRectangle(cornerRadius: pack.radiusMd.points)
              .strokeBorder(pack.colorBrandOchre.color, lineWidth: CGFloat(CSEditorModel.areaRingWidth(focused: focused)))
              .overlay(
                RoundedRectangle(cornerRadius: pack.radiusMd.points)
                  .strokeBorder(pack.primaryTextColor, lineWidth: CGFloat(CSEditorModel.areaOutlineWidth(focused: focused)))
              )
          }
        }
        .lineLimit(6...12)
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
    }
    .frame(maxWidth: CGFloat(CSEditorModel.maxWidth()), alignment: .leading)
    .background(pack.colorSurfacePanel.color, in: RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(pack.colorBorderDefault.color, lineWidth: CGFloat(CSEditorModel.borderWidth())))
  }
}

public enum CSHoverCardModel {
  public static let placementDefault = "bottom-start"
  public static let gap = 8.0
  public static let defaultOpenDelay = 150
  public static let defaultCloseDelay = 200
  public static let rootClass = "cs-hovercard"
  public static let panelClass = "cs-hovercard__panel"
  public static let dialogRole = "dialog"
  public static func escapeClose() -> Bool { false }
  public static func placement(_ explicit: String?) -> String { explicit ?? placementDefault }
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String) -> CSHoverPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: placement, gap: gap) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: gap) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSHoverPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }
  public static func nextOpen(hovered: Bool, focused: Bool) -> Bool { hovered || focused }
  public static func delay(opening: Bool, openDelay: Int = 150, closeDelay: Int = 200) -> Int { opening ? openDelay : closeDelay }
  public static func syncAfterLeave(focused: Bool) -> Bool { !focused }
  public static func syncAfterBlur(hovered: Bool) -> Bool { !hovered }
}

public struct CSHoverPlace: Equatable {
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

public struct CSHoverCard<Content: View>: View {
  public let label: String
  public let ariaLabel: String?
  public let ariaLabelledBy: String?
  public let portal: Bool
  public let placement: String?
  public let openDelay: Int
  public let closeDelay: Int
  let content: () -> Content
  @State private var open = false
  @State private var hovered = false
  @State private var ticket = 0
  @FocusState private var focused: Bool
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0
  public init(label: String = "", ariaLabel: String? = nil, ariaLabelledBy: String? = nil, openDelay: Int = 150, closeDelay: Int = 200, portal: Bool = true, placement: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.ariaLabel = ariaLabel
    self.ariaLabelledBy = ariaLabelledBy
    self.portal = portal
    self.placement = placement
    self.openDelay = openDelay
    self.closeDelay = closeDelay
    self.content = content
  }
  public var body: some View {
    content()
      .onHover { inside in
        hovered = inside
        if inside || CSHoverCardModel.syncAfterLeave(focused: focused) { sync() }
      }
      .focused($focused)
      .onChange(of: focused) { isFocused in
        if isFocused || CSHoverCardModel.syncAfterBlur(hovered: hovered) { sync() }
      }
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSHoverAnchorKey.self, value: geo.frame(in: .global))
      })
      .overlay(alignment: .topLeading) {
        if open {
          let screen = CSContextMenuModel.screenSize()
          let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
          let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
          let place = CSHoverCardModel.placement(placement)
          let placed = naturalSize.flatMap { natural in
            fittedSize.flatMap { fitted in
              CSHoverCardModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: place)
            }
          }
          Text(label)
            .padding(.vertical, CGFloat(CSControlsWaveStyleModel.hoverCardPaddingY()))
            .padding(.horizontal, CGFloat(CSControlsWaveStyleModel.hoverCardPaddingX()))
            .frame(minWidth: CGFloat(CSControlsWaveStyleModel.hoverCardMinWidth()), maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
            .background(GeometryReader { geo in
              let frame = geo.frame(in: .global)
              let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
              let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
              Color.clear.preference(key: CSHoverPanelKey.self, value: CSHoverMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
            })
            .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? 0))
            .opacity(placed == nil ? 0 : 1)
            .accessibilityHidden(placed == nil)
        }
      }
      .accessibilityHint(label)
      .onExitCommand { dismiss() }
      .onPreferenceChange(CSHoverAnchorKey.self) { frame in
        if frame.width > 0, frame.height > 0 { anchor = frame }
      }
      .onPreferenceChange(CSHoverPanelKey.self) { measure in
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

  private func sync() {
    ticket += 1
    let current = ticket
    let next = CSHoverCardModel.nextOpen(hovered: hovered, focused: focused)
    let wait = CSHoverCardModel.delay(opening: next, openDelay: openDelay, closeDelay: closeDelay)
    Task { @MainActor in
      try? await Task.sleep(nanoseconds: UInt64(max(0, wait)) * 1_000_000)
      if current == ticket { open = next }
    }
  }

  private func dismiss() {
    ticket += 1
    open = false
  }
}

private struct CSHoverMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSHoverAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSHoverPanelKey: PreferenceKey {
  static var defaultValue = CSHoverMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSHoverMeasure, nextValue: () -> CSHoverMeasure) { value = nextValue() }
}

public enum CSPresenceValue: Equatable {
  case absent
  case zero
  case text(String)
  public var shown: Bool {
    switch self {
    case .absent: return false
    case .zero: return true
    case .text(let value): return !value.isEmpty
    }
  }
}

public enum CSNativeSelectModel {
  public static let placeholderDefault = "Select…"
  public static let chevronPath = "M6 9l6 6 6-6"
  public static let controlClass = "cs-field__control"
  public static let chevronClass = "cs-native-select__chevron"
  public static func chevronSize() -> Int { 16 }
  public static func chevronStrokeWidth() -> Double { 2 }
  public static func fieldClass(disabled: Bool, hasError: Bool) -> String {
    var parts = ["cs-field", "cs-native-select"]
    if disabled { parts.append("cs-field--disabled") }
    if hasError { parts.append("cs-field--error") }
    return parts.joined(separator: " ")
  }
  public static func wrapClass(size: String = "md") -> String {
    "cs-native-select__wrap cs-native-select__wrap--\(resolvedSize(size))"
  }
  public static func resolvedValue(selection: String, defaultValue: String = "") -> String {
    selection.isEmpty ? defaultValue : selection
  }
  public static func describedBy(explicit: String?, errorId: String?) -> String? {
    explicit ?? errorId
  }
  public static func resolvedSize(_ size: String = "md") -> String { size == "sm" || size == "lg" ? size : "md" }
  public static func showsPlaceholder(placeholder: String?, hasChildren: Bool) -> Bool { placeholder != nil || !hasChildren }
  public static func placeholderText(_ placeholder: String?, fallback: String) -> String { placeholder ?? fallback }
  public static func controlId(_ id: String?, generated: String) -> String { id ?? generated }
  public static func labelId(_ id: String, shown: Bool) -> String? { shown ? id + "-label" : nil }
  public static func errorId(_ id: String, shown: Bool) -> String? { shown ? id + "-err" : nil }
  public static func labelledBy(explicit: String?, hasAriaLabel: Bool, labelId: String?) -> String? {
    if let explicit { return explicit }
    return hasAriaLabel ? nil : labelId
  }
  public static func invalid(hasError: Bool, passed: Bool?) -> Bool? {
    hasError ? true : passed
  }
  public static func optionEnabled(optionDisabled: Bool, controlDisabled: Bool) -> Bool {
    !optionDisabled && !controlDisabled
  }
  public static func descriptionId(_ id: String, shown: Bool) -> String? { shown ? id + "-desc" : nil }
  public static func isAlert(_ error: String?) -> Bool {
    guard let error else { return false }
    return !error.isEmpty
  }
}

public struct CSNativeSelectOption: Hashable, ExpressibleByStringLiteral {
  public var value: String
  public var label: String
  public var disabled: Bool
  public init(value: String, label: String, disabled: Bool = false) {
    self.value = value
    self.label = label
    self.disabled = disabled
  }
  public init(stringLiteral value: String) {
    self.init(value: value, label: value)
  }
}

public enum CSHumanReviewModel {
  public static let regionDefault = "Human review gate"
  public static let riskDefault = "review required"
  public static let approveDefault = "Approve"
  public static let rejectDefault = "Reject"
  public static let reviewerDefault = "Reviewer"
  public static let rootClass = "cs-review-gate"
  public static let riskClass = "cs-review-gate__risk"
  public static let summaryClass = "cs-review-gate__summary"
  public static let reviewerClass = "cs-review-gate__reviewer"
  public static let actionsClass = "cs-review-gate__actions"
  public static let rejectButtonVariant = "secondary"
  public static let approveButtonVariant = "primary"
  public static func risk(_ risk: String?, fallback: String) -> String { risk ?? fallback }
  public static func action(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func showsReviewer(_ reviewer: String?) -> Bool {
    guard let reviewer else { return false }
    return !reviewer.isEmpty
  }
  public static func reviewerLine(_ reviewer: String?, prefix: String) -> String? {
    guard let reviewer, showsReviewer(reviewer) else { return nil }
    return "\(prefix): \(reviewer)"
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": [
        "aria": "Cổng kiểm duyệt của con người",
        "risk": "cần xem xét",
        "approve": "Phê duyệt",
        "reject": "Từ chối",
        "reviewer": "Người duyệt",
      ],
      "en": [
        "aria": regionDefault,
        "risk": riskDefault,
        "approve": approveDefault,
        "reject": rejectDefault,
        "reviewer": reviewerDefault,
      ],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSHumanReviewGate: View {
  public let risk: String?
  public let summary: String
  public let reviewer: String?
  public let approveLabel: String?
  public let rejectLabel: String?
  let onApprove: () -> Void
  let onReject: () -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(risk: String? = nil, summary: String = "", reviewer: String? = nil, approveLabel: String? = nil, rejectLabel: String? = nil, language: String? = nil, onApprove: @escaping () -> Void = {}, onReject: @escaping () -> Void = {}) {
    self.risk = risk
    self.summary = summary
    self.reviewer = reviewer
    self.approveLabel = approveLabel
    self.rejectLabel = rejectLabel
    self.language = language
    self.onApprove = onApprove
    self.onReject = onReject
  }
  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let riskText = CSHumanReviewModel.risk(risk, fallback: CSHumanReviewModel.copy("risk", language: locale))
    let rejectName = CSHumanReviewModel.action(rejectLabel, fallback: CSHumanReviewModel.copy("reject", language: locale))
    let approveName = CSHumanReviewModel.action(approveLabel, fallback: CSHumanReviewModel.copy("approve", language: locale))
    VStack(alignment: .leading, spacing: CGFloat(CSReviewGateStyleModel.gap())) {
      Text(riskText)
        .font(.system(size: CGFloat(CSReviewGateStyleModel.riskFontSize()), weight: .bold))
        .textCase(CSReviewGateStyleModel.riskUppercase() ? .uppercase : nil)
      Text(summary)
      if let line = CSHumanReviewModel.reviewerLine(reviewer, prefix: CSHumanReviewModel.copy("reviewer", language: locale)) {
        Text(line).font(.system(size: CGFloat(CSReviewGateStyleModel.reviewerFontSize())))
      }
      HStack {
        CSTriggerButton(rejectName, action: onReject).frame(minHeight: 44)
        CSTriggerButton(approveName, action: onApprove).frame(minHeight: 44)
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSHumanReviewModel.copy("aria", language: locale))
  }
}

public enum CSInputGroupModel {
  public static let inputDefault = "Input"
  public static let clearDefault = "Clear"
  public static let showDefault = "Show password"
  public static let hideDefault = "Hide password"
  public static let groupClass = "cs-igroup"
  public static let buttonClass = "cs-igroup__btn"
  public static func rootClass(disabled: Bool) -> String { disabled ? "cs-field cs-field--disabled" : "cs-field" }
  public static func addonClass(isSuffix: Bool) -> String { isSuffix ? "cs-igroup__addon cs-igroup__addon--suf" : "cs-igroup__addon" }
  public static func labelId(_ id: String, hasLabel: Bool) -> String? { hasLabel ? "\(id)-label" : nil }
  public static func text(controlled: String?, inner: String) -> String { controlled ?? inner }
  public static func commit(next: String, disabled: Bool, readOnly: Bool) -> String? { disabled || readOnly ? nil : next }
  public static func showsAddon(_ value: String?) -> Bool { value != nil }
  public static func showsLabel(_ label: String?) -> Bool {
    guard let label else { return false }
    return !label.isEmpty
  }
  public static func addonName(ariaLabel: String?, hasLabel: Bool, hasLabelledBy: Bool, placeholder: String?, fallback: String) -> String? {
    if let ariaLabel { return ariaLabel }
    if hasLabel || hasLabelledBy { return nil }
    if let placeholder, !placeholder.isEmpty { return placeholder }
    return fallback
  }
  public static func showsClear(clearable: Bool, value: String) -> Bool { clearable && !value.isEmpty }
  public static func canClear(disabled: Bool, readOnly: Bool) -> Bool { !disabled && !readOnly }
  public static func fieldType(password: Bool, revealed: Bool) -> String { password && !revealed ? "password" : "text" }
  public static func revealLabel(revealed: Bool, show: String, hide: String) -> String { revealed ? hide : show }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["input": "Ô nhập", "clear": "Xóa", "show": "Hiện mật khẩu", "hide": "Ẩn mật khẩu"],
      "en": ["input": inputDefault, "clear": clearDefault, "show": showDefault, "hide": hideDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func canReveal(disabled: Bool) -> Bool { !disabled }
}

public struct CSInputGroup: View {
  public let label: String?
  public let placeholder: String?
  public let defaultValue: String
  public let ariaLabel: String?
  public let ariaLabelledBy: String?
  public let ariaDescribedBy: String?
  @Binding var text: String
  public let prefixText: String?
  public let suffixText: String?
  public let clearable: Bool
  public let password: Bool
  @Binding var revealed: Bool
  public let disabled: Bool
  public let readOnly: Bool
  let onChange: (String) -> Void
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, placeholder: String? = nil, defaultValue: String = "", ariaLabel: String? = nil, ariaLabelledBy: String? = nil, ariaDescribedBy: String? = nil, text: Binding<String> = .constant(""), prefixText: String? = nil, suffixText: String? = nil, clearable: Bool = false, password: Bool = false, revealed: Binding<Bool> = .constant(false), disabled: Bool = false, readOnly: Bool = false, language: String? = nil, onChange: @escaping (String) -> Void = { _ in }) {
    self.label = label
    self.placeholder = placeholder
    self.defaultValue = defaultValue
    self.ariaLabel = ariaLabel
    self.ariaLabelledBy = ariaLabelledBy
    self.ariaDescribedBy = ariaDescribedBy
    _text = text
    self.prefixText = prefixText
    self.suffixText = suffixText
    self.clearable = clearable
    self.password = password
    _revealed = revealed
    self.disabled = disabled
    self.readOnly = readOnly
    self.language = language
    self.onChange = onChange
  }

  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let spoken = CSInputGroupModel.addonName(ariaLabel: ariaLabel, hasLabel: CSInputGroupModel.showsLabel(label), hasLabelledBy: ariaLabelledBy != nil, placeholder: placeholder, fallback: CSInputGroupModel.copy("input", language: locale))
    let clearName = CSInputGroupModel.copy("clear", language: locale)
    let revealName = CSInputGroupModel.revealLabel(revealed: revealed, show: CSInputGroupModel.copy("show", language: locale), hide: CSInputGroupModel.copy("hide", language: locale))
    VStack(alignment: .leading, spacing: 4) {
      if CSInputGroupModel.showsLabel(label), let label { Text(label) }
      HStack {
        if CSInputGroupModel.showsAddon(prefixText), let prefixText {
          Text(prefixText).padding(.horizontal, CGFloat(CSControlsWaveStyleModel.inputGroupAddonPaddingX()))
        }
        field
        if CSInputGroupModel.showsClear(clearable: clearable, value: text) {
          CSTriggerButton(clearName) {
            if CSInputGroupModel.canClear(disabled: disabled, readOnly: readOnly) { onChange("") }
          }
          .disabled(!CSInputGroupModel.canClear(disabled: disabled, readOnly: readOnly))
          .frame(minHeight: 44)
        }
        if password {
          CSTriggerButton(revealName) { revealed.toggle() }
            .accessibilityValue(revealed ? "true" : "false")
            .disabled(!CSInputGroupModel.canReveal(disabled: disabled))
            .frame(minHeight: 44)
        }
        if CSInputGroupModel.showsAddon(suffixText), let suffixText {
          Text(suffixText).padding(.horizontal, CGFloat(CSControlsWaveStyleModel.inputGroupAddonPaddingX()))
        }
      }
      .frame(minWidth: CGFloat(CSControlsWaveStyleModel.inputGroupMinWidth()), alignment: .leading)
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(spoken ?? "")
  }

  @ViewBuilder
  private var field: some View {
    let binding = Binding(get: { text }, set: { next in
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
      if CSInputGroupModel.commit(next: next, disabled: disabled, readOnly: readOnly) != nil { onChange(next) }
    })
    Group {
      if CSInputGroupModel.fieldType(password: password, revealed: revealed) == "password" {
        SecureField(placeholder ?? "", text: binding)
      } else {
        TextField(placeholder ?? "", text: binding)
      }
    }
    .focused($focused)
    .onChange(of: focused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
    }
    .disabled(disabled)
  }
}

public enum CSItemModel {
  public static func gap() -> Double { 14 }
  public static func paddingX() -> Double { 14 }
  public static func borderWidth() -> Double { 1 }
  public static func isInteractive(href: String?, hasOnClick: Bool) -> Bool { href != nil || hasOnClick }
  public static func hasInteractiveClass(interactive: Bool, disabled: Bool) -> Bool { interactive && !disabled }
  public static func tag(href: String?, hasOnClick: Bool) -> String {
    if href != nil { return "a" }
    if hasOnClick { return "button" }
    return "div"
  }
  public static func rootClass(interactive: Bool, selected: Bool, disabled: Bool) -> String {
    var parts = ["cs-item"]
    if hasInteractiveClass(interactive: interactive, disabled: disabled) { parts.append("cs-item--interactive") }
    if selected { parts.append("cs-item--selected") }
    return parts.joined(separator: " ")
  }
  public static func disabledLinkTabIndex(isLink: Bool, disabled: Bool) -> Int? {
    isLink && disabled ? -1 : nil
  }
  public static func disabledLinkRole(isLink: Bool, disabled: Bool, explicit: String? = nil) -> String? {
    isLink && disabled ? (explicit ?? "link") : explicit
  }
  public static func showsHover(interactive: Bool, disabled: Bool, hovered: Bool) -> Bool {
    hasInteractiveClass(interactive: interactive, disabled: disabled) && hovered
  }
  public static func focusOutlineWidth(focused: Bool) -> Double { focused ? 2 : 0 }
  public static func focusOutlineOffset(focused: Bool) -> Double { focused ? 2 : 0 }
  public static func focusRingWidth(focused: Bool) -> Double { focused ? 5 : 0 }
  public static func opacity(interactive: Bool, disabled: Bool) -> Double { interactive && disabled ? 0.55 : 1 }
  public static func ariaCurrent(selected: Bool, explicit: String? = nil) -> String? { selected ? (explicit ?? "true") : explicit }
  public static func mainGap() -> Double { 2 }
  public static func titleLineHeight() -> Double { 1.35 }
  public static func descriptionLineHeight() -> Double { 1.4 }
  public static func showsSlot(_ value: String?) -> Bool { value != nil }
  public static func trailingText(trailing: String?, hasExplicitTrailing: Bool, hasTitle: Bool, children: String?) -> String? {
    hasExplicitTrailing ? trailing : (hasTitle ? children : nil)
  }
  public static func mainExtraText(hasExplicitTrailing: Bool, hasTitle: Bool, children: String?) -> String? {
    hasExplicitTrailing ? children : (!hasTitle ? children : nil)
  }
}

public struct CSItem: View {
  public let title: String
  public let subtitle: String
  public let description: String?
  public let leading: String?
  public let trailing: String?
  public let childrenText: String?
  public let href: String?
  public let selected: Bool
  public let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onClick: (() -> Void)?
  @State private var hovered = false
  @FocusState private var focused: Bool
  public init(title: String = "", subtitle: String = "", description: String? = nil, leading: String? = nil, trailing: String? = nil, childrenText: String? = nil, href: String? = nil, selected: Bool = false, disabled: Bool = false, dark: Bool = false, highContrast: Bool = false, compact: Bool = false, onClick: (() -> Void)? = nil) {
    self.title = title
    self.subtitle = subtitle
    self.description = description
    self.leading = leading
    self.trailing = trailing
    self.childrenText = childrenText
    self.href = href
    self.selected = selected
    self.disabled = disabled
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onClick = onClick
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let interactive = CSItemModel.isInteractive(href: href, hasOnClick: onClick != nil)
    let showHover = CSItemModel.showsHover(interactive: interactive, disabled: disabled, hovered: hovered)
    let showFocus = CSItemModel.hasInteractiveClass(interactive: interactive, disabled: disabled) && focused
    let desc = description ?? (subtitle.isEmpty ? nil : subtitle)
    let trail = CSItemModel.trailingText(trailing: trailing, hasExplicitTrailing: trailing != nil, hasTitle: !title.isEmpty, children: childrenText)
    let extra = CSItemModel.mainExtraText(hasExplicitTrailing: trailing != nil, hasTitle: !title.isEmpty, children: childrenText)
    HStack(alignment: .center, spacing: CGFloat(CSItemModel.gap())) {
      if CSItemModel.showsSlot(leading), let leading {
        Text(leading).foregroundStyle(pack.colorTextAccent.color)
      }
      VStack(alignment: .leading, spacing: CGFloat(CSItemModel.mainGap())) {
        if !title.isEmpty {
          Text(title)
            .font(.system(size: pack.fontSizeSm.points, weight: .semibold))
            .lineSpacing(CGFloat(pack.fontSizeSm.points * (CSItemModel.titleLineHeight() - 1)))
            .foregroundStyle(pack.primaryTextColor)
        }
        if CSItemModel.showsSlot(desc), let desc {
          Text(desc)
            .font(.system(size: pack.fontSizeXs.points))
            .lineSpacing(CGFloat(pack.fontSizeXs.points * (CSItemModel.descriptionLineHeight() - 1)))
            .foregroundStyle(pack.mutedColor)
        }
        if CSItemModel.showsSlot(extra), let extra {
          Text(extra).foregroundStyle(pack.primaryTextColor)
        }
      }
      .multilineTextAlignment(.leading)
      .frame(maxWidth: .infinity, alignment: .leading)
      if CSItemModel.showsSlot(trail), let trail {
        Text(trail).foregroundStyle(pack.mutedColor)
      }
    }
    .padding(.vertical, pack.space3.points)
    .padding(.horizontal, CGFloat(CSItemModel.paddingX()))
    .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
    .background((selected ? pack.accentTint : showHover ? pack.colorSurfaceRaised : pack.colorSurfacePanel).color, in: RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(selected ? pack.colorBrandOchre.color : showHover ? pack.colorBorderDefault.color : Color.clear, lineWidth: CGFloat(CSItemModel.borderWidth())))
    .overlay(
      RoundedRectangle(cornerRadius: pack.radiusMd.points)
        .inset(by: -CGFloat(CSItemModel.focusRingWidth(focused: showFocus)) / 2)
        .stroke(showFocus ? pack.colorAccentOchre.color : .clear, lineWidth: CGFloat(CSItemModel.focusRingWidth(focused: showFocus)))
    )
    .overlay(
      RoundedRectangle(cornerRadius: pack.radiusMd.points)
        .inset(by: -(CGFloat(CSItemModel.focusOutlineOffset(focused: showFocus)) + CGFloat(CSItemModel.focusOutlineWidth(focused: showFocus)) / 2))
        .stroke(showFocus ? pack.primaryTextColor : .clear, lineWidth: CGFloat(CSItemModel.focusOutlineWidth(focused: showFocus)))
    )
    .opacity(CSItemModel.opacity(interactive: interactive, disabled: disabled))
    .allowsHitTesting(!disabled)
    .accessibilityAddTraits(selected ? .isSelected : [])
    .focused($focused)
    .onHover { inside in hovered = inside }
    .onTapGesture { if CSItemModel.hasInteractiveClass(interactive: interactive, disabled: disabled) { onClick?() } }
  }
}

public enum CSLocaleModel {
  public static let defaultLanguage = "vi"
  public static func resolveMessage(namespace: String, key: String, messages: [String: [String: [String: String]]] = [:], language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? defaultLanguage
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = messages[namespace]?[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSLocaleProvider<Content: View>: View {
  public let language: String
  public let messages: [String: [String: [String: String]]]
  let content: () -> Content
  public init(language: String = CSLocaleModel.defaultLanguage, messages: [String: [String: [String: String]]] = [:], @ViewBuilder content: @escaping () -> Content) {
    self.language = language
    self.messages = messages
    self.content = content
  }
  public var body: some View { content().environment(\.csLanguage, language).environment(\.locale, Locale(identifier: language == "vi" ? "vi" : "en")) }
}

public enum CSLumiModel {
  public static let defaultSize = "md"
  public static let defaultAlt = "Lumi"
  public static let glyph = "✦"
  public static func rootClass(size: String = defaultSize, ring: Bool = false) -> String {
    var parts = ["cs-lumi", "cs-lumi--\(size)"]
    if ring { parts.append("cs-lumi--ring") }
    return parts.joined(separator: " ")
  }
  public static func role(src: String?, alt: String) -> String? {
    src == nil && !alt.isEmpty ? "img" : nil
  }
}

public struct CSLumiAvatar: View {
  public let alt: String
  public let size: String
  public let src: String?
  public let ring: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public init(alt: String = CSAIStyleModel.lumiDefaultAlt, size: String = "md", src: String? = nil, ring: Bool = false, dark: Bool = false, highContrast: Bool = false, compact: Bool = false) {
    self.alt = alt
    self.size = size
    self.src = src
    self.ring = ring
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let dim = CGFloat(CSAIStyleModel.lumiSize(size: size))
    let spread = CGFloat(CSAIStyleModel.lumiRingSpread(ring: ring))
    let label = CSAIStyleModel.lumiWrapperLabel(src: src, alt: alt) ?? alt
    Text(CSAIStyleModel.lumiHasImage(src) ? alt : CSAIStyleModel.lumiGlyph)
      .foregroundStyle(pack.colorBrandUmber.color)
      .frame(width: dim, height: dim)
      .background(pack.colorBrandOchre.color)
      .clipShape(Circle())
      .padding(spread)
      .accessibilityHidden(label.isEmpty)
      .accessibilityLabel(label)
  }
}

public enum CSMasonryModel {
  public static let defaultColumns = 3
  public static let rootClass = "cs-masonry"
  public static let itemClass = "cs-masonry__item"
  public static func defaultGap() -> Double { 16 }
  public static func safeColumns(_ columns: Int) -> Int { max(1, columns) }
  public static func itemMarginBottom(_ gap: Double = defaultGap()) -> Double { gap }
}

public struct CSMasonry<Content: View>: View {
  public let columns: Int
  public let gap: Double
  let content: () -> Content
  public init(columns: Int = CSMasonryModel.defaultColumns, gap: Double = CSMasonryModel.defaultGap(), @ViewBuilder content: @escaping () -> Content) {
    self.columns = CSMasonryModel.safeColumns(columns)
    self.gap = gap
    self.content = content
  }
  public var body: some View { VStack(alignment: .leading, spacing: CGFloat(CSMasonryModel.itemMarginBottom(gap))) { content() } }
}

public enum CSMenuItemModel {
  public static let role = "menuitem"
  public static let tabIndex = -1
  public static func itemClass(danger: Bool = false) -> String {
    danger ? "cs-menu__item cs-menu__item--danger" : "cs-menu__item"
  }
  public static func showsIcon(_ icon: String?) -> Bool {
    guard let icon else { return false }
    return !icon.isEmpty
  }
}

public struct CSMenuItem: View {
  public let title: String
  public let danger: Bool
  public let icon: String?
  public let disabled: Bool
  let action: () -> Void
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool
  public init(title: String = "", danger: Bool = false, icon: String? = nil, disabled: Bool = false, action: @escaping () -> Void = {}) {
    self.title = title
    self.danger = danger
    self.icon = icon
    self.disabled = disabled
    self.action = action
  }
  public var body: some View {
    let restore = { ownerFocused = true }
    Button(title) {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }
    .disabled(disabled)
    .focused($ownerFocused)
    .padding(.vertical, CGFloat(CSNavigationStyleModel.menuItemPaddingY()))
    .padding(.horizontal, CGFloat(CSNavigationStyleModel.menuItemPaddingX()))
    .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public struct CSNativeSelect: View {
  public let label: String
  public let options: [CSNativeSelectOption]
  public let defaultValue: String
  public let id: String?
  public let ariaLabel: String?
  public let ariaLabelledBy: String?
  public let ariaDescribedBy: String?
  public let error: String?
  public let placeholder: String?
  public let hasChildren: Bool
  public let disabled: Bool
  public let size: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Binding var selection: String
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  public init(label: String = "", options: [CSNativeSelectOption] = [], selection: Binding<String> = .constant(""), defaultValue: String = "", id: String? = nil, ariaLabel: String? = nil, ariaLabelledBy: String? = nil, ariaDescribedBy: String? = nil, error: String? = nil, placeholder: String? = nil, hasChildren: Bool = false, disabled: Bool = false, size: String = "md", dark: Bool = false, highContrast: Bool = false, compact: Bool = false) {
    self.label = label
    self.options = options
    self.defaultValue = defaultValue
    self.id = id
    self.ariaLabel = ariaLabel
    self.ariaLabelledBy = ariaLabelledBy
    self.ariaDescribedBy = ariaDescribedBy
    self.error = error
    self.placeholder = placeholder
    self.hasChildren = hasChildren
    self.disabled = disabled
    self.size = CSNativeSelectModel.resolvedSize(size)
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    _selection = selection
  }
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let prompt = CSNativeSelectModel.placeholderText(placeholder, fallback: CSNativeSelectModel.placeholderDefault)
    let blank = selection.isEmpty && CSNativeSelectModel.showsPlaceholder(placeholder: placeholder, hasChildren: hasChildren)
    let shownLabel = CSPresenceValue.text(label).shown
    VStack(alignment: .leading, spacing: 4) {
      if shownLabel { Text(label).foregroundStyle(pack.primaryTextColor) }
      Picker("", selection: Binding(get: { selection }, set: { next in
        guard let chosen = options.first(where: { $0.value == next }), CSNativeSelectModel.optionEnabled(optionDisabled: chosen.disabled, controlDisabled: disabled) else { return }
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        selection = next
      })) {
        ForEach(options, id: \.value) { option in
          Text(option.label).tag(option.value).disabled(option.disabled || disabled)
        }
      }
        .labelsHidden()
        .disabled(disabled)
        .frame(minHeight: CGFloat(CSSelectModel.nativeSelectMinHeight()))
        .accessibilityLabel(shownLabel ? label : "")
        .accessibilityValue(blank ? prompt : selection)
        .overlay(alignment: .trailing) {
          CSIcon(name: "chevron-down", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .foregroundStyle(pack.mutedColor)
            .padding(.trailing, CGFloat(CSSelectModel.chevronInsetInlineEnd()))
            .accessibilityHidden(true)
            .allowsHitTesting(false)
        }
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused && !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
        .simultaneousGesture(TapGesture().onEnded {
          if !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        })
      if let error, CSNativeSelectModel.isAlert(error) {
        Text(error).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
  }
}

public enum CSNavItemModel {
  public static let iconClass = "cs-nav-item__icon"
  public static let trailClass = "cs-nav-item__trail"
  public static func rootClass(active: Bool) -> String { active ? "cs-nav-item cs-nav-item--active" : "cs-nav-item" }
  public static func buttonType(href: String?) -> String? { tag(href: href) == "button" ? "button" : nil }
  public static func gap() -> Double { 11 }
  public static func paddingY() -> Double { 9 }
  public static func paddingX() -> Double { 12 }
  public static func fontWeight() -> Int { 600 }
  public static let activeOchrePortion = 0.22
  public static func showsIcon(_ icon: String?) -> Bool {
    guard let icon else { return false }
    return !icon.isEmpty
  }
  public static func showsTrail(_ trail: String?) -> Bool { trail != nil }
  public static func tag(href: String?) -> String {
    guard let href, !href.isEmpty else { return "button" }
    return "a"
  }
  public static func ariaCurrent(active: Bool) -> String? { active ? "page" : nil }
  public static func showsHoverFill(active: Bool, hovered: Bool) -> Bool { !active && hovered }
  public static func activeUsesOchreInk(dark: Bool) -> Bool { dark }
  public static func activeBgLab(ochre: CSColorValue, panel: CSColorValue) -> [Double] {
    let lead = oklab(ochre), base = oklab(panel)
    return zip(lead, base).map { activeOchrePortion * $0 + (1 - activeOchrePortion) * $1 }
  }
  public static func activeBgColor(pack: CSTokenModePack) -> CSColorValue {
    CSColorValue(colorSpace: .oklab, components: activeBgLab(ochre: pack.colorBrandOchre, panel: pack.colorSurfacePanel), alpha: 1)
  }
  public static func textColor(active: Bool, dark: Bool, pack: CSTokenModePack) -> CSColorValue {
    active ? (activeUsesOchreInk(dark: dark) ? pack.colorBrandOchre : pack.colorBrandUmber) : pack.colorTextPrimary
  }
  public static func iconColor(active: Bool, dark: Bool, pack: CSTokenModePack) -> CSColorValue {
    active ? (activeUsesOchreInk(dark: dark) ? pack.colorBrandOchre : pack.colorBrandUmber) : pack.colorTextMuted
  }
  private static func oklab(_ color: CSColorValue) -> [Double] {
    color.colorSpace == .oklab ? Array(color.components.prefix(3)) : srgbToOklab(color.components)
  }
  private static func srgbToOklab(_ rgb: [Double]) -> [Double] {
    func linear(_ channel: Double) -> Double { channel <= 0.04045 ? channel / 12.92 : pow((channel + 0.055) / 1.055, 2.4) }
    let r = linear(rgb[0]), g = linear(rgb[1]), b = linear(rgb[2])
    let l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    let m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    let s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]
  }
}

public struct CSNavItem: View {
  public let title: String
  public let active: Bool
  public let icon: String?
  public let trail: String?
  public let href: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let action: () -> Void
  public init(title: String = "", active: Bool = false, icon: String? = nil, trail: String? = nil, href: String? = nil, dark: Bool = false, highContrast: Bool = false, compact: Bool = false, action: @escaping () -> Void = {}) {
    self.title = title
    self.active = active
    self.icon = icon
    self.trail = trail
    self.href = href
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.action = action
  }
  @State private var focusId = UUID().uuidString
  @State private var hovered = false
  @FocusState private var ownerFocused: Bool
  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let restore = { ownerFocused = true }
    let textInk = CSNavItemModel.textColor(active: active, dark: dark, pack: pack).color
    let iconInk = CSNavItemModel.iconColor(active: active, dark: dark, pack: pack).color
    let fill: Color = active ? CSNavItemModel.activeBgColor(pack: pack).color : (CSNavItemModel.showsHoverFill(active: active, hovered: hovered) ? pack.colorSurfaceRaised.color : Color.clear)
    Button(action: {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }) {
      HStack(alignment: .center, spacing: CGFloat(CSNavItemModel.gap())) {
        if CSNavItemModel.showsIcon(icon), let icon {
          CSIcon(name: icon, label: "", dark: dark, highContrast: highContrast, compact: compact)
            .foregroundStyle(iconInk)
        }
        Text(title)
          .font(.system(size: pack.fontSizeSm.points, weight: .semibold))
          .foregroundStyle(textInk)
          .multilineTextAlignment(.leading)
        if CSNavItemModel.showsTrail(trail), let trail {
          Spacer(minLength: 0)
          Text(trail)
            .font(.system(size: pack.fontSizeSm.points, weight: .semibold))
            .foregroundStyle(textInk)
        }
      }
      .padding(.vertical, CGFloat(CSNavItemModel.paddingY()))
      .padding(.horizontal, CGFloat(CSNavItemModel.paddingX()))
      .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
      .background(fill, in: RoundedRectangle(cornerRadius: pack.radiusMd.points))
      .contentShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
    }
    .buttonStyle(.plain)
    .focused($ownerFocused)
    .onHover { hovered = $0 }
    .accessibilityAddTraits(active ? .isSelected : [])
    .accessibilityValue(Text(CSNavItemModel.ariaCurrent(active: active) ?? ""))
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public enum CSOverlayProviderModel {
  public static let registryProtocol = "cyberskill.overlay-manager/1"
  public static let rootDataAttr = "data-cs-overlay-root"
  public static let defaultKind = "modal"
  public static func providerId(_ id: String) -> String { "cs-overlay-provider-\(id)" }
  public static func locksScroll(kind: String = defaultKind, explicit: Bool? = nil) -> Bool {
    explicit ?? (kind == "modal" || kind == "drawer" || kind == "sheet" || kind == "command" || kind == "alert")
  }
}

public struct CSOverlayProvider<Content: View>: View {
  let content: () -> Content
  public init(@ViewBuilder content: @escaping () -> Content) { self.content = content }
  public var body: some View { content() }
}

public enum CSPromptInputModel {
  public static let placeholderDefault = "Type your wish…"
  public static let sendDefault = "Send"
  public static let hintDefault = "Lumi replies, then hands clear wishes to a human."
  public static let defaultRows = 1
  public static let rootClass = "cs-prompt"
  public static let fieldClass = "cs-prompt__field"
  public static let barClass = "cs-prompt__bar"
  public static let hintClass = "cs-prompt__hint"
  public static let spinnerClass = "cs-button__spinner"
  public static let sendButtonVariant = "primary"
  public static let sendButtonSize = "sm"
  public static func hintIconSize() -> Int { 14 }
  public static func hintIconStrokeWidth() -> Double { 1.8 }
  public static func showsSpinner(busy: Bool) -> Bool { busy }
  public static func text(controlled: String?, inner: String) -> String { controlled ?? inner }
  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func send(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": [
        "placeholder": "Nhập điều ước của bạn…",
        "send": "Gửi",
        "hint": "Lumi trả lời, rồi chuyển điều ước rõ ràng cho con người.",
      ],
      "en": ["placeholder": placeholderDefault, "send": sendDefault, "hint": hintDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func spoken(ariaLabel: String?, placeholder: String) -> String {
    if let ariaLabel, !ariaLabel.isEmpty { return ariaLabel }
    return placeholder
  }
  public static func hintText(_ hint: String?, fallback: String) -> String? {
    guard showsHint(hint) else { return nil }
    return hint ?? fallback
  }
  public static func canType(disabled: Bool) -> Bool { !disabled }
  public static func canSend(disabled: Bool, busy: Bool) -> Bool { !disabled && !busy }
  public static func submit(_ value: String, disabled: Bool, busy: Bool) -> String? {
    if disabled || busy || value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { return nil }
    return value
  }

  public static func enterSubmits(shift: Bool, composing: Bool, keyCode: Int) -> Bool {
    !shift && !composing && keyCode != 229
  }

  public static func showsHint(_ hint: String?) -> Bool {
    guard let hint else { return true }
    return !hint.isEmpty
  }
}

public struct CSPromptInput: View {
  public let label: String
  public let submitLabel: String?
  public let sendLabel: String?
  public let disabled: Bool
  public let busy: Bool
  public let placeholder: String?
  public let hint: String?
  public let ariaLabel: String?
  @Binding var text: String
  let onSubmit: (String) -> Void
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String = "", submitLabel: String? = nil, sendLabel: String? = nil, text: Binding<String> = .constant(""), disabled: Bool = false, busy: Bool = false, placeholder: String? = nil, hint: String? = nil, ariaLabel: String? = nil, language: String? = nil, onSubmit: @escaping (String) -> Void = { _ in }) {
    self.label = label
    self.submitLabel = submitLabel
    self.sendLabel = sendLabel
    self.disabled = disabled
    self.busy = busy
    self.placeholder = placeholder
    self.hint = hint
    self.ariaLabel = ariaLabel
    _text = text
    self.language = language
    self.onSubmit = onSubmit
  }
  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let prompt = CSPromptInputModel.placeholder(placeholder, fallback: CSPromptInputModel.copy("placeholder", language: locale))
    let spoken = CSPromptInputModel.spoken(ariaLabel: ariaLabel, placeholder: prompt)
    let sendName = CSPromptInputModel.send(sendLabel ?? submitLabel, fallback: CSPromptInputModel.copy("send", language: locale))
    VStack(alignment: .leading, spacing: CGFloat(CSAIStyleModel.promptGap())) {
      TextField(prompt, text: Binding(get: { text }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        text = next
      }))
        .frame(minHeight: CGFloat(CSAIStyleModel.promptFieldMinHeight()))
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
        .disabled(!CSPromptInputModel.canType(disabled: disabled))
        .accessibilityLabel(spoken)
      if let hint = CSPromptInputModel.hintText(hint, fallback: CSPromptInputModel.copy("hint", language: locale)) {
        HStack(spacing: CGFloat(CSAIStyleModel.promptHintGap())) {
          CSIcon(name: "sparkle", label: "", dark: false, highContrast: false, compact: false)
          Text(hint)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(hint)
      }
      CSTriggerButton(sendName) { if let value = CSPromptInputModel.submit(text, disabled: disabled, busy: busy) { onSubmit(value) } }
        .disabled(!CSPromptInputModel.canSend(disabled: disabled, busy: busy))
        .frame(minHeight: 44)
    }
    .padding(.vertical, CGFloat(CSAIStyleModel.promptPaddingY()))
    .padding(.horizontal, CGFloat(CSAIStyleModel.promptPaddingX()))
  }
}

public struct CSPromptSuggestion: Equatable {
  public var label: String
  public var icon: String?
  public init(_ label: String, icon: String? = nil) {
    self.label = label
    self.icon = icon
  }
}

public enum CSPromptSuggestionsModel {
  public static let rootClass = "cs-suggest"
  public static func iconSize() -> Int { 14 }
  public static func iconStrokeWidth() -> Double { 1.8 }
  public static func iconName(_ icon: String?) -> String { icon ?? "sparkle" }
  public static func fromText(_ text: String) -> CSPromptSuggestion { CSPromptSuggestion(text) }
  public static func chosen(_ label: String, hasHandler: Bool) -> String? { hasHandler ? label : nil }
  public static func selectedLabel(_ suggestion: CSPromptSuggestion) -> String { suggestion.label }
}

public struct CSPromptSuggestions: View {
  public let suggestions: [CSPromptSuggestion]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Int?
  public init(suggestions: [CSPromptSuggestion] = [], dark: Bool = false, highContrast: Bool = false, compact: Bool = false, onSelect: @escaping (String) -> Void = { _ in }) {
    self.suggestions = suggestions
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: CGFloat(CSAIStyleModel.suggestGap())) {
      ForEach(Array(suggestions.enumerated()), id: \.offset) { index, item in
        Button {
          CSFocusRegistry.shared.claim(id: "\(focusId)-\(index)", restore: { focused = index })
          if let label = CSPromptSuggestionsModel.chosen(CSPromptSuggestionsModel.selectedLabel(item), hasHandler: true) { onSelect(label) }
        } label: {
          HStack(spacing: CGFloat(CSAIStyleModel.suggestButtonGap())) {
            let icon = CSPromptSuggestionsModel.iconName(item.icon)
            if !icon.isEmpty {
              CSIcon(name: icon, label: "", dark: dark, highContrast: highContrast, compact: compact)
            }
            Text(item.label)
          }
          .padding(.vertical, CGFloat(CSAIStyleModel.suggestButtonPaddingY()))
          .padding(.horizontal, CGFloat(CSAIStyleModel.suggestButtonPaddingX()))
        }
        .focused($focused, equals: index)
        .frame(minHeight: 44, alignment: .leading)
      }
    }
    .onChange(of: focused) { index in
      if let index { CSFocusRegistry.shared.claim(id: "\(focusId)-\(index)", restore: { focused = index }) }
    }
  }
}

extension CSQRCodeModel {
  public static let defaultSize = 128.0
  public static let rootClass = "cs-qrcode"
  public static let role = "img"
  public static let fallbackGlyph = "—"
  public static let defaultColor = "var(--cs-color-text-primary)"
  public static func cellSize(size: Double = defaultSize, modulesCount: Int) -> Double {
    modulesCount > 0 ? size / Double(modulesCount) : 0
  }
  public static func accessibleLabel(label: String?, value: String) -> String {
    if let label, !label.isEmpty { return label }
    return value
  }
}

public struct CSQRCode: View {
  public let value: String
  public let label: String
  public let size: Double
  public let color: String?
  public init(value: String = "", label: String = "", size: Double = CSQRCodeModel.defaultSize, color: String? = nil) {
    self.value = value
    self.label = label
    self.size = size
    self.color = color
  }
  public var body: some View {
    let modules = CSQRCodeModel.matrix(value)
    Group {
      if let modules {
        Canvas { context, size in
          let cell = size.width / CGFloat(modules.count)
          for y in modules.indices {
            for x in modules[y].indices where modules[y][x] {
              context.fill(Path(CGRect(x: CGFloat(x) * cell, y: CGFloat(y) * cell, width: cell, height: cell)), with: .color(.primary))
            }
          }
        }
        .frame(width: CGFloat(size), height: CGFloat(size))
      } else {
        Text("—").frame(width: CGFloat(size), height: CGFloat(size))
      }
    }
    .padding(CGFloat(CSControlsBatchStyleModel.qrCodePadding()))
    .accessibilityLabel(CSQRCodeModel.accessibleLabel(label: label, value: value))
  }
}

public enum CSTreeSelectModel {
  public static let placeholderDefault = "Select…"
  public static let placementDefault = "bottom-start"
  public static let rootClass = "cs-treeselect"
  public static let fieldClass = "cs-treeselect__field"
  public static let popClass = "cs-treeselect__pop"
  public static let triggerHasPopup = "tree"
  public static let chevronGlyph = "▾"
  public static func descriptionId(_ id: String, description: String?) -> String? {
    guard let description, !description.isEmpty else { return nil }
    return "\(id)-description"
  }
  public static func errorId(_ id: String, error: String?) -> String? {
    guard let error, !error.isEmpty else { return nil }
    return "\(id)-error"
  }
  public static func describedBy(explicit: String?, descriptionId: String?, errorId: String?) -> String? {
    let parts = [explicit, descriptionId, errorId].compactMap { $0 }.filter { !$0.isEmpty }
    return parts.isEmpty ? nil : parts.joined(separator: " ")
  }
  public static func invalid(error: String?) -> Bool {
    guard let error else { return false }
    return !error.isEmpty
  }
  public static func resolvedPlacement(_ explicit: String?) -> String { explicit ?? placementDefault }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Chọn…"],
      "en": ["placeholder": placeholderDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func find(nodes: [CSTreeNode], key: String?) -> CSTreeNode? {
    guard let key else { return nil }
    for node in nodes {
      if node.key == key { return node }
      if let nested = find(nodes: node.children, key: key) { return nested }
    }
    return nil
  }
  public static func face(found: String?, placeholder: String) -> String { found ?? placeholder }
  public static func commits(_ node: CSTreeNode) -> Bool { node.children.isEmpty }
  public static func shown(requested: Bool, disabled: Bool) -> Bool { requested && !disabled }
  public static func dismissOutside(open: Bool, inside: Bool) -> Bool { open && !inside }
  public static let panelGap = 6.0
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String = placementDefault) -> CSTreeSelectPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: resolvedPlacement(placement), gap: panelGap) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: panelGap) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSTreeSelectPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }
  public static func fieldName(label: String?, labelledBy: String?) -> String? {
    if let labelledBy, !labelledBy.isEmpty { return nil }
    return label
  }
  public static func treeName(label: String?, labelledBy: String?, placeholder: String) -> String? {
    if let labelledBy, !labelledBy.isEmpty { return nil }
    if let label, !label.isEmpty { return label }
    return placeholder
  }
}

public struct CSTreeSelectPlace: Equatable {
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

public struct CSTreeSelect: View {
  public let label: String?
  public let labelledBy: String?
  public let description: String?
  public let error: String?
  public let required: Bool
  public let ariaDescribedBy: String?
  public let nodes: [CSTreeNode]
  public let selected: String?
  public let placeholder: String?
  public let disabled: Bool
  public let portal: Bool
  public let placement: String?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var requested = false
  @State private var expanded: [String: Bool]
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0

  public init(label: String? = nil, labelledBy: String? = nil, description: String? = nil, error: String? = nil, required: Bool = false, ariaDescribedBy: String? = nil, nodes: [CSTreeNode] = [], open: [String: Bool] = [:], selected: String? = nil, placeholder: String? = nil, disabled: Bool = false, portal: Bool = true, placement: String? = nil, dark: Bool = false, highContrast: Bool = false, compact: Bool = false, language: String? = nil, onSelect: @escaping (String) -> Void = { _ in }) {
    self.label = label
    self.labelledBy = labelledBy
    self.description = description
    self.error = error
    self.required = required
    self.ariaDescribedBy = ariaDescribedBy
    self.nodes = nodes
    self.selected = selected
    self.placeholder = placeholder
    self.disabled = disabled
    self.portal = portal
    self.placement = placement
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
    _expanded = State(initialValue: open)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSTreeSelectModel.placeholder(placeholder, fallback: CSTreeSelectModel.copy("placeholder", language: locale))
    let found = CSTreeSelectModel.find(nodes: nodes, key: selected)
    let shown = CSTreeSelectModel.face(found: found?.label, placeholder: hint)
    let opened = CSTreeSelectModel.shown(requested: requested, disabled: disabled)
    let name = CSTreeSelectModel.fieldName(label: label, labelledBy: labelledBy)
    let tree = CSTreeSelectModel.treeName(label: label, labelledBy: labelledBy, placeholder: hint) ?? ""
    VStack(alignment: .leading) {
      Group {
        if let name {
          Button { if !disabled { requested.toggle() } } label: {
            HStack { Text(shown).accessibilityHidden(true); Text("▾").accessibilityHidden(true) }
          }
          .accessibilityLabel(name)
        } else {
          Button { if !disabled { requested.toggle() } } label: {
            HStack { Text(shown).accessibilityHidden(true); Text("▾").accessibilityHidden(true) }
          }
        }
      }
      .disabled(disabled)
      .frame(minWidth: CGFloat(CSControlsBatchStyleModel.treeSelectMinWidth()), alignment: .leading)
      .accessibilityValue(opened ? "true" : "false")
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSTreeSelectAnchorKey.self, value: geo.frame(in: .global))
      })
      if let description, !description.isEmpty {
        Text(description).foregroundStyle(pack.mutedColor)
      }
      if let error, !error.isEmpty {
        Text(error).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
      if opened {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSTreeSelectModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: CSTreeSelectModel.resolvedPlacement(placement))
          }
        }
        CSTree(label: tree, nodes: nodes, open: expanded, selected: selected, dark: dark, highContrast: highContrast, compact: compact, onOpen: { expanded = $0 }, onSelect: { key in
          guard let node = CSTreeSelectModel.find(nodes: nodes, key: key), CSTreeSelectModel.commits(node) else { return }
          onSelect(key)
          requested = false
        })
        .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSTreeSelectPanelKey.self, value: CSTreeSelectMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? 0))
        .opacity(placed == nil ? 0 : 1)
        .accessibilityHidden(placed == nil)
        .onExitCommand { requested = false }
      }
    }
    .background(GeometryReader { _ in
      CSInlineOutside(active: opened) {
        if CSTreeSelectModel.dismissOutside(open: true, inside: false) { requested = false }
      }
    })
    .onChange(of: disabled) { isDisabled in
      if isDisabled { requested = false }
    }
    .onPreferenceChange(CSTreeSelectAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSTreeSelectPanelKey.self) { measure in
      guard opened, measure.size.width > 0, measure.size.height > 0 else { return }
      panelOrigin = measure.origin
      panelScale = measure.scale
      if naturalSize == nil {
        naturalSize = measure.size
        measurePass = 1
      } else if measure.pass >= 1 {
        fittedSize = measure.size
      }
    }
    .onChange(of: requested) { isRequested in
      if !isRequested {
        naturalSize = nil
        fittedSize = nil
        panelOrigin = nil
        panelScale = CGSize(width: 1, height: 1)
        measurePass = 0
      }
    }
  }
}

private struct CSTreeSelectMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSTreeSelectAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSTreeSelectPanelKey: PreferenceKey {
  static var defaultValue = CSTreeSelectMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSTreeSelectMeasure, nextValue: () -> CSTreeSelectMeasure) { value = nextValue() }
}

public struct CSTreeTableNode: Equatable {
  public var key: String
  public var label: String
  public var children: [CSTreeTableNode]
  public init(key: String, label: String = "", children: [CSTreeTableNode] = []) {
    self.key = key
    self.label = label
    self.children = children
  }
}

public struct CSTreeTableRow: Equatable {
  public var key: String
  public var label: String
  public var depth: Int
  public var expandable: Bool
  public var open: Bool
  public var children: [String]
}

public enum CSTreeTableModel {
  public static let wrapClass = "cs-table-wrap"
  public static let tableClass = "cs-table cs-treetable"
  public static let cellClass = "cs-treetable__cell"
  public static let twistClass = "cs-tree__twist"
  public static let emptyClass = "cs-table__empty"
  public static let openGlyph = "▾"
  public static let closedGlyph = "▸"
  public static func resolvedExpanded(expanded: [String]?, defaultExpanded: [String] = []) -> [String] {
    expanded ?? defaultExpanded
  }
  public static func rowId(prefix: String, key: String) -> String {
    prefix + "-row-" + key.utf16.map { String(format: "%04x", $0) }.joined()
  }

  public static func toggle(_ expanded: [String], _ key: String) -> [String] {
    expanded.contains(key) ? expanded.filter { $0 != key } : expanded + [key]
  }

  public static func rows(_ nodes: [CSTreeTableNode], expanded: [String], depth: Int = 0) -> [CSTreeTableRow] {
    nodes.flatMap { node in
      let open = expanded.contains(node.key)
      let row = CSTreeTableRow(key: node.key, label: node.label, depth: depth, expandable: !node.children.isEmpty, open: open, children: node.children.map(\.key))
      return open ? [row] + rows(node.children, expanded: expanded, depth: depth + 1) : [row]
    }
  }

  public static func indent(_ depth: Int) -> Int { depth * 18 }
  public static func cellGap() -> Double { CSControlsBatchStyleModel.treeTableCellGap() }

  public static func controls(prefix: String, children: [String], open: Bool) -> String? {
    guard open, !children.isEmpty else { return nil }
    return children.map { rowId(prefix: prefix, key: $0) }.joined(separator: " ")
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["empty": "Không có kết quả", "expand": "Mở rộng", "collapse": "Thu gọn"],
      "en": ["empty": "No results", "expand": "Expand", "collapse": "Collapse"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func word(_ text: String, fallback: String) -> String { text.isEmpty ? fallback : text }
  public static func showsCaption(_ caption: String?) -> Bool { caption?.isEmpty == false }
  public static func twistName(action: String, cell: String) -> String { action + " " + cell }
}

public struct CSTreeTable: View {
  public let columns: [String]
  public let nodes: [CSTreeTableNode]
  public let expanded: [String]
  public let defaultExpanded: [String]
  public let emptyLabel: String
  public let expandLabel: String
  public let collapseLabel: String
  public let caption: String?
  public let language: String?
  let onExpanded: ([String]) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var treeId = UUID().uuidString
  public init(columns: [String] = [], nodes: [CSTreeTableNode] = [], expanded: [String] = [], defaultExpanded: [String] = [], emptyLabel: String = "", expandLabel: String = "", collapseLabel: String = "", caption: String? = nil, language: String? = nil, onExpanded: @escaping ([String]) -> Void = { _ in }) {
    self.columns = columns
    self.nodes = nodes
    self.expanded = expanded.isEmpty ? defaultExpanded : expanded
    self.defaultExpanded = defaultExpanded
    self.emptyLabel = emptyLabel
    self.expandLabel = expandLabel
    self.collapseLabel = collapseLabel
    self.caption = caption
    self.language = language
    self.onExpanded = onExpanded
  }
  public var body: some View {
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let empty = CSTreeTableModel.word(emptyLabel, fallback: CSTreeTableModel.copy("empty", language: locale))
    let expand = CSTreeTableModel.word(expandLabel, fallback: CSTreeTableModel.copy("expand", language: locale))
    let collapse = CSTreeTableModel.word(collapseLabel, fallback: CSTreeTableModel.copy("collapse", language: locale))
    let visible = CSTreeTableModel.rows(nodes, expanded: expanded)
    VStack(alignment: .leading, spacing: 0) {
      if CSTreeTableModel.showsCaption(caption), let caption { Text(caption) }
      Text(columns.joined(separator: " "))
      if visible.isEmpty { Text(empty) }
      ForEach(Array(visible.enumerated()), id: \.offset) { _, row in
        let cell = row.label.isEmpty ? row.key : row.label
        HStack(alignment: .center, spacing: CGFloat(CSTreeTableModel.cellGap())) {
          if row.expandable {
            CSTriggerButton(row.open ? "▾" : "▸") { onExpanded(CSTreeTableModel.toggle(expanded, row.key)) }
              .accessibilityLabel(CSTreeTableModel.twistName(action: row.open ? collapse : expand, cell: cell))
              .accessibilityValue(row.open ? "true" : "false")
              .accessibilityCustomContent(AccessibilityCustomContentKey("Controls", id: "controls"), CSTreeTableModel.controls(prefix: treeId, children: row.children, open: row.open).map { Text($0) })
              .frame(minWidth: 44, minHeight: 44)
          }
          Text(cell)
        }
        .padding(.leading, CGFloat(CSTreeTableModel.indent(row.depth)))
        .frame(minHeight: 44, alignment: .leading)
        .accessibilityIdentifier(CSTreeTableModel.rowId(prefix: treeId, key: row.key))
      }
    }
  }
}

public enum CSTypingModel {
  public static let labelDefault = "Lumi is typing"
  public static let dotCount = 3
  public static let rootClass = "cs-typing"
  public static let role = "status"
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Lumi đang nhập"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSTypingIndicator: View {
  public let label: String?
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String? = nil, language: String? = nil) {
    self.label = label
    self.language = language
  }
  public var body: some View {
    let spoken = CSTypingModel.label(label, fallback: CSTypingModel.copy("label", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    HStack(spacing: CGFloat(CSAIStyleModel.typingGap())) {
      ForEach(0..<CSTypingModel.dotCount, id: \.self) { _ in
        Circle().frame(width: CGFloat(CSAIStyleModel.typingDotSize()), height: CGFloat(CSAIStyleModel.typingDotSize())).accessibilityHidden(true)
      }
    }
    .padding(.vertical, CGFloat(CSAIStyleModel.typingPaddingY()))
    .padding(.horizontal, CGFloat(CSAIStyleModel.typingPaddingX()))
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(spoken)
    .accessibilityAddTraits(.updatesFrequently)
  }
}
