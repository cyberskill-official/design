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

  public static func submits(composing: Bool, keyCode: Int) -> Bool {
    !composing && keyCode != 229
  }
}

public enum CSInlineEditModel {
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

  public init(bindings: [(keys: String, description: String)], help: Bool = true, language: String? = nil, onTrigger: @escaping (String) -> Void = { _ in }) {
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
        VStack(alignment: .leading, spacing: 8) {
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
  public let pointLabels: [String]
  public let showValues: Bool
  public let emptyLabel: String
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String, values: [Double], type: String = "bar", pointLabels: [String] = [], showValues: Bool = false, emptyLabel: String = "", dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.values = values
    self.type = type
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
    let points = pointLabels.enumerated().map { index, name in
      (label: name, value: index < values.count ? values[index] : 0)
    }
    let announced = CSChartModel.accessibleName(label: label, points: points, empty: CSChartModel.emptyWord(emptyLabel, fallback: CSChartModel.copy("empty", language: locale)))
    let rows = CSChartModel.legend(type: type, labels: pointLabels, values: values, showValues: showValues)
    VStack(alignment: .leading, spacing: 8) {
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
        let points = CSChartModel.line(values)
        var path = Path()
        for (index, point) in points.enumerated() {
          let mark = CGPoint(x: point.x / 320 * size.width, y: point.y / 160 * size.height)
          if index == 0 { path.move(to: mark) } else { path.addLine(to: mark) }
        }
        context.stroke(path, with: .color(color), lineWidth: 2.4)
        if kind == "line" {
          for point in points {
            let mark = CGPoint(x: point.x / 320 * size.width, y: point.y / 160 * size.height)
            context.fill(Path(ellipseIn: CGRect(x: mark.x - 3.4, y: mark.y - 3.4, width: 6.8, height: 6.8)), with: .color(color))
          }
        }
      } else {
        let scaleX = size.width / 320
        let scaleY = size.height / 160
        for bar in CSChartModel.bars(values) where bar.height > 0 {
          let rect = CGRect(x: bar.x * scaleX, y: bar.y * scaleY, width: bar.width * scaleX, height: bar.height * scaleY)
          context.fill(Path(roundedRect: rect, cornerRadius: 3), with: .color(color))
        }
      }
    }
    .frame(width: 320, height: 160)
    if let rows {
      HStack(spacing: 12) {
        ForEach(Array(rows.enumerated()), id: \.offset) { _, row in Text(row) }
      }
    }
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(announced)
  }
}

public struct CSTerminal: View {
  public let title: String?
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

  public init(title: String? = nil, prompt: String = "➜", history: [CSTerminalLine], dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onCommand: @escaping (String) -> String? = { _ in nil }) {
    self.title = title
    self.prompt = prompt
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onCommand = onCommand
    _lines = State(initialValue: history)
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
    VStack(alignment: .leading) {
      Text(bar).foregroundStyle(pack.primaryTextColor)
      ForEach(Array(lines.enumerated()), id: \.offset) { _, line in
        if let command = line.command { Text(prompt + " " + command).foregroundStyle(pack.colorBrandOchre.color) }
        if let output = line.output { Text(output).foregroundStyle(pack.mutedColor) }
      }
      HStack {
        Text(prompt).foregroundStyle(pack.colorBrandOchre.color)
        TextField("", text: $draft)
          .focused($focused)
          .accessibilityLabel(inputName)
          .onSubmit(submit)
          .onChange(of: focused) { isFocused in
            if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
          }
      }
    }
    .padding(12)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(pack.colorSurfacePanel.color)
  }
}

public struct CSInlineEdit: View {
  public let label: String
  public let value: String
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
  public init(label: String, value: String, dark: Bool, highContrast: Bool, compact: Bool, editAction: String = "", emptyLabel: String = "", language: String? = nil, onChange: @escaping (String) -> Void) {
    self.label = label
    self.value = value
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
        Button(shown) {
          claimEdit()
          closed = false
          cancelling = false
          draft = value
          editing = true
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
  public let hint: String?
  public let error: String?
  public let required: Bool
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let content: () -> Content
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(label: String, hint: String? = nil, error: String? = nil, required: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
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
    VStack(alignment: .leading, spacing: 4) {
      HStack(spacing: 4) {
        if CSFormFieldModel.showsLabel(label) {
          Text(label).foregroundStyle(pack.primaryTextColor)
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
  public var body: some View { VStack(alignment: .leading, spacing: 12) { content() }.environment(\.csFormAncestor, true) }
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
    VStack(alignment: .leading, spacing: 8) {
      if let legend, !legend.isEmpty { Text(legend).accessibilityAddTraits(.isHeader) }
      content()
    }
    .disabled(disabled)
    .environment(\.csFormAncestor, true)
    .accessibilityElement(children: .contain)
  }
}

public enum CSFormArrayModel {
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

  public init(label: String? = nil, rows: [String], addLabel: String? = nil, removeLabel: String, min: Int = 0, max: Int = 50, language: String? = nil, onChange: @escaping ([String]) -> Void) {
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
      VStack(alignment: .leading) {
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
  public static func advance(index: Int, count: Int, pending: Bool, values: [String: String], required: [String], fallback: String) -> CSWizardAdvance? {
    if pending { return nil }
    var messages: [String] = []
    for name in required {
      if let message = requiredMessage(values[name], fallback: fallback) { messages.append(message) }
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
  public let submission: String?
  public let pending: Bool
  public let language: String?
  let onIndex: (Int) -> Void
  let onComplete: () -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var ruled: [String]?

  public init(steps: [String], index: Int, backLabel: String? = nil, nextLabel: String? = nil, finishLabel: String? = nil, errors: [String] = [], values: [String: String] = [:], required: [String] = [], submission: String? = nil, pending: Bool = false, language: String? = nil, onIndex: @escaping (Int) -> Void, onComplete: @escaping () -> Void = {}) {
    self.steps = steps
    self.index = steps.isEmpty ? 0 : min(steps.count - 1, max(0, index))
    self.backLabel = backLabel
    self.nextLabel = nextLabel
    self.finishLabel = finishLabel
    self.errors = errors
    self.values = values
    self.required = required
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
    VStack(alignment: .leading, spacing: 8) {
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
            guard let step = CSFormWizardModel.advance(index: index, count: steps.count, pending: pending, values: values, required: required, fallback: fallback) else { return }
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
  public static func isOpen(requested: Bool, disabled: Bool) -> Bool { requested && !disabled }
  public static func dismissOutside(open: Bool, inside: Bool) -> Bool { open && !inside }
  public static let panelGap = 6.0
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double) -> CSCascaderPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: "bottom-start", gap: panelGap) else { return nil }
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
}

public struct CSCascader: View {
  public let label: String?
  public let labelledBy: String?
  public let path: [String]
  public let nodes: [CSCascaderNode]
  public let placeholder: String?
  public let disabled: Bool
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

  public init(label: String? = nil, labelledBy: String? = nil, path: [String], nodes: [CSCascaderNode] = [], placeholder: String? = nil, disabled: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping ([String]) -> Void = { _ in }) {
    self.label = label
    self.labelledBy = labelledBy
    self.path = path
    self.nodes = nodes
    self.placeholder = placeholder
    self.disabled = disabled
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
      .accessibilityValue(opened ? "true" : "false")
      .frame(minHeight: 44, alignment: .leading)
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSCascaderAnchorKey.self, value: geo.frame(in: .global))
      })
      if opened {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSCascaderModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height))
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
  let onSelect: (String) -> Void
  @State private var hover: Int? = nil
  @State private var dockId = UUID().uuidString
  @FocusState private var focused: Int?
  public init(label: String, items: [String], onSelect: @escaping (String) -> Void) {
    self.label = label
    self.items = items
    self.onSelect = onSelect
  }
  public var body: some View {
    HStack {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        let mark = CSDockModel.scale(index: index, hover: hover)
        Button(item) {
          CSFocusRegistry.shared.claim(id: "\(dockId)-\(index)", restore: { focused = index })
          onSelect(item)
        }
          .frame(minWidth: 44, minHeight: 44)
          .scaleEffect(mark.scale)
          .offset(y: mark.lift)
          .focused($focused, equals: index)
          .onHover { inside in if inside { hover = index } }
      }
    }
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
  public let language: String?
  @Binding var text: String
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @State private var bold = false
  @State private var italic = false
  @State private var list = false

  public init(label: String? = nil, text: Binding<String>, language: String? = nil) {
    self.label = label
    self.language = language
    _text = text
  }

  private func applyFormat(_ command: String) {
    let next = CSEditorModel.apply(text, command: command, start: 0, end: text.count)
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
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let spoken = CSEditorModel.name(label, fallback: CSEditorModel.copy("area", language: locale))
    VStack(alignment: .leading, spacing: 8) {
      HStack(spacing: 0) {
        formatButton("B", name: CSEditorModel.copy("bold", language: locale), pressed: bold) { applyFormat("bold") }
        formatButton("I", name: CSEditorModel.copy("italic", language: locale), pressed: italic) { applyFormat("italic") }
        formatButton("≔", name: CSEditorModel.copy("list", language: locale), pressed: list) { applyFormat("insertUnorderedList") }
      }
      .accessibilityElement(children: .contain)
      .accessibilityLabel(CSEditorModel.copy("toolbar", language: locale))
      TextField(spoken, text: Binding(get: { text }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        text = next
      }), axis: .vertical)
        .lineLimit(6...12)
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
    }
  }
}

public enum CSHoverCardModel {
  public static let placementDefault = "bottom-start"
  public static let gap = 8.0
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
  public init(label: String, openDelay: Int = 150, closeDelay: Int = 200, placement: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
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
          Text(label).padding(8)
            .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
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
  public init(risk: String? = nil, summary: String, reviewer: String? = nil, approveLabel: String? = nil, rejectLabel: String? = nil, language: String? = nil, onApprove: @escaping () -> Void, onReject: @escaping () -> Void) {
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
    VStack(alignment: .leading) {
      Text(riskText)
      Text(summary)
      if let line = CSHumanReviewModel.reviewerLine(reviewer, prefix: CSHumanReviewModel.copy("reviewer", language: locale)) { Text(line) }
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

  public init(label: String? = nil, text: Binding<String>, prefixText: String? = nil, suffixText: String? = nil, clearable: Bool = false, password: Bool = false, revealed: Binding<Bool>, disabled: Bool = false, readOnly: Bool = false, language: String? = nil, onChange: @escaping (String) -> Void = { _ in }) {
    self.label = label
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
    let spoken = CSInputGroupModel.addonName(ariaLabel: nil, hasLabel: CSInputGroupModel.showsLabel(label), hasLabelledBy: false, placeholder: nil, fallback: CSInputGroupModel.copy("input", language: locale))
    let clearName = CSInputGroupModel.copy("clear", language: locale)
    let revealName = CSInputGroupModel.revealLabel(revealed: revealed, show: CSInputGroupModel.copy("show", language: locale), hide: CSInputGroupModel.copy("hide", language: locale))
    VStack(alignment: .leading, spacing: 4) {
      if CSInputGroupModel.showsLabel(label), let label { Text(label) }
      HStack {
        if CSInputGroupModel.showsAddon(prefixText), let prefixText { Text(prefixText) }
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
        if CSInputGroupModel.showsAddon(suffixText), let suffixText { Text(suffixText) }
      }
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
        SecureField("", text: binding)
      } else {
        TextField("", text: binding)
      }
    }
    .focused($focused)
    .onChange(of: focused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
    }
    .disabled(disabled)
  }
}

public struct CSItem: View {
  public let title: String
  public let subtitle: String
  public init(title: String, subtitle: String = "") { self.title = title; self.subtitle = subtitle }
  public var body: some View { VStack(alignment: .leading) { Text(title); if !subtitle.isEmpty { Text(subtitle) } }.frame(minHeight: 44, alignment: .leading) }
}

public struct CSLocaleProvider<Content: View>: View {
  public let language: String
  let content: () -> Content
  public init(language: String, @ViewBuilder content: @escaping () -> Content) { self.language = language; self.content = content }
  public var body: some View { content().environment(\.locale, Locale(identifier: language == "vi" ? "vi" : "en")) }
}

public struct CSLumiAvatar: View {
  public let alt: String
  public let size: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public init(alt: String = "Lumi", size: String = "md", dark: Bool, highContrast: Bool, compact: Bool) {
    self.alt = alt
    self.size = size
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }
  public var body: some View {
    CSIcon(name: "sparkle", size: size, label: alt, dark: dark, highContrast: highContrast, compact: compact)
  }
}

public struct CSMasonry<Content: View>: View {
  public let columns: Int
  let content: () -> Content
  public init(columns: Int = 3, @ViewBuilder content: @escaping () -> Content) { self.columns = max(1, columns); self.content = content }
  public var body: some View { content() }
}

public struct CSMenuItem: View {
  public let title: String
  let action: () -> Void
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool
  public init(title: String, action: @escaping () -> Void) { self.title = title; self.action = action }
  public var body: some View {
    let restore = { ownerFocused = true }
    Button(title) {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }
    .focused($ownerFocused)
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
  public let error: String?
  public let placeholder: String?
  public let hasChildren: Bool
  public let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @Binding var selection: String
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  public init(label: String, options: [CSNativeSelectOption], selection: Binding<String>, error: String? = nil, placeholder: String? = nil, hasChildren: Bool = false, disabled: Bool = false, dark: Bool = false, highContrast: Bool = false, compact: Bool = false) {
    self.label = label
    self.options = options
    self.error = error
    self.placeholder = placeholder
    self.hasChildren = hasChildren
    self.disabled = disabled
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
        .accessibilityLabel(shownLabel ? label : "")
        .accessibilityValue(blank ? prompt : selection)
        .overlay(alignment: .trailing) {
          CSIcon(name: "chevron-down", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .foregroundStyle(pack.mutedColor)
            .padding(.trailing, 12)
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

public struct CSNavItem: View {
  public let title: String
  public let active: Bool
  let action: () -> Void
  public init(title: String, active: Bool, action: @escaping () -> Void) { self.title = title; self.active = active; self.action = action }
  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool
  public var body: some View {
    let restore = { ownerFocused = true }
    Button(title) {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }
    .focused($ownerFocused)
    .frame(minHeight: 44)
    .accessibilityAddTraits(active ? .isSelected : [])
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
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
  public init(label: String, submitLabel: String? = nil, text: Binding<String>, disabled: Bool = false, busy: Bool = false, placeholder: String? = nil, hint: String? = nil, ariaLabel: String? = nil, language: String? = nil, onSubmit: @escaping (String) -> Void) {
    self.label = label
    self.submitLabel = submitLabel
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
    let sendName = CSPromptInputModel.send(submitLabel, fallback: CSPromptInputModel.copy("send", language: locale))
    VStack(alignment: .leading, spacing: 8) {
      TextField(prompt, text: Binding(get: { text }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        text = next
      }))
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
        .disabled(!CSPromptInputModel.canType(disabled: disabled))
        .accessibilityLabel(spoken)
      if let hint = CSPromptInputModel.hintText(hint, fallback: CSPromptInputModel.copy("hint", language: locale)) {
        HStack(spacing: 6) {
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
  public init(suggestions: [CSPromptSuggestion], dark: Bool = false, highContrast: Bool = false, compact: Bool = false, onSelect: @escaping (String) -> Void) {
    self.suggestions = suggestions
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
  }
  public var body: some View {
    VStack(alignment: .leading) {
      ForEach(Array(suggestions.enumerated()), id: \.offset) { index, item in
        Button {
          CSFocusRegistry.shared.claim(id: "\(focusId)-\(index)", restore: { focused = index })
          if let label = CSPromptSuggestionsModel.chosen(CSPromptSuggestionsModel.selectedLabel(item), hasHandler: true) { onSelect(label) }
        } label: {
          HStack(spacing: 8) {
            let icon = CSPromptSuggestionsModel.iconName(item.icon)
            if !icon.isEmpty {
              CSIcon(name: icon, label: "", dark: dark, highContrast: highContrast, compact: compact)
            }
            Text(item.label)
          }
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

public struct CSQRCode: View {
  public let value: String
  public let label: String
  public init(value: String, label: String) { self.value = value; self.label = label }
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
        .frame(width: 128, height: 128)
      } else {
        Text("—").frame(width: 128, height: 128)
      }
    }
    .accessibilityLabel(label.isEmpty ? value : label)
  }
}

public enum CSTreeSelectModel {
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
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double) -> CSTreeSelectPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: "bottom-start", gap: panelGap) else { return nil }
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
  public let nodes: [CSTreeNode]
  public let selected: String?
  public let placeholder: String?
  public let disabled: Bool
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

  public init(label: String? = nil, labelledBy: String? = nil, nodes: [CSTreeNode], open: [String: Bool] = [:], selected: String?, placeholder: String? = nil, disabled: Bool = false, dark: Bool = false, highContrast: Bool = false, compact: Bool = false, language: String? = nil, onSelect: @escaping (String) -> Void) {
    self.label = label
    self.labelledBy = labelledBy
    self.nodes = nodes
    self.selected = selected
    self.placeholder = placeholder
    self.disabled = disabled
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
    _expanded = State(initialValue: open)
  }

  public var body: some View {
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
      .accessibilityValue(opened ? "true" : "false")
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSTreeSelectAnchorKey.self, value: geo.frame(in: .global))
      })
      if opened {
        let screen = CSContextMenuModel.screenSize()
        let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let placed = naturalSize.flatMap { natural in
          fittedSize.flatMap { fitted in
            CSTreeSelectModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height))
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
}

public enum CSTreeTableModel {
  public static func rowId(prefix: String, key: String) -> String {
    prefix + "-row-" + key.utf16.map { String(format: "%04x", $0) }.joined()
  }

  public static func toggle(_ expanded: [String], _ key: String) -> [String] {
    expanded.contains(key) ? expanded.filter { $0 != key } : expanded + [key]
  }

  public static func rows(_ nodes: [CSTreeTableNode], expanded: [String], depth: Int = 0) -> [CSTreeTableRow] {
    nodes.flatMap { node in
      let open = expanded.contains(node.key)
      let row = CSTreeTableRow(key: node.key, label: node.label, depth: depth, expandable: !node.children.isEmpty, open: open)
      return open ? [row] + rows(node.children, expanded: expanded, depth: depth + 1) : [row]
    }
  }

  public static func indent(_ depth: Int) -> Int { depth * 18 }

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
  public let emptyLabel: String
  public let expandLabel: String
  public let collapseLabel: String
  public let caption: String?
  public let language: String?
  let onExpanded: ([String]) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage
  public init(columns: [String], nodes: [CSTreeTableNode], expanded: [String] = [], emptyLabel: String = "", expandLabel: String = "", collapseLabel: String = "", caption: String? = nil, language: String? = nil, onExpanded: @escaping ([String]) -> Void = { _ in }) {
    self.columns = columns
    self.nodes = nodes
    self.expanded = expanded
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
        HStack(spacing: 8) {
          if row.expandable {
            CSTriggerButton(row.open ? "▾" : "▸") { onExpanded(CSTreeTableModel.toggle(expanded, row.key)) }
              .accessibilityLabel(CSTreeTableModel.twistName(action: row.open ? collapse : expand, cell: cell))
              .accessibilityValue(row.open ? "true" : "false")
              .frame(minWidth: 44, minHeight: 44)
          }
          Text(cell)
        }
        .padding(.leading, CGFloat(CSTreeTableModel.indent(row.depth)))
        .frame(minHeight: 44, alignment: .leading)
      }
    }
  }
}

public enum CSTypingModel {
  public static let labelDefault = "Lumi is typing"
  public static let dotCount = 3
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
    HStack(spacing: 4) {
      ForEach(0..<CSTypingModel.dotCount, id: \.self) { _ in
        Circle().frame(width: 6, height: 6).accessibilityHidden(true)
      }
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(spoken)
    .accessibilityAddTraits(.updatesFrequently)
  }
}
