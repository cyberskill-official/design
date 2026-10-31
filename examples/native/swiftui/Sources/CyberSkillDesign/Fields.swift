import SwiftUI
#if os(macOS)
import AppKit
#elseif os(iOS)
import UIKit
#endif

public struct CSCalendarDate: Equatable {
  public var year: Int
  public var month: Int
  public var day: Int

  public init(year: Int, month: Int, day: Int) {
    self.year = year
    self.month = month
    self.day = day
  }
}

public enum CSCalendarModel {
  public static func leap(_ year: Int) -> Bool {
    year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
  }

  public static func days(year: Int, month: Int) -> Int {
    switch month + 1 {
    case 2: return leap(year) ? 29 : 28
    case 4, 6, 9, 11: return 30
    default: return 31
    }
  }

  public static func weekday(year: Int, month: Int, day: Int) -> Int {
    var year = year
    let monthNumber = month + 1
    let table = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
    if monthNumber < 3 { year -= 1 }
    return (year + year / 4 - year / 100 + year / 400 + table[monthNumber - 1] + day) % 7
  }

  public static func grid(year: Int, month: Int) -> [Int?] {
    let lead = (weekday(year: year, month: month, day: 1) + 6) % 7
    var cells = Array<Int?>(repeating: nil, count: lead)
    cells.append(contentsOf: (1...days(year: year, month: month)).map { Optional($0) })
    while cells.count % 7 != 0 { cells.append(nil) }
    return cells
  }

  public static func addDays(_ date: CSCalendarDate, delta: Int) -> CSCalendarDate {
    var year = date.year
    var month = date.month
    var day = date.day + delta
    while true {
      let count = days(year: year, month: month)
      if day > count {
        day -= count
        month += 1
        if month > 11 { month = 0; year += 1 }
      } else if day < 1 {
        month -= 1
        if month < 0 { month = 11; year -= 1 }
        day += days(year: year, month: month)
      } else {
        return CSCalendarDate(year: year, month: month, day: day)
      }
    }
  }

  public static func addMonths(_ date: CSCalendarDate, delta: Int) -> CSCalendarDate {
    var year = date.year
    var month = date.month + delta
    while month > 11 { month -= 12; year += 1 }
    while month < 0 { month += 12; year -= 1 }
    return CSCalendarDate(year: year, month: month, day: min(date.day, days(year: year, month: month)))
  }

  public static let previousDefault = "Previous month"
  public static let nextDefault = "Next month"
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["prev": "Tháng trước", "next": "Tháng sau"],
      "en": ["prev": previousDefault, "next": nextDefault],
      "ja": ["prev": "前の月", "next": "次の月"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func shiftView(year: Int, month: Int, delta: Int) -> (year: Int, month: Int) {
    var nextYear = year
    var nextMonth = month + delta
    while nextMonth > 11 { nextMonth -= 12; nextYear += 1 }
    while nextMonth < 0 { nextMonth += 12; nextYear -= 1 }
    return (nextYear, nextMonth)
  }
  public static func weekdays(_ language: String) -> [String] {
    switch language {
    case "vi": return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
    case "ja": return ["月", "火", "水", "木", "金", "土", "日"]
    default: return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    }
  }
  public static func monthLanguage(_ language: String?) -> String {
    guard let language else { return "vi" }
    let trimmed = language.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty { return "vi" }
    let lower = trimmed.lowercased().replacingOccurrences(of: "_", with: "-")
    if lower == "tiếng việt" || lower == "tieng viet" { return "vi" }
    if lower == "english" { return "en" }
    if lower == "日本語" || lower == "japanese" { return "ja" }
    return lower.split(separator: "-").first.map(String.init) ?? "vi"
  }
  public static func monthTitle(index: Int, language: String?) -> String {
    let code = monthLanguage(language)
    let vi = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    let en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let safe = min(11, max(0, index))
    if code == "vi" { return vi[safe] }
    if code == "en" { return en[safe] }
    return "\(safe + 1)月"
  }
  public static func heading(month: Int, year: Int, language: String?) -> String {
    "\(monthTitle(index: month, language: language)) \(year)"
  }

  public static func dayLanguage(_ language: String?) -> String {
    guard let language else { return "en" }
    let trimmed = language.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty { return "en" }
    let lower = trimmed.lowercased().replacingOccurrences(of: "_", with: "-")
    if lower == "tiếng việt" || lower == "tieng viet" { return "vi" }
    if lower == "english" { return "en" }
    if lower == "日本語" || lower == "japanese" { return "ja" }
    let primary = lower.split(separator: "-").first.map(String.init) ?? ""
    if primary == "vi" || primary == "ja" { return primary }
    return "en"
  }

  public static func dayName(year: Int, month: Int, day: Int, language: String?) -> String {
    let code = dayLanguage(language)
    let index = weekday(year: year, month: month, day: day)
    let enDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let viDays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
    let jaDays = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
    let safeMonth = min(11, max(0, month))
    if code == "vi" { return "\(viDays[index]), \(day) tháng \(safeMonth + 1), \(year)" }
    if code == "ja" { return "\(year)年\(safeMonth + 1)月\(day)日\(jaDays[index])" }
    let enMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return "\(enDays[index]), \(enMonths[safeMonth]) \(day), \(year)"
  }

  public static func isCurrentDate(year: Int, month: Int, day: Int, now: CSCalendarDate) -> Bool {
    year == now.year && month == now.month && day == now.day
  }

  public static func tabStop(day: Int, focused: Int, monthDays: Int) -> Int {
    let active = min(max(focused, 1), max(monthDays, 1))
    return day == active ? 0 : -1
  }

  public static func currentDate(now: Date = Date(), calendar: Calendar = .current) -> CSCalendarDate {
    let parts = calendar.dateComponents([.year, .month, .day], from: now)
    return CSCalendarDate(year: parts.year ?? 1, month: max(0, (parts.month ?? 1) - 1), day: parts.day ?? 1)
  }

  public static func focusDate(year: Int, month: Int, day: Int, key: CSCalendarKey, shift: Bool = false) -> CSCalendarDate {
    let current = CSCalendarDate(year: year, month: month, day: day)
    switch key {
    case .left: return addDays(current, delta: -1)
    case .right: return addDays(current, delta: 1)
    case .up: return addDays(current, delta: -7)
    case .down: return addDays(current, delta: 7)
    case .home: return CSCalendarDate(year: year, month: month, day: 1)
    case .end: return CSCalendarDate(year: year, month: month, day: days(year: year, month: month))
    case .pageUp, .pageDown:
      let offset = (key == .pageUp ? -1 : 1) * (shift ? 12 : 1)
      let shifted = addMonths(CSCalendarDate(year: year, month: month, day: 1), delta: offset)
      return CSCalendarDate(year: shifted.year, month: shifted.month, day: min(day, days(year: shifted.year, month: shifted.month)))
    }
  }
}

public enum CSCalendarKey {
  case left
  case right
  case up
  case down
  case home
  case end
  case pageUp
  case pageDown
}

public struct CSComboboxOption: Equatable, ExpressibleByStringLiteral {
  public var value: String
  public var label: String
  public init(value: String, label: String) {
    self.value = value
    self.label = label
  }
  public init(stringLiteral value: String) {
    self.init(value: value, label: value)
  }
}

public enum CSComboboxModel {
  public static let placeholderDefault = "Select or type…"
  public static let labelDefault = "Choose an option"
  public static let emptyDefault = "No results"
  public static func placeholder(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func listName(label: String?, labelledBy: String?, fallback: String) -> String? {
    if let label, !label.isEmpty { return label }
    if let labelledBy, !labelledBy.isEmpty { return nil }
    return fallback
  }
  public static func emptyText(count: Int, fallback: String) -> String? { count == 0 ? fallback : nil }
  public static func display(open: Bool, query: String, selected: String?) -> String { open ? query : (selected ?? query) }
  public static let panelGap = 6.0
  public static let caret = "▾"
  public static func primaryLanguage(_ tag: String?) -> String? {
    guard let tag else { return nil }
    let raw = tag.trimmingCharacters(in: .whitespacesAndNewlines)
    if raw.isEmpty { return nil }
    let lower = raw.lowercased().replacingOccurrences(of: "_", with: "-")
    if lower == "tiếng việt" || lower == "tieng viet" { return "vi" }
    if lower == "english" { return "en" }
    if lower == "日本語" || lower == "japanese" { return "ja" }
    let primary = lower.split(separator: "-", maxSplits: 1).first.map(String.init) ?? ""
    return primary.isEmpty ? nil : primary
  }
  public static func resolvedLanguage(explicit: String?, ancestor: String?) -> String? {
    primaryLanguage(explicit) ?? primaryLanguage(ancestor)
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Chọn hoặc nhập…", "label": "Chọn mục", "empty": "Không có kết quả"],
      "en": ["placeholder": placeholderDefault, "label": labelDefault, "empty": emptyDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func allowsOpen(_ requested: Bool, disabled: Bool) -> Bool { requested && !disabled }
  public static func matchedWidth(_ anchorWidth: Double, viewportWidth: Double) -> Double {
    min(anchorWidth, max(0, viewportWidth))
  }
  public static func usesWindowPortal(inForm: Bool, inFieldset: Bool = false) -> Bool { !(inForm || inFieldset) }
  public static func ignoresKey(composing: Bool) -> Bool { composing }
  public static func showsMessage(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func shown(options: [CSComboboxOption], query: String) -> [CSComboboxOption] {
    let needle = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    if needle.isEmpty { return options }
    return options.filter { $0.label.lowercased().contains(needle) }
  }
  public static func label(value: String?, options: [CSComboboxOption]) -> String? {
    guard let value else { return nil }
    return options.first { $0.value == value }?.label
  }
  public static func display(open: Bool, query: String, value: String?, options: [CSComboboxOption]) -> String {
    open ? query : (label(value: value, options: options) ?? query)
  }
  public static func shown(labels: [String], query: String) -> [String] {
    let needle = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    if needle.isEmpty { return labels }
    return labels.filter { $0.lowercased().contains(needle) }
  }

  public static func highlight(current: Int, count: Int, down: Bool) -> Int {
    guard count > 0 else { return 0 }
    return down ? min(count - 1, current + 1) : max(0, current - 1)
  }
}

public struct CSCalendar: View {
  public let monthLabel: String
  public let weekdayLabels: [String]
  public let year: Int
  public let month: Int
  @State private var viewYear: Int
  @State private var viewMonth: Int
  @State private var focusedDay: Int
  @FocusState private var dayFocus: Int?
  @State private var calendarFocusId = UUID().uuidString
  @State private var keysArmed = false
  public let selected: Int?
  public let language: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (Int) -> Void
  let onShift: (Int) -> Void
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(monthLabel: String, weekdayLabels: [String], year: Int, month: Int, selected: Int?, language: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onSelect: @escaping (Int) -> Void, onShift: @escaping (Int) -> Void = { _ in }) {
    self.monthLabel = monthLabel
    self.weekdayLabels = weekdayLabels
    self.year = year
    self.month = month
    _viewYear = State(initialValue: year)
    _viewMonth = State(initialValue: month)
    _focusedDay = State(initialValue: selected ?? 1)
    self.selected = selected
    self.language = language
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
    self.onShift = onShift
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let cells = CSCalendarModel.grid(year: viewYear, month: viewMonth)
    let today = CSCalendarModel.currentDate()
    VStack(alignment: .leading, spacing: 8) {
      HStack {
        CSTriggerButton("‹") {
          let next = CSCalendarModel.shiftView(year: viewYear, month: viewMonth, delta: -1)
          viewYear = next.year
          viewMonth = next.month
          onShift(-1)
        }
          .accessibilityLabel(CSCalendarModel.copy("prev", language: spoken))
          .frame(minWidth: 44, minHeight: 44)
        Text(CSCalendarModel.heading(month: viewMonth, year: viewYear, language: spoken)).foregroundStyle(pack.primaryTextColor)
        Spacer()
        CSTriggerButton("›") {
          let next = CSCalendarModel.shiftView(year: viewYear, month: viewMonth, delta: 1)
          viewYear = next.year
          viewMonth = next.month
          onShift(1)
        }
          .accessibilityLabel(CSCalendarModel.copy("next", language: spoken))
          .frame(minWidth: 44, minHeight: 44)
      }
      LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 4), count: 7), spacing: 4) {
        ForEach(Array(weekdayLabels.enumerated()), id: \.offset) { _, label in
          Text(label).foregroundStyle(pack.mutedColor)
        }
        ForEach(Array(cells.enumerated()), id: \.offset) { _, day in
          if let day {
            Button(String(day)) {
              CSFocusRegistry.shared.claim(id: calendarFocusId, restore: { dayFocus = day })
              focusedDay = day
              onSelect(day)
            }
              .frame(minWidth: 44, minHeight: 44)
              .fontWeight(day == min(focusedDay, CSCalendarModel.days(year: viewYear, month: viewMonth)) ? .bold : .regular)
              .foregroundStyle(selected == day ? pack.colorBrandOchre.color : pack.primaryTextColor)
              .accessibilityLabel(CSCalendarModel.dayName(year: viewYear, month: viewMonth, day: day, language: spoken))
              .accessibilityValue(CSCalendarModel.isCurrentDate(year: viewYear, month: viewMonth, day: day, now: today) ? "date" : "")
              .accessibilityAddTraits(selected == day ? .isSelected : [])
              .focusable(CSCalendarModel.tabStop(day: day, focused: focusedDay, monthDays: CSCalendarModel.days(year: viewYear, month: viewMonth)) == 0)
              .focused($dayFocus, equals: day)
          } else {
            Color.clear.frame(width: 44, height: 44).accessibilityHidden(true)
          }
        }
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSCalendarModel.heading(month: viewMonth, year: viewYear, language: spoken))
    .onChange(of: dayFocus) { day in
      if let day {
        keysArmed = true
        CSFocusRegistry.shared.claim(id: calendarFocusId, restore: { dayFocus = day })
      }
    }
    .csRovingKeys { key, shift in moveFocusedDay(key: key, shift: shift) }
    .background(CSCalendarMacKeys(active: dayFocus != nil) { key, shift in moveFocusedDay(key: key, shift: shift) })
    .background(CSCalendarPadKeys(active: keysArmed, onResign: { keysArmed = false }) { key, shift in
      moveFocusedDay(key: key, shift: shift, requireFocus: false)
    })
  }

  private func moveFocusedDay(key: CSRovingKey, shift: Bool, requireFocus: Bool = true) -> Bool {
    guard !requireFocus || dayFocus != nil else { return false }
    let mapped: CSCalendarKey
    switch key {
    case .left: mapped = .left
    case .right: mapped = .right
    case .up: mapped = .up
    case .down: mapped = .down
    case .home: mapped = .home
    case .end: mapped = .end
    case .pageUp: mapped = .pageUp
    case .pageDown: mapped = .pageDown
    }
    let active = min(focusedDay, CSCalendarModel.days(year: viewYear, month: viewMonth))
    let next = CSCalendarModel.focusDate(year: viewYear, month: viewMonth, day: active, key: mapped, shift: shift)
    viewYear = next.year
    viewMonth = next.month
    focusedDay = next.day
    dayFocus = next.day
    return true
  }
}

#if os(macOS)
private struct CSCalendarMacKeys: NSViewRepresentable {
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

  static func dismantleNSView(_ nsView: NSView, coordinator: Coordinator) {
    coordinator.remove()
  }

  final class Coordinator {
    var monitor: Any?
    var onKey: ((CSRovingKey, Bool) -> Bool)?

    func install(active: Bool, onKey: @escaping (CSRovingKey, Bool) -> Bool) {
      self.onKey = onKey
      guard active else { remove(); return }
      guard #unavailable(macOS 14) else { remove(); return }
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
#else
private struct CSCalendarMacKeys: View {
  var active: Bool
  var onKey: (CSRovingKey, Bool) -> Bool
  var body: some View {
    let _ = (active, onKey)
    return Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
  }
}
#endif

#if os(iOS)
private struct CSCalendarPadKeys: UIViewRepresentable {
  var active: Bool
  var onResign: () -> Void
  var onKey: (CSRovingKey, Bool) -> Bool

  func makeUIView(context: Context) -> CSCalendarPadKeyView {
    let view = CSCalendarPadKeyView()
    view.onKey = onKey
    view.onResign = onResign
    return view
  }

  func updateUIView(_ uiView: CSCalendarPadKeyView, context: Context) {
    uiView.onKey = onKey
    uiView.onResign = onResign
    guard active else { return }
    guard #unavailable(iOS 17) else { return }
    if !uiView.isFirstResponder { uiView.becomeFirstResponder() }
  }
}

private final class CSCalendarPadKeyView: UIView {
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
#else
private struct CSCalendarPadKeys: View {
  var active: Bool
  var onResign: () -> Void
  var onKey: (CSRovingKey, Bool) -> Bool
  var body: some View {
    let _ = (active, onResign, onKey)
    return Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
  }
}
#endif

#if os(iOS)
private enum CSComboboxResponder {
  static weak var current: UIResponder?
}
extension UIResponder {
  @objc func csReportComboboxResponder(_ sender: Any?) {
    CSComboboxResponder.current = self
  }
}
private func csComboboxMarked(_ responder: UIResponder?) -> Bool {
  var node: UIResponder? = responder
  var hops = 0
  while let current = node, hops < 8 {
    if csComboboxInputMarked(current) { return true }
    node = current.next
    hops += 1
  }
  guard let view = responder as? UIView else { return false }
  if csComboboxMarkedChildren(view, depth: 0) { return true }
  var parent = view.superview
  var up = 0
  while let current = parent, up < 8 {
    if csComboboxInputMarked(current) { return true }
    parent = current.superview
    up += 1
  }
  return false
}
private func csComboboxInputMarked(_ responder: UIResponder) -> Bool {
  guard let input = responder as? UITextInput else { return false }
  return input.markedTextRange != nil
}
private func csComboboxMarkedChildren(_ view: UIView, depth: Int) -> Bool {
  if depth > 3 { return false }
  if csComboboxInputMarked(view) { return true }
  for child in view.subviews {
    if csComboboxMarkedChildren(child, depth: depth + 1) { return true }
  }
  return false
}
#endif

private struct CSLanguageKey: EnvironmentKey {
  static let defaultValue: String? = nil
}
extension EnvironmentValues {
  var csLanguage: String? {
    get { self[CSLanguageKey.self] }
    set { self[CSLanguageKey.self] = newValue }
  }
}
extension View {
  public func csLanguage(_ tag: String?) -> some View { environment(\.csLanguage, tag) }
}

private struct CSFormAncestorKey: EnvironmentKey {
  static let defaultValue = false
}
extension EnvironmentValues {
  var csFormAncestor: Bool {
    get { self[CSFormAncestorKey.self] }
    set { self[CSFormAncestorKey.self] = newValue }
  }
}

public struct CSCombobox: View {
  public let label: String
  public let options: [CSComboboxOption]
  public let query: String
  public let highlight: Int
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onQuery: (String) -> Void
  let onHighlight: (Int) -> Void
  let onSelect: (String) -> Void
  public let value: String?
  public let disabled: Bool
  public let descriptionText: String?
  public let errorText: String?
  public let required: Bool
  public let language: String?
  public let placeholder: String?
  @State private var focusId = UUID().uuidString
  @State private var keysArmed = false
  @State private var listOpen = false
  @State private var blurToken = 0
  @State private var optionDown = false
  @State private var fieldFrame = CGRect.zero
  @State private var hostFrame = CGRect.zero
  @State private var panelFrame = CGRect.zero
  @State private var naturalSize: CGSize? = nil
  @State private var fittedSize: CGSize? = nil
  @State private var panelOrigin: CGPoint? = nil
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0
  @FocusState private var focused: Bool
  @Environment(\.csFormAncestor) private var inForm
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, options: [CSComboboxOption], query: String, highlight: Int, dark: Bool, highContrast: Bool, compact: Bool, onQuery: @escaping (String) -> Void, onHighlight: @escaping (Int) -> Void, onSelect: @escaping (String) -> Void, value: String? = nil, disabled: Bool = false, description: String? = nil, error: String? = nil, required: Bool = false, language: String? = nil, placeholder: String? = nil) {
    self.label = label
    self.options = options
    self.query = query
    self.highlight = highlight
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onQuery = onQuery
    self.onHighlight = onHighlight
    self.onSelect = onSelect
    self.value = value
    self.disabled = disabled
    self.descriptionText = description
    self.errorText = error
    self.required = required
    self.language = language
    self.placeholder = placeholder
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let shown = CSComboboxModel.shown(options: options, query: query)
    let open = CSComboboxModel.allowsOpen(listOpen, disabled: disabled)
    VStack(alignment: .leading, spacing: 4) {
      TextField(CSComboboxModel.placeholder(placeholder, fallback: CSComboboxModel.copy("placeholder", language: spoken)), text: Binding(get: { CSComboboxModel.display(open: open, query: query, value: value, options: options) }, set: { next in
        if disabled { return }
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        listOpen = true
        optionDown = false
        onQuery(next)
        onHighlight(0)
      }))
        .disabled(disabled)
        .overlay(alignment: .trailing) {
          Text(CSComboboxModel.caret).foregroundStyle(pack.mutedColor).padding(.trailing, 10).accessibilityHidden(true).allowsHitTesting(false)
        }
        .background(GeometryReader { geo in
          Color.clear.preference(key: CSComboboxFieldKey.self, value: geo.frame(in: .global))
        })
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused {
            blurToken += 1
            keysArmed = true
            if !disabled {
              listOpen = true
              optionDown = false
              onHighlight(0)
            }
            CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
          } else {
            #if os(iOS)
            if keysArmed { return }
            #endif
            let token = blurToken
            DispatchQueue.main.async {
              if token == blurToken { listOpen = false }
            }
          }
        }
        .onExitCommand { listOpen = false }
        .onChange(of: disabled) { isDisabled in if isDisabled { listOpen = false } }
        .accessibilityLabel(CSComboboxModel.listName(label: label, labelledBy: nil, fallback: CSComboboxModel.copy("label", language: spoken)) ?? "")
        .accessibilityCustomContent(AccessibilityCustomContentKey("Active descendant", id: "activeDescendant"), open && shown.indices.contains(highlight) ? Text(shown[highlight].label) : nil, importance: .high)
        .accessibilityCustomContent(AccessibilityCustomContentKey("Controls", id: "controls"), open ? Text("\(focusId)-list") : nil)
        .accessibilityCustomContent(AccessibilityCustomContentKey("Autocomplete", id: "autocomplete"), Text("list"))
        .accessibilityCustomContent(AccessibilityCustomContentKey("Required", id: "required"), required ? Text("true") : nil)
        .accessibilityHint(CSTextareaModel.describedBy([descriptionText, errorText]) ?? "")
        .modifier(CSComboboxRoleModifier(expanded: open))
        .modifier(CSComboboxFieldKeys(onKey: { key in moveCombobox(key) }))
        .onSubmit { pickHighlighted() }
      if CSComboboxModel.showsMessage(descriptionText), let descriptionText {
        Text(descriptionText).foregroundStyle(pack.mutedColor)
      }
      if CSComboboxModel.showsMessage(errorText), let errorText {
        Text(errorText).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
    .background(GeometryReader { geo in
      Color.clear.preference(key: CSComboboxHostKey.self, value: geo.frame(in: .global))
    })
    .overlay(alignment: .topLeading) {
      if open, fieldFrame.width > 0 {
        let screen = CSContextMenuModel.screenSize()
        let anchor = CSFloatingRect(left: fieldFrame.minX, top: fieldFrame.minY, right: fieldFrame.maxX, bottom: fieldFrame.maxY, width: fieldFrame.width, height: fieldFrame.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let matched = CSComboboxModel.matchedWidth(fieldFrame.width, viewportWidth: viewport.right - viewport.left)
        let initial = naturalSize.flatMap { size in CSFloatingModel.position(anchor: anchor, panelWidth: matched, panelHeight: size.height, viewport: viewport, placement: "bottom-start", gap: CSComboboxModel.panelGap) }
        let placed = fittedSize.flatMap { size in initial.flatMap { first in CSFloatingModel.position(anchor: anchor, panelWidth: matched, panelHeight: size.height, viewport: viewport, placement: first.placement, gap: CSComboboxModel.panelGap) } }
        let scaleX = Double(panelScale.width == 0 ? 1 : panelScale.width)
        let scaleY = Double(panelScale.height == 0 ? 1 : panelScale.height)
        let originX = Double(panelOrigin?.x ?? fieldFrame.minX)
        let originY = Double(panelOrigin?.y ?? fieldFrame.minY)
        let shiftX = CGFloat(placed.map { ($0.left - originX) / scaleX } ?? 0)
        let shiftY = CGFloat(placed.map { ($0.top - originY) / scaleY } ?? 0)
        let limit = initial.map { min($0.maxWidth, matched) } ?? matched
        Group {
          ForEach(Array(shown.enumerated()), id: \.offset) { index, option in
            Text(option.label)
              .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
              .foregroundStyle(index == highlight ? pack.colorBrandOchre.color : pack.primaryTextColor)
              .contentShape(Rectangle())
              .onHover { inside in if inside { onHighlight(index) } }
              .gesture(DragGesture(minimumDistance: 0).onChanged { _ in pickOption(option) }.onEnded { _ in optionDown = false })
              .accessibilityAddTraits(value == option.value ? .isSelected : [])
              .accessibilityIdentifier("\(focusId)-\(index)")
              .accessibilityAction { pickOption(option) }
          }
          if let empty = CSComboboxModel.emptyText(count: shown.count, fallback: CSComboboxModel.copy("empty", language: spoken)) {
            Text(empty).foregroundStyle(pack.mutedColor).accessibilityAddTraits(.updatesFrequently)
          }
        }
        .frame(width: CGFloat(limit), alignment: .leading)
        .frame(maxHeight: initial.map { CGFloat($0.maxHeight) }, alignment: .top)
        .background(pack.colorSurfacePanel.color)
        .background(GeometryReader { geo in
          let frame = geo.frame(in: .global)
          let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
          let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
          Color.clear.preference(key: CSComboboxPanelKey.self, value: CSComboboxPanelMeasure(frame: frame, size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
        })
        .offset(x: shiftX, y: shiftY)
        .modifier(CSComboboxMeasureOnly(placed: placed != nil, inline: inForm))
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("\(focusId)-list")
        .accessibilityLabel(CSComboboxModel.listName(label: label, labelledBy: nil, fallback: CSComboboxModel.copy("label", language: spoken)) ?? "")
      }
    }
    .onPreferenceChange(CSComboboxFieldKey.self) { frame in
      if frame.width > 0, frame.height > 0 { fieldFrame = frame }
    }
    .onPreferenceChange(CSComboboxHostKey.self) { frame in
      if frame.width > 0, frame.height > 0 { hostFrame = frame }
    }
    .onPreferenceChange(CSComboboxPanelKey.self) { measure in
      guard open, measure.size.width > 0, measure.size.height > 0 else { return }
      panelFrame = measure.frame
      panelOrigin = measure.origin
      panelScale = measure.scale
      if naturalSize == nil {
        naturalSize = measure.size
        measurePass = 1
      } else if measure.pass >= 1 {
        fittedSize = measure.size
      }
    }
    .onChange(of: listOpen) { isOpen in
      if !isOpen {
        naturalSize = nil
        fittedSize = nil
        panelOrigin = nil
        panelScale = CGSize(width: 1, height: 1)
        measurePass = 0
        panelFrame = .zero
      }
    }
    .focusable()
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: focused, armed: keysArmed) && !disabled, onResign: { keysArmed = false }) { key, _ in
      disabled ? false : moveCombobox(key)
    })
    .background(CSComboboxOutside(active: open, host: hostFrame, panel: panelFrame) { listOpen = false })
    .background(CSComboboxPortal(open: CSComboboxModel.usesWindowPortal(inForm: inForm) && open && panelFrame.width > 0 && panelFrame.height > 0, host: hostFrame, panel: panelFrame, content: AnyView(choiceList(pack: pack, shown: shown, width: panelFrame.width))))
  }

  private func choiceList(pack: CSTokenModePack, shown: [CSComboboxOption], width: CGFloat) -> some View {
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    return VStack(alignment: .leading, spacing: 0) {
      ForEach(Array(shown.enumerated()), id: \.offset) { index, option in
        Text(option.label)
          .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
          .foregroundStyle(index == highlight ? pack.colorBrandOchre.color : pack.primaryTextColor)
          .contentShape(Rectangle())
          .onHover { inside in if inside { onHighlight(index) } }
          .gesture(DragGesture(minimumDistance: 0).onChanged { _ in pickOption(option) }.onEnded { _ in optionDown = false })
          .accessibilityAddTraits(value == option.value ? .isSelected : [])
          .accessibilityIdentifier("\(focusId)-\(index)")
          .accessibilityAction { pickOption(option) }
      }
      if let empty = CSComboboxModel.emptyText(count: shown.count, fallback: CSComboboxModel.copy("empty", language: spoken)) {
        Text(empty).foregroundStyle(pack.mutedColor).accessibilityAddTraits(.updatesFrequently)
      }
    }
    .frame(width: width, alignment: .leading)
    .background(pack.colorSurfacePanel.color)
    .accessibilityElement(children: .contain)
    .accessibilityIdentifier("\(focusId)-list")
    .accessibilityLabel(CSComboboxModel.listName(label: label, labelledBy: nil, fallback: CSComboboxModel.copy("label", language: spoken)) ?? "")
  }

  private func pickOption(_ option: CSComboboxOption) {
    guard !disabled, !optionDown, listOpen else { return }
    optionDown = true
    listOpen = false
    onSelect(option.value)
    onQuery("")
  }

  private func composing() -> Bool {
    #if os(macOS)
    let responder = NSApp.keyWindow?.firstResponder
    if let editor = responder as? NSTextView, editor.hasMarkedText() { return true }
    if let field = responder as? NSTextField, let editor = field.currentEditor() as? NSTextView, editor.hasMarkedText() { return true }
    return false
    #elseif os(iOS)
    CSComboboxResponder.current = nil
    UIApplication.shared.sendAction(#selector(UIResponder.csReportComboboxResponder(_:)), to: nil, from: nil, for: nil)
    return csComboboxMarked(CSComboboxResponder.current)
    #else
    return false
    #endif
  }

  private func pickHighlighted() {
    guard !disabled, listOpen, !CSComboboxModel.ignoresKey(composing: composing()) else { return }
    CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
    let shown = CSComboboxModel.shown(options: options, query: query)
    guard shown.indices.contains(highlight) else { return }
    listOpen = false
    onSelect(shown[highlight].value)
    onQuery("")
  }

  private func moveCombobox(_ key: CSRovingKey) -> Bool {
    guard key == .down || key == .up else { return false }
    if disabled || CSComboboxModel.ignoresKey(composing: composing()) { return false }
    if key == .down { listOpen = true; optionDown = false }
    let shown = CSComboboxModel.shown(options: options, query: query)
    onHighlight(CSComboboxModel.highlight(current: highlight, count: shown.count, down: key == .down))
    return true
  }
}

private struct CSComboboxRoleModifier: ViewModifier {
  var expanded: Bool
  func body(content: Content) -> some View {
    #if os(macOS)
    content.background(CSComboboxFieldRole(expanded: expanded))
    #else
    content.accessibilityCustomContent(AccessibilityCustomContentKey("Role", id: "role"), Text("combobox"))
    #endif
  }
}

#if os(macOS)
private struct CSComboboxFieldRole: NSViewRepresentable {
  var expanded: Bool
  func makeNSView(context: Context) -> CSComboboxRoleView { CSComboboxRoleView() }
  func updateNSView(_ nsView: CSComboboxRoleView, context: Context) {
    nsView.expanded = expanded
    nsView.needsLayout = true
  }
}

private final class CSComboboxRoleView: NSView {
  var expanded = false
  override func layout() {
    super.layout()
    guard let field = nearestTextField() else { return }
    if field.accessibilityRole() != .comboBox {
      field.setAccessibilityRole(.comboBox)
    }
    field.setAccessibilityExpanded(expanded)
  }

  private func nearestTextField() -> NSTextField? {
    var node: NSView? = self
    var hops = 0
    while let current = node, hops < 4 {
      if let field = current as? NSTextField { return field }
      if let parent = current.superview {
        let point = parent.convert(bounds.origin, from: self)
        let fields = parent.subviews.compactMap { $0 as? NSTextField }
        if let field = fields.min(by: { left, right in
          hypot(left.frame.midX - point.x, left.frame.midY - point.y) < hypot(right.frame.midX - point.x, right.frame.midY - point.y)
        }) {
          return field
        }
      }
      node = current.superview
      hops += 1
    }
    return nil
  }
}
#endif

private struct CSComboboxFieldKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSComboboxHostKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSComboboxPanelMeasure: Equatable {
  var frame: CGRect
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSComboboxPanelKey: PreferenceKey {
  static var defaultValue = CSComboboxPanelMeasure(frame: .zero, size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSComboboxPanelMeasure, nextValue: () -> CSComboboxPanelMeasure) { value = nextValue() }
}

private struct CSComboboxFieldKeys: ViewModifier {
  var onKey: (CSRovingKey) -> Bool
  func body(content: Content) -> some View {
    if #available(macOS 14, iOS 17, *) {
      content.onKeyPress { press in
        let key: CSRovingKey?
        switch press.key {
        case .upArrow: key = .up
        case .downArrow: key = .down
        default: key = nil
        }
        guard let key, onKey(key) else { return .ignored }
        return .handled
      }
    } else {
      content
    }
  }
}

private struct CSComboboxMeasureOnly: ViewModifier {
  var placed: Bool
  var inline: Bool
  func body(content: Content) -> some View {
    #if os(macOS) || os(iOS)
    if inline {
      content.opacity(placed ? 1 : 0).accessibilityHidden(!placed)
    } else {
      content.opacity(0).allowsHitTesting(false).accessibilityHidden(true)
    }
    #else
    content.opacity(placed ? 1 : 0).accessibilityHidden(!placed)
    #endif
  }
}

func csComboboxContains(local: CGPoint, bounds: CGRect, host: CGRect, panel: CGRect) -> Bool {
  if bounds.contains(local) { return true }
  guard host.width > 0, host.height > 0, panel.width > 0, panel.height > 0, bounds.height > 0 else { return false }
  let rect = CGRect(x: panel.minX - host.minX, y: bounds.height - (panel.minY - host.minY) - panel.height, width: panel.width, height: panel.height)
  return rect.contains(local)
}

#if os(macOS)
private struct CSComboboxPortal: NSViewRepresentable {
  var open: Bool
  var host: CGRect
  var panel: CGRect
  var content: AnyView
  func makeCoordinator() -> Coordinator { Coordinator() }
  func makeNSView(context: Context) -> CSComboboxPortalAnchor {
    let view = CSComboboxPortalAnchor()
    view.onLayout = { [weak coordinator = context.coordinator] in coordinator?.place() }
    return view
  }
  func updateNSView(_ nsView: CSComboboxPortalAnchor, context: Context) {
    context.coordinator.open = open
    context.coordinator.host = host
    context.coordinator.panel = panel
    context.coordinator.content = content
    context.coordinator.anchor = nsView
    nsView.onLayout = { [weak coordinator = context.coordinator] in coordinator?.place() }
    context.coordinator.place()
  }
  static func dismantleNSView(_ nsView: NSView, coordinator: Coordinator) { coordinator.remove() }
  final class Coordinator {
    weak var anchor: NSView?
    var open = false
    var host = CGRect.zero
    var panel = CGRect.zero
    var content = AnyView(EmptyView())
    var hosting: NSHostingView<AnyView>?
    func place() {
      guard let anchor, open, host.width > 0, panel.width > 0, let contentView = anchor.window?.contentView else {
        remove()
        return
      }
      let localY = anchor.bounds.height - (panel.minY - host.minY) - panel.height
      let local = CGRect(x: panel.minX - host.minX, y: localY, width: panel.width, height: panel.height)
      let frame = anchor.convert(local, to: contentView)
      if let hosting {
        hosting.rootView = content
        hosting.frame = frame
      } else {
        let box = NSHostingView(rootView: content)
        box.translatesAutoresizingMaskIntoConstraints = true
        contentView.addSubview(box)
        box.frame = frame
        hosting = box
      }
    }
    func remove() {
      hosting?.removeFromSuperview()
      hosting = nil
    }
  }
}
private final class CSComboboxPortalAnchor: NSView {
  var onLayout: (() -> Void)?
  override func layout() {
    super.layout()
    onLayout?()
  }
  override func viewDidMoveToWindow() {
    super.viewDidMoveToWindow()
    onLayout?()
  }
}
#elseif os(iOS)
private struct CSComboboxPortal: UIViewRepresentable {
  var open: Bool
  var host: CGRect
  var panel: CGRect
  var content: AnyView
  func makeCoordinator() -> Coordinator { Coordinator() }
  func makeUIView(context: Context) -> CSComboboxPortalPad {
    let view = CSComboboxPortalPad()
    view.onLayout = { [weak coordinator = context.coordinator] in coordinator?.place() }
    return view
  }
  func updateUIView(_ uiView: CSComboboxPortalPad, context: Context) {
    context.coordinator.open = open
    context.coordinator.host = host
    context.coordinator.panel = panel
    context.coordinator.content = content
    context.coordinator.anchor = uiView
    uiView.onLayout = { [weak coordinator = context.coordinator] in coordinator?.place() }
    context.coordinator.place()
  }
  static func dismantleUIView(_ uiView: UIView, coordinator: Coordinator) { coordinator.remove() }
  final class Coordinator {
    weak var anchor: UIView?
    var open = false
    var host = CGRect.zero
    var panel = CGRect.zero
    var content = AnyView(EmptyView())
    var controller: UIHostingController<AnyView>?
    func place() {
      guard let anchor, open, host.width > 0, panel.width > 0, let window = anchor.window else {
        remove()
        return
      }
      let local = CGRect(x: panel.minX - host.minX, y: panel.minY - host.minY, width: panel.width, height: panel.height)
      let frame = anchor.convert(local, to: window)
      if let controller {
        controller.rootView = content
        controller.view.frame = frame
      } else {
        let controller = UIHostingController(rootView: content)
        controller.view.backgroundColor = .clear
        controller.view.frame = frame
        window.addSubview(controller.view)
        self.controller = controller
      }
    }
    func remove() {
      controller?.view.removeFromSuperview()
      controller = nil
    }
  }
}
private final class CSComboboxPortalPad: UIView {
  var onLayout: (() -> Void)?
  override func layoutSubviews() {
    super.layoutSubviews()
    onLayout?()
  }
  override func didMoveToWindow() {
    super.didMoveToWindow()
    onLayout?()
  }
}
#else
private struct CSComboboxPortal: View {
  var open: Bool
  var host: CGRect
  var panel: CGRect
  var content: AnyView
  var body: some View {
    let _ = (open, host, panel, content)
    Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
  }
}
#endif

#if os(macOS)
private struct CSComboboxOutside: NSViewRepresentable {
  var active: Bool
  var host: CGRect
  var panel: CGRect
  var onOutside: () -> Void
  func makeCoordinator() -> Coordinator { Coordinator() }
  func makeNSView(context: Context) -> NSView {
    let view = NSView()
    context.coordinator.view = view
    context.coordinator.install(active: active, host: host, panel: panel, onOutside: onOutside)
    return view
  }
  func updateNSView(_ nsView: NSView, context: Context) {
    context.coordinator.view = nsView
    context.coordinator.install(active: active, host: host, panel: panel, onOutside: onOutside)
  }
  static func dismantleNSView(_ nsView: NSView, coordinator: Coordinator) { coordinator.remove() }
  final class Coordinator {
    weak var view: NSView?
    var monitor: Any?
    var onOutside: (() -> Void)?
    var host = CGRect.zero
    var panel = CGRect.zero
    func install(active: Bool, host: CGRect, panel: CGRect, onOutside: @escaping () -> Void) {
      self.onOutside = onOutside
      self.host = host
      self.panel = panel
      guard active else { remove(); return }
      guard monitor == nil else { return }
      monitor = NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown]) { [weak self] event in
        guard let self, let view = self.view else { return event }
        let local = view.convert(event.locationInWindow, from: nil)
        if !csComboboxContains(local: local, bounds: view.bounds, host: self.host, panel: self.panel) { self.onOutside?() }
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
private struct CSComboboxOutside: UIViewRepresentable {
  var active: Bool
  var host: CGRect
  var panel: CGRect
  var onOutside: () -> Void
  func makeUIView(context: Context) -> CSComboboxOutsideView {
    let view = CSComboboxOutsideView()
    view.onOutside = onOutside
    view.active = active
    view.host = host
    view.panel = panel
    return view
  }
  func updateUIView(_ uiView: CSComboboxOutsideView, context: Context) {
    uiView.onOutside = onOutside
    uiView.active = active
    uiView.host = host
    uiView.panel = panel
    uiView.sync()
  }
  static func dismantleUIView(_ uiView: CSComboboxOutsideView, coordinator: ()) { uiView.uninstall() }
}
private final class CSComboboxOutsideView: UIView {
  var onOutside: (() -> Void)?
  var active = false
  var host = CGRect.zero
  var panel = CGRect.zero
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
    let point = tap.location(in: self)
    if !csComboboxContains(local: point, bounds: bounds, host: host, panel: panel) { onOutside?() }
  }
}
#else
private struct CSComboboxOutside: View {
  var active: Bool
  var host: CGRect
  var panel: CGRect
  var onOutside: () -> Void
  var body: some View {
    let _ = (active, host, panel, onOutside)
    return Color.clear.frame(width: 0, height: 0).accessibilityHidden(true)
  }
}
#endif

public enum CSAlertDialogModel {
  public static let confirmDefault = "Confirm"
  public static let cancelDefault = "Cancel"
  public static func isOpen(open: Bool?, internalOpen: Bool) -> Bool { open ?? internalOpen }
  public static func destructive(tone: String?, variant: String?) -> Bool { (tone ?? variant) == "destructive" }
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["confirm": "Xác nhận", "cancel": "Hủy"],
      "en": ["confirm": confirmDefault, "cancel": cancelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func hasDescription(_ description: String?, children: String?) -> Bool {
    let body = description ?? children
    guard let body else { return false }
    return !body.isEmpty
  }
  public static func initialFocus(destructive: Bool) -> String { destructive ? "cancel" : "confirm" }
  public static func dismiss() -> [String] { ["open-false", "cancel"] }
  public static func confirm() -> [String] { ["open-false", "confirm"] }
}

public struct CSAlertDialog: View {
  public let title: String
  public let descriptionText: String?
  public let childrenText: String?
  public let confirmLabel: String?
  public let cancelLabel: String?
  public let language: String?
  public let tone: String?
  public let variant: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onConfirm: () -> Void
  let onCancel: () -> Void
  let onOpenChange: (Bool) -> Void
  let onRestore: (() -> Void)?
  let layerId: String
  let layers: [CSOverlayLayer]
  @State private var restoreId: String? = nil
  @State private var cancelFocusId = UUID().uuidString
  @State private var confirmFocusId = UUID().uuidString
  @FocusState private var trap: Int?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String, description: String? = nil, children: String? = nil, confirmLabel: String? = nil, cancelLabel: String? = nil, tone: String? = nil, variant: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void, onCancel: @escaping () -> Void, onOpenChange: @escaping (Bool) -> Void, onRestore: (() -> Void)? = nil, layerId: String? = nil, layers: [CSOverlayLayer]? = nil, language: String? = nil) {
    self.title = title
    self.descriptionText = description
    self.childrenText = children
    self.confirmLabel = confirmLabel
    self.cancelLabel = cancelLabel
    self.language = language
    self.tone = tone
    self.variant = variant
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onConfirm = onConfirm
    self.onCancel = onCancel
    self.onOpenChange = onOpenChange
    self.onRestore = onRestore
    let id = layerId ?? CSOverlayStack.freshId("alert")
    self.layerId = id
    self.layers = layers ?? CSOverlayStack.solo(id)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let danger = CSAlertDialogModel.destructive(tone: tone, variant: variant)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let confirm = CSAlertDialogModel.label(confirmLabel, fallback: CSAlertDialogModel.copy("confirm", language: spoken))
    let cancel = CSAlertDialogModel.label(cancelLabel, fallback: CSAlertDialogModel.copy("cancel", language: spoken))
    let described = CSAlertDialogModel.hasDescription(descriptionText, children: childrenText)
    VStack(alignment: .leading, spacing: 12) {
      Text(title).font(.headline).foregroundStyle(pack.primaryTextColor)
      if described {
        Text(descriptionText ?? childrenText ?? "").foregroundStyle(pack.mutedColor)
      }
      HStack {
        Button(cancel) {
          CSFocusRegistry.shared.claim(id: cancelFocusId, restore: { trap = 0 })
          onOpenChange(false)
          onCancel()
          finish()
        }
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .focused($trap, equals: 0)
        Button(confirm) {
          CSFocusRegistry.shared.claim(id: confirmFocusId, restore: { trap = 1 })
          onOpenChange(false)
          onConfirm()
          finish()
        }
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .foregroundStyle(danger ? pack.colorSemanticDanger.color : pack.colorBrandOchre.color)
        .focused($trap, equals: 1)
      }
    }
    .onAppear {
      restoreId = CSFocusRegistry.shared.activeId
      CSOverlayRegistry.shared.push(id: layerId)
      trap = CSFocusTrap.initialIndex(preferred: danger ? 0 : 1, count: 2)
    }
    .onChange(of: trap) { index in
      if index == 0 { CSFocusRegistry.shared.claim(id: cancelFocusId, restore: { trap = 0 }) }
      if index == 1 { CSFocusRegistry.shared.claim(id: confirmFocusId, restore: { trap = 1 }) }
    }
    .onDisappear {
      CSFocusRegistry.shared.disconnect(id: cancelFocusId)
      CSFocusRegistry.shared.disconnect(id: confirmFocusId)
      CSOverlayRegistry.shared.remove(id: layerId)
    }
    .csTabTrap { shift in
      let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
      guard CSOverlayStack.ownsFocus(id: layerId, layers: stack) else { return false }
      let next = CSFocusTrap.nextIndex(current: trap ?? -1, count: 2, shift: shift, inside: trap != nil)
      trap = CSModalFocus.pullBack(inside: next != nil) ? CSFocusTrap.initialIndex(preferred: danger ? 0 : 1, count: 2) : next
      return true
    }
    .padding(16)
    .background(pack.colorSurfacePanel.color)
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isModal)
  }

  private func finish() {
    let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
    CSFocusReturn.perform(savedId: restoreId, onRestore: onRestore, layerId: layerId, layers: stack)
    CSOverlayRegistry.shared.remove(id: layerId)
  }
}

public enum CSPopoverModel {
  public static let panelDefault = "Details"
  public static let gap = 8.0
  public static func isOpen(controlled: Bool?, internalOpen: Bool) -> Bool { controlled ?? internalOpen }
  public static func placement(_ placement: String?, align: String) -> String {
    placement ?? (align == "end" ? "bottom-end" : "bottom-start")
  }
  public static func label(ariaLabel: String?, hasLabelledBy: Bool, fallback: String) -> String? {
    if let ariaLabel { return ariaLabel }
    return hasLabelledBy ? nil : fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["panel": "Chi tiết"],
      "en": ["panel": panelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func toggle(open: Bool, defaultPrevented: Bool) -> Bool? {
    defaultPrevented ? nil : !open
  }
  public static func dismissOutside(open: Bool, inside: Bool) -> Bool { open && !inside }
}

public struct CSPopover<Content: View>: View {
  public let label: String
  public let ariaLabel: String?
  public let hasLabelledBy: Bool
  public let align: String
  public let placement: String?
  @Binding var open: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onOpenChange: (Bool) -> Void
  public let language: String?
  let content: () -> Content
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var trigger: CGRect? = nil
  @State private var naturalSize: CGSize? = nil
  @State private var fittedSize: CGSize? = nil
  @State private var panelOrigin: CGPoint? = nil
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0

  public init(label: String, open: Binding<Bool>, ariaLabel: String? = nil, hasLabelledBy: Bool = false, align: String = "start", placement: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onOpenChange: @escaping (Bool) -> Void = { _ in }, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.ariaLabel = ariaLabel
    self.hasLabelledBy = hasLabelledBy
    self.align = align
    self.placement = placement
    _open = open
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onOpenChange = onOpenChange
    self.language = language
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let place = CSPopoverModel.placement(placement, align: align)
    let spoken = CSPopoverModel.label(ariaLabel: ariaLabel, hasLabelledBy: hasLabelledBy, fallback: CSPopoverModel.copy("panel", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    VStack(alignment: place.hasSuffix("end") ? .trailing : .leading, spacing: CSPopoverModel.gap) {
      CSTriggerButton(label) {
        guard let next = CSPopoverModel.toggle(open: open, defaultPrevented: false) else { return }
        open = next
        onOpenChange(next)
      }
      .frame(minHeight: pack.componentButtonMdMinHeight.points)
      .accessibilityValue(Text(open ? "expanded" : "collapsed"))
      .background(GeometryReader { geo in
        Color.clear.preference(key: CSPopoverTriggerKey.self, value: geo.frame(in: .global))
      })
      if open, let trigger {
        let screen = CSContextMenuModel.screenSize()
        let anchor = CSFloatingRect(left: trigger.minX, top: trigger.minY, right: trigger.maxX, bottom: trigger.maxY, width: trigger.width, height: trigger.height)
        let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
        let initial = naturalSize.flatMap { size in CSFloatingModel.position(anchor: anchor, panelWidth: size.width, panelHeight: size.height, viewport: viewport, placement: place, gap: CSPopoverModel.gap) }
        let placed = fittedSize.flatMap { size in initial.flatMap { first in CSFloatingModel.position(anchor: anchor, panelWidth: size.width, panelHeight: size.height, viewport: viewport, placement: first.placement, gap: CSPopoverModel.gap) } }
        let scaleX = Double(panelScale.width == 0 ? 1 : panelScale.width)
        let scaleY = Double(panelScale.height == 0 ? 1 : panelScale.height)
        let originX = Double(panelOrigin?.x ?? trigger.minX)
        let originY = Double(panelOrigin?.y ?? trigger.minY)
        let shiftX = CGFloat(placed.map { ($0.left - originX) / scaleX } ?? 0)
        let shiftY = CGFloat(placed.map { ($0.top - originY) / scaleY } ?? 0)
        content()
          .padding(12)
          .frame(maxWidth: initial.map { CGFloat($0.maxWidth) }, maxHeight: initial.map { CGFloat($0.maxHeight) }, alignment: .leading)
          .background(GeometryReader { geo in
            let frame = geo.frame(in: .global)
            let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
            let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
            Color.clear.preference(key: CSPopoverPanelKey.self, value: CSPopoverMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
          })
          .offset(x: shiftX, y: shiftY)
          .opacity(placed == nil ? 0 : 1)
          .accessibilityHidden(placed == nil)
          .background(pack.colorSurfacePanel.color)
          .accessibilityElement(children: .contain)
          .accessibilityLabel(spoken ?? "")
      }
    }
    .onExitCommand {
      guard open else { return }
      open = false
      onOpenChange(false)
    }
    .onPreferenceChange(CSPopoverTriggerKey.self) { frame in
      if frame.width > 0, frame.height > 0 { trigger = frame }
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
    .onPreferenceChange(CSPopoverPanelKey.self) { measure in
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
  }
}

private struct CSPopoverTriggerKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSPopoverMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSPopoverPanelKey: PreferenceKey {
  static var defaultValue = CSPopoverMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSPopoverMeasure, nextValue: () -> CSPopoverMeasure) { value = nextValue() }
}

public struct CSListItem: Hashable {
  public let title: String
  public let subtitle: String
  public init(title: String, subtitle: String = "") {
    self.title = title
    self.subtitle = subtitle
  }
}

public struct CSList: View {
  public let items: [CSListItem]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(items: [CSListItem], dark: Bool, highContrast: Bool, compact: Bool) {
    self.items = items
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 8) {
      ForEach(items, id: \.title) { item in
        VStack(alignment: .leading) {
          Text(item.title).foregroundStyle(pack.primaryTextColor)
          if !item.subtitle.isEmpty { Text(item.subtitle).foregroundStyle(pack.mutedColor) }
        }
        .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
      }
    }
  }
}

public enum CSCommentModel {
  public static let replyDefault = "Reply"
  public static func shows(_ value: String?) -> Bool {
    guard let value else { return false }
    return !value.isEmpty
  }
  public static func replyActions(_ labels: [String]?, fallback: String) -> [String] {
    guard let labels, !labels.isEmpty else { return [fallback] }
    return labels
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["reply": "Trả lời"],
      "en": ["reply": replyDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSComment: View {
  public let author: String
  public let meta: String?
  public let bodyText: String
  public let actions: [String]
  public let replies: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(author: String, meta: String? = nil, body bodyText: String, actions: [String] = [], replies: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.author = author
    self.meta = meta
    self.bodyText = bodyText
    self.actions = actions
    self.replies = replies
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let labels = CSCommentModel.replyActions(actions, fallback: CSCommentModel.copy("reply", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)))
    VStack(alignment: .leading, spacing: 4) {
      Text(author).foregroundStyle(pack.primaryTextColor)
      if CSCommentModel.shows(meta), let meta { Text(meta).foregroundStyle(pack.mutedColor) }
      Text(bodyText).foregroundStyle(pack.primaryTextColor)
      HStack {
        ForEach(Array(labels.enumerated()), id: \.offset) { _, label in
          CSTriggerButton(label) {}
            .frame(minHeight: 44)
        }
      }
      if CSCommentModel.shows(replies), let replies { Text(replies).foregroundStyle(pack.mutedColor) }
    }
  }
}

public enum CSCodeBlockModel {
  public static let labelDefault = "code"
  public static let copyDefault = "Copy"
  public static let copiedDefault = "Copied ✓"
  public static let copiedMs = 1400
  public static func barLabel(filename: String?, language: String?, fallback: String) -> String {
    if let filename, !filename.isEmpty { return filename }
    if let language { return language }
    return fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["code": "mã", "copy": "Sao chép", "copied": "Đã sao chép ✓"],
      "en": ["code": labelDefault, "copy": copyDefault, "copied": copiedDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func button(copied: Bool, copy: String, copiedLabel: String) -> String { copied ? copiedLabel : copy }
  public static func beginCopy(attempt: Int) -> Int { attempt + 1 }
  public static func succeeded(current: Int, attempt: Int, wrote: Bool) -> Bool { wrote && current == attempt }
}

public struct CSCodeBlock: View {
  public let filename: String?
  public let code: String
  public let language: String?
  public let showBar: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let lang: String?
  @State private var copied = false
  @State private var attempt = 0
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(filename: String? = nil, code: String, language: String? = nil, showBar: Bool = true, dark: Bool, highContrast: Bool, compact: Bool, lang: String? = nil) {
    self.filename = filename
    self.code = code
    self.language = language
    self.showBar = showBar
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.lang = lang
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: lang, ancestor: ancestorLanguage)
    let title = CSCodeBlockModel.barLabel(filename: filename, language: language, fallback: CSCodeBlockModel.copy("code", language: spoken))
    let action = CSCodeBlockModel.button(copied: copied, copy: CSCodeBlockModel.copy("copy", language: spoken), copiedLabel: CSCodeBlockModel.copy("copied", language: spoken))
    VStack(alignment: .leading, spacing: 8) {
      if showBar {
        HStack {
          Text(title).foregroundStyle(pack.mutedColor)
          Spacer()
          CSTriggerButton(action) {
            attempt = CSCodeBlockModel.beginCopy(attempt: attempt)
            copied = false
          }
          .frame(minHeight: 44)
        }
      }
      Text(code).font(.system(.body, design: .monospaced)).foregroundStyle(pack.primaryTextColor)
    }
    .padding(12)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(pack.colorSurfacePanel.color)
  }
}

public struct CSSidebar: View {
  public let label: String
  public let items: [String]
  public let active: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void

  public init(label: String, items: [String], active: String, dark: Bool, highContrast: Bool, compact: Bool, onSelect: @escaping (String) -> Void) {
    self.label = label
    self.items = items
    self.active = active
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onSelect = onSelect
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 4) {
      ForEach(items, id: \.self) { item in
        CSTriggerButton(item) { onSelect(item) }
          .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
          .foregroundStyle(item == active ? pack.colorBrandOchre.color : pack.primaryTextColor)
          .accessibilityAddTraits(item == active ? .isSelected : [])
      }
    }
    .accessibilityElement(children: .contain)
    .accessibilityLabel(label)
  }
}
