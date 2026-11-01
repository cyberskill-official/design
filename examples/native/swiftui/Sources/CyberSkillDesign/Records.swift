import SwiftUI

public enum CSDataGridSelection {
  public static let selectAllDefault = "Select all rows"
  public static let selectRowDefault = "Select row"
  public static let emptyDefault = "No results"
  public static func rowName(cells: [String?], key: String) -> String {
    for cell in cells {
      if let cell, !cell.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { return cell }
    }
    return key
  }
  public static func allSelected(selectable: Bool, keys: [String], selected: [String]) -> Bool {
    selectable && !keys.isEmpty && keys.allSatisfy { selected.contains($0) }
  }
  public static func showsCaption(_ caption: String?) -> Bool {
    guard let caption else { return false }
    return !caption.isEmpty
  }
  public static func emptyText(_ empty: String?, fallback: String) -> String { empty ?? fallback }
  public static func selectAllText(_ explicit: String?, fallback: String) -> String {
    guard let explicit, !explicit.isEmpty else { return fallback }
    return explicit
  }
  public static func pinNamedParts(_ template: String = pinTemplate) -> [String] {
    let parts = template.components(separatedBy: "{name}")
    return parts.count >= 2 ? [parts[0], parts[1]] : [template, ""]
  }
  public static func cellText(row: [String: String], key: String, render: (([String: String]) -> String?)?) -> String {
    if let render { return render(row) ?? "" }
    return row[key] ?? ""
  }
  public static let pinTemplate = "Pin column {name}"
  public static let pinDefault = "Pin this column"
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": [
        "selectAll": "Chọn tất cả",
        "selectRow": "Chọn dòng",
        "empty": "Không có kết quả",
        "pin": "Ghim cột này",
        "pinNamed": "Ghim cột {name}",
      ],
      "en": [
        "selectAll": selectAllDefault,
        "selectRow": selectRowDefault,
        "empty": emptyDefault,
        "pin": pinDefault,
        "pinNamed": pinTemplate,
      ],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func orderedKeys(order: [String]?, columns: [String]) -> [String] {
    guard let order, !order.isEmpty else { return columns }
    var remaining = columns
    var out: [String] = []
    for key in order {
      if let index = remaining.firstIndex(of: key) {
        out.append(remaining.remove(at: index))
      }
    }
    out.append(contentsOf: remaining)
    return out
  }
  public static func pin(order: [String], key: String, canPersist: Bool) -> [String]? {
    guard canPersist else { return nil }
    return [key] + order.filter { $0 != key }
  }
  public static func sticky(_ key: String, pinned: String?) -> Double? {
    guard let pinned, key == pinned else { return nil }
    return 0
  }
  public static func isPinned(columnPinned: Bool, key: String, pinnedKey: String?) -> Bool {
    columnPinned || sticky(key, pinned: pinnedKey) != nil
  }
  public static func storageKey(_ persistKey: String?) -> String? {
    guard let persistKey, !persistKey.isEmpty else { return nil }
    return "cs:datagrid:cols:\(persistKey)"
  }
  public static func decodeOrder(_ raw: String?) -> [String]? {
    guard let raw, let data = raw.data(using: .utf8), let json = try? JSONSerialization.jsonObject(with: data) as? [Any] else { return nil }
    var keys: [String] = []
    for item in json {
      guard let key = item as? String else { return nil }
      keys.append(key)
    }
    return keys
  }
  public static func encodeOrder(_ order: [String]) -> String? {
    guard JSONSerialization.isValidJSONObject(order),
          let data = try? JSONSerialization.data(withJSONObject: order),
          let text = String(data: data, encoding: .utf8) else { return nil }
    return text
  }
  public static func rowKey(value: String?, index: Int) -> String { value ?? String(index) }
  public static func rowIndex(virtual: Bool, position: Int, header: Bool = false) -> Int? {
    guard virtual else { return nil }
    return header ? 1 : position + 2
  }
  public static func dataCount(_ count: Int) -> Int { count }
  public static func rowCount(virtual: Bool, count: Int) -> Int? { virtual ? max(2, count + 1) : nil }
  public static func pinName(header: String?, key: String, template: String = pinTemplate) -> String {
    template.replacingOccurrences(of: "{name}", with: header ?? key)
  }
  public static func filterKeys(requested: [String]?, columns: [String]) -> [String] {
    if let requested, !requested.isEmpty { return requested }
    return columns
  }
  public static func rowHeight(requested: Double, measured: Double) -> Double {
    let estimate = requested.isFinite && requested > 0 ? requested : 36
    let known = measured.isFinite ? measured : estimate
    return max(estimate, known)
  }
  public static func measured(_ previous: Double, next: Double) -> Double {
    abs(previous - next) > 0.01 ? next : previous
  }
  public static func rowBox(virtual: Bool, height: Double) -> Double? {
    guard virtual, height.isFinite, height > 0 else { return nil }
    return height
  }
  public static func virtualFlag(_ virtual: Bool) -> String { virtual ? "true" : "false" }
  public static func virtualClass(_ virtual: Bool) -> String? { virtual ? "cs-datagrid--virtual" : nil }
  public static func headerStart() -> Double { 0 }
  public static func headerLayer() -> Int { 1 }
  public static func tableMargin() -> Double { 0 }
  public static func checkAlignment() -> Alignment { .center }
  public static func selectionWidth() -> Double { 36 }
  public static func sortPadding() -> Double { 0 }
  public static func sortBorder() -> Double { 0 }
  public static let selectedAccentPortion = 0.18
  public static func selectedLab(dark: Bool, tint: CSColorValue, accent: CSColorValue, panel: CSColorValue) -> [Double] {
    dark ? oklabMix(accent, panel, selectedAccentPortion) : oklab(tint)
  }
  public static func selectedFill(dark: Bool, tint: CSColorValue, accent: CSColorValue, panel: CSColorValue) -> Color {
    CSColorValue(colorSpace: .oklab, components: selectedLab(dark: dark, tint: tint, accent: accent, panel: panel), alpha: 1).color
  }
  private static func oklab(_ color: CSColorValue) -> [Double] {
    color.colorSpace == .oklab ? Array(color.components.prefix(3)) : srgbToOklab(color.components)
  }
  private static func oklabMix(_ accent: CSColorValue, _ panel: CSColorValue, _ portion: Double) -> [Double] {
    let lead = oklab(accent), base = oklab(panel)
    return zip(lead, base).map { portion * $0 + (1 - portion) * $1 }
  }
  private static func srgbToOklab(_ rgb: [Double]) -> [Double] {
    func linear(_ channel: Double) -> Double { channel <= 0.04045 ? channel / 12.92 : pow((channel + 0.055) / 1.055, 2.4) }
    let r = linear(rgb[0]), g = linear(rgb[1]), b = linear(rgb[2])
    let l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    let m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    let s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]
  }
  public static func scrolled(virtual: Bool, current: Double, next: Double) -> Double {
    guard virtual, next.isFinite else { return current }
    return next
  }
  public static func virtual(enabled: Bool, count: Int, threshold: Int = 80) -> Bool { enabled || count >= threshold }
  public static func window(count: Int, height: Double, rowHeight: Double, scrollTop: Double, virtual: Bool) -> CSGridWindow {
    guard virtual else { return CSGridWindow(start: 0, end: count) }
    let safeRow = rowHeight.isFinite && rowHeight > 0 ? rowHeight : 36
    let body = max(0, height - 40)
    let visible = Int(ceil(body / safeRow)) + 8
    let start = min(max(0, count - visible), max(0, Int(floor(scrollTop / safeRow)) - 4))
    return CSGridWindow(start: start, end: min(count, start + visible))
  }
  public static func painted(count: Int, window: CSGridWindow) -> [Int] {
    let start = min(max(0, window.start), count)
    let end = min(max(start, window.end), count)
    return Array(start..<end)
  }
  public static func pad(count: Int, window: CSGridWindow, rowHeight: Double) -> (top: Double, bottom: Double) {
    let indexes = painted(count: count, window: window)
    let row = rowHeight.isFinite && rowHeight > 0 ? rowHeight : 36
    let start = indexes.first ?? 0
    let end = (indexes.last ?? (start - 1)) + 1
    return (Double(start) * row, Double(max(0, count - end)) * row)
  }
  public static func filtered(rows: [[String: String]], query: String?, keys: [String]) -> [[String: String]] {
    let needle = (query ?? "").trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    if needle.isEmpty { return rows }
    return rows.filter { row in
      keys.contains { key in (row[key] ?? "").lowercased().contains(needle) }
    }
  }
  public static func toggle(selected: [String], key: String) -> [String] {
    selected.contains(key) ? selected.filter { $0 != key } : selected + [key]
  }

  public static func toggleAll(keys: [String], selected: [String]) -> [String] {
    let all = !keys.isEmpty && keys.allSatisfy { selected.contains($0) }
    return all ? [] : keys
  }
}

public protocol CSGridColumnStore {
  func string(forKey key: String) -> String?
  func set(_ value: String, forKey key: String)
}

public final class CSGridMemoryStore: CSGridColumnStore {
  public var values: [String: String] = [:]
  public init() {}
  public func string(forKey key: String) -> String? { values[key] }
  public func set(_ value: String, forKey key: String) { values[key] = value }
}

public struct CSGridDefaultsStore: CSGridColumnStore {
  public init() {}
  public func string(forKey key: String) -> String? { UserDefaults.standard.string(forKey: key) }
  public func set(_ value: String, forKey key: String) { UserDefaults.standard.set(value, forKey: key) }
}

public struct CSGridWindow: Equatable {
  public var start: Int
  public var end: Int
  public init(start: Int, end: Int) {
    self.start = start
    self.end = end
  }
}

public enum CSGridSort: Equatable {
  case none
  case ascending(String)
  case descending(String)

  public static func next(_ current: CSGridSort, key: String) -> CSGridSort {
    switch current {
    case .ascending(let active) where active == key: return .descending(key)
    case .descending(let active) where active == key: return .none
    default: return .ascending(key)
    }
  }

  public static func aria(_ current: CSGridSort, key: String) -> String? {
    switch current {
    case .ascending(let active) where active == key: return "ascending"
    case .descending(let active) where active == key: return "descending"
    default: return nil
    }
  }

  public static func ordered(_ rows: [[String: String]], sort: CSGridSort, values: [String: ([String: String]) -> String?] = [:]) -> [[String: String]] {
    let key: String
    let descending: Bool
    switch sort {
    case .none: return rows
    case .ascending(let active):
      key = active
      descending = false
    case .descending(let active):
      key = active
      descending = true
    }
    return rows.enumerated().sorted { lhs, rhs in
      let x: String?
      let y: String?
      if let value = values[key] {
        x = value(lhs.element)
        y = value(rhs.element)
      } else {
        x = lhs.element[key]
        y = rhs.element[key]
      }
      if let x, let y, x != y { return descending ? x > y : x < y }
      return lhs.offset < rhs.offset
    }.map(\.element)
  }
}

public struct CSDataColumn: Hashable {
  public let key: String
  public let header: String
  public let sortable: Bool
  public let pinned: Bool
  public init(key: String, header: String, sortable: Bool = true, pinned: Bool = false) {
    self.key = key
    self.header = header
    self.sortable = sortable
    self.pinned = pinned
  }
}

public struct CSDataGrid: View {
  public let columns: [CSDataColumn]
  public let rows: [[String: String]]
  public let selectable: Bool
  public let selected: [String]
  public let selectAllLabel: String?
  public let empty: String?
  public let language: String?
  public let clearLabel: String
  public let filterText: String?
  public let filterKeys: [String]?
  public let persistKey: String?
  public let caption: String?
  public let sortValues: [String: ([String: String]) -> String?]
  public let renders: [String: ([String: String]) -> String?]
  public let rowKeyName: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: ([String]) -> Void
  let columnStore: any CSGridColumnStore
  public let gridHeight: Double
  public let gridRowHeight: Double
  public let measuredRowHeight: Double?
  public let virtualRows: Bool
  public let virtualThreshold: Int
  @State private var sort = CSGridSort.none
  @State private var sortFocusId = UUID().uuidString
  @FocusState private var sortColumn: String?
  @State private var columnOrder: [String]? = nil
  @State private var pinnedKey: String? = nil
  @State private var scrollTop = 0.0
  @State private var settledRowHeight: Double? = nil
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(columns: [CSDataColumn], rows: [[String: String]], selectable: Bool, selected: [String], selectAllLabel: String? = nil, clearLabel: String = "", filterText: String? = nil, filterKeys: [String]? = nil, persistKey: String? = nil, caption: String? = nil, sortValues: [String: ([String: String]) -> String?] = [:], renders: [String: ([String: String]) -> String?] = [:], rowKeyName: String = "id", dark: Bool, highContrast: Bool, compact: Bool, gridHeight: Double = 280, gridRowHeight: Double = 36, measuredRowHeight: Double? = nil, virtualRows: Bool = false, virtualThreshold: Int = 80, columnStore: (any CSGridColumnStore)? = nil, empty: String? = nil, language: String? = nil, onSelect: @escaping ([String]) -> Void = { _ in }) {
    self.columns = columns
    self.rows = rows
    self.selectable = selectable
    self.selected = selected
    self.selectAllLabel = selectAllLabel
    self.clearLabel = clearLabel
    self.filterText = filterText
    self.filterKeys = filterKeys
    self.persistKey = persistKey
    self.caption = caption
    self.sortValues = sortValues
    self.renders = renders
    self.rowKeyName = rowKeyName
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.gridHeight = gridHeight
    self.gridRowHeight = gridRowHeight
    self.measuredRowHeight = measuredRowHeight
    self.virtualRows = virtualRows
    self.virtualThreshold = virtualThreshold
    self.empty = empty
    self.language = language
    self.columnStore = columnStore ?? CSGridDefaultsStore()
    self.onSelect = onSelect
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let allName = CSDataGridSelection.selectAllText(selectAllLabel, fallback: CSDataGridSelection.copy("selectAll", language: locale))
    let pinTemplate = CSDataGridSelection.copy("pinNamed", language: locale)
    let orderedColumns = CSDataGridSelection.orderedKeys(order: columnOrder, columns: columns.map(\.key)).compactMap { key in columns.first { $0.key == key } }
    let keysToSearch = CSDataGridSelection.filterKeys(requested: filterKeys, columns: orderedColumns.map(\.key))
    let shown = CSGridSort.ordered(CSDataGridSelection.filtered(rows: rows, query: filterText, keys: keysToSearch), sort: sort, values: sortValues)
    let useVirtual = CSDataGridSelection.virtual(enabled: virtualRows, count: shown.count, threshold: virtualThreshold)
    let settled = settledRowHeight ?? CSDataGridSelection.measured(gridRowHeight, next: measuredRowHeight ?? gridRowHeight)
    let row = CSDataGridSelection.rowHeight(requested: gridRowHeight, measured: settled)
    let frame = CSDataGridSelection.window(count: shown.count, height: gridHeight, rowHeight: row, scrollTop: scrollTop, virtual: useVirtual)
    let indexes = CSDataGridSelection.painted(count: shown.count, window: frame)
    let pads = CSDataGridSelection.pad(count: shown.count, window: frame, rowHeight: row)
    let keys = shown.enumerated().map { CSDataGridSelection.rowKey(value: $0.element[rowKeyName], index: $0.offset) }
    VStack(alignment: .leading, spacing: 0) {
      if CSDataGridSelection.showsCaption(caption), let caption {
        Text(caption)
          .font(.system(size: pack.fontSizeSm.points, weight: .bold))
          .foregroundStyle(pack.primaryTextColor)
          .padding(.bottom, CGFloat(CSTableStyleModel.captionMarginBottom()))
      }
      HStack {
        ForEach(orderedColumns, id: \.key) { column in
          HStack(spacing: 4) {
            if column.sortable {
              Button(action: {
                CSFocusRegistry.shared.claim(id: "\(sortFocusId)-\(column.key)", restore: { sortColumn = column.key })
                sort = CSGridSort.next(sort, key: column.key)
              }) {
                HStack(spacing: 4) {
                  Text(column.header)
                  Text(CSGridSort.aria(sort, key: column.key) == "ascending" ? "▲" : CSGridSort.aria(sort, key: column.key) == "descending" ? "▼" : "↕")
                    .accessibilityHidden(true)
                }
              }
              .buttonStyle(.plain)
              .padding(CGFloat(CSDataGridSelection.sortPadding()))
              .foregroundStyle(pack.primaryTextColor)
              .focused($sortColumn, equals: column.key)
              .accessibilityValue(Text(CSGridSort.aria(sort, key: column.key) ?? ""))
            } else {
              Text(column.header).foregroundStyle(pack.primaryTextColor)
            }
            if persistKey != nil {
              CSTriggerButton(CSDataGridSelection.copy("pin", language: locale)) {
                guard let next = CSDataGridSelection.pin(order: orderedColumns.map(\.key), key: column.key, canPersist: true) else { return }
                columnOrder = next
                pinnedKey = column.key
                if let storage = CSDataGridSelection.storageKey(persistKey), let encoded = CSDataGridSelection.encodeOrder(next) {
                  columnStore.set(encoded, forKey: storage)
                }
              }
              .accessibilityLabel(CSDataGridSelection.pinName(header: column.header.isEmpty ? nil : column.header, key: column.key, template: pinTemplate))
            }
          }
          .font(.system(size: CGFloat(CSTableStyleModel.headerFontSize(pack)), weight: .bold))
          .padding(.horizontal, CGFloat(CSTableStyleModel.cellPaddingX()))
          .padding(.vertical, CGFloat(CSTableStyleModel.cellPaddingY()))
          .zIndex((column.pinned || CSDataGridSelection.sticky(column.key, pinned: pinnedKey) != nil) ? 1 : 0)
        }
      }
      .background(pack.colorSurfaceRaised.color)
      .zIndex(Double(CSDataGridSelection.headerLayer()))
      .offset(y: CSDataGridSelection.headerStart())
      .accessibilityCustomContent(AccessibilityCustomContentKey("rowindex", id: "rowindex"), CSDataGridSelection.rowIndex(virtual: useVirtual, position: 0, header: true).map { Text(String($0)) })
      .onChange(of: sortColumn) { key in
        if let key { CSFocusRegistry.shared.claim(id: "\(sortFocusId)-\(key)", restore: { sortColumn = key }) }
      }
      if selectable {
        let all = CSDataGridSelection.allSelected(selectable: true, keys: keys, selected: selected)
        CSCheckbox(label: allName, isOn: Binding(get: { all }, set: { next in
          if next == all { return }
          onSelect(CSDataGridSelection.toggleAll(keys: keys, selected: selected))
        }), dark: dark, highContrast: highContrast, compact: compact)
          .frame(width: CGFloat(CSDataGridSelection.selectionWidth()), alignment: .center)
          .frame(maxHeight: .infinity, alignment: CSDataGridSelection.checkAlignment())
      }
      if shown.isEmpty {
        Text(CSDataGridSelection.emptyText(empty, fallback: CSDataGridSelection.copy("empty", language: locale)))
          .padding(.vertical, CGFloat(CSTableStyleModel.statusPaddingY(pack)))
          .foregroundStyle(pack.mutedColor)
          .accessibilityCustomContent(AccessibilityCustomContentKey("rowindex", id: "rowindex"), CSDataGridSelection.rowIndex(virtual: useVirtual, position: 0).map { Text(String($0)) })
      } else {
      Group {
        if useVirtual {
          ScrollView {
            GeometryReader { geo in
              Color.clear.preference(key: CSGridScrollKey.self, value: max(0, -geo.frame(in: .named("cs-grid")).minY))
            }
            .frame(height: 0)
            gridRows(shown: shown, indexes: indexes, orderedColumns: orderedColumns, pack: pack, pads: pads, box: CSDataGridSelection.rowBox(virtual: useVirtual, height: row))
          }
          .coordinateSpace(name: "cs-grid")
          .frame(height: max(0, gridHeight - 40))
          .onPreferenceChange(CSGridScrollKey.self) { scrollTop = CSDataGridSelection.scrolled(virtual: useVirtual, current: scrollTop, next: $0) }
        } else {
          gridRows(shown: shown, indexes: indexes, orderedColumns: orderedColumns, pack: pack, pads: pads, box: CSDataGridSelection.rowBox(virtual: useVirtual, height: row))
        }
      }
      }
    }
    .background(pack.colorSurfacePanel.color)
    .padding(CGFloat(CSDataGridSelection.tableMargin()))
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(pack.colorBorderDefault.color, lineWidth: 1))
    .accessibilityCustomContent(AccessibilityCustomContentKey("data-virtual", id: "data-virtual"), Text(CSDataGridSelection.virtualFlag(useVirtual)))
    .accessibilityCustomContent(AccessibilityCustomContentKey("cs-datagrid--virtual", id: "cs-datagrid--virtual"), CSDataGridSelection.virtualClass(useVirtual).map { Text($0) })
    .accessibilityCustomContent(AccessibilityCustomContentKey("data-row-count", id: "data-row-count"), Text(String(CSDataGridSelection.dataCount(shown.count))))
    .accessibilityCustomContent(AccessibilityCustomContentKey("data-row-height", id: "data-row-height"), CSDataGridSelection.rowBox(virtual: useVirtual, height: row).map { Text(String($0)) })
    .accessibilityCustomContent(AccessibilityCustomContentKey("rowcount", id: "rowcount"), CSDataGridSelection.rowCount(virtual: useVirtual, count: shown.count).map { Text(String($0)) })
    .onAppear {
      settledRowHeight = CSDataGridSelection.measured(gridRowHeight, next: measuredRowHeight ?? gridRowHeight)
      guard let key = CSDataGridSelection.storageKey(persistKey) else {
        columnOrder = nil
        return
      }
      columnOrder = CSDataGridSelection.decodeOrder(columnStore.string(forKey: key))
    }
    .onChange(of: measuredRowHeight) { _ in
      settledRowHeight = CSDataGridSelection.measured(settledRowHeight ?? gridRowHeight, next: measuredRowHeight ?? gridRowHeight)
    }
  }

  @ViewBuilder
  private func gridRows(shown: [[String: String]], indexes: [Int], orderedColumns: [CSDataColumn], pack: CSTokenModePack, pads: (top: Double, bottom: Double), box: Double?) -> some View {
    if pads.top > 0 { Color.clear.frame(height: pads.top).accessibilityHidden(true) }
    ForEach(indexes, id: \.self) { index in
      let row = shown[index]
      let key = CSDataGridSelection.rowKey(value: row[rowKeyName], index: index)
      let fill = CSDataGridSelection.selectedFill(dark: dark, tint: pack.accentTint, accent: pack.accent, panel: pack.colorSurfacePanel)
      HStack(alignment: .center) {
        if selectable {
          CSCheckbox(label: "\(CSDataGridSelection.copy("selectRow", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))): \(CSDataGridSelection.rowName(cells: orderedColumns.map { row[$0.key] }, key: key))", isOn: Binding(get: { selected.contains(key) }, set: { next in
            if next == selected.contains(key) { return }
            onSelect(CSDataGridSelection.toggle(selected: selected, key: key))
          }), dark: dark, highContrast: highContrast, compact: compact)
            .frame(width: CGFloat(CSDataGridSelection.selectionWidth()), alignment: .center)
          .frame(maxHeight: .infinity, alignment: CSDataGridSelection.checkAlignment())
        }
        ForEach(orderedColumns.filter { CSDataGridSelection.isPinned(columnPinned: $0.pinned, key: $0.key, pinnedKey: pinnedKey) }, id: \.key) { column in
          Text(CSDataGridSelection.cellText(row: row, key: column.key, render: renders[column.key]))
            .foregroundStyle(pack.primaryTextColor)
            .padding(.horizontal, CGFloat(CSTableStyleModel.cellPaddingX()))
            .padding(.vertical, CGFloat(CSTableStyleModel.cellPaddingY()))
            .background(selected.contains(key) ? fill : pack.colorSurfacePanel.color)
            .zIndex(1)
        }
        ScrollView(.horizontal, showsIndicators: false) {
          HStack {
            ForEach(orderedColumns.filter { !CSDataGridSelection.isPinned(columnPinned: $0.pinned, key: $0.key, pinnedKey: pinnedKey) }, id: \.key) { column in
              Text(CSDataGridSelection.cellText(row: row, key: column.key, render: renders[column.key]))
                .foregroundStyle(pack.primaryTextColor)
                .padding(.horizontal, CGFloat(CSTableStyleModel.cellPaddingX()))
                .padding(.vertical, CGFloat(CSTableStyleModel.cellPaddingY()))
            }
          }
        }
      }
      .frame(minHeight: box.map { CGFloat($0) } ?? pack.componentButtonMdMinHeight.points)
      .frame(height: box.map { CGFloat($0) })
      .background(selected.contains(key) ? fill : Color.clear)
      .accessibilityElement(children: .contain)
      .accessibilityAddTraits((selectable && selected.contains(key)) ? .isSelected : [])
      .accessibilityCustomContent(AccessibilityCustomContentKey("rowindex", id: "rowindex"), CSDataGridSelection.rowIndex(virtual: CSDataGridSelection.virtual(enabled: virtualRows, count: shown.count, threshold: virtualThreshold), position: index).map { Text(String($0)) })
    }
    if pads.bottom > 0 { Color.clear.frame(height: pads.bottom).accessibilityHidden(true) }
  }
}

struct CSGridScrollKey: PreferenceKey {
  static var defaultValue: Double = 0
  static func reduce(value: inout Double, nextValue: () -> Double) { value = nextValue() }
}

public struct CSTagEdit: Equatable {
  public let tags: [String]
  public let query: String
}

public enum CSTagInputModel {
  public static let placeholderDefault = "Add a tag…"
  public static let removeDefault = "Remove"
  public static let closeIconPath = "M6 6l12 12M18 6L6 18"
  public static func closeIconSize() -> Double { 12 }
  public static func closeIconStrokeWidth() -> Double { 2.4 }
  public static func labelId(_ id: String, label: String?) -> String? {
    guard let label, !label.isEmpty else { return nil }
    return "\(id)-label"
  }
  public static func descriptionId(_ id: String, description: String?) -> String? {
    guard let description, !description.isEmpty else { return nil }
    return "\(id)-description"
  }
  public static func errorId(_ id: String, error: String?) -> String? {
    guard let error, !error.isEmpty else { return nil }
    return "\(id)-error"
  }
  public static func labelledBy(explicit: String?, hasAriaLabel: Bool, id: String, label: String?) -> String? {
    if let explicit, !explicit.isEmpty { return explicit }
    if hasAriaLabel { return nil }
    return labelId(id, label: label)
  }
  public static func describedBy(explicit: String?, descriptionId: String?, errorId: String?) -> String? {
    CSTextFieldModel.describedBy(explicit: explicit, descriptionId: descriptionId, errorId: errorId)
  }
  public static func tags(value: [String]?, inner: [String]) -> [String] { value ?? inner }
  public static func shownPlaceholder(text: String?, tags: [String], fallback: String) -> String {
    if !tags.isEmpty { return "" }
    return text ?? fallback
  }
  public static func removeName(label: String?, tag: String, fallback: String) -> String {
    "\(label ?? fallback) \(tag)"
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Thêm thẻ…", "remove": "Gỡ"],
      "en": ["placeholder": placeholderDefault, "remove": removeDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func canEdit(disabled: Bool, composing: Bool) -> Bool { !disabled && !composing }
  public static func add(tags: [String], query: String, max: Int?) -> CSTagEdit {
    let text = query.trimmingCharacters(in: .whitespacesAndNewlines)
    if text.isEmpty { return CSTagEdit(tags: tags, query: query) }
    if tags.contains(text) { return CSTagEdit(tags: tags, query: "") }
    if let max, tags.count >= max { return CSTagEdit(tags: tags, query: query) }
    return CSTagEdit(tags: tags + [text], query: "")
  }

  public static func backspace(tags: [String], query: String) -> [String] {
    query.isEmpty && !tags.isEmpty ? Array(tags.dropLast()) : tags
  }

  public static func remove(tags: [String], tag: String, disabled: Bool = false) -> [String] {
    guard !disabled else { return tags }
    return tags.filter { $0 != tag }
  }

  public static func blurCommit(tags: [String], query: String, max: Int?, disabled: Bool = false) -> CSTagEdit {
    guard !disabled else { return CSTagEdit(tags: tags, query: query) }
    return add(tags: tags, query: query, max: max)
  }
}

public struct CSTagInput: View {
  public let label: String
  public let descriptionText: String?
  public let error: String?
  public let required: Bool
  public let tags: [String]
  public let query: String
  public let removeLabel: String?
  public let language: String?
  public let max: Int?
  public let disabled: Bool
  public let placeholder: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onChange: ([String], String) -> Void
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, tags: [String], query: String, removeLabel: String? = nil, max: Int? = nil, disabled: Bool = false, placeholder: String? = nil, description: String? = nil, error: String? = nil, required: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, onChange: @escaping ([String], String) -> Void) {
    self.label = label
    self.descriptionText = description
    self.error = error
    self.required = required
    self.tags = tags
    self.query = query
    self.removeLabel = removeLabel
    self.max = max
    self.disabled = disabled
    self.placeholder = placeholder
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onChange = onChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let locale = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let hint = CSTagInputModel.shownPlaceholder(text: placeholder, tags: [], fallback: CSTagInputModel.copy("placeholder", language: locale))
    let visible = CSTagInputModel.shownPlaceholder(text: placeholder, tags: tags, fallback: CSTagInputModel.copy("placeholder", language: locale))
    let invalid = CSTextareaModel.isAlert(error)
    VStack(alignment: .leading, spacing: CGFloat(CSControlsWaveStyleModel.tagInputGap())) {
      if !label.isEmpty { Text(label).foregroundStyle(pack.primaryTextColor).accessibilityHidden(true) }
      HStack(spacing: CGFloat(CSControlsWaveStyleModel.tagInputGap())) {
        ForEach(tags, id: \.self) { tag in
          HStack(spacing: CGFloat(CSFeedbackStyleModel.tagGap())) {
            Text(tag).font(.system(size: pack.fontSizeXs.points, weight: .semibold)).foregroundStyle(pack.primaryTextColor)
            CSTriggerButton(CSTagInputModel.removeName(label: removeLabel, tag: tag, fallback: CSTagInputModel.copy("remove", language: locale))) {
              guard CSTagInputModel.canEdit(disabled: disabled, composing: false) else { return }
              onChange(CSTagInputModel.remove(tags: tags, tag: tag, disabled: disabled), query)
            }
            .disabled(disabled)
            .frame(minHeight: 44)
          }
        }
      }
      TextField(visible, text: Binding(get: { query }, set: { next in
        CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
        guard CSTagInputModel.canEdit(disabled: disabled, composing: false) else { return }
        if next.contains(",") {
          let edit = CSTagInputModel.add(tags: tags, query: next.replacingOccurrences(of: ",", with: ""), max: max)
          onChange(edit.tags, edit.query)
        } else {
          onChange(tags, next)
        }
      }))
        .frame(minWidth: CGFloat(CSControlsWaveStyleModel.tagInputFieldMinWidth()))
        .opacity(disabled ? CSControlsWaveStyleModel.tagInputDisabledFieldOpacity() : 1.0)
        .focused($focused)
        .onChange(of: focused) { isFocused in
          if isFocused {
            CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
          } else {
            let edit = CSTagInputModel.blurCommit(tags: tags, query: query, max: max, disabled: disabled)
            if edit.tags != tags || edit.query != query {
              onChange(edit.tags, edit.query)
            }
          }
        }
        .disabled(disabled)
        .accessibilityLabel(label.isEmpty ? hint : label)
        .onSubmit {
          CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
          guard CSTagInputModel.canEdit(disabled: disabled, composing: false) else { return }
          let edit = CSTagInputModel.add(tags: tags, query: query, max: max)
          onChange(edit.tags, edit.query)
        }
      if let descriptionText, CSTextareaModel.shows(descriptionText) {
        Text(descriptionText).font(.system(size: CGFloat(CSTextFieldModel.descriptionFontSize()))).foregroundStyle(pack.mutedColor)
      }
      if let error, invalid {
        Text(error).font(.system(size: CGFloat(CSTextFieldModel.errorFontSize()))).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
    .frame(minWidth: CGFloat(CSControlsWaveStyleModel.tagInputMinWidth()), alignment: .leading)
    .opacity(CSTextFieldModel.opacity(disabled: disabled))
    .accessibilityElement(children: .contain)
  }
}

public struct CSConfidenceMeasurement: Equatable {
  public let tone: String
  public let filled: Int
  public let segments: Int
}

public enum CSConfidence {
  public static let labelDefault = "Confidence"
  public static let lowDefault = "Low"
  public static let mediumDefault = "Medium"
  public static let highDefault = "High"
  public static func label(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Độ tin cậy", "low": "Thấp", "medium": "Trung bình", "high": "Cao"],
      "en": ["label": labelDefault, "low": lowDefault, "medium": mediumDefault, "high": highDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func toneWord(tone: String, low: String, medium: String, high: String) -> String {
    switch tone {
    case "low": return low
    case "high": return high
    default: return medium
    }
  }
  public static func name(label: String, word: String) -> String { label.isEmpty ? word : label + " " + word }
  public static func labelId(_ id: String) -> String { "\(id)-label" }
  public static func levelId(_ id: String) -> String { "\(id)-level" }
  public static func labelledBy(_ id: String) -> String { "\(labelId(id)) \(levelId(id))" }
  public static func meterMin() -> Int { 0 }
  public static func meterMax(_ measurement: CSConfidenceMeasurement) -> Int { measurement.segments }
  public static func meterNow(_ measurement: CSConfidenceMeasurement) -> Int { measurement.filled }
  public static func measure(value: Double?, level: String?, segments: Double) -> CSConfidenceMeasurement {
    let source = segments.isFinite ? segments : .nan
    let segs = CSRenderCount.whole(source == 0 ? .nan : source, fallback: 5, minimum: 1)
    if let value {
      let numeric = value.isFinite ? value : 0
      let clamped = min(1, Swift.max(0, numeric))
      let tone = clamped < 0.4 ? "low" : clamped < 0.75 ? "medium" : "high"
      let filled = min(segs, max(0, Int((clamped * Double(segs)).rounded())))
      return CSConfidenceMeasurement(tone: tone, filled: filled, segments: segs)
    }
    let known = level == "low" || level == "medium" || level == "high"
    let tone = known ? level ?? "medium" : "medium"
    let fill = tone == "low" ? 2 : tone == "high" ? 5 : 3
    let filled = min(segs, max(0, Int((Double(fill) / 5 * Double(segs)).rounded())))
    return CSConfidenceMeasurement(tone: tone, filled: filled, segments: segs)
  }
}

public struct CSConfidenceMeter: View {
  public let label: String?
  public let toneLabel: String
  public let measurement: CSConfidenceMeasurement
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, toneLabel: String = "", value: Double? = nil, level: String? = nil, segments: Double = 5, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil) {
    self.label = label
    self.toneLabel = toneLabel
    measurement = CSConfidence.measure(value: value, level: level, segments: segments)
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let color: Color = switch measurement.tone {
    case "low": pack.colorSemanticDanger.color
    case "high": pack.colorSemanticSuccess.color
    default: pack.colorSemanticWarning.color
    }
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let shown = CSConfidence.label(label, fallback: CSConfidence.copy("label", language: spoken))
    let word = CSConfidence.toneWord(tone: measurement.tone, low: CSConfidence.copy("low", language: spoken), medium: CSConfidence.copy("medium", language: spoken), high: CSConfidence.copy("high", language: spoken))
    let ink: Color = switch measurement.tone {
    case "low": pack.colorSemanticDangerText.color
    case "high": pack.colorSemanticSuccessText.color
    default: pack.colorSemanticWarningText.color
    }
    VStack(alignment: .leading, spacing: CGFloat(CSAIStyleModel.confidenceGap())) {
      HStack(alignment: .firstTextBaseline, spacing: 8) {
        Text(shown)
          .font(.system(size: CGFloat(CSAIStyleModel.confidenceHeadFontSize(pack)), weight: .semibold))
          .foregroundStyle(pack.primaryTextColor)
        Spacer(minLength: 8)
        Text(word)
          .font(.system(size: CGFloat(CSAIStyleModel.confidenceLevelFontSize(pack)), weight: .bold))
          .foregroundStyle(ink)
      }
      HStack(spacing: CGFloat(CSAIStyleModel.confidenceTrackGap())) {
        ForEach(0..<measurement.segments, id: \.self) { index in
          RoundedRectangle(cornerRadius: CGFloat(CSAIStyleModel.confidenceSegmentRadius()))
            .fill(index < measurement.filled ? color : pack.borderColor)
            .frame(width: 16, height: CGFloat(CSAIStyleModel.confidenceSegmentHeight()))
        }
      }
    }
    .accessibilityElement(children: .combine)
    .accessibilityLabel(CSConfidence.name(label: shown, word: word))
    .accessibilityValue(Text(String(CSConfidence.meterNow(measurement))))
  }
}

public enum CSCollapsibleModel {
  public static func borderWidth() -> Double { 1 }
  public static func triggerGap() -> Double { 12 }
  public static func triggerPaddingY() -> Double { 12 }
  public static func triggerPaddingX() -> Double { 16 }
  public static func showsTriggerHover(hovered: Bool) -> Bool { hovered }
  public static func chevronDegrees(isOpen: Bool) -> Double { isOpen ? 180 : 0 }
  public static func panelPaddingX() -> Double { 16 }
  public static func panelPaddingBottom() -> Double { 14 }
  public static func edgeChildMargin() -> Double { 0 }
  public static func resolvedLabel(title: String?, trigger: String?) -> String { title ?? trigger ?? "" }
  public static func triggerId(_ prefix: String) -> String { "\(prefix)-trigger" }
  public static func panelId(_ prefix: String) -> String { "\(prefix)-panel" }
  public static let chevronPath = "M6 9l6 6 6-6"
  public static func chevronSize() -> Double { 18 }
  public static func ariaControls(panelId: String, isOpen: Bool) -> String? { isOpen ? panelId : nil }
}

public struct CSCollapsible: View {
  public let title: String
  public let trigger: String?
  public let content: String
  public let expandedLabel: String
  public let collapsedLabel: String
  @Binding var isOpen: Bool
  @State private var hovered = false
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onOpenChange: (Bool) -> Void

  public init(title: String, trigger: String? = nil, content: String, expandedLabel: String = "Expanded", collapsedLabel: String = "Collapsed", isOpen: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, onOpenChange: @escaping (Bool) -> Void = { _ in }) {
    self.title = title
    self.trigger = trigger
    self.content = content
    self.expandedLabel = expandedLabel
    self.collapsedLabel = collapsedLabel
    _isOpen = isOpen
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onOpenChange = onOpenChange
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let label = CSCollapsibleModel.resolvedLabel(title: title.isEmpty && trigger != nil ? nil : title, trigger: trigger)
    let showHover = CSCollapsibleModel.showsTriggerHover(hovered: hovered)
    VStack(alignment: .leading, spacing: 0) {
      HStack(alignment: .center, spacing: CGFloat(CSCollapsibleModel.triggerGap())) {
        CSTriggerButton(label) {
          isOpen.toggle()
          onOpenChange(isOpen)
        }
        .font(.system(size: pack.fontSizeSm.points, weight: .semibold))
        .foregroundStyle(pack.primaryTextColor)
        .frame(maxWidth: .infinity, alignment: .leading)
        CSIcon(name: "chevron-down", label: "", dark: dark, highContrast: highContrast, compact: compact)
          .foregroundStyle(pack.mutedColor)
          .rotationEffect(.degrees(CSCollapsibleModel.chevronDegrees(isOpen: isOpen)))
          .accessibilityHidden(true)
      }
      .padding(.vertical, CGFloat(CSCollapsibleModel.triggerPaddingY()))
      .padding(.horizontal, CGFloat(CSCollapsibleModel.triggerPaddingX()))
      .frame(maxWidth: .infinity, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
      .background(showHover ? pack.colorSurfaceRaised.color : Color.clear)
      .onHover { inside in hovered = inside }
      .accessibilityValue(Text(isOpen ? expandedLabel : collapsedLabel))
      if isOpen {
        Text(content)
          .font(.system(size: pack.fontSizeSm.points))
          .lineSpacing(CGFloat(Double(pack.fontSizeSm.points) * (pack.fontLineHeightBody - 1)))
          .foregroundStyle(pack.mutedColor)
          .padding(.vertical, CGFloat(CSCollapsibleModel.edgeChildMargin()))
          .padding(.horizontal, CGFloat(CSCollapsibleModel.panelPaddingX()))
          .padding(.bottom, CGFloat(CSCollapsibleModel.panelPaddingBottom()))
      }
    }
    .background(pack.colorSurfacePanel.color, in: RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
    .overlay(RoundedRectangle(cornerRadius: pack.radiusMd.points).stroke(pack.colorBorderDefault.color, lineWidth: CGFloat(CSCollapsibleModel.borderWidth())))
  }
}

public enum CSTimelineModel {
  public static func markerSize() -> Double { 26 }
  public static func itemGap() -> Double { 14 }
  public static func railOffset() -> Double { 12 }
  public static func railWidth() -> Double { 2 }
  public static func todoBorderWidth() -> Double { 1 }
  public static func titleMarginY() -> Double { 2 }
  public static func bodyMarginTop() -> Double { 4 }
  public static func showsRail(index: Int, count: Int) -> Bool { index >= 0 && index < count - 1 }
  public static func marker(_ state: String) -> String {
    if state == "todo" { return "" }
    if state == "now" { return "→" }
    return "✓"
  }

  public static func showsDetail(_ text: String?) -> Bool {
    guard let text else { return false }
    return !text.isEmpty
  }
}

public struct CSTimelineItem: Hashable {
  public let title: String
  public let state: String
  public let meta: String?
  public let body: String?
  public init(title: String, state: String = "done", meta: String? = nil, body: String? = nil) {
    self.title = title
    self.state = state
    self.meta = meta
    self.body = body
  }
}

public struct CSTimeline: View {
  public let items: [CSTimelineItem]
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(items: [CSTimelineItem], dark: Bool, highContrast: Bool, compact: Bool) {
    self.items = items
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 0) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        let state = item.state
        let fill = state == "now" ? pack.colorBrandOchre : state == "todo" ? pack.colorSurfaceRaised : pack.colorSemanticSuccess
        let ink = state == "now" ? pack.colorBrandUmber : state == "todo" ? pack.colorTextMuted : pack.colorSemanticSuccessFg
        HStack(alignment: .top, spacing: CGFloat(CSTimelineModel.itemGap())) {
          Text(CSTimelineModel.marker(state))
            .font(.system(size: pack.fontSizeXs.points, weight: .bold))
            .foregroundStyle(ink.color)
            .frame(width: CGFloat(CSTimelineModel.markerSize()), height: CGFloat(CSTimelineModel.markerSize()))
            .background(fill.color)
            .overlay { if state == "todo" { Circle().stroke(pack.colorBorderDefault.color, lineWidth: CGFloat(CSTimelineModel.todoBorderWidth())) } }
            .clipShape(Circle())
            .accessibilityHidden(true)
          VStack(alignment: .leading, spacing: 0) {
            Text(item.title)
              .font(.system(size: pack.fontSizeMd.points, weight: .bold))
              .foregroundStyle(pack.primaryTextColor)
              .padding(.vertical, CGFloat(CSTimelineModel.titleMarginY()))
            if CSTimelineModel.showsDetail(item.meta), let meta = item.meta {
              Text(meta)
                .font(.system(size: pack.fontSizeXs.points, design: .monospaced))
                .foregroundStyle(pack.mutedColor)
            }
            if CSTimelineModel.showsDetail(item.body), let body = item.body {
              Text(body)
                .font(.system(size: pack.fontSizeSm.points))
                .foregroundStyle(pack.mutedColor)
                .padding(.top, CGFloat(CSTimelineModel.bodyMarginTop()))
            }
          }
        }
        .padding(.bottom, pack.space5.points)
        .background(alignment: .topLeading) {
          if CSTimelineModel.showsRail(index: index, count: items.count) {
            Rectangle()
              .fill(pack.colorBorderDefault.color)
              .frame(width: CGFloat(CSTimelineModel.railWidth()))
              .padding(.top, CGFloat(CSTimelineModel.markerSize()))
              .padding(.leading, CGFloat(CSTimelineModel.railOffset()))
              .accessibilityHidden(true)
          }
        }
      }
    }
  }
}

public enum CSToolbarModel {
  public static let moreDefault = "More actions"
  public static let moreGlyph = "⋯"
  public static let placementDefault = "bottom-end"
  public static let gap = 6.0
  public static func menuMove(current: Int, count: Int, delta: Int) -> Int {
    toolbarMove(current: current, count: count, delta: delta)
  }
  public static func groupLabel(_ label: String?) -> String? { label }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["more": "Thao tác khác"],
      "en": ["more": moreDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func cut(count: Int, overflowAfter: Int?) -> Int {
    guard let overflowAfter else { return count }
    return min(count, max(0, overflowAfter))
  }
  public static func head(_ items: [String], overflowAfter: Int?) -> [String] {
    Array(items.prefix(cut(count: items.count, overflowAfter: overflowAfter)))
  }
  public static func tail(_ items: [String], overflowAfter: Int?) -> [String] {
    Array(items.dropFirst(cut(count: items.count, overflowAfter: overflowAfter)).filter { $0 != "-" })
  }
  public static func controlCount(head: [String], hasMore: Bool) -> Int {
    head.filter { $0 != "-" }.count + (hasMore ? 1 : 0)
  }
  public static func toolbarMove(current: Int, count: Int, delta: Int) -> Int {
    guard count > 0 else { return 0 }
    return min(count - 1, max(0, current + delta))
  }
  public static func showsItem(_ label: String?) -> Bool {
    guard let label else { return false }
    return !label.isEmpty
  }
  public static func placement(_ explicit: String?) -> String { explicit ?? placementDefault }
  public static func shift(anchor: CSFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CSFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String) -> CSToolbarPlace? {
    guard let initial = CSFloatingModel.position(anchor: anchor, panelWidth: naturalWidth, panelHeight: naturalHeight, viewport: viewport, placement: placement, gap: gap) else { return nil }
    guard let placed = CSFloatingModel.position(anchor: anchor, panelWidth: fittedWidth, panelHeight: fittedHeight, viewport: viewport, placement: initial.placement, gap: gap) else { return nil }
    let sx = scaleX == 0 ? 1 : scaleX
    let sy = scaleY == 0 ? 1 : scaleY
    return CSToolbarPlace(x: (placed.left - originX) / sx, y: (placed.top - originY) / sy, maxWidth: initial.maxWidth, maxHeight: initial.maxHeight, placement: placed.placement)
  }
}

public struct CSToolbarPlace: Equatable {
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

public struct CSToolbar: View {
  public let label: String?
  public let items: [String]
  public let overflowAfter: Int?
  public let placement: String?
  public let portal: Bool
  @State private var focus: Int = 0
  @State private var anchor = CGRect.zero
  @State private var naturalSize: CGSize?
  @State private var fittedSize: CGSize?
  @State private var panelOrigin: CGPoint?
  @State private var panelScale = CGSize(width: 1, height: 1)
  @State private var measurePass = 0
  @State private var keysArmed = false
  @FocusState private var toolbarFocused: Bool
  @State private var open = false
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onSelect: (String) -> Void
  public let language: String?
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String? = nil, items: [String], overflowAfter: Int? = nil, portal: Bool = true, dark: Bool, highContrast: Bool, compact: Bool, language: String? = nil, placement: String? = nil, onSelect: @escaping (String) -> Void = { _ in }) {
    self.label = label
    self.items = items
    self.overflowAfter = overflowAfter
    self.portal = portal
    self.placement = placement
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
    self.onSelect = onSelect
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let moreName = CSToolbarModel.copy("more", language: CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage))
    let shown = CSToolbarModel.head(items, overflowAfter: overflowAfter)
    let extra = CSToolbarModel.tail(items, overflowAfter: overflowAfter)
    let actionable = shown.enumerated().filter { $0.element != "-" }.map(\.offset) + (extra.isEmpty ? [] : [shown.count])
    VStack(alignment: .leading, spacing: 0) {
    HStack(spacing: CGFloat(CSControlsBatchStyleModel.toolbarGap())) {
      ForEach(Array(shown.enumerated()), id: \.offset) { index, item in
        if item == "-" {
          Rectangle().fill(pack.borderColor).frame(width: 1, height: CGFloat(CSControlsBatchStyleModel.toolbarSeparatorHeight())).accessibilityHidden(true)
        } else {
          CSTriggerButton(item) {
            focus = index
            onSelect(item)
          }
          .frame(minHeight: max(CGFloat(CSControlsBatchStyleModel.toolbarButtonMinHeight()), pack.componentButtonMdMinHeight.points))
          .accessibilityAddTraits(focus == index ? .isSelected : [])
        }
      }
      if !extra.isEmpty {
        CSTriggerButton(CSToolbarModel.moreGlyph) { open.toggle() }
          .frame(minHeight: max(CGFloat(CSControlsBatchStyleModel.toolbarButtonMinHeight()), pack.componentButtonMdMinHeight.points))
          .accessibilityLabel(moreName)
          .accessibilityValue(open ? "true" : "false")
          .background(GeometryReader { geo in
            Color.clear.preference(key: CSToolbarAnchorKey.self, value: geo.frame(in: .global))
          })
      }
    }
    .padding(CGFloat(CSControlsBatchStyleModel.toolbarPadding()))
    .accessibilityElement(children: .contain)
    .accessibilityLabel(CSToolbarModel.groupLabel(label) ?? "")
    .focusable()
    .focused($toolbarFocused)
    .onChange(of: toolbarFocused) { isFocused in if isFocused { keysArmed = true } }
    .onExitCommand { if open { open = false } }
    .csRovingKeys { key in moveToolbar(key, actionable: actionable) }
    .background(CSLegacyRovingKeys(active: csLegacyRovingActive(focused: toolbarFocused, armed: keysArmed), onResign: { keysArmed = false }) { key, _ in
      moveToolbar(key, actionable: actionable)
    })
    if open && !extra.isEmpty {
      let screen = CSContextMenuModel.screenSize()
      let box = CSFloatingRect(left: anchor.minX, top: anchor.minY, right: anchor.maxX, bottom: anchor.maxY, width: anchor.width, height: anchor.height)
      let viewport = CSFloatingRect(left: 8, top: 8, right: max(8, screen.width - 8), bottom: max(8, screen.height - 8), width: 0, height: 0)
      let place = CSToolbarModel.placement(placement)
      let placed = naturalSize.flatMap { natural in
        fittedSize.flatMap { fitted in
          CSToolbarModel.shift(anchor: box, naturalWidth: natural.width, naturalHeight: natural.height, fittedWidth: fitted.width, fittedHeight: fitted.height, viewport: viewport, originX: Double(panelOrigin?.x ?? anchor.minX), originY: Double(panelOrigin?.y ?? anchor.maxY), scaleX: Double(panelScale.width), scaleY: Double(panelScale.height), placement: place)
        }
      }
      VStack(alignment: .leading) {
        ForEach(Array(extra.enumerated()), id: \.offset) { _, item in
          CSTriggerButton(item) { open = false; onSelect(item) }
            .frame(minHeight: 44, alignment: .leading)
        }
      }
      .frame(maxWidth: placed.map { CGFloat($0.maxWidth) }, maxHeight: placed.map { CGFloat($0.maxHeight) }, alignment: .leading)
      .background(GeometryReader { geo in
        let frame = geo.frame(in: .global)
        let scaleX = geo.size.width > 0 ? frame.width / geo.size.width : 1
        let scaleY = geo.size.height > 0 ? frame.height / geo.size.height : 1
        Color.clear.preference(key: CSToolbarPanelKey.self, value: CSToolbarMeasure(size: geo.size, pass: measurePass, origin: frame.origin, scale: CGSize(width: scaleX == 0 ? 1 : scaleX, height: scaleY == 0 ? 1 : scaleY)))
      })
      .offset(x: CGFloat(placed?.x ?? 0), y: CGFloat(placed?.y ?? 0))
      .opacity(placed == nil ? 0 : 1)
      .accessibilityHidden(placed == nil)
    }
    }
    .onPreferenceChange(CSToolbarAnchorKey.self) { frame in
      if frame.width > 0, frame.height > 0 { anchor = frame }
    }
    .onPreferenceChange(CSToolbarPanelKey.self) { measure in
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

  private func moveToolbar(_ key: CSRovingKey, actionable: [Int]) -> Bool {
    guard !actionable.isEmpty else { return false }
    let position = actionable.firstIndex(of: focus) ?? 0
    let next: Int
    switch key {
    case .right:
      next = CSToolbarModel.toolbarMove(current: position, count: actionable.count, delta: 1)
    case .left:
      next = CSToolbarModel.toolbarMove(current: position, count: actionable.count, delta: -1)
    case .home:
      next = 0
    case .end:
      next = actionable.count - 1
    case .up, .down, .pageUp, .pageDown:
      return false
    }
    focus = actionable[next]
    return true
  }
}

private struct CSToolbarMeasure: Equatable {
  var size: CGSize
  var pass: Int
  var origin: CGPoint
  var scale: CGSize
}

private struct CSToolbarAnchorKey: PreferenceKey {
  static var defaultValue = CGRect.zero
  static func reduce(value: inout CGRect, nextValue: () -> CGRect) { value = nextValue() }
}

private struct CSToolbarPanelKey: PreferenceKey {
  static var defaultValue = CSToolbarMeasure(size: .zero, pass: 0, origin: .zero, scale: CGSize(width: 1, height: 1))
  static func reduce(value: inout CSToolbarMeasure, nextValue: () -> CSToolbarMeasure) { value = nextValue() }
}
