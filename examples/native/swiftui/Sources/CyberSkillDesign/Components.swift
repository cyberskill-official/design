import SwiftUI

public enum CSButtonRole {
  case primary
  case danger
}

public enum CSControlMode {
  public static func pack(dark: Bool, highContrast: Bool, compact: Bool) -> CSTokenModePack {
    let scheme: CSColorScheme = dark ? .dark : .light
    let theme: CSTheme = dark ? .dark : .light
    return try! CSModes.resolve(
      theme: theme,
      colorScheme: scheme,
      element: nil,
      variant: nil,
      density: compact ? .compact : .comfortable,
      contrast: highContrast ? .high : .standard,
      style: .liquidGlass
    )
  }
}

extension CSDimension {
  public var points: CGFloat {
    CGFloat(unit == .rem ? value * 16 : value)
  }
}

extension CSColorValue {
  public var color: Color {
    let channels = colorSpace == .srgb ? components : CSColorValue.oklabToSrgb(components)
    return Color(red: channels[0], green: channels[1], blue: channels[2], opacity: alpha)
  }

  static func oklabToSrgb(_ lab: [Double]) -> [Double] {
    let L = lab[0], a = lab[1], b = lab[2]
    let l_ = L + 0.3963377774 * a + 0.2158037573 * b
    let m_ = L - 0.1055613458 * a - 0.0638541728 * b
    let s_ = L - 0.0894841775 * a - 1.2914855480 * b
    let l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_
    let linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ]
    return linear.map { channel in
      let clamped = min(1, max(0, channel))
      return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * pow(clamped, 1 / 2.4) - 0.055
    }
  }
}

public struct CSButton: View {
  let title: String
  let role: CSButtonRole
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  var paddingX: CGFloat?
  var paddingY: CGFloat?
  let action: () -> Void

  public init(title: String, role: CSButtonRole = .primary, dark: Bool, highContrast: Bool, compact: Bool, paddingX: CGFloat? = nil, paddingY: CGFloat? = nil, action: @escaping () -> Void) {
    self.title = title
    self.role = role
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.paddingX = paddingX
    self.paddingY = paddingY
    self.action = action
  }

  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let fill = (role == .primary ? pack.componentButtonPrimaryBg : pack.colorSemanticDanger).color
    let ink = (role == .primary ? pack.componentButtonPrimaryFg : pack.colorTextInverse).color
    let restore = { ownerFocused = true }
    Button(action: {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }) {
      Text(title)
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity)
        .padding(.horizontal, paddingX ?? pack.componentButtonMdPaddingX.points)
        .padding(.vertical, paddingY ?? pack.componentButtonMdPaddingY.points)
        .frame(minHeight: pack.componentButtonMdMinHeight.points)
        .foregroundStyle(ink)
        .background(fill)
        .clipShape(RoundedRectangle(cornerRadius: pack.componentButtonRadius.points))
    }
    .buttonStyle(.plain)
    .focused($ownerFocused)
    .accessibilityLabel(title)
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public enum CSTextFieldModel {
  public static func showsError(_ error: String?) -> Bool {
    if let error { return !error.isEmpty }
    return false
  }
  public static func isAlert(_ error: String?) -> Bool { showsError(error) }
}

public struct CSTextField: View {
  let label: String
  @Binding var text: String
  public let error: String?
  let secure: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool

  public init(label: String, text: Binding<String>, secure: Bool = false, dark: Bool, highContrast: Bool, compact: Bool, error: String? = nil) {
    self.label = label
    _text = text
    self.error = error
    self.secure = secure
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
        .font(.system(size: 13, weight: .semibold))
        .foregroundStyle(pack.colorTextPrimary.color)
      field
        .textFieldStyle(.plain)
        .padding(.horizontal, pack.componentTextfieldPaddingX.points)
        .padding(.vertical, pack.componentTextfieldPaddingY.points)
        .frame(minHeight: pack.componentTextfieldMinHeight.points)
        .background(pack.colorSurfacePanel.color)
        .overlay(
          RoundedRectangle(cornerRadius: pack.radiusSm.points)
            .stroke(pack.componentTextfieldBorderDefault.color, lineWidth: 1)
        )
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
      if CSTextFieldModel.isAlert(error), let error {
        Text(error).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
  }

  private var typed: Binding<String> {
    Binding(get: { text }, set: { next in
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
      text = next
    })
  }

  @ViewBuilder private var field: some View {
    if secure {
      SecureField("••••••••", text: typed).focused($focused).accessibilityLabel(label)
    } else {
      TextField(label, text: typed).focused($focused).accessibilityLabel(label)
    }
  }
}

public struct CSTextButton: View {
  let title: String
  let role: CSButtonRole
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  var expand: Bool
  let action: () -> Void

  public init(title: String, role: CSButtonRole = .primary, dark: Bool, highContrast: Bool, compact: Bool, expand: Bool = false, action: @escaping () -> Void) {
    self.title = title
    self.role = role
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.expand = expand
    self.action = action
  }

  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let ink = (role == .danger ? pack.colorSemanticDangerText : pack.colorLink).color
    let restore = { ownerFocused = true }
    Button(action: {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }) {
      Text(title)
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: expand ? .infinity : nil, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
        .frame(minWidth: expand ? nil : pack.componentButtonMdMinHeight.points)
        .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .focused($ownerFocused)
    .foregroundStyle(ink)
    .accessibilityLabel(title)
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public enum CSBadgeModel {
  public static let trackingEm = 0.04
  public static let fontSize = 12.0
  public static func toneClass(_ name: String) -> String? { name == "neutral" ? nil : name }
  public static func spoken(_ label: String) -> String { label }
  public static func variant(_ name: String) -> String {
    switch name {
    case "solid", "ochre", "success", "danger", "warning", "info": return name
    default: return "neutral"
    }
  }
}

public struct CSBadge: View {
  let label: String
  let variant: String
  let dot: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(label: String, variant: String = "neutral", dot: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.variant = variant
    self.dot = dot
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let tone = CSBadgeModel.variant(variant)
    let fill = tone == "solid" ? pack.colorBrandUmber : tone == "ochre" ? pack.colorBrandOchre : tone == "success" ? pack.colorSemanticSuccess : tone == "danger" ? pack.colorSemanticDanger : tone == "warning" ? pack.colorSemanticWarning : tone == "info" ? pack.colorSemanticInfo : pack.colorSurfaceRaised
    let ink = tone == "solid" ? pack.colorTextInverse : tone == "ochre" ? pack.colorBrandUmber : tone == "success" ? pack.colorSemanticSuccessFg : tone == "danger" ? pack.colorSemanticDangerFg : tone == "warning" ? pack.colorSemanticWarningFg : tone == "info" ? pack.colorSemanticInfoFg : pack.colorTextAccent
    HStack(spacing: 5) {
      if dot { Circle().fill(ink.color).frame(width: 7, height: 7).accessibilityHidden(true) }
      Text(label).textCase(.uppercase).tracking(CSBadgeModel.fontSize * CSBadgeModel.trackingEm).accessibilityLabel(CSBadgeModel.spoken(label))
    }
    .font(.system(size: 12, weight: .bold))
    .foregroundStyle(ink.color)
    .padding(.horizontal, 9)
    .padding(.vertical, 4)
    .background(fill.color)
    .overlay { if tone == "neutral" { RoundedRectangle(cornerRadius: pack.radiusFull.points).stroke(pack.colorBorderDefault.color, lineWidth: 1) } }
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusFull.points))
  }
}

public enum CSDividerModel {
  public static func showsLabel(_ label: CSPresenceValue) -> Bool { label.shown }
  public static func text(_ label: CSPresenceValue) -> String {
    switch label {
    case .text(let value): return value
    case .zero: return "0"
    case .absent: return ""
    }
  }
  public static func orientation(vertical: Bool) -> String { vertical ? "vertical" : "horizontal" }
}

public struct CSDivider: View {
  public let label: CSPresenceValue
  public let vertical: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(label: CSPresenceValue = .absent, vertical: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.vertical = vertical
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSDividerModel.text(label)
    if CSDividerModel.showsLabel(label) {
      HStack(spacing: 12) {
        Rectangle().fill(pack.colorBorderDefault.color).frame(height: 1)
        Text(spoken).font(.footnote).foregroundStyle(pack.mutedColor)
        Rectangle().fill(pack.colorBorderDefault.color).frame(height: 1)
      }
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(spoken)
    } else if vertical {
      Rectangle()
        .fill(pack.colorBorderDefault.color)
        .frame(width: 1, height: 16)
        .accessibilityLabel(CSDividerModel.orientation(vertical: true))
    } else {
      Rectangle()
        .fill(pack.colorBorderDefault.color)
        .frame(maxWidth: .infinity)
        .frame(height: 1)
        .accessibilityLabel(CSDividerModel.orientation(vertical: false))
    }
  }
}

public struct CSListRow: View {
  let title: String
  let subtitle: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(title: String, subtitle: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.title = title
    self.subtitle = subtitle
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack {
      VStack(alignment: .leading, spacing: 4) {
        Text(title)
          .font(.system(size: 15, weight: .semibold))
          .foregroundStyle(pack.colorTextPrimary.color)
          .fixedSize(horizontal: false, vertical: true)
        CSBadge(label: subtitle, dark: dark, highContrast: highContrast, compact: compact)
      }
      Spacer()
      Circle().fill(pack.colorBrandOchre.color).frame(width: 10, height: 10)
    }
    .padding(14)
    .background(pack.colorSurfacePanel.color)
  }
}

public enum CSSelectModel {
  public static let placeholderDefault = "Select…"
  public static func placeholderText(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func showsPrompt(placeholder: String?, hasContent: Bool) -> Bool { placeholder != nil || !hasContent }
  public static func shownText(value: String, placeholder: String?, fallback: String, hasContent: Bool) -> String {
    if !value.isEmpty { return value }
    if showsPrompt(placeholder: placeholder, hasContent: hasContent) { return placeholderText(placeholder, fallback: fallback) }
    return value
  }
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
}

public struct CSSelect<Selection: Hashable, Content: View>: View {
  let label: String
  let value: String
  @Binding var selection: Selection
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let descriptionText: String?
  public let errorText: String?
  public let placeholder: String?
  public let disabled: Bool
  public let language: String?
  let content: () -> Content
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, value: String, selection: Binding<Selection>, dark: Bool, highContrast: Bool, compact: Bool, description: String? = nil, error: String? = nil, placeholder: String? = nil, disabled: Bool = false, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.value = value
    _selection = selection
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.descriptionText = description
    self.errorText = error
    self.placeholder = placeholder
    self.disabled = disabled
    self.language = language
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let prompt = CSSelectModel.copy("placeholder", language: spoken)
    let shown = CSSelectModel.shownText(value: value, placeholder: placeholder, fallback: prompt, hasContent: true)
    VStack(alignment: .leading, spacing: 4) {
      if CSPresenceValue.text(label).shown { Text(label).foregroundStyle(pack.primaryTextColor) }
      if let descriptionText, CSPresenceValue.text(descriptionText).shown {
        Text(descriptionText).foregroundStyle(pack.mutedColor)
      }
      Menu {
        Picker(label, selection: Binding(get: { selection }, set: { next in
          if disabled { return }
          CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
          selection = next
        })) { content() }
      } label: {
        HStack {
          Text(shown)
            .foregroundStyle(pack.colorTextPrimary.color)
            .frame(maxWidth: .infinity, alignment: .leading)
          CSIcon(name: "chevron-down", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .accessibilityHidden(true)
            .allowsHitTesting(false)
        }
      }
      .disabled(disabled)
      .accessibilityLabel(CSPresenceValue.text(label).shown ? label : "")
      .accessibilityValue(shown)
      .focused($focused)
      .onChange(of: focused) { isFocused in
        if isFocused && !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      }
      .simultaneousGesture(TapGesture().onEnded {
        if !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      })
      if let errorText, CSPresenceValue.text(errorText).shown {
        Text(errorText).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
  }
}

public struct CSCard<Content: View>: View {
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  var spacing: CGFloat
  var padding: CGFloat
  let content: () -> Content

  public init(dark: Bool, highContrast: Bool, compact: Bool, spacing: CGFloat = 0, padding: CGFloat = 0, @ViewBuilder content: @escaping () -> Content) {
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.spacing = spacing
    self.padding = padding
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    VStack(alignment: .leading, spacing: spacing) { content() }
      .padding(padding)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(pack.colorSurfacePanel.color)
      .clipShape(RoundedRectangle(cornerRadius: pack.radiusLg.points))
      .overlay(RoundedRectangle(cornerRadius: pack.radiusLg.points).stroke(pack.colorBorderDefault.color, lineWidth: 1))
  }
}

extension CSTokenModePack {
  public var pageColor: Color { colorSurfacePage.color }
  public var borderColor: Color { colorBorderDefault.color }
  public var mutedColor: Color { colorTextMuted.color }
  public var primaryTextColor: Color { colorTextPrimary.color }
}

public enum CSSwitchModel {
  public static let labelDefault = "Setting"
  public static func showsLabel(_ label: String?) -> Bool {
    guard let label else { return false }
    return !label.isEmpty
  }
  public static func named(label: String?, ariaLabel: String?, labelledBy: String?) -> Bool {
    showsLabel(label) || showsLabel(ariaLabel) || showsLabel(labelledBy)
  }
  public static func switchName(label: String?, ariaLabel: String?, labelledBy: String?, fallback: String) -> String? {
    if let ariaLabel { return ariaLabel }
    if named(label: label, ariaLabel: nil, labelledBy: labelledBy) { return nil }
    return fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Cài đặt"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSSwitch: View {
  let title: String
  let disabled: Bool
  let ariaLabel: String?
  let labelledBy: String?
  @Binding var isOn: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String, isOn: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, disabled: Bool = false, ariaLabel: String? = nil, labelledBy: String? = nil, language: String? = nil) {
    self.title = title
    self.disabled = disabled
    self.ariaLabel = ariaLabel
    self.labelledBy = labelledBy
    _isOn = isOn
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let name = CSSwitchModel.switchName(label: title, ariaLabel: ariaLabel, labelledBy: labelledBy, fallback: CSSwitchModel.copy("label", language: spoken))
    Toggle(isOn: Binding(get: { isOn }, set: { next in
      if disabled { return }
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
      isOn = next
    })) {
      if CSSwitchModel.showsLabel(title) { Text(title) }
    }
    .foregroundStyle(pack.colorTextPrimary.color)
    .tint(pack.colorBrandOchre.color)
    .focused($focused)
    .onChange(of: focused) { isFocused in
      if isFocused && !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
    }
    .disabled(disabled)
    .accessibilityLabel(name ?? title)
  }
}

public enum CSDialogModel {
  public static let closeDefault = "Close"
  public static let maxWidthRem = 42.0
  public static func maxWidth(root: Double = 16) -> Double { maxWidthRem * root }
  public static func closeText(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["close": "Đóng", "confirm": "Xác nhận", "cancel": "Hủy"],
      "en": ["close": closeDefault, "confirm": "Confirm", "cancel": "Cancel"],
      "ja": ["close": "閉じる", "confirm": "確認", "cancel": "キャンセル"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func showsClose(hasOpenChange: Bool, hasClose: Bool) -> Bool { hasOpenChange || hasClose }
  public static func showsActions(_ actions: String?) -> Bool {
    guard let actions else { return false }
    return !actions.isEmpty
  }
  public static func describedBy(explicit: String?, hasExplicit: Bool, hasBody: Bool, bodyId: String) -> String? {
    if hasExplicit {
      guard let explicit, !explicit.isEmpty else { return nil }
      return explicit
    }
    return hasBody ? bodyId : nil
  }
  public static func notify(hasOpenChange: Bool, hasClose: Bool) -> [String] {
    var events: [String] = []
    if hasOpenChange { events.append("open-false") }
    if hasClose { events.append("close") }
    return events
  }
}

public struct CSDialog: View {
  public let title: String
  public let message: String
  public let confirmTitle: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onConfirm: () -> Void
  @Binding var open: Bool
  let onOpenChange: ((Bool) -> Void)?
  let onClose: (() -> Void)?
  let closeLabel: String?
  public let language: String?
  let onRestore: (() -> Void)?
  let layerId: String
  let layers: [CSOverlayLayer]
  @FocusState private var trap: Int?
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var restoreId: String? = nil
  @State private var closeFocusId = UUID().uuidString

  public init(title: String, message: String, confirmTitle: String, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void) {
    self.title = title
    self.message = message
    self.confirmTitle = confirmTitle
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onConfirm = onConfirm
    _open = .constant(true)
    self.onOpenChange = nil
    self.onClose = nil
    self.closeLabel = nil
    self.language = nil
    self.onRestore = nil
    let id = CSOverlayStack.freshId("dialog")
    self.layerId = id
    self.layers = CSOverlayStack.solo(id)
  }

  public init(title: String, message: String, confirmTitle: String, open: Binding<Bool>, closeLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void, onOpenChange: ((Bool) -> Void)? = nil, onClose: (() -> Void)? = nil, onRestore: (() -> Void)? = nil, layerId: String? = nil, layers: [CSOverlayLayer]? = nil, language: String? = nil) {
    self.title = title
    self.message = message
    self.confirmTitle = confirmTitle
    _open = open
    self.closeLabel = closeLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onConfirm = onConfirm
    self.onOpenChange = onOpenChange
    self.onClose = onClose
    self.language = language
    self.onRestore = onRestore
    let id = layerId ?? CSOverlayStack.freshId("dialog")
    self.layerId = id
    self.layers = layers ?? CSOverlayStack.solo(id)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let canClose = CSDialogModel.showsClose(hasOpenChange: onOpenChange != nil, hasClose: onClose != nil)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let stops = (canClose ? 1 : 0) + (CSDialogModel.showsActions(confirmTitle) ? 1 : 0)
    if open {
      ZStack {
        if canClose {
          Color.black.opacity(0.42)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .contentShape(Rectangle())
            .onTapGesture(perform: close)
            .accessibilityHidden(true)
        }
        VStack(alignment: .leading, spacing: 12) {
          HStack {
            Text(title).font(.system(size: 20, weight: .bold)).foregroundStyle(pack.colorTextPrimary.color)
            Spacer()
            if canClose {
              Button(action: {
                CSFocusRegistry.shared.claim(id: closeFocusId, restore: { trap = 0 })
                close()
              }) {
                CSIcon(name: "close", label: "", dark: dark, highContrast: highContrast, compact: compact)
                  .frame(minWidth: 44, minHeight: 44)
              }
              .accessibilityLabel(CSDialogModel.closeText(closeLabel, fallback: CSDialogModel.copy("close", language: spoken)))
              .focused($trap, equals: 0)
            }
          }
          if !message.isEmpty {
            Text(message).foregroundStyle(pack.colorTextMuted.color)
          }
          if CSDialogModel.showsActions(confirmTitle) {
            CSButton(title: confirmTitle, dark: dark, highContrast: highContrast, compact: compact, action: onConfirm)
              .focused($trap, equals: canClose ? 1 : 0)
          }
        }
        .padding(24)
        .frame(maxWidth: CSDialogModel.maxWidth())
        .background(pack.colorSurfacePanel.color)
        .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.isModal)
        .accessibilityLabel(title)
        .onAppear {
          restoreId = CSFocusRegistry.shared.activeId
          CSOverlayRegistry.shared.push(id: layerId)
          trap = CSFocusTrap.initialIndex(preferred: nil, count: stops)
        }
        .onDisappear { CSOverlayRegistry.shared.remove(id: layerId) }
        .csTabTrap { shift in
          let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
          guard CSOverlayStack.ownsFocus(id: layerId, layers: stack) else { return false }
          let next = CSFocusTrap.nextIndex(current: trap ?? -1, count: stops, shift: shift, inside: trap != nil)
          trap = CSModalFocus.pullBack(inside: next != nil) ? CSFocusTrap.initialIndex(preferred: nil, count: stops) : next
          return stops > 0
        }
      }
    }
  }

  private func close() {
    let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
    open = false
    onOpenChange?(false)
    onClose?()
    CSFocusReturn.perform(savedId: restoreId, onRestore: onRestore, layerId: layerId, layers: stack)
    CSOverlayRegistry.shared.remove(id: layerId)
  }
}
